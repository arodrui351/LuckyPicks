<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    protected $fillable = [
        'user_id', 'game_id', 'bet_amount', 'win_amount', 'ended_at',
    ];

}
