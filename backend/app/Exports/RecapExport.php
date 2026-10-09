<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class RecapExport implements FromCollection, WithHeadings
{
    protected $from;
    protected $to;

    public function __construct($from = null, $to = null)
    {
        $this->from = $from;
        $this->to = $to;
    }

    public function collection()
    {
        $reservationsQuery = DB::table('reservations')
            ->select('fac_id', 'res_stat_id', DB::raw('count(*) as total'));
        
        $reportsQuery = DB::table('reports')
            ->select('fac_id', DB::raw('count(*) as total'));

        if ($this->from) {
            $reservationsQuery->whereDate('created_at', '>=', $this->from);
            $reportsQuery->whereDate('created_at', '>=', $this->from);
        }
        if ($this->to) {
            $reservationsQuery->whereDate('created_at', '<=', $this->to);
            $reportsQuery->whereDate('created_at', '<=', $this->to);
        }

        $reservations = $reservationsQuery->groupBy('fac_id', 'res_stat_id')->get();
        $reports = $reportsQuery->groupBy('fac_id')->get();

        $facilities = DB::table('facilities')->get();

        $recap = [];
        foreach ($facilities as $fac) {
            $facId = $fac->fac_id;
            
            $facReservations = $reservations->where('fac_id', $facId);
            
            $recap[] = [
                'facility_name' => $fac->fac_name,
                'total_reservations' => (int) $facReservations->sum('total'),
                'approved' => (int) $facReservations->where('res_stat_id', 2)->sum('total'),
                'rejected' => (int) $facReservations->where('res_stat_id', 3)->sum('total'),
                'cancelled' => (int) $facReservations->where('res_stat_id', 4)->sum('total'),
                'total_reports' => (int) ($reports->where('fac_id', $facId)->first()->total ?? 0),
            ];
        }

        return collect($recap);
    }

    public function headings(): array
    {
        return [
            'Nama Fasilitas',
            'Total Reservasi',
            'Disetujui',
            'Ditolak',
            'Dibatalkan',
            'Total Laporan Kerusakan',
        ];
    }
}
