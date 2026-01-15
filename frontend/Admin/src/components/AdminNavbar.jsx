import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoAnalyticsSharp,
  IoSettingsSharp,
} from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { GiSettingsKnobs } from "react-icons/gi";
import { BsShieldCheck } from "react-icons/bs";

import "../styles/AdminNavbar.css";

const AdminNavbar = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <IoAnalyticsSharp className="icon overview-icon" />,
      path: "/overview",
    },
    { id: "users", label: "Users", icon: <FaUserFriends className="icon users-icon" />, path: "/users" },

    {
      id: "support",
      label: "Support",
      icon: <MdSupportAgent className="icon support-icon" />,
      path: "/support",
    },
    {
      id: "configuration",
      label: "Configuration",
      icon: <GiSettingsKnobs className="icon config-icon" />,
      path: "/configuration",
    },
    {
      id: "security",
      label: "Security",
      icon: <BsShieldCheck className="icon security-icon" />,
      path: "/security",
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
