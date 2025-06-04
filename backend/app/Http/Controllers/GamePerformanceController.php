<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GamePerformanceController extends Controller
{
    public function index(Request $request)
    {
        // Fechas por defecto: el último mes
        $start = $request->input('start_date') 
            ? date('Y-m-d 00:00:00', strtotime($request->input('start_date')))
            : now()->subMonth()->startOfDay();

        $end = $request->input('end_date') 
            ? date('Y-m-d 23:59:59', strtotime($request->input('end_date')))
            : now()->endOfDay();

        // Rentabilidad y número de sesiones por juego
        $performance = DB::table('sessions')
            ->select(
                'games.name as game',
                DB::raw('SUM(sessions.bet_amount) as total_bet'),
                DB::raw('SUM(sessions.win_amount) as total_win'),
                DB::raw('COUNT(*) as sessions_count'),
                DB::raw('ROUND(SUM(sessions.win_amount) - SUM(sessions.bet_amount), 2) as profit')
            )
            ->join('games', 'sessions.game_id', '=', 'games.id')
            ->whereBetween('sessions.created_at', [$start, $end])
            ->groupBy('sessions.game_id', 'games.name')
            ->get();

        $intervalMinutes = 15; // Intervalo de 15 minutos

        // Intervalo más activo por juego (intervalos de 15 minutos)
        $topIntervals = DB::table('sessions')
            ->select(
                'games.name as game',
                DB::raw('HOUR(sessions.created_at) as hour'),
                DB::raw('FLOOR(MINUTE(sessions.created_at) / ' . $intervalMinutes . ') as `interval`'),
                DB::raw('COUNT(*) as plays')
            )
            ->join('games', 'sessions.game_id', '=', 'games.id')
            ->whereBetween('sessions.created_at', [$start, $end])
            ->groupBy('games.name', 'hour', DB::raw('`interval`'))
            ->orderBy('plays', 'desc')
            ->get()
            ->groupBy('game')
            ->map(function ($rows) use ($intervalMinutes) {
                $top = $rows->first();

                $startMinute = $top->interval * $intervalMinutes;
                $endMinute = $startMinute + $intervalMinutes - 1;

                $range = sprintf(
                    '%02d:%02d - %02d:%02d',
                    $top->hour+2,
                    $startMinute,
                    $top->hour+2,
                    $endMinute
                );

                return [
                    'game' => $top->game,
                    'plays' => $top->plays,
                    'range' => $range,
                ];
            })
            ->values();

        return response()->json([
            'performance' => $performance,
            'top_intervals' => $topIntervals,
        ]);
    }
}
