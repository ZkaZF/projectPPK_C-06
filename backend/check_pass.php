<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

$rows = DB::select('SELECT email, user_password FROM users');
foreach ($rows as $r) {
    $ok = Hash::check('password123', $r->user_password);
    echo $r->email . ': ' . ($ok ? 'OK ✓' : 'GAGAL ✗') . PHP_EOL;
    echo '  hash: ' . substr($r->user_password, 0, 30) . '...' . PHP_EOL;
}
