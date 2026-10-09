import { Link } from "react-router-dom";
import { UniversityLogo } from "../../components/common/UniversityLogo";
import heroCampus from "../../assets/hero-campus.jpg";

interface HeroSectionProps {
  totalFacilities: number;
  totalLocations: number;
}

export const HeroSection = ({ totalFacilities, totalLocations }: HeroSectionProps) => {
  const scrollToCatalog = () => {
    document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "92vh",
        paddingTop: "var(--navbar-h)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${heroCampus})`,
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(105deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 40%, rgba(15, 23, 42, 0.5) 70%, rgba(15, 23, 42, 0.3) 100%)",
        }}
      />

      {/* Subtle pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          padding: "64px 24px 0", // Memberikan jarak dari atas
        }}
      >
        {/* Breadcrumb-style label */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "99px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            marginBottom: "24px",
          }}
        >
          <UniversityLogo className="navbar-brand-icon" />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.05em",
            }}
          >
            Universitas Diponegoro
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(3.5rem, 8vw, 5.5rem)",
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 12px",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          Uni-FaRe
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
            fontWeight: 500,
            color: "rgba(255,255,255,0.75)",
            margin: "0 0 24px",
            letterSpacing: "0.01em",
          }}
        >
          University Facility Reservations
        </p>

        {/* Accent line */}
        <div
          style={{
            width: "56px",
            height: "3px",
            borderRadius: "2px",
            background: "var(--primary)",
            marginBottom: "20px",
          }}
        />

        {/* Description */}
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.6)",
            margin: "0 0 40px",
            maxWidth: "680px",
          }}
        >
          Platform resmi reservasi ruang kuliah, auditorium, laboratorium riset,
          dan seluruh fasilitas akademik kampus UNDIP. Akses mudah, proses
          transparan, terintegrasi jadwal akademik.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "56px" }}>
          <button
            onClick={scrollToCatalog}
            className="btn btn-primary"
            style={{
              padding: "16px 36px",
              fontSize: "1.05rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 20px rgba(var(--primary-rgb, 59, 130, 246), 0.35)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Jelajahi Fasilitas
          </button>
          <Link
            to="/sop"
            className="btn"
            style={{
              padding: "16px 36px",
              fontSize: "1.05rem",
              fontWeight: 600,
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Pelajari SOP
          </Link>
        </div>
      </div>

      {/* Floating Stats Cards */}
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          bottom: "-40px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          padding: "0 24px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            pointerEvents: "auto",
          }}
        >
          {[
            {
              value: `${totalFacilities}+`,
              label: "Fasilitas Terdaftar",
              icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            },
            {
              value: `${totalLocations}`,
              label: "Lokasi Gedung",
              icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
            },
            {
              value: "24/7",
              label: "Reservasi Online",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              value: "Real-time",
              label: "Cek Ketersediaan",
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
                borderBottom: "3px solid rgba(13, 148, 136, 0.15)", // Aksen teal di bawah sebagai pembatas
                padding: "20px 24px",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderBottomColor = "rgba(13, 148, 136, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderBottomColor = "rgba(13, 148, 136, 0.15)";
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "#f0fdfa",
                  border: "1px solid rgba(13, 148, 136, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={stat.icon} />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#475569",
                    fontWeight: 500,
                    marginTop: "2px",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <style>{`
        @keyframes hero-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
};
