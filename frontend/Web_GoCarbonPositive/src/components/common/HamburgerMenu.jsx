//frontend/User/src/common/HamburgerMenu.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { USER_ORG_MENU } from "../../config/menuConfig";
// import { toast } from "react-toastify";

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

    if (item.action === "wallet") {
      openWalletModal();
      return;
    }

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
            onClick={() => handleItemClick(item)}
          >
            <Icon
              className="sidebar-icon"
              style={{ color: item.color, fontSize: "1.7rem" }}
            />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
