'use client';

import { motion } from 'framer-motion';
import { ROLE_DEFINITIONS } from '@features/teams/config/teamConfig';
import { FaCheck, FaX } from 'react-icons/fa6';

export default function TeamRoles({ permissions }) {
    const permissionLabels = {
        canViewMembers: 'View Members',
        canInvite: 'Invite',
        canEditRole: 'Edit Role',
        canRemoveMember: 'Remove',
        canManageRoles: 'Manage Roles',
        canViewActivity: 'View Activity',
    };

    const allPermissions = Object.keys(permissionLabels);

    const getRoleColor = (roleId) => {
        const colors = {
            manager: '#3b82f6',
            editor: '#8b5cf6',
            viewer: '#6b7280',
        };
        return colors[roleId] || '#6b7280';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <motion.section
            className="teams-roles-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
        >
            <h2 className="teams-section-title">Role & Permissions</h2>

            <motion.div
                className="teams-roles-table"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Row */}
                <motion.div className="teams-roles-header-row" variants={itemVariants}>
                    <div className="teams-roles-col teams-roles-col--role">Role</div>
                    {allPermissions.map((perm) => (
                        <div
                            key={perm}
                            className="teams-roles-col teams-roles-col--permission"
                            title={permissionLabels[perm]}
                        >
                            <span className="teams-perm-abbr">
                                {permissionLabels[perm].split(' ')[0]}
                            </span>
                        </div>
                    ))}
                </motion.div>

                {/* Role Rows */}
                {ROLE_DEFINITIONS.map((role) => (
                    <motion.div
                        key={role.id}
                        className="teams-roles-row"
                        variants={itemVariants}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                    >
                        <div className="teams-roles-col teams-roles-col--role">
                            <div className="teams-role-header">
                                <div
                                    className="teams-role-dot"
                                    style={{ backgroundColor: getRoleColor(role.id) }}
                                />
                                <div>
                                    <div className="teams-role-name">{role.name}</div>
                                    <div className="teams-role-description">{role.description}</div>
                                </div>
                            </div>
                        </div>

                        {allPermissions.map((perm) => (
                            <div
                                key={`${role.id}-${perm}`}
                                className="teams-roles-col teams-roles-col--permission teams-roles-col--center"
                            >
                                {role.permissions.includes(perm) ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 200,
                                            delay: 0.05,
                                        }}
                                    >
                                        <FaCheck
                                            size={16}
                                            style={{ color: getRoleColor(role.id) }}
                                        />
                                    </motion.div>
                                ) : (
                                    <FaX
                                        size={14}
                                        style={{ color: '#d1d5db', opacity: 0.5 }}
                                    />
                                )}
                            </div>
                        ))}
                    </motion.div>
                ))}
            </motion.div>

            {permissions.canManageRoles && (
                <motion.button
                    className="teams-configure-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Configure Roles
                </motion.button>
            )}
        </motion.section>
    );
}
