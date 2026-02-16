import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useModal } from "@contexts/ModalContext";
import { FaBars, FaChevronDown } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import {
  FaUserCircle,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaUserPlus,
  FaLeaf,
} from "react-icons/fa";
import { fireToast } from "@shared/utils/toastService";
import HamburgerMenu from "./HamburgerMenu";

import useAuth from "@contexts/AuthContext";

import "@shared/ui/styles/userNavbar.css";

/**
 * COMMON NAVBAR
 * - Single layout
 * - Dynamic by role + auth
 * - UI parity with old navbars
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, isAuthenticated, authLoading, logout } = useAuth();

  const { openLogin, openSignup, showLogin, showSignup } = useModal();

  /* ================= STATE ================= */
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const hideHamburgerOnRoute =
    location.pathname === "/admin/overview" ||
    location.pathname === "/admin/users";

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
localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleIconicArenaClick = () => {
    if (!isAuthenticated) {
      fireToast("AUTH.LOGIN_REQUIRED_REDIRECT", "error", {}, { autoClose: 2500 });
      setTimeout(() => navigate("/login"), 2500);
      return;
    }
    navigate("/arena-standalone");
  };

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
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

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* ================= RENDER ================= */
  if (authLoading) return null;
  if (showLogin || showSignup) return null;

  return (
    <>
    <div className="user-navbar">
      {/* ================= LEFT ================= */}
      <div className="user-left-section">
          {!hideHamburgerOnRoute && (
            <div ref={menuDropdownRef} style={{ position: "relative" }}>
              <FaBars
                className="user-menu-icon"
                onClick={() => setMenuOpen((prev) => !prev)}
              />

              {menuOpen && (
                <HamburgerMenu
                  role={isAuthenticated ? role : "guest"}
                  close={() => setMenuOpen(false)}
                  handleLogout={handleLogout}
                />
              )}
            </div>
          )}

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
        </div>

        {/* ================= CENTER (WALLET) ================= */}
        {isAuthenticated && role !== "admin" && (
          <div className="user-nav-links user-nav-links-center">
            <div
              className="user-nav-item wallet-nav-item"
              onClick={() => navigate("/wallet")}
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
          {/* <ArenaButton /> */}
          <button
            className="iconic-arena-button"
            onClick={handleIconicArenaClick}
          >
            <video
              src="/arena-animation.mp4.webm"
              className="iconic-arena-video"
              autoPlay
              loop
              muted
              playsInline
            />
            Iconic Arena
          </button>

          {/* ====== CHANGE STARTS HERE ONLY ====== */}

          {!isAuthenticated ? (
            <div className="auth-buttons">
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
                          navigate("/wallet");
                        }}
                      >
                        <GiWallet
                          className="profile-icon profile-icon-amber"
                          style={{ fontSize: "1.8rem" }}
                        />
                        <span>My Wallet</span>
                      </div>
                    )}

                    {role !== "admin" && (
                      <div
                        className="user-profile-dropdown-item"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/community");
                        }}
                      >
                        <FaLeaf style={{ color: "#16a34a" }} />
                        <span>My Carbon Footprint</span>
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

    </>
  );
}
