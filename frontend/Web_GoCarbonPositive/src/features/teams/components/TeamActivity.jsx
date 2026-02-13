'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaGear, FaClock } from 'react-icons/fa6';

export default function TeamActivity({ activity }) {
    const getActionIcon = (action) => {
        if (action.includes('Added') || action.includes('Invited')) {
            return FaUser;
        }
        if (action.includes('role') || action.includes('permissions')) {
            return FaGear;
        }
        return FaClock;
    };

    const getActionColor = (action) => {
        if (action.includes('Removed')) return '#ef4444';
        if (action.includes('Added') || action.includes('Invited')) return '#10b981';
        if (action.includes('Changed') || action.includes('Updated')) return '#f59e0b';
        return '#3b82f6';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: 10, transition: { duration: 0.2 } },
    };

    return (
        <motion.section
            className="teams-activity-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
        >
            <h2 className="teams-section-title">Activity Timeline</h2>

            <motion.div
                className="teams-activity-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence mode="popLayout">
                    {activity.map((item, index) => {
                        const ActionIcon = getActionIcon(item.action);
                        const actionColor = getActionColor(item.action);

                        return (
                            <motion.div
                                key={item.id}
                                className="teams-activity-item"
                                variants={itemVariants}
                                exit="exit"
                                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                            >
                                {/* Timeline Dot */}
                                <motion.div
                                    className="teams-activity-dot"
                                    style={{ backgroundColor: actionColor }}
                                    whileHover={{ scale: 1.2 }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 200,
                                        delay: index * 0.05,
                                    }}
                                >
                                    <ActionIcon size={12} color="white" />
                                </motion.div>

                                {/* Timeline Line */}
                                {index < activity.length - 1 && (
                                    <motion.div
                                        className="teams-activity-line"
                                        initial={{ height: 0 }}
                                        animate={{ height: 48 }}
                                        transition={{
                                            delay: index * 0.05,
                                            duration: 0.4,
                                        }}
                                    />
                                )}

                                {/* Content */}
                                <div className="teams-activity-content">
                                    <div className="teams-activity-action">
                                        <span className="teams-activity-user">{item.performed_by}</span>
                                        <span className="teams-activity-verb">{item.action}</span>
                                        {item.metadata.role && (
                                            <span className="teams-activity-role">
                                                {item.metadata.role}
                                            </span>
                                        )}
                                    </div>
                                    <span className="teams-activity-timestamp">{item.timestamp}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>
        </motion.section>
    );
}
