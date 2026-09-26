import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import { 
  Home, Calendar, FileText, ClipboardList, Wrench, 
  BarChart, Building2, Users, CheckCircle, TrendingUp 
} from "lucide-react";

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const userMenuItems: NavItem[] = [
  { to: "/dashboard",    icon: <Home size={20} />, label: "Dashboard" },
  { to: "/reservations", icon: <Calendar size={20} />, label: "Reservasi Saya" },
  { to: "/reports",      icon: <FileText size={20} />, label: "Laporan Saya" },
];

const officerMenuItems: NavItem[] = [
  { to: "/officer/reservations", icon: <ClipboardList size={20} />, label: "Antrian Reservasi" },
  { to: "/officer/reports",      icon: <Wrench size={20} />, label: "Antrian Laporan" },
];

const adminMenuItems: NavItem[] = [
  { to: "/admin",            icon: <BarChart size={20} />, label: "Dashboard Admin" },
  { to: "/admin/facilities", icon: <Building2 size={20} />, label: "Kelola Fasilitas" },
  { to: "/admin/users",      icon: <Users size={20} />, label: "Kelola User" },
  { to: "/admin/verify",     icon: <CheckCircle size={20} />, label: "Verifikasi Akun" },
  { to: "/admin/recap",      icon: <TrendingUp size={20} />, label: "Rekap Data" },
];

const SidebarItem = ({ to, icon, label }: NavItem) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
  >
    <span className="sidebar-link-icon">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role.role_name;

  return (
    <aside className="sidebar">
      {/* Pengguna menu */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Menu Utama</div>
        {userMenuItems.map((item) => (
          <SidebarItem key={item.to} {...item} />
        ))}
      </div>

      {/* Petugas / Admin menu */}
      {(role === "petugas" || role === "admin") && (
        <div className="sidebar-section">
          <div className="sidebar-section-label">Petugas</div>
          {officerMenuItems.map((item) => (
            <SidebarItem key={item.to} {...item} />
          ))}
        </div>
      )}

      {/* Admin only */}
      {role === "admin" && (
        <div className="sidebar-section">
          <div className="sidebar-section-label">Administrasi</div>
          {adminMenuItems.map((item) => (
            <SidebarItem key={item.to} {...item} />
          ))}
        </div>
      )}
    </aside>
  );
};