<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('water_intake_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('amount_ml');
            $table->timestamp('logged_at');
            $table->string('date_key', 10); // e.g. '2026-10-07'
            $table->timestamps();

            $table->index(['user_id', 'date_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('water_intake_entries');
    }
};
