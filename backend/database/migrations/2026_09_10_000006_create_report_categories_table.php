<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('report_categories', function (Blueprint $table) {
            $table->id('rep_cat_id');
            $table->string('rep_cat_name', 30)->unique();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_categories');
    }
};