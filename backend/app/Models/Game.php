<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = ['id', 'name', 'description'];
}