import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UniversityLogo } from "../common/UniversityLogo";

export const Navbar = () => {
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
      {/* Brand */}
      <Link to="/dashboard" className="navbar-brand">
        <UniversityLogo className="navbar-brand-icon" />
        <span className="navbar-brand-name">UniSpace</span>
      </Link>

      <div className="navbar-spacer" />

      {/* User section */}
      <div className="navbar-user">
        {user && (
          <>
            <div style={{ textAlign: "right" }}>
              <div className="navbar-user-name">{user.full_name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {roleLabel[user.role.role_name] ?? user.role.role_name}
              </div>
            </div>
            <div className="navbar-avatar" title={user.full_name}>
              {initials}
            </div>
          </>
        )}

        <button
          id="navbar-logout"
          className="btn btn-danger"
          onClick={handleLogout}
          style={{ padding: "8px 16px", fontSize: "0.875rem" }}
        >
          Keluar
        </button>
      </div>
    </nav>
  );
};