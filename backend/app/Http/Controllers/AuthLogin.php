<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class AuthLogin extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user->api_token = Str::random(80);
        $user->save();

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'role' => $user->role,
            'balance' => $user->balance,
            'banned_until' => $user->banned_until,
            'api_token' => $user->api_token,
        ]);
    }
}
