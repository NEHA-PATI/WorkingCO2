import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useModal } from "../../contexts/ModalContext";
import { FaBars, FaChevronDown } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import {
  FaUserCircle,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaUserPlus,
} from "react-icons/fa";
import { fireToast } from "../../services/user/toastService.js";

import HamburgerMenu from "./HamburgerMenu";
import WalletPopup from "../../pages/wallet";
import useAuth from "../../auth/useAuth";

import "../../styles/user/userNavbar.css";

/**
 * COMMON NAVBAR
 * - Single layout
 * - Dynamic by role + auth
 * - UI parity with old navbars
 */
export default function Navbar() {
  const navigate = useNavigate();
  const { user, role, isAuthenticated, authLoading, logout } = useAuth();

  const { openLogin, openSignup } = useModal();

  /* ================= STATE ================= */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);

  /* ================= HELPERS ================= */

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getDisplayName = () => {
    if (user?.username) return user.username;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const getDashboardRoute = () => {
    if (!role) return "/user/dashboard";
    if (role === "admin") return "/admin/dashboard";
    if (role === "organization") return "/org/dashboard";
    return "/user/dashboard";
  };

  /* ================= ACTIONS ================= */

  const handleLogout = () => {
    logout();
    fireToast("AUTH.LOGOUT_SUCCESS", "success");
    localStorage.removeItem("authUser");

    localStorage.removeItem("userId");
    navigate("/");
  };

  const openWalletModal = () => {
    setWalletOpen(true);
    setSidebarOpen(false);
    setProfileOpen(false);
  };

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= RENDER ================= */
  if (authLoading) return null;

  return (
    <>
      <div className="user-navbar">
        {/* ================= LEFT ================= */}
        <div className="user-left-section">
          <FaBars
            className="user-menu-icon"
            onClick={() => setSidebarOpen((s) => !s)}
          />

          <div
            className="user-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <img
              src="/GoCarbonPositive_LOGO.svg"
              alt="CarbonCredit Logo"
              className="user-logo-icon"
            />
            <span className="user-logo-text">Carbon Positive</span>
          </div>

          {sidebarOpen && (
            <div ref={sidebarRef}>
              <HamburgerMenu
                role={isAuthenticated ? role : "guest"}
                close={() => setSidebarOpen(false)}
                openWalletModal={openWalletModal}
                handleLogout={handleLogout}
              />
            </div>
          )}
        </div>

        {/* ================= CENTER (WALLET) ================= */}
        {isAuthenticated && role !== "admin" && (
          <div className="user-nav-links user-nav-links-center">
            <div
              className="user-nav-item wallet-nav-item"
              onClick={openWalletModal}
            >
              {/* <GiWallet
                className="wallet-icon"
                style={{ color: "#f59e0b", fontSize: "2rem" }}
              /> */}
            </div>
          </div>
        )}

        {/* ================= RIGHT ================= */}

        <div className="user-right-section">
          {/* ====== CHANGE STARTS HERE ONLY ====== */}

          {!isAuthenticated ? (
            <div className="auth-buttons">

              <button class="iconic-arena-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24">
                  <path d="m18 0 8 12 10-8-4 20H4L0 4l10 8 8-12z"></path>
                </svg>
                ICONIC ARENA
              </button>

              <button className="signup-btn" onClick={openSignup}>
                <FaUserPlus />
                <span>Sign Up</span>
              </button>

              <button className="login-btn" onClick={openLogin}>
                <FaUserCircle />
                <span>Login</span>
              </button>
            </div>
          ) : (
            <div className="user-profile-container" ref={profileDropdownRef}>
              <div
                onClick={() => setProfileOpen((p) => !p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                {/* Avatar */}
                <div style={{ position: "relative" }}>
                  <div className="user-profile-avatar">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={getDisplayName()}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      getInitials(user?.username || user?.email)
                    )}
                  </div>

                  <div className="user-status-badge" />
                </div>

                <div className="user-profile-info">
                  <div className="user-profile-name">{getDisplayName()}</div>
                </div>

                <FaChevronDown className="user-profile-dropdown-icon" />
              </div>

              {profileOpen && (
                <>
                  <div
                    className="profile-dropdown-backdrop"
                    onClick={() => setProfileOpen(false)}
                  ></div>

                  <div className="user-profile-dropdown">
                    <div className="user-profile-dropdown-header">
                      <div className="user-profile-dropdown-name">
                        {getDisplayName()}
                      </div>

                      <div className="user-profile-dropdown-email">
                        {user?.email || ""}
                      </div>
                    </div>

                    <NavLink
                      to="/profile"
                      className="user-profile-dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <FaUserCircle className="profile-icon profile-icon-blue" />
                      <span>My Profile</span>
                    </NavLink>

                    <div
                      className="user-profile-dropdown-item"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate(getDashboardRoute());
                      }}
                    >
                      <FaChartLine className="profile-icon profile-icon-green" />
                      <span>Dashboard</span>
                    </div>

                    {role !== "admin" && (
                      <div
                        className="user-profile-dropdown-item"
                        onClick={() => {
                          setProfileOpen(false);
                        openWalletModal();
                      }}
                    >
                      <GiWallet
                        className="profile-icon profile-icon-amber"
                        style={{ fontSize: "1.8rem" }}
                      />
                      <span>My Wallet</span>
                    </div>
                    )}

                    <NavLink
                      to="/settings"
                      className="user-profile-dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <FaCog className="profile-icon profile-icon-slate" />
                      <span>Settings</span>
                    </NavLink>

                    <div
                      className="user-profile-dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="profile-icon profile-icon-red" />
                      <span>Logout</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ====== CHANGE ENDS HERE ONLY ====== */}
        </div>
      </div>

      {/* ================= WALLET MODAL ================= */}
      {walletOpen && (
        <div
          className="wallet-modal-overlay"
          onClick={() => setWalletOpen(false)}
        >
          <div
            className="wallet-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <WalletPopup onClose={() => setWalletOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
