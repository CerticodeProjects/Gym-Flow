<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionEntry extends Model
{
    protected $fillable = [
        'user_id',
        'food_name',
        'calories',
        'protein_g',
        'carbs_g',
        'fat_g',
        'serving_size',
        'meal_type',
        'source',
        'barcode',
        'logged_at',
        'date_key',
    ];

    protected function casts(): array
    {
        return [
            'calories'  => 'integer',
            'protein_g' => 'float',
            'carbs_g'   => 'float',
            'fat_g'     => 'float',
            'logged_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
