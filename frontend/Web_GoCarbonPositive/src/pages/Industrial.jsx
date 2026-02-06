"use client";

import { useState } from "react";
import "../styles/user/Industrial.css";
import { useNavigate } from "react-router-dom";

const IndustrialSolutions = () => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [demoIndustry, setDemoIndustry] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false); // NEW
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
    setFormData({
      ...formData,
      industry_name: industryName,
    });
  };

  const closeDemoForm = () => {
    setDemoIndustry(null);
    setIsExpanded(false); // RESET
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
    setFormData({
      ...formData,
      [name]: value,
    });
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


  const industries = [
    {
      id: 1,
      name: "Steel & Metal",
      logo: "⚙️",
      color: "card-blue",
      description:
        "Advanced steel manufacturing and metal processing solutions for structural and industrial applications.",
      details:
        "Our steel and metal solutions provide cutting-edge technology for manufacturing, processing, and refinement. We deliver sustainable practices with zero-waste production methods, ensuring maximum efficiency and minimal environmental impact. Perfect for construction, automotive, and heavy machinery industries.",
      timestamp: "Updated: Jan 2024",
      features: [
        "High-grade steel production",
        "Advanced metallurgy",
        "Eco-friendly processing",
        "Quality assurance",
      ],
    },
    {
      id: 2,
      name: "Renewable Energy",
      logo: "☀️",
      color: "card-green",
      description:
        "Solar, wind, and renewable energy integration systems for sustainable power solutions.",
      details:
        "Transform your energy infrastructure with our renewable solutions. We specialize in solar panel installation, wind turbine integration, and energy storage systems. Our platform reduces carbon footprint by up to 80% while optimizing energy efficiency across operations.",
      timestamp: "Updated: Feb 2024",
      features: [
        "Solar integration",
        "Wind energy systems",
        "Battery storage",
        "Grid optimization",
      ],
    },
    {
      id: 3,
      name: "Water Treatment",
      logo: "💧",
      color: "card-cyan",
      description:
        "Industrial water purification and recycling technologies for sustainable resource management.",
      details:
        "Our water treatment solutions combine advanced filtration, purification, and recycling technologies. We help industries reduce water consumption by 60% while ensuring compliance with international environmental standards.",
      timestamp: "Updated: Jan 2024",
      features: [
        "Advanced filtration",
        "Wastewater recycling",
        "Quality monitoring",
        "Compliance ready",
      ],
    },
    {
      id: 4,
      name: "Carbon Capture",
      logo: "🌍",
      color: "card-teal",
      description:
        "Cutting-edge carbon capture and offset solutions for climate-neutral operations.",
      details:
        "Achieve net-zero emissions with our comprehensive carbon capture technology. We remove atmospheric CO2 and permanently store it, helping your company become carbon positive while generating ESG credits.",
      timestamp: "Updated: Feb 2024",
      features: [
        "CO2 capture",
        "Permanent storage",
        "ESG reporting",
        "Compliance support",
      ],
    },
    {
      id: 5,
      name: "Smart Manufacturing",
      logo: "🤖",
      color: "card-indigo",
      description:
        "IoT-enabled smart factory solutions with AI-powered optimization and real-time analytics.",
      details:
        "Industry 4.0 ready manufacturing with IoT sensors, AI analytics, and predictive maintenance. Reduce downtime by 45%, increase productivity by 35%, and gain real-time visibility into your entire operation.",
      timestamp: "Updated: Mar 2024",
      features: [
        "IoT integration",
        "AI analytics",
        "Predictive maintenance",
        "Real-time monitoring",
      ],
    },
    {
      id: 6,
      name: "Circular Economy",
      logo: "♻️",
      color: "card-lime",
      description:
        "Zero-waste solutions and material recycling programs for sustainable business models.",
      details:
        "Transform your business model with circular economy principles. We help you design zero-waste processes, implement material recycling programs, and create value from waste streams.",
      timestamp: "Updated: Feb 2024",
      features: [
        "Waste reduction",
        "Material recycling",
        "Supply chain optimization",
        "Sustainability tracking",
      ],
    },
  ];

  return (
    <div className="industrial-container">
      {/* Header Section */}
      <header className="header">
        <div className="header-top">
          <button className="contact-btn" onClick={() => navigate("/contact")}>
            CONTACT US
          </button>
        </div>

        <div className="hero-section">
          <div className="hero-content">
            {/* <div className="hero-number">01</div> */}
            <h2 className="hero-title">
              WE BUILD A<br />
              SUSTAINABLE
              <br />
              FUTURE
            </h2>
            <p className="hero-subtitle">
              Industrial solutions that transform your business while protecting
              our planet
            </p>
            <button className="explore-btn">START EXPLORING</button>
          </div>
          <div className="hero-image-placeholder">
            <div className="image-box">💼</div>
          </div>
        </div>
      </header>

      {/* Solutions Section */}
      <section id="solutions" className="solutions-section">
        <div className="solutions-header">
          <h2 className="section-title">Our Industrial Solutions</h2>
          <p className="section-subtitle">
            Comprehensive sustainability-focused solutions across industries
          </p>
        </div>

        <div className="cards-grid">
          {industries.map((industry) => (
            <div
              key={industry.id}
              className={`industry-card ${industry.color}`}
            >
              <div className="ribbon">{industry.timestamp}</div>
              <div className="card-logo">{industry.logo}</div>
              <h3 className="card-title">{industry.name}</h3>
              <p className="card-description">{industry.description}</p>
              <div className="card-actions">
                <button
                  className="btn-read-more"
                  onClick={() => setSelectedIndustry(industry)}
                >
                  Read More
                </button>
                <button
                  className="btn-demo"
                  onClick={() => openDemoForm(industry.name)}
                >
                  Book a Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-content">✓ {toastMessage}</div>
        </div>
      )}

      {/* Demo Form Modal */}
      {demoIndustry && (
        <div className="modal-overlay" onClick={closeDemoForm}>
          <div
            className="modal-content demo-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeDemoForm}>
              ✕
            </button>

            <div className="demo-modal-header">
              <h2 className="demo-modal-title">Book a Demo</h2>
              <p className="demo-modal-subtitle">
                Get started with {demoIndustry}
              </p>
            </div>

            <form className="demo-form" onSubmit={handleFormSubmit}>
              {/* Industry Name - Pre-filled */}
              <div className="form-group">
                <label className="form-label">Industry</label>
                <input
                  type="text"
                  value={formData.industry_name}
                  disabled
                  className="form-input disabled"
                />
              </div>

              {/* Industry Size Range */}
              <div className="form-group">
                <label className="form-label">
                  Company Size <span className="required">*</span>
                </label>
                <select
                  name="industry_size_range"
                  value={formData.industry_size_range}
                  onChange={handleFormChange}
                  className="form-select"
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

              {/* Industry Revenue Range */}
              <div className="form-group">
                <label className="form-label">
                  Annual Revenue <span className="required">*</span>
                </label>
                <select
                  name="industry_revenue_range"
                  value={formData.industry_revenue_range}
                  onChange={handleFormChange}
                  className="form-select"
                  required
                >
                  <option value="">Select revenue range</option>
                  <option value="0-1M">INR0 - INR1M</option>
                  <option value="1M-5M">INR1M - INR5M</option>
                  <option value="5M-10M">INR5M - INR10M</option>
                  <option value="10M+">INR10M+</option>
                </select>
              </div>

              {/* Contact Person Name */}
              <div className="form-group">
                <label className="form-label">
                Contact Person <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="contact_person_name"
                  value={formData.contact_person_name}
                  onChange={handleFormChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Contact Email */}
              <div className="form-group">
                <label className="form-label">
                 Contact Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleFormChange}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Contact Number */}
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleFormChange}
                  className="form-input"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-form-submit">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedIndustry && (
        <div
          className="modal-overlay"
          onClick={() => {
            setSelectedIndustry(null);
            setIsExpanded(false);
          }}
        >
          <div
            className={`modal-content ${isExpanded ? "modal-expanded" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-top-actions">
              {/* NEW EXPAND BUTTON */}
              <button
                className="expand-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                ⛶
              </button>

              {/* EXISTING CLOSE */}
              <button
                className="close-btn"
                onClick={() => {
                  setSelectedIndustry(null);
                  setIsExpanded(false);
                }}
              >
                ✕
              </button>
            </div>

            <div className="modal-header">
              <div className="modal-logo">{selectedIndustry.logo}</div>
              <h2 className="modal-title">{selectedIndustry.name}</h2>
              <p className="modal-timestamp">{selectedIndustry.timestamp}</p>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3 className="modal-section-title">Overview</h3>
                <p className="modal-text">{selectedIndustry.details}</p>
              </div>

              <div className="modal-section">
                <h3 className="modal-section-title">Key Features</h3>
                <ul className="features-list">
                  {selectedIndustry.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-demo-full"
                  onClick={() => {
                    setSelectedIndustry(null);
                    openDemoForm(selectedIndustry.name);
                  }}
                >
                  Book a Demo Now
                </button>

                <button className="btn-contact-full">Contact Sales</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
    </div>
  );
};

export default IndustrialSolutions;
