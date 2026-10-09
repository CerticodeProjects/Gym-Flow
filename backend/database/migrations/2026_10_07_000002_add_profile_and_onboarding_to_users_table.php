<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('gender')->nullable()->after('phone');
            $table->date('birthdate')->nullable()->after('gender');
            $table->decimal('height_cm', 5, 2)->nullable()->after('birthdate');
            $table->decimal('weight_kg', 5, 2)->nullable()->after('height_cm');
            $table->string('body_type')->nullable()->after('weight_kg'); // regular, athletic, stocky, slim
            $table->string('fitness_level')->nullable()->after('body_type'); // beginner, intermediate, advanced
            $table->string('fitness_goal')->nullable()->after('fitness_level'); // build_muscle, lose_fat, athletic, health
            $table->string('training_type')->nullable()->after('fitness_goal'); // hypertrophy, strength, endurance
            $table->unsignedTinyInteger('days_per_week')->nullable()->after('training_type');
            $table->unsignedInteger('daily_calorie_target')->nullable()->after('days_per_week');
            $table->boolean('is_profile_completed')->default(false)->after('daily_calorie_target');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'gender',
                'birthdate',
                'height_cm',
                'weight_kg',
                'body_type',
                'fitness_level',
                'fitness_goal',
                'training_type',
                'days_per_week',
                'daily_calorie_target',
                'is_profile_completed',
            ]);
        });
    }
};
