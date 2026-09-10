<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facilities', function (Blueprint $table) {
            $table->id('fac_id');
            $table->string('fac_name', 150);
            $table->foreignId('fac_type_id')->constrained('facility_types', 'fac_type_id');
            $table->string('fac_location', 200);
            $table->integer('fac_capacity')->nullable();
            $table->text('fac_description')->nullable();
            $table->foreignId('fac_stat_id')->default(1)->constrained('facility_statuses', 'fac_stat_id');
            $table->string('fac_image', 255)->nullable();
            $table->timestamps();

            $table->index('fac_type_id', 'idx_facilities_type');
            $table->index('fac_stat_id', 'idx_facilities_status');
            $table->index('fac_location', 'idx_facilities_location');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};