import { Outlet } from "react-router-dom";

/**
 * OrgLayout
 *
 * Purpose:
 * - Wraps organization dashboard pages
 * - Can add org-specific sidebar/navigation here later
 * - No Navbar/Footer (handled by BaseLayout)
 */
export default function OrgLayout() {
  return (
    <div className="org-layout">
      <Outlet />
    </div>
  );
}
