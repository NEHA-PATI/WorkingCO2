import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoAnalyticsSharp, IoSettingsSharp } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { GiSettingsKnobs } from "react-icons/gi";
import { BsShieldCheck } from "react-icons/bs";

import "../../styles/admin/AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/admin/users")) return "users";
    if (path.includes("/admin/support")) return "support";
    if (path.includes("/admin/configuration")) return "configuration";
    if (path.includes("/admin/security")) return "security";
    if (path.includes("/admin/analytics")) return "analytics";
    if (path.includes("/admin/career-management")) return "career-management";
    if (path.includes("/admin/case-study-management"))
      return "case-study-management";
    if (path.includes("/admin/reports")) return "reports";
    return "overview"; // default
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <IoAnalyticsSharp className="icon overview-icon" />,
      path: "/admin/overview",
    },
    {
      id: "users",
      label: "Users",
      icon: <FaUserFriends className="icon users-icon" />,
      path: "/admin/users",
    },

    {
      id: "support",
      label: "Support",
      icon: <MdSupportAgent className="icon support-icon" />,
      path: "/admin/support",
    },
    {
      id: "configuration",
      label: "Configuration",
      icon: <GiSettingsKnobs className="icon config-icon" />,
      path: "/admin/configuration",
    },
    {
      id: "security",
      label: "Security",
      icon: <BsShieldCheck className="icon security-icon" />,
      path: "/admin/security",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <IoAnalyticsSharp className="icon analytics-icon" />,
      path: "/admin/analytics",
    },
    {
      id: "career-management",
      label: "Careers",
      icon: <FaUserFriends className="icon career-icon" />,
      path: "/admin/career-management",
    },
    {
      id: "case-study-management",
      label: "Case Studies",
      icon: <FaUserFriends className="icon case-study-icon" />,
      path: "/admin/case-study-management",
    },
    {
      id: "reports",
      label: "Reports",
      icon: <IoSettingsSharp className="icon reports-icon" />,
      path: "/admin/reports",
    },
  ];

  return (
    <nav className="admin-navbar">
      {navItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${activeTab === item.id ? "active" : ""}`}
          onClick={() => {
            setActiveTab(item.id);
            navigate(item.path);
          }}
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  );
};

export default AdminNavbar;
