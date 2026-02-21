import React, { useEffect, useState } from "react";
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
  FaUndo,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { BsGrid } from "react-icons/bs";
import OrgCard from "@features/admin/pages/OrgCard";
import orgAssetApi from "@features/admin/services/orgAssetApi";
import "@features/admin/styles/OrgAssets.css";

const ALL_ASSETS = [
];

const STATIC_NON_LIVE_ASSETS = ALL_ASSETS.filter(
  (asset) =>
    asset.category !== "plantation" &&
    asset.category !== "fleet" &&
    asset.category !== "carbon"
);

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

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCoordinate(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "-";
  return num.toFixed(7);
}

function mapVerificationToUiStatus(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "accepted" || normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  return "pending";
}

function mapGenericStatus(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "accepted" || normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  return "pending";
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

function ManagerContactCell({ managerName, managerContact }) {
  return (
    <div>
      <div style={{ fontWeight: 600, color: "#1f2937" }}>{managerName || "-"}</div>
      <div style={{ fontSize: "12px", color: "#64748b" }}>{managerContact || "-"}</div>
    </div>
  );
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

function AssetRow({
  asset,
  onReview,
  onToggleRevert,
  isRevertOpen,
  onOpenRevertAction,
}) {
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
        <ManagerContactCell
          managerName={asset.managerName}
          managerContact={asset.managerContact}
        />
      </div>
      <div className="submitted-cell">{asset.submitted}</div>
      <div>
        <StatusBadge status={asset.status} />
      </div>
      <div className="actions-cell">
        {asset.status !== "pending" && isRevertOpen && (
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
        {asset.status !== "pending" && (
          <button className="action-btn revert" onClick={() => onToggleRevert(asset.id)}>
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
  const [assets, setAssets] = useState(STATIC_NON_LIVE_ASSETS);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedReviewAsset, setSelectedReviewAsset] = useState(null);
  const [openRevertRows, setOpenRevertRows] = useState({});
  const [revertDialog, setRevertDialog] = useState({ open: false, asset: null, action: null });
  const [revertReason, setRevertReason] = useState("");
  const [revertError, setRevertError] = useState("");

  useEffect(() => {
    const loadAssets = async () => {
      setIsLoading(true);
      setApiError("");
      try {
        const [plantationResult, fleetResult, carbonResult] = await Promise.all([
          orgAssetApi.getAll(),
          orgAssetApi.getAllFleet(),
          orgAssetApi.getAllCarbon(),
        ]);

        const plantationRows = Array.isArray(plantationResult?.data)
          ? plantationResult.data
          : [];
        const fleetRows = Array.isArray(fleetResult?.data) ? fleetResult.data : [];
        const carbonRows = Array.isArray(carbonResult?.data) ? carbonResult.data : [];

        const plantationAssets = plantationRows.map((row) => ({
          id: String(row.p_id || row.plantation_id || row.id || ""),
          name:
            row.plantation_name ||
            row.name ||
            `Plantation ${row.p_id || row.plantation_id || row.id || "-"}`,
          org: row.org_name || row.org_id || "Unknown Org",
          category: "plantation",
          submitted: formatDate(row.created_at || row.plantation_date),
          status: mapVerificationToUiStatus(row.verification_status),
          plantationId: row.p_id || row.plantation_id || row.id || "-",
          plantationDate: formatDate(row.plantation_date),
          totalArea: row.total_area,
          areaUnit: row.area_unit,
          area: `${row.total_area ?? "-"} ${row.area_unit || ""}`.trim(),
          species: row.species_name || "-",
          treesPlanted: row.trees_planted ?? row.total_trees ?? "-",
          plantAgeYears: row.plant_age_years ?? row.plant_age ?? "-",
          verificationStatus: row.verification_status || "pending",
          createdAt: formatDate(row.created_at),
          managerName: String(row.manager_name || "").trim() || "-",
          managerContact: String(row.manager_contact || "").trim() || "-",
          location:
            Array.isArray(row.points) && row.points.length > 0
              ? `${formatCoordinate(row.points[0].lat)}, ${formatCoordinate(
                  row.points[0].lng
                )}`
              : "-",
          boundaryPoints: Array.isArray(row.points)
            ? row.points.map(
                (point) =>
                  `${formatCoordinate(point.lat)}, ${formatCoordinate(point.lng)}`
              )
            : [],
          plantingDate: formatDate(row.plantation_date),
          raw: row,
        }));

        const fleetAssets = fleetRows.map((row) => ({
          id: String(row.ev_input_id || row.id || row.ev_uid || ""),
          name:
            [row.manufacturer, row.model].filter(Boolean).join(" ") ||
            row.ev_uid ||
            `Fleet ${row.ev_input_id || row.id || "-"}`,
          org: row.org_name || row.org_id || "Unknown Org",
          category: "fleet",
          submitted: formatDate(row.created_at),
          status: mapGenericStatus(row.status),
          managerName: String(row.manufacturer || "").trim() || "-",
          managerContact: String(row.model || "").trim() || "-",
          fleetId: row.ev_input_id ?? "-",
          evUid: row.ev_uid || "-",
          vehicleCategory: row.vehicle_category || "-",
          subCategory: row.sub_category || "-",
          powertrainType: row.powertrain_type || "-",
          manufacturer: row.manufacturer || "-",
          model: row.model || "-",
          purchaseYear: row.purchase_year ?? "-",
          fuelType: row.fuel_type || "-",
          isFleet: row.is_fleet === true ? "Yes" : "No",
          numberOfVehicles: row.number_of_vehicles ?? "-",
          averageDistancePerDayKm: row.average_distance_per_day_km ?? "-",
          workingDaysPerYear: row.working_days_per_year ?? "-",
          averageDistancePerVehiclePerYearKm:
            row.average_distance_per_vehicle_per_year_km ?? "-",
          fuelEfficiencyKmPerLiter: row.fuel_efficiency_km_per_liter ?? "-",
          totalFuelConsumedPerYearLiters:
            row.total_fuel_consumed_per_year_liters ?? "-",
          batteryCapacityKwh: row.battery_capacity_kwh ?? "-",
          energyConsumedPerMonthKwh: row.energy_consumed_per_month_kwh ?? "-",
          chargingType: row.charging_type || "-",
          gridEmissionFactorKgco2PerKwh:
            row.grid_emission_factor_kgco2_per_kwh ?? "-",
          vehicleWeightKg: row.vehicle_weight_kg ?? "-",
          engineCapacityCc: row.engine_capacity_cc ?? "-",
          motorPowerKw: row.motor_power_kw ?? "-",
          chargingTimeHours: row.charging_time_hours ?? "-",
          raw: row,
        }));

        const carbonAssets = carbonRows.map((row) => ({
          id: String(row.capture_id || row.id || row.c_uid || ""),
          name:
            row.industry_type
              ? `${row.industry_type} Carbon Capture`
              : `Carbon Capture ${row.capture_id || row.id || "-"}`,
          org: row.org_name || row.org_id || "Unknown Org",
          category: "carbon",
          submitted: formatDate(row.created_at),
          status: mapGenericStatus(row.status),
          managerName: row.industry_type || "-",
          managerContact: row.capture_technology || "-",
          captureId: row.capture_id ?? "-",
          cUid: row.c_uid || "-",
          industryType: row.industry_type || "-",
          totalEmissionTonnesPerYear: row.total_emission_tonnes_per_year ?? "-",
          captureTechnology: row.capture_technology || "-",
          captureEfficiencyPercent: row.capture_efficiency_percent ?? "-",
          raw: row,
        }));

        setAssets([
          ...plantationAssets,
          ...fleetAssets,
          ...carbonAssets,
          ...STATIC_NON_LIVE_ASSETS,
        ]);
      } catch (error) {
        setApiError(error?.message || "Failed to load assets");
        setAssets(STATIC_NON_LIVE_ASSETS);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  async function updateAssetStatus(asset, nextStatus, reason = "") {
    if (!asset?.id) return;

    if (asset.category === "plantation") {
      await orgAssetApi.updateStatus(asset.id, nextStatus);
    }
    if (asset.category === "carbon") {
      const carbonId = asset.captureId ?? asset.id;
      await orgAssetApi.updateCarbonStatus(carbonId, nextStatus);
    }

    setAssets((prev) =>
      prev.map((a) =>
        a.id === asset.id
          ? {
              ...a,
              status: nextStatus,
              rejectionReason: nextStatus === "rejected" ? reason : a.rejectionReason,
            }
          : a
      )
    );
  }

  const totalAssets = assets.length;
  const orgCount = new Set(assets.map((a) => a.org).filter(Boolean)).size;
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

  function handleReview(asset) {
    setSelectedReviewAsset(asset);
    setIsReviewOpen(true);
  }

  function handleCloseReview() {
    setIsReviewOpen(false);
    setSelectedReviewAsset(null);
  }

  function handleReviewDecision(nextStatus, reason = "") {
    if (!selectedReviewAsset?.id) return;
    updateAssetStatus(selectedReviewAsset, nextStatus, reason);
  }

  function handleToggleRevert(id) {
    const targetAsset = assets.find((a) => a.id === id);
    if (!targetAsset) return;

    setRevertDialog({ open: true, asset: targetAsset, action: "pending" });
    setRevertReason("");
    setRevertError("");
    setOpenRevertRows((prev) => ({ ...prev, [id]: false }));
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
    if (!revertDialog.asset || !revertDialog.action) return;
    if (revertDialog.action === "rejected" && !revertReason.trim()) {
      setRevertError("Reason is required for rejection.");
      return;
    }

    try {
      await updateAssetStatus(revertDialog.asset, revertDialog.action, revertReason.trim());
      const targetId = revertDialog.asset.id;
      setOpenRevertRows((prev) => ({ ...prev, [targetId]: false }));
      handleCloseRevertDialog();
    } catch (error) {
      setRevertError(error?.message || "Failed to update asset status.");
    }
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
          value={orgCount}
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
            <div className="filters-controls">
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
          </div>

          <div className="assets-table-wrap">
            <div className="assets-table-header">
              <span>Asset</span>
              <span>Organization</span>
              <span>Manager / Contact</span>
              <span>Submitted</span>
              <span>Status</span>
              <span style={{ textAlign: "right" }}>Actions</span>
            </div>
            {apiError &&
              (activeCategory === "plantation" ||
                activeCategory === "fleet" ||
                activeCategory === "carbon") && (
              <div className="empty-state" style={{ padding: "20px" }}>
                <p style={{ color: "#ff8a8a", fontSize: "14px" }}>{apiError}</p>
              </div>
            )}
            {isLoading &&
            (activeCategory === "plantation" ||
              activeCategory === "fleet" ||
              activeCategory === "carbon") ? (
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
                  key={asset.id}
                  asset={asset}
                  onReview={handleReview}
                  onToggleRevert={handleToggleRevert}
                  isRevertOpen={!!openRevertRows[asset.id]}
                  onOpenRevertAction={handleOpenRevertAction}
                />
              ))
            )}
          </div>
        </>
      )}
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
      {isReviewOpen && (
        <OrgCard
          asset={selectedReviewAsset}
          onClose={handleCloseReview}
          onDecision={handleReviewDecision}
        />
      )}
    </div>
  );
}
