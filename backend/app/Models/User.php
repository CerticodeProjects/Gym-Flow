<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'google_id',
        'password',
        'role',
        'phone',
        'photo_url',
        'must_change_password',
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
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at'    => 'datetime',
            'password'             => 'hashed',
            'must_change_password' => 'boolean',
            'birthdate'            => 'date',
            'height_cm'            => 'float',
            'weight_kg'            => 'float',
            'days_per_week'        => 'integer',
            'daily_calorie_target' => 'integer',
            'is_profile_completed' => 'boolean',
        ];
    }

    public function membership()
    {
        return $this->hasOne(Membership::class);
    }

    public function preferences()
    {
        return $this->hasOne(MemberPreference::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function progressEntries()
    {
        return $this->hasMany(ProgressEntry::class);
    }

    public function sessionBookings()
    {
        return $this->hasMany(SessionBooking::class);
    }

    public function waterIntakeEntries()
    {
        return $this->hasMany(WaterIntakeEntry::class);
    }

    public function nutritionEntries()
    {
        return $this->hasMany(NutritionEntry::class);
    }
}
