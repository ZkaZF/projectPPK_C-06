import { Link } from "react-router-dom";
import { UniversityLogo } from "../common/UniversityLogo";

export const PublicFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--surface-dark)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        color: "rgba(255,255,255,0.55)",
        margin: 0,
        marginTop: "auto",
        width: "100%",
      }}
    >
      {/* Main 3-column area */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "48px 24px 36px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "40px",
        }}
      >
        {/* ── Kolom 1: Brand & deskripsi ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <UniversityLogo className="navbar-brand-icon" />
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.01em",
            }}
          >
            Uni-FaRe
          </span>
          </div>

          <p
            style={{
              fontSize: "0.78rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.4)",
              margin: 0,
              maxWidth: "260px",
            }}
          >
            University Facility Reservations — platform reservasi ruang kuliah, auditorium, laboratorium, dan inventaris kampus Universitas Diponegoro.
          </p>

          {/* Status badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "99px",
              background: "rgba(52, 211, 153, 0.1)",
              border: "1px solid rgba(52, 211, 153, 0.2)",
              width: "fit-content",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#34d399",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 600,
                color: "#34d399",
                letterSpacing: "0.03em",
              }}
            >
              Sistem Aktif
            </span>
          </div>
        </div>

        {/* ── Kolom 2: Navigasi ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <h4
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.35)",
              margin: 0,
            }}
          >
            Navigasi
          </h4>
          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "Katalog Fasilitas", to: "/", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
              { label: "SOP & Regulasi", to: "/sop", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { label: "Masuk / Login", to: "/login", icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" },
              { label: "Daftar Akun", to: "/register", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  padding: "5px 0",
                  transition: "color 0.15s",
                  borderBottom: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
                  <path d={item.icon} />
                </svg>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Kolom 3: Info Institusi ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <h4
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.35)",
              margin: 0,
            }}
          >
            Institusi
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              {
                icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                label: "Universitas Diponegoro",
                sub: "Semarang, Jawa Tengah",
              },
              {
                icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                label: "Kontak Pengelola",
                sub: "prasarana@undip.ac.id",
              },
              {
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                label: "Jam Layanan",
                sub: "Senin–Jumat, 07.00–16.00 WIB",
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "0.77rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", lineHeight: 1.3 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "0.71rem", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "14px 24px",
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)", margin: 0 }}>
          &copy; {year} Universitas Diponegoro — PPK C-06. Seluruh hak cipta dilindungi.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          {["Kebijakan Privasi", "Ketentuan Penggunaan"].map((t) => (
            <span
              key={t}
              style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.2)", cursor: "default" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* pulse keyframe via style tag */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </footer>
  );
};
