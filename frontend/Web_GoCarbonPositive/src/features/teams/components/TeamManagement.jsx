"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaUserPlus,
  FaCrown,
  FaEye,
  FaEdit,
  FaShieldAlt,
  FaUser,
  FaEnvelope,
  FaCog,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartLine,
  FaEllipsisV,
} from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Label,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/basic-ui";
import "@features/teams/styles/TeamManagement.css";

// Simple Dropdown Component
const SimpleDropdown = ({ trigger, children, align = "left" }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="team-dropdown-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <>
          <div
            className="team-fixed team-inset-0 team-z-40"
            onClick={() => setOpen(false)}
          />
          <motion.div
            className={`team-dropdown-content ${
              align === "end" ? "team-dropdown-content-end" : ""
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {React.Children.map(children, (child) =>
              React.cloneElement(child, { onClick: () => setOpen(false) })
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

const DropdownItem = ({ children, onClick, className }) => (
  <motion.div
    className={`team-dropdown-item ${className || ""}`}
    onClick={onClick}
    whileHover={{ backgroundColor: "var(--color-card-bg-hover)" }}
  >
    {children}
  </motion.div>
);

const TeamManagement = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Mock team members data
  const teamMembers = [
    {
      id: "USER-001",
      name: "John Smith",
      email: "john.smith@company.com",
      role: "Admin",
      department: "Sustainability",
      joinDate: "2023-01-15",
      lastActive: "2 hours ago",
      status: "Active",
      phone: "+1 (555) 123-4567",
    },
    {
      id: "USER-002",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Editor",
      department: "Environmental",
      joinDate: "2023-03-20",
      lastActive: "1 day ago",
      status: "Active",
      phone: "+1 (555) 234-5678",
    },
    {
      id: "USER-003",
      name: "Mike Wilson",
      email: "mike.wilson@company.com",
      role: "Viewer",
      department: "Operations",
      joinDate: "2023-06-10",
      lastActive: "3 days ago",
      status: "Active",
      phone: "+1 (555) 345-6789",
    },
    {
      id: "USER-004",
      name: "Emma Davis",
      email: "emma.davis@company.com",
      role: "Editor",
      department: "Compliance",
      joinDate: "2023-08-05",
      lastActive: "5 hours ago",
      status: "Active",
      phone: "+1 (555) 456-7890",
    },
    {
      id: "USER-005",
      name: "David Brown",
      email: "david.brown@company.com",
      role: "Viewer",
      department: "Fleet",
      joinDate: "2023-11-12",
      lastActive: "1 week ago",
      status: "Inactive",
      phone: "+1 (555) 567-8901",
    },
    {
      id: "USER-006",
      name: "Lisa Anderson",
      email: "lisa.anderson@company.com",
      role: "Editor",
      department: "Analytics",
      joinDate: "2024-01-08",
      lastActive: "Never",
      status: "Pending",
    },
  ];

  // Mock activity logs
  const activityLogs = [
    {
      id: "LOG-001",
      userId: "USER-001",
      action: "Updated asset verification",
      target: "Solar Farm #3",
      timestamp: "2024-01-22 14:30",
      type: "edit",
    },
    {
      id: "LOG-002",
      userId: "USER-002",
      action: "Generated compliance report",
      target: "EU ETS Q4 Report",
      timestamp: "2024-01-22 13:15",
      type: "create",
    },
    {
      id: "LOG-003",
      userId: "USER-004",
      action: "Viewed team dashboard",
      target: "Dashboard Overview",
      timestamp: "2024-01-22 12:45",
      type: "view",
    },
    {
      id: "LOG-004",
      userId: "USER-003",
      action: "Logged into system",
      target: "System Login",
      timestamp: "2024-01-22 09:20",
      type: "login",
    },
    {
      id: "LOG-005",
      userId: "USER-001",
      action: "Deleted old asset record",
      target: "EV-OLD-001",
      timestamp: "2024-01-21 16:00",
      type: "delete",
    },
  ];

  // Filter team members
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "team-badge-red";
      case "Editor":
        return "team-badge-blue";
      case "Viewer":
        return "team-badge-green";
      default:
        return "team-badge-gray";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return FaCrown;
      case "Editor":
        return FaEdit;
      case "Viewer":
        return FaEye;
      default:
        return FaUser;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "team-badge-green";
      case "Inactive":
        return "team-badge-gray";
      case "Pending":
        return "team-badge-yellow";
      default:
        return "team-badge-gray";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "create":
        return FaCheckCircle;
      case "edit":
        return FaEdit;
      case "delete":
        return FaTrash;
      case "view":
        return FaEye;
      case "login":
        return FaUser;
      default:
        return FaChartLine;
    }
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowMemberDetails(true);
  };

  const handlePromoteRole = (memberId, newRole) => {
    console.log(`Promoting member ${memberId} to ${newRole}`);
  };

  const handleRemoveMember = (memberId) => {
    console.log(`Removing member ${memberId}`);
  };

  const roleStats = {
    admin: teamMembers.filter((m) => m.role === "Admin").length,
    editor: teamMembers.filter((m) => m.role === "Editor").length,
    viewer: teamMembers.filter((m) => m.role === "Viewer").length,
    active: teamMembers.filter((m) => m.status === "Active").length,
    pending: teamMembers.filter((m) => m.status === "Pending").length,
  };

  return (
    <motion.div
      className="team-space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <div className="team-flex team-items-center team-justify-between">
        <div>
          <h1 className="team-text-xl team-font-bold">Team Management</h1>
          <p className="team-text-secondary team-mt-1">
            Manage team members, roles, and permissions
          </p>
        </div>
        <div className="team-flex team-items-center team-space-x-3">
          <Button variant="outline">
            <FaCog className="team-w-4 team-h-4 team-mr-2" />
            Role Settings
          </Button>
          <Button onClick={() => setShowInviteModal(true)}>
            <FaUserPlus
              size={20}
              style={{ color: "#3b82f6", marginRight: "8px" }}
            />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Team Statistics */}
      <div className="team-grid-5 team-md-grid-5">
        {[
          {
            value: teamMembers.length,
            label: "Total Members",
            color: "team-text",
            icon: FaUsers,
            iconColor: "team-blue",
          },
          {
            value: roleStats.admin,
            label: "Admins",
            color: "team-text-red-600",
            icon: FaCrown,
            iconColor: "team-orange",
          },
          {
            value: roleStats.editor,
            label: "Editors",
            color: "team-text-blue-600",
            icon: FaEdit,
            iconColor: "team-violet",
          },
          {
            value: roleStats.viewer,
            label: "Viewers",
            color: "team-text-green-600",
            icon: FaEye,
            iconColor: "team-sky",
          },
          {
            value: roleStats.pending,
            label: "Pending",
            color: "team-text-yellow-600",
            icon: FaChartLine,
            iconColor: "team-orange",
          },
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="team-card-stats">
                <CardContent className="team-p-4 team-text-center">
                  <div className="team-flex team-items-center team-justify-center team-mb-2">
                    <div className={`team-icon ${stat.iconColor}`}>
                      <IconComponent />
                    </div>
                  </div>
                  <div className={`team-text-2xl team-font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="team-text-sm team-text-secondary">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="team-filterbar-container">
        <div className="team-filterbar-row">
          <span className="team-filterbar-label">Filter</span>
          <div className="team-filterbar-pills">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="team-filter-pill"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div className="team-filterbar-search">
            <Input
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="team-filterbar-search-input"
            />
          </div>
        </div>
      </div>

      <div className="team-space-y-6">
        {/* Team Members - New Innovative Design */}
        <Card className="team-card-elevated">
          <CardHeader>
            <div className="team-flex team-items-center team-justify-between">
              <div className="team-flex team-items-center">
                <div className="team-icon-container-modern team-blue">
                  <FaUsers
                    size={24}
                    style={{ color: "#8b5cf6", marginRight: "8px" }}
                  />
                </div>
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Active team collaboration</CardDescription>
                </div>
              </div>
              <div className="team-team-stats-mini">
                <span className="team-stat-bubble team-active">
                  {roleStats.active}
                </span>
                <span className="team-stat-label">Active</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="team-team-grid">
              {filteredMembers.map((member, index) => {
                const RoleIcon = getRoleIcon(member.role);
                return (
                  <motion.div
                    key={member.id}
                    className="team-team-member-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="team-member-header">
                      <div className="team-avatar-container">
                        <Avatar className="team-member-avatar">
                          <AvatarImage
                            src={member.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`team-status-dot ${member.status.toLowerCase()}`}
                        ></div>
                      </div>
                      <div className="team-member-actions">
                        <SimpleDropdown
                          trigger={
                            <button className="team-action-button">
                              <FaEllipsisV className="team-w-4 team-h-4" />
                            </button>
                          }
                          align="end"
                        >
                          <DropdownItem
                            onClick={() => handleViewMember(member)}
                          >
                            <FaUser
                              size={20}
                              style={{ color: "#10b981", marginRight: "8px" }}
                            />
                            View Profile
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              handlePromoteRole(
                                member.id,
                                member.role === "Viewer" ? "Editor" : "Admin"
                              )
                            }
                          >
                            <FaShieldAlt className="team-w-4 team-h-4 team-mr-2" />
                            {member.role === "Admin" ? "Demote" : "Promote"}
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => handleRemoveMember(member.id)}
                            className="team-text-red"
                          >
                            <FaTrash className="team-w-4 team-h-4 team-mr-2" />
                            Remove
                          </DropdownItem>
                        </SimpleDropdown>
                      </div>
                    </div>

                    <div className="team-member-info">
                      <h3 className="team-member-name">{member.name}</h3>
                      <p className="team-member-email">{member.email}</p>

                      <div className="team-member-meta">
                        <div className="team-role-badge-modern">
                          <RoleIcon className="team-w-3 team-h-3" />
                          <span>{member.role}</span>
                        </div>
                        <div className="team-department-tag">
                          {member.department}
                        </div>
                      </div>

                      <div className="team-member-activity">
                        <span className="team-activity-text">
                          Last active: {member.lastActive}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity - Timeline Design */}
        <Card className="team-card-elevated">
          <CardHeader>
            <div className="team-flex team-items-center team-justify-between">
              <div className="team-flex team-items-center">
                <div className="team-icon-container-modern team-green">
                  <FaChartLine className="team-mr-2" />
                </div>
                <div>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>Real-time team actions</CardDescription>
                </div>
              </div>
              <div className="team-activity-filter">
                <button className="team-filter-chip team-active">All</button>
                <button className="team-filter-chip">Today</button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="team-activity-timeline">
              {activityLogs.map((log, index) => {
                const ActivityIconComponent = getActivityIcon(log.type);
                const member = teamMembers.find((m) => m.id === log.userId);
                const iconColor =
                  log.type === "create"
                    ? "team-green"
                    : log.type === "edit"
                    ? "team-violet"
                    : log.type === "delete"
                    ? "team-red"
                    : log.type === "view"
                    ? "team-sky"
                    : "team-purple";

                return (
                  <motion.div
                    key={log.id}
                    className="team-timeline-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="team-timeline-marker">
                      <div className={`team-timeline-icon ${iconColor}`}>
                        <ActivityIconComponent />
                      </div>
                      <div className="team-timeline-line"></div>
                    </div>

                    <div className="team-timeline-content">
                      <div className="team-activity-header">
                        <div className="team-activity-user">
                          <Avatar className="team-activity-avatar">
                            <AvatarFallback>
                              {member?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("") || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="team-user-name">
                              {member?.name}
                            </span>
                            <span className="team-activity-time">
                              {log.timestamp}
                            </span>
                          </div>
                        </div>
                        <div className={`team-activity-type-badge ${log.type}`}>
                          {log.type}
                        </div>
                      </div>

                      <div className="team-activity-details">
                        <p className="team-activity-action">{log.action}</p>
                        <div className="team-activity-target">
                          <span className="team-target-label">Target:</span>
                          <span className="team-target-value">
                            {log.target}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite Member Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="team-flex team-items-center">
              <FaUserPlus
                size={20}
                style={{ color: "#f97316", marginRight: "8px" }}
              />
              Invite Team Member
            </DialogTitle>
            <DialogDescription>
              Send an invitation to join your organization
            </DialogDescription>
          </DialogHeader>
          <motion.div
            className="team-space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select id="role" className="team-select">
                <option value="">Select role</option>
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <select id="department" className="team-select">
                <option value="">Select department</option>
                <option value="sustainability">Sustainability</option>
                <option value="environmental">Environmental</option>
                <option value="operations">Operations</option>
                <option value="compliance">Compliance</option>
                <option value="fleet">Fleet</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>
            <div className="team-flex team-justify-end team-space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </Button>
              <Button>Send Invitation</Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Member Details Modal */}
      <Dialog open={showMemberDetails} onOpenChange={setShowMemberDetails}>
        <DialogContent className="team-max-w-2xl">
          <DialogHeader>
            <DialogTitle className="team-flex team-items-center">
              <FaUser
                size={20}
                style={{ color: "#ef4444", marginRight: "8px" }}
              />
              Member Profile
            </DialogTitle>
            <DialogDescription>
              Detailed information about team member
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <motion.div
              className="team-space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="team-flex team-items-center team-space-x-4">
                <Avatar className="team-avatar-lg">
                  <AvatarImage
                    src={selectedMember.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback className="team-text-lg">
                    {selectedMember.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="team-text-xl team-font-semibold">
                    {selectedMember.name}
                  </h3>
                  <p className="team-text-secondary">{selectedMember.email}</p>
                  <div className="team-flex team-items-center team-space-x-2 team-mt-2">
                    <Badge className={getRoleColor(selectedMember.role)}>
                      {selectedMember.role}
                    </Badge>
                    <Badge className={getStatusColor(selectedMember.status)}>
                      {selectedMember.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="team-grid-2">
                <div>
                  <Label className="team-text-sm team-font-medium team-text-secondary">
                    Department
                  </Label>
                  <p className="team-text-lg">{selectedMember.department}</p>
                </div>
                <div>
                  <Label className="team-text-sm team-font-medium team-text-secondary">
                    Join Date
                  </Label>
                  <p className="team-text-lg">{selectedMember.joinDate}</p>
                </div>
                <div>
                  <Label className="team-text-sm team-font-medium team-text-secondary">
                    Phone
                  </Label>
                  <p className="team-text-lg">
                    {selectedMember.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="team-text-sm team-font-medium team-text-secondary">
                    Last Active
                  </Label>
                  <p className="team-text-lg">{selectedMember.lastActive}</p>
                </div>
              </div>
              <div className="team-flex team-justify-end team-space-x-2 team-pt-4 team-border-t">
                <Button variant="outline">
                  <FaEnvelope className="team-w-4 team-h-4 team-mr-2" />
                  Send Email
                </Button>
                <Button variant="outline">
                  <FaEdit className="team-w-4 team-h-4 team-mr-2" />
                  Edit Profile
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default TeamManagement;
