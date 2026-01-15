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
//   FaUsers
// } from "react-icons/fa";


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

// const TargetIcon = () => (
//   <svg
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <circle cx="12" cy="12" r="10" />
//     <circle cx="12" cy="12" r="6" />
//     <circle cx="12" cy="12" r="2" />
//   </svg>
// );

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

// const FileCheckIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
//     <path d="M14 2v6h6M9 15l2 2 4-4" />
//   </svg>
// );

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
//             <LeafIcon className="text-green w-3 h-3 mr-1" />
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



//                   <Icon className={kpi.iconClass} />





//                   <div className="flex items-center space-x-1">
//                     {kpi.trend === "up" ? (
//                       <TrendingUpIcon className="text-green w-3 h-3" />
//                     ) : (
//                       <TrendingDownIcon className="text-red w-3 h-3" />
//                     )}
//                     <span
//                       className={`text-xs font-medium ${kpi.trend === "up" ? "text-green" : "text-red"
//                         }`}
//                     >
//                       {kpi.change}
//                     </span>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-xl font-bold">{kpi.value}</div>
//                   <div className="text-xs text-secondary mt-1">
//                     {kpi.title}
//                   </div>
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
//             <TargetIcon className="text-blue w-4 h-4" />
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
//                       {item.current.toLocaleString()} / {item.target.toLocaleString()}
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
//             <FileCheckIcon className="text-green w-4 h-4" />
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
//                   variant={region.status === "Compliant" ? "success" : "warning"}
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



import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Badge,
} from "./basic-ui";

import {
  FaLeaf,
  FaCloud,
  FaBox,
  FaCertificate,
  FaChartLine,
  FaFolderOpen,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";
import { FiTarget, FiShield } from "react-icons/fi";
import Footer from "./Footer";

// SVG Icons
const TrendingUpIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const LeafIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15c0-4.5-3.6-8.2-8-8.9C8.5 6.2 5 9.7 5 14c0 2.7 1.3 5.1 3.4 6.7L3 21l1.3-4.7C6.1 18.3 8.9 20 12 20c4.4 0 8-3.6 8-8 0-1.1-.2-2.2-.6-3.2" />
  </svg>
);

const AwardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const TargetIcon = () => <FiTarget size={20} style={{ color: "#3b82f6" }} />;

const BuildingIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 21h18M5 7h14v14H5zm4 4h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const FileCheckIcon = () => <FiShield size={20} style={{ color: "#10b981" }} />;

const UsersIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const Overview = () => {
  // Mock data for KPIs with more colorful styling
  const kpiData = [
    {
      title: "Total Carbon Credits",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: FaLeaf,
      iconClass: "icon green",
      color: "text-white",
      // bgColor: "bg-green",
      // gradient: "linear-gradient(135deg, #10b981, #059669)",
    },
    {
      title: "CO₂ Reduced (Tons)",
      value: "1,423.5",
      change: "+8.2%",
      trend: "up",
      icon: FaCloud,
      iconClass: "icon blue",
      color: "text-white",
      // bgColor: "bg-blue",
      // gradient: "linear-gradient(135deg, #3b82f6,rgb(144, 163, 204))",
    },
    {
      title: "Active Assets",
      value: "156",
      change: "+3",
      trend: "up",
      icon: FaBox,
      iconClass: "icon purple",
      color: "text-white",
      // bgColor: "bg-purple",
      // gradient: "linear-gradient(135deg, #9333ea, #7c3aed)",
    },
    {
      title: "Verified Credits",
      value: "2,203",
      change: "77.4%",
      trend: "up",
      icon: FaCertificate,
      iconClass: "icon orange",
      color: "text-white",
      // bgColor: "bg-orange",
      // gradient: "linear-gradient(135deg, #f97316, #ea580c)",
    },
    {
      title: "Monthly Growth",
      value: "18.7%",
      change: "+2.3%",
      trend: "up",
      icon: FaChartLine,
      iconClass: "icon sky",
      color: "text-white",
      // bgColor: "bg-cyan",
      // gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    },
    {
      title: "Active Projects",
      value: "24",
      change: "+2",
      trend: "up",
      icon: FaFolderOpen,
      iconClass: "icon violet",
      color: "text-white",
      // bgColor: "bg-indigo",
      // gradient: "linear-gradient(135deg, #4f46e5, #4338ca)",
    },
    {
      title: "Revenue Generated",
      value: "$847K",
      change: "+15.2%",
      trend: "up",
      icon: FaDollarSign,
      iconClass: "icon mint",
      color: "text-white",
      // bgColor: "bg-yellow",
      // gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
    {
      title: "Team Members",
      value: "42",
      change: "+5",
      trend: "up",
      icon: FaUsers,
      iconClass: "icon red",
      color: "text-white",
      // bgColor: "bg-red",
      // gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    },
  ];

  // Mock progress data
  const progressData = [
    {
      title: "Carbon Neutral Goal 2024",
      current: 2847,
      target: 5000,
      percentage: 57,
      deadline: "Dec 31, 2024",
    },
    {
      title: "EU Compliance Target",
      current: 1200,
      target: 1500,
      percentage: 80,
      deadline: "Mar 15, 2024",
    },
    {
      title: "Asset Diversification",
      current: 7,
      target: 10,
      percentage: 70,
      deadline: "Jun 30, 2024",
    },
  ];

  // Mock compliance data
  const complianceRegions = [
    { region: "European Union", score: 92, status: "Compliant" },
    { region: "United States", score: 88, status: "Compliant" },
    { region: "Asia Pacific", score: 76, status: "Monitor" },
    { region: "Global South", score: 85, status: "Compliant" },
  ];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">Dashboard Overview</h1>
          <p className="text-secondary text-sm">
            Monitor your carbon positive progress and key metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-green">
            <LeafIcon style={{ color: '#10b981', width: '16px', height: '16px', marginRight: '4px' }} />
            Carbon Positive
          </Badge>
        </div>
      </div>

      {/* KPI Cards Grid - 4 columns */}
      <div className="grid-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  {/* <div 
                    className="p-2 rounded-lg"
                    style={{ background: kpi.gradient }}
                  >
                    <Icon className={`${kpi.color} w-4 h-4`} />
                  </div> */}

                  <Icon 
                    size={28} 
                    style={{ 
                      color: kpi.iconClass.includes('green') ? '#10b981' :
                             kpi.iconClass.includes('blue') ? '#3b82f6' :
                             kpi.iconClass.includes('purple') ? '#8b5cf6' :
                             kpi.iconClass.includes('orange') ? '#f97316' :
                             kpi.iconClass.includes('sky') ? '#06b6d4' :
                             kpi.iconClass.includes('violet') ? '#7c3aed' :
                             kpi.iconClass.includes('mint') ? '#10b981' :
                             kpi.iconClass.includes('red') ? '#ef4444' : '#6b7280'
                    }} 
                  />

                  <div className="flex items-center space-x-1">
                    {kpi.trend === "up" ? (
                      <TrendingUpIcon style={{ color: '#10b981', width: '16px', height: '16px' }} />
                    ) : (
                      <TrendingDownIcon style={{ color: '#ef4444', width: '16px', height: '16px' }} />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        kpi.trend === "up" ? "text-green" : "text-red"
                      }`}
                    >
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold">{kpi.value}</div>
                  <div className="text-xs text-secondary mt-1">{kpi.title}</div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      

      <div className="grid-2 lg-grid-2 gap-4">
        {/* Progress Trackers */}
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <TargetIcon style={{ color: '#3b82f6', width: '20px', height: '20px' }} />
            <span className="font-semibold">Goal Progress</span>
          </div>
          <p className="text-xs text-secondary mb-4">
            Track your carbon targets and milestones
          </p>
          <div className="space-y-4">
            {progressData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{item.title}</span>
                    <span className="text-xs text-secondary">
                      {item.percentage}%
                    </span>
                  </div>
                  <Progress value={item.percentage} />
                  <div className="flex items-center justify-between text-xs text-secondary">
                    <span>
                      {item.current.toLocaleString()} /{" "}
                      {item.target.toLocaleString()}
                    </span>
                    <span>{item.deadline}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Compliance Status */}
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <FileCheckIcon style={{ color: '#10b981', width: '20px', height: '20px' }} />
            <span className="font-semibold">Compliance Status</span>
          </div>
          <p className="text-xs text-secondary mb-4">
            Regional compliance scores and status
          </p>
          <div className="space-y-3">
            {complianceRegions.map((region, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-sm">{region.region}</div>
                  <div className="text-xs text-secondary">
                    Score: {region.score}/100
                  </div>
                </div>
                <Badge
                  variant={
                    region.status === "Compliant" ? "success" : "warning"
                  }
                  className="text-xs"
                >
                  {region.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
    
    
  );
};

export default Overview;
