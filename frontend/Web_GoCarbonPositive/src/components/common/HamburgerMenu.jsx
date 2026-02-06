//frontend/User/src/common/HamburgerMenu.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { USER_ORG_MENU } from "../../config/menuConfig";

export default function HamburgerMenu({
  role,
  close,
  openWalletModal,
  handleLogout,
}) {
  const navigate = useNavigate();
  const menu = USER_ORG_MENU[role] || [];

  const handleItemClick = (item) => {
    close();

    // ✅ FIX 1 – Wallet ko label se pakdo
    if (item.label === "Wallet") {
      openWalletModal();
      return;
    }

    // Logout same
    if (item.action === "logout") {
      handleLogout();
      return;
    }

    if (item.path) navigate(item.path);
  };

  return (
    <div className="sidebar-dropdown">
      {menu.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="sidebar-item"
            style={{ "--sidebar-icon-color": item.color || "#111" }}
            onClick={() => handleItemClick(item)}
          >
            {/* ✅ FIX 2 – COLOR FORCE */}
            <Icon
              className="sidebar-icon"
              style={{ fontSize: "1.7rem" }}
            />

            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
