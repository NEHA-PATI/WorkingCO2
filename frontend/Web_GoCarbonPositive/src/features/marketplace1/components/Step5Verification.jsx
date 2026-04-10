import React, { useState, useEffect } from "react";
import {
  FiCheck,
  FiAlertTriangle,
  FiClipboard,
  FiCopy,
  FiGlobe,
  FiLink,
  FiMapPin,
  FiSearch,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";

const VERIFICATION_STAGES = [
  {
    title: "Registry Link Validation",
    text: "Cross-referencing project URL with official registry databases.",
    icon: FiLink,
  },
  {
    title: "Project Existence Check",
    text: "Verifying geographical coordinates and physical project boundary.",
    icon: FiGlobe,
  },
  {
    title: "Serial Number Format Validation",
    text: "Parsing credit serial sequences for industry standard compliance.",
    icon: FiClipboard,
  },
  {
    title: "Ownership Proof Matching",
    text: "Reconciling legal entity documents with registry account holders.",
    icon: FiUserCheck,
  },
  {
    title: "Duplicate Listing Detection",
    text: "Scanning marketplaces for identical serial numbers.",
    icon: FiCopy,
  },
  {
    title: "Fraud and Anomaly Detection",
    text: "AI-driven pattern matching for suspicious activity detection.",
    icon: FiShield,
  },
  {
    title: "Price Deviation Analysis",
    text: "Comparing listing price against current market benchmarks.",
    icon: FiMapPin,
  },
  {
    title: "Document Consistency Review",
    text: "Ensuring technical reports align with self-reported metadata.",
    icon: FiSearch,
  },
  {
    title: "Risk Scoring",
    text: "Final scoring based on permanence, additionality, and leakage risk.",
    icon: FiAlertTriangle,
  },
];

const STAGE_TICK_MS = 1500;

function getStatusClass(status, isRecentlyCompleted) {
  if (status === "completed" && isRecentlyCompleted) return "mkt-status-complete mkt-status-complete-new";
  if (status === "completed") return "mkt-status-complete";
  if (status === "in-progress") return "mkt-status-progress";
  return "mkt-status-pending";
}

function getStatusLabel(status) {
  if (status === "completed") return "Completed";
  if (status === "in-progress") return "In Progress";
  return "Pending";
}

export default function Step5Verification() {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (completedCount >= VERIFICATION_STAGES.length) return undefined;

    const timer = setTimeout(() => {
      setCompletedCount((previous) => Math.min(previous + 1, VERIFICATION_STAGES.length));
    }, STAGE_TICK_MS);

    return () => clearTimeout(timer);
  }, [completedCount]);

  return (
    <div className="mkt-step-wrap">
      <header className="mkt-step-header mkt-step-header-center">
        <span className="mkt-verify-badge-icon">
          <FiUserCheck />
        </span>
        <h2 className="mkt-step-title">Verification Status</h2>
        <p className="mkt-step-subtitle">
          We are running a multi-stage audit to ensure market integrity and credit quality.
        </p>
        <div className="mkt-verify-progress-wrap" aria-live="polite">
          <div className="mkt-verify-progress-track">
            {VERIFICATION_STAGES.map((stage, index) => (
              <span
                key={stage.title}
                className={`mkt-verify-progress-segment ${
                  index < completedCount ? "mkt-verify-progress-segment-complete" : ""
                }`}
              />
            ))}
          </div>
          <span className="mkt-verify-progress-label">
            {completedCount}/{VERIFICATION_STAGES.length} checks completed
          </span>
        </div>
      </header>

      <section className="mkt-verify-timeline">
        <span className="mkt-verify-timeline-line" />
        {VERIFICATION_STAGES.map((stage, index) => {
          const isCompleted = index < completedCount;
          const isInProgress = index === completedCount && completedCount < VERIFICATION_STAGES.length;
          const status = isCompleted ? "completed" : isInProgress ? "in-progress" : "pending";
          const statusClass = getStatusClass(status, index === completedCount - 1);
          const Icon = isCompleted ? FiCheck : stage.icon;

          return (
            <article className={`mkt-verify-item ${statusClass}`} key={stage.title}>
              <span className="mkt-verify-item-icon">
                <Icon />
              </span>
              <div className="mkt-verify-item-card">
                <div className="mkt-verify-item-head">
                  <h3 className="mkt-verify-item-title">{stage.title}</h3>
                  <span className="mkt-verify-item-tag">{getStatusLabel(status)}</span>
                </div>
                <p className="mkt-verify-item-text">{stage.text}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mkt-verify-footer-note">
        <p>
          <span>Note:</span> You can leave this page. We will email you when verification completes.
        </p>
      </section>
    </div>
  );
}
