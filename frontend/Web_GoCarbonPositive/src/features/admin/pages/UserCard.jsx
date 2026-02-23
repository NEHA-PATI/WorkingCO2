import React, { useEffect, useMemo, useState } from "react";
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
import { assetApiClient as apiClient } from "@shared/utils/apiClient";
import "@features/admin/styles/OrgAssets.css";

const CATEGORY_META = {
  tree: { label: "Tree", icon: <FaTree />, color: "plantation" },
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
          <div className="asset-id">{asset.id}</div>
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
          <button className="action-btn revert" onClick={() => onRevert(asset)}>
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
  const [activeCategory, setActiveCategory] = useState("tree");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedReviewAsset, setSelectedReviewAsset] = useState(null);
  const [revertDialog, setRevertDialog] = useState({ open: false, asset: null, action: null });
  const [revertReason, setRevertReason] = useState("");
  const [revertError, setRevertError] = useState("");

  const extractImageUrls = (payload) => {
    const objectUrls = Array.isArray(payload?.images)
      ? payload.images
          .map((img) =>
            typeof img === "string"
              ? img
              : img?.image_url || img?.url || img?.secure_url
          )
          .filter(Boolean)
      : [];
    const arrayUrls = Array.isArray(payload?.tree_images)
      ? payload.tree_images.filter(Boolean)
      : [];
    return objectUrls.length ? objectUrls : arrayUrls;
  };

  useEffect(() => {
    const formatDate = (value) => {
      if (!value) return "-";
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return "-";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const mapTreeAsset = (row) => ({
      id: String(row.tid ?? row.id),
      name: row.treename || row.asset_name || `Tree ${row.tid ?? row.id}`,
      user: row.username || row.user_name || row.u_id || "-",
      category: "tree",
      submitted: formatDate(row.submitted_on || row.created_at),
      status: String(row.status || "pending").toLowerCase(),
      raw: row,
    });

    const mapEvAsset = (row) => ({
      id: String(row.ev_id ?? row.id),
      name: `${row.manufacturers || ""} ${row.model || ""}`.trim() || `EV ${row.ev_id ?? row.id}`,
      user: row.username || row.user_name || row.u_id || "-",
      category: "fleet",
      submitted: formatDate(row.created_at),
      status: String(row.status || "pending").toLowerCase(),
      raw: row,
    });

    const loadAssets = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [treeResult, evResult] = await Promise.allSettled([
          apiClient.get("/tree/admin/all"),
          apiClient.get("/evmasterdata/admin/all"),
        ]);

        const treeRows =
          treeResult.status === "fulfilled" && Array.isArray(treeResult.value?.data?.data)
            ? treeResult.value.data.data
            : [];
        const evRows =
          evResult.status === "fulfilled" && Array.isArray(evResult.value?.data?.data)
            ? evResult.value.data.data
            : [];

        if (treeResult.status === "rejected" && evResult.status === "rejected") {
          throw new Error("Failed to load tree and EV assets");
        }

        setAssets([...treeRows.map(mapTreeAsset), ...evRows.map(mapEvAsset)]);
      } catch (err) {
        setError(err?.message || "Failed to load assets");
        setAssets([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  const users = useMemo(() => [...new Set(assets.map((a) => a.user))], [assets]);

  const filteredByCategory = assets.filter((a) => a.category === activeCategory);
  const filteredByUser =
    userFilter === "all" ? filteredByCategory : filteredByCategory.filter((a) => a.user === userFilter);
  const filtered =
    statusFilter === "all" ? filteredByUser : filteredByUser.filter((a) => a.status === statusFilter);

  const catPending = filteredByCategory.filter((a) => a.status === "pending").length;
  const catApproved = filteredByCategory.filter((a) => a.status === "approved").length;
  const catRejected = filteredByCategory.filter((a) => a.status === "rejected").length;

  async function handleReview(asset) {
    try {
      if (asset.category === "fleet") {
        const res = await apiClient.get(`/evmasterdata/single/${asset.id}`);
        const data = res?.data?.data || res?.data || {};

        setSelectedReviewAsset({
          ...asset,
          category: "fleet",
          org: asset.user,
          name: data.manufacturers && data.model ? `${data.manufacturers} ${data.model}` : asset.name,
          evId: data.ev_id ?? asset.id,
          vuid: data.vuid || "-",
          uId: data.u_id || "-",
          evCategory: data.category || "-",
          manufacturers: data.manufacturers || "-",
          evModel: data.model || "-",
          purchaseYear: data.purchase_year ?? "-",
          energyConsumed: data.energy_consumed ?? "-",
          primaryChargingType: data.primary_charging_type || "-",
          evRange: data.range ?? "-",
          gridEmissionFactor: data.grid_emission_factor ?? "-",
          topSpeed: data.top_speed ?? "-",
          chargingTime: data.charging_time ?? "-",
          motorPower: data.motor_power || "-",
          status: data.status || asset.status || "-",
          createdAt: data.created_at || "-",
          updatedAt: data.updated_at || "-",
          raw: data,
        });
      } else {
        const res = await apiClient.get(`/tree/single/${asset.id}`);
        const data = res?.data?.data || res?.data || {};

        setSelectedReviewAsset({
          ...asset,
          org: asset.user,
          name: data.treename || asset.name,
          treeId: data.tid ?? asset.id,
          treeUid: data.t_uid || "-",
          treeName: data.treename || "-",
          botanicalName: data.botanicalname || "-",
          plantingDate: data.plantingdate || "-",
          height: data.height ?? "-",
          dbh: data.dbh ?? "-",
          location: data.location || "-",
          createdBy: data.created_by || "-",
          treeStatus: data.status || asset.status || "-",
          createdAt: data.created_at || "-",
          updatedAt: data.updated_at || "-",
          treeImages: extractImageUrls(data),
          raw: data,
        });
      }

      setIsReviewOpen(true);
    } catch (err) {
      setRevertError(err?.message || "Failed to load asset details.");
    }
  }

  function handleCloseReview() {
    setIsReviewOpen(false);
    setSelectedReviewAsset(null);
  }

  async function handleReviewDecision(nextStatus) {
    if (!selectedReviewAsset?.id) return;
    try {
      const path =
        selectedReviewAsset.category === "fleet"
          ? `/evmasterdata/${selectedReviewAsset.id}/status`
          : `/tree/${selectedReviewAsset.id}/status`;
      await apiClient.patch(path, {
        status: nextStatus,
      });
      setAssets((prev) =>
        prev.map((a) => (a.id === selectedReviewAsset.id ? { ...a, status: nextStatus } : a))
      );
    } catch (err) {
      setRevertError(err?.message || "Failed to update status.");
    }
  }

  function handleRevert(asset) {
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

  async function handleConfirmRevert() {
    if (!revertDialog.asset?.id || !revertDialog.action) return;
    if (revertDialog.action === "rejected" && !revertReason.trim()) {
      setRevertError("Reason is required for rejection.");
      return;
    }

    const targetId = revertDialog.asset.id;
    try {
      const path =
        revertDialog.asset.category === "fleet"
          ? `/evmasterdata/${targetId}/status`
          : `/tree/${targetId}/status`;
      await apiClient.patch(path, {
        status: revertDialog.action,
      });
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
    } catch (err) {
      setRevertError(err?.message || "Failed to update status.");
    }
  }

  const categories = ["tree", "fleet"];
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
        {error && (
          <div className="empty-state" style={{ padding: "16px 20px" }}>
            <p style={{ color: "#ff8a8a", fontSize: "14px" }}>{error}</p>
          </div>
        )}
        {isLoading ? (
          <div className="empty-state" style={{ padding: "48px 20px" }}>
            <p style={{ color: "#aaa", fontSize: "14px" }}>Loading assets...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: "48px 20px" }}>
            <p style={{ color: "#aaa", fontSize: "14px" }}>No assets match the current filters.</p>
          </div>
        ) : (
          filtered.map((asset) => (
            <AssetRow
              key={`${asset.category}-${asset.id}`}
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
