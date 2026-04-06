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
import { USER_ORG_MENU } from "@config/menuConfig";
import HamburgerMenu from "./HamburgerMenu";
import CurrencyToggle from "@features/marketplace/components/CurrencyToggle";

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
  const [activeNavDropdown, setActiveNavDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuDropdownRef = useRef(null);
  const navContainerRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navOpenTimerRef = useRef(null);
  const navCloseTimerRef = useRef(null);
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isOrganisationExperienceRoute =
    location.pathname === "/experience/organisation";
  const showHamburger = !isAdminRoute;
  const normalizedRole = (role || "").toLowerCase();
  const menuRole = isAuthenticated ? normalizedRole || "guest" : "guest";
  const roleMenu = USER_ORG_MENU[menuRole] || [];

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
    if (!normalizedRole) return "/user/dashboard";
    if (normalizedRole === "admin") return "/admin/dashboard";
    if (normalizedRole === "organization") return "/org/dashboard";
    return "/user/dashboard";
  };

  const normalizeLabel = (value = "") =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");

  const getMenuItem = (...labels) => {
    if (!labels.length) return null;
    return (
      roleMenu.find((item) =>
        labels.some(
          (label) => normalizeLabel(item.label) === normalizeLabel(label)
        )
      ) || null
    );
  };

  const toNavItem = (menuItem, fallback = null) => {
    if (menuItem?.path) {
      return {
        label: menuItem.label,
        path: menuItem.path,
        action: menuItem.action || null,
      };
    }
    return fallback;
  };

  const dashboardItem =
    toNavItem(getMenuItem("Dashboard")) ||
    (isAuthenticated
      ? {
          label: "Dashboard",
          path: getDashboardRoute(),
          action: null,
        }
      : null);

  const walletItem = toNavItem(getMenuItem("My Wallet", "Wallet"));
  const addAssetItem = toNavItem(getMenuItem("Add Asset"));
  const industrialItem = toNavItem(getMenuItem("Industrial Solutions"));
  const communityItem = toNavItem(getMenuItem("Community"));
  const blogItem = toNavItem(getMenuItem("Blog"));
  const carbonItem = toNavItem(getMenuItem("My Carbon Footprint"));
  const aboutItem = toNavItem(getMenuItem("About Us"));
  const contactItem = toNavItem(getMenuItem("Contact Us"));
  const caseStudiesItem = toNavItem(getMenuItem("Case Studies"));
  const careersItem = toNavItem(getMenuItem("Careers"));
  const marketplaceRootItem = toNavItem(getMenuItem("Marketplace"));
  const internshipItem = careersItem
    ? {
        label: "Internship",
        path: "/careers/internship",
        action: null,
        isChild: true,
      }
    : null;

  const enterpriseItems = [
    addAssetItem,
    industrialItem
      ? {
          ...industrialItem,
          label: "Industry Solutions",
        }
      : null,
    {
      label: "Policies",
      path: "/privacypolicy",
      action: null,
    },
  ].filter(Boolean);

  const communityItems = [
    communityItem,
    blogItem,
    carbonItem
      ? {
          ...carbonItem,
          label: "My Carbon Foot Print",
        }
      : null,
    aboutItem,
    contactItem,
    caseStudiesItem,
    careersItem,
    internshipItem,
  ].filter(Boolean);

  const canUseMarketplace =
    isAuthenticated && normalizedRole !== "admin" && !isAdminRoute;

  const marketplaceItems = [
    marketplaceRootItem,
    canUseMarketplace
      ? {
          label: "Legal Policies",
          path: "/termsandconditions",
          action: null,
        }
      : null,
    canUseMarketplace
      ? {
          label: "Methodologies",
          path: "/marketplace",
          action: null,
        }
      : null,
    canUseMarketplace
      ? {
          label: "Verifications",
          path: "/marketplace",
          action: null,
        }
      : null,
    canUseMarketplace
      ? {
          label: "Validations",
          path: "/marketplace",
          action: null,
        }
      : null,
  ].filter(Boolean);

  const navSections = [
    {
      key: "dashboard",
      label: "Dashboard",
      type: "link",
      item: dashboardItem,
      visible: Boolean(dashboardItem),
    },
    {
      key: "enterprise",
      label: "Entreprise",
      type: "dropdown",
      items: enterpriseItems,
      visible: enterpriseItems.length > 0 && !isAdminRoute,
    },
    {
      key: "community",
      label: "Community",
      type: "dropdown",
      items: communityItems,
      visible: communityItems.length > 0 && !isAdminRoute,
    },
    {
      key: "marketplace",
      label: "Marketplace",
      type: "dropdown",
      items: marketplaceItems,
      visible: marketplaceItems.length > 0 && !isAdminRoute,
    },
    {
      key: "wallet",
      label: "Wallet",
      type: "link",
      item: walletItem,
      visible: Boolean(walletItem) && !isAdminRoute,
    },
  ].filter((section) => section.visible);

  const isPathActive = (path) => {
    if (!path) return false;
    if (location.pathname === path) return true;
    if (path === "/") return false;
    return location.pathname.startsWith(`${path}/`);
  };

  const isSectionActive = (section) => {
    if (section.type === "link") return isPathActive(section.item?.path);
    return section.items?.some((item) => isPathActive(item.path));
  };

  const handleNavItemClick = (item) => {
    if (navOpenTimerRef.current) clearTimeout(navOpenTimerRef.current);
    if (navCloseTimerRef.current) clearTimeout(navCloseTimerRef.current);
    setActiveNavDropdown(null);
    if (!item) return;
    if (item.action === "logout") {
      handleLogout();
      return;
    }
    if (item.path) navigate(item.path);
  };

  const clearNavHoverTimers = () => {
    if (navOpenTimerRef.current) {
      clearTimeout(navOpenTimerRef.current);
      navOpenTimerRef.current = null;
    }
    if (navCloseTimerRef.current) {
      clearTimeout(navCloseTimerRef.current);
      navCloseTimerRef.current = null;
    }
  };

  const isDesktopNav = () =>
    window.matchMedia("(min-width: 992px)").matches;

  const handleDesktopNavEnter = (sectionKey, hasDropdown) => {
    if (!hasDropdown || !isDesktopNav()) return;

    if (navCloseTimerRef.current) {
      clearTimeout(navCloseTimerRef.current);
      navCloseTimerRef.current = null;
    }

    if (navOpenTimerRef.current) clearTimeout(navOpenTimerRef.current);
    navOpenTimerRef.current = setTimeout(() => {
      setActiveNavDropdown(sectionKey);
      navOpenTimerRef.current = null;
    }, 55);
  };

  const handleDesktopNavLeave = (sectionKey, hasDropdown) => {
    if (!hasDropdown || !isDesktopNav()) return;

    if (navOpenTimerRef.current) {
      clearTimeout(navOpenTimerRef.current);
      navOpenTimerRef.current = null;
    }

    if (navCloseTimerRef.current) clearTimeout(navCloseTimerRef.current);
    navCloseTimerRef.current = setTimeout(() => {
      setActiveNavDropdown((current) =>
        current === sectionKey ? null : current
      );
      navCloseTimerRef.current = null;
    }, 140);
  };

  /* ================= ACTIONS ================= */

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    fireToast("AUTH.LOGOUT_SUCCESS", "success");
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleIconicArenaClick = () => {
    if (!isAuthenticated) {
      fireToast("AUTH.LOGIN_REQUIRED_REDIRECT", "error");
      navigate("/login");
      return;
    }
    if (normalizedRole !== "user") return;
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
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target)
      ) {
        clearNavHoverTimers();
        setActiveNavDropdown(null);
      }

      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearNavHoverTimers();
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    clearNavHoverTimers();
    setActiveNavDropdown(null);
    setProfileOpen(false);
  }, [location.pathname]);

  /* ================= RENDER ================= */
  if (authLoading) return null;
  if (showLogin || showSignup) return null;

  return (
    <>
      <div className="user-navbar">
        {/* ================= LEFT ================= */}
        <div className="user-left-section">
          {showHamburger && (
            <div
              ref={menuDropdownRef}
              className="mobile-hamburger-wrap"
              style={{ position: "relative" }}
            >
              <FaBars
                className="user-menu-icon"
                onClick={() => setMenuOpen((prev) => !prev)}
              />

              {menuOpen && (
                <HamburgerMenu
                  role={menuRole}
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

        {/* ================= CENTER NAV ================= */}
        {!isAdminRoute && (
          <nav className="tf-nav" ref={navContainerRef}>
            {navSections.map((section) => {
              const hasDropdown = section.type === "dropdown";
              const isOpen = activeNavDropdown === section.key;
              const active = isSectionActive(section);

              return (
                <div
                  key={section.key}
                  className={`tf-nav-item tf-nav-item--${section.key} ${
                    hasDropdown ? "has-dropdown" : ""
                  } ${isOpen ? "is-open" : ""} ${active ? "is-active" : ""}`}
                  onMouseEnter={() =>
                    handleDesktopNavEnter(section.key, hasDropdown)
                  }
                  onMouseLeave={() =>
                    handleDesktopNavLeave(section.key, hasDropdown)
                  }
                >
                  <button
                    type="button"
                    className="tf-nav-trigger"
                    onClick={() => {
                      clearNavHoverTimers();
                      if (!hasDropdown) {
                        handleNavItemClick(section.item);
                        return;
                      }
                      setActiveNavDropdown((prev) =>
                        prev === section.key ? null : section.key
                      );
                    }}
                    aria-expanded={hasDropdown ? isOpen : undefined}
                    aria-haspopup={hasDropdown ? "menu" : undefined}
                  >
                    <span>{section.label}</span>
                    {hasDropdown && (
                      <FaChevronDown className="tf-nav-chevron" />
                    )}
                  </button>

                  {hasDropdown && (
                    <div className="tf-nav-dropdown" role="menu">
                      {section.items.map((item) => (
                        <button
                          key={`${section.key}-${item.label}`}
                          type="button"
                          className={`tf-nav-dropdown-item tf-nav-dropdown-item--${section.key} ${
                            item.isChild ? "tf-nav-dropdown-item--child" : ""
                          }`}
                          onClick={() => handleNavItemClick(item)}
                        >
                          <span className="tf-nav-dropdown-item-label">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {/* ================= RIGHT ================= */}

        <div className="user-right-section">
          <CurrencyToggle />
          {/* <ArenaButton /> */}
          {(!isAuthenticated || normalizedRole === "user") && (
            <button
              className="iconic-arena-button"
              onClick={handleIconicArenaClick}
            >
              <video
                src="/arena-animation.mp4"
                className="iconic-arena-video"
                autoPlay
                loop
                muted
                playsInline
              />
              Iconic Arena
            </button>
          )}

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
                      <FaUserCircle className="profile-icon profile-icon-outline" />
                      <span>My Profile</span>
                    </NavLink>

                    <div
                      className="user-profile-dropdown-item"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate(getDashboardRoute());
                      }}
                    >
                      <FaChartLine className="profile-icon profile-icon-outline" />
                      <span>Dashboard</span>
                    </div>

                    {normalizedRole !== "admin" && (
                      <div
                        className="user-profile-dropdown-item"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/wallet");
                        }}
                      >
                        <GiWallet className="profile-icon profile-icon-outline" />
                        <span>My Wallet</span>
                      </div>
                    )}

                    {normalizedRole !== "admin" && (
                      <div
                        className="user-profile-dropdown-item"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/my-carbon-footprint");
                        }}
                      >
                        <FaLeaf className="profile-icon profile-icon-outline" />
                        <span>My Carbon Footprint</span>
                      </div>
                    )}

                    <NavLink
                      to="/settings"
                      className="user-profile-dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <FaCog className="profile-icon profile-icon-outline" />
                      <span>Settings</span>
                    </NavLink>

                    <div
                      className="user-profile-dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="profile-icon profile-icon-outline" />
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
