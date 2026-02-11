'use client';

import { motion } from 'framer-motion';
import { FaUserPlus, FaGear } from 'react-icons/fa6';

export default function TeamHeader({
    permissions,
    currentRole,
    onInvite,
}) {
    const roleColors = {
        manager: '#3b82f6',
        editor: '#10b981',
        viewer: '#6b7280',
    };

    return (
        <motion.header
            className="teams-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="teams-header-left">
                <h1 className="teams-header-title">Team Members</h1>
                <p className="teams-header-subtitle">
                    Manage your team and collaborate seamlessly
                </p>
            </div>

            <div className="teams-header-right">
                <div className="teams-header-role">
                    <span className="teams-header-role-label">Current Role:</span>
                    <motion.span
                        className="teams-header-role-badge"
                        style={{ borderColor: roleColors[currentRole] }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <span
                            className="teams-header-role-dot"
                            style={{ backgroundColor: roleColors[currentRole] }}
                        />
                        {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                    </motion.span>
                </div>

                {permissions.canInvite && (
                    <motion.button
                        className="teams-header-btn teams-header-btn--primary"
                        onClick={onInvite}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaUserPlus size={16} />
                        <span>Invite Member</span>
                    </motion.button>
                )}
            </div>
        </motion.header>
    );
}
