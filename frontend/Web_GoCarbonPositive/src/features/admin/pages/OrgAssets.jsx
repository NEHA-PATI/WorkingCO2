import React, { useState } from "react";
import {
  MdOutlineBusinessCenter,
  MdAccessTime,
  MdCheckCircleOutline,
  MdCancel,
  MdFilterAlt,
  MdTrendingUp,
} from "react-icons/md";
import { GiTreehouse } from "react-icons/gi";
import {
  FaTruck,
  FaIndustry,
  FaSolarPanel,
  FaWater,
  FaBuilding,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { BsGrid } from "react-icons/bs";
import "@features/admin/styles/OrgAssets.css";

const ALL_ASSETS = [
  {
    id: "asset-001",
    name: "Amazon Reforestation Block A",
    org: "GreenFuture Holdings",
    category: "plantation",
    submitted: "Jan 15, 2026",
    status: "approved",
  },
  {
    id: "asset-002",
    name: "Borneo Palm Restoration",
    org: "EcoVenture Capital",
    category: "plantation",
    submitted: "Feb 10, 2026",
    status: "pending",
  },
  {
    id: "asset-003",
    name: "Congo Basin Reserve",
    org: "TerraNova Energy",
    category: "plantation",
    submitted: "Jan 28, 2026",
    status: "rejected",
  },
  {
    id: "asset-004",
    name: "EV Delivery Fleet - West Region",
    org: "GreenFuture Holdings",
    category: "fleet",
    submitted: "Jan 22, 2026",
    status: "approved",
  },
  {
    id: "asset-005",
    name: "Hydrogen Truck Fleet",
    org: "BlueSky Renewables",
    category: "fleet",
    submitted: "Feb 5, 2026",
    status: "pending",
  },
  {
    id: "asset-006",
    name: "Urban E-Bike Program",
    org: "CarbonZero Inc.",
    category: "fleet",
    submitted: "Nov 30, 2025",
    status: "rejected",
  },
  {
    id: "asset-007",
    name: "Direct Air Capture Unit Alpha",
    org: "CarbonZero Inc.",
    category: "carbon",
    submitted: "Jan 8, 2026",
    status: "approved",
  },
  {
    id: "asset-008",
    name: "Industrial CCS Pipeline",
    org: "TerraNova Energy",
    category: "carbon",
    submitted: "Feb 18, 2026",
    status: "pending",
  },
  {
    id: "asset-009",
    name: "Mojave Solar Farm",
    org: "BlueSky Renewables",
    category: "solar",
    submitted: "Jan 2, 2026",
    status: "approved",
  },
  {
    id: "asset-010",
    name: "Rooftop Solar Portfolio",
    org: "EcoVenture Capital",
    category: "solar",
    submitted: "Feb 14, 2026",
    status: "approved",
  },
  {
    id: "asset-011",
    name: "Floating Solar Array",
    org: "GreenFuture Holdings",
    category: "solar",
    submitted: "Dec 5, 2025",
    status: "rejected",
  },
];

const CATEGORY_META = {
  plantation: { label: "Plantation", icon: <GiTreehouse />, color: "plantation" },
  fleet: { label: "Fleet", icon: <FaTruck />, color: "fleet" },
  carbon: { label: "Carbon Capture", icon: <FaIndustry />, color: "carbon" },
  solar: { label: "Solar", icon: <FaSolarPanel />, color: "solar" },
  hydro: { label: "Hydro Power", icon: <FaWater />, color: "hydro" },
};

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function StatCard({ label, value, sub, iconBg, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-left">
        <label>{label}</label>
        <div className="stat-number">{value}</div>
        <div className="stat-sub">
          <MdTrendingUp size={14} />
          {sub}
        </div>
      </div>
      <div className={`stat-card-right ${iconBg}`}>{icon}</div>
    </div>
  );
}

function CategoryBadge({ category }) {
  const meta = CATEGORY_META[category];
  return <span className={`cat-badge ${category}`}>{meta?.label || category}</span>;
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status}`}>
      <span className="status-dot" />
      {capitalize(status)}
    </span>
  );
}

function AssetIcon({ category }) {
  const meta = CATEGORY_META[category];
  return <div className={`asset-icon-box ${category}`}>{meta?.icon || <FaBuilding />}</div>;
}

function AssetRow({ asset, onApprove, onReject }) {
  return (
    <div className="asset-row">
      <div className="asset-name-cell">
        <AssetIcon category={asset.category} />
        <div>
          <div className="asset-title">{asset.name}</div>
          <div className="asset-id">{asset.id}</div>
        </div>
      </div>
      <div className="org-cell">
        <FaBuilding size={13} />
        {asset.org}
      </div>
      <div>
        <CategoryBadge category={asset.category} />
      </div>
      <div className="submitted-cell">{asset.submitted}</div>
      <div>
        <StatusBadge status={asset.status} />
      </div>
      <div className="actions-cell">
        <button className="action-btn review">
          <FaEye size={13} /> Review
        </button>
        {asset.status === "pending" && (
          <>
            <button className="action-btn approve" onClick={() => onApprove(asset.id)}>
              <FaCheckCircle size={13} /> Approve
            </button>
            <button className="action-btn reject" onClick={() => onReject(asset.id)}>
              <FaTimesCircle size={13} /> Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function HydroPowerEmpty() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <FaWater />
      </div>
      <h3>Hydro Power Not Connected</h3>
      <p>
        Hydro power integration is not yet available. Connect your hydro power data sources to
        begin tracking and managing hydro assets across organizations.
      </p>
      <button className="coming-soon-btn">
        <span className="cs-dot" />
        Integration coming soon
      </button>
    </div>
  );
}

export default function OrgAssets() {
  const [activeCategory, setActiveCategory] = useState("plantation");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orgFilter, setOrgFilter] = useState("all");
  const [assets, setAssets] = useState(ALL_ASSETS);

  const totalAssets = assets.length;
  const pendingCount = assets.filter((a) => a.status === "pending").length;
  const approvedCount = assets.filter((a) => a.status === "approved").length;
  const rejectedCount = assets.filter((a) => a.status === "rejected").length;

  const orgs = [...new Set(assets.map((a) => a.org))];
  const categoryCount = (cat) => assets.filter((a) => a.category === cat).length;

  const filteredByCategory =
    activeCategory === "hydro" ? [] : assets.filter((a) => a.category === activeCategory);
  const filteredByOrg =
    orgFilter === "all" ? filteredByCategory : filteredByCategory.filter((a) => a.org === orgFilter);
  const filtered =
    statusFilter === "all" ? filteredByOrg : filteredByOrg.filter((a) => a.status === statusFilter);

  const catPending = filteredByCategory.filter((a) => a.status === "pending").length;
  const catApproved = filteredByCategory.filter((a) => a.status === "approved").length;
  const catRejected = filteredByCategory.filter((a) => a.status === "rejected").length;

  function handleApprove(id) {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a)));
  }

  function handleReject(id) {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a)));
  }

  const categories = ["plantation", "fleet", "carbon", "solar", "hydro"];

  return (
    <div className="org-assets-page">
      <div className="page-header">
        <div className="header-icon-wrap">
          <MdOutlineBusinessCenter size={26} />
        </div>
        <div>
          <h1>Organization Assets</h1>
          <p>Review and manage asset submissions across all organizations</p>
        </div>
      </div>

      <div className="stat-cards">
        <StatCard
          label="Organizations"
          value={5}
          sub={`${totalAssets} total assets`}
          iconBg="green"
          icon={<MdOutlineBusinessCenter size={22} />}
        />
        <StatCard
          label="Pending Review"
          value={pendingCount}
          sub={`${totalAssets} total assets`}
          iconBg="yellow"
          icon={<MdAccessTime size={22} />}
        />
        <StatCard
          label="Approved"
          value={approvedCount}
          sub={`${totalAssets} total assets`}
          iconBg="blue"
          icon={<MdCheckCircleOutline size={22} />}
        />
        <StatCard
          label="Rejected"
          value={rejectedCount}
          sub={`${totalAssets} total assets`}
          iconBg="red"
          icon={<MdCancel size={22} />}
        />
      </div>

      <div className="category-tabs">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const count = cat === "hydro" ? 0 : categoryCount(cat);
          return (
            <button
              key={cat}
              className={`cat-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(cat);
                setStatusFilter("all");
              }}
            >
              {meta.icon}
              {meta.label}
              <span className="cat-count">{count}</span>
            </button>
          );
        })}
      </div>

      {activeCategory === "hydro" ? (
        <div className="assets-table-wrap">
          <HydroPowerEmpty />
        </div>
      ) : (
        <>
          <div className="status-tabs">
            {[
              {
                key: "all",
                label: "All",
                count: filteredByCategory.length,
                icon: <BsGrid size={13} />,
              },
              { key: "pending", label: "Pending", count: catPending, icon: <MdAccessTime size={13} /> },
              {
                key: "approved",
                label: "Approved",
                count: catApproved,
                icon: <MdCheckCircleOutline size={13} />,
              },
              {
                key: "rejected",
                label: "Rejected",
                count: catRejected,
                icon: <MdCancel size={13} />,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`st-tab ${statusFilter === tab.key ? "active" : ""}`}
                onClick={() => setStatusFilter(tab.key)}
              >
                {tab.icon} {tab.label} <span className="st-count">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="filters-bar">
            <div className="filters-label">
              <MdFilterAlt size={16} /> FILTERS
            </div>
            <div className="filter-group">
              <label>Organization</label>
              <select value={orgFilter} onChange={(e) => setOrgFilter(e.target.value)}>
                <option value="all">All Organizations</option>
                {orgs.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>From</label>
              <input type="date" />
            </div>
            <div className="filter-group">
              <label>To</label>
              <input type="date" />
            </div>
          </div>

          <div className="assets-table-wrap">
            <div className="assets-table-header">
              <span>Asset</span>
              <span>Organization</span>
              <span>Category</span>
              <span>Submitted</span>
              <span>Status</span>
              <span style={{ textAlign: "right" }}>Actions</span>
            </div>
            {filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: "48px 20px" }}>
                <p style={{ color: "#aaa", fontSize: "14px" }}>No assets match the current filters.</p>
              </div>
            ) : (
              filtered.map((asset) => (
                <AssetRow key={asset.id} asset={asset} onApprove={handleApprove} onReject={handleReject} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
