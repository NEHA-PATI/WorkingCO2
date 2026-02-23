import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@features/admin/styles/OrgCard.css";

const toTitleCase = (value = "") => value.charAt(0).toUpperCase() + value.slice(1);

const DEFAULT_ASSET = {
  id: "",
  name: "Borneo Palm Restoration",
  org: "EcoVenture Capital",
  category: "plantation",
  submitted: "February 10, 2026",
  status: "pending",
  plantationId: "-",
  area: "800 hectares",
  species: "Rattan, Dipterocarp",
  location: "1.5 deg, 110 deg",
  plantingDate: "Sep 15, 2025",
  treesPlanted: "-",
  plantAgeYears: "-",
  managerName: "-",
  managerContact: "-",
  boundaryPoints: [],
  treeImages: [],
};

const VALID_STATUSES = new Set(["pending", "approved", "rejected"]);

export default function OrgCard({ asset, onClose, onDecision }) {
  const navigate = useNavigate();
  const autoCloseTimerRef = useRef(null);

  const safeAsset = useMemo(() => {
    const merged = { ...DEFAULT_ASSET, ...(asset || {}) };
    const resolvedPlantAge =
      merged.plantAgeYears ??
      merged.plant_age_years ??
      merged.raw?.plant_age_years ??
      merged.raw?.plant_age ??
      "-";
    const resolvedPlantationId =
      merged.plantationId ??
      merged.p_id ??
      merged.raw?.p_id ??
      merged.raw?.plantation_id ??
      merged.id ??
      "-";

    return {
      ...merged,
      status: VALID_STATUSES.has(merged.status) ? merged.status : "pending",
      plantAgeYears: resolvedPlantAge,
      plantationId: resolvedPlantationId,
    };
  }, [asset]);

  const [status, setStatus] = useState(safeAsset.status);
  const [resultStatus, setResultStatus] = useState(null);

  useEffect(() => {
    setStatus(safeAsset.status);
    setResultStatus(null);
  }, [safeAsset]);

  const statusLabel = toTitleCase(status);
  const statusClass =
    status === "approved"
      ? "orgcard-badge-approved"
      : status === "rejected"
      ? "orgcard-badge-rejected"
      : "orgcard-badge-pending";

  const closePopup = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate("/admin/asset-management/organization", { replace: true });
  };

  const clearTimer = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  };

  const handleClose = () => {
    clearTimer();
    closePopup();
  };

  const handleDecision = (action) => {
    if (status !== "pending" || resultStatus) return;
    const nextStatus = action;
    setStatus(nextStatus);
    setResultStatus(nextStatus);

    if (onDecision) {
      onDecision(nextStatus, "");
    }

    clearTimer();
    autoCloseTimerRef.current = setTimeout(() => {
      closePopup();
    }, 1200);
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  const isFleetAsset = safeAsset.category === "fleet";
  const isCarbonAsset = safeAsset.category === "carbon";
  const isTreeAsset = safeAsset.category === "tree";

  return (
    <div className="orgcard-overlay" onClick={handleClose}>
      <div className="orgcard-card" onClick={(event) => event.stopPropagation()}>
        <button className="orgcard-close-btn" aria-label="Close" onClick={handleClose}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="orgcard-header">
          <div className="orgcard-bell-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="orgcard-header-info">
            <h2 className="orgcard-title">{safeAsset.name}</h2>
            <div className="orgcard-badges">
              <span className={`orgcard-badge ${statusClass}`}>
                <span className="orgcard-dot" />
                {statusLabel}
              </span>
              <span className="orgcard-badge orgcard-badge-outline">
                {toTitleCase(safeAsset.category)}
              </span>
            </div>
          </div>
        </div>

        {isTreeAsset && (
          <>
            <div className="orgcard-divider" />
            <div className="orgcard-asset-section">
              <p className="orgcard-section-label">TREE IMAGES</p>
              {safeAsset.treeImages && safeAsset.treeImages.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "10px",
                  }}
                >
                  {safeAsset.treeImages.map((src, idx) => (
                    <img
                      key={`${src}-${idx}`}
                      src={src}
                      alt={`Tree ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "110px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p style={{ color: "#6b7280", fontSize: "14px" }}>No images uploaded.</p>
              )}
            </div>
          </>
        )}

        <div className="orgcard-divider" />

        <div className="orgcard-meta-section">
          <div className="orgcard-meta-item">
            <div className="orgcard-meta-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#aaa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div>
              <p className="orgcard-meta-label">Organization</p>
              <p className="orgcard-meta-value">{safeAsset.org}</p>
            </div>
          </div>
          <div className="orgcard-meta-item">
            <div className="orgcard-meta-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#aaa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <p className="orgcard-meta-label">Submitted</p>
              <p className="orgcard-meta-value">{safeAsset.submitted}</p>
            </div>
          </div>
        </div>

        <div className="orgcard-divider" />

        <div className="orgcard-asset-section">
          <p className="orgcard-section-label">ASSET DETAILS</p>
          {isFleetAsset ? (
            <div className="orgcard-asset-grid">
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">EV ID</p>
                  <p className="orgcard-asset-value">{safeAsset.evId ?? safeAsset.id}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">VUID</p>
                  <p className="orgcard-asset-value">{safeAsset.vuid || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">User ID</p>
                  <p className="orgcard-asset-value">{safeAsset.uId || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Category</p>
                  <p className="orgcard-asset-value">{safeAsset.evCategory || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Manufacturers</p>
                  <p className="orgcard-asset-value">{safeAsset.manufacturers || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Model</p>
                  <p className="orgcard-asset-value">{safeAsset.evModel || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Purchase Year</p>
                  <p className="orgcard-asset-value">{safeAsset.purchaseYear ?? "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Energy Consumed</p>
                  <p className="orgcard-asset-value">{safeAsset.energyConsumed ?? "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Primary Charging Type</p>
                  <p className="orgcard-asset-value">{safeAsset.primaryChargingType || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Range</p>
                  <p className="orgcard-asset-value">{safeAsset.evRange ?? "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Grid Emission Factor</p>
                  <p className="orgcard-asset-value">{safeAsset.gridEmissionFactor ?? "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Top Speed</p>
                  <p className="orgcard-asset-value">{safeAsset.topSpeed ?? "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Charging Time</p>
                  <p className="orgcard-asset-value">{safeAsset.chargingTime ?? "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Motor Power</p>
                  <p className="orgcard-asset-value">{safeAsset.motorPower || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Status</p>
                  <p className="orgcard-asset-value">{safeAsset.status || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Created / Updated</p>
                  <p className="orgcard-asset-value">
                    {safeAsset.createdAt
                      ? `${new Date(safeAsset.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })} / ${
                          safeAsset.updatedAt
                            ? new Date(safeAsset.updatedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "-"
                        }`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          ) : isCarbonAsset ? (
            <div className="orgcard-asset-grid">
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Capture ID</p>
                  <p className="orgcard-asset-value">{safeAsset.captureId ?? safeAsset.id}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Capture UID</p>
                  <p className="orgcard-asset-value">{safeAsset.cUid || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Industry Type</p>
                  <p className="orgcard-asset-value">{safeAsset.industryType || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Capture Technology</p>
                  <p className="orgcard-asset-value">{safeAsset.captureTechnology || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Total Emission (t/yr)</p>
                  <p className="orgcard-asset-value">
                    {safeAsset.totalEmissionTonnesPerYear ?? "-"}
                  </p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Capture Efficiency (%)</p>
                  <p className="orgcard-asset-value">
                    {safeAsset.captureEfficiencyPercent ?? "-"}
                  </p>
                </div>
              </div>
            </div>
          ) : isTreeAsset ? (
            <div className="orgcard-asset-grid">
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Tree ID</p>
                  <p className="orgcard-asset-value">{safeAsset.treeId ?? "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Tree UID</p>
                  <p className="orgcard-asset-value">{safeAsset.treeUid || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Tree Name</p>
                  <p className="orgcard-asset-value">{safeAsset.treeName || safeAsset.name || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Botanical Name</p>
                  <p className="orgcard-asset-value">{safeAsset.botanicalName || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Planting Date</p>
                  <p className="orgcard-asset-value">
                    {safeAsset.plantingDate && safeAsset.plantingDate !== "-"
                      ? new Date(safeAsset.plantingDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Height</p>
                  <p className="orgcard-asset-value">{safeAsset.height ?? "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">DBH</p>
                  <p className="orgcard-asset-value">{safeAsset.dbh ?? "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Location</p>
                  <p className="orgcard-asset-value">{safeAsset.location || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Created By</p>
                  <p className="orgcard-asset-value">{safeAsset.createdBy || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Status</p>
                  <p className="orgcard-asset-value">{safeAsset.treeStatus || safeAsset.status || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div>
                  <p className="orgcard-asset-label">Created / Updated</p>
                  <p className="orgcard-asset-value">
                    {safeAsset.createdAt
                      ? `${new Date(safeAsset.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })} / ${
                          safeAsset.updatedAt
                            ? new Date(safeAsset.updatedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "-"
                        }`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="orgcard-asset-grid">
              <div className="orgcard-asset-item">
                <div className="orgcard-asset-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="orgcard-asset-label">Area</p>
                  <p className="orgcard-asset-value">{safeAsset.area || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div className="orgcard-asset-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <p className="orgcard-asset-label">Species</p>
                  <p className="orgcard-asset-value">{safeAsset.species || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div className="orgcard-asset-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="orgcard-asset-label">Location</p>
                  <p className="orgcard-asset-value">{safeAsset.location || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div className="orgcard-asset-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="orgcard-asset-label">Planting Date</p>
                  <p className="orgcard-asset-value">{safeAsset.plantingDate || "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div className="orgcard-asset-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
                <div>
                  <p className="orgcard-asset-label">Trees Planted</p>
                  <p className="orgcard-asset-value">{safeAsset.treesPlanted ?? "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div className="orgcard-asset-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
                <div>
                  <p className="orgcard-asset-label">Plant Age (Years)</p>
                  <p className="orgcard-asset-value">{safeAsset.plantAgeYears ?? "-"}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div className="orgcard-asset-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="orgcard-asset-label">Manager Contact</p>
                  <p className="orgcard-asset-value">
                    {safeAsset.managerName} ({safeAsset.managerContact})
                  </p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div className="orgcard-asset-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="orgcard-asset-label">Plantation ID</p>
                  <p className="orgcard-asset-value">{safeAsset.plantationId || safeAsset.id}</p>
                </div>
              </div>
              <div className="orgcard-asset-item">
                <div className="orgcard-asset-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="orgcard-asset-label">Boundary Coordinates</p>
                  <p className="orgcard-asset-value">
                    {safeAsset.boundaryPoints?.length
                      ? safeAsset.boundaryPoints.join(" | ")
                      : safeAsset.location || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="orgcard-divider" />

        <div className="orgcard-footer">
          <button
            className={`orgcard-btn orgcard-btn-reject ${
              status === "approved"
                ? "orgcard-btn-disabled"
                : status === "rejected"
                ? "orgcard-btn-active-reject"
                : ""
            }`}
            onClick={() => handleDecision("rejected")}
            disabled={status === "approved"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Reject
          </button>
          <button
            className={`orgcard-btn orgcard-btn-approve ${
              status === "rejected" ? "orgcard-btn-disabled" : ""
            }`}
            onClick={() => handleDecision("approved")}
            disabled={status === "rejected"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            Approve
          </button>
        </div>

        {resultStatus && (
          <div className="orgcard-result-backdrop">
            <div className={`orgcard-result-card ${resultStatus}`}>
              <div className="orgcard-result-icon-wrap">
                {resultStatus === "approved" ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                    <circle cx="12" cy="12" r="9.5" />
                    <polyline points="8 12.5 11 15.5 16.5 9.5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                    <circle cx="12" cy="12" r="9.5" />
                    <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
                    <line x1="15.5" y1="8.5" x2="8.5" y2="15.5" />
                  </svg>
                )}
              </div>
              <p className="orgcard-result-text">
                {resultStatus === "approved" ? "Approved" : "Rejected"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
