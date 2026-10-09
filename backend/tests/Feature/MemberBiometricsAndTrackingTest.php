<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MemberBiometricsAndTrackingTest extends TestCase
{
    use RefreshDatabase;

    private function makeMember(): User
    {
        return User::factory()->create([
            'role'                 => 'member',
            'must_change_password' => false,
        ]);
    }

    public function test_patch_profile_updates_biometrics_and_onboarding(): void
    {
        $user = $this->makeMember();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)->patchJson('/api/v1/member/profile', [
            'gender'               => 'female',
            'birthdate'            => '1998-06-15',
            'height_cm'            => 165.5,
            'weight_kg'            => 58.2,
            'body_type'            => 'athletic',
            'fitness_level'        => 'intermediate',
            'fitness_goal'         => 'build_muscle',
            'training_type'        => 'hypertrophy',
            'days_per_week'        => 4,
            'daily_calorie_target' => 2400,
            'is_profile_completed' => true,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('gender', 'female')
            ->assertJsonPath('birthdate', '1998-06-15')
            ->assertJsonPath('height_cm', 165.5)
            ->assertJsonPath('weight_kg', 58.2)
            ->assertJsonPath('body_type', 'athletic')
            ->assertJsonPath('fitness_goal', 'build_muscle')
            ->assertJsonPath('is_profile_completed', true);

        $user->refresh();
        $this->assertEquals('female', $user->gender);
        $this->assertEquals(165.5, $user->height_cm);
        $this->assertEquals(58.2, $user->weight_kg);
        $this->assertTrue((bool) $user->is_profile_completed);
    }

    public function test_water_tracking_endpoints(): void
    {
        $user = $this->makeMember();
        $token = $user->createToken('test')->plainTextToken;

        // Log 250ml
        $postRes = $this->withToken($token)->postJson('/api/v1/member/water', [
            'amount_ml' => 250,
            'date_key'  => '2026-10-07',
        ]);
        $postRes->assertStatus(201)
            ->assertJsonPath('amount_ml', 250);

        // Log 500ml
        $this->withToken($token)->postJson('/api/v1/member/water', [
            'amount_ml' => 500,
            'date_key'  => '2026-10-07',
        ])->assertStatus(201);

        // Fetch daily total
        $getRes = $this->withToken($token)->getJson('/api/v1/member/water?date_key=2026-10-07');
        $getRes->assertStatus(200)
            ->assertJsonPath('total_ml', 750)
            ->assertJsonCount(2, 'entries');
    }

    public function test_nutrition_tracking_endpoints(): void
    {
        $user = $this->makeMember();
        $token = $user->createToken('test')->plainTextToken;

        // Log Chicken Breast
        $postRes = $this->withToken($token)->postJson('/api/v1/member/nutrition', [
            'food_name'    => 'Grilled Chicken Breast',
            'calories'     => 330,
            'protein_g'    => 62.0,
            'carbs_g'      => 0.0,
            'fat_g'        => 7.5,
            'meal_type'    => 'lunch',
            'date_key'     => '2026-10-07',
        ]);
        $postRes->assertStatus(201)
            ->assertJsonPath('food_name', 'Grilled Chicken Breast');

        $entryId = $postRes->json('id');

        // Fetch daily summary
        $getRes = $this->withToken($token)->getJson('/api/v1/member/nutrition?date_key=2026-10-07');
        $getRes->assertStatus(200)
            ->assertJsonPath('total_calories', 330)
            ->assertJsonPath('total_protein_g', 62)
            ->assertJsonCount(1, 'entries');

        // Delete entry
        $this->withToken($token)->deleteJson("/api/v1/member/nutrition/{$entryId}")
            ->assertStatus(200);

        $afterDelete = $this->withToken($token)->getJson('/api/v1/member/nutrition?date_key=2026-10-07');
        $afterDelete->assertJsonPath('total_calories', 0)
            ->assertJsonCount(0, 'entries');
    }
}
