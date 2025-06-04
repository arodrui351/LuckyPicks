<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\User;

class TransactionController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:bet,win,bonus,refund,spend',
            'amount' => 'required|integer',
        ]);

        $user = User::findOrFail($request->user_id);

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'type' => $request->type,
            'amount' => $request->amount,
        ]);

        return response()->json([
            'message' => 'Transacción registrada con éxito.',
            'balance' => $user->balance,
            'transaction' => $transaction,
        ]);
    }
}
