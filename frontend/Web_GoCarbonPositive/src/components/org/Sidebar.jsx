// import React from "react";
// import { motion } from "framer-motion";
// import {
//   Button,
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
//   Badge,
// } from "../components/basic-ui";

// // SVG Icons
// const BarChart3Icon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M3 3v18h18M7 16v-6m4 10v-4m4 8v-8" />
//   </svg>
// );

// const LeafIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M21 15c0-4.5-3.6-8.2-8-8.9C8.5 6.2 5 9.7 5 14c0 2.7 1.3 5.1 3.4 6.7L3 21l1.3-4.7C6.1 18.3 8.9 20 12 20c4.4 0 8-3.6 8-8 0-1.1-.2-2.2-.6-3.2" />
//   </svg>
// );

// const CarIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 12 10s-6.7.6-8.5 1.1c-.8.2-1.5 1-1.5 1.9v3c0 .6.4 1 1 1h2m0-7H5m14 0h-4" />
//     <circle cx="7" cy="17" r="2" />
//     <circle cx="17" cy="17" r="2" />
//   </svg>
// );

// const FileTextIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
//     <path d="M14 2v6h6M16 13H8m0 4h5m3-8H8" />
//   </svg>
// );

// const UsersIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
//     <circle cx="9" cy="7" r="4" />
//     <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
//   </svg>
// );

// const ZapIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//   </svg>
// );

// const Building2Icon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18H6zm3-3h6m-6-4h6m-6-4h6m-6-4h6" />
//   </svg>
// );

// const UserIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
//     <circle cx="12" cy="7" r="4" />
//   </svg>
// );

// // Icon mapping for each tab
// const TAB_ICONS = {
//   overview: BarChart3Icon,
//   assets: LeafIcon,
//   earnings: BarChart3Icon,
//   fleet: CarIcon,
//   compliance: FileTextIcon,
//   team: UsersIcon,
//   actions: ZapIcon,
// };

// const Sidebar = ({ activeTab, onTabChange, tabs }) => {
//   return (
//     <motion.div
//       className="sidebar"
//       initial={{ x: -256 }}
//       animate={{ x: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Logo and Organization Info */}
//       <div className="p-6 border-b">
//         <div className="flex items-center space-x-3">
//           <div className="sidebar-logo">
//             <Building2Icon className="text-white" />
//           </div>
//           <div>
//             <h2 className="font-bold">EcoTech Corp</h2>
//             <p className="text-sm text-secondary">Premium Account</p>
//           </div>
//         </div>
//         <motion.div
//           className="mt-4 p-3 bg-green-50 rounded-lg"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3, delay: 0.2 }}
//         >
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium text-green-800">
//               Carbon Status
//             </span>
//             <Badge className="badge-green">Positive</Badge>
//           </div>
//           <div className="mt-2">
//             <div className="text-2xl font-bold text-green-800">2,847</div>
//             <div className="text-sm text-green">Credits Generated</div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Navigation Tabs */}
//       <nav className="flex-1 p-4">
//         <div className="space-y-2">
//           {tabs.map((tab, index) => {
//             const Icon = TAB_ICONS[tab.id] || BarChart3Icon;
//             const isActive = activeTab === tab.id;

//             return (
//               <motion.div
//                 key={tab.id}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//               >
//                 <Button
//                   variant={isActive ? "default" : "ghost"}
//                   className={`nav-button ${isActive ? "nav-button-active" : ""}`}
//                   onClick={() => onTabChange(tab.id)}
//                 >
//                   <Icon className="w-5 h-5 mr-3" />
//                   {tab.label}
//                 </Button>
//               </motion.div>
//             );
//           })}
//         </div>
//       </nav>

//       {/* User Profile Section */}
//       <div className="p-4 border-t">
//         <motion.div
//           className="flex items-center space-x-3"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3, delay: 0.4 }}
//         >
//           <Avatar>
//             <AvatarImage src="/placeholder.svg" />
//             <AvatarFallback>
//               <UserIcon />
//             </AvatarFallback>
//           </Avatar>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium truncate">John Doe</p>
//             <p className="text-xs text-secondary truncate">Organization Admin</p>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default Sidebar;




import React from "react";
import { motion } from "framer-motion";
import { Button, Avatar, AvatarFallback, AvatarImage, Badge } from "./basic-ui";

// SVG Icons
const BarChart3Icon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 3v18h18M7 16v-6m4 10v-4m4 8v-8" />
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

const CarIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 12 10s-6.7.6-8.5 1.1c-.8.2-1.5 1-1.5 1.9v3c0 .6.4 1 1 1h2m0-7H5m14 0h-4" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const FileTextIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
    <path d="M14 2v6h6M16 13H8m0 4h5m3-8H8" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
  </svg>
);

const ZapIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const Building2Icon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18H6zm3-3h6m-6-4h6m-6-4h6m-6-4h6" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Icon mapping for each tab
const TAB_ICONS = {
  overview: BarChart3Icon,
  assets: LeafIcon,
  earnings: BarChart3Icon,
  fleet: CarIcon,
  compliance: FileTextIcon,
  team: UsersIcon,
  actions: ZapIcon,
};

const Sidebar = ({ activeTab, onTabChange, tabs }) => {
  return (
    <motion.div
      className="sidebar"
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo and Organization Info */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="sidebar-logo">
            <Building2Icon className="text-white" />
          </div>
          <div>
            <h2 className="font-bold">EcoTech Corp</h2>
            <p className="text-sm text-secondary">Premium Account</p>
          </div>
        </div>
        <motion.div
          className="mt-4 p-3 bg-green-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">
              Carbon Status
            </span>
            <Badge className="badge-green">Positive</Badge>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-800">2,847</div>
            <div className="text-sm text-green">Credits Generated</div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {tabs.map((tab, index) => {
            const Icon = TAB_ICONS[tab.id] || BarChart3Icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`nav-button ${isActive ? "nav-button-active" : ""}`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-secondary truncate">
              Organization Admin
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
