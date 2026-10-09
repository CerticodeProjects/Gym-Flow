<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nutrition_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('food_name');
            $table->integer('calories');
            $table->decimal('protein_g', 6, 2)->default(0);
            $table->decimal('carbs_g', 6, 2)->default(0);
            $table->decimal('fat_g', 6, 2)->default(0);
            $table->string('serving_size')->nullable();
            $table->string('meal_type')->default('snack'); // breakfast, lunch, dinner, snack
            $table->string('source')->default('manual'); // manual, barcode, ai_scanner
            $table->string('barcode')->nullable();
            $table->timestamp('logged_at');
            $table->string('date_key', 10); // e.g. '2026-10-07'
            $table->timestamps();

            $table->index(['user_id', 'date_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nutrition_entries');
    }
};
