<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacilitySeeder extends Seeder
{
    public function run(): void
    {
        // Bersihkan data lama agar tidak duplikat saat seeder dijalankan ulang
        DB::statement('SET session_replication_role = replica;'); // disable FK constraint sementara (PostgreSQL)
        DB::table('facilities')->truncate();
        DB::statement('SET session_replication_role = DEFAULT;');

        $facilities = [
            // 1. Ruang Kelas (fac_type_id = 1)
            [
                'fac_name' => 'Ruang A301',
                'fac_type_id' => 1,
                'fac_location' => 'Gedung A, Lantai 3',
                'fac_capacity' => 40,
                'fac_description' => 'Ruang kelas reguler dengan fasilitas proyektor, AC, dan papan tulis pintar.',
                'fac_stat_id' => 1, // Aktif
                'fac_image' => 'https://placehold.co/600x400?text=Ruang+A301',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'fac_name' => 'Ruang A303',
                'fac_type_id' => 1,
                'fac_location' => 'Gedung A, Lantai 3',
                'fac_capacity' => 50,
                'fac_description' => 'Ruang kelas kapasitas besar dengan 2 proyektor.',
                'fac_stat_id' => 1, // Aktif
                'fac_image' => 'https://placehold.co/600x400?text=Ruang+A303',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'fac_name' => 'Ruang Teater F102',
                'fac_type_id' => 1,
                'fac_location' => 'Gedung F, Lantai 1',
                'fac_capacity' => 120,
                'fac_description' => 'Ruang kuliah dengan tata letak kursi bertingkat (teater).',
                'fac_stat_id' => 1, // Aktif
                'fac_image' => 'https://placehold.co/600x400?text=Teater+F102',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // 2. Aula (fac_type_id = 2)
            [
                'fac_name' => 'Auditorium Utama',
                'fac_type_id' => 2,
                'fac_location' => 'Gedung Rektorat',
                'fac_capacity' => 500,
                'fac_description' => 'Aula besar untuk acara seminar nasional, wisuda, atau konferensi. Dilengkapi sound system standar konser.',
                'fac_stat_id' => 1, // Aktif
                'fac_image' => 'https://placehold.co/600x400?text=Auditorium',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'fac_name' => 'Aula Serbaguna FSM',
                'fac_type_id' => 2,
                'fac_location' => 'Gedung FSM',
                'fac_capacity' => 200,
                'fac_description' => 'Cocok untuk kegiatan workshop atau pentas seni skala sedang.',
                'fac_stat_id' => 2, // Dalam Perbaikan
                'fac_image' => 'https://placehold.co/600x400?text=Aula+FSM',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // 3. Laboratorium (fac_type_id = 3)
            [
                'fac_name' => 'Lab Komputer Dasar',
                'fac_type_id' => 3,
                'fac_location' => 'Gedung Lab Bersama, Lantai 1',
                'fac_capacity' => 30,
                'fac_description' => 'Dilengkapi dengan 30 PC (Core i5, 8GB RAM) dan internet berkecepatan tinggi.',
                'fac_stat_id' => 1, // Aktif
                'fac_image' => 'https://placehold.co/600x400?text=Lab+Komputer',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'fac_name' => 'Lab Jaringan',
                'fac_type_id' => 3,
                'fac_location' => 'Gedung Lab Bersama, Lantai 2',
                'fac_capacity' => 20,
                'fac_description' => 'Lab khusus praktikum jaringan dengan perangkat router, switch, dan server mandiri.',
                'fac_stat_id' => 3, // Nonaktif
                'fac_image' => 'https://placehold.co/600x400?text=Lab+Jaringan',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // 4. Alat (fac_type_id = 4)
            [
                'fac_name' => 'Proyektor Portable Epson',
                'fac_type_id' => 4,
                'fac_location' => 'Ruang TU Akademik',
                'fac_capacity' => null, // Alat tidak punya kapasitas orang
                'fac_description' => 'Proyektor ringan untuk keperluan presentasi di luar ruang kelas.',
                'fac_stat_id' => 1, // Aktif
                'fac_image' => 'https://placehold.co/600x400?text=Proyektor',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // 5. Lapangan (fac_type_id = 5)
            [
                'fac_name' => 'Lapangan Basket Indoor',
                'fac_type_id' => 5,
                'fac_location' => 'Student Center',
                'fac_capacity' => 150, // Kapasitas tribun
                'fac_description' => 'Lapangan basket dengan lantai vinyl standar internasional. Buka sampai jam 8 malam.',
                'fac_stat_id' => 1, // Aktif
                'fac_image' => 'https://placehold.co/600x400?text=Lapangan+Basket',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'fac_name' => 'Lapangan Futsal',
                'fac_type_id' => 5,
                'fac_location' => 'Kompleks Olahraga',
                'fac_capacity' => 50,
                'fac_description' => 'Lapangan futsal rumput sintetis semi-outdoor.',
                'fac_stat_id' => 1, // Aktif
                'fac_image' => 'https://placehold.co/600x400?text=Lapangan+Futsal',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Hapus data lama agar tidak duplikat saat dijalankan berkali-kali (opsional)
        // DB::table('facilities')->truncate(); 

        DB::table('facilities')->insert($facilities);
    }
}
