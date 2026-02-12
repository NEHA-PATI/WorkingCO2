'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaCircleCheck, FaClock } from 'react-icons/fa6';
import {
  TEAM_PERMISSIONS,
  MOCK_TEAM_MEMBERS,
  MOCK_ACTIVITY,
} from '@features/teams/config/teamConfig';
import TeamHeader from '@features/teams/components/TeamHeader';
import TeamMembers from '@features/teams/components/TeamMember';
import TeamActivity from '@features/teams/components/TeamActivity';
import InviteMemberModal from '@features/teams/components/InviteMemberModal';
import '@features/teams/styles/Team.css';

export default function Team({ isVisible = true }) {
  const [currentRole] = useState('manager');
  const [members, setMembers] = useState(MOCK_TEAM_MEMBERS);
  const [activity] = useState(MOCK_ACTIVITY);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const permissions = TEAM_PERMISSIONS[currentRole];
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const pendingMembers = members.filter((m) => m.status === 'pending').length;

  const handleInviteMember = () => {
    setShowInviteModal(true);
  };

  const handleAddMember = (newMember) => {
    setMembers([...members, { ...newMember, id: Date.now() }]);
    setShowInviteModal(false);
  };

  const handleRemoveMember = (memberId) => {
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const handleEditRole = (memberId, newRole) => {
    setMembers(
      members.map((m) =>
        m.id === memberId ? { ...m, role: newRole } : m
      )
    );
  };

  if (!isVisible) return null;

  return (
    <motion.section
      className="teams-root"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TeamHeader
        permissions={permissions}
        currentRole={currentRole}
        onInvite={handleInviteMember}
      />

      {/* Stats Cards */}
      <motion.div
        className="teams-stats-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.div
          className="teams-stat-card"
          whileHover={{ translateY: -2 }}
        >
          <div className="teams-stat-icon teams-stat-icon--users">
            <FaUsers size={20} />
          </div>
          <div className="teams-stat-content">
            <p className="teams-stat-label">Total Members</p>
            <p className="teams-stat-value">{members.length}</p>
          </div>
        </motion.div>

        <motion.div
          className="teams-stat-card"
          whileHover={{ translateY: -2 }}
        >
          <div className="teams-stat-icon teams-stat-icon--active">
            <FaCircleCheck size={20} />
          </div>
          <div className="teams-stat-content">
            <p className="teams-stat-label">Active Members</p>
            <p className="teams-stat-value">{activeMembers}</p>
          </div>
        </motion.div>

        <motion.div
          className="teams-stat-card"
          whileHover={{ translateY: -2 }}
        >
          <div className="teams-stat-icon teams-stat-icon--pending">
            <FaClock size={20} />
          </div>
          <div className="teams-stat-content">
            <p className="teams-stat-label">Pending Invites</p>
            <p className="teams-stat-value">{pendingMembers}</p>
          </div>
        </motion.div>

        <motion.div
          className="teams-stat-card"
          whileHover={{ translateY: -2 }}
        >
          <div className="teams-stat-icon teams-stat-icon--role">
            <span className="teams-role-badge">{currentRole}</span>
          </div>
          <div className="teams-stat-content">
            <p className="teams-stat-label">Your Role</p>
            <p className="teams-stat-value-role">{currentRole}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <section className="teams-main-content">
        <div className="teams-left-section">
          <TeamMembers
            members={members}
            permissions={permissions}
            onRemoveMember={handleRemoveMember}
            onEditRole={handleEditRole}
            onInvite={handleInviteMember}
          />
        </div>

        <div className="teams-right-section">
          <TeamActivity activity={activity} />
        </div>
      </section>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <InviteMemberModal
            isOpen={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            onSubmit={handleAddMember}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
