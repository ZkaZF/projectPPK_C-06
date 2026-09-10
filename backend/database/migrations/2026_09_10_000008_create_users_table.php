<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('full_name', 100);
            $table->string('email', 150)->unique();
            $table->string('user_password', 255);
            $table->foreignId('role_id')->default(1)->constrained('roles', 'role_id');
            $table->string('nim_nip', 30)->nullable();
            $table->foreignId('u_stat_id')->default(1)->constrained('user_statuses', 'u_stat_id');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};