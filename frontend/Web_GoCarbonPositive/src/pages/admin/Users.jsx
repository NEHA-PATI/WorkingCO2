import React, { useState, useEffect } from "react";
import "../../styles/admin/Users.css";
import {
  FaUpload,
  FaDownload,
  FaUserPlus,
  FaEdit,
  FaEye,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";

import {
  fetchNotifications,
  markAsRead,
} from "../../services/admin/notificationApi";
import {
  approveUser,
  rejectUser,
  getUserByEmail,
  fetchAllUsers, // ✅ NEW (auth service)
} from "../../services/admin/userManagementApi";

const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // OLD: const [pendingApprovals, setPendingApprovals] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "all", role: "all" });
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadNotifications();
    loadUsers();

    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- OLD: PENDING APPROVALS (NOTIFICATIONS) ---------------- */

  // const loadNotifications = async () => {
  //   try {
  //     setLoading(true);

  //     const unreadResponse = await fetchNotifications({
  //       status: "new",
  //       limit: 50,
  //     });

  //     const pending = unreadResponse.data.map((notif) => ({
  //       id: notif.id,
  //       name: notif.username || "Unknown User",
  //       email: notif.email,
  //       userId: notif.user_id,
  //       eventType: notif.event_type,
  //       ipAddress: notif.ip_address,
  //       createdAt: notif.created_at,
  //     }));

  //     setPendingApprovals(pending);
  //   } catch (error) {
  //     console.error("Error loading notifications:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /* ---------------- ALL USERS (AUTH SERVICE) ---------------- */

  const loadUsers = async () => {
    try {
      const res = await fetchAllUsers();
      setAllUsers(res.data); // ✅ real users table
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  /* ---------------- OLD: APPROVE USER ---------------- */

  // const handleApprove = async (notificationId, email) => {
  //   try {
  //     setActionLoading(notificationId);

  //     const userResponse = await getUserByEmail(email);
  //     const userId = userResponse.data.id;

  //     await approveUser(userId);
  //     await markAsRead(notificationId);

  //     await loadNotifications();
  //     await loadUsers();

  //     alert(`User ${email} approved successfully!`);
  //   } catch (error) {
  //     console.error("Error approving user:", error);
  //     alert("Failed to approve user.");
  //   } finally {
  //     setActionLoading(null);
  //   }
  // };

  /* ---------------- OLD: REJECT USER ---------------- */

  // const handleReject = async (notificationId, email) => {
  //   try {
  //     setActionLoading(notificationId);

  //     const reason =
  //       prompt("Enter rejection reason (optional):") ||
  //       "Administrative decision";

  //     const userResponse = await getUserByEmail(email);
  //     const userId = userResponse.data.id;

  //     await rejectUser(userId, reason);
  //     await markAsRead(notificationId);

  //     await loadNotifications();
  //     await loadUsers();

  //     alert(`User ${email} rejected successfully!`);
  //   } catch (error) {
  //     console.error("Error rejecting user:", error);
  //     alert("Failed to reject user.");
  //   } finally {
  //     setActionLoading(null);
  //   }
  // };

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filter.status === "all" || user.status?.toLowerCase() === filter.status;

    const matchesRole =
      filter.role === "all" || user.role?.toLowerCase() === filter.role;

    return matchesSearch && matchesStatus && matchesRole;
  });

  if (loading) {
    return (
      <div className="users-page">
        <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
      </div>
    );
  }

  /* ================= UI BELOW (UNCHANGED) ================= */

  return (
    <div className="users-page">
      {/* HEADER */}
      <div className="users-header">
        <div className="users-header-left">
          <h1>User Management</h1>
          <p>Manage all user accounts, roles, and permissions</p>
        </div>
        <div className="users-header-buttons">
          <button className="users-import">
            <FaUpload /> Import Users
          </button>
          <button className="users-export">
            <FaDownload /> Export Data
          </button>
          <button className="users-edit">
            <FaEdit /> Edit User
          </button>
          <button className="users-add">
            <FaUserPlus /> Add User
          </button>
        </div>
      </div>

      {/* OLD: PENDING APPROVALS */}
      {/* <div className="users-section">
        <h2>
          <IoWarningOutline /> Pending Approvals
          <span className="users-badge">{pendingApprovals.length}</span>
        </h2>

        {pendingApprovals.map((user) => (
          <div key={user.id} className="users-approval-card">
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            <div className="users-actions">
              <button
                className="users-approve"
                onClick={() => handleApprove(user.id, user.email)}
              >
                <FaCheck /> Approve
              </button>
              <button
                className="users-reject"
                onClick={() => handleReject(user.id, user.email)}
              >
                <FaTimes /> Reject
              </button>
            </div>
          </div>
        ))}
      </div> */}

      {/* ALL USERS TABLE */}
      <div className="users-section users-table">
        <h2>All Users ({filteredUsers.length})</h2>
        {/* your existing table stays */}
      </div>
    </div>
  );
};

export default Users;
