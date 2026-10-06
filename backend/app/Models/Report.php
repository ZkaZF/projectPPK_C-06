<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Services\SupabaseStorage;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * Report
 *
 * Represents a damage or issue report filed by a user for a specific facility.
 * Contains the description, an optional photo (stored in Supabase Storage),
 * and tracks the report's lifecycle through a status lookup table.
 */
class Report extends Model
{
    use HasFactory;

    /** Custom primary key column name (not the default "id"). */
    protected $primaryKey = 'rep_id';

    /** Columns that may be mass-assigned. */
    protected $fillable = [
        'user_id',
        'fac_id',
        'rep_cat_id',
        'rep_description',
        'rep_photo',       // stores the relative path only (e.g. "reports/uuid.jpg")
        'rep_stat_id',
        'handled_by',
        'rep_resolution_note',
    ];

    /**
     * Extra attributes appended to the model's JSON output.
     * rep_photo_url is computed from rep_photo and always included in API responses.
     */
    protected $appends = ['rep_photo_url'];

    /**
     * Computed attribute: full public URL of the report photo from Supabase Storage.
     *
     * Resolves the relative path stored in rep_photo into a full, browser-accessible URL.
     * Returns null if no photo was attached to this report.
     *
     * Example: "reports/uuid.jpg" → "https://xyz.supabase.co/storage/v1/object/public/images/reports/uuid.jpg"
     */
    protected function repPhotoUrl(): Attribute
    {
        return Attribute::get(fn () => app(SupabaseStorage::class)->publicUrl($this->rep_photo));
    }

    // ─── Main table relations ─────────────────────────────────────────────────

    /**
     * The user who filed this report.
     * FK: user_id → users.user_id
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * The facility this report is filed against.
     * FK: fac_id → facilities.fac_id
     */
    public function facility()
    {
        return $this->belongsTo(Facility::class, 'fac_id', 'fac_id');
    }

    /**
     * The staff member (petugas/admin) handling this report.
     * FK: handled_by → users.user_id — nullable until a staff member picks it up.
     */
    public function handler()
    {
        return $this->belongsTo(User::class, 'handled_by', 'user_id');
    }

    // ─── Lookup table relations ───────────────────────────────────────────────

    /**
     * The category of this report (e.g. kerusakan_ringan, kerusakan_berat, kebersihan).
     * FK: rep_cat_id → report_categories.rep_cat_id
     */
    public function category()
    {
        return $this->belongsTo(ReportCategory::class, 'rep_cat_id', 'rep_cat_id');
    }

    /**
     * The current lifecycle status of this report (baru, diproses, selesai, ditolak).
     * FK: rep_stat_id → report_statuses.rep_stat_id
     */
    public function reportStatus()
    {
        return $this->belongsTo(ReportStatus::class, 'rep_stat_id', 'rep_stat_id');
    }
}
