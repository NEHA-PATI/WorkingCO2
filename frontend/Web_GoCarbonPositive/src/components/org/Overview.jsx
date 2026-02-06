// import React from "react";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   Progress,
//   Badge,
// } from "./basic-ui";

// import {
//   FaLeaf,
//   FaCloud,
//   FaBox,
//   FaCertificate,
//   FaChartLine,
//   FaFolderOpen,
//   FaDollarSign,
//   FaUsers,
// } from "react-icons/fa";
// import { FiTarget, FiShield } from "react-icons/fi";

// // SVG Icons
// const TrendingUpIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
//     <polyline points="17 6 23 6 23 12" />
//   </svg>
// );

// const TrendingDownIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
//     <polyline points="17 18 23 18 23 12" />
//   </svg>
// );

// const LeafIcon = () => (
//   <svg
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path d="M21 15c0-4.5-3.6-8.2-8-8.9C8.5 6.2 5 9.7 5 14c0 2.7 1.3 5.1 3.4 6.7L3 21l1.3-4.7C6.1 18.3 8.9 20 12 20c4.4 0 8-3.6 8-8 0-1.1-.2-2.2-.6-3.2" />
//   </svg>
// );

// const AwardIcon = () => (
//   <svg
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <circle cx="12" cy="8" r="7" />
//     <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
//   </svg>
// );

// const TargetIcon = () => <FiTarget size={20} style={{ color: "#3b82f6" }} />;

// const BuildingIcon = () => (
//   <svg
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path d="M3 21h18M5 7h14v14H5zm4 4h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2z" />
//   </svg>
// );

// const CalendarIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//     <path d="M16 2v4M8 2v4M3 10h18" />
//   </svg>
// );

// const MapPinIcon = () => (
//   <svg
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
//     <circle cx="12" cy="10" r="3" />
//   </svg>
// );

// const FileCheckIcon = () => <FiShield size={20} style={{ color: "#10b981" }} />;

// const UsersIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
//     <circle cx="9" cy="7" r="4" />
//     <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
//   </svg>
// );

// const Overview = () => {
//   // Mock data for KPIs with more colorful styling
//   const kpiData = [
//     {
//       title: "Total Carbon Credits",
//       value: "2,847",
//       change: "+12.5%",
//       trend: "up",
//       icon: FaLeaf,
//       iconClass: "icon green",
//       color: "text-white",
//       // bgColor: "bg-green",
//       // gradient: "linear-gradient(135deg, #10b981, #059669)",
//     },
//     {
//       title: "CO₂ Reduced (Tons)",
//       value: "1,423.5",
//       change: "+8.2%",
//       trend: "up",
//       icon: FaCloud,
//       iconClass: "icon blue",
//       color: "text-white",
//       // bgColor: "bg-blue",
//       // gradient: "linear-gradient(135deg, #3b82f6,rgb(144, 163, 204))",
//     },
//     {
//       title: "Active Assets",
//       value: "156",
//       change: "+3",
//       trend: "up",
//       icon: FaBox,
//       iconClass: "icon purple",
//       color: "text-white",
//       // bgColor: "bg-purple",
//       // gradient: "linear-gradient(135deg, #9333ea, #7c3aed)",
//     },
//     {
//       title: "Verified Credits",
//       value: "2,203",
//       change: "77.4%",
//       trend: "up",
//       icon: FaCertificate,
//       iconClass: "icon orange",
//       color: "text-white",
//       // bgColor: "bg-orange",
//       // gradient: "linear-gradient(135deg, #f97316, #ea580c)",
//     },
//     {
//       title: "Monthly Growth",
//       value: "18.7%",
//       change: "+2.3%",
//       trend: "up",
//       icon: FaChartLine,
//       iconClass: "icon sky",
//       color: "text-white",
//       // bgColor: "bg-cyan",
//       // gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
//     },
//     {
//       title: "Active Projects",
//       value: "24",
//       change: "+2",
//       trend: "up",
//       icon: FaFolderOpen,
//       iconClass: "icon violet",
//       color: "text-white",
//       // bgColor: "bg-indigo",
//       // gradient: "linear-gradient(135deg, #4f46e5, #4338ca)",
//     },
//     {
//       title: "Revenue Generated",
//       value: "$847K",
//       change: "+15.2%",
//       trend: "up",
//       icon: FaDollarSign,
//       iconClass: "icon mint",
//       color: "text-white",
//       // bgColor: "bg-yellow",
//       // gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
//     },
//     {
//       title: "Team Members",
//       value: "42",
//       change: "+5",
//       trend: "up",
//       icon: FaUsers,
//       iconClass: "icon red",
//       color: "text-white",
//       // bgColor: "bg-red",
//       // gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
//     },
//   ];

//   // Mock progress data
//   const progressData = [
//     {
//       title: "Carbon Neutral Goal 2024",
//       current: 2847,
//       target: 5000,
//       percentage: 57,
//       deadline: "Dec 31, 2024",
//     },
//     {
//       title: "EU Compliance Target",
//       current: 1200,
//       target: 1500,
//       percentage: 80,
//       deadline: "Mar 15, 2024",
//     },
//     {
//       title: "Asset Diversification",
//       current: 7,
//       target: 10,
//       percentage: 70,
//       deadline: "Jun 30, 2024",
//     },
//   ];

//   // Mock compliance data
//   const complianceRegions = [
//     { region: "European Union", score: 92, status: "Compliant" },
//     { region: "United States", score: 88, status: "Compliant" },
//     { region: "Asia Pacific", score: 76, status: "Monitor" },
//     { region: "Global South", score: 85, status: "Compliant" },
//   ];

//   return (
//     <motion.div
//       className="space-y-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Page Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h1 className="text-xl font-bold">Dashboard Overview</h1>
//           <p className="text-secondary text-sm">
//             Monitor your carbon positive progress and key metrics
//           </p>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Badge variant="outline" className="border-green">
//             <LeafIcon
//               style={{
//                 color: "#10b981",
//                 width: "16px",
//                 height: "16px",
//                 marginRight: "4px",
//               }}
//             />
//             Carbon Positive
//           </Badge>
//         </div>
//       </div>

//       {/* KPI Cards Grid - 4 columns */}
//       <div className="grid-4">
//         {kpiData.map((kpi, index) => {
//           const Icon = kpi.icon;
//           return (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: index * 0.05 }}
//             >
//               <Card className="p-3">
//                 <div className="flex items-center justify-between mb-2">
//                   {/* <div 
//                     className="p-2 rounded-lg"
//                     style={{ background: kpi.gradient }}
//                   >
//                     <Icon className={`${kpi.color} w-4 h-4`} />
//                   </div> */}

//                   <Icon
//                     size={28}
//                     style={{
//                       color: kpi.iconClass.includes("green")
//                         ? "#10b981"
//                         : kpi.iconClass.includes("blue")
//                         ? "#3b82f6"
//                         : kpi.iconClass.includes("purple")
//                         ? "#8b5cf6"
//                         : kpi.iconClass.includes("orange")
//                         ? "#f97316"
//                         : kpi.iconClass.includes("sky")
//                         ? "#06b6d4"
//                         : kpi.iconClass.includes("violet")
//                         ? "#7c3aed"
//                         : kpi.iconClass.includes("mint")
//                         ? "#10b981"
//                         : kpi.iconClass.includes("red")
//                         ? "#ef4444"
//                         : "#6b7280",
//                     }}
//                   />

//                   <div className="flex items-center space-x-1">
//                     {kpi.trend === "up" ? (
//                       <TrendingUpIcon
//                         style={{
//                           color: "#10b981",
//                           width: "16px",
//                           height: "16px",
//                         }}
//                       />
//                     ) : (
//                       <TrendingDownIcon
//                         style={{
//                           color: "#ef4444",
//                           width: "16px",
//                           height: "16px",
//                         }}
//                       />
//                     )}
//                     <span
//                       className={`text-xs font-medium ${
//                         kpi.trend === "up" ? "text-green" : "text-red"
//                       }`}
//                     >
//                       {kpi.change}
//                     </span>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-xl font-bold">{kpi.value}</div>
//                   <div className="text-xs text-secondary mt-1">{kpi.title}</div>
//                 </div>
//               </Card>
//             </motion.div>
//           );
//         })}
//       </div>

//       <div className="grid-2 lg-grid-2 gap-4">
//         {/* Progress Trackers */}
//         <Card className="p-4">
//           <div className="flex items-center space-x-2 mb-3">
//             <TargetIcon
//               style={{ color: "#3b82f6", width: "20px", height: "20px" }}
//             />
//             <span className="font-semibold">Goal Progress</span>
//           </div>
//           <p className="text-xs text-secondary mb-4">
//             Track your carbon targets and milestones
//           </p>
//           <div className="space-y-4">
//             {progressData.map((item, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//               >
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium text-sm">{item.title}</span>
//                     <span className="text-xs text-secondary">
//                       {item.percentage}%
//                     </span>
//                   </div>
//                   <Progress value={item.percentage} />
//                   <div className="flex items-center justify-between text-xs text-secondary">
//                     <span>
//                       {item.current.toLocaleString()} /{" "}
//                       {item.target.toLocaleString()}
//                     </span>
//                     <span>{item.deadline}</span>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </Card>

//         {/* Compliance Status */}
//         <Card className="p-4">
//           <div className="flex items-center space-x-2 mb-3">
//             <FileCheckIcon
//               style={{ color: "#10b981", width: "20px", height: "20px" }}
//             />
//             <span className="font-semibold">Compliance Status</span>
//           </div>
//           <p className="text-xs text-secondary mb-4">
//             Regional compliance scores and status
//           </p>
//           <div className="space-y-3">
//             {complianceRegions.map((region, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
//               >
//                 <div>
//                   <div className="font-medium text-sm">{region.region}</div>
//                   <div className="text-xs text-secondary">
//                     Score: {region.score}/100
//                   </div>
//                 </div>
//                 <Badge
//                   variant={
//                     region.status === "Compliant" ? "success" : "warning"
//                   }
//                   className="text-xs"
//                 >
//                   {region.status}
//                 </Badge>
//               </motion.div>
//             ))}
//           </div>
//         </Card>
//       </div>
//     </motion.div>
//   );
// };

// export default Overview;


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
import '../../Styles/org/Overview.css';

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
      value: '2,847',
      trend: '+12.5%',
      icon: FaLeaf,
      color: '#10b981',
    },
    {
      id: 2,
      title: 'CO₂ Reduced (Tons)',
      value: '1,423.5',
      trend: '+8.2%',
      icon: FaCloud,
      color: '#3b82f6',
    },
    {
      id: 3,
      title: 'Active Assets',
      value: '156',
      trend: '+3',
      icon: FaBox,
      color: '#8b5cf6',
    },
    {
      id: 4,
      title: 'Verified Credits',
      value: '2,203',
      trend: '+77.4%',
      icon: FaStar,
      color: '#f97316',
    },
    {
      id: 5,
      title: 'Monthly Growth',
      value: '18.7%',
      trend: '+2.3%',
      icon: FaChartLine,
      color: '#06b6d4',
    },
    {
      id: 6,
      title: 'Active Projects',
      value: '24',
      trend: '+2',
      icon: FaFolderOpen,
      color: '#a855f7',
    },
    {
      id: 7,
      title: 'Revenue Generated',
      value: '$847K',
      trend: '+15.2%',
      icon: FaDollarSign,
      color: '#10b981',
    },
    {
      id: 8,
      title: 'Team Members',
      value: '42',
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
      progress: 57,
      current: '2,847',
      target: '5,000',
      date: 'Dec 31, 2024',
      icon: FaBullseye,
    },
    {
      id: 2,
      title: 'EU Compliance Target',
      progress: 80,
      current: '1,200',
      target: '1,500',
      date: 'Mar 15, 2024',
      icon: FaShieldAlt,
    },
    {
      id: 3,
      title: 'Asset Diversification',
      progress: 70,
      current: '7',
      target: '10',
      date: 'Jun 30, 2024',
      icon: FaArrowUp,
    },
  ];

  // Compliance Status Data
  const complianceData = [
    {
      id: 1,
      region: 'European Union',
      score: 92,
      status: 'COMPLIANT',
      statusColor: '#10b981',
      trend: '+5',
    },
    {
      id: 2,
      region: 'United States',
      score: 88,
      status: 'COMPLIANT',
      statusColor: '#10b981',
      trend: '+3',
    },
    {
      id: 3,
      region: 'Asia Pacific',
      score: 76,
      status: 'MONITOR',
      statusColor: '#f59e0b',
      trend: '+2',
    },
    {
      id: 4,
      region: 'Global South',
      score: 82,
      status: 'COMPLIANT',
      statusColor: '#10b981',
      trend: '+4',
    },
  ];

  // Additional Metrics
  const additionalMetrics = [
    {
      label: 'Certifications',
      value: '12',
      icon: FaCheckCircle,
      color: '#10b981',
    },
    {
      label: 'Pending Reviews',
      value: '3',
      icon: FaExclamationTriangle,
      color: '#f59e0b',
    },
    {
      label: 'Global Reach',
      value: '24',
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
                <div
                  className="org-overview-stat-icon"
                  style={{
                    backgroundColor: `${card.color}20`,
                  }}
                >
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
            <FaArrowUp size={20} />
          </div>
          <div className="org-overview-summary-content">
            <h3>Performance</h3>
            <p>All metrics trending upward</p>
          </div>
        </div>
        <div className="org-overview-summary-item">
          <div className="org-overview-summary-icon org-overview-summary-neutral">
            <FaCheckCircle size={20} />
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
