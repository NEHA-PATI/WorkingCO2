import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import OrgTab from "@features/org/components/OrgTab";
import Overview from "@features/org/components/Overview";
import AssetManagement from "@features/org/components/AssetManagement";
import CreditEarnings from "@features/org/components/CreditEarnings";
import ComplianceReports from "@features/org/components/ComplianceReports";
import QuickActions from "@features/org/components/QuickActions";
import TeamPage from "@features/teams/pages/Team";
import "@features/org/styles/Overview.css";
import "@features/org/styles/OrgDashboard.css";

export const ORG_DASHBOARD_TAB_COMPONENTS = {
  overview: Overview,
  assets: AssetManagement,
  earnings: CreditEarnings,
  compliance: ComplianceReports,
  team: TeamPage,
  actions: QuickActions,
};

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
          '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
