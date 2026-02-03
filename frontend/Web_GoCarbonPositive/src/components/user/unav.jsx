import React, { useState } from "react";
import { FaUserCircle, FaFire } from "react-icons/fa";
import { HiOutlineUpload } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { SiBlogger } from "react-icons/si";
import { BiSolidWallet } from "react-icons/bi";
import { GiCrystalBars } from "react-icons/gi";
import {
  FaUser,
  FaGamepad,
  FaInfoCircle,
  FaAddressCard,
  FaSignOutAlt,
} from "react-icons/fa";

import "../App.css";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <nav className="navbar-container">
      {/* Left Side: Sidebar & Branding */}
      <div className="navbar-left">
        <div className="sidebar-wrapper">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          {sidebarOpen && (
            <div className="sidebar-dropdown">
              <div className="sidebar-item">
                <FaUser className="sidebar-icon sidebar-blue" />
                <span>Profile</span>
              </div>
              <div className="sidebar-item">
                <FaGamepad className="sidebar-icon sidebar-green" />
                <span>Game</span>
              </div>
              <div className="sidebar-item">
                <FaInfoCircle className="sidebar-icon sidebar-purple" />
                <span>About</span>
              </div>
              <div className="sidebar-item">
                <FaAddressCard className="sidebar-icon sidebar-yellow" />
                <span>Contact</span>
              </div>
              <div className="sidebar-item sidebar-logout">
                <FaSignOutAlt className="sidebar-icon sidebar-red" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>

        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-brand">CarbonCredit</span>
      </div>

      {/* Center Navigation Links */}
      <div className="navbar-center">
        <div className="navbar-item">
          <MdDashboard className="navbar-icon navbar-blue" />
          <span>Dashboard</span>
        </div>
        <div className="navbar-item">
          <HiOutlineUpload className="navbar-icon navbar-green" />
          <span>Upload</span>
        </div>
        <div className="navbar-item">
          <SiBlogger className="navbar-icon navbar-orange" />
          <span>Blog</span>
        </div>
        <div className="navbar-item">
          <GiCrystalBars className="navbar-icon navbar-purple" />
          <span>Engage</span>
        </div>
        <div className="navbar-item">
          <BiSolidWallet className="navbar-icon navbar-yellow" />
          <span>Wallet</span>
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="navbar-right">
        <FaFire className="navbar-icon navbar-red" title="Streak" />
        <FaUserCircle className="navbar-icon navbar-gray" title="Profile" />
      </div>
    </nav>
  );
};

export default Navbar;
