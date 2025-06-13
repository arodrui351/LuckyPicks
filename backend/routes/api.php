<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthLogin;
use App\Http\Controllers\UserBalance;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\GamePerformanceController;
use App\Http\Controllers\BanController;
use App\Http\Controllers\AccountHistoryController;

// Rutas protegidas con el token de inicio de sesion
Route::middleware('auth.token')->group(function () {
    Route::get('/top-wins', [SessionController::class, 'topWins']);
    Route::post('/account/history', [AccountHistoryController::class, 'index']);
    Route::post('/check-ban', [BanController::class, 'checkBan']);
    Route::get('/games/performance', [GamePerformanceController::class, 'index']);
    Route::post('/sessions', [SessionController::class, 'store']);
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::post('/transaction', [TransactionController::class, 'create']);
    Route::post('/update-balance', [UserBalance::class, 'updateBalance']);
});

// Rutas públicas (sin autenticación)
Route::middleware('guest')->post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthLogin::class, 'login']);
