import { useEffect, useState } from "react";
import { LayoutDashboard, Building2, User, ShieldCheck, Ticket, FolderKanban } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getFacilitiesApi } from "../../api/facilities";

// ── Tipe data ───────────────────────────────────────────────
interface FacilitySummary {
  total: number;
  active: number;
  maintenance: number;
}

// ── Kartu ringkasan ──────────────────────────────────────────
const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) => (
  <div
    style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "24px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      boxShadow: "var(--shadow-sm)",
      transition: "box-shadow 0.2s",
    }}
    onMouseEnter={(e) =>
      ((e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xl)")
    }
    onMouseLeave={(e) =>
      ((e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)")
    }
  >
    <div
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: color + "20",
        color: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={22} />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </p>
      <p style={{ margin: "4px 0 0", fontSize: "1.6rem", fontWeight: 700, color: "var(--text-h)" }}>
        {value}
      </p>
    </div>
  </div>
);

// ── Halaman Utama ────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const [facilitySummary, setFacilitySummary] = useState<FacilitySummary>({
    total: 0,
    active: 0,
    maintenance: 0,
  });
  const [loadingFacility, setLoadingFacility] = useState(true);
  const [facilityError, setFacilityError] = useState<string | null>(null);

  // Ambil summary fasilitas dari GET /api/facilities
  useEffect(() => {
    const fetchFacilitySummary = async () => {
      try {
        const res = await getFacilitiesApi();
        // Response: { data: Facility[] } atau nested { data: { data: Facility[] } }
        const facilities: any[] = res.data?.data ?? res.data ?? [];

        const active = facilities.filter(
          (f) => f.status?.fac_status_name?.toLowerCase() === "aktif"
        ).length;
        const maintenance = facilities.filter((f) =>
          f.status?.fac_status_name?.toLowerCase().includes("perbaikan")
        ).length;

        setFacilitySummary({ total: facilities.length, active, maintenance });
      } catch (err) {
        setFacilityError("Gagal memuat data fasilitas.");
      } finally {
        setLoadingFacility(false);
      }
    };

    fetchFacilitySummary();
  }, []);

  const roleName = user?.role?.role_name ?? "-";
  const statusName = user?.user_status?.u_status_name ?? "-";

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const isActive =
    statusName.toLowerCase() === "active" ||
    statusName.toLowerCase() === "aktif";

  return (
    <div style={{ padding: "32px", maxWidth: "1140px", margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "10px",
          background: "var(--primary-bg)", color: "var(--primary-dark)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "var(--text-h)" }}>
            Dashboard
          </h1>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>
            {greeting()}, <strong>{user?.full_name ?? "..."}</strong>! Berikut ringkasan aktivitas hari ini.
          </p>
        </div>
      </div>

      {/* ── Kartu Info Akun ── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        marginBottom: "28px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
        boxShadow: "var(--shadow-sm)",
      }}>
        {/* Avatar inisial */}
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "var(--primary)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem", fontWeight: 700, flexShrink: 0,
        }}>
          {user?.full_name?.[0]?.toUpperCase() ?? "?"}
        </div>

        {/* Info teks */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-h)" }}>
            {user?.full_name ?? "-"}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {user?.email ?? "-"} &nbsp;·&nbsp; NIM/NIP: {user?.nim_nip ?? "-"}
          </p>
        </div>

        {/* Badge role & status */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "6px 14px", borderRadius: "999px",
            background: "var(--primary-bg)", color: "var(--primary-dark)",
            fontSize: "0.8rem", fontWeight: 600,
          }}>
            <User size={13} /> {roleName}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "6px 14px", borderRadius: "999px",
            background: isActive ? "#d1fae520" : "#fef3c720",
            color: isActive ? "#059669" : "#d97706",
            fontSize: "0.8rem", fontWeight: 600,
          }}>
            <ShieldCheck size={13} /> {statusName}
          </span>
        </div>
      </div>

      {/* ── Kartu Ringkasan ── */}
      <h2 style={{
        fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)",
        marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.07em",
      }}>
        Ringkasan Fasilitas Kampus
      </h2>

      {facilityError && (
        <div style={{
          padding: "12px 16px", background: "#fee2e220", color: "#dc2626",
          borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem",
          border: "1px solid #fee2e2",
        }}>
          {facilityError}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        gap: "16px",
        marginBottom: "32px",
      }}>
        <StatCard icon={Building2} label="Total Fasilitas"   value={loadingFacility ? "..." : facilitySummary.total}       color="#6366f1" />
        <StatCard icon={Building2} label="Fasilitas Aktif"   value={loadingFacility ? "..." : facilitySummary.active}      color="#10b981" />
        <StatCard icon={Building2} label="Dalam Perbaikan"   value={loadingFacility ? "..." : facilitySummary.maintenance} color="#f59e0b" />
        <StatCard icon={Ticket}    label="Reservasi Aktif"   value="—"                                                      color="#3b82f6" />
        <StatCard icon={FolderKanban} label="Laporan Saya"   value="—"                                                      color="#ec4899" />
      </div>

      {/* ── Placeholder aktivitas terbaru ── */}
      <div style={{
        background: "var(--surface)",
        border: "1px dashed var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "40px",
        textAlign: "center",
        color: "var(--text-muted)",
      }}>
        <LayoutDashboard size={40} style={{ opacity: 0.1, marginBottom: "12px" }} />
        <p style={{ fontWeight: 500, color: "var(--text-h)", margin: 0 }}>
          Aktivitas Terbaru
        </p>
        <p style={{ fontSize: "0.9rem", marginTop: "8px", lineHeight: 1.6 }}>
          Riwayat reservasi dan laporan akan muncul di sini setelah fitur Fase 4 &amp; 5 selesai dikembangkan.
        </p>
      </div>

    </div>
  );
}
