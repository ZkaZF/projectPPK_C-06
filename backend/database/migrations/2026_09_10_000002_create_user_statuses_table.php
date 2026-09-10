<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_statuses', function (Blueprint $table) {
            $table->id('u_stat_id');
            $table->string('u_status_name', 30)->unique();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_statuses');
    }
};