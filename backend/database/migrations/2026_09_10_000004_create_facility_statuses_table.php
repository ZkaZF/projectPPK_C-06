<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facility_statuses', function (Blueprint $table) {
            $table->id('fac_stat_id');
            $table->string('fac_status_name', 20)->unique();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facility_statuses');
    }
};