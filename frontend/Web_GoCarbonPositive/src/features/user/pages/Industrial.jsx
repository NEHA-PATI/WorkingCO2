"use client";

import { useState } from "react";
import {
  FaRecycle,
  FaCogs,
  FaSolarPanel,
  FaTint,
  FaRobot,
  FaSyncAlt,
  FaTruck,
  FaClipboardCheck,
  FaArrowRight,
  FaPhone,
  FaCheckCircle,
  FaLeaf,
} from "react-icons/fa";
import "@features/user/styles/Industrial.css";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    icon: <FaRecycle />,
    tag: "Compliance-Ready",
    title: "E-Waste Management",
    subtitle: "Responsible Electronics Lifecycle",
    desc: "End-to-end certified e-waste collection, data destruction, and material recovery services ensuring zero landfill.",
    points: [
      "Certified ITAD & data destruction",
      "Material recovery & refurbishment",
      "Compliance with E-Waste Rules 2022",
      "Chain-of-custody audit reports",
    ],
    tagColor: "#2e7d5e",
  },
  {
    icon: <FaCogs />,
    tag: "High Impact",
    title: "Steel & Metal",
    subtitle: "Advanced Metallurgical Solutions",
    desc: "Advanced steel manufacturing and metal processing solutions for structural and industrial applications.",
    points: [
      "Custom alloy & grade sourcing",
      "Carbon footprint per heat/batch",
      "Scrap optimization & recycled content",
      "CBAM readiness for steel exports",
    ],
    tagColor: "#7c3aed",
  },
  {
    icon: <FaSolarPanel />,
    tag: "Net-Zero Enabler",
    title: "Renewable Energy",
    subtitle: "Clean Power Integration",
    desc: "Solar, wind, and renewable energy integration systems for sustainable power solutions across industrial facilities.",
    points: [
      "On-site solar & wind feasibility",
      "REC & green tariff management",
      "Grid stability & storage planning",
      "RE100 procurement support",
    ],
    tagColor: "#d97706",
  },
  {
    icon: <FaTint />,
    tag: "Resource Efficiency",
    title: "Water Treatment",
    subtitle: "Industrial Water Stewardship",
    desc: "Industrial water purification and recycling technologies to achieve zero liquid discharge targets.",
    points: [
      "Zero Liquid Discharge (ZLD) systems",
      "Effluent treatment & reuse",
      "Water footprint accounting",
      "Regulatory discharge compliance",
    ],
    tagColor: "#0369a1",
  },
  {
    icon: <FaRobot />,
    tag: "Industry 4.0",
    title: "Smart Manufacturing",
    subtitle: "AI-Powered Factory Intelligence",
    desc: "IoT-enabled smart factory solutions with AI-powered optimization and real-time analytics via digital twin technology.",
    points: [
      "IoT sensor integration & SCADA",
      "AI-driven energy optimization",
      "Digital twin for process simulation",
      "OEE & carbon KPI dashboards",
    ],
    tagColor: "#db2777",
  },
  {
    icon: <FaSyncAlt />,
    tag: "Waste Elimination",
    title: "Circular Economy",
    subtitle: "Zero-Waste Business Models",
    desc: "Zero-waste solutions and material recycling programs. Map material flows and design take-back programs.",
    points: [
      "Material flow analysis & mapping",
      "Industrial symbiosis matching",
      "EPR compliance & take-back programs",
      "Circularity KPI reporting",
    ],
    tagColor: "#059669",
  },
  {
    icon: <FaTruck />,
    tag: "Supply Chain",
    title: "Green Logistics",
    subtitle: "Low-Carbon Supply Chain",
    desc: "Decarbonize your freight and logistics operations with shipment-level carbon tracking and fleet electrification.",
    points: [
      "GLEC-standard freight carbon accounting",
      "EV fleet transition modeling",
      "Green lane certification",
      "Shipper ESG reporting packs",
    ],
    tagColor: "#0891b2",
  },
  {
    icon: <FaClipboardCheck />,
    tag: "Regulatory",
    title: "ESG & Compliance",
    subtitle: "Regulatory Reporting Automation",
    desc: "Stay ahead of BRSR, SEBI ESG, GRI, TCFD, CBAM, and CSRD with automated data collection and audit-ready packages.",
    points: [
      "BRSR Core & SEBI ESG reporting",
      "CBAM carbon cost exposure analysis",
      "GRI / TCFD disclosure automation",
      "Third-party assurance readiness",
    ],
    tagColor: "#b45309",
  },
];

const IndustrialSolutions = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [demoIndustry, setDemoIndustry] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formData, setFormData] = useState({
    industry_name: "",
    industry_size_range: "",
    industry_revenue_range: "",
    contact_person_name: "",
    contact_email: "",
    contact_number: "",
  });
  const navigate = useNavigate();

  const openDemoForm = (industryName) => {
    setDemoIndustry(industryName);
    setFormData((prev) => ({
      ...prev,
      industry_name: industryName,
    }));
  };

  const closeDemoForm = () => {
    setDemoIndustry(null);
    setFormData({
      industry_name: "",
      industry_size_range: "",
      industry_revenue_range: "",
      contact_person_name: "",
      contact_email: "",
      contact_number: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5007/api/demo/book-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setToastMessage("Demo request submitted successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        closeDemoForm();
      } else {
        setToastMessage(data.message || "Submission failed");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error submitting demo request:", error);
      setToastMessage("Server error. Please try again later.");
      setShowToast(true);
    }
  };

  const scrollToSolutions = () => {
    const section = document.getElementById("is-solutions");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="is-root">
      <section className="is-hero">
        <div className="is-hero-bg">
          <img
            className="is-hero-image"
            src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1800&q=80"
            alt="Modern industrial sustainability solutions"
          />
          <div className="is-hero-overlay"></div>
        </div>

        <div className="is-hero-content">
          <div className="is-hero-badge">
            <span className="is-badge-dot"></span>
            Industry-Specific Carbon Solutions
          </div>
          <h1 className="is-hero-title">
            Engineering <span className="is-hero-green">Clean Industry</span> for Lasting Impact
          </h1>
          <p className="is-hero-desc">
            Industrial solutions that transform your business while protecting our
            planet - tailored to your sector&apos;s specific regulations,
            operations, and ESG demands.
          </p>
          <div className="is-hero-actions">
            <button className="is-btn-primary" onClick={scrollToSolutions}>
              START EXPLORING <FaArrowRight />
            </button>
            <button className="is-btn-ghost" onClick={() => navigate("/contact")}>
              <FaPhone /> Contact Us
            </button>
          </div>
        </div>

      </section>

      <section className="is-cards-section" id="is-solutions">
        <div className="is-cards-header">
          <div className="is-section-badge">
            <FaLeaf /> Our Solutions
          </div>
          <h2 className="is-cards-title">Industry-Specific Carbon Solutions</h2>
          <p className="is-cards-subtitle">
            Tailored sustainability solutions across 8+ industrial verticals
          </p>
        </div>
        <div className="is-cards-grid">
          {cards.map((card, i) => (
            <div
              className={`is-card ${hoveredCard === i ? "is-card-hovered" : ""}`}
              key={i}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ "--tag-color": card.tagColor }}
            >
              <div className="is-card-top">
                <div
                  className="is-card-icon-wrap"
                  style={{ background: `${card.tagColor}18` }}
                >
                  <span style={{ color: card.tagColor }}>{card.icon}</span>
                </div>
                <span
                  className="is-card-tag"
                  style={{
                    color: card.tagColor,
                    borderColor: `${card.tagColor}44`,
                    background: `${card.tagColor}12`,
                  }}
                >
                  {card.tag}
                </span>
              </div>
              <h3 className="is-card-title">{card.title}</h3>
              <p className="is-card-subtitle" style={{ color: card.tagColor }}>
                {card.subtitle}
              </p>
              <p className="is-card-desc">{card.desc}</p>
              <ul className="is-card-points">
                {card.points.map((p, j) => (
                  <li key={j}>
                    <FaCheckCircle style={{ color: card.tagColor }} /> {p}
                  </li>
                ))}
              </ul>
              <div className="is-card-actions">
                <button
                  className="is-card-btn-primary"
                  type="button"
                  onClick={() => setSelectedIndustry(card)}
                >
                  Read More
                </button>
                <button
                  className="is-card-btn-outline"
                  type="button"
                  onClick={() => openDemoForm(card.title)}
                >
                  Book a Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="is-cta-section">
        <h2 className="is-cta-title">
          Let&apos;s Build Your Industry-Specific
          <span className="is-cta-highlight">Carbon Roadmap</span>
        </h2>
        <p className="is-cta-desc">
          Get a tailored demo scoped to your sector&apos;s regulations, data
          sources, and reduction opportunities - not a generic product tour.
        </p>
        <div className="is-cta-actions">
          <button
            className="is-cta-btn-primary"
            type="button"
            onClick={() => openDemoForm("Sector Specialist Demo")}
          >
            Request a Sector Demo <FaArrowRight />
          </button>
        </div>
      </section>

      {showToast && (
        <div className="is-toast-notification">
          <div className="is-toast-content">OK {toastMessage}</div>
        </div>
      )}

      {demoIndustry && (
        <div className="is-modal-overlay" onClick={closeDemoForm}>
          <div
            className="is-modal-content is-demo-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="is-close-btn" onClick={closeDemoForm}>
              x
            </button>

            <div className="is-demo-modal-header">
              <h2 className="is-demo-modal-title">Book a Demo</h2>
              <p className="is-demo-modal-subtitle">
                Get started with {demoIndustry}
              </p>
            </div>

            <form className="is-demo-form" onSubmit={handleFormSubmit}>
              <div className="is-form-group">
                <label className="is-form-label">Industry</label>
                <input
                  type="text"
                  value={formData.industry_name}
                  disabled
                  className="is-form-input is-disabled"
                />
              </div>

              <div className="is-form-group">
                <label className="is-form-label">
                  Company Size <span className="is-required">*</span>
                </label>
                <select
                  name="industry_size_range"
                  value={formData.industry_size_range}
                  onChange={handleFormChange}
                  className="is-form-select"
                  required
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-100">51-100 employees</option>
                  <option value="100-200">100-200 employees</option>
                  <option value="200+">200+ employees</option>
                </select>
              </div>

              <div className="is-form-group">
                <label className="is-form-label">
                  Annual Revenue <span className="is-required">*</span>
                </label>
                <select
                  name="industry_revenue_range"
                  value={formData.industry_revenue_range}
                  onChange={handleFormChange}
                  className="is-form-select"
                  required
                >
                  <option value="">Select revenue range</option>
                  <option value="0-1M">INR0 - INR1M</option>
                  <option value="1M-5M">INR1M - INR5M</option>
                  <option value="5M-10M">INR5M - INR10M</option>
                  <option value="10M+">INR10M+</option>
                </select>
              </div>

              <div className="is-form-group">
                <label className="is-form-label">
                  Contact Person <span className="is-required">*</span>
                </label>
                <input
                  type="text"
                  name="contact_person_name"
                  value={formData.contact_person_name}
                  onChange={handleFormChange}
                  className="is-form-input"
                  required
                />
              </div>

              <div className="is-form-group">
                <label className="is-form-label">
                  Contact Email <span className="is-required">*</span>
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleFormChange}
                  className="is-form-input"
                  required
                />
              </div>

              <div className="is-form-group">
                <label className="is-form-label">Contact Number</label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleFormChange}
                  className="is-form-input"
                />
              </div>

              <button type="submit" className="is-btn-form-submit">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedIndustry && (
        <div className="is-detail-overlay" onClick={() => setSelectedIndustry(null)}>
          <div className="is-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="is-close-btn" onClick={() => setSelectedIndustry(null)}>
              x
            </button>
            <div className="is-detail-header">
              <div
                className="is-detail-icon"
                style={{ background: `${selectedIndustry.tagColor}18`, color: selectedIndustry.tagColor }}
              >
                {selectedIndustry.icon}
              </div>
              <h3 className="is-detail-title">{selectedIndustry.title}</h3>
              <p className="is-detail-subtitle" style={{ color: selectedIndustry.tagColor }}>
                {selectedIndustry.subtitle}
              </p>
            </div>
            <div className="is-detail-body">
              <h4 className="is-detail-heading">Overview</h4>
              <p className="is-detail-text">{selectedIndustry.desc}</p>
              <h4 className="is-detail-heading">Key Features</h4>
              <ul className="is-detail-features">
                {selectedIndustry.points.map((feature, idx) => (
                  <li key={idx}>
                    <FaCheckCircle style={{ color: selectedIndustry.tagColor }} /> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="is-detail-actions">
              <button
                className="is-detail-primary"
                onClick={() => {
                  const industryName = selectedIndustry.title;
                  setSelectedIndustry(null);
                  openDemoForm(industryName);
                }}
              >
                Book a Demo Now
              </button>
              <button className="is-detail-outline" onClick={() => navigate("/contact")}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustrialSolutions;