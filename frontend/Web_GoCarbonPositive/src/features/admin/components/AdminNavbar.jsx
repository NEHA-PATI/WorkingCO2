import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoAnalyticsSharp, IoSettingsSharp } from "react-icons/io5";
import { FaUserFriends, FaTrophy, FaBriefcase } from "react-icons/fa";
import { MdSupportAgent, MdFactCheck } from "react-icons/md";
import { GiSettingsKnobs } from "react-icons/gi";
import { BsShieldCheck } from "react-icons/bs";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";

import "@features/admin/styles/AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/admin/users")) return "users";
    if (path.includes("/admin/asset-management")) return "asset-management";
    if (path.includes("/admin/support")) return "support";
    if (path.includes("/admin/configuration")) return "configuration";
    if (path.includes("/admin/security")) return "security";
    if (path.includes("/admin/analytics")) return "analytics";
    if (path.includes("/admin/career-management")) return "career-management";
    if (path.includes("/admin/organization-management"))
      return "organization-management";
    if (path.includes("/admin/case-study-management"))
      return "case-study-management";
    if (path.includes("/admin/contest")) return "contest";
    if (path.includes("/admin/mrv-management")) return "mrv-management";
    if (path.includes("/admin/reports")) return "reports";
    return "overview"; // default
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());
  const [isAssetMenuOpen, setIsAssetMenuOpen] = useState(
    location.pathname.includes("/admin/asset-management")
  );
  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(
    location.pathname.includes("/admin/organization-management")
  );

  useEffect(() => {
    setActiveTab(getActiveTab());
    if (location.pathname.includes("/admin/asset-management")) {
      setIsAssetMenuOpen(true);
    }
    if (location.pathname.includes("/admin/organization-management")) {
      setIsOrgMenuOpen(true);
    }
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
      id: "asset-management",
      label: "Asset Management",
      icon: <FaBoxesStacked className="icon asset-icon" />,
      path: "/admin/asset-management",
      children: [
        {
          id: "asset-user",
          label: "User Asset",
          path: "/admin/asset-management/user",
        },
        {
          id: "asset-organization",
          label: "Organization Asset",
          path: "/admin/asset-management/organization",
        },
      ],
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
      icon: <FaBriefcase className="icon career-icon" />,
      path: "/admin/career-management",
    },
    {
      id: "organization-management",
      label: "Organisation Management",
      icon: <FaBuilding className="icon organization-icon" />,
      path: "/admin/organization-management",
      children: [
        {
          id: "org-request",
          label: "Org Request",
          path: "/admin/organization-management/org-request",
        },
        {
          id: "organization",
          label: "Organization",
          path: "/admin/organization-management/organization",
        },
      ],
    },
    {
      id: "case-study-management",
      label: "Case Studies",
      icon: <FaUserFriends className="icon case-study-icon" />,
      path: "/admin/case-study-management",
    },
    {
      id: "contest",
      label: "Contest Management",
      icon: <FaTrophy className="icon contest-icon" />,
      path: "/admin/contest",
    },
    {
      id: "mrv-management",
      label: "MRV Management",
      icon: <MdFactCheck className="icon mrv-icon" />,
      path: "/admin/mrv-management",
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
        <div key={item.id} className="nav-item-wrapper">
          <div
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => {
              if (item.children) {
                if (item.id === "asset-management") {
                  setIsAssetMenuOpen((prev) => !prev);
                }
                if (item.id === "organization-management") {
                  setIsOrgMenuOpen((prev) => !prev);
                }
                return;
              }
              setActiveTab(item.id);
              navigate(item.path);
            }}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.children && (
              <FaChevronDown
                className={`nav-chevron ${
                  item.id === "asset-management"
                    ? isAssetMenuOpen
                      ? "open"
                      : ""
                    : isOrgMenuOpen
                      ? "open"
                      : ""
                }`}
              />
            )}
          </div>

          {item.children &&
            ((item.id === "asset-management" && isAssetMenuOpen) ||
              (item.id === "organization-management" && isOrgMenuOpen)) && (
            <div className="nav-submenu">
              {item.children.map((child) => (
                <div
                  key={child.id}
                  className={`nav-subitem ${
                    `${location.pathname}${location.search}` === child.path
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate(child.path)}
                >
                  {child.label}
                </div>
              ))}
            </div>
            )}
        </div>
      ))}
    </nav>
  );
};

export default AdminNavbar;
