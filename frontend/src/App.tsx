import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { PublicLayout } from "./components/layout/PublicLayout";

// Public pages
import { LoginPage } from "./pages/public/LoginPage";
import { RegisterPage } from "./pages/public/RegisterPage";
import { ForbiddenPage } from "./pages/public/ForbiddenPage";
import HomePage from "./pages/public/HomePage";
import FacilityDetailPage from "./pages/public/FacilityDetailPage";

// User pages
import DashboardPage from "./pages/user/DashboardPage";
import NewReservationPage from "./pages/user/NewReservationPage";
import MyReservationsPage from "./pages/user/MyReservationsPage";
import NewReportPage from "./pages/user/NewReportPage";
import MyReportsPage from "./pages/user/MyReportsPage";

// Officer pages
import ReservationQueuePage from "./pages/officer/ReservationQueuePage";
import ReportQueuePage from "./pages/officer/ReportQueuePage";

// Admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import VerifyUsersPage from "./pages/admin/VerifyUsersPage";
import RecapPage from "./pages/admin/RecapPage";

// Placeholder (for pages not yet implemented)
import { Building2, LayoutDashboard } from "lucide-react";
const DummyPage = ({ title, icon: Icon, desc }: { title: string; icon: any; desc: string }) => (
  <div style={{ padding: "32px", maxWidth: "1140px", margin: "0 auto" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "var(--primary-bg)", color: "var(--primary-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={24} />
      </div>
      <div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "var(--text-h)" }}>{title}</h1>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>{desc}</p>
      </div>
    </div>
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "48px", minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow)" }}>
      <div style={{ textAlign: "center", color: "var(--text-muted)", maxWidth: "400px" }}>
        <Icon size={56} style={{ opacity: 0.15, marginBottom: "20px" }} />
        <p style={{ fontWeight: 500, color: "var(--text-h)", fontSize: "1.1rem" }}>Modul "{title}" Belum Tersedia</p>
        <p style={{ fontSize: "0.9rem", marginTop: "8px", lineHeight: 1.6 }}>Halaman ini sedang dalam tahap pengembangan.</p>
      </div>
    </div>
  </div>
);

const AdminFacilPage = () => <DummyPage title="Kelola Fasilitas" icon={Building2} desc="Tambah, edit, dan atur status fasilitas kampus." />;
const OfficerDashboardPage = () => <DummyPage title="Dashboard Petugas" icon={LayoutDashboard} desc="Ringkasan tugas dan antrian penanganan fasilitas." />;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/facilities/:id" element={<FacilityDetailPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          {/* All authenticated users */}
          <Route element={<ProtectedRoute roles={["pengguna", "petugas", "admin"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/reservations" element={<MyReservationsPage />} />
              <Route path="/reservations/new" element={<NewReservationPage />} />
              <Route path="/reports" element={<MyReportsPage />} />
              <Route path="/reports/new" element={<NewReportPage />} />
            </Route>
          </Route>

          {/* Officer & Admin */}
          <Route element={<ProtectedRoute roles={["petugas", "admin"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/officer" element={<OfficerDashboardPage />} />
              <Route path="/officer/reservations" element={<ReservationQueuePage />} />
              <Route path="/officer/reports" element={<ReportQueuePage />} />
            </Route>
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/facilities" element={<AdminFacilPage />} />
              <Route path="/admin/users" element={<ManageUsersPage />} />
              <Route path="/admin/verify" element={<VerifyUsersPage />} />
              <Route path="/admin/recap" element={<RecapPage />} />
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
