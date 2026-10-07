import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ClipboardList, Wrench, ShieldCheck, ArrowRight } from "lucide-react";
// @ts-ignore
import { getReservationsApi } from "../../api/reservations";
// @ts-ignore
import { getReportsApi } from "../../api/reports";

export default function OfficerDashboardPage() {
  const { user } = useAuth();
  const [pendingReservations, setPendingReservations] = useState<number | "-">("-");
  const [pendingReports, setPendingReports] = useState<number | "-">("-");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueueStats = async () => {
      setLoading(true);
      try {
        const [resResv, resRep] = await Promise.all([
          getReservationsApi(),
          getReportsApi()
        ]);
        
        const reservations = resResv.data.data ?? resResv.data ?? [];
        setPendingReservations(reservations.filter((r: any) => 
          r.status?.res_status_name?.toLowerCase() === 'pending'
        ).length);

        const reports = resRep.data.data ?? resRep.data ?? [];
        setPendingReports(reports.filter((r: any) => 
          r.status?.rep_status_name?.toLowerCase() === 'baru'
        ).length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueStats();
  }, []);

  return (
    <div style={{ padding: "32px", maxWidth: "1140px", margin: "0 auto" }} className="animate-fade-in">
      
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "16px",
          background: "var(--primary-bg)", color: "var(--primary-dark)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <ShieldCheck size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-h)", margin: 0 }}>
            Dashboard Petugas
          </h1>
          <p style={{ margin: "4px 0 0", color: "var(--text)", fontSize: "0.95rem" }}>
            Halo, <strong style={{ color: "var(--text-h)" }}>{user?.full_name}</strong>. Anda memiliki antrian yang perlu diproses.
          </p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
        marginBottom: "32px",
      }}>
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "24px",
          boxShadow: "var(--shadow-sm)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              background: "var(--primary-bg)", color: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <ClipboardList size={24} />
            </div>
            {loading ? (
              <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-muted)" }}>...</span>
            ) : (
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-h)", lineHeight: 1 }}>
                {pendingReservations}
              </span>
            )}
          </div>
          <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 600, color: "var(--text-h)" }}>
            Antrian Reservasi
          </h3>
          <p style={{ margin: "0 0 16px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Reservasi yang perlu diverifikasi atau ditolak.
          </p>
          <Link to="/officer/reservations" style={{
            display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", fontWeight: 600,
            color: "var(--primary)", textDecoration: "none"
          }}>
            Proses Antrian <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "24px",
          boxShadow: "var(--shadow-sm)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              background: "var(--primary-bg)", color: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Wrench size={24} />
            </div>
            {loading ? (
              <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-muted)" }}>...</span>
            ) : (
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-h)", lineHeight: 1 }}>
                {pendingReports}
              </span>
            )}
          </div>
          <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 600, color: "var(--text-h)" }}>
            Laporan Kerusakan
          </h3>
          <p style={{ margin: "0 0 16px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Laporan baru yang perlu ditindaklanjuti.
          </p>
          <Link to="/officer/reports" style={{
            display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", fontWeight: 600,
            color: "var(--primary)", textDecoration: "none"
          }}>
            Tindak Lanjut <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
