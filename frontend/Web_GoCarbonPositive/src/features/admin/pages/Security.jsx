import React, { useState } from "react";
import "@features/admin/styles/Security.css";
import {
  FaUserShield,
  FaLock,
  FaKey,
  FaDatabase,
  FaCheckCircle,
  FaUserPlus,
  FaBell,
  FaClipboardList,
  FaShieldAlt,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const Security = () => {
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showAddAdminPopup, setShowAddAdminPopup] = useState(false);

  return (
    <div className="security-page-container">
      {/* Header */}
      <div className="security-header">
        <div className="security-title-section">
          <h2>Security & Access Control</h2>
          <p>
            Manage authentication, environmental data permissions, and system
            integrity.
          </p>
        </div>

        <div className="security-header-actions">
          <div className="data-integrity">
            <FaDatabase className="data-icon" />
            <span>Data Integrity</span>
            <strong>92%</strong>
          </div>
          <button
            className="update-btn"
            onClick={() => setShowUpdatePopup(true)}
          >
            <FaClipboardList /> Update Policies
          </button>
          <button className="add-btn" onClick={() => setShowAddAdminPopup(true)}>
            <FaUserPlus /> Add Admin
          </button>
        </div>
      </div>

      {/* Authentication Settings */}
      <div className="security-card">
        <div className="section-heading">
          <FaUserShield className="section-icon green" />
          <h3>Authentication Settings</h3>
        </div>
        <div className="auth-grid">
          {[
            {
              icon: <FaLock />,
              title: "Two-Factor Authentication (2FA)",
              desc: "Enhance login security for carbon project admins.",
            },
            {
              icon: <FaBell />,
              title: "Login Alerts",
              desc: "Receive notifications for suspicious or failed logins.",
            },
            {
              icon: <FaKey />,
              title: "Session Timeout",
              desc: "Automatically log out inactive sessions for data protection.",
            },
            {
              icon: <FaShieldAlt />,
              title: "API Access Lock",
              desc: "Restrict unauthorized API requests to sensitive carbon datasets.",
            },
          ].map((item, i) => (
            <div className="auth-item" key={i}>
              <h4>{item.icon} {item.title}</h4>
              <p>{item.desc}</p>
              <label className="switch">
                <input type="checkbox" defaultChecked={i < 3} />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Data Access Policy */}
      <div className="security-card">
        <div className="section-heading">
          <FaKey className="section-icon blue" />
          <h3>Data Access & Protection Policy</h3>
        </div>
        <div className="policy-grid">
          {[
            "Require verified carbon project credentials",
            "Allow access only from whitelisted IPs",
            "Enable encrypted data transfer (SSL/TLS)",
            "Auto-expire API tokens after 24 hours",
            "Restrict bulk export of carbon offset records",
          ].map((rule, index) => (
            <div className="policy-item" key={index}>
              <FaCheckCircle className="green" /> {rule}
            </div>
          ))}
        </div>
        <p className="policy-note">
          These policies ensure the integrity and transparency of carbon
          accounting data.
        </p>
      </div>

      {/* Active Admins & Login Attempts */}
      <div className="security-dual-section">
        <div className="security-card">
          <div className="section-heading">
            <FaUserShield className="section-icon blue" />
            <h3>Active Admins</h3>
          </div>
          <p>Monitor admin and organization access activity in real-time.</p>
          <div className="admin-list">
            {[
              {
                initials: "AM",
                name: "Alex Morgan",
                role: "Carbon Analyst",
                status: "Active",
                color: "green",
              },
              {
                initials: "JS",
                name: "Jordan Smith",
                role: "Verifier",
                status: "Pending Verification",
                color: "yellow",
              },
              {
                initials: "CL",
                name: "Chris Lee",
                role: "Auditor",
                status: "Suspended",
                color: "red",
              },
            ].map((admin, index) => (
              <div className="admin-card" key={index}>
                <div className="admin-avatar">{admin.initials}</div>
                <div className="admin-info">
                  <h4>{admin.name}</h4>
                  <div className="admin-tags">
                    <span className="role-tag">{admin.role}</span>
                    <span className={`status-tag ${admin.color}`}>
                      {admin.status}
                    </span>
                    <span className="contact">✉ Contact</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="security-card">
          <div className="section-heading">
            <FaShieldAlt className="section-icon yellow" />
            <h3>Recent Login Attempts</h3>
          </div>
          <p>Monitor recent admin and organization access activity.</p>
          <div className="login-list">
            {[
              {
                date: "2025-10-24 10:11",
                ip: "192.168.0.12",
                device: "Chrome · macOS",
                status: "Success",
              },
              {
                date: "2025-10-24 09:48",
                ip: "66.249.66.1",
                device: "Safari · iPhone",
                status: "Failed",
              },
              {
                date: "2025-10-23 18:40",
                ip: "10.0.0.5",
                device: "Edge · Windows",
                status: "Success",
              },
            ].map((log, index) => (
              <div className="login-card" key={index}>
                <p><strong>{log.date}</strong></p>
                <p>IP: {log.ip} · {log.device}</p>
                <span className={`login-status ${log.status === "Success" ? "green" : "red"}`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Logs */}
      <div className="security-card">
        <div className="section-heading">
          <FaLock className="section-icon blue" />
          <h3>Security Logs</h3>
        </div>
        <div className="logs-controls">
          <div className="search-bar">
            <FaSearch />
            <input type="text" placeholder="Search events, users, or time..." />
          </div>
          <div className="filter">
            <FaFilter /> <span>All</span>
          </div>
          <span className="failed-badge">1 recent failed</span>
        </div>

        <table className="logs-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>User</th>
              <th>Timestamp</th>
              <th>Sensitivity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Policy Updated</td>
              <td>Alex Morgan</td>
              <td>2025-10-24 10:13</td>
              <td><span className="badge high">High</span></td>
              <td><span className="badge success">Success</span></td>
            </tr>
            <tr>
              <td>Failed login</td>
              <td>Chris Lee</td>
              <td>2025-10-24 09:51</td>
              <td><span className="badge moderate">Moderate</span></td>
              <td><span className="badge failed">Failed</span></td>
            </tr>
            <tr>
              <td>Data Export Attempt</td>
              <td>Jordan Smith</td>
              <td>2025-10-23 18:42</td>
              <td><span className="badge high">High</span></td>
              <td><span className="badge unauthorized">Unauthorized</span></td>
            </tr>
            <tr>
              <td>2FA Enabled</td>
              <td>Priya Patel</td>
              <td>2025-10-23 16:10</td>
              <td><span className="badge low">Low</span></td>
              <td><span className="badge success">Success</span></td>
            </tr>
          </tbody>
        </table>

        <div className="logs-actions">
          <button className="export-btn blue">Export CSV</button>
          <button className="export-btn blue">Export PDF</button>
          <button className="view-all-btn">View All Logs</button>
        </div>
      </div>
    </div>
  );
};

export default Security;
