import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";

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
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <Outlet />
    </div>
  );
}
