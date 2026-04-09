import React from "react";
import { FiCheckCircle, FiUploadCloud, FiUser } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

export default function Step1Individual({ sellerType, onSellerTypeChange }) {
  return (
    <div className="mkt-step-wrap">
      <header className="mkt-step-header">
        <h2 className="mkt-step-title">Seller Details</h2>
        <p className="mkt-step-subtitle">
          Your profile will undergo KYC and compliance verification before listings are approved.
        </p>
      </header>

      <section className="mkt-form-card">
        <p className="mkt-form-section-title">Seller Type</p>
        <div className="mkt-choice-grid">
          <button
            type="button"
            className={`mkt-choice-item ${sellerType === "individual" ? "mkt-choice-item-active" : ""}`}
            onClick={() => onSellerTypeChange("individual")}
          >
            <span className="mkt-choice-icon">
              <FiUser />
            </span>
            <span className="mkt-choice-label">Individual</span>
            <span className="mkt-choice-meta">Private asset owner or smallholder</span>
          </button>

          <button
            type="button"
            className={`mkt-choice-item ${sellerType === "organization" ? "mkt-choice-item-active" : ""}`}
            onClick={() => onSellerTypeChange("organization")}
          >
            <span className="mkt-choice-icon">
              <HiOutlineBuildingOffice2 />
            </span>
            <span className="mkt-choice-label">Organization</span>
            <span className="mkt-choice-meta">NGO, Corporate, or Government entity</span>
          </button>
        </div>
      </section>

      <section className="mkt-form-card">
        <p className="mkt-form-section-title">Personal Identity</p>
        <div className="mkt-form-grid-two">
          <label className="mkt-form-field">
            <span className="mkt-form-label">Full Name</span>
            <input className="mkt-form-input" placeholder="Johnathan Doe" type="text" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Date of Birth</span>
            <input className="mkt-form-input" type="date" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Nationality</span>
            <select className="mkt-form-select" defaultValue="">
              <option value="" disabled>
                Select Nationality
              </option>
              <option>India</option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Singapore</option>
            </select>
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Country of Residence</span>
            <select className="mkt-form-select" defaultValue="">
              <option value="" disabled>
                Select Country
              </option>
              <option>India</option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Singapore</option>
            </select>
          </label>
        </div>

        <div className="mkt-form-divider" />

        <div className="mkt-form-grid-two">
          <label className="mkt-form-field">
            <span className="mkt-form-label">Government ID Type</span>
            <select className="mkt-form-select" defaultValue="Aadhaar">
              <option>Aadhaar</option>
              <option>Passport</option>
              <option>PAN</option>
            </select>
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Government ID Number</span>
            <input className="mkt-form-input" placeholder="XXXX XXXX XXXX" type="text" />
          </label>
          <label className="mkt-form-field mkt-form-field-span-two">
            <span className="mkt-form-label">Upload Government ID Proof</span>
            <span className="mkt-upload-zone">
              <FiUploadCloud className="mkt-upload-zone-icon" />
              <span className="mkt-upload-zone-title">Click to upload or drag and drop</span>
              <span className="mkt-upload-zone-meta">PDF, JPG or PNG (max. 10MB)</span>
            </span>
          </label>
        </div>
      </section>

      <section className="mkt-form-card">
        <p className="mkt-form-section-title">Contact and Account Purpose</p>
        <div className="mkt-form-grid-two">
          <label className="mkt-form-field">
            <span className="mkt-form-label">Phone Number</span>
            <input className="mkt-form-input" placeholder="+91 98765 43210" type="tel" />
          </label>
          <div className="mkt-form-field">
            <span className="mkt-form-label">Email Address</span>
            <span className="mkt-field-static">
              <FiCheckCircle /> john.doe@ecofund.com
            </span>
          </div>
        </div>

        <div className="mkt-form-field mkt-form-purpose-wrap">
          <span className="mkt-form-label">Purpose of Account</span>
          <div className="mkt-radio-row">
            <label className="mkt-radio-item">
              <input name="mkt-purpose-individual" type="radio" />
              <span>Selling Credits Only</span>
            </label>
            <label className="mkt-radio-item">
              <input name="mkt-purpose-individual" type="radio" defaultChecked />
              <span>Buy and Sell Credits</span>
            </label>
          </div>
        </div>
      </section>

      <section className="mkt-form-card">
        <p className="mkt-form-section-title">Compliance Declarations</p>
        <div className="mkt-toggle-stack">
          <div className="mkt-toggle-item">
            <div className="mkt-toggle-copy">
              <p>Beneficial Ownership Confirmation</p>
              <span>I confirm that I am the sole beneficial owner of the assets being listed.</span>
            </div>
            <div className="mkt-switch-row">
              <button type="button" className="mkt-switch-btn mkt-switch-btn-active">
                Yes
              </button>
              <button type="button" className="mkt-switch-btn">
                No
              </button>
            </div>
          </div>

          <div className="mkt-toggle-item">
            <div className="mkt-toggle-copy">
              <p>Politically Exposed Person (PEP)</p>
              <span>Are you or an immediate family member a senior public official?</span>
            </div>
            <div className="mkt-switch-row">
              <button type="button" className="mkt-switch-btn">
                Yes
              </button>
              <button type="button" className="mkt-switch-btn mkt-switch-btn-active">
                No
              </button>
            </div>
          </div>

          <label className="mkt-checkline-item">
            <input type="checkbox" />
            <span>
              I confirm I am not currently subject to international sanctions and not resident in a
              comprehensively sanctioned territory.
            </span>
          </label>
        </div>
      </section>
    </div>
  );
}
