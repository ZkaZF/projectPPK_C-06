import { Link, useNavigate } from "react-router-dom";

export const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-code">403</div>
      <h1 className="error-title">Akses Ditolak</h1>
      <p className="error-desc">
        Anda tidak memiliki izin untuk mengakses halaman ini.
        Hubungi administrator jika Anda merasa ini adalah kesalahan.
      </p>
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          className="btn btn-ghost"
          onClick={() => navigate(-1)}
        >
          ← Kembali
        </button>
        <Link to="/dashboard" className="btn btn-primary">
          Ke Dashboard
        </Link>
      </div>
    </div>
  );
};