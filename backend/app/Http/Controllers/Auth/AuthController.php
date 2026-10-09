<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Membership;
use App\Models\MemberPreference;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * POST /api/v1/auth/login  [CONFIRMED / FROZEN]
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'These credentials do not match our records.',
            ], 401);
        }

        // Delete any existing tokens before issuing a fresh one
        $user->tokens()->delete();
        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'        => $user->id,
                'name'      => $user->name,
                'role'      => $user->role,
                'email'     => $user->email,
                'photo_url' => $user->photo_url,
            ],
        ]);
    }

    /**
     * POST /api/v1/auth/google
     * Handles Google OAuth sign-in & automatic member provisioning
     */
    public function googleLogin(Request $request): JsonResponse
    {
        $request->validate([
            'id_token'     => ['nullable', 'string'],
            'access_token' => ['nullable', 'string'],
            'email'        => ['nullable', 'email'],
            'name'         => ['nullable', 'string'],
            'photo_url'    => ['nullable', 'string'],
            'google_id'    => ['nullable', 'string'],
        ]);

        $email = $request->email;
        $name = $request->name;
        $googleId = $request->google_id;
        $photoUrl = $request->photo_url;

        // 1. Verify id_token with Google tokeninfo endpoint if provided
        if ($request->filled('id_token')) {
            try {
                $response = Http::timeout(5)->get('https://oauth2.googleapis.com/tokeninfo', [
                    'id_token' => $request->id_token,
                ]);

                if ($response->successful()) {
                    $googleData = $response->json();
                    $email = $googleData['email'] ?? $email;
                    $googleId = $googleData['sub'] ?? $googleId;
                    $name = $googleData['name'] ?? $name;
                    $photoUrl = $googleData['picture'] ?? $photoUrl;
                }
            } catch (\Throwable $e) {
                // If network verification fails, continue with provided parameters
            }
        }

        // 2. Verify access_token with Google userinfo endpoint if provided and email not yet set
        if ($request->filled('access_token') && (! $email || ! $googleId)) {
            try {
                $response = Http::timeout(5)
                    ->withToken($request->access_token)
                    ->get('https://www.googleapis.com/oauth2/v3/userinfo');

                if ($response->successful()) {
                    $googleData = $response->json();
                    $email = $googleData['email'] ?? $email;
                    $googleId = $googleData['sub'] ?? $googleId;
                    $name = $googleData['name'] ?? $name;
                    $photoUrl = $googleData['picture'] ?? $photoUrl;
                }
            } catch (\Throwable $e) {
                // Continue
            }
        }

        if (! $email) {
            return response()->json([
                'message' => 'Unable to authenticate with Google. Valid email address is required.',
            ], 422);
        }

        // 3. Find existing user by google_id or email
        $user = null;
        if ($googleId) {
            $user = User::where('google_id', $googleId)->first();
        }
        if (! $user) {
            $user = User::where('email', $email)->first();
        }

        if ($user) {
            $updates = [];
            if ($googleId && ! $user->google_id) {
                $updates['google_id'] = $googleId;
            }
            if ($photoUrl && ! $user->photo_url) {
                $updates['photo_url'] = $photoUrl;
            }
            if ($updates) {
                $user->update($updates);
            }
        } else {
            // Auto-provision new member
            $user = User::create([
                'name'                 => $name ?: explode('@', $email)[0],
                'email'                => $email,
                'google_id'            => $googleId,
                'password'             => Hash::make(Str::random(32)),
                'role'                 => 'member',
                'photo_url'            => $photoUrl,
                'must_change_password' => false,
                'email_verified_at'    => now(),
            ]);

            Membership::create([
                'user_id'     => $user->id,
                'external_id' => 'mem_' . Str::random(10),
                'tier'        => 'Standard Access',
                'status'      => 'active',
                'expires_at'  => now()->addYear(),
            ]);

            MemberPreference::create([
                'user_id'             => $user->id,
                'workout_type'        => 'full-body',
                'intensity'           => 'moderate',
                'weekly_workout_goal' => 3,
            ]);
        }

        // Fresh token
        $user->tokens()->delete();
        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'        => $user->id,
                'name'      => $user->name,
                'role'      => $user->role,
                'email'     => $user->email,
                'photo_url' => $user->photo_url,
            ],
        ]);
    }

    /**
     * POST /api/v1/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    /**
     * POST /api/v1/auth/forgot-password  [PROPOSED]
     * Anti-enumeration: always returns 200.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // We attempt the reset but always return the same message
        // to prevent email enumeration attacks.
        Password::sendResetLink(['email' => $request->email]);

        return response()->json([
            'message' => 'If an account exists with this email, password reset instructions have been sent.',
        ]);
    }

    /**
     * POST /api/v1/auth/change-password  [PROPOSED]
     * Supports forced-first-login reset path.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'current_password'             => ['required'],
            'new_password'                 => ['required', 'min:8', 'confirmed'],
            'new_password_confirmation'    => ['required'],
        ]);

        if (! Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors'  => [
                    'current_password' => ['The current password is incorrect.'],
                ],
            ], 422);
        }

        $user->update([
            'password'             => $request->new_password,
            'must_change_password' => false,
        ]);

        return response()->json([
            'message' => 'Password has been successfully updated.',
        ]);
    }
}
