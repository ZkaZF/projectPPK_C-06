import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UniversityLogo } from "../common/UniversityLogo";
import { LogOut, Menu, X } from "lucide-react";

interface NavbarProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export const Navbar = ({ onToggleSidebar, sidebarOpen }: NavbarProps) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const roleLabel: Record<string, string> = {
    admin: "Administrator",
    petugas: "Petugas",
    pengguna: "Pengguna",
  };

  return (
    <nav className="navbar">
      {/* Hamburger — mobile only */}
      {onToggleSidebar && (
        <button
          className="navbar-hamburger"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Tutup menu" : "Buka menu"}
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "var(--text-white)",
            cursor: "pointer",
            marginRight: 8,
            flexShrink: 0,
          }}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}

      {/* Brand */}
      <Link to="/" className="navbar-brand">
        <UniversityLogo className="navbar-brand-icon" />
        <span className="navbar-brand-name">Uni-FaRe</span>
      </Link>

      <div className="navbar-spacer" />

      {/* User section / Auth links */}
      <div className="navbar-user">
        {user ? (
          <>
            <div style={{ textAlign: "right" }}>
              <div className="navbar-user-name">{user.full_name}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)" }}>
                {roleLabel[user.role.role_name] ?? user.role.role_name}
              </div>
            </div>
            <div className="navbar-avatar" title={user.full_name}>
              {initials}
            </div>
            <button
              className="btn"
              onClick={handleLogout}
              style={{ 
                padding: "8px 16px", 
                fontSize: "0.875rem",
                background: "transparent",
                color: "var(--text-white)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              <LogOut size={16} /> Keluar
            </button>
          </>
        ) : (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Link to="/login" className="btn" style={{ 
              color: "var(--text-white)", 
              fontSize: "0.9rem", 
              fontWeight: 500, 
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "8px 18px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}>
              Masuk
            </Link>
            <Link to="/register" className="btn btn-primary" style={{
              padding: "8px 18px",
              fontSize: "0.9rem", 
            }}>
              Daftar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};