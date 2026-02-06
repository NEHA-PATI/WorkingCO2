'use client';

import React, { useState } from 'react';
import "../../styles/user/T&C.css"

const sections = [
  {
    id: 1,
    title: "Service Description",
    content: `We provide a digital platform for carbon-positive initiatives, including asset submission, tracking, verification workflows, and related services.`
  },
  {
    id: 2,
    title: "User Obligations",
    content: `You agree to:

Provide accurate information
Maintain confidentiality of your account
Use the platform lawfully
Ensure submitted data and assets are genuine and authorized`
  },
  {
    id: 3,
    title: "Intellectual Property",
    content: `All platform content, software, and branding are owned by or licensed to us. You may not copy, modify, or distribute without permission.`
  },
  {
    id: 4,
    title: "Acceptable Use",
    content: `You must not:

Upload false, misleading, or illegal content
Interfere with platform security
Attempt unauthorized access
Use the service for unlawful purposes`
  },
  {
    id: 5,
    title: "Disclaimers",
    content: `Services are provided "as is" without warranties of any kind. We do not guarantee uninterrupted, error-free, or fully verified outcomes.`
  },
  {
    id: 6,
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of the platform.`
  },
  {
    id: 7,
    title: "Indemnification",
    content: `You agree to indemnify and hold us harmless from claims arising from your misuse of the platform or violation of these terms.`
  },
  {
    id: 8,
    title: "Governing Law",
    content: `These terms are governed by the laws of India.`
  },
  {
    id: 9,
    title: "Dispute Resolution",
    content: `Disputes shall be resolved through:

Negotiation in good faith
If unresolved, arbitration or courts located in your jurisdiction`
  },
  {
    id: 10,
    title: "Modification of Terms",
    content: `We may update these terms. Continued use means acceptance of revised terms.`
  },
  {
    id: 11,
    title: "Termination",
    content: `We may suspend or terminate accounts for violations or security reasons.`
  },
  {
    id: 12,
    title: "Contact Information",
    content: `Email: legal@yourdomain.com
Company Name: Carbon Positive Inc.
Address: [Optional]`
  },
];

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  const activeContent = sections.find(s => s.id === activeSection);

  return (
    <div className="terms-container">
      <div className="sidebar">
        <div className="sidebar-header">Terms & Conditions</div>
        <nav className="sidebar-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      <main className="content-area">
        <div className="content-header">
          <h1 className="title">Carbon Positive Terms & Conditions</h1>
          <p className="subtitle">Effective Date: January 22, 2025</p>
        </div>

        <div className="intro-text">
          By accessing or using Carbon Positive, you agree to these Terms & Conditions. Please read this carefully to understand our practices and your rights and obligations. If you do not agree with these Terms & Conditions in general or any part of it, you should not access or use our platform.
        </div>

        <div className="section-content">
          <h2 className="section-title">{activeContent.title}</h2>
          <div className="section-body">
            {activeContent.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>
                {paragraph.split('\n').map((line, lineIdx) => (
                  <React.Fragment key={lineIdx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
