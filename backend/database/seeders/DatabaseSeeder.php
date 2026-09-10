<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        # roles
        DB::table('roles')->insert([
            ['role_name' => 'pengguna'],
            ['role_name' => 'petugas'],
            ['role_name' => 'admin'],
        ]);

        # user statuses
        DB::table('user_statuses')->insert([
            ['u_status_name' => 'pending'],
            ['u_status_name' => 'active'],
            ['u_status_name' => 'rejected'],
        ]);

        # facility types
        DB::table('facility_types')->insert([
            ['fac_type_name' => 'ruang_kelas'],
            ['fac_type_name' => 'aula'],
            ['fac_type_name' => 'laboratorium'],
            ['fac_type_name' => 'alat'],
            ['fac_type_name' => 'lapangan'],
        ]);

        # facility statuses
        DB::table('facility_statuses')->insert([
            ['fac_status_name' => 'aktif'],
            ['fac_status_name' => 'dalam_perbaikan'],
            ['fac_status_name' => 'nonaktif'],
        ]);

        # reservation statuses
        DB::table('reservation_statuses')->insert([
            ['res_status_name' => 'pending'],
            ['res_status_name' => 'approved'],
            ['res_status_name' => 'rejected'],
            ['res_status_name' => 'cancelled'],
        ]);

        # report categories
        DB::table('report_categories')->insert([
            ['rep_cat_name' => 'kerusakan_ringan'],
            ['rep_cat_name' => 'kerusakan_berat'],
            ['rep_cat_name' => 'kebersihan'],
            ['rep_cat_name' => 'keamanan'],
            ['rep_cat_name' => 'lainnya'],
        ]);

        # report statuses
        DB::table('report_statuses')->insert([
            ['rep_status_name' => 'baru'],
            ['rep_status_name' => 'diproses'],
            ['rep_status_name' => 'selesai'],
            ['rep_status_name' => 'ditolak'],
        ]);

        # initial users
        DB::table('users')->insert([
            [
                'full_name' => 'System Admin',
                'email' => 'admin@kampus.ac.id',
                'user_password' => Hash::make('password123'),
                'role_id' => 3, // admin
                'nim_nip' => '198501012010011001',
                'u_stat_id' => 2, // active
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'full_name' => 'Petugas Fasilitas',
                'email' => 'petugas@kampus.ac.id',
                'user_password' => Hash::make('password123'),
                'role_id' => 2, // petugas
                'nim_nip' => '199002022015022002',
                'u_stat_id' => 2, // active
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'full_name' => 'Mahasiswa Test',
                'email' => 'user@kampus.ac.id',
                'user_password' => Hash::make('password123'),
                'role_id' => 1, // pengguna
                'nim_nip' => '24060122120001',
                'u_stat_id' => 2, // active
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}