import React, { useState } from "react";
import { FiAlertTriangle, FiSend } from "react-icons/fi";

const DECLARATIONS = [
  {
    title: "Proof of Ownership",
    text: "I confirm that I am the lawful owner of the listed carbon credits with full transfer rights.",
  },
  {
    title: "Exclusivity and Non-Duplication",
    text: "I confirm these credits are not listed or pledged on any other marketplace.",
  },
  {
    title: "Credit Status Confirmation",
    text: "I confirm these credits are active, unretired, and transferable.",
  },
  {
    title: "Accuracy of Information",
    text: "I declare all uploaded documents and metadata are accurate and current.",
  },
  {
    title: "Authorization to Act",
    text: "I confirm legal authority to act on behalf of the listed individual or organization.",
  },
  {
    title: "Registry Compliance",
    text: "I confirm compliance with selected registry rules and methodologies.",
  },
  {
    title: "Environmental Integrity Statement",
    text: "I confirm listed credits represent genuine and verified climate outcomes.",
  },
  {
    title: "Marketplace Terms Agreement",
    text: "I agree to marketplace terms of service, privacy policy, and transaction guidelines.",
  },
  {
    title: "Non-Delivery and Default Clause",
    text: "I acknowledge penalties may apply for non-delivery after transaction confirmation.",
  },
  {
    title: "Indemnification Clause",
    text: "I agree to indemnify Carbon Positive against claims from misleading information.",
  },
  {
    title: "Anti-Fraud and Anti-Misrepresentation",
    text: "I confirm no material information has been withheld from this listing.",
  },
];

export default function Step6Legal({ onSubmitSuccess }) {
  const [isSignatureAccepted, setIsSignatureAccepted] = useState(false);

  return (
    <div className="mkt-step-wrap mkt-step-legal-wrap">
      <header className="mkt-step-header">
        <h2 className="mkt-step-title">Legal and Declarations</h2>
        <p className="mkt-step-subtitle">
          Review and confirm binding declarations to finalize your carbon credit listing.
        </p>
      </header>

      <section className="mkt-legal-stack">
        {DECLARATIONS.map((item) => (
          <label className="mkt-legal-item" key={item.title}>
            <input className="mkt-legal-item-check" type="checkbox" />
            <span className="mkt-legal-item-copy">
              <span className="mkt-legal-item-title">{item.title}</span>
              <span className="mkt-legal-item-text">{item.text}</span>
            </span>
          </label>
        ))}
      </section>

      <section className="mkt-legal-warning">
        <FiAlertTriangle />
        <p>
          By submitting this listing, you enter a legally binding agreement. Submission triggers a
          final manual audit by our compliance team.
        </p>
      </section>

      <section className="mkt-form-card mkt-form-card-translucent">
        <p className="mkt-form-section-title">Digital Signature</p>
        <div className="mkt-form-grid-two">
          <label className="mkt-form-field">
            <span className="mkt-form-label">Signer Full Name</span>
            <input className="mkt-form-input" placeholder="Enter your full legal name" type="text" />
          </label>
          <label className="mkt-form-field">
            <span className="mkt-form-label">Signer Role</span>
            <input className="mkt-form-input" placeholder="CEO, Project Manager" type="text" />
          </label>
          <div className="mkt-form-field">
            <span className="mkt-form-label">Date of Signing</span>
            <span className="mkt-field-static">October 24, 2023</span>
          </div>
          <div className="mkt-form-field">
            <span className="mkt-form-label">Timestamp (UTC)</span>
            <span className="mkt-field-static">14:32:05 UTC</span>
          </div>
          <div className="mkt-form-field mkt-form-field-span-two">
            <span className="mkt-form-label">IP Address Capture</span>
            <span className="mkt-field-static">192.168.1.104 (Logged)</span>
          </div>
        </div>

        <label className="mkt-checkline-item">
          <input
            type="checkbox"
            checked={isSignatureAccepted}
            onChange={(event) => setIsSignatureAccepted(event.target.checked)}
          />
          <span>I electronically sign and agree that this signature is legally binding.</span>
        </label>
      </section>

      <section className="mkt-legal-jurisdiction">
        <p>
          Governing Law and Jurisdiction: Transactions and disputes are governed by the operating
          jurisdiction of Carbon Positive.
        </p>
      </section>

      <section className="mkt-legal-submit-wrap">
        <button
          className={`mkt-btn mkt-btn-primary ${!isSignatureAccepted ? "mkt-btn-disabled" : ""}`}
          type="button"
          disabled={!isSignatureAccepted}
          onClick={() => {
            if (onSubmitSuccess) onSubmitSuccess();
          }}
        >
          Submit Listing
          <FiSend />
        </button>
      </section>
    </div>
  );
}
