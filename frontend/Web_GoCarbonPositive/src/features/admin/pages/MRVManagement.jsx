import { useEffect, useState } from "react";
import {
  MdDashboard,
  MdDescription,
  MdPeople,
  MdBarChart,
  MdCheckCircle,
  MdTrendingUp,
  MdDownload,
  MdPictureAsPdf,
  MdTableChart,
} from "react-icons/md";
import {
  FiActivity,
  FiMapPin,
  FiAward,
  FiTarget,
  FiChevronRight,
} from "react-icons/fi";
import { BiRadar } from "react-icons/bi";
import { TbDrone } from "react-icons/tb";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@features/admin/styles/MRVManagement.css";

const recentActivity = [
  {
    id: 1,
    color: "blue",
    text: "DRN-002 assigned to James Okonkwo",
    sub: "SUB-2024-0872 - Mombasa",
    time: "8m ago",
  },
  {
    id: 2,
    color: "green",
    text: "Scan completed for EcoShield Africa",
    sub: "SUB-2024-0874 - Kampala",
    time: "1h ago",
  },
  {
    id: 3,
    color: "yellow",
    text: "New submission from Reforest Global",
    sub: "SUB-2024-0875 - Kigali",
    time: "2h ago",
  },
  {
    id: 4,
    color: "red",
    text: "Submission rejected - insufficient data",
    sub: "SUB-2024-0876 - Lagos",
    time: "5h ago",
  },
  {
    id: 5,
    color: "blue",
    text: "DRN-004 assigned to Amara Diallo",
    sub: "SUB-2024-0873 - Dar es Salaam",
    time: "6h ago",
  },
];

const drones = [
  {
    id: "DRN-001",
    model: "DJI Matrice 350 RTK",
    battery: 94,
    lastMaintenance: "2026-02-15",
    status: "In Air",
    location: "Nairobi South",
  },
  {
    id: "DRN-002",
    model: "DJI Mavic 3 Enterprise",
    battery: 78,
    lastMaintenance: "2026-02-10",
    status: "Available",
    location: "Warehouse A",
  },
  {
    id: "DRN-003",
    model: "DJI Matrice 300 RTK",
    battery: 61,
    lastMaintenance: "2026-01-28",
    status: "In Air",
    location: "Mombasa Coast",
  },
  {
    id: "DRN-004",
    model: "senseFly eBee X",
    battery: 100,
    lastMaintenance: "2026-02-20",
    status: "Available",
    location: "Warehouse B",
  },
  {
    id: "DRN-005",
    model: "DJI Agras T40",
    battery: 35,
    lastMaintenance: "2026-01-15",
    status: "Maintenance",
    location: "Service Center",
  },
];

const officers = [
  {
    name: "James Okonkwo",
    email: "james.okonkwo@carbonpos.io",
    activeScans: 2,
    completed: 34,
    workload: "Medium",
    perf: 89,
    status: "Active",
  },
  {
    name: "Sarah Kimani",
    email: "sarah.kimani@carbonpos.io",
    activeScans: 1,
    completed: 28,
    workload: "Low",
    perf: 78,
    status: "Active",
  },
  {
    name: "David Mensah",
    email: "david.mensah@carbonpos.io",
    activeScans: 3,
    completed: 41,
    workload: "High",
    perf: 83,
    status: "Active",
  },
  {
    name: "Amara Diallo",
    email: "amara.diallo@carbonpos.io",
    activeScans: 0,
    completed: 19,
    workload: "Low",
    perf: 80,
    status: "Active",
  },
  {
    name: "Peter Wanjiku",
    email: "peter.wanjiku@carbonpos.io",
    activeScans: 0,
    completed: 12,
    workload: "Low",
    perf: 72,
    status: "Inactive",
  },
];

const co2Trend = [
  { month: "Sep", value: 3200 },
  { month: "Oct", value: 4800 },
  { month: "Nov", value: 5300 },
  { month: "Dec", value: 4300 },
  { month: "Jan", value: 6200 },
  { month: "Feb", value: 7600 },
];

const scanSummary = [
  { month: "Sep", scans: 7 },
  { month: "Oct", scans: 12 },
  { month: "Nov", scans: 15 },
  { month: "Dec", scans: 10 },
  { month: "Jan", scans: 19 },
  { month: "Feb", scans: 22 },
];

const droneUtilization = [
  { name: "Available", value: 2, color: "#22c55e" },
  { name: "In Air", value: 2, color: "#3b82f6" },
  { name: "Maintenance", value: 1, color: "#ef4444" },
];

const officerRanking = [
  {
    rank: 1,
    name: "David Mensah",
    scans: 41,
    accuracy: 94,
    co2: "24.2k tCO2e",
  },
  {
    rank: 2,
    name: "James Okonkwo",
    scans: 34,
    accuracy: 91,
    co2: "18.6k tCO2e",
  },
  {
    rank: 3,
    name: "Sarah Kimani",
    scans: 28,
    accuracy: 89,
    co2: "14.1k tCO2e",
  },
  {
    rank: 4,
    name: "Amara Diallo",
    scans: 19,
    accuracy: 85,
    co2: "9.8k tCO2e",
  },
  {
    rank: 5,
    name: "Peter Wanjiku",
    scans: 12,
    accuracy: 78,
    co2: "5.2k tCO2e",
  },
];

const liveDronePositions = [
  { id: "DRN-001", coords: [-1.286389, 36.817223] }, // Nairobi
  { id: "DRN-003", coords: [-4.043477, 39.668206] }, // Mombasa
];

const getBatteryColor = (battery) =>
  battery > 70 ? "#22c55e" : battery > 40 ? "#f59e0b" : "#ef4444";

const getWorkloadColor = (workload) =>
  ({ High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" }[workload] ||
  "#6b7280");

const getStatusClass = (status) =>
  ({
    Available: "status-available",
    "In Air": "status-inair",
    Maintenance: "status-maintenance",
    Active: "status-available",
    Inactive: "status-maintenance",
    Scanning: "status-inair",
  }[status] || "");

const getInitial = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

const LiveDot = () => (
  <span className="live-dot">
    <span className="live-dot-inner" />
  </span>
);

const BatteryBar = ({ value }) => (
  <div className="battery-wrap">
    <div className="battery-track">
      <div
        className="battery-fill"
        style={{ width: `${value}%`, background: getBatteryColor(value) }}
      />
    </div>
    <span className="battery-label" style={{ color: getBatteryColor(value) }}>
      {value}%
    </span>
  </div>
);

const PerfBar = ({ value }) => (
  <div className="battery-wrap">
    <div className="battery-track">
      <div
        className="battery-fill"
        style={{
          width: `${value}%`,
          background: value >= 85 ? "#22c55e" : "#3b82f6",
        }}
      />
    </div>
    <span className="battery-label" style={{ color: value >= 85 ? "#22c55e" : "#3b82f6" }}>
      {value}%
    </span>
  </div>
);

function OverviewTab() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setTick((prev) => prev + 1), 3000);
    return () => clearInterval(intervalId);
  }, []);

  const drn001 = 72 + (tick % 5);
  const drn003 = 34 + (tick % 3);

  return (
    <div className="tab-content overview-tab-content">
      <div className="kpi-grid">
        {[
          {
            icon: <MdDescription />,
            iconClass: "icon-yellow",
            label: "Pending Submissions",
            value: 3,
            sub: "Awaiting assignment",
          },
          {
            icon: <TbDrone />,
            iconClass: "icon-blue",
            label: "Available Drones",
            value: 2,
            sub: "5 total fleet",
          },
          {
            icon: <MdPeople />,
            iconClass: "icon-purple",
            label: "Active MRV Officers",
            value: 4,
            sub: "5 total",
          },
          {
            icon: <MdCheckCircle />,
            iconClass: "icon-green",
            label: "Verified This Month",
            value: 1,
            sub: "Carbon credit verified",
          },
        ].map((kpi, index) => (
          <div className="kpi-card" key={index}>
            <div className="kpi-top">
              <div className={`kpi-icon ${kpi.iconClass}`}>{kpi.icon}</div>
              <div className="live-badge">
                <LiveDot />
                <span>LIVE</span>
              </div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-sub">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="overview-bottom">
        <div className="card activity-card">
          <div className="card-header">
            <FiActivity className="card-header-icon green" />
            <h3>Recent Activity</h3>
            <span className="today-badge">Today</span>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div className="activity-item" key={activity.id}>
                <span className={`activity-dot dot-${activity.color}`} />
                <div className="activity-body">
                  <p className="activity-text">{activity.text}</p>
                  <p className="activity-sub">{activity.sub}</p>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card drone-ops-card">
          <div className="card-header">
            <BiRadar className="card-header-icon green pulse-icon" />
            <h3>Live Drone Operations</h3>
            <div className="live-badge ml-auto">
              <LiveDot />
              <span>LIVE</span>
            </div>
          </div>
          <div className="map-area">
            <MapContainer
              center={[-2.5, 37.5]}
              zoom={5}
              scrollWheelZoom={false}
              className="live-drone-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {liveDronePositions.map((drone) => (
                <CircleMarker
                  key={drone.id}
                  center={drone.coords}
                  radius={10}
                  pathOptions={{
                    color: "#1d4ed8",
                    fillColor: "#3b82f6",
                    fillOpacity: 0.9,
                    weight: 2,
                  }}
                >
                  <LeafletTooltip permanent direction="bottom" offset={[0, 12]} className="drone-map-tooltip">
                    {drone.id}
                  </LeafletTooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
          <div className="drone-live-cards">
            {[
              {
                id: "DRN-001",
                officer: "James Okonkwo",
                zone: "Nairobi South",
                pct: drn001,
              },
              {
                id: "DRN-003",
                officer: "Sarah Kimani",
                zone: "Mombasa Coast",
                pct: drn003,
              },
            ].map((drone) => (
              <div className="drone-live-card" key={drone.id}>
                <div className="dlc-top">
                  <div className="dlc-id">
                    <TbDrone />
                    <strong>{drone.id}</strong>
                  </div>
                  <span className="status-badge status-inair">- Scanning</span>
                </div>
                <p className="dlc-row">
                  Officer: <span>{drone.officer}</span>
                </p>
                <p className="dlc-row">
                  Zone: <span>{drone.zone}</span>
                </p>
                <div className="dlc-progress-wrap">
                  <div className="dlc-progress-track">
                    <div
                      className="dlc-progress-fill"
                      style={{ width: `${drone.pct}%` }}
                    />
                  </div>
                  <span className="dlc-pct">{drone.pct}% scan complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DroneManagementTab() {
  return (
    <div className="tab-content drone-tab-content">
      <div className="page-header">
        <h2>Drone Fleet Management</h2>
      </div>
      <div className="fleet-kpi-grid">
        {[
          { label: "Total Fleet", value: 5, cls: "" },
          { label: "Available", value: 2, cls: "green" },
          { label: "In Air", value: 2, cls: "blue" },
          { label: "Maintenance", value: 1, cls: "red" },
        ].map((item, index) => (
          <div className={`fleet-kpi-card ${item.cls}`} key={index}>
            <div className="fleet-kpi-value">{item.value}</div>
            <div className="fleet-kpi-label">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="card table-card">
        <h3 className="section-title">Fleet Registry</h3>
        <div className="table-scroll drone-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>DRONE ID</th>
                <th>MODEL</th>
                <th>BATTERY</th>
                <th>LAST MAINTENANCE</th>
                <th>STATUS</th>
                <th>LOCATION</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {drones.map((drone) => (
                <tr key={drone.id}>
                  <td>
                    <span className="link-text">{drone.id}</span>
                  </td>
                  <td>{drone.model}</td>
                  <td>
                    <BatteryBar value={drone.battery} />
                  </td>
                  <td>{drone.lastMaintenance}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(drone.status)}`}>
                      - {drone.status}
                    </span>
                  </td>
                  <td>
                    <span className="location-cell">
                      <FiMapPin className="loc-icon" />
                      {drone.location}
                    </span>
                  </td>
                  <td>
                    <button className="btn-outline">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MRVOfficersTab() {
  return (
    <div className="tab-content">
      <div className="page-header">
        <h2>MRV Officers</h2>
      </div>
      <div className="officers-kpi-grid">
        <div className="officers-kpi">
          <div className="ok-value">5</div>
          <div className="ok-label">Total Officers</div>
        </div>
        <div className="officers-kpi">
          <div className="ok-value green">4</div>
          <div className="ok-label">Active Today</div>
        </div>
        <div className="officers-kpi">
          <div className="ok-value blue">83%</div>
          <div className="ok-label">Avg. Performance</div>
        </div>
      </div>
      <div className="card table-card">
        <h3 className="section-title">Officer Directory</h3>
        <div className="table-scroll">
          <table className="data-table">
          <thead>
            <tr>
              <th>OFFICER</th>
              <th>ACTIVE SCANS</th>
              <th>COMPLETED</th>
              <th>WORKLOAD</th>
              <th>PERF. SCORE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {officers.map((officer, index) => (
              <tr key={index}>
                <td>
                  <div className="officer-cell">
                    <div className="officer-avatar">{getInitial(officer.name)}</div>
                    <div>
                      <div className="officer-name">{officer.name}</div>
                      <div className="officer-email">{officer.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="blue">{officer.activeScans}</span>
                </td>
                <td>
                  <span className="green">{officer.completed}</span>
                </td>
                <td>
                  <span style={{ color: getWorkloadColor(officer.workload) }}>
                    {officer.workload}
                  </span>
                </td>
                <td>
                  <PerfBar value={officer.perf} />
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(officer.status)}`}>
                    - {officer.status}
                  </span>
                </td>
                <td>
                  <button className="btn-outline">Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="tab-content reports-tab-content">
      <div className="reports-header">
        <div>
          <h2>Carbon &amp; Audit Reports</h2>
          <p>Compliance-grade data for investors and regulators</p>
        </div>
        <div className="reports-actions">
          <button className="btn-outline">
            <MdPictureAsPdf className="pdf-icon" />
            Export PDF
          </button>
          <button className="btn-outline">
            <MdTableChart className="csv-icon" />
            Export CSV
          </button>
          <button className="btn-solid">
            <MdDownload className="audit-icon" />
            Audit Report
          </button>
        </div>
      </div>

      <div className="card co2-hero">
        <div>
          <p className="co2-hero-label">TOTAL VERIFIED CO2 REDUCTION</p>
          <div className="co2-hero-value">
            31,000 <span>tCO2e</span>
          </div>
          <p className="co2-hero-sub">
            Across 6 months - 7 organizations - East Africa
          </p>
        </div>
        <div className="co2-hero-icon">
          <MdTrendingUp />
        </div>
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <div className="chart-title">
            <MdTrendingUp className="green" />
            <div>
              <h4>CO2 Reduction Trend</h4>
              <p>Monthly verified reduction (tCO2e)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={co2Trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: "Poppins" }} />
              <YAxis tick={{ fontSize: 12, fontFamily: "Poppins" }} />
              <Tooltip contentStyle={{ fontFamily: "Poppins", borderRadius: 8 }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#22c55e" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="chart-title">
            <MdBarChart className="blue" />
            <div>
              <h4>Monthly Scan Summary</h4>
              <p>Field scans completed per month</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scanSummary}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: "Poppins" }} />
              <YAxis tick={{ fontSize: 12, fontFamily: "Poppins" }} />
              <Tooltip contentStyle={{ fontFamily: "Poppins", borderRadius: 8 }} />
              <Bar dataKey="scans" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <div className="chart-title">
            <FiTarget className="purple" />
            <div>
              <h4>Drone Utilization</h4>
              <p>Fleet status breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={droneUtilization}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {droneUtilization.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontFamily: "Poppins", fontSize: 13 }} />
              <Tooltip contentStyle={{ fontFamily: "Poppins", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="chart-title">
            <FiAward className="yellow" />
            <div>
              <h4>Officer Performance Ranking</h4>
              <p>All-time verification statistics</p>
            </div>
          </div>
          <div className="table-scroll">
            <table className="data-table ranking-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>OFFICER</th>
                  <th>SCANS</th>
                  <th>ACCURACY</th>
                  <th>CO2 VERIFIED</th>
                </tr>
              </thead>
              <tbody>
                {officerRanking.map((officer) => (
                  <tr key={officer.rank}>
                    <td>
                      <span className={`rank-badge ${officer.rank <= 3 ? "rank-top" : ""}`}>
                        #{officer.rank}
                      </span>
                    </td>
                    <td>{officer.name}</td>
                    <td>{officer.scans}</td>
                    <td>
                      <span className="green">{officer.accuracy}%</span>
                    </td>
                    <td>{officer.co2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmissionsTab() {
  const submissions = [
    {
      id: "SUB-2024-0872",
      org: "EcoShield Africa",
      location: "Mombasa",
      officer: "James Okonkwo",
      status: "In Review",
      date: "2024-12-01",
    },
    {
      id: "SUB-2024-0873",
      org: "Reforest Global",
      location: "Dar es Salaam",
      officer: "Amara Diallo",
      status: "Assigned",
      date: "2024-12-02",
    },
    {
      id: "SUB-2024-0874",
      org: "EcoShield Africa",
      location: "Kampala",
      officer: "Sarah Kimani",
      status: "Completed",
      date: "2024-12-03",
    },
    {
      id: "SUB-2024-0875",
      org: "Reforest Global",
      location: "Kigali",
      officer: "-",
      status: "Pending",
      date: "2024-12-04",
    },
    {
      id: "SUB-2024-0876",
      org: "GreenBridge Ltd",
      location: "Lagos",
      officer: "David Mensah",
      status: "Rejected",
      date: "2024-12-05",
    },
  ];

  const statusMap = {
    "In Review": "status-inair",
    Assigned: "status-inair",
    Completed: "status-available",
    Pending: "status-pending",
    Rejected: "status-rejected",
  };

  return (
    <div className="tab-content">
      <div className="page-header">
        <h2>Submissions</h2>
        <p>Manage and track all carbon credit submissions</p>
      </div>
      <div className="card table-card">
        <div className="table-scroll">
          <table className="data-table">
          <thead>
            <tr>
              <th>SUBMISSION ID</th>
              <th>ORGANIZATION</th>
              <th>LOCATION</th>
              <th>OFFICER</th>
              <th>STATUS</th>
              <th>DATE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td>
                  <span className="link-text">{submission.id}</span>
                </td>
                <td>{submission.org}</td>
                <td>
                  <span className="location-cell">
                    <FiMapPin className="loc-icon" />
                    {submission.location}
                  </span>
                </td>
                <td>{submission.officer}</td>
                <td>
                  <span className={`status-badge ${statusMap[submission.status]}`}>
                    - {submission.status}
                  </span>
                </td>
                <td>{submission.date}</td>
                <td>
                  <button className="btn-outline">
                    View <FiChevronRight className="arrow-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: <MdDashboard className="nav-tab-icon nav-tab-icon-overview" />,
  },
  {
    id: "drones",
    label: "Drone Management",
    icon: <TbDrone className="nav-tab-icon nav-tab-icon-drones" />,
  },
  {
    id: "officers",
    label: "MRV Officers",
    icon: <MdPeople className="nav-tab-icon nav-tab-icon-officers" />,
  },
  {
    id: "reports",
    label: "Reports",
    icon: <MdBarChart className="nav-tab-icon nav-tab-icon-reports" />,
  },
];

export default function MRVManagement() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="mrv-root">
      <nav className="mrv-nav">
        <div className="nav-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "nav-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className={`mrv-main ${activeTab === "drones" ? "mrv-main-drones" : ""}`}>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "drones" && <DroneManagementTab />}
        {activeTab === "officers" && <MRVOfficersTab />}
        {activeTab === "reports" && <ReportsTab />}
      </main>
    </div>
  );
}
