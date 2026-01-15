import React from "react";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  // When the component renders, redirect to /overview
  return <Navigate to="/overview" replace />;
};

export default AdminDashboard;
