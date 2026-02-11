'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "@features/org/styles/QuickActions.css";
import {
  FaPlus,
  FaCloudUploadAlt,
  FaFileAlt,
  FaPaperPlane,
  FaCalculator,
  FaCheckCircle,
  FaClock,
  FaFire,
  FaLeaf,
  FaChartLine,
  FaUsers,
  FaTasks,
  FaSearch,
} from 'react-icons/fa';

const QuickActions = ({ isVisible = true }) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [recentActions, setRecentActions] = useState([
    {
      id: 1,
      title: 'Added Solar Panel Array SP-045',
      time: '2 hours ago',
      status: 'COMPLETED',
      icon: FaLeaf,
      color: '#10b981',
    },
    {
      id: 2,
      title: 'Uploaded verification documents',
      time: '5 hours ago',
      status: 'PENDING',
      icon: FaCloudUploadAlt,
      color: '#f59e0b',
    },
    {
      id: 3,
      title: 'Generated monthly compliance report',
      time: '1 day ago',
      status: 'COMPLETED',
      icon: FaFileAlt,
      color: '#3b82f6',
    },
    {
      id: 4,
      title: 'Submitted Q4 carbon credits',
      time: '2 days ago',
      status: 'COMPLETED',
      icon: FaPaperPlane,
      color: '#8b5cf6',
    },
    {
      id: 5,
      title: 'Team member invitation sent',
      time: '3 days ago',
      status: 'PENDING',
      icon: FaUsers,
      color: '#06b6d4',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAction, setExpandedAction] = useState(null);

  const actions = [
    {
      id: 1,
      title: 'Add New Asset',
      description: 'Register a new carbon reduction asset',
      icon: FaPlus,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      id: 2,
      title: 'Upload Documents',
      description: 'Submit verification documents',
      icon: FaCloudUploadAlt,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      id: 3,
      title: 'Generate Report',
      description: 'Create compliance or progress report',
      icon: FaFileAlt,
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
    {
      id: 4,
      title: 'Submit Credits',
      description: 'Submit carbon credits for verification',
      icon: FaPaperPlane,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      id: 5,
      title: 'Calculate Emissions',
      description: 'Use carbon footprint calculator',
      icon: FaCalculator,
      color: '#ef4444',
      bgColor: '#fee2e2',
    },
    {
      id: 6,
      title: 'Verify Asset',
      description: 'Mark asset verification as complete',
      icon: FaCheckCircle,
      color: '#06b6d4',
      bgColor: '#cffafe',
    },
    {
      id: 7,
      title: 'Track Progress',
      description: 'View ESG progress and milestones',
      icon: FaChartLine,
      color: '#6366f1',
      bgColor: '#e0e7ff',
    },
    {
      id: 8,
      title: 'Manage Tasks',
      description: 'Organize compliance tasks and workflows',
      icon: FaTasks,
      color: '#ec4899',
      bgColor: '#fce7f3',
    },
  ];

  const filteredActions = actions.filter(
    (action) =>
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecentActions = recentActions.filter(
    (action) =>
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const actionCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 10,
      },
    },
    hover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const recentItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
    hover: {
      x: 8,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="org-quickactions-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Quick Actions Section */}
          <motion.div
            className="org-quickactions-section"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              className="org-quickactions-header"
              variants={itemVariants}
            >
              <div>
                <h2 className="org-quickactions-title">Quick Actions</h2>
                <p className="org-quickactions-subtitle">
                  Common tasks and shortcuts for faster workflow
                </p>
              </div>

              {/* Search Bar */}
              <div className="org-quickactions-search-wrapper">
                <FaSearch className="org-quickactions-search-icon" />
                <input
                  type="text"
                  placeholder="Search actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="org-quickactions-search-input"
                />
              </div>
            </motion.div>

            {/* Action Cards Grid */}
            <motion.div
              className="org-quickactions-grid"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <AnimatePresence mode="wait">
                {filteredActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    variants={actionCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setSelectedAction(action.id)}
                    className={`org-quickactions-card ${selectedAction === action.id ? 'org-quickactions-card--selected' : ''}`}
                  >
                    <motion.div
                      className="org-quickactions-card-icon-wrapper"
                      style={{ backgroundColor: action.bgColor }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <action.icon
                        className="org-quickactions-card-icon"
                        style={{ color: action.color }}
                      />
                    </motion.div>

                    <div className="org-quickactions-card-content">
                      <h3 className="org-quickactions-card-title">
                        {action.title}
                      </h3>
                      {/* <p className="org-quickactions-card-description">
                        {action.description}
                      </p> */}
                    </div>

                    <motion.div
                      className="org-quickactions-card-arrow"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M7 10h10M13 6l4 4-4 4"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredActions.length === 0 && (
              <motion.div
                className="org-quickactions-empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="24" cy="24" r="20" strokeWidth="2" />
                  <path
                    d="M24 16v8m0 4v1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <p>No actions match your search</p>
              </motion.div>
            )}
          </motion.div>

          {/* Recent Actions Section - Timeline Style */}
          <motion.div
            className="org-quickactions-recent-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <motion.div className="org-quickactions-recent-header">
              <div>
                <h2 className="org-quickactions-recent-title">
                  Recent Activity
                </h2>
                <p className="org-quickactions-recent-subtitle">
                  Latest updates from your team
                </p>
              </div>
              <motion.div
                className="org-quickactions-recent-stats"
                whileHover={{ scale: 1.05 }}
              >
                <span className="org-quickactions-recent-stat-item">
                  <span className="org-quickactions-stat-badge org-quickactions-stat-badge--completed">
                    {recentActions.filter((a) => a.status === 'COMPLETED').length}
                  </span>
                  Completed
                </span>
                <span className="org-quickactions-recent-stat-item">
                  <span className="org-quickactions-stat-badge org-quickactions-stat-badge--pending">
                    {recentActions.filter((a) => a.status === 'PENDING').length}
                  </span>
                  Pending
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              className="org-quickactions-timeline"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <AnimatePresence mode="popLayout">
                {filteredRecentActions.map((action, index) => {
                  const ActionIcon = action.icon;
                  const isCompleted = action.status === 'COMPLETED';

                  return (
                    <motion.div
                      key={action.id}
                      variants={recentItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="org-quickactions-timeline-item"
                    >
                      {/* Timeline Dot */}
                      <motion.div
                        className={`org-quickactions-timeline-dot org-quickactions-timeline-dot--${action.status.toLowerCase()}`}
                        whileHover={{ scale: 1.3 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        style={{ backgroundColor: action.color }}
                      >
                        <ActionIcon size={12} color="white" />
                      </motion.div>

                      {/* Timeline Line */}
                      {index < filteredRecentActions.length - 1 && (
                        <motion.div
                          className="org-quickactions-timeline-line"
                          initial={{ height: 0 }}
                          animate={{ height: 48 }}
                          transition={{
                            delay: index * 0.05,
                            duration: 0.4,
                            ease: 'easeOut',
                          }}
                        />
                      )}

                      {/* Content Card */}
                      <motion.div
                        className={`org-quickactions-timeline-content ${isCompleted ? 'org-quickactions-timeline-content--completed' : ''}`}
                        whileHover={{ x: 4 }}
                      >
                        <div className="org-quickactions-timeline-header">
                          <h3 className="org-quickactions-timeline-title">
                            {action.title}
                          </h3>
                          <motion.span
                            className={`org-quickactions-timeline-status org-quickactions-timeline-status--${action.status.toLowerCase()}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: 'spring',
                              stiffness: 200,
                              delay: 0.1,
                            }}
                          >
                            {action.status}
                          </motion.span>
                        </div>
                        <p className="org-quickactions-timeline-time">
                          <FaClock size={11} /> {action.time}
                        </p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {filteredRecentActions.length === 0 && (
              <motion.div
                className="org-quickactions-empty org-quickactions-empty--compact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M24 14v20m-8-8h16" strokeWidth="2" />
                  <circle cx="24" cy="24" r="20" strokeWidth="2" />
                </svg>
                <p>No recent actions found</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickActions;
