<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('username', 50)->unique();
            $table->string('email', 100)->unique();
            $table->string('password');
            $table->integer('balance')->default(0);
            $table->string('verification_code', 10)->nullable();
            $table->dateTime('code_expires_at')->nullable();
            $table->dateTime('banned_until')->nullable();
            $table->string('role')->default('user');
            $table->timestamps();
        });

        DB::table('users')->insert([
            'username' => 'Bertin',
            'email' => 'arodrui351@g.educaand.es',
            'password' => Hash::make('arodrui351@g.educaand.es'),
            'role' => 'Admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
