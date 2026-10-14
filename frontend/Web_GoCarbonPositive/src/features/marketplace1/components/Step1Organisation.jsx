import React from "react";
import { FiUploadCloud, FiUser } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

export default function Step1Organisation({ sellerType, onSellerTypeChange }) {
  return (
    <div className="mkt-step-wrap">
      <header className="mkt-step-header">
        <h2 className="mkt-step-title">Seller Details</h2>
        <p className="mkt-step-subtitle">
          Establish your institutional profile for compliance and listing approval.
        </p>
      </header>

      <section className="mkt-form-card">
        <p className="mkt-form-section-title">Seller Type</p>
        <div className="mkt-choice-grid">
          <button
            type="button"
            className={`mkt-choice-item ${sellerType === "organization" ? "mkt-choice-item-active" : ""}`}
            onClick={() => onSellerTypeChange("organization")}
          >
            <span className="mkt-choice-icon">
              <HiOutlineBuildingOffice2 />
            </span>
            <span className="mkt-choice-label">Company or Organization</span>
            <span className="mkt-choice-meta">Institutional listing profile</span>
          </button>

          <button
            type="button"
            className={`mkt-choice-item ${sellerType === "individual" ? "mkt-choice-item-active" : ""}`}
            onClick={() => onSellerTypeChange("individual")}
          >
            <span className="mkt-choice-icon">
              <FiUser />
            </span>
            <span className="mkt-choice-label">Individual Professional</span>
            <span className="mkt-choice-meta">Sole proprietorship profile</span>
          </button>
        </div>
      </section>

      <section className="mkt-form-card">
        <p className="mkt-form-section-title">Account Purpose</p>
        <div className="mkt-radio-row">
          <label className="mkt-radio-item mkt-radio-item-boxed">
            <input name="mkt-purpose-organization" type="radio" defaultChecked />
            <span>Selling Credits Only</span>
          </label>
          <label className="mkt-radio-item mkt-radio-item-boxed">
            <input name="mkt-purpose-organization" type="radio" />
            <span>Buy and Sell Credits</span>
          </label>
        </div>
      </section>

      <section className="mkt-form-card">
        <p className="mkt-form-section-title">Legal Entity Details</p>
        <div className="mkt-form-grid-two">
          <label className="mkt-form-field mkt-form-field-span-two">
            <span className="mkt-form-label">Legal Entity Name</span>
            <input className="mkt-form-input" placeholder="EcoSphere Solutions Ltd" type="text" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Registration Number</span>
            <input className="mkt-form-input" placeholder="L12345MH2023PLC123456" type="text" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Tax Number</span>
            <input className="mkt-form-input" placeholder="22AAAAA0000A1Z5" type="text" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Country of Incorporation</span>
            <select className="mkt-form-select" defaultValue="">
              <option value="" disabled>
                Select Country
              </option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>India</option>
              <option>Singapore</option>
            </select>
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Company Website</span>
            <input className="mkt-form-input" placeholder="https://www.example.com" type="url" />
          </label>
          <label className="mkt-form-field mkt-form-field-span-two">
            <span className="mkt-form-label">Registered Address</span>
            <textarea
              className="mkt-form-textarea"
              placeholder="Street address, city, state, postal code"
              rows={3}
            />
          </label>
        </div>
      </section>

      <section className="mkt-form-card">
        <p className="mkt-form-section-title">Authorized Representative</p>
        <div className="mkt-form-grid-two">
          <label className="mkt-form-field">
            <span className="mkt-form-label">Full Name</span>
            <input className="mkt-form-input" placeholder="Sarah Jenkins" type="text" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Designation</span>
            <input className="mkt-form-input" placeholder="Director of Operations" type="text" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Email Address</span>
            <input className="mkt-form-input" placeholder="sarah@ecosphere.com" type="email" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Phone Number</span>
            <input className="mkt-form-input" placeholder="+44 20 7946 0958" type="tel" />
          </label>
          <label className="mkt-form-field mkt-form-field-span-two">
            <span className="mkt-form-label">Upload ID Proof</span>
            <span className="mkt-upload-zone">
              <FiUploadCloud className="mkt-upload-zone-icon" />
              <span className="mkt-upload-zone-title">Drag and drop file here</span>
              <span className="mkt-upload-zone-meta">PDF, JPG or PNG (Max 5MB)</span>
            </span>
          </label>
        </div>
      </section>

      <section className="mkt-form-card">
        <p className="mkt-form-section-title">Compliance Declarations</p>
        <div className="mkt-checkline-stack">
          <label className="mkt-checkline-item">
            <input type="checkbox" />
            <span>Confirm beneficial ownership of the legal entity.</span>
          </label>
          <label className="mkt-checkline-item">
            <input type="checkbox" />
            <span>No Politically Exposed Person is involved.</span>
          </label>
          <label className="mkt-checkline-item">
            <input type="checkbox" />
            <span>Entity and owners are not under any sanctions.</span>
          </label>
        </div>

        <article className="mkt-info-banner">
          <p className="mkt-info-banner-title">KYC Verification Notice</p>
          <p className="mkt-info-banner-text">
            Once submitted, our compliance team reviews documents within 48 to 72 business hours.
          </p>
        </article>
      </section>
    </div>
  );
}
