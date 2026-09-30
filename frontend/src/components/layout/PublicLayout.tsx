import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const PublicLayout = () => {
  return (
    <div className="app-shell" style={{ display: "block" }}>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - var(--navbar-h))", paddingTop: "var(--navbar-h)", background: "var(--bg)" }}>
        <Outlet />
      </main>
    </div>
  );
};
