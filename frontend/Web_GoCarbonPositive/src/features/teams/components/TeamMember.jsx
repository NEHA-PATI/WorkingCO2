'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEllipsisVertical, FaTrash, FaPen, FaEye } from 'react-icons/fa6';

export default function TeamMembers({
    members,
    permissions,
    onRemoveMember,
    onEditRole,
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedMember, setExpandedMember] = useState(null);

    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            const matchesSearch =
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'all' || member.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [members, searchQuery, roleFilter, statusFilter]);

    const getRoleColor = (role) => {
        const colors = {
            manager: '#3b82f6',
            editor: '#8b5cf6',
            viewer: '#6b7280',
        };
        return colors[role] || '#6b7280';
    };

    const getRoleBgColor = (role) => {
        const colors = {
            manager: '#eff6ff',
            editor: '#faf5ff',
            viewer: '#f3f4f6',
        };
        return colors[role] || '#f3f4f6';
    };

    const getStatusColor = (status) => {
        return status === 'active' ? '#10b981' : '#f59e0b';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    };

    return (
        <motion.section
            className="teams-members-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
        >
            <h2 className="teams-section-title">Team Members</h2>

            {/* Filter Bar */}
            <div className="teams-filter-bar">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="teams-search-input"
                />

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="teams-select-input"
                >
                    <option value="all">All Roles</option>
                    <option value="manager">Manager</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="teams-select-input"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            {/* Members Grid */}
            <motion.div
                className="teams-members-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence mode="popLayout">
                    {filteredMembers.map((member) => (
                        <motion.div
                            key={member.id}
                            className="teams-member-card"
                            variants={itemVariants}
                            exit="exit"
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        >
                            {/* Avatar & Basic Info */}
                            <div className="teams-member-header">
                                <div className="teams-member-avatar">{member.avatar}</div>

                                <div className="teams-member-info">
                                    <h3 className="teams-member-name">{member.name}</h3>
                                    <p className="teams-member-email">{member.email}</p>

                                    <div className="teams-member-badges">
                                        <span
                                            className="teams-member-role-badge"
                                            style={{
                                                backgroundColor: getRoleBgColor(member.role),
                                                color: getRoleColor(member.role),
                                            }}
                                        >
                                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                        </span>

                                        <span
                                            className="teams-member-status-badge"
                                            style={{
                                                backgroundColor: getStatusColor(member.status) + '20',
                                                color: getStatusColor(member.status),
                                            }}
                                        >
                                            {member.status === 'active' ? '● Active' : '⊙ Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="teams-member-details">
                                <div className="teams-detail-item">
                                    <span className="teams-detail-label">Department</span>
                                    <span className="teams-detail-value">{member.department}</span>
                                </div>
                                <div className="teams-detail-item">
                                    <span className="teams-detail-label">Last Active</span>
                                    <span className="teams-detail-value">{member.last_active}</span>
                                </div>
                            </div>

                            {/* Actions Dropdown */}
                            {permissions.canViewMembers && (
                                <div className="teams-member-actions">
                                    <motion.button
                                        className="teams-action-btn"
                                        onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaEllipsisVertical size={16} />
                                    </motion.button>

                                    <AnimatePresence>
                                        {expandedMember === member.id && (
                                            <motion.div
                                                className="teams-action-dropdown"
                                                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <button className="teams-action-item">
                                                    <FaEye size={14} /> View
                                                </button>

                                                {permissions.canEditRole && (
                                                    <button
                                                        className="teams-action-item"
                                                        onClick={() => {
                                                            const newRole =
                                                                member.role === 'manager'
                                                                    ? 'editor'
                                                                    : member.role === 'editor'
                                                                        ? 'viewer'
                                                                        : 'manager';
                                                            onEditRole(member.id, newRole);
                                                            setExpandedMember(null);
                                                        }}
                                                    >
                                                        <FaPen size={14} /> Edit Role
                                                    </button>
                                                )}

                                                {permissions.canRemoveMember && (
                                                    <button
                                                        className="teams-action-item teams-action-item--danger"
                                                        onClick={() => {
                                                            onRemoveMember(member.id);
                                                            setExpandedMember(null);
                                                        }}
                                                    >
                                                        <FaTrash size={14} /> Remove
                                                    </button>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredMembers.length === 0 && (
                <motion.div
                    className="teams-empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <p>No team members found</p>
                </motion.div>
            )}
        </motion.section>
    );
}
