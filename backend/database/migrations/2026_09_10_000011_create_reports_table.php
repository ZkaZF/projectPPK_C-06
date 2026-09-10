<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id('rep_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->foreignId('fac_id')->constrained('facilities', 'fac_id');
            $table->foreignId('rep_cat_id')->constrained('report_categories', 'rep_cat_id');
            $table->text('rep_description');
            $table->string('rep_photo', 255)->nullable();
            $table->foreignId('rep_stat_id')->default(1)->constrained('report_statuses', 'rep_stat_id');
            $table->foreignId('handled_by')->nullable()->constrained('users', 'user_id');
            $table->text('rep_resolution_note')->nullable();
            $table->timestamps();

            $table->index('fac_id', 'idx_reports_fac');
            $table->index('user_id', 'idx_reports_user');
            $table->index('rep_stat_id', 'idx_reports_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};