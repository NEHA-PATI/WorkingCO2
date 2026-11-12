import React from "react";
import { FiAlertTriangle, FiBarChart2, FiDollarSign, FiUpload, FiUserCheck } from "react-icons/fi";

const OWNERSHIP_QUESTIONS = [
  "Are any of these credits already sold?",
  "Are any credits reserved under other agreements?",
];

export default function Step3Credit() {
  return (
    <div className="mkt-step-wrap">
      <header className="mkt-step-header">
        <h2 className="mkt-step-title">Credit Details</h2>
        <p className="mkt-step-subtitle">
          Define inventory boundaries, listing volume, and pricing parameters.
        </p>
      </header>

      <section className="mkt-form-card">
        <p className="mkt-form-section-title">Credit Ownership</p>
        <div className="mkt-form-grid-two">
          <label className="mkt-form-field">
            <span className="mkt-form-label">Serial Number Range Start</span>
            <input className="mkt-form-input" placeholder="VCS-1024-5582" type="text" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Serial Number Range End</span>
            <input className="mkt-form-input" placeholder="VCS-1024-8581" type="text" />
          </label>
          <label className="mkt-form-field mkt-form-field-span-two">
            <span className="mkt-form-label">Upload Serial Number File</span>
            <span className="mkt-upload-zone">
              <FiUpload className="mkt-upload-zone-icon" />
              <span className="mkt-upload-zone-title">Drag and drop your file or browse</span>
              <span className="mkt-upload-zone-meta">Supports CSV or PDF</span>
            </span>
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Total Credits Owned</span>
            <input className="mkt-form-input" defaultValue="3000" type="number" />
          </label>
        </div>
      </section>

      <section className="mkt-form-grid-main-aside">
        <article className="mkt-form-card">
          <p className="mkt-form-section-title">Listing Configuration</p>
          <div className="mkt-form-grid-two">
            <label className="mkt-form-field">
              <span className="mkt-form-label">Credits to List</span>
              <input className="mkt-form-input" defaultValue="3500" type="number" />
              <span className="mkt-inline-warning">
                <FiAlertTriangle />
                Listing volume exceeds verified total (3,000). Reconcile balances.
              </span>
            </label>
            <label className="mkt-form-field">
              <span className="mkt-form-label">Min. Order Quantity</span>
              <input className="mkt-form-input" defaultValue="500" type="number" />
            </label>
            <label className="mkt-form-field">
              <span className="mkt-form-label">Price per tCO2</span>
              <span className="mkt-money-input-wrap">
                <FiDollarSign />
                <input className="mkt-form-input mkt-form-input-plain" defaultValue="24.50" type="number" />
              </span>
            </label>
            <div className="mkt-form-field">
              <span className="mkt-form-label">Currency</span>
              <div className="mkt-radio-row mkt-radio-row-fill">
                <label className="mkt-radio-item mkt-radio-item-boxed mkt-radio-item-compact">
                  <input defaultChecked name="mkt-currency" type="radio" />
                  <span>USD</span>
                </label>
                <label className="mkt-radio-item mkt-radio-item-boxed mkt-radio-item-compact">
                  <input name="mkt-currency" type="radio" />
                  <span>INR</span>
                </label>
              </div>
            </div>
          </div>
        </article>

        <aside className="mkt-market-card">
          <div className="mkt-market-head">
            <FiBarChart2 />
            <span>Indicative Market Pricing</span>
          </div>
          <p className="mkt-market-price">$22.40</p>
          <p className="mkt-market-tag">+8% YoY (Global Average REDD+)</p>
          <p className="mkt-market-note">
            Based on recent transactions for similar methodologies in your region.
          </p>
        </aside>
      </section>

      <section className="mkt-form-card mkt-form-card-light">
        <p className="mkt-form-section-title">Ownership Declarations</p>
        <div className="mkt-disclosure-stack">
          {OWNERSHIP_QUESTIONS.map((question) => (
            <label className="mkt-disclosure-item" key={question}>
              <span>{question}</span>
              <input className="mkt-switch-input" type="checkbox" />
              <span className="mkt-switch-track">
                <span className="mkt-switch-knob" />
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="mkt-estimation-card">
        <div className="mkt-estimation-head">
          <FiUserCheck />
          <span>Market Value Estimation</span>
        </div>
        <p className="mkt-estimation-copy">
          You are listing 3,500 credits at $24.50 per credit.
        </p>
        <p className="mkt-estimation-value">$85,750.00</p>
      </section>
    </div>
  );
}
