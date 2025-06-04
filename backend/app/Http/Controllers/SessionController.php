<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Session;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class SessionController extends Controller
{
    

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'game_id' => 'required|exists:games,id',
            'bet_amount' => 'required|integer|min:0',
            'win_amount' => 'required|integer|min:0',
            'ended_at' => 'nullable|date',
        ]);

        $session = Session::create([
            'user_id' => $validated['user_id'],
            'game_id' => $validated['game_id'],
            'bet_amount' => $validated['bet_amount'],
            'win_amount' => $validated['win_amount'],
            'ended_at' => $validated['ended_at'] ?? null,
        ]);

        return response()->json($session, 201);
    }
    public function topWins()
    {
        $topWins = DB::table('sessions')
            ->join('users', 'sessions.user_id', '=', 'users.id')
            ->select('users.username', 'sessions.win_amount')
            ->orderByDesc('sessions.win_amount')
            ->limit(10)
            ->get();

        return response()->json($topWins);
    }


}
