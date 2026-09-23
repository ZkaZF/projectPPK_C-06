import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface NavItem {
  to: string;
  icon: string;
  label: string;
}

const userMenuItems: NavItem[] = [
  { to: "/dashboard",    icon: "🏠", label: "Dashboard" },
  { to: "/reservations", icon: "📅", label: "Reservasi Saya" },
  { to: "/reports",      icon: "📝", label: "Laporan Saya" },
];

const officerMenuItems: NavItem[] = [
  { to: "/officer/reservations", icon: "📋", label: "Antrian Reservasi" },
  { to: "/officer/reports",      icon: "🔧", label: "Antrian Laporan" },
];

const adminMenuItems: NavItem[] = [
  { to: "/admin",            icon: "📊", label: "Dashboard Admin" },
  { to: "/admin/facilities", icon: "🏢", label: "Kelola Fasilitas" },
  { to: "/admin/users",      icon: "👥", label: "Kelola User" },
  { to: "/admin/verify",     icon: "✅", label: "Verifikasi Akun" },
  { to: "/admin/recap",      icon: "📈", label: "Rekap Data" },
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