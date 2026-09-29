import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LayoutDashboard, Ticket, FolderKanban, Users, ShieldCheck, Database, Building2 } from "lucide-react";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/public/LoginPage";
import { RegisterPage } from "./pages/public/RegisterPage";
import { ForbiddenPage } from "./pages/public/ForbiddenPage";
import HomePage from "./pages/public/HomePage";
import FacilityDetailPage from "./pages/public/FacilityDetailPage";

// ── Placeholder pages (ganti nanti dengan halaman asli) ──────────────────────
const DummyPage = ({ title, icon: Icon, desc }: { title: string, icon: any, desc: string }) => (
  <div style={{ padding: "32px", maxWidth: "1140px", margin: "0 auto" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
      <div style={{ 
        width: "48px", height: "48px", borderRadius: "10px", 
        background: "var(--primary-bg)", color: "var(--primary-dark)", 
        display: "flex", alignItems: "center", justifyContent: "center" 
      }}>
        <Icon size={24} />
      </div>
      <div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "var(--text-h)" }}>{title}</h1>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>{desc}</p>
      </div>
    </div>
    
    <div style={{ 
      background: "var(--surface)", 
      border: "1px solid var(--border)", 
      borderRadius: "var(--radius-lg)", 
      padding: "48px",
      minHeight: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "var(--shadow-xl)"
    }}>
      <div style={{ textAlign: "center", color: "var(--text-muted)", maxWidth: "400px" }}>
        <Icon size={56} style={{ opacity: 0.15, marginBottom: "20px" }} />
        <p style={{ fontWeight: 500, color: "var(--text-h)", fontSize: "1.1rem" }}>Modul "{title}" Belum Tersedia</p>
        <p style={{ fontSize: "0.9rem", marginTop: "8px", lineHeight: 1.6 }}>Halaman ini sedang dalam tahap pengembangan dan akan dirilis pada iterasi fitur berikutnya. Silakan gunakan navigasi di sebelah kiri untuk kembali.</p>
      </div>
    </div>
  </div>
);

const DashboardPage      = () => <DummyPage title="Dashboard" icon={LayoutDashboard} desc="Ringkasan aktivitas dan status fasilitas Anda hari ini." />;
const ReservationsPage   = () => <DummyPage title="Reservasi Saya" icon={Ticket} desc="Daftar reservasi yang sedang diajukan atau sudah disetujui." />;
const NewReservationPage = () => <DummyPage title="Ajukan Reservasi" icon={Ticket} desc="Formulir pengajuan peminjaman fasilitas baru." />;
const ReportsPage        = () => <DummyPage title="Laporan Saya" icon={FolderKanban} desc="Riwayat pelaporan kerusakan atau keluhan fasilitas." />;
const NewReportPage      = () => <DummyPage title="Buat Laporan" icon={FolderKanban} desc="Laporkan kendala fasilitas kepada petugas." />;

// Officer
const OfficerDashboardPage = () => <DummyPage title="Dashboard Petugas" icon={LayoutDashboard} desc="Ringkasan tugas dan antrian penanganan fasilitas." />;
const OfficerReservPage  = () => <DummyPage title="Antrian Reservasi" icon={Ticket} desc="Review dan persetujuan pengajuan reservasi masuk." />;
const OfficerReportPage  = () => <DummyPage title="Antrian Laporan" icon={FolderKanban} desc="Tindak lanjut laporan kerusakan dan keluhan." />;

// Admin
const AdminDashPage      = () => <DummyPage title="Dashboard Admin" icon={LayoutDashboard} desc="Kendali pusat seluruh aktivitas sistem kampus." />;
const AdminFacilPage     = () => <DummyPage title="Kelola Fasilitas" icon={Building2} desc="Tambah, edit, dan atur status fasilitas kampus." />;
const AdminUsersPage     = () => <DummyPage title="Kelola User" icon={Users} desc="Manajemen akun mahasiswa, dosen, dan petugas." />;
const AdminVerifyPage    = () => <DummyPage title="Verifikasi Akun" icon={ShieldCheck} desc="Persetujuan pendaftaran akun baru pengguna." />;
const AdminRecapPage     = () => <DummyPage title="Rekap Laporan" icon={Database} desc="Eksport data reservasi dan aktivitas sistem." />;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}

          <Route path="/" element={<HomePage />} />
          <Route path="/facilities/:id" element={<FacilityDetailPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          {/* Semua role terautentikasi */}
          <Route element={<ProtectedRoute roles={["pengguna", "petugas", "admin"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />


              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/reservations/new" element={<NewReservationPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/reports/new" element={<NewReportPage />} />
            </Route>
          </Route>

          {/* Petugas & Admin */}
          <Route element={<ProtectedRoute roles={["petugas", "admin"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/officer" element={<OfficerDashboardPage />} />
              <Route path="/officer/reservations" element={<OfficerReservPage />} />
              <Route path="/officer/reports" element={<OfficerReportPage />} />
            </Route>
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminDashPage />} />
              <Route path="/admin/facilities" element={<AdminFacilPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/verify" element={<AdminVerifyPage />} />
              <Route path="/admin/recap" element={<AdminRecapPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
