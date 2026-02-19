'use client';

import React, { useState, useEffect } from 'react';
import {
  FaLeaf,
  FaCloud,
  FaBox,
  FaStar,
  FaChartLine,
  FaFolderOpen,
  FaDollarSign,
  FaUsers,
  FaBullseye,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGlobe,
  FaArrowUp,
} from 'react-icons/fa';
import "@features/org/styles/Overview.css";

const Overview = () => {
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  // Stat Cards Data
  const statCards = [
    {
      id: 1,
      title: 'Total Carbon Credits',
      value: '0',
      trend: '+12.5%',
      icon: FaLeaf,
      color: '#10b981',
    },
    {
      id: 2,
      title: 'CO₂ Reduced (Tons)',
      value: '0',
      trend: '+8.2%',
      icon: FaCloud,
      color: '#3b82f6',
    },
    {
      id: 3,
      title: 'Active Assets',
      value: '0',
      trend: '+3',
      icon: FaBox,
      color: '#8b5cf6',
    },
    {
      id: 4,
      title: 'Verified Credits',
      value: '0',
      trend: '+77.4%',
      icon: FaStar,
      color: '#f97316',
    },
    {
      id: 5,
      title: 'Monthly Growth',
      value: '0',
      trend: '+2.3%',
      icon: FaChartLine,
      color: '#06b6d4',
    },
    {
      id: 6,
      title: 'Active Projects',
      value: '0',
      trend: '+2',
      icon: FaFolderOpen,
      color: '#a855f7',
    },
    {
      id: 7,
      title: 'Revenue Generated',
      value: '0',
      trend: '+15.2%',
      icon: FaDollarSign,
      color: '#10b981',
    },
    {
      id: 8,
      title: 'Team Members',
      value: '0',
      trend: '+5',
      icon: FaUsers,
      color: '#ef4444',
    },
  ];

  // Goal Progress Data
  const goalProgress = [
    {
      id: 1,
      title: 'Carbon Neutral Goal 2024',
      progress: 0,
      current: '0',
      target: '0',
      date: 'Dec 31, 2024',
      icon: FaBullseye,
    },
    {
      id: 2,
      title: 'EU Compliance Target',
      progress: 0,
      current: '0',
      target: '0',
      date: 'Mar 15, 2024',
      icon: FaShieldAlt,
    },
    {
      id: 3,
      title: 'Asset Diversification',
      progress: 0,
      current: '0',
      target: '0',
      date: 'Jun 30, 2024',
      icon: FaArrowUp,
    },
  ];

  // Compliance Status Data
  const complianceData = [
    {
      id: 1,
      region: 'European Union',
      score: 0,
      status: 'COMPLIANT',
      statusColor: '#10b981',
      trend: '+5',
    },
    {
      id: 2,
      region: 'United States',
      score: 0,
      status: 'COMPLIANT',
      statusColor: '#10b981',
      trend: '+3',
    },
    {
      id: 3,
      region: 'Asia Pacific',
      score: 0,
      status: 'MONITOR',
      statusColor: '#f59e0b',
      trend: '+2',
    },
    {
      id: 4,
      region: 'Global South',
      score: 0,
      status: 'COMPLIANT',
      statusColor: '#10b981',
      trend: '+4',
    },
  ];

  // Additional Metrics
  const additionalMetrics = [
    {
      label: 'Certifications',
      value: '0',
      icon: FaCheckCircle,
      color: '#10b981',
    },
    {
      label: 'Pending Reviews',
      value: '0',
      icon: FaExclamationTriangle,
      color: '#f59e0b',
    },
    {
      label: 'Global Reach',
      value: '0',
      icon: FaGlobe,
      color: '#3b82f6',
    },
  ];

  return (
    <div className={`org-overview-container ${animateCards ? 'org-overview-animate-in' : ''}`}>
      {/* Header Section */}
      <div className="org-overview-header">
        <div className="org-overview-header-content">
          <h1 className="org-overview-title">Dashboard Overview</h1>
          <p className="org-overview-subtitle">
            Monitor your carbon positive progress and key metrics
          </p>
        </div>
        {/* <div className="org-overview-badge">
          <span className="org-overview-badge-icon">♻️</span>
          <span className="org-overview-badge-text">CARBON POSITIVE</span>
        </div> */}
      </div>

      {/* Stat Cards Grid */}
      <div className="org-overview-stats-grid">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className="org-overview-stat-card"
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <div className="org-overview-stat-header">
                <div className="org-overview-stat-icon">
                  <IconComponent size={24} color={card.color} />
                </div>
                <span className="org-overview-stat-trend">{card.trend}</span>
              </div>
              <div className="org-overview-stat-content">
                <h3 className="org-overview-stat-value">{card.value}</h3>
                <p className="org-overview-stat-label">{card.title}</p>
              </div>
              <div
                className="org-overview-stat-bar"
                style={{ backgroundColor: card.color }}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Additional Metrics */}
      <div className="org-overview-additional-metrics">
        {additionalMetrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <div key={metric.label} className="org-overview-metric-mini">
              <IconComponent
                size={20}
                color={metric.color}
              />
              <div className="org-overview-metric-info">
                <span className="org-overview-metric-label">{metric.label}</span>
                <span className="org-overview-metric-value">{metric.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="org-overview-content-grid">
        {/* Goal Progress Section */}
        <div className="org-overview-section org-overview-goals">
          <div className="org-overview-section-header">
            <div className="org-overview-section-icon">
              <FaBullseye size={24} color='#3b82f6' />
            </div>
            <div className="org-overview-section-title">
              <h2>Goal Progress</h2>
              <p>Track your carbon targets and milestones</p>
            </div>
          </div>

          <div className="org-overview-goals-list">
            {goalProgress.map((goal, index) => (
              <div key={goal.id} className="org-overview-goal-item">
                <div className="org-overview-goal-header">
                  <div className="org-overview-goal-title-row">
                    <h3>{goal.title}</h3>
                    <span className="org-overview-goal-progress-text">
                      {goal.progress}%
                    </span>
                  </div>
                  <p className="org-overview-goal-meta">
                    {goal.current} / {goal.target}
                  </p>
                </div>
                <div className="org-overview-progress-bar-container">
                  <div className="org-overview-progress-bar-bg">
                    <div
                      className="org-overview-progress-bar-fill"
                      style={{
                        width: `${goal.progress}%`,
                        animationDelay: `${index * 0.2}s`,
                      }}
                    ></div>
                  </div>
                  <span className="org-overview-goal-date">{goal.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Status Section */}
        <div className="org-overview-section org-overview-compliance">
          <div className="org-overview-section-header">
            <div className="org-overview-section-icon">
              <FaShieldAlt size={24} color='#10b981' />
            </div>
            <div className="org-overview-section-title">
              <h2>Compliance Status</h2>
              <p>Regional compliance scores and status</p>
            </div>
          </div>

          <div className="org-overview-compliance-list">
            {complianceData.map((item, index) => (
              <div key={item.id} className="org-overview-compliance-item">
                <div className="org-overview-compliance-header">
                  <div className="org-overview-compliance-region">
                    <h3>{item.region}</h3>
                    <span className="org-overview-compliance-trend">
                      {item.trend}
                    </span>
                  </div>
                  <div
                    className="org-overview-compliance-status"
                    style={{ borderColor: item.statusColor }}
                  >
                    <span style={{ color: item.statusColor }}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="org-overview-compliance-score-container">
                  <div className="org-overview-compliance-progress-bar">
                    <div
                      className="org-overview-compliance-progress-fill"
                      style={{
                        width: `${item.score}%`,
                        backgroundColor: item.statusColor,
                        animationDelay: `${index * 0.2}s`,
                      }}
                    ></div>
                  </div>
                  <span className="org-overview-compliance-score">
                    Score: {item.score}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="org-overview-summary">
        <div className="org-overview-summary-item">
          <div className="org-overview-summary-icon org-overview-summary-positive">
            <FaArrowUp size={20} color="#10b981" />
          </div>
          <div className="org-overview-summary-content">
            <h3>Performance</h3>
            <p>All metrics trending upward</p>
          </div>
        </div>
        <div className="org-overview-summary-item">
          <div className="org-overview-summary-icon org-overview-summary-neutral">
            <FaCheckCircle size={20} color="#3b82f6" />
          </div>
          <div className="org-overview-summary-content">
            <h3>Compliance</h3>
            <p>On track with all requirements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
