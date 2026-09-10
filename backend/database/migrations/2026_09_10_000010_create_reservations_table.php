<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id('res_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->foreignId('fac_id')->constrained('facilities', 'fac_id');
            $table->date('res_date');
            $table->time('res_start');
            $table->time('res_end');
            $table->text('res_purpose');
            $table->foreignId('res_stat_id')->default(1)->constrained('reservation_statuses', 'res_stat_id');
            $table->foreignId('processed_by')->nullable()->constrained('users', 'user_id');
            $table->text('res_cancel_reason')->nullable();
            $table->timestamps();

            $table->index(['fac_id', 'res_date'], 'idx_reservations_fac_date');
            $table->index('user_id', 'idx_reservations_user');
            $table->index('res_stat_id', 'idx_reservations_status');
        });

        # postgresql check constraints
        DB::statement("
            ALTER TABLE reservations 
            ADD CONSTRAINT chk_reservation_time 
            CHECK (res_start >= '07:00' AND res_end <= '20:00' AND res_start < res_end)
        ");

        DB::statement("
            ALTER TABLE reservations 
            ADD CONSTRAINT chk_reservation_minutes 
            CHECK (EXTRACT(MINUTE FROM res_start) IN (0, 30) AND EXTRACT(MINUTE FROM res_end) IN (0, 30))
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};