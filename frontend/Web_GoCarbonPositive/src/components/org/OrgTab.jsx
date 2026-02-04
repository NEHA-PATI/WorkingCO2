import React, { useRef, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import {
  ORG_DEFAULT_TAB_ID,
  ORG_TAB_CONFIG,
  getOrgTabIdFromPath,
  getOrgTabPath,
} from "../../config/orgTabConfig";
import "../../styles/org/OrgTab.css";

const OrgTab = ({ isVisible = true, onTabChange }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const location = useLocation();
  const activeTabId =
    getOrgTabIdFromPath(location.pathname) ?? ORG_DEFAULT_TAB_ID;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      window.addEventListener("scroll", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleClickOutside, true);
    };
  }, [showNotifications]);

  const getNotificationTime = (hours, minutes) => {
    const now = new Date();
    const notifDate = new Date();
    notifDate.setHours(hours, minutes);

    if (notifDate.toDateString() === now.toDateString()) {
      return notifDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
    return notifDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const notifications = useMemo(
    () => [
      {
        id: 1,
        title: "Revenue Updated",
        message: "Q4 earnings are now finalized",
        time: 14,
        min: 32,
        icon: "R",
      },
      {
        id: 2,
        title: "New Team Member",
        message: "Alex joined the compliance team",
        time: 11,
        min: 15,
        icon: "T",
      },
      {
        id: 3,
        title: "Alert: Low Assets",
        message: "Asset balance is below threshold",
        time: 8,
        min: 45,
        icon: "!",
      },
      {
        id: 4,
        title: "System Maintenance",
        message: "Scheduled for tonight 10 PM",
        time: 1,
        min: 0,
        icon: "M",
      },
    ],
    []
  );

  if (!isVisible) return null;

  const handleTabChange = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    setShowNotifications(false);
  };

  return (
    <nav className="org-tab-nav">
      <div className="org-tab-nav-content">
        {ORG_TAB_CONFIG.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.id}
              to={getOrgTabPath(tab.id)}
              end
              className={({ isActive }) =>
                `org-tab-nav-item ${isActive ? "org-tab-nav-active" : ""}`
              }
              onClick={() => handleTabChange(tab.id)}
              style={{ "--tab-color": tab.accent }}
            >
              <Icon className="org-tab-nav-icon" />
              <span className="org-tab-nav-label">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="org-tab-notification-wrapper" ref={notificationRef}>
        <button
          className="org-tab-bell-button"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <FaBell className="org-tab-bell-icon" />
          <span className="org-tab-notification-badge">4</span>
        </button>

        {showNotifications && (
          <div className="org-tab-notification-dropdown">
            <div className="org-tab-notification-header">
              <h3>Notifications</h3>
              <button className="org-tab-mark-read">Mark all as read</button>
            </div>
            <div className="org-tab-notification-list">
              {notifications.map((notif) => (
                <div key={notif.id} className="org-tab-notification-item">
                  <div className="org-tab-notification-icon">{notif.icon}</div>
                  <div className="org-tab-notification-content">
                    <p className="org-tab-notification-title">{notif.title}</p>
                    <p className="org-tab-notification-message">
                      {notif.message}
                    </p>
                  </div>
                  <div className="org-tab-notification-time">
                    {getNotificationTime(notif.time, notif.min)}
                  </div>
                </div>
              ))}
            </div>
            <div className="org-tab-notification-footer">
              <button>View all notifications</button>
            </div>
          </div>
        )}
      </div>

      <div className={`org-tab-nav-underline org-tab-underline-${activeTabId}`} />
    </nav>
  );
};

export default OrgTab;
