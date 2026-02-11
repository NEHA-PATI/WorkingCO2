import React from "react";
import { Navigate } from "react-router-dom";

/**
 * AdminDashboard
 *
 * Redirects to /admin/overview (main admin page)
 */
const AdminDashboard = () => {
  return <Navigate to="/admin/overview" replace />;
};

export default AdminDashboard;
