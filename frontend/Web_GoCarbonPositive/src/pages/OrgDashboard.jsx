import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tabs,
  TabsContent,
  Button,
  Badge,
} from "../components/org/basic-ui";
import {
  FiBell,
  FiCalendar,
  FiMoon,
  FiSun,
  FiActivity,
  FiFileText,
  FiTrendingUp,
  FiTruck,
  FiUsers,
  FiZap,
  FiShield,
} from "react-icons/fi";

import Overview from "../components/org/Overview";
import AssetManagement from "../components/org/AssetManagement";
import CreditEarnings from "../components/org/CreditEarnings";
// import FleetManagement from "../components/org/FleetManagement";
import ComplianceReports from "../components/org/ComplianceReports";
import TeamManagement from "../components/org/TeamManagement";
import QuickActions from "../components/org/QuickActions";
import OrgTab from "../components/org/OrgTab";
import "../styles/org/Overview.css";
import "../styles/org/TeamManagement.css";
import "../styles/org/OrgDashboard.css";

// SVG Icons
// const BellIcon = () => <FiBell size={20} style={{ color: "#f59e0b" }} />;

// const CalendarIcon = () => (
//   <FiCalendar size={20} style={{ color: "#3b82f6" }} />
// );

// const MoonIcon = () => <FiMoon size={20} style={{ color: "#6366f1" }} />;

// const SunIcon = () => <FiSun size={20} style={{ color: "#f59e0b" }} />;

const ActivityIcon = () => (
  <FiActivity size={16} style={{ color: "#3b82f6" }} />
);

const FileCheckIcon = () => <FiShield size={16} style={{ color: "#10b981" }} />;

const TrendingUpIcon = () => (
  <FiTrendingUp size={16} style={{ color: "#f59e0b" }} />
);

// const TruckIcon = () => <FiTruck size={16} style={{ color: "#8b5cf6" }} />;

const FileTextIcon = () => (
  <FiFileText size={16} style={{ color: "#ef4444" }} />
);

const UsersIcon = () => <FiUsers size={16} style={{ color: "#6366f1" }} />;

const ZapIcon = () => <FiZap size={16} style={{ color: "#10b981" }} />;

// Notification Dropdown Component
// const NotificationDropdown = ({ notifications, isOpen, onToggle }) => (
//   <motion.div
//     className="notification-dropdown"
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ duration: 0.3 }}
//   >
//     <Button className="button-ghost p-2 relative" onClick={onToggle}>
//       <BellIcon className="w-5 h-5" />
//       {notifications.length > 0 && (
//         <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs bg-red-600 text-white">
//           {notifications.length}
//         </Badge>
//       )}
//     </Button>
//     {isOpen && (
//       <>
//         <div className="fixed inset-0 z-40" onClick={onToggle} />
//         <motion.div
//           className="dropdown-content dropdown-content-end w-80"
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="notification-header">Notifications</div>
//           {notifications.map((notification) => (
//             <div key={notification.id} className="dropdown-item">
//               <div className="flex items-start space-x-2">
//                 <div
//                   className={`notification-dot ${notification.type === "alert"
//                     ? "bg-red-500"
//                     : notification.type === "success"
//                       ? "bg-green-500"
//                       : "bg-yellow-500"
//                     }`}
//                 />
//                 <div className="flex-1">
//                   <div className="notification-message">
//                     {notification.message}
//                   </div>
//                   <div className="notification-time">2 hours ago</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </motion.div>
//       </>
//     )}
//   </motion.div>
// );

// Dashboard tabs configuration
const DASHBOARD_TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: ActivityIcon,
    component: Overview,
    color: "blue",
  },
  {
    id: "assets",
    label: "Assets",
    icon: FileCheckIcon,
    component: AssetManagement,
    color: "green",
  },
  {
    id: "earnings",
    label: "Earnings",
    icon: TrendingUpIcon,
    component: CreditEarnings,
    color: "orange",
  },
  // {
  //   id: "fleet",
  //   label: "Fleet",
  //   icon: TruckIcon,
  //   component: FleetManagement,
  //   color: "purple",
  // },
  {
    id: "compliance",
    label: "Compliance",
    icon: FileTextIcon,
    component: ComplianceReports,
    color: "red",
  },
  {
    id: "team",
    label: "Team",
    icon: UsersIcon,
    component: TeamManagement,
    color: "violet",
  },
  {
    id: "actions",
    label: "Quick Actions",
    icon: ZapIcon,
    component: QuickActions,
    color: "green",
  },
];

const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "400px",
      flexDirection: "column",
      gap: "16px",
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{
        width: "48px",
        height: "48px",
        border: "4px solid #e5e7eb",
        borderTopColor: "#3b82f6",
        borderRadius: "50%",
      }}
    />
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        color: "#6b7280",
        fontSize: "16px",
        fontWeight: "500",
      }}
    >
      Loading dashboard section...
    </motion.span>
  </motion.div>
);

const OrgDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  ///const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //const [showNotifications, setShowNotifications] = useState(false);

  // const [notifications] = useState([
  //   { id: 1, type: "alert", message: "Compliance report due in 3 days" },
  //   { id: 2, type: "success", message: "EV-001 credits verified" },
  //   { id: 3, type: "warning", message: "Solar panel maintenance overdue" },
  // ]);

  // const ActiveComponent = DASHBOARD_TABS.find((tab) => tab.id === activeTab)?.component || Overview;

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;

    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }, 300);
  };

  const ActiveComponent =
    DASHBOARD_TABS.find((tab) => tab.id === activeTab)?.component || Overview;

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode);
  //   document.documentElement.classList.toggle("dark");
  // };

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
      {/* Top Bar */}
      {/*<div className="org-topbar">
        <div className="topbar-left">
          <h1 className="text-2xl font-bold">Organization Dashboard</h1>
          <p className="text-sm text-secondary">
            Manage your carbon credit assets and track your impact
          </p>
        </div>

         <div className="topbar-right">
          <NotificationDropdown
            notifications={notifications}
            isOpen={showNotifications}
            onToggle={() => setShowNotifications(!showNotifications)}
          />

          <Button className="button-ghost p-2" onClick={toggleDarkMode}>
            {isDarkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>*/}

      <div>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          {/* Tabs List */}
          <OrgTab
            onTabChange={handleTabChange}
          />

          {/* Tabs Content */}
          <TabsContent value={activeTab}>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingSpinner key="loading" />
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  <ActiveComponent />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default OrgDashboard;
