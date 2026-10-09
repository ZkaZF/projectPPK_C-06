<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecapController extends Controller
{
    /**
     * Get recap statistics for each facility
     */
    public function index(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');

        // Build base queries with date filters
        $reservationsQuery = DB::table('reservations')
            ->select('fac_id', 'res_stat_id', DB::raw('count(*) as total'));
        
        $reportsQuery = DB::table('reports')
            ->select('fac_id', DB::raw('count(*) as total'));

        if ($from) {
            $reservationsQuery->whereDate('created_at', '>=', $from);
            $reportsQuery->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $reservationsQuery->whereDate('created_at', '<=', $to);
            $reportsQuery->whereDate('created_at', '<=', $to);
        }

        $reservations = $reservationsQuery->groupBy('fac_id', 'res_stat_id')->get();
        $reports = $reportsQuery->groupBy('fac_id')->get();

        $facilities = DB::table('facilities')->get();

        $recap = [];
        foreach ($facilities as $fac) {
            $facId = $fac->fac_id;
            
            // Calculate reservation stats
            $facReservations = $reservations->where('fac_id', $facId);
            $totalRes = $facReservations->sum('total');
            $approved = $facReservations->where('res_stat_id', 2)->sum('total'); // 2 = approved
            $rejected = $facReservations->where('res_stat_id', 3)->sum('total'); // 3 = rejected
            $cancelled = $facReservations->where('res_stat_id', 4)->sum('total'); // 4 = cancelled

            // Calculate report stats
            $facReports = $reports->where('fac_id', $facId)->first();
            $totalRep = $facReports ? $facReports->total : 0;

            $recap[] = [
                'facility_name' => $fac->fac_name,
                'total_reservations' => $totalRes,
                'approved' => $approved,
                'rejected' => $rejected,
                'cancelled' => $cancelled,
                'total_reports' => $totalRep,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $recap
        ]);
    }

    /**
     * Export recap to CSV or Excel
     */
    public function export(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');
        $format = $request->query('format', 'csv'); // csv, xlsx, pdf

        $fileName = 'rekapitulasi.' . $format;
        
        $writerType = \Maatwebsite\Excel\Excel::CSV;
        if ($format === 'xlsx') {
            $writerType = \Maatwebsite\Excel\Excel::XLSX;
        } elseif ($format === 'pdf') {
            $writerType = \Maatwebsite\Excel\Excel::DOMPDF;
        }

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\RecapExport($from, $to), 
            $fileName,
            $writerType
        );
    }
}
