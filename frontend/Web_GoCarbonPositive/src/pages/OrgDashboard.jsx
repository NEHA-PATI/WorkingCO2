import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import OrgTab from "../components/org/OrgTab";
import "../styles/org/Overview.css";
import "../styles/org/TeamManagement.css";
import "../styles/org/OrgDashboard.css";

const OrgDashboard = () => {
  const location = useLocation();

  return (
    <motion.div
      className="org-dashboard min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >

      <div>
        <OrgTab />


        <Outlet />

      </div>
    </motion.div>
  );
};

export default OrgDashboard;
