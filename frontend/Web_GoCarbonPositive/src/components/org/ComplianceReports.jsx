"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../../styles/org/ComplianceReports.css";
import {
  FaLeaf,
  FaGlobe,
  FaShieldAlt,
  FaBalanceScale,
  FaHeart,
  FaHandshake,
  FaUsers,
  FaShoppingCart,
  FaArrowUp,
  FaDownload,
  FaFilter,
  FaChartLine,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";

const monthlyData = [
  {
    month: "Jan",
    sustainability: 85,
    environmental: 88,
    responsibility: 87,
    ethics: 92,
    humanRights: 89,
    stakeholder: 86,
    inclusive: 88,
    consumer: 93,
  },
  {
    month: "Feb",
    sustainability: 86,
    environmental: 89,
    responsibility: 88,
    ethics: 93,
    humanRights: 90,
    stakeholder: 87,
    inclusive: 89,
    consumer: 94,
  },
  {
    month: "Mar",
    sustainability: 87,
    environmental: 90,
    responsibility: 89,
    ethics: 94,
    humanRights: 91,
    stakeholder: 88,
    inclusive: 90,
    consumer: 95,
  },
  {
    month: "Apr",
    sustainability: 88,
    environmental: 91,
    responsibility: 90,
    ethics: 95,
    humanRights: 92,
    stakeholder: 89,
    inclusive: 91,
    consumer: 96,
  },
  {
    month: "May",
    sustainability: 89,
    environmental: 92,
    responsibility: 91,
    ethics: 95,
    humanRights: 93,
    stakeholder: 90,
    inclusive: 91,
    consumer: 96,
  },
  {
    month: "Jun",
    sustainability: 89,
    environmental: 92,
    responsibility: 91,
    ethics: 95,
    humanRights: 93,
    stakeholder: 90,
    inclusive: 91,
    consumer: 96,
  },
  {
    month: "Jul",
    sustainability: 89,
    environmental: 92,
    responsibility: 91,
    ethics: 95,
    humanRights: 93,
    stakeholder: 90,
    inclusive: 91,
    consumer: 96,
  },
  {
    month: "Aug",
    sustainability: 89,
    environmental: 92,
    responsibility: 91,
    ethics: 95,
    humanRights: 93,
    stakeholder: 90,
    inclusive: 91,
    consumer: 96,
  },
  {
    month: "Sep",
    sustainability: 89,
    environmental: 92,
    responsibility: 91,
    ethics: 95,
    humanRights: 93,
    stakeholder: 90,
    inclusive: 91,
    consumer: 96,
  },
  {
    month: "Oct",
    sustainability: 89,
    environmental: 92,
    responsibility: 91,
    ethics: 95,
    humanRights: 93,
    stakeholder: 90,
    inclusive: 91,
    consumer: 96,
  },
  {
    month: "Nov",
    sustainability: 89,
    environmental: 92,
    responsibility: 91,
    ethics: 95,
    humanRights: 93,
    stakeholder: 90,
    inclusive: 91,
    consumer: 96,
  },
  {
    month: "Dec",
    sustainability: 89,
    environmental: 92,
    responsibility: 91,
    ethics: 95,
    humanRights: 93,
    stakeholder: 90,
    inclusive: 91,
    consumer: 96,
  },
];

const metrics = [
  {
    name: "Sustainability Score",
    value: 89,
    icon: FaLeaf,
    color: "rgb(8, 152, 51)",
    backgroundColor: "#ecfdf5",
    description: "Overall environmental sustainability performance",
    trend: "+2.3%",
  },
  {
    name: "Environmental Performance",
    value: 92,
    icon: FaGlobe,
    color: "rgb(35, 111, 234)",
    backgroundColor: "#eff6ff",
    description: "Carbon footprint and environmental impact metrics",
    trend: "+1.8%",
  },
  {
    name: "Responsibility Advocacy",
    value: 91,
    icon: FaShieldAlt,
    color: "rgb(153, 109, 255)",
    backgroundColor: "#f3e8ff",
    description: "Corporate responsibility and advocacy initiatives",
    trend: "+3.1%",
  },
  {
    name: "Ethics Score",
    value: 95,
    icon: FaBalanceScale,
    color: "rgb(74, 107, 238)",
    backgroundColor: "#eef2ff",
    description: "Business ethics and compliance standards",
    trend: "+0.5%",
  },
  {
    name: "Human Rights Index",
    value: 93,
    icon: FaHeart,
    color: "rgb(239, 67, 67)",
    backgroundColor: "#fef2f2",
    description: "Human rights protection and labor practices",
    trend: "+2.7%",
  },
  {
    name: "Stakeholder Satisfaction",
    value: 90,
    icon: FaHandshake,
    color: "rgb(239, 124, 42)",
    backgroundColor: "#fff7ed",
    description: "Stakeholder engagement and satisfaction levels",
    trend: "+1.2%",
  },
  {
    name: "Inclusive & Equitable",
    value: 91,
    icon: FaUsers,
    color: "rgb(64, 244, 226)",
    backgroundColor: "#f0fdfa",
    description: "Diversity, equity, and inclusion initiatives",
    trend: "+4.2%",
  },
  {
    name: "Consumer Responsibility",
    value: 96,
    icon: FaShoppingCart,
    color: "rgb(201, 41, 121)",
    backgroundColor: "#fdf2f8",
    description: "Consumer protection and product responsibility",
    trend: "+0.8%",
  },
];

const pieData = [
  { name: "Environmental", value: 92, fill: "#93c5fd" },
  { name: "Social", value: 91, fill: "#86efac" },
  { name: "Governance", value: 94, fill: "#c4b5fd" },
];

export default function ComplianceReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("12months");
  const [chartType, setChartType] = useState("line");

  const getScoreColor = (score) => {
    if (score >= 90) return "#059669";
    if (score >= 80) return "#d97706";
    return "#dc2626";
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    return "Needs Improvement";
  };

  const getBadgeClass = (score) => {
    if (score >= 90) return "badge-excellent";
    if (score >= 80) return "badge-good";
    return "badge-poor";
  };

  return (
    <>
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">ESG Dashboard</h1>
          <p className="text-secondary mt-1">
            Environmental, Social & Governance Performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="input p-2 border border-gray-300 rounded-lg"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="2years">Last 2 Years</option>
          </select>
          <button className="button button-outline flex items-center p-2">
            <FaDownload className="btn-icon" />{" "}
            <span className="ml-2">Export</span>
          </button>
          <button className="button button-outline flex items-center p-2">
            <FaFilter className="btn-icon" />{" "}
            <span className="ml-2">Filter</span>
          </button>
        </div>
      </div>

      {/* <div className="header">
          <div className="header-content">
            <h1 className="title">ESG Dashboard</h1>
            <p className="subtitle">Environmental, Social & Governance Performance</p>
          </div>
          <div className="header-controls">
            <select className="select" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="2years">Last 2 Years</option>
            </select>
            <button className="btn btn-outline">
              <FaDownload className="btn-icon" /> Export
            </button>
            <button className="btn btn-outline">
              <FaFilter className="btn-icon" /> Filter
            </button>
          </div>
        </div> */}

      {/* Overview Cards */}
      <div className="overview-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Overall ESG Score</h3>
          </div>
          <div className="card-content">
            <div className="overview-content">
              <div>
                <div className="score-large">92.1</div>
                <div className="trend-positive">
                  <FaArrowUp className="trend-icon" />
                  <span>+2.1% from last month</span>
                </div>
              </div>
              <span className="badge badge-excellent">Excellent</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Performing Area</h3>
          </div>
          <div className="card-content">
            <div className="overview-content">
              <div>
                <div className="area-name">Consumer Responsibility</div>
                <div className="score-large blue">96</div>
              </div>
              <FaShoppingCart className="icon-large" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Areas for Improvement</h3>
          </div>
          <div className="card-content">
            <div className="overview-content">
              <div>
                <div className="area-name">Sustainability Score</div>
                <div className="score-large orange">89</div>
              </div>
              <FaLeaf className="icon-large" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="chart-section">
        <div className="chart-tabs">
          <button
            className={`tab ${chartType === "line" ? "active" : ""}`}
            onClick={() => setChartType("line")}
          >
            <FaChartLine className="tab-icon" /> Trends
          </button>
          <button
            className={`tab ${chartType === "bar" ? "active" : ""}`}
            onClick={() => setChartType("bar")}
          >
            <FaChartBar className="tab-icon" /> Compare
          </button>
          <button
            className={`tab ${chartType === "pie" ? "active" : ""}`}
            onClick={() => setChartType("pie")}
          >
            <FaChartPie className="tab-icon" /> Overview
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">ESG Performance Analytics</h3>
            <p className="card-description">
              Track your ESG metrics over time and identify trends
            </p>
          </div>
          <div className="card-content">
            {chartType === "line" && (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sustainability"
                    stroke="#86efac"
                    strokeWidth={2}
                    name="Sustainability"
                  />
                  <Line
                    type="monotone"
                    dataKey="environmental"
                    stroke="#93c5fd"
                    strokeWidth={2}
                    name="Environmental"
                  />
                  <Line
                    type="monotone"
                    dataKey="responsibility"
                    stroke="#c4b5fd"
                    strokeWidth={2}
                    name="Responsibility"
                  />
                  <Line
                    type="monotone"
                    dataKey="ethics"
                    stroke="#a5b4fc"
                    strokeWidth={2}
                    name="Ethics"
                  />
                  <Line
                    type="monotone"
                    dataKey="humanRights"
                    stroke="#fca5a5"
                    strokeWidth={2}
                    name="Human Rights"
                  />
                  <Line
                    type="monotone"
                    dataKey="stakeholder"
                    stroke="#fdba74"
                    strokeWidth={2}
                    name="Stakeholder"
                  />
                  <Line
                    type="monotone"
                    dataKey="inclusive"
                    stroke="#7dd3fc"
                    strokeWidth={2}
                    name="Inclusive"
                  />
                  <Line
                    type="monotone"
                    dataKey="consumer"
                    stroke="#f9a8d4"
                    strokeWidth={2}
                    name="Consumer"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {chartType === "bar" && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={[monthlyData[monthlyData.length - 1]]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="sustainability"
                    fill="#86efac"
                    name="Sustainability"
                  />
                  <Bar
                    dataKey="environmental"
                    fill="#93c5fd"
                    name="Environmental"
                  />
                  <Bar
                    dataKey="responsibility"
                    fill="#c4b5fd"
                    name="Responsibility"
                  />
                  <Bar dataKey="ethics" fill="#a5b4fc" name="Ethics" />
                  <Bar
                    dataKey="humanRights"
                    fill="#fca5a5"
                    name="Human Rights"
                  />
                  <Bar
                    dataKey="stakeholder"
                    fill="#fdba74"
                    name="Stakeholder"
                  />
                  <Bar dataKey="inclusive" fill="#7dd3fc" name="Inclusive" />
                  <Bar dataKey="consumer" fill="#f9a8d4" name="Consumer" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartType === "pie" && (
              <div className="pie-chart-container">
                <ResponsiveContainer width={400} height={400}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="card metric-card">
              <div className="card-header">
                <div className="metric-header">
                  <div
                    className="icon-container"
                    style={{
                      backgroundColor: metric.backgroundColor,
                      color: metric.color,
                    }}
                  >
                    <IconComponent className="metric-icon" />
                  </div>
                  <span className={`badge ${getBadgeClass(metric.value)}`}>
                    {getScoreBadge(metric.value)}
                  </span>
                </div>
                <h3 className="metric-title">{metric.name}</h3>
              </div>
              <div className="card-content">
                <div className="metric-content">
                  <div className="metric-score-row">
                    <span
                      className="metric-score"
                      style={{ color: getScoreColor(metric.value) }}
                    >
                      {metric.value}
                    </span>
                    <span className="metric-trend">{metric.trend}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${metric.value}%`,
                        backgroundColor: metric.color,
                      }}
                    ></div>
                  </div>
                  <p className="metric-description">{metric.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Insights */}
      {/* <div className="insights-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Key Achievements</h3>
            <p className="card-description">Recent ESG milestones and improvements</p>
          </div>
          <div className="card-content">
            <div className="insights-list">
              <div className="insight-item">
                <div className="insight-dot green"></div>
                <div>
                  <p className="insight-title">Carbon Neutral Certification</p>
                  <p className="insight-description">Achieved carbon neutrality across all operations</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-dot blue"></div>
                <div>
                  <p className="insight-title">Diversity & Inclusion Program</p>
                  <p className="insight-description">Launched comprehensive D&I initiatives</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-dot purple"></div>
                <div>
                  <p className="insight-title">Ethical Supply Chain</p>
                  <p className="insight-description">100% of suppliers meet ethical standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Action Items</h3>
            <p className="card-description">Areas requiring attention and improvement</p>
          </div>
          <div className="card-content">
            <div className="insights-list">
              <div className="insight-item">
                <div className="insight-dot orange"></div>
                <div>
                  <p className="insight-title">Renewable Energy Transition</p>
                  <p className="insight-description">Increase renewable energy usage to 80%</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-dot red"></div>
                <div>
                  <p className="insight-title">Waste Reduction Program</p>
                  <p className="insight-description">Implement zero-waste initiatives</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-dot yellow"></div>
                <div>
                  <p className="insight-title">Community Engagement</p>
                  <p className="insight-description">Expand local community programs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
