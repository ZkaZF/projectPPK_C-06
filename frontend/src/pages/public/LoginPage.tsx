import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UniversityLogo } from "../../components/common/UniversityLogo";

export const LoginPage = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser.role.role_name === "admin") {
        window.location.href = "/admin";
      } else if (loggedInUser.role.role_name === "petugas") {
        window.location.href = "/officer";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
      const status = (err as { response?: { status?: number } }).response?.status;

      if (status === 403) {
        setError("Akun Anda masih menunggu verifikasi admin.");
      } else {
        setError("Email atau password salah. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left — branding panel */}
      <div className="auth-bg">
        <div className="auth-bg-grid" />
        <div className="auth-bg-content">
          <div className="auth-logo">
            <UniversityLogo className="auth-logo-icon" />
            <span className="auth-logo-text">
              <span className="auth-logo-text-light">Uni</span>
              <span className="auth-logo-text-gold">Space</span>
            </span>
          </div>

          <h1 className="auth-tagline">
            Kelola Fasilitas<br />
            <span>Kampus dengan Mudah</span>
          </h1>
          <p className="auth-desc">
            Platform reservasi dan pelaporan fasilitas kampus yang cerdas, cepat, dan transparan.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature-icon">📅</span>
              <span className="auth-feature-label">Reservasi fasilitas secara online kapan saja</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">📝</span>
              <span className="auth-feature-label">Laporkan kerusakan dengan mudah dan cepat</span>
            </div>
 
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h2>Selamat Datang 👋</h2>
            <p>Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <div className="form-input-wrap">
                <span className="form-input-icon">✉️</span>
                <input
                  id="login-email"
                  className="form-input"
                  type="email"
                  placeholder="nama@kampus.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="form-input-wrap">
                <span className="form-input-icon">🔒</span>
                <input
                  id="login-password"
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "48px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    fontSize: "16px",
                    padding: 0,
                    lineHeight: 1,
                  }}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: "8px" }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Memproses...
                </>
              ) : (
                "Masuk ke Akun"
              )}
            </button>
          </form>

          <div className="auth-divider">atau</div>

          <div className="auth-footer">
            Belum punya akun?{" "}
            <Link to="/register">Daftar sekarang</Link>
          </div>
        </div>
      </div>
    </div>
  );
};