import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="app-shell">
      <Navbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className="app-body">
        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay${sidebarOpen ? " sidebar-open" : ""}`}
          onClick={closeSidebar}
          aria-hidden="true"
        />

        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
