<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::select('id', 'username', 'email', 'balance', 'role', 'banned_until')->get();
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->has('balance')) {
            $user->balance = $request->balance;
        }

        if ($request->has('role')) {
            $user->role = $request->role;
        }

        if ($request->has('password') && $request->password !== null) {
            $user->password = Hash::make($request->password);
        }

        if ($request->has('banned_until')) {
            $user->banned_until = $request->banned_until;
        }

        $user->save();

        return response()->json(['message' => 'Usuario actualizado']);
    }
}
