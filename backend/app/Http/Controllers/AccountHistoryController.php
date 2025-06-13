<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class AccountHistoryController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->input('user_id');
        if (!$userId) {
            return response()->json(['error' => 'ID de usuario requerido'], 400);
        }
        $user = DB::table('users')->where('id', $userId)->first(['username']);
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $start = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))->startOfDay()
            : Carbon::now()->subMonth()->startOfDay();

        $end = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))->endOfDay()
            : Carbon::now()->endOfDay();

        $order = $request->input('order', 'desc');

        $spendTransactions = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'spend')
            ->whereBetween('created_at', [$start, $end])
            ->orderBy('created_at', $order)
            ->get();

        $sessionsCount = DB::table('sessions')
            ->join('games', 'sessions.game_id', '=', 'games.id')
            ->select('games.name', DB::raw('COUNT(sessions.id) as plays'))
            ->where('sessions.user_id', $userId)
            ->whereBetween('started_at', [$start, $end])
            ->groupBy('games.name')
            ->get();

        $sessionsDetail = DB::table('sessions')
            ->join('games', 'sessions.game_id', '=', 'games.id')
            ->select(
                'sessions.id',
                'games.name as game_name',
                'sessions.bet_amount',
                'sessions.win_amount',
                'sessions.started_at'
            )
            ->where('sessions.user_id', $userId)
            ->whereBetween('sessions.started_at', [$start, $end])
            ->orderBy(
                $order === 'asc' ? 'sessions.bet_amount' : 'sessions.started_at',
                $order
            )
            ->get();

        return response()->json([
            'user_name' => $user->username,
            'spend_transactions' => $spendTransactions,
            'sessions_count' => $sessionsCount,
            'sessions_detail' => $sessionsDetail,
            'start_date' => $start->toDateString(),
            'end_date' => $end->toDateString(),
            'order' => $order,
        ]);
    }
}
