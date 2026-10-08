import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { PublicFooter } from "./PublicFooter";

export const PublicLayout = () => {
  return (
    <div className="app-shell" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1, background: "var(--bg)" }}>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
