<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function makeMember(array $override = []): User
    {
        return User::factory()->create(array_merge([
            'role'                 => 'member',
            'must_change_password' => false,
        ], $override));
    }

    // ── Login ────────────────────────────────────────────────────────────

    public function test_login_returns_token_and_user_shape(): void
    {
        $user = $this->makeMember(['password' => bcrypt('Password123!')]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email'    => $user->email,
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'name', 'role'],
            ])
            ->assertJsonPath('user.role', 'member');
    }

    public function test_login_wrong_password_returns_401(): void
    {
        $user = $this->makeMember();

        $this->postJson('/api/v1/auth/login', [
            'email'    => $user->email,
            'password' => 'wrong-password',
        ])->assertStatus(401)
          ->assertJsonPath('message', 'These credentials do not match our records.');
    }

    public function test_login_missing_fields_returns_422(): void
    {
        $this->postJson('/api/v1/auth/login', [])
            ->assertStatus(422)
            ->assertJsonStructure(['message', 'errors']);
    }

    // ── 401 on expired / invalid token ──────────────────────────────────

    public function test_expired_token_returns_401(): void
    {
        $user = $this->makeMember();

        // No token — simulate expired/missing
        $this->getJson('/api/v1/member/profile')
            ->assertStatus(401);
    }

    // ── Forgot password ──────────────────────────────────────────────────

    public function test_forgot_password_always_returns_200(): void
    {
        $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'nonexistent@example.com',
        ])->assertStatus(200)
          ->assertJsonPath('message', 'If an account exists with this email, password reset instructions have been sent.');
    }

    // ── Change password ──────────────────────────────────────────────────

    public function test_change_password_clears_must_change_password_flag(): void
    {
        $user = $this->makeMember([
            'password'             => bcrypt('OldPass123!'),
            'must_change_password' => true,
        ]);

        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/v1/auth/change-password', [
                'current_password'          => 'OldPass123!',
                'new_password'              => 'NewPass456!',
                'new_password_confirmation' => 'NewPass456!',
            ])
            ->assertStatus(200)
            ->assertJsonPath('message', 'Password has been successfully updated.');

        $user->refresh();
        $this->assertFalse((bool) $user->must_change_password);
    }

    public function test_change_password_wrong_current_returns_422(): void
    {
        $user  = $this->makeMember(['password' => bcrypt('CorrectPass123!')]);
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/v1/auth/change-password', [
                'current_password'          => 'WrongPass!',
                'new_password'              => 'NewPass456!',
                'new_password_confirmation' => 'NewPass456!',
            ])
            ->assertStatus(422);
    }

    // ── Google OAuth ──────────────────────────────────────────────────────

    public function test_google_login_creates_new_member_and_returns_token(): void
    {
        $response = $this->postJson('/api/v1/auth/google', [
            'email'     => 'brand.new.google@gymflow.test',
            'name'      => 'Google Newbie',
            'google_id' => 'google-oauth-sub-12345',
            'photo_url' => 'https://example.com/avatar.jpg',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'name', 'role', 'email'],
            ])
            ->assertJsonPath('user.role', 'member')
            ->assertJsonPath('user.email', 'brand.new.google@gymflow.test');

        $this->assertDatabaseHas('users', [
            'email'     => 'brand.new.google@gymflow.test',
            'google_id' => 'google-oauth-sub-12345',
        ]);
    }

    public function test_google_login_existing_user_returns_token(): void
    {
        $existing = $this->makeMember([
            'email' => 'existing.google@gymflow.test',
            'name'  => 'Existing Google User',
        ]);

        $response = $this->postJson('/api/v1/auth/google', [
            'email'     => 'existing.google@gymflow.test',
            'google_id' => 'google-oauth-sub-67890',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('user.id', $existing->id)
            ->assertJsonPath('user.email', 'existing.google@gymflow.test');

        $existing->refresh();
        $this->assertEquals('google-oauth-sub-67890', $existing->google_id);
    }

    public function test_google_login_missing_email_returns_422(): void
    {
        $response = $this->postJson('/api/v1/auth/google', []);

        $response->assertStatus(422)
            ->assertJsonStructure(['message']);
    }
}

