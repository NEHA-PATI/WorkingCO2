import React from "react";
import "@features/admin/styles/Overview.css";
import { AiOutlineSetting } from "react-icons/ai";
import { LuShieldAlert } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";


import {
  FaUsers,
  FaChartLine,
  FaDollarSign,
  FaLeaf,
  FaShieldAlt,
  FaBolt,
  FaGlobe,
  FaCoins,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Overview = () => {
  const growthData = [
    { name: "Jan", users: 1200 },
    { name: "Feb", users: 1500 },
    { name: "Mar", users: 1800 },
    { name: "Apr", users: 2000 },
    { name: "May", users: 2300 },
    { name: "Jun", users: 2500 },
  ];

  const co2Data = [
    { name: "Jan", co2: 1300 },
    { name: "Feb", co2: 1500 },
    { name: "Mar", co2: 1700 },
    { name: "Apr", co2: 1900 },
    { name: "May", co2: 2100 },
    { name: "Jun", co2: 2400 },
  ];

  const userDistribution = [
    { name: "Individual Users", value: 65, color: "#4ade80" },
    { name: "Organizations", value: 25, color: "#60a5fa" },
    { name: "Admins", value: 5, color: "#facc15" },
    { name: "Suspended", value: 5, color: "#fca5a5" },
  ];

  const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#fca5a5"];

  return (
    <div className="admin-overview-scope">
      <div className="overview-container">
      {/* KPI Cards */}
      <div className="overview-cards">
        <div className="overview-card">
          <h2 className="green-text">
            <FaUsers className="icon green-icon" /> Total Users
          </h2>
          <h1 className="green-text">12,847</h1>
          <p>↑ +12.5% from last month</p>
        </div>

        <div className="overview-card">
          <h2 className="blue-text">
            <FaChartLine className="icon blue-icon" /> Active Projects
          </h2>
          <h1 className="blue-text">482</h1>
          <p>↑ +8.3% from last month</p>
        </div>

        <div className="overview-card">
          <h2 className="yellow-text">
            <FaDollarSign className="icon yellow-icon" /> Monthly Revenue
          </h2>
          <h1 className="yellow-text">$32,500</h1>
          <p>↑ +15.2% from last month</p>
        </div>

        <div className="overview-card">
          <h2 className="red-text">
            <FaLeaf className="icon red-icon" /> CO₂ Reduced
          </h2>
          <h1 className="red-text">2,480</h1>
          <p>tonnes this month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-section">
        <div className="chart-card">
          <h2> <FaArrowTrendUp /> Platform Growth</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#4ade80"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2> <FaArrowTrendDown /> CO₂ Reduction Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={co2Data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="co2"
                fill="#bbf7d0"
                stroke="#4ade80"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Distribution, System Metrics, Recent Alerts */}
      <div className="stats-section">
        <div className="user-distribution">
          <h2>
            <FaUsers /> User Distribution
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={userDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={3}
              >
                {userDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ System Metrics - restored original look */}
        <div className="system-metrics">
          <h2><AiOutlineSetting /> System Metrics</h2>
          <p>
            Server Uptime <span className="metric">99.9%</span>
          </p>
          <div className="progress">
            <div className="fill blue" style={{ width: "99%" }} />
          </div>

          <p>
            API Response Time <span className="metric">245ms</span>
          </p>
          <div className="progress">
            <div className="fill yellow" style={{ width: "90%" }} />
          </div>

          <p>
            Database Load <span className="metric">65%</span>
          </p>
          <div className="progress">
            <div className="fill gray" style={{ width: "65%" }} />
          </div>

          <p>
            Active Sessions <span className="metric">1847</span>
          </p>
          <div className="progress">
            <div className="fill green" style={{ width: "95%" }} />
          </div>
        </div>

        {/* ✅ Recent Alerts - restored original look */}
        <div className="recent-alerts">
          <h2><LuShieldAlert /> Recent Alerts</h2>
          <div className="alert yellow">High API usage detected</div>
          <div className="alert red">Failed verification attempt</div>
          <div className="alert blue">New marketplace listing requires review</div>
          <div className="alert green">System backup completed successfully</div>
          <button className="view-all">View All Alerts</button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="actions-grid">
          <div className="action">
            <FaUsers className="green-icon" /> Add User
          </div>
          <div className="action">
            <FaShieldAlt className="blue-icon" /> Verify Asset
          </div>
          <div className="action">
            <FaBolt className="yellow-icon" /> Security Scan
          </div>
          <div className="action">
            <FaGlobe className="gray-icon" /> System Status
          </div>
          <div className="action">
            <FaCoins className="teal-icon" /> Mint Tokens
          </div>
          <div className="action">
            <FaExclamationTriangle className="red-icon" /> Send Alert
          </div>
          <div className="action">
            <FaClock className="purple-icon" /> Schedule Task
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Overview;
