import React from "react";
import { FiAlertTriangle, FiChevronDown, FiInfo, FiSearch } from "react-icons/fi";

const REGISTRY_OPTIONS = [
  "Verra (VCS)",
  "Gold Standard",
  "American Carbon Registry (ACR)",
  "Climate Action Reserve (CAR)",
  "Global Carbon Council (GCC)",
  "Plan Vivo",
  "Puro.earth",
  "International Carbon Registry (ICR)",
  "Cercarbono",
  "Woodland Carbon Code",
];

const DISCLOSURE_QUESTIONS = [
  "Is this project listed on any other carbon marketplace?",
  "Are these credits currently pledged for any bilateral agreement?",
  "Have any credits from this issuance batch been retired?",
];

export default function Step2Registry() {
  return (
    <div className="mkt-step-wrap">
      <header className="mkt-step-header">
        <h2 className="mkt-step-title">Registry and Project Details</h2>
        <p className="mkt-step-subtitle">
          Define your project identity and disclosure data for registry-level validation.
        </p>
      </header>

      <article className="mkt-alert-card">
        <FiAlertTriangle className="mkt-alert-icon" />
        <div>
          <p className="mkt-alert-title">Ensure project exists in your selected registry.</p>
          <p className="mkt-alert-copy">
            Incorrect or unverifiable information may lead to listing rejection or delays.
          </p>
        </div>
      </article>

      <section className="mkt-form-card">
        <label className="mkt-form-field">
          <span className="mkt-form-label">Carbon Registry</span>
          <span className="mkt-search-select-wrap">
            <FiSearch className="mkt-search-select-icon" />
            <select className="mkt-form-select" defaultValue="">
              <option value="" disabled>
                Search or select a registry
              </option>
              {REGISTRY_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <FiChevronDown className="mkt-search-select-chevron" />
          </span>
        </label>
      </section>

      <section className="mkt-form-card">
        <p className="mkt-form-section-title">Core Project Details</p>
        <div className="mkt-form-grid-two">
          <label className="mkt-form-field">
            <span className="mkt-form-label">Project ID</span>
            <input className="mkt-form-input" placeholder="VCS-2451" type="text" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Project Name</span>
            <input className="mkt-form-input" placeholder="Official title on registry" type="text" />
          </label>
          <label className="mkt-form-field mkt-form-field-span-two">
            <span className="mkt-form-label">Registry Project Link</span>
            <span className="mkt-inline-input-wrap">
              <input className="mkt-form-input" placeholder="https://registry.verra.org/..." type="url" />
              <button type="button" className="mkt-btn mkt-btn-secondary">
                Validate
              </button>
            </span>
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Country of Project</span>
            <select className="mkt-form-select" defaultValue="">
              <option value="" disabled>
                Select Country
              </option>
              <option>Brazil</option>
              <option>Kenya</option>
              <option>Indonesia</option>
            </select>
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Region or State</span>
            <input className="mkt-form-input" placeholder="Province or district" type="text" />
          </label>
        </div>
      </section>

      <section className="mkt-form-card mkt-form-card-muted">
        <p className="mkt-form-section-title">Project Classification</p>
        <div className="mkt-form-grid-two">
          <label className="mkt-form-field">
            <span className="mkt-form-label">Methodology</span>
            <select className="mkt-form-select" defaultValue="REDD+">
              <option>REDD+</option>
              <option>Afforestation or Reforestation</option>
              <option>Renewable Energy</option>
              <option>Methane Capture</option>
            </select>
          </label>
          <div className="mkt-form-field">
            <span className="mkt-form-label">Project Type</span>
            <span className="mkt-radio-row">
              <label className="mkt-radio-item">
                <input defaultChecked name="mkt-project-type" type="radio" />
                <span>Avoidance</span>
              </label>
              <label className="mkt-radio-item">
                <input name="mkt-project-type" type="radio" />
                <span>Removal</span>
              </label>
            </span>
          </div>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Vintage Year</span>
            <select className="mkt-form-select" defaultValue="2023">
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
            </select>
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Issuance Year</span>
            <select className="mkt-form-select" defaultValue="2024">
              <option>2024</option>
              <option>2023</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mkt-form-card">
        <p className="mkt-form-section-title">Additional Information</p>
        <div className="mkt-form-grid-two">
          <label className="mkt-form-field">
            <span className="mkt-form-label">Project Developer Name</span>
            <input className="mkt-form-input" type="text" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Verifier Organization</span>
            <input className="mkt-form-input" type="text" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Estimated Annual Generation</span>
            <input className="mkt-form-input" type="number" placeholder="tCO2e" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Total Credits Issued</span>
            <input className="mkt-form-input" type="number" />
          </label>
        </div>
      </section>

      <section className="mkt-form-card mkt-form-card-light">
        <div className="mkt-disclosure-head">
          <p className="mkt-form-section-title">Disclosure Declarations</p>
          <span className="mkt-disclosure-scale">No / Yes</span>
        </div>

        <div className="mkt-disclosure-stack">
          {DISCLOSURE_QUESTIONS.map((question) => (
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

      <footer className="mkt-step-note">
        <FiInfo />
        <p>
          Note: Incomplete or inconsistent registry data may result in rejection or manual review
          delays.
        </p>
      </footer>
    </div>
  );
}
