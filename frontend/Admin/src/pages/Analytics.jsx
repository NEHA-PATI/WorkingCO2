// src/pages/Analytics.jsx
import React, { useState, useMemo, useRef } from "react";
import {
  Bar,
  Line,
  Pie,
} from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { FaDownload, FaFilePdf, FaCalendarAlt, FaChartLine, FaCircle } from "react-icons/fa";
import "../styles/Analytics.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const monthlyData = [
  { month: "Jan", users: 1200, projects: 45, revenue: 12000, co2: 1020 },
  { month: "Feb", users: 1450, projects: 52, revenue: 18500, co2: 1300 },
  { month: "Mar", users: 1700, projects: 60, revenue: 21000, co2: 1520 },
  { month: "Apr", users: 1900, projects: 75, revenue: 25500, co2: 1800 },
  { month: "May", users: 2200, projects: 90, revenue: 31000, co2: 2100 },
  { month: "Jun", users: 2400, projects: 100, revenue: 34000, co2: 2450 },
];

const weeklyMarket = [
  { day: "Mon", listings: 25, trades: 18, value: 30000 },
  { day: "Tue", listings: 33, trades: 28, value: 42000 },
  { day: "Wed", listings: 28, trades: 22, value: 36000 },
  { day: "Thu", listings: 35, trades: 30, value: 52000 },
  { day: "Fri", listings: 45, trades: 34, value: 72000 },
  { day: "Sat", listings: 18, trades: 15, value: 28000 },
  { day: "Sun", listings: 22, trades: 19, value: 38000 },
];

const assetPie = [
  { name: "Electric Vehicles", value: 35, color: "#93c5fd" },
  { name: "Trees", value: 28, color: "#86efac" },
  { name: "Solar", value: 18, color: "#fcd34d" },
  { name: "Wind", value: 12, color: "#7dd3fc" },
  { name: "Others", value: 7, color: "#c4b5fd" },
];

const topOrgs = [
  { rank: 1, name: "GreenTech Solutions", credits: "12,500", revenue: "$315,000", perf: 83 },
  { rank: 2, name: "EcoFarm Ltd", credits: "8,900", revenue: "$223,000", perf: 59 },
  { rank: 3, name: "Solar Innovations", credits: "7,200", revenue: "$180,000", perf: 48 },
  { rank: 4, name: "Clean Energy Co", credits: "6,800", revenue: "$170,000", perf: 45 },
  { rank: 5, name: "TreePlanting Inc", credits: "5,500", revenue: "$137,500", perf: 37 },
];

export default function Analytics() {
  const [range, setRange] = useState("6m");
  const containerRef = useRef();

  const shownMonthly = useMemo(() => {
    if (range === "3m") return monthlyData.slice(-3);
    if (range === "1m") return monthlyData.slice(-1);
    return monthlyData;
  }, [range]);

  const exportCSV = () => {
    const headers = ["Section", "Field", "Value"];
    const rows = [];

    rows.push(["Metrics", "Total CO2 Reduced (tonnes)", "125,847"]);
    rows.push(["Metrics", "Platform Revenue", "$2.4M"]);
    rows.push(["Metrics", "Active Users", "12,847"]);
    rows.push([]);

    rows.push(["Monthly Summary", "Month", "Users / Projects / Revenue / CO2"]);
    shownMonthly.forEach((m) => {
      rows.push(["Monthly Summary", m.month, `${m.users} / ${m.projects} / ${m.revenue} / ${m.co2}`]);
    });
    rows.push([]);

    rows.push(["Top Organizations", "Rank / Org / Credits / Revenue / Performance"]);
    topOrgs.forEach((o) => {
      rows.push(["Top Organizations", `#${o.rank}`, `${o.name} / ${o.credits} / ${o.revenue} / ${o.perf}%`]);
    });

    const csvContent = headers.join(",") + "\n" + rows.map((r) => r.map((c) => `"${String(c || "")}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `platform-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const content = containerRef.current;
    if (!content) return;
    const html = `
      <html>
        <head>
          <title>Analytics Report</title>
          <style>
            body { font-family: "Poppins", sans-serif; padding: 20px; color: #0f172a; }
            h2 { color: #0f172a; }
            table { width: 100%; border-collapse: collapse; }
            td, th { padding: 6px 8px; border: 1px solid #eee; }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `;
    const newWin = window.open("", "_blank");
    newWin.document.open();
    newWin.document.write(html);
    newWin.document.close();
    setTimeout(() => newWin.print(), 500);
  };

  // Chart.js datasets
  const growthData = {
    labels: shownMonthly.map((m) => m.month),
    datasets: [
      {
        type: "bar",
        label: "Projects",
        data: shownMonthly.map((m) => m.projects),
        backgroundColor: "#93c5fd",
        borderRadius: 6,
      },
      {
        type: "line",
        label: "Users",
        data: shownMonthly.map((m) => m.users),
        borderColor: "#f59e0b",
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const weeklyData = {
    labels: weeklyMarket.map((d) => d.day),
    datasets: [
      {
        label: "Listings",
        data: weeklyMarket.map((d) => d.listings),
        backgroundColor: "#93c5fd",
        borderRadius: 5,
      },
      {
        label: "Trades",
        data: weeklyMarket.map((d) => d.trades),
        backgroundColor: "#86efac",
        borderRadius: 5,
      },
      {
        type: "line",
        label: "Value",
        data: weeklyMarket.map((d) => d.value),
        borderColor: "#f59e0b",
        borderWidth: 2,
        yAxisID: "y1",
      },
    ],
  };

  const pieData = {
    labels: assetPie.map((a) => a.name),
    datasets: [
      {
        data: assetPie.map((a) => a.value),
        backgroundColor: assetPie.map((a) => a.color),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index" },
    },
    scales: {
      y: { beginAtZero: true },
      y1: { beginAtZero: true, position: "right", grid: { drawOnChartArea: false } },
    },
  };

  return (
    <div className="analytics-page-container" ref={containerRef}>
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-title">
          <h1>Analytics Dashboard</h1>
          <p>Comprehensive platform analytics and insights</p>
        </div>
        <div className="analytics-actions">
          <select className="analytics-range" value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="6m">Last 6 Months</option>
            <option value="3m">Last 3 Months</option>
            <option value="1m">Last 1 Month</option>
          </select>
          <button className="analytics-btn" onClick={exportCSV}><FaDownload /> Export CSV</button>
          <button className="analytics-btn" onClick={exportPDF}><FaFilePdf /> Export PDF</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="analytics-kpis">
        <div className="analytics-kpi analytics-kpi--blue">
          <h3>Total CO₂ Reduced</h3>
          <div className="kpi-value">125,847</div>
          <small>tonnes equivalent to 2.5M trees</small>
        </div>
        <div className="analytics-kpi analytics-kpi--green">
          <h3>Platform Revenue</h3>
          <div className="kpi-value">$2.4M</div>
          <small>+23.5% vs last period</small>
        </div>
        <div className="analytics-kpi analytics-kpi--yellow">
          <h3>Active Users</h3>
          <div className="kpi-value">12,847</div>
          <small>+12.8% user growth</small>
        </div>
        <div className="analytics-kpi analytics-kpi--purple">
          <h3>Global Projects</h3>
          <div className="kpi-value">1,247</div>
          <small>across 45 countries</small>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="analytics-card">
        <h2><FaChartLine /> Platform Growth Analytics</h2>
        <div className="chart-container"><Bar data={growthData} options={chartOptions} /></div>
      </div>

      {/* Pie + Placeholder */}
      <div className="analytics-grid-2">
        <div className="analytics-card small">
          <h3><FaCircle className="icon small" /> Asset Type Distribution</h3>
          <div className="chart-container"><Pie data={pieData} /></div>
        </div>
        <div className="analytics-card small">
          <h3><FaCircle className="icon small purple" /> Regional Performance</h3>
          <div className="regional-placeholder"><p className="muted">Regional performance chart placeholder</p></div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="analytics-card">
        <h2><FaChartLine /> Weekly Marketplace Activity</h2>
        <div className="chart-container"><Bar data={weeklyData} options={chartOptions} /></div>
      </div>

      {/* Top Organizations */}
      <div className="analytics-card">
        <h2><FaCircle className="icon gold" /> Top Performing Organizations</h2>
        <div className="org-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Organization</th>
                <th>Type</th>
                <th>Credits Generated</th>
                <th>Revenue Generated</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {topOrgs.map((o) => (
                <tr key={o.rank}>
                  <td className="rank-badge">#{o.rank}</td>
                  <td>{o.name}</td>
                  <td><span className="org-type">Organization</span></td>
                  <td>{o.credits}</td>
                  <td className="revenue">{o.revenue}</td>
                  <td>
                    <div className="perf-bar">
                      <div className="perf-fill" style={{ width: `${o.perf}%` }} />
                      <span className="perf-label">{o.perf}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Section */}
      <div className="analytics-card">
        <h2><FaDownload /> Export & Reporting</h2>
        <div className="export-actions">
          <button className="export-btn" onClick={exportCSV}><FaDownload /> Platform Report (CSV)</button>
          <button className="export-btn" onClick={exportPDF}><FaFilePdf /> Executive Summary (PDF)</button>
          <button
            className="export-btn"
            onClick={() => {
              const data = { monthlyData, weeklyMarket, topOrgs, assetPie };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `analytics-data-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <FaDownload /> API Data (JSON)
          </button>
        </div>
      </div>
    </div>
  );
}
