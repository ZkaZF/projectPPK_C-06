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
import SopPage from "./pages/public/SopPage";

// User pages
import DashboardPage from "./pages/user/DashboardPage";
import NewReservationPage from "./pages/user/NewReservationPage";
import MyReservationsPage from "./pages/user/MyReservationsPage";
import NewReportPage from "./pages/user/NewReportPage";
import MyReportsPage from "./pages/user/MyReportsPage";
import FacilitiesPage from "./pages/admin/FacilitiesPage";

// Officer pages
import ReservationQueuePage from "./pages/officer/ReservationQueuePage";
import ReportQueuePage from "./pages/officer/ReportQueuePage";

// Admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import VerifyUsersPage from "./pages/admin/VerifyUsersPage";
import RecapPage from "./pages/admin/RecapPage";


import OfficerDashboardPage from "./pages/officer/OfficerDashboardPage";

const AdminFacilPage = FacilitiesPage;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/facilities/:id" element={<FacilityDetailPage />} />
            <Route path="/sop" element={<SopPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          {/* All authenticated users */}
          <Route element={<ProtectedRoute roles={["pengguna", "petugas", "admin"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/general" element={<HomePage />} />
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
              <Route path="/admin/general" element={<HomePage />} />
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

