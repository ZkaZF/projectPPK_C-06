<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facility_types', function (Blueprint $table) {
            $table->id('fac_type_id');
            $table->string('fac_type_name', 30)->unique();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facility_types');
    }
};
