import React from "react";
import {
  FiActivity,
  FiFileText,
  FiImage,
  FiLayers,
  FiShield,
  FiUploadCloud,
} from "react-icons/fi";

const REQUIRED_DOCS = [
  { title: "Issuance Certificate", meta: "From registry showing issued credits", icon: FiFileText },
  {
    title: "Registry Screenshot",
    meta: "Must show account name, balance, timestamp",
    icon: FiImage,
  },
  { title: "Credit Balance Proof", meta: "Official statement or export", icon: FiLayers },
  { title: "Serial Number Proof", meta: "CSV or document listing serial numbers", icon: FiActivity },
  { title: "Ownership Declaration", meta: "Signed statement confirming ownership", icon: FiShield },
];

const OPTIONAL_DOCS = [
  "Verification Report",
  "Monitoring Report",
  "Third-party Audit",
  "Legal Agreements",
  "Retirement History",
];

export default function Step4Documents() {
  return (
    <div className="mkt-step-wrap">
      <header className="mkt-step-header">
        <h2 className="mkt-step-title">Document Upload</h2>
        <p className="mkt-step-subtitle">
          Upload required and optional files to complete your listing package.
        </p>
      </header>

      <section className="mkt-form-card">
        <div className="mkt-section-headline-wrap">
          <p className="mkt-form-section-title">Required Documents</p>
          <span className="mkt-section-headline-rule" />
        </div>

        <div className="mkt-upload-grid">
          {REQUIRED_DOCS.map((item) => {
            const Icon = item.icon;
            return (
              <article className="mkt-upload-card" key={item.title}>
                <div className="mkt-upload-card-head">
                  <div>
                    <p className="mkt-upload-card-title">{item.title}</p>
                    <p className="mkt-upload-card-meta">{item.meta}</p>
                  </div>
                  <span className="mkt-upload-card-icon">
                    <Icon />
                  </span>
                </div>

                <label className="mkt-upload-zone mkt-upload-zone-compact">
                  <FiUploadCloud className="mkt-upload-zone-icon" />
                  <span className="mkt-upload-zone-title">Upload File</span>
                  <span className="mkt-upload-zone-meta">PDF, JPG, PNG, CSV | Max 10MB</span>
                </label>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mkt-form-card">
        <div className="mkt-section-headline-wrap">
          <p className="mkt-form-section-title">Optional Documents</p>
          <span className="mkt-section-headline-rule" />
        </div>

        <div className="mkt-upload-grid">
          {OPTIONAL_DOCS.map((item) => (
            <article className="mkt-upload-card" key={item}>
              <div className="mkt-upload-card-head">
                <p className="mkt-upload-card-title">{item}</p>
                <span className="mkt-upload-card-icon">
                  <FiFileText />
                </span>
              </div>
              <label className="mkt-upload-zone mkt-upload-zone-compact">
                <FiUploadCloud className="mkt-upload-zone-icon" />
                <span className="mkt-upload-zone-title">Upload File</span>
                <span className="mkt-upload-zone-meta">Max 10MB</span>
              </label>
            </article>
          ))}
        </div>
      </section>

      <section className="mkt-form-card mkt-support-card">
        <div className="mkt-support-copy">
          <h3 className="mkt-support-title">Having trouble with documents?</h3>
          <p className="mkt-support-text">
            Verification specialists can help you meet registry and institutional diligence standards.
          </p>
          <button type="button" className="mkt-btn mkt-btn-primary">
            Contact Support
          </button>
        </div>
        <img
          className="mkt-support-image"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjuNdgtreUYC5g0GNb8hLOt2HpfnWjRzhBz2-vMXCazYrvRNjP8NSg0pSM89ZbFyyPSbwFCJ6wEe_FP5n-xM3SYMn1JtJ-lSWV26i2usiO75V5r0pnH9NkYKtSBzZEnE3A7sFtXxoVGAD_y67_ukF0SYVvw3DOhpQjOv1DhuGHZ5FyCQWK6-d3ung9ei3RZuPlUHLmoz_9Lu934yBhLh2uCTOSILjTvtQrPIBG4cJUhLEHSyPcUL2Ei4wII6Mv4EBfbn0FBclBx_uA"
          alt="Documentation support"
        />
      </section>
    </div>
  );
}
