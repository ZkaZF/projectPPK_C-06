import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../api/auth";
import { UniversityLogo } from "../../components/common/UniversityLogo";
import { CursorGrid } from "../../components/common/CursorGrid";
import { Lock, Shield, BarChart2, Bell, User, Mail, GraduationCap, Key, Eye, EyeOff, AlertCircle, CheckCircle, PartyPopper } from "lucide-react";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nimNip, setNimNip] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      await registerApi({
        full_name: fullName,
        email,
        nim_nip: nimNip,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Registrasi gagal. Periksa kembali data yang Anda masukkan.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-bg">
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <CursorGrid
            cellSize={50}
            color="#f5cf72"
            radius={150}
            falloff="smooth"
            holdTime={400}
            fadeDuration={800}
            lineWidth={1}
            maxOpacity={0.6}
            fillOpacity={0.1}
            gridOpacity={0.05}
            cellRadius={0}
            clickPulse={true}
            pulseSpeed={600}
          />
        </div>
          <div className="auth-bg-content" style={{ pointerEvents: "none" }}>
            <div className="auth-logo">
              <UniversityLogo className="auth-logo-icon" />
              <span className="auth-logo-text">
                <span className="auth-logo-text-light">Uni-</span>
                <span className="auth-logo-text-gold">FaRe</span>
              </span>
            </div>
            <h1 className="auth-tagline">
              Platform Fasilitas<br />
              <span>Kampus Terpadu</span>
            </h1>
          </div>
        </div>
        <div className="auth-panel">
          <div className="auth-form-wrap" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "24px" }}><PartyPopper size={64} color="var(--primary)" /></div>
            <h2 style={{ marginBottom: "12px" }}>Pendaftaran Berhasil!</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.7 }}>
              Akun Anda sedang menunggu verifikasi dari admin. Anda akan bisa login
              setelah akun disetujui.
            </p>
            <div
              className="alert alert-success"
              role="alert"
              style={{ marginBottom: "32px" }}
            >
              <span><CheckCircle size={20} /></span>
              <span>Data berhasil dikirim. Harap menunggu konfirmasi admin.</span>
            </div>
            <button
              className="btn btn-primary btn-full"
              onClick={() => navigate("/login")}
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* Left — branding panel */}
      <div className="auth-bg">
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <CursorGrid
            cellSize={50}
            color="#f5cf72"
            radius={150}
            falloff="smooth"
            holdTime={400}
            fadeDuration={800}
            lineWidth={1}
            maxOpacity={0.6}
            fillOpacity={0.1}
            gridOpacity={0.05}
            cellRadius={0}
            clickPulse={true}
            pulseSpeed={600}
          />
        </div>
        <div className="auth-bg-content" style={{ pointerEvents: "none" }}>
          <div className="auth-logo">
            <UniversityLogo className="auth-logo-icon" />
            <span className="auth-logo-text">
              <span className="auth-logo-text-light">Uni-</span>
              <span className="auth-logo-text-gold">FaRe</span>
            </span>
          </div>

          <h1 className="auth-tagline">
            Platform Fasilitas<br />
            <span>Kampus Terpadu</span>
          </h1>
          <p className="auth-desc" style={{ maxWidth: "420px", fontSize: "1.1rem" }}>
            Buat akun baru untuk mengakses sistem reservasi dan pelaporan fasilitas kampus Universitas Diponegoro secara real-time.
          </p>


        </div>
      </div>

      {/* Right — form panel */}
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <Link
            to="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px",
              textDecoration: "none", transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            ← Kembali ke Beranda
          </Link>

          <div className="auth-form-header">
            <h2>Buat Akun Baru ✨</h2>
            <p>Isi data diri Anda untuk mendaftar</p>
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              <span><AlertCircle size={20} /></span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-fullname">Nama Lengkap</label>
              <div className="form-input-wrap">
                <span className="form-input-icon"><User size={17} /></span>
                <input
                  id="reg-fullname"
                  className="form-input"
                  type="text"
                  placeholder="Nama lengkap sesuai KTP/KTM"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email</label>
              <div className="form-input-wrap">
                <span className="form-input-icon"><Mail size={17} /></span>
                <input
                  id="reg-email"
                  className="form-input"
                  type="email"
                  placeholder="nama@status.undip.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-nimnip">NIM / NIP</label>
              <div className="form-input-wrap">
                <span className="form-input-icon"><GraduationCap size={17} /></span>
                <input
                  id="reg-nimnip"
                  className="form-input"
                  type="text"
                  placeholder="Nomor Induk Mahasiswa / Pegawai"
                  value={nimNip}
                  onChange={(e) => setNimNip(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="form-input-wrap">
                <span className="form-input-icon"><Lock size={17} /></span>
                <input
                  id="reg-password"
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Buat password yang kuat"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Konfirmasi Password</label>
              <div className="form-input-wrap">
                <span className="form-input-icon"><Key size={17} /></span>
                <input
                  id="reg-confirm"
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi password Anda"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: "8px" }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Mendaftarkan...
                </>
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

          <div className="auth-footer" style={{ marginTop: "24px" }}>
            Sudah punya akun?{" "}
            <Link to="/login">Masuk di sini</Link>
          </div>
        </div>
      </div>
    </div>
  );
};