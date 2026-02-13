import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCarSide,
  FaTree,
  FaSolarPanel,
  FaClock,
  FaCircleCheck,
  FaCircleXmark,
  FaDownload,
  FaClockRotateLeft,
} from "react-icons/fa6";

import "@features/admin/styles/AssetManagement.css";

const ITEMS_PER_PAGE = 10;

const AssetManagement = () => {
  const [activeSubmitterTab, setActiveSubmitterTab] = useState("individual");
  const [activeAssetFilter, setActiveAssetFilter] = useState("tree");
  const [activeWorkflowTab, setActiveWorkflowTab] = useState("pendingRequests");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [rejectedAssets, setRejectedAssets] = useState([]);

  // confirmation modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // "accept" | "reject"
  const [confirmAsset, setConfirmAsset] = useState(null);

  // pagination state
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingApprovalPage, setPendingApprovalPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);

  /* ================= BACKEND STATE ================= */
  const [metrics, setMetrics] = useState({
    totalEV: 0,
    totalTrees: 0,
    totalSolar: 0,
    pendingReview: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0,
  });

  // single source of truth
  const [workflowAssets, setWorkflowAssets] = useState([]);
  const [approvedAssets, setApprovedAssets] = useState([]);
const getStatusUpdateUrl = (asset) => {
  if (asset.submittedByType === "organisation") {
    return `/api/org-assets/${asset.id}/status`;
  }
  return `/api/assets/${asset.assetType}/${asset.id}/status`;
};

const getDetailsUrl = (asset) => {
  if (asset.submittedByType === "organisation") {
    return `/api/org-assets/${asset.id}/details`; // ✅ UUID safe
  }
  return `/api/assets/${asset.assetType}/${asset.id}/details`; // user assets
};




  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [metricsRes, workflowRes, approvedRes] = await Promise.all([
          axios.get("/api/assets/metrics"),
          axios.get("/api/assets/workflow"),
          axios.get("/api/assets/approved"),
        ]);

        setMetrics({
          totalEV: Number(metricsRes.data.totalEV),
          totalTrees: Number(metricsRes.data.totalTrees),
          totalSolar: Number(metricsRes.data.totalSolar),
          pendingReview: Number(metricsRes.data.pendingReview),
          pendingApproval: Number(metricsRes.data.pendingApproval || 0),
          approved: Number(metricsRes.data.approved),
          rejected: Number(metricsRes.data.rejected),
        });

        setWorkflowAssets(
  workflowRes.data.map((a, index) => {
    const assetType =
      a.type === "EV" ? "ev" : a.type === "TREE" ? "tree" : "solar";

    const status =
      a.status === "pending"
        ? "Pending Review"
        : a.status === "pending_approval"
        ? "Pending Approval"
        : a.status === "rejected"
        ? "Rejected"
        : "Pending Review";

    return {
      id: a.id,
      _uiKey: `${assetType}-${a.id}-${a.u_id}-${index}`, // ✅ ADD THIS
      assetType,
      type:
        a.type === "EV"
          ? "Electric Vehicle"
          : a.type === "TREE"
          ? "Trees"
          : "Solar Panel",
      status,
      submittedBy: a.u_id,
      submittedOn: new Date(a.submitted_on).toLocaleDateString(),

       // 🔥 THIS LINE IS MANDATORY
  submittedByType: (a.submittedbytype || "individual").toLowerCase(),
    };
  })
);


        setApprovedAssets(
  approvedRes.data.map((a, index) => ({
    id: a.id,
    _uiKey: `approved-${a.type}-${a.id}-${a.u_id}-${index}`,
    assetType:
      a.type === "EV"
        ? "ev"
        : a.type === "TREE"
        ? "tree"
        : "solar",
    type:
      a.type === "EV"
        ? "Electric Vehicle"
        : a.type === "TREE"
        ? "Trees"
        : "Solar Panel",
    status: "Approved",
    submittedBy: a.u_id,
    submittedOn: new Date(a.created_at).toLocaleDateString(),

    // ✅ THIS IS THE KEY FIX
    submittedByType:
      (a.submittedByType || a.submittedbytype || "individual").toLowerCase(),
  }))
);




      } catch (err) {
        console.error("Failed to load asset data", err);
      }
    };

    loadData();
  }, []);

  /* ---------- CSV EXPORT HELPERS ---------- */
  const convertToCsv = (rows) => {
    if (!rows || rows.length === 0) return "";
    const headers = Object.keys(rows[0]);
    return [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => `"${r[h] ?? ""}"`).join(",")),
    ].join("\n");
  };

  const downloadCsv = (rows, filename) => {
    const csv = convertToCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    downloadCsv(
      [...workflowAssets, ...approvedAssets],
      "asset-management-export.csv"
    );
  };

  /* ---------- MODAL / WORKFLOW HANDLERS ---------- */
const openReviewModal = async (asset) => {
  try {
    const res = await axios.get(getDetailsUrl(asset));
    const data = res.data;

    // ✅ ORGANISATION TREE ASSET
    if (asset.submittedByType === "organisation") {
      setSelectedAsset({
        ...asset,

        // Map org plantation → popup fields
        treeName: data.species_name,
        botanicalName: data.species_name, // (agar alag column nahi hai)
        plantingDate: data.plantation_date
          ? new Date(data.plantation_date).toLocaleDateString()
          : "-",
        height: data.avg_height,
        dbh: data.avg_dbh,
        location: `${data.location_lat}, ${data.location_long}`,
        createdBy: data.u_id,

        // org assets me images optional
        treeImages: [],
      });

      setReviewModalOpen(true);
      return;
    }

    // ✅ USER ASSETS (EV / TREE / SOLAR)
    setSelectedAsset({
      ...asset,

      // EV
      vehicleCategory: data.category,
      manufacturer: data.manufacturers,
      model: data.model,
      purchaseYear: data.purchase_year,
      energyConsumed: data.energy_consumed,
      primaryChargingType: data.primary_charging_type,
      range: data.range,
      gridEmissionFactor: data.grid_emission_factor,
      topSpeed: data.top_speed,
      chargingTime: data.charging_time,
      motorPower: data.motor_power,

      // Tree
      treeName: data.treename,
      botanicalName: data.botanicalname,
      plantingDate: data.plantingdate,
      height: data.height,
      dbh: data.dbh,
      location: data.location,
      createdBy: data.created_by,
      treeImages: data.images || data.tree_images || [],

      // Solar
      installedCapacity: data.installed_capacity,
      installationDate: data.installation_date,
      energyGenerationValue: data.energy_generation_value,
      solarGridEmissionFactor: data.grid_emission_factor,
      inverterType: data.inverter_type,
    });

    setReviewModalOpen(true);
  } catch (err) {
    console.error("Failed to load asset details", err);
  }
};


  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedAsset(null);
  };

  // actual backend call when confirmed
  const handleAcceptConfirmed = async (asset) => {
  try {
 await axios.put(`/api/org-assets/${asset.id}/status`, {
  status: "approved",
});




    setWorkflowAssets((prev) => prev.filter((a) => a.id !== asset.id));

    setApprovedAssets((prev) => [
      {
        ...asset,
        status: "Approved",
        submittedByType: asset.submittedByType,
      },
      ...prev,
    ]);

    setMetrics((prev) => ({
      ...prev,
      pendingReview: Math.max(prev.pendingReview - 1, 0),
      approved: prev.approved + 1,
    }));

    closeReviewModal();
  } catch (err) {
    console.error("Approve failed", err);
  }
};


  const handleRejectConfirmed = async (asset) => {
  try {
 await axios.put(`/api/org-assets/${asset.id}/status`, {
  status: "rejected",
});




    setWorkflowAssets((prev) => prev.filter((a) => a.id !== asset.id));

    setMetrics((prev) => ({
      ...prev,
      pendingReview: Math.max(prev.pendingReview - 1, 0),
      rejected: prev.rejected + 1,
    }));

    closeReviewModal();
  } catch (err) {
    console.error("Reject failed", err);
  }
};


  // open confirmation modal
  const requestConfirm = (action, asset) => {
    setConfirmAction(action); // "accept" or "reject"
    setConfirmAsset(asset);
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
    setConfirmAction(null);
    setConfirmAsset(null);
  };

  const handleConfirmYes = () => {
    if (!confirmAsset || !confirmAction) {
      closeConfirmModal();
      return;
    }

    if (confirmAction === "accept") {
      handleAcceptConfirmed(confirmAsset);
    } else if (confirmAction === "reject") {
      handleRejectConfirmed(confirmAsset);
    }

    closeConfirmModal();
  };

  // load rejected list only when rejected tab active
  useEffect(() => {
    if (activeWorkflowTab !== "rejected") return;

    const loadRejected = async () => {
      const res = await axios.get("/api/assets/rejected");

      setRejectedAssets(
  res.data.map((a, index) => ({
    id: a.id,
    _uiKey: `rejected-${a.type}-${a.id}-${a.u_id}-${index}`, // ✅ ADD THIS
    assetType:
      a.type === "EV" ? "ev" : a.type === "TREE" ? "tree" : "solar",
    type:
      a.type === "EV"
        ? "Electric Vehicle"
        : a.type === "TREE"
        ? "Trees"
        : "Solar Panel",
    status: "Rejected",
    submittedBy: a.u_id,
    submittedOn: new Date(a.created_at).toLocaleDateString(),

    // 🔥 REQUIRED
    submittedByType: (a.submittedbytype || "individual").toLowerCase(),

  }))
);

    };

    loadRejected();
  }, [activeWorkflowTab]);

  useEffect(() => {
    if (activeWorkflowTab !== "rejected") {
      setRejectedAssets([]);
    }
  }, [activeWorkflowTab]);

  // derived workflow lists
  const pendingRequestsList = workflowAssets.filter(
    (a) => a.status === "Pending Review"
  );
  const pendingApprovalList = workflowAssets.filter(
    (a) => a.status === "Pending Approval"
  );

  // pagination helpers
  const paginate = (list, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
  };

  const pendingPaged = paginate(pendingRequestsList, pendingPage);
  const pendingApprovalPaged = paginate(
    pendingApprovalList,
    pendingApprovalPage
  );
  const rejectedPaged = paginate(rejectedAssets, rejectedPage);

  // approved assets – derive by submitter + type filter at render time
  const approvedBySubmitter =
    activeSubmitterTab === "individual"
      ? approvedAssets.filter((a) => a.submittedByType !== "organisation")
      : approvedAssets.filter((a) => a.submittedByType === "organisation");

  const approvedFiltered = approvedBySubmitter.filter(
    (a) => a.assetType === activeAssetFilter
  );
  const approvedPaged = paginate(approvedFiltered, approvedPage);
  const hasApprovedForSelection = approvedFiltered.length > 0;

  const totalPages = (len) => Math.max(1, Math.ceil(len / ITEMS_PER_PAGE));

  const renderPagination = (page, setPage, totalItems) => {
    const pages = totalPages(totalItems);
    if (pages <= 1) return null;


    
    return (
      <div className="am26-pagination">
        <button
          className="am26-pagination-btn"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="am26-pagination-info">
          Page {page} of {pages}
        </span>
        <button
          className="am26-pagination-btn"
          disabled={page === pages}
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
        >
          Next
        </button>
      </div>
    );
  };

  /* --------- RENDER HELPERS FOR MODAL DETAILS ---------- */

  const renderEVDetails = (asset) => (
    <>
      <div className="am26-modal-section-title">Electric Vehicle Details</div>
      <div className="am26-modal-details-grid am26-modal-details-grid-wide">
        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Vehicle Category</div>
          <div className="am26-modal-detail-value">
            {asset.vehicleCategory || "-"}
          </div>
        </div>
        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Manufacturer</div>
          <div className="am26-modal-detail-value">
            {asset.manufacturer || "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Model</div>
          <div className="am26-modal-detail-value">{asset.model || "-"}</div>
        </div>
        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Purchase Year</div>
          <div className="am26-modal-detail-value">
            {asset.purchaseYear || "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">
            Energy consumed (kWh)
          </div>
          <div className="am26-modal-detail-value">
            {asset.energyConsumed ?? "-"}
          </div>
        </div>
        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Primary Charging Type</div>
          <div className="am26-modal-detail-value">
            {asset.primaryChargingType || "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Range (km)</div>
          <div className="am26-modal-detail-value">{asset.range ?? "-"}</div>
        </div>
        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Grid Emission Factor</div>
          <div className="am26-modal-detail-value">
            {asset.gridEmissionFactor ?? "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Top Speed (km/h)</div>
          <div className="am26-modal-detail-value">
            {asset.topSpeed ?? "-"}
          </div>
        </div>
        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">
            Charging time (hours)
          </div>
          <div className="am26-modal-detail-value">
            {asset.chargingTime ?? "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Motor power (HP)</div>
          <div className="am26-modal-detail-value">
            {asset.motorPower ?? "-"}
          </div>
        </div>
      </div>
    </>
  );

  const renderSolarDetails = (asset) => (
    <>
      <div className="am26-modal-section-title">Solar Panel Details</div>
      <div className="am26-modal-details-grid am26-modal-details-grid-wide">
        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Installed Capacity (kW)</div>
          <div className="am26-modal-detail-value">
            {asset.installedCapacity ?? "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Installation Date</div>
          <div className="am26-modal-detail-value">
            {asset.installationDate || "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">
            Energy Generation Value
          </div>
          <div className="am26-modal-detail-value">
            {asset.energyGenerationValue ?? "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Grid Emission Factor</div>
          <div className="am26-modal-detail-value">
            {asset.solarGridEmissionFactor ?? "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Inverter Type</div>
          <div className="am26-modal-detail-value">
            {asset.inverterType || "-"}
          </div>
        </div>
      </div>
    </>
  );

  const renderTreeDetails = (asset) => (
    <>
      <div className="am26-modal-section-title">Tree Details</div>
      <div className="am26-modal-details-grid am26-modal-details-grid-wide">
        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Tree Name</div>
          <div className="am26-modal-detail-value">
            {asset.treeName || "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Botanical Name</div>
          <div className="am26-modal-detail-value">
            {asset.botanicalName || "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Planting Date</div>
          <div className="am26-modal-detail-value">
            {asset.plantingDate || "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Height (m)</div>
          <div className="am26-modal-detail-value">
            {asset.height ?? "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">DBH (cm)</div>
          <div className="am26-modal-detail-value">{asset.dbh ?? "-"}</div>
        </div>

        <div className="am26-modal-detail am26-modal-detail-span-2">
          <div className="am26-modal-detail-label">Location</div>
          <div className="am26-modal-detail-value">
            {asset.location || "-"}
          </div>
        </div>

        <div className="am26-modal-detail">
          <div className="am26-modal-detail-label">Created By</div>
          <div className="am26-modal-detail-value">
            {asset.createdBy || "-"}
          </div>
        </div>
      </div>

      {asset.treeImages && asset.treeImages.length > 0 && (
        <>
          <div className="am26-modal-section-title">Tree Images</div>
          <div className="am26-tree-images-grid">
            {asset.treeImages.map((src, idx) => (
              <div key={idx} className="am26-tree-image-wrap">
                <img
                  src={src}
                  alt={`Tree ${idx + 1}`}
                  className="am26-tree-image"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );

  const renderAssetSpecificDetails = (asset) => {
    if (!asset) return null;
    if (asset.assetType === "ev") return renderEVDetails(asset);
    if (asset.assetType === "solar") return renderSolarDetails(asset);
    if (asset.assetType === "tree") return renderTreeDetails(asset);
    return null;
  };

  /* ================= UI ================= */
  return (
    <div className="am26-page">
      {/* Top heading + export */}
      <div className="am26-page-header">
        <div>
          <h1 className="am26-page-title">Asset Management</h1>
          <p className="am26-page-subtitle">
            Review and manage user-submitted assets
          </p>
        </div>
        <button className="am26-export-btn" onClick={handleExport}>
          <FaDownload className="am26-export-icon" />
          Export Data
        </button>
      </div>

      {/* Summary cards */}
      <div className="am26-summary-row">
        <div className="am26-summary-card am26-summary-blue am26-card-hover">
          <div className="am26-summary-label">Total Electric Vehicles</div>
          <div className="am26-summary-bottom">
            <span className="am26-summary-value">{metrics.totalEV}</span>
            <FaCarSide className="am26-summary-icon am26-icon-ev" />
          </div>
        </div>
        <div className="am26-summary-card am26-summary-green am26-card-hover">
          <div className="am26-summary-label">Total Trees Planted</div>
          <div className="am26-summary-bottom">
            <span className="am26-summary-value">{metrics.totalTrees}</span>
            <FaTree className="am26-summary-icon am26-icon-tree" />
          </div>
        </div>
        <div className="am26-summary-card am26-summary-orange am26-card-hover">
          <div className="am26-summary-label">Total Solar Panels</div>
          <div className="am26-summary-bottom">
            <span className="am26-summary-value">{metrics.totalSolar}</span>
            <FaSolarPanel className="am26-summary-icon am26-icon-solar" />
          </div>
        </div>
      </div>

      {/* Status cards row */}
      <div className="am26-status-row">
        <div className="am26-status-card am26-card-hover">
          <div className="am26-status-label">Pending Review</div>
          <div className="am26-status-bottom">
            <span className="am26-status-value">{metrics.pendingReview}</span>
            <FaClock className="am26-status-icon am26-icon-pending" />
          </div>
        </div>
        <div className="am26-status-card am26-card-hover">
          <div className="am26-status-label">Pending Approval</div>
          <div className="am26-status-bottom">
            <span className="am26-status-value">
              {metrics.pendingApproval}
            </span>
            <FaClockRotateLeft className="am26-status-icon am26-icon-pending-approval" />
          </div>
        </div>
        <div className="am26-status-card am26-card-hover">
          <div className="am26-status-label">Approved</div>
          <div className="am26-status-bottom">
            <span className="am26-status-value">{metrics.approved}</span>
            <FaCircleCheck className="am26-status-icon am26-icon-approved" />
          </div>
        </div>
        <div className="am26-status-card am26-card-hover">
          <div className="am26-status-label">Rejected</div>
          <div className="am26-status-bottom">
            <span className="am26-status-value">{metrics.rejected}</span>
            <FaCircleXmark className="am26-status-icon am26-icon-rejected" />
          </div>
        </div>
      </div>

      {/* Asset Review Workflow */}
      <section className="am26-review-section am26-card-hover">
        <div className="am26-review-header">
          <h2 className="am26-section-title">Asset Review Workflow</h2>
          <p className="am26-section-subtitle">
            Manage submissions through review and approval stages
          </p>
        </div>

        {/* segmented toggle for workflow tabs */}
        <div className="am26-segmented-tabs">
          <button
            className={`am26-segmented-tab am26-segmented-pending ${
              activeWorkflowTab === "pendingRequests"
                ? "am26-segmented-tab-active"
                : ""
            }`}
            onClick={() => {
              setActiveWorkflowTab("pendingRequests");
              setPendingPage(1);
            }}
          >
            Pending Requests ({pendingRequestsList.length})
          </button>
          <button
            className={`am26-segmented-tab am26-segmented-approval ${
              activeWorkflowTab === "pendingApproval"
                ? "am26-segmented-tab-active"
                : ""
            }`}
            onClick={() => {
              setActiveWorkflowTab("pendingApproval");
              setPendingApprovalPage(1);
            }}
          >
            Pending Approval ({pendingApprovalList.length})
          </button>
          <button
            className={`am26-segmented-tab am26-segmented-rejected ${
              activeWorkflowTab === "rejected"
                ? "am26-segmented-tab-active"
                : ""
            }`}
            onClick={() => {
              setActiveWorkflowTab("rejected");
              setRejectedPage(1);
            }}
          >
            Rejected ({metrics.rejected})
          </button>
        </div>

        <div className="am26-workflow-list">
          {/* Pending Requests */}
          {activeWorkflowTab === "pendingRequests" &&
            (pendingPaged.length > 0 ? (
              <>
                {pendingPaged.map((asset) => (
                  <div
                    key={asset._uiKey}               // ✅

                    className="am26-workflow-item am26-card-hover am26-workflow-pending"
                  >
                    <div className="am26-workflow-main">
                      <div className="am26-workflow-icon-wrap">
                        {asset.type === "Electric Vehicle" && (
                          <FaCarSide className="am26-workflow-icon am26-icon-ev" />
                        )}
                        {asset.type === "Trees" && (
                          <FaTree className="am26-workflow-icon am26-icon-tree" />
                        )}
                        {asset.type === "Solar Panel" && (
                          <FaSolarPanel className="am26-workflow-icon am26-icon-solar" />
                        )}
                      </div>

                      <div>
                        <div className="am26-workflow-title">
                          {asset.type}
                        </div>
                        <div className="am26-workflow-meta">
                          <span>Submitted by {asset.submittedBy}</span>
                          <span className="am26-workflow-dot">•</span>
                          <span>{asset.submittedOn}</span>
                          <span className="am26-workflow-status am26-pill-pending">
                            Pending Review
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="am26-workflow-actions">
                      <button
                        className="am26-button am26-btn-outline"
                        onClick={() => openReviewModal(asset)}
                      >
                        Review
                      </button>

                      <button
                        className="am26-button am26-btn-primary"
                        onClick={() => requestConfirm("accept", asset)}
                      >
                        Accept
                      </button>

                      <button
                        className="am26-button am26-btn-danger"
                        onClick={() => requestConfirm("reject", asset)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {renderPagination(
                  pendingPage,
                  setPendingPage,
                  pendingRequestsList.length
                )}
              </>
            ) : (
              <div className="am26-empty-text">
                No pending requests available.
              </div>
            ))}

          {/* Pending Approval */}
          {activeWorkflowTab === "pendingApproval" &&
            (pendingApprovalPaged.length > 0 ? (
              <>
                {pendingApprovalPaged.map((asset) => (
                  <div
                    key={asset._uiKey}               // ✅

                    className="am26-workflow-item am26-card-hover am26-workflow-approval"
                  >
                    <div className="am26-workflow-main">
                      <div className="am26-workflow-icon-wrap">
                        {asset.type === "Electric Vehicle" && (
                          <FaCarSide className="am26-workflow-icon am26-icon-ev" />
                        )}
                        {asset.type === "Trees" && (
                          <FaTree className="am26-workflow-icon am26-icon-tree" />
                        )}
                        {asset.type === "Solar Panel" && (
                          <FaSolarPanel className="am26-workflow-icon am26-icon-solar" />
                        )}
                      </div>

                      <div>
                        <div className="am26-workflow-title">
                          {asset.type}
                        </div>
                        <div className="am26-workflow-meta">
                          <span>Submitted by {asset.submittedBy}</span>
                          <span className="am26-workflow-dot">•</span>
                          <span>{asset.submittedOn}</span>
                          <span className="am26-workflow-status am26-pill-pending-approval">
                            Pending Approval
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {renderPagination(
                  pendingApprovalPage,
                  setPendingApprovalPage,
                  pendingApprovalList.length
                )}
              </>
            ) : (
              <div className="am26-empty-text">
                No assets in pending approval.
              </div>
            ))}

          {/* Rejected */}
          {activeWorkflowTab === "rejected" &&
            (rejectedPaged.length > 0 ? (
              <>
                {rejectedPaged.map((asset) => (
                  <div
                    key={asset._uiKey}               // ✅
                    className="am26-workflow-item am26-card-hover am26-workflow-rejected"
                  >
                    <div className="am26-workflow-main">
                      <div className="am26-workflow-icon-wrap">
                        {asset.type === "Electric Vehicle" && (
                          <FaCarSide className="am26-workflow-icon am26-icon-ev" />
                        )}
                        {asset.type === "Trees" && (
                          <FaTree className="am26-workflow-icon am26-icon-tree" />
                        )}
                        {asset.type === "Solar Panel" && (
                          <FaSolarPanel className="am26-workflow-icon am26-icon-solar" />
                        )}
                      </div>

                      <div>
                        <div className="am26-workflow-title">
                          {asset.type}
                        </div>
                        <div className="am26-workflow-meta">
                          <span>Submitted by {asset.submittedBy}</span>
                          <span className="am26-workflow-dot">•</span>
                          <span>{asset.submittedOn}</span>
                          <span className="am26-workflow-status am26-pill-rejected">
                            Rejected
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {renderPagination(
                  rejectedPage,
                  setRejectedPage,
                  rejectedAssets.length
                )}
              </>
            ) : (
              <div className="am26-empty-text">
                No rejected assets found.
              </div>
            ))}
        </div>
      </section>

      {/* Asset Management list */}
      <section className="am26-asset-section am26-card-hover">
        <div className="am26-asset-header-row">
          <h2 className="am26-section-title">Asset Management</h2>
          <p className="am26-section-subtitle">
            View and manage approved assets by submitter type
          </p>
        </div>

        {/* submitter segmented control */}
        <div className="am26-submitters-tabs">
          <button
            className={
              activeSubmitterTab === "individual"
                ? "am26-submitters-tab am26-submitters-tab-active"
                : "am26-submitters-tab"
            }
            onClick={() => {
              setActiveSubmitterTab("individual");
              setApprovedPage(1);
            }}
          >
            Individual Assets
          </button>
          <button
            className={
              activeSubmitterTab === "organisation"
                ? "am26-submitters-tab am26-submitters-tab-active"
                : "am26-submitters-tab"
            }
            onClick={() => {
              setActiveSubmitterTab("organisation");
              setApprovedPage(1);
            }}
          >
            Organisation Assets
          </button>
        </div>

        {/* asset-type segmented control */}
        <div className="am26-segmented-tabs am26-asset-type-tabs">
          <button
            className={`am26-segmented-tab am26-asset-type-tab am26-asset-ev ${
              activeAssetFilter === "ev" ? "am26-segmented-tab-active" : ""
            }`}
            onClick={() => {
              setActiveAssetFilter("ev");
              setApprovedPage(1);
            }}
          >
            <FaCarSide className="am26-asset-type-icon am26-icon-ev" />
            EV
          </button>
          <button
            className={`am26-segmented-tab am26-asset-type-tab am26-asset-solar ${
              activeAssetFilter === "solar" ? "am26-segmented-tab-active" : ""
            }`}
            onClick={() => {
              setActiveAssetFilter("solar");
              setApprovedPage(1);
            }}
          >
            <FaSolarPanel className="am26-asset-type-icon am26-icon-solar" />
            Solar Panel
          </button>
          <button
            className={`am26-segmented-tab am26-asset-type-tab am26-asset-tree ${
              activeAssetFilter === "tree" ? "am26-segmented-tab-active" : ""
            }`}
            onClick={() => {
              setActiveAssetFilter("tree");
              setApprovedPage(1);
            }}
          >
            <FaTree className="am26-asset-type-icon am26-icon-tree" />
            Tree
          </button>
        </div>

        <div className="am26-approved-list">
          {hasApprovedForSelection ? (
            <>
              {approvedPaged.map((asset) => (
                <div
                 key={asset._uiKey}// ✅

                  className="am26-approved-item am26-card-hover"
                >
                  <div className="am26-approved-left">
                    <div className="am26-approved-icon-wrap">
                      {asset.assetType === "ev" && (
                        <FaCarSide className="am26-approved-icon am26-icon-ev" />
                      )}
                      {asset.assetType === "solar" && (
                        <FaSolarPanel className="am26-approved-icon am26-icon-solar" />
                      )}
                      {asset.assetType === "tree" && (
                        <FaTree className="am26-approved-icon am26-icon-tree" />
                      )}
                    </div>
                    <div>
                      <div className="am26-approved-title">{asset.type}</div>
                      <div className="am26-approved-meta">
                        <span>Submitted by {asset.submittedBy}</span>
                        <span className="am26-workflow-dot">•</span>
                        <span>{asset.submittedOn}</span>
                      </div>
                    </div>
                  </div>
                  <span className="am26-pill-approved">Approved</span>
                </div>
              ))}
              {renderPagination(
                approvedPage,
                setApprovedPage,
                approvedFiltered.length
              )}
            </>
          ) : (
            <div className="am26-empty-text">
              No asset is registered for this selection.
            </div>
          )}
        </div>
      </section>

      {/* Review Modal */}
      {reviewModalOpen && selectedAsset && (
        <div className="am26-modal-overlay" onClick={closeReviewModal}>
          <div
            className="am26-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="am26-modal-header">
              <div className="am26-modal-title-wrap">
                {selectedAsset.assetType === "ev" && (
                  <FaCarSide className="am26-modal-icon am26-icon-ev" />
                )}
                {selectedAsset.assetType === "tree" && (
                  <FaTree className="am26-modal-icon am26-icon-tree" />
                )}
                {selectedAsset.assetType === "solar" && (
                  <FaSolarPanel className="am26-modal-icon am26-icon-solar" />
                )}
                <div>
                  <div className="am26-modal-title">
                    {selectedAsset.type} Details
                  </div>
                  <div className="am26-modal-submitted">
                    Submitted by {selectedAsset.submittedBy}
                  </div>
                </div>
              </div>
              <button className="am26-modal-close" onClick={closeReviewModal}>
                ✕
              </button>
            </div>

            <div className="am26-modal-meta-row">
              <div className="am26-modal-meta-item">
                <div className="am26-modal-meta-label">Asset Type</div>
                <div className="am26-modal-meta-value">
                  {selectedAsset.type}
                </div>
              </div>
              <div className="am26-modal-meta-item">
                <div className="am26-modal-meta-label">Status</div>
                <span className="am26-pill-pending">Pending Review</span>
              </div>
              <div className="am26-modal-meta-item">
                <div className="am26-modal-meta-label">Submitted By</div>
                <div className="am26-modal-meta-value">
                  {selectedAsset.submittedBy}
                </div>
              </div>
              <div className="am26-modal-meta-item">
                <div className="am26-modal-meta-label">Submitted On</div>
                <div className="am26-modal-meta-value">
                  {selectedAsset.submittedOn}
                </div>
              </div>
            </div>

            {renderAssetSpecificDetails(selectedAsset)}

            <div className="am26-modal-footer">
              <button
                className="am26-button am26-btn-danger"
                onClick={() => requestConfirm("reject", selectedAsset)}
              >
                Reject
              </button>

              <button
                className="am26-button am26-btn-primary"
                onClick={() => requestConfirm("accept", selectedAsset)}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalOpen && confirmAsset && (
        <div className="am26-modal-overlay" onClick={closeConfirmModal}>
          <div
            className="am26-modal am26-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="am26-modal-header">
              <div className="am26-modal-title">
                {confirmAction === "accept"
                  ? "Confirm Approval"
                  : "Confirm Rejection"}
              </div>
              <button className="am26-modal-close" onClick={closeConfirmModal}>
                ✕
              </button>
            </div>
            <div className="am26-confirm-body">
              Are you sure you want to{" "}
              <span
                className={
                  confirmAction === "accept"
                    ? "am26-confirm-text-accept"
                    : "am26-confirm-text-reject"
                }
              >
                {confirmAction === "accept" ? "approve" : "reject"}
              </span>{" "}
              this asset?
            </div>
            <div className="am26-modal-footer">
              <button
                className="am26-button am26-btn-outline"
                onClick={closeConfirmModal}
              >
                Cancel
              </button>
              <button
                className={
                  confirmAction === "accept"
                    ? "am26-button am26-btn-primary"
                    : "am26-button am26-btn-danger"
                }
                onClick={handleConfirmYes}
              >
                Yes, {confirmAction === "accept" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;