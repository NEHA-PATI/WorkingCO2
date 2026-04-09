import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaChartLine,
  FaChevronDown,
  FaCog,
  FaLeaf,
  FaSignOutAlt,
  FaUserCircle,
  FaUserPlus,
} from "react-icons/fa";
import { FiBriefcase } from "react-icons/fi";
import { GiWallet } from "react-icons/gi";

import "@shared/ui/styles/userNavbar.css";

const MARKETPLACE_SESSION_KEY = "marketplace1_auth_session_v1";

const BUY_DROPDOWN_ITEMS = [
  { label: "Browse Listings", to: "browse" },
  { label: "Request PO", to: "/contact" },
  { label: "Request Meeting", to: "/contact" },
  { label: "Large Order", to: "/contact" },
  { label: "Approved Buyer", to: "login" },
];

const RESOURCE_DROPDOWN_ITEMS = [
  { label: "Methodologies", to: "methodology" },
  { label: "Blog", to: "/blog" },
  { label: "FAQ", to: "/faq" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Contact", to: "/contact" },
];

function readMarketplaceSession() {
  try {
    const raw = localStorage.getItem(MARKETPLACE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function getDisplayName(session) {
  return session?.name || session?.username || session?.email || "Marketplace User";
}

function getInitials(value = "") {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`.toUpperCase();
}

function resolveRoute(rootPath, destination) {
  if (!destination) return rootPath;
  if (destination.startsWith("/")) return destination;
  return `${rootPath}/${destination}`;
}

function normalizeLabel(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isItemActive(item, location, activeItem) {
  if (activeItem && normalizeLabel(item.label) === normalizeLabel(activeItem)) {
    return true;
  }

  if (!item.path) return false;
  if (location.pathname === item.path) return true;
  if (item.path === "/") return false;
  return location.pathname.startsWith(`${item.path}/`);
}

export default function MarketplaceNavbar({
  rootPath = "/marketplace",
  activeItem = "listings",
  authSession = null,
  onOpenLogin,
  onOpenSignup,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNavDropdown, setActiveNavDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sessionState, setSessionState] = useState(() => authSession || readMarketplaceSession());

  const menuDropdownRef = useRef(null);
  const navContainerRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navOpenTimerRef = useRef(null);
  const navCloseTimerRef = useRef(null);

  useEffect(() => {
    setSessionState(authSession || readMarketplaceSession());
  }, [authSession]);

  useEffect(() => {
    const onStorage = () => setSessionState(readMarketplaceSession());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isLoggedIn = Boolean(sessionState?.isAuthenticated);
  const displayName = useMemo(() => getDisplayName(sessionState), [sessionState]);
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  const handleLogin = () => {
    setMenuOpen(false);
    if (onOpenLogin) onOpenLogin();
    else navigate(resolveRoute(rootPath, "login"));
  };

  const handleSignup = () => {
    setMenuOpen(false);
    if (onOpenSignup) onOpenSignup();
    else navigate(resolveRoute(rootPath, "signup"));
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setMenuOpen(false);
    localStorage.removeItem(MARKETPLACE_SESSION_KEY);
    setSessionState(null);

    if (onLogout) {
      onLogout();
      return;
    }

    navigate(rootPath);
  };

  const navSections = [
    {
      key: "home",
      label: "Home",
      type: "link",
      item: {
        label: "Home",
        path: rootPath,
      },
    },
    {
      key: "listings",
      label: "Listings",
      type: "link",
      item: {
        label: "Listings",
        path: resolveRoute(rootPath, "browse"),
      },
    },
    {
      key: "buy",
      label: "Buy",
      type: "dropdown",
      items: BUY_DROPDOWN_ITEMS.map((item) => ({
        label: item.label,
        path: resolveRoute(rootPath, item.to),
      })),
    },
    {
      key: "sell",
      label: "Sell",
      type: "link",
      item: {
        label: "Sell",
        path: resolveRoute(rootPath, "sell"),
      },
    },
    {
      key: "resources",
      label: "Resources",
      type: "dropdown",
      items: RESOURCE_DROPDOWN_ITEMS.map((item) => ({
        label: item.label,
        path: resolveRoute(rootPath, item.to),
      })),
    },
    {
      key: "about",
      label: "About",
      type: "link",
      item: {
        label: "About",
        path: "/about",
      },
    },
  ];

  const mobileMenuItems = [
    { label: "Home", path: rootPath },
    { label: "Listings", path: resolveRoute(rootPath, "browse") },
    ...BUY_DROPDOWN_ITEMS.map((item) => ({
      label: item.label,
      path: resolveRoute(rootPath, item.to),
      isChild: true,
    })),
    { label: "Sell", path: resolveRoute(rootPath, "sell") },
    ...RESOURCE_DROPDOWN_ITEMS.map((item) => ({
      label: item.label,
      path: resolveRoute(rootPath, item.to),
      isChild: true,
    })),
    { label: "About", path: "/about" },
    ...(isLoggedIn
      ? [{ label: "Logout", action: "logout", logout: true }]
      : []),
  ];

  const handleNavItemClick = (item) => {
    if (navOpenTimerRef.current) clearTimeout(navOpenTimerRef.current);
    if (navCloseTimerRef.current) clearTimeout(navCloseTimerRef.current);
    setActiveNavDropdown(null);
    if (!item) return;

    if (item.action === "logout") {
      handleLogout();
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
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

  const isDesktopNav = () => window.matchMedia("(min-width: 992px)").matches;

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
      setActiveNavDropdown((current) => (current === sectionKey ? null : current));
      navCloseTimerRef.current = null;
    }, 140);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }

      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        clearNavHoverTimers();
        setActiveNavDropdown(null);
      }

      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
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

  return (
    <div className="user-navbar marketplace1-navbar">
      <div className="user-left-section">
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
            <div className="sidebar-dropdown">
              {mobileMenuItems.map((item) => (
                <div
                  key={item.label}
                  className={`sidebar-item ${item.isChild ? "sidebar-item-child" : ""}`}
                  onClick={() => {
                    setMenuOpen(false);
                    if (item.action === "logout") {
                      handleLogout();
                      return;
                    }
                    if (item.path) navigate(item.path);
                  }}
                >
                  <span
                    className="sidebar-item-label"
                    style={{ color: item.logout ? "#ef4444" : undefined }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="user-logo"
          onClick={() => navigate(rootPath)}
          style={{ cursor: "pointer" }}
        >
          <img
            src="/GoCarbonPositive_LOGO.svg"
            alt="Carbon Positive"
            className="user-logo-icon"
          />
          <span className="user-logo-text">Carbon Positive Marketplace</span>
        </div>
      </div>

      <nav className="tf-nav" ref={navContainerRef}>
        {navSections.map((section) => {
          const hasDropdown = section.type === "dropdown";
          const isOpen = activeNavDropdown === section.key;
          const active =
            normalizeLabel(activeItem) === normalizeLabel(section.key) ||
            (hasDropdown
              ? section.items?.some((item) => isItemActive(item, location, activeItem))
              : isItemActive(section.item, location, activeItem));

          return (
            <div
              key={section.key}
              className={`tf-nav-item tf-nav-item--${section.key} ${
                hasDropdown ? "has-dropdown" : ""
              } ${isOpen ? "is-open" : ""} ${active ? "is-active" : ""}`}
              onMouseEnter={() => handleDesktopNavEnter(section.key, hasDropdown)}
              onMouseLeave={() => handleDesktopNavLeave(section.key, hasDropdown)}
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
                  setActiveNavDropdown((prev) => (prev === section.key ? null : section.key));
                }}
                aria-expanded={hasDropdown ? isOpen : undefined}
                aria-haspopup={hasDropdown ? "menu" : undefined}
              >
                <span>{section.label}</span>
                {hasDropdown && <FaChevronDown className="tf-nav-chevron" />}
              </button>

              {hasDropdown && (
                <div className="tf-nav-dropdown" role="menu">
                  {section.items.map((item) => (
                    <button
                      key={`${section.key}-${item.label}`}
                      type="button"
                      className={`tf-nav-dropdown-item tf-nav-dropdown-item--${section.key}`}
                      onClick={() => handleNavItemClick(item)}
                    >
                      <span className="tf-nav-dropdown-item-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="user-right-section">
        {!isLoggedIn ? (
          <div className="auth-buttons">
            <button className="signup-btn" onClick={handleSignup}>
              <FaUserPlus />
              <span>Sign Up</span>
            </button>

            <button className="login-btn" onClick={handleLogin}>
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
              <div style={{ position: "relative" }}>
                <div className="user-profile-avatar">
                  {sessionState?.profilePic ? (
                    <img
                      src={sessionState.profilePic}
                      alt={displayName}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="user-status-badge" />
              </div>

              <div className="user-profile-info">
                <div className="user-profile-name">{displayName}</div>
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
                    <div className="user-profile-dropdown-name">{displayName}</div>

                    <div className="user-profile-dropdown-email">
                      {sessionState?.email || ""}
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
                      navigate(resolveRoute(rootPath, "portfolio"));
                    }}
                  >
                    <FiBriefcase className="profile-icon profile-icon-outline" />
                    <span>My Portfolio</span>
                  </div>

                  <div
                    className="user-profile-dropdown-item"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/user/dashboard");
                    }}
                  >
                    <FaChartLine className="profile-icon profile-icon-outline" />
                    <span>Dashboard</span>
                  </div>

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
      </div>
    </div>
  );
}
