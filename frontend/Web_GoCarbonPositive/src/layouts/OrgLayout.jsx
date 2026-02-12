import { Outlet } from "react-router-dom";

export default function OrgLayout() {
  return (
    <div className="org-layout">
      <Outlet />
    </div>
  );
}
