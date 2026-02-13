'use client';

import React, { useState } from 'react';
import "@shared/ui/styles/Privacy.css"

const sections = [
  {
    id: 1,
    title: "Information We Collect",
    content: `a) Personal Information
Name, email address, phone number
Account credentials
Organization details
Government/OAuth-verified data (if applicable)

b) Platform & Project Data
Carbon assets data (trees, EVs, solar, projects)
Uploaded documents, images, and metadata
Location data (only where required)

c) Technical & Usage Data
IP address, browser type, device identifiers
Log files, access times, pages viewed, error logs`
  },
  {
    id: 2,
    title: "Sources of Information",
    content: `We collect information:

When you register, log in, or fill forms
When you connect via OAuth providers (e.g., Google, DigiLocker)
Automatically when you use our platform
From authorized partners or public sources where permitted by law`
  },
  {
    id: 3,
    title: "Cookies and Tracking Technologies",
    content: `We use cookies and similar technologies to:

Maintain sessions and security
Remember preferences
Analyze usage and improve services

You can control cookies through your browser settings.`
  },
  {
    id: 4,
    title: "How We Use Information",
    content: `We use your information to:

Provide and operate our services
Verify users and assets
Communicate with you
Improve security and prevent fraud
Comply with legal obligations`
  },
  {
    id: 5,
    title: "Sharing and Disclosure",
    content: `We may share information with:

Cloud hosting and infrastructure providers
OAuth/identity providers
Analytics, security, and compliance vendors
Legal or government authorities when required by law

We do not sell personal data.`
  },
  {
    id: 6,
    title: "International Data Transfers",
    content: `Your information may be processed or stored outside your country. We apply appropriate safeguards to protect your data.`
  },
  {
    id: 7,
    title: "Data Protection Measures",
    content: `We use reasonable technical and organizational measures such as:

Encryption (in transit and at rest where appropriate)
Role-based access control
Secure servers and monitoring
Regular reviews of security practices`
  },
  {
    id: 8,
    title: "Data Retention",
    content: `We retain data only as long as necessary to:

Provide services
Meet legal and regulatory requirements
Resolve disputes and enforce agreements

You may request deletion where legally permitted.`
  },
  {
    id: 9,
    title: "Your Rights",
    content: `Depending on applicable law, you may have the right to:

Access your data
Correct inaccurate data
Request deletion
Object to or restrict processing
Request data portability
Withdraw consent

Requests can be sent to: privacy@yourdomain.com`
  },
  {
    id: 10,
    title: "Children's Privacy",
    content: `Our services are not directed to children under 18. We do not knowingly collect such data.`
  },
  {
    id: 11,
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy. The updated version will be posted with a revised date.`
  },
  {
    id: 12,
    title: "Contact Us",
    content: `Email: privacy@yourdomain.com
Company Name: Carbon Positive Inc.
Website: www.yoururl.com`
  },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  const activeContent = sections.find(s => s.id === activeSection);

  return (
    <div className="privacy-container">
      <div className="sidebar">
        <div className="sidebar-header">Privacy Policy</div>
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
          <h1 className="title">Carbon Positive Privacy Policy</h1>
          <p className="subtitle">Last Updated: June 20 , 2024</p>
        </div>

        <div className="intro-text">
          Welcome to Carbon Positive. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our website, applications, and services. In using this website you are deemed to have read and agreed to the following terms and conditions.
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
