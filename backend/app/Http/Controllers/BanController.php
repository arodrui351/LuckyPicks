<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;

class BanController extends Controller
{
    public function checkBan(Request $request)
    {
        $request->validate([
            'userId' => 'required|integer|exists:users,id',
        ]);

        $user = User::find($request->userId);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if (!$user->banned_until) {
            return response()->json(['banned' => false]);
        }

        $now = Carbon::now();
        $bannedUntil = Carbon::parse($user->banned_until);

        $diffInSeconds = $bannedUntil->diffInSeconds($now, false);

        // Si quedan menos o igual a 60 segundos o ya pasó la fecha de baneo
        if ($diffInSeconds <= 60) {
            // Quitar baneo
            $user->banned_until = null;
            $user->save();

            return response()->json(['banned' => false]);
        }

        return response()->json(['banned' => true]);
    }
}
