<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserBalance extends Controller
{

    public function updateBalance(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:users,id',
            'amount' => 'required|integer',
        ]);

        $user = User::findOrFail($request->id);

        if ($user->balance + $request->amount < 0) {
            $user->balance = 0;
            $user->save();
            return response()->json([
                'message' => 'Balance actualizado correctamente.',
                'balance' => $user->balance,
            ]);
        }

        $user->balance += $request->amount;
        $user->save();

        return response()->json([
            'message' => 'Balance actualizado correctamente.',
            'balance' => $user->balance,
        ]);
    }
}