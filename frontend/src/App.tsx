import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/public/LoginPage";
import { RegisterPage } from "./pages/public/RegisterPage";
import { ForbiddenPage } from "./pages/public/ForbiddenPage";

// ── Placeholder pages (ganti nanti dengan halaman asli) ──────────────────────
const DashboardPage      = () => <h1>Dashboard</h1>;
const FacilityDetailPage = () => <h1>Detail Fasilitas</h1>;
const ReservationsPage   = () => <h1>Reservasi Saya</h1>;
const NewReservationPage  = () => <h1>Ajukan Reservasi</h1>;
const ReportsPage        = () => <h1>Laporan Saya</h1>;
const NewReportPage       = () => <h1>Buat Laporan</h1>;

// Officer
const OfficerDashboardPage = () => <h1>Dashboard Petugas</h1>;
const OfficerReservPage  = () => <h1>Antrian Reservasi</h1>;
const OfficerReportPage  = () => <h1>Antrian Laporan</h1>;

// Admin
const AdminDashPage      = () => <h1>Dashboard Admin</h1>;
const AdminFacilPage     = () => <h1>Kelola Fasilitas</h1>;
const AdminUsersPage     = () => <h1>Kelola User</h1>;
const AdminVerifyPage    = () => <h1>Verifikasi Akun</h1>;
const AdminRecapPage     = () => <h1>Rekap</h1>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          {/* Semua role terautentikasi */}
          <Route element={<ProtectedRoute roles={["pengguna", "petugas", "admin"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/facilities/:id" element={<FacilityDetailPage />} />
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