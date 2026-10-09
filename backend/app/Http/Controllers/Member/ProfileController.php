<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * GET /api/v1/member/profile
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load('membership');
        return response()->json($this->profileResponse($user));
    }

    /**
     * PATCH /api/v1/member/profile
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'                 => ['sometimes', 'string', 'max:255'],
            'phone'                => ['sometimes', 'nullable', 'string', 'max:30'],
            'photo_url'            => ['sometimes', 'nullable', 'url', 'max:2048'],
            'gender'               => ['sometimes', 'nullable', 'string', 'in:male,female,other'],
            'birthdate'            => ['sometimes', 'nullable', 'date'],
            'height_cm'            => ['sometimes', 'nullable', 'numeric', 'min:50', 'max:300'],
            'weight_kg'            => ['sometimes', 'nullable', 'numeric', 'min:20', 'max:500'],
            'body_type'            => ['sometimes', 'nullable', 'string'],
            'fitness_level'        => ['sometimes', 'nullable', 'string'],
            'fitness_goal'         => ['sometimes', 'nullable', 'string'],
            'training_type'        => ['sometimes', 'nullable', 'string'],
            'days_per_week'        => ['sometimes', 'nullable', 'integer', 'between:1,7'],
            'daily_calorie_target' => ['sometimes', 'nullable', 'integer', 'min:500', 'max:10000'],
            'is_profile_completed' => ['sometimes', 'boolean'],
        ]);

        $user->update($validated);
        $user->load('membership');

        return response()->json($this->profileResponse($user));
    }

    /**
     * Build the canonical profile response shape.
     */
    private function profileResponse($user): array
    {
        $membership = $user->membership;

        return [
            'id'                   => $user->id,
            'name'                 => $user->name,
            'email'                => $user->email,
            'phone'                => $user->phone,
            'photo_url'            => $user->photo_url,
            'must_change_password' => (bool) $user->must_change_password,
            'gender'               => $user->gender,
            'birthdate'            => $user->birthdate ? $user->birthdate->format('Y-m-d') : null,
            'height_cm'            => $user->height_cm !== null ? (float) $user->height_cm : null,
            'weight_kg'            => $user->weight_kg !== null ? (float) $user->weight_kg : null,
            'body_type'            => $user->body_type,
            'fitness_level'        => $user->fitness_level,
            'fitness_goal'         => $user->fitness_goal,
            'training_type'        => $user->training_type,
            'days_per_week'        => $user->days_per_week !== null ? (int) $user->days_per_week : null,
            'daily_calorie_target' => $user->daily_calorie_target !== null ? (int) $user->daily_calorie_target : null,
            'is_profile_completed' => (bool) $user->is_profile_completed,
            'membership'           => $membership ? [
                'id'         => $membership->external_id ?? 'mem_' . $membership->id,
                'tier'       => $membership->tier,
                'status'     => $membership->status,
                'expires_at' => $membership->expires_at
                    ? $membership->expires_at->toIso8601String()
                    : null,
            ] : null,
            'created_at' => $user->created_at->toIso8601String(),
            'updated_at' => $user->updated_at->toIso8601String(),
        ];
    }
}
