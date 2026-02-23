//frontend/User/src/common/HamburgerMenu.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { USER_ORG_MENU } from "@config/menuConfig";
import {
  FaUsers,
  FaBlog,
  FaBriefcase,
  FaBookOpen,
  FaInfoCircle,
  FaEnvelope,
  FaSignOutAlt,
  FaIndustry,
  FaStore,
  FaLeaf,
} from "react-icons/fa";
import { MdDashboard, MdUpload, MdAnalytics, MdWorkspaces } from "react-icons/md";
import { GiWallet } from "react-icons/gi";

const MENU_ICONS = {
  users: FaUsers,
  blog: FaBlog,
  careers: FaBriefcase,
  case_study: FaBookOpen,
  about: FaInfoCircle,
  contact: FaEnvelope,
  logout: FaSignOutAlt,
  industrial: FaIndustry,
  dashboard: MdDashboard,
  upload: MdUpload,
  wallet: GiWallet,
  analytics: MdAnalytics,
  workspace: MdWorkspaces,
  marketplace: FaStore,
  carbon_footprint: FaLeaf,
};

export default function HamburgerMenu({ role, close, handleLogout }) {
  const navigate = useNavigate();
  const menu = USER_ORG_MENU[role] || [];

  const handleItemClick = (item) => {
    close();

    if (item.action === "logout") {
      handleLogout();
      return;
    }

    if (item.path) navigate(item.path);
  };

  return (
    <div className="sidebar-dropdown">
      {menu.map((item) => {
        const Icon = MENU_ICONS[item.iconKey];

        return (
          <div
            key={item.label}
            className="sidebar-item"
            style={{ "--sidebar-icon-color": item.color || "#111" }}
            onClick={() => handleItemClick(item)}
          >
            {Icon && (
              <Icon
                className="sidebar-icon"
                color={item.color}
                style={{
                  fontSize: "1.7rem",
                  minWidth: "26px",
                }}
              />
            )}

            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
