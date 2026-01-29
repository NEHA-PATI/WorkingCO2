import { Outlet } from "react-router-dom";

/**
 * UserLayout
 *
 * Purpose:
 * - Wraps user dashboard pages
 * - Can add user-specific sidebar/navigation here later
 * - No Navbar/Footer (handled by BaseLayout)
 */
export default function UserLayout() {
  return (
    <div className="user-layout">
      <Outlet />
    </div>
  );
}
