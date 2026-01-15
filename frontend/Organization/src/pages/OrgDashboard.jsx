import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Badge,
} from "../components/basic-ui";
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

import Overview from "../components/Overview";
import AssetManagement from "../components/AssetManagement";
import CreditEarnings from "../components/CreditEarnings";
// import FleetManagement from "../components/FleetManagement";
import ComplianceReports from "../components/ComplianceReports";
import TeamManagement from "../components/TeamManagement";
import QuickActions from "../components/QuickActions";
import "../styles/global1.css";
import "../styles/TeamManagement.css"

// SVG Icons
const BellIcon = () => <FiBell size={20} style={{ color: "#f59e0b" }} />;

const CalendarIcon = () => (
  <FiCalendar size={20} style={{ color: "#3b82f6" }} />
);

const MoonIcon = () => <FiMoon size={20} style={{ color: "#6366f1" }} />;

const SunIcon = () => <FiSun size={20} style={{ color: "#f59e0b" }} />;

const ActivityIcon = () => (
  <FiActivity size={16} style={{ color: "#3b82f6" }} />
);

const FileCheckIcon = () => <FiShield size={16} style={{ color: "#10b981" }} />;

const TrendingUpIcon = () => (
  <FiTrendingUp size={16} style={{ color: "#f59e0b" }} />
);

const TruckIcon = () => <FiTruck size={16} style={{ color: "#8b5cf6" }} />;

const FileTextIcon = () => (
  <FiFileText size={16} style={{ color: "#ef4444" }} />
);

const UsersIcon = () => <FiUsers size={16} style={{ color: "#6366f1" }} />;

const ZapIcon = () => <FiZap size={16} style={{ color: "#10b981" }} />;

// Notification Dropdown Component
const NotificationDropdown = ({ notifications, isOpen, onToggle }) => (
  <motion.div
    className="notification-dropdown"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Button className="button-ghost p-2 relative" onClick={onToggle}>
      <BellIcon className="w-5 h-5" />
      {notifications.length > 0 && (
        <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs bg-red-600 text-white">
          {notifications.length}
        </Badge>
      )}
    </Button>
    {isOpen && (
      <>
        <div className="fixed inset-0 z-40" onClick={onToggle} />
        <motion.div
          className="dropdown-content dropdown-content-end w-80"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="notification-header">Notifications</div>
          {notifications.map((notification) => (
            <div key={notification.id} className="dropdown-item">
              <div className="flex items-start space-x-2">
                <div
                  className={`notification-dot ${
                    notification.type === "alert"
                      ? "bg-red-500"
                      : notification.type === "success"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                  }`}
                />
                <p className="text-sm">{notification.message}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </>
    )}
  </motion.div>
);

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

const OrgDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications] = useState([
    { id: 1, type: "alert", message: "Compliance report due in 3 days" },
    { id: 2, type: "success", message: "EV-001 credits verified" },
    { id: 3, type: "warning", message: "Solar panel maintenance overdue" },
  ]);

  // const ActiveComponent = DASHBOARD_TABS.find((tab) => tab.id === activeTab)?.component || Overview;

  const handleTabChange = (tabId) => {
    setIsLoading(true);
    setActiveTab(tabId);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.div
    className={`org-dashboard min-h-screen bg-gray-50 ${isDarkMode ? "dark" : ""}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className={`min-h-screen bg-gray-50 ${isDarkMode ? "dark" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header
        className="header"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <div className="logo-container">
            <img
              src="/GoCarbonPositive_LOGO.png"
              alt="Go Carbon Positive Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-dark">
              Organization Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Manage your carbon initiatives
            </p>
          </div>
        </div>
        {/* <div className="flex items-center space-x-4">
          <Button className="button-ghost p-2" title="Calendar">
            <CalendarIcon className="w-5 h-5" />
          </Button>
          <NotificationDropdown
            notifications={notifications}
            isOpen={showNotifications}
            onToggle={() => setShowNotifications(!showNotifications)}
          />
          <Button
            className="button-ghost p-2"
            onClick={toggleDarkMode}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </Button>
        </div> */}
      </motion.header>

      {/* Main Content */}

      {/* <div className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >``
          <TabsList className="tabs-list">
            {DASHBOARD_TABS.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="tabs-trigger"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {DASHBOARD_TABS.map((tab) => {
            const TabComponent = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id}>
                {isLoading ? (
                  <div className="spinner">
                    <div className="flex items-center space-x-2">
                      <div className="spinner-circle" />
                      <span className="text-gray-600">
                        Loading dashboard section...
                      </span>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabComponent />
                  </motion.div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div> */}

      <div className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          {/* Tabs List */}
          <TabsList className="newtab-header">
            {DASHBOARD_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`newtab-button ${isActive ? "active" : ""}`}
                >
                  <Icon className={`icon ${tab.color}`} />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tabs Content */}
          {DASHBOARD_TABS.map((tab) => {
            const TabComponent = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id}>
                {isLoading ? (
                  <div className="spinner">
                    <div className="flex items-center space-x-2">
                      <div className="spinner-circle" />
                      <span className="text-gray-600">
                        Loading dashboard section...
                      </span>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabComponent />
                  </motion.div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </motion.div>
    </motion.div>
  );
};

export default OrgDashboard;
