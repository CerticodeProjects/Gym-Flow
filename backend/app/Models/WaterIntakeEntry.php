<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaterIntakeEntry extends Model
{
    protected $fillable = [
        'user_id',
        'amount_ml',
        'logged_at',
        'date_key',
    ];

    protected function casts(): array
    {
        return [
            'amount_ml' => 'integer',
            'logged_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
