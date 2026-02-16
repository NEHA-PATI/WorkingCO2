import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import "./AdminLayout.css";

const MIN_SIDEBAR_WIDTH = 220;
const MAX_SIDEBAR_WIDTH = 420;
const DEFAULT_SIDEBAR_WIDTH = 280;
const MOBILE_BREAKPOINT = 1024;

/**
 * AdminLayout
 *
 * Purpose:
 * - Wraps admin dashboard pages
 * - Includes AdminNavbar (tabs/navigation)
 * - AdminHeader is NOT needed - it's already in BaseLayout Navbar (role-aware)
 * - No Navbar/Footer (handled by BaseLayout)
 */
export default function AdminLayout() {
  const layoutRef = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeMove = useCallback(
    (event) => {
      if (!isResizing || !layoutRef.current) return;

      const bounds = layoutRef.current.getBoundingClientRect();
      const nextWidth = event.clientX - bounds.left;

      setSidebarWidth(
        Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, nextWidth))
      );
    },
    [isResizing]
  );

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", stopResizing);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [handleResizeMove, isResizing, stopResizing]);

  const startResizing = (event) => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) return;
    event.preventDefault();
    setIsResizing(true);
  };

  const handleResizerKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      setSidebarWidth((prev) => Math.max(MIN_SIDEBAR_WIDTH, prev - 12));
    } else if (event.key === "ArrowRight") {
      setSidebarWidth((prev) => Math.min(MAX_SIDEBAR_WIDTH, prev + 12));
    }
  };

  return (
    <div
      ref={layoutRef}
      className={`admin-layout-shell ${isResizing ? "is-resizing" : ""}`}
      style={{ "--admin-sidebar-width": `${sidebarWidth}px` }}
    >
      <aside className="admin-layout-sidebar">
        <AdminNavbar />
      </aside>

      <div
        className="admin-layout-resizer"
        role="separator"
        tabIndex={0}
        aria-orientation="vertical"
        aria-label="Resize admin sidebar"
        onMouseDown={startResizing}
        onKeyDown={handleResizerKeyDown}
      />

      <section className="admin-layout-content">
        <Outlet />
      </section>
    </div>
  );
}
