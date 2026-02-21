import React, { useMemo, useState } from "react";
import {
  MdAccessTime,
  MdCancel,
  MdCheckCircleOutline,
  MdFilterAlt,
} from "react-icons/md";
import { BsGrid } from "react-icons/bs";
import {
  FaCarSide,
  FaCheckCircle,
  FaEye,
  FaTimesCircle,
  FaTree,
  FaUndo,
  FaUser,
} from "react-icons/fa";
import { FaSolarPanel } from "react-icons/fa6";
import OrgCard from "@features/admin/pages/OrgCard";
import "@features/admin/styles/OrgAssets.css";

const ALL_USER_ASSETS = [
  {
    id: "asset-001",
    name: "Heritage Oak Planting",
    user: "Sarah Chen",
    category: "plantation",
    submitted: "Jan 15, 2026",
    status: "pending",
    location: "Portland, OR",
    co2: "22 kg CO2",
  },
  {
    id: "asset-002",
    name: "Redwood Seedling Grove",
    user: "Marcus Rivera",
    category: "plantation",
    submitted: "Feb 10, 2026",
    status: "pending",
    location: "Santa Cruz, CA",
    co2: "45 kg CO2",
  },
  {
    id: "asset-003",
    name: "Rooftop Solar Array",
    user: "James Park",
    category: "solar",
    submitted: "Jan 28, 2026",
    status: "pending",
    location: "Austin, TX",
    co2: "3200 kg CO2",
  },
  {
    id: "asset-004",
    name: "Tesla Model 3 Registration",
    user: "David Kim",
    category: "fleet",
    submitted: "Jan 22, 2026",
    status: "pending",
    location: "Seattle, WA",
    co2: "4100 kg CO2",
  },
  {
    id: "asset-005",
    name: "Mangrove Coastal Planting",
    user: "Priya Nair",
    category: "plantation",
    submitted: "Feb 5, 2026",
    status: "approved",
    location: "Miami, FL",
    co2: "310 kg CO2",
  },
  {
    id: "asset-006",
    name: "Community Solar Farm",
    user: "Leo Zhang",
    category: "solar",
    submitted: "Jan 2, 2026",
    status: "approved",
    location: "Phoenix, AZ",
    co2: "6100 kg CO2",
  },
  {
    id: "asset-007",
    name: "Nissan Leaf Registration",
    user: "Amy Brown",
    category: "fleet",
    submitted: "Dec 5, 2025",
    status: "rejected",
    location: "Denver, CO",
    co2: "2800 kg CO2",
  },
];

const CATEGORY_META = {
  plantation: { label: "Tree", icon: <FaTree />, color: "plantation" },
  fleet: { label: "EV", icon: <FaCarSide />, color: "fleet" },
  solar: { label: "Solar", icon: <FaSolarPanel />, color: "solar" },
};

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
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
  return <div className={`asset-icon-box ${category}`}>{meta?.icon || <FaTree />}</div>;
}

function AssetRow({ asset, onReview, onRevert, onOpenRevertAction }) {
  return (
    <div className="asset-row">
      <div className="asset-name-cell">
        <AssetIcon category={asset.category} />
        <div>
          <div className="asset-title">{asset.name}</div>
          <div className="asset-id">
            {asset.id} | {asset.location} | {asset.co2}
          </div>
        </div>
      </div>
      <div className="org-cell">
        <FaUser size={13} />
        {asset.user}
      </div>
      <div>
        <CategoryBadge category={asset.category} />
      </div>
      <div className="submitted-cell">{asset.submitted}</div>
      <div>
        <StatusBadge status={asset.status} />
      </div>
      <div className="actions-cell">
        {asset.status !== "pending" && (
          <button className="action-btn revert" onClick={() => onRevert(asset.id)}>
            <FaUndo size={12} /> Revert
          </button>
        )}
        <button className="action-btn review" onClick={() => onReview(asset)}>
          <FaEye size={13} /> Review
        </button>
        {asset.status === "pending" && (
          <>
            <button
              className="action-btn approve icon-only"
              onClick={() => onOpenRevertAction(asset, "approved")}
              aria-label="Approve"
              title="Approve"
            >
              <FaCheckCircle size={14} />
            </button>
            <button
              className="action-btn reject icon-only"
              onClick={() => onOpenRevertAction(asset, "rejected")}
              aria-label="Reject"
              title="Reject"
            >
              <FaTimesCircle size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function UserAssets() {
  const [activeCategory, setActiveCategory] = useState("plantation");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [assets, setAssets] = useState(ALL_USER_ASSETS);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedReviewAsset, setSelectedReviewAsset] = useState(null);
  const [revertDialog, setRevertDialog] = useState({ open: false, asset: null, action: null });
  const [revertReason, setRevertReason] = useState("");
  const [revertError, setRevertError] = useState("");

  const users = useMemo(() => [...new Set(assets.map((a) => a.user))], [assets]);

  const filteredByCategory = assets.filter((a) => a.category === activeCategory);
  const filteredByUser =
    userFilter === "all" ? filteredByCategory : filteredByCategory.filter((a) => a.user === userFilter);
  const filtered =
    statusFilter === "all" ? filteredByUser : filteredByUser.filter((a) => a.status === statusFilter);

  const catPending = filteredByCategory.filter((a) => a.status === "pending").length;
  const catApproved = filteredByCategory.filter((a) => a.status === "approved").length;
  const catRejected = filteredByCategory.filter((a) => a.status === "rejected").length;

  function handleReview(asset) {
    setSelectedReviewAsset(asset);
    setIsReviewOpen(true);
  }

  function handleCloseReview() {
    setIsReviewOpen(false);
    setSelectedReviewAsset(null);
  }

  function handleReviewDecision(nextStatus) {
    if (!selectedReviewAsset?.id) return;
    setAssets((prev) =>
      prev.map((a) => (a.id === selectedReviewAsset.id ? { ...a, status: nextStatus } : a))
    );
  }

  function handleRevert(id) {
    const asset = assets.find((a) => a.id === id);
    if (!asset) return;
    setRevertDialog({ open: true, asset, action: "pending" });
    setRevertReason("");
    setRevertError("");
  }

  function handleOpenRevertAction(asset, action) {
    setRevertDialog({ open: true, asset, action });
    setRevertReason("");
    setRevertError("");
  }

  function handleCloseRevertDialog() {
    setRevertDialog({ open: false, asset: null, action: null });
    setRevertReason("");
    setRevertError("");
  }

  function handleConfirmRevert() {
    if (!revertDialog.asset?.id || !revertDialog.action) return;
    if (revertDialog.action === "rejected" && !revertReason.trim()) {
      setRevertError("Reason is required for rejection.");
      return;
    }

    const targetId = revertDialog.asset.id;
    setAssets((prev) =>
      prev.map((a) =>
        a.id === targetId
          ? {
              ...a,
              status: revertDialog.action,
              rejectionReason:
                revertDialog.action === "rejected" ? revertReason.trim() : a.rejectionReason,
            }
          : a
      )
    );
    handleCloseRevertDialog();
  }

  const categories = ["plantation", "fleet", "solar"];
  const reviewAssetForModal = selectedReviewAsset
    ? {
        ...selectedReviewAsset,
        org: selectedReviewAsset.user,
      }
    : null;

  return (
    <div className="org-assets-page">
      <div className="page-header">
        <div className="header-icon-wrap">
          <FaUser size={22} />
        </div>
        <div>
          <h1>User Assets</h1>
          <p>Review and manage asset submissions across all users</p>
        </div>
      </div>

      <div className="category-tabs">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const count = assets.filter((a) => a.category === cat).length;
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
        <div className="filters-controls">
          <div className="filter-group">
            <label>User</label>
            <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
              <option value="all">All Users</option>
              {users.map((u) => (
                <option key={u} value={u}>
                  {u}
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
      </div>

      <div className="assets-table-wrap">
        <div className="assets-table-header">
          <span>Asset</span>
          <span>User</span>
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
            <AssetRow
              key={asset.id}
              asset={asset}
              onReview={handleReview}
              onRevert={handleRevert}
              onOpenRevertAction={handleOpenRevertAction}
            />
          ))
        )}
      </div>

      {revertDialog.open && (
        <div className="revert-dialog-overlay">
          <div className="revert-dialog">
            <h3>
              Confirm{" "}
              {revertDialog.action === "approved"
                ? "Approval"
                : revertDialog.action === "rejected"
                ? "Rejection"
                : "Revert"}
            </h3>
            <p>
              {revertDialog.action === "pending"
                ? "Are you sure you want to revert this asset to pending?"
                : `Are you sure you want to ${
                    revertDialog.action === "approved" ? "approve" : "reject"
                  } this asset?`}
            </p>
            {revertDialog.action === "rejected" && (
              <div className="revert-dialog-field">
                <label htmlFor="revert-reason">Reason</label>
                <textarea
                  id="revert-reason"
                  className="revert-dialog-input"
                  placeholder="Enter reason for rejection"
                  value={revertReason}
                  onChange={(event) => {
                    setRevertReason(event.target.value);
                    if (revertError) setRevertError("");
                  }}
                />
              </div>
            )}
            {revertError && <p className="revert-dialog-error">{revertError}</p>}
            <div className="revert-dialog-actions">
              <button className="revert-dialog-btn cancel" onClick={handleCloseRevertDialog}>
                Cancel
              </button>
              <button
                className={`revert-dialog-btn ${
                  revertDialog.action === "rejected" ? "reject" : "approve"
                }`}
                onClick={handleConfirmRevert}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {isReviewOpen && reviewAssetForModal && (
        <OrgCard
          asset={reviewAssetForModal}
          onClose={handleCloseReview}
          onDecision={handleReviewDecision}
        />
      )}
    </div>
  );
}
