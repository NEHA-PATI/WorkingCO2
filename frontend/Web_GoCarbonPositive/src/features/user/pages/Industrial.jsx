"use client";

import { useState } from "react";
import {
  FaRecycle,
  FaCogs,
  FaArrowRight,
  FaPhone,
  FaCheckCircle,
  FaLeaf,
} from "react-icons/fa";
import "@features/user/styles/Industrial.css";
import { useNavigate } from "react-router-dom";
import aluminiumModalImage from "../assets/aluminium-industry-photo.jpeg";
import aluminiumScopeImage from "../assets/aluminium-industry-scope .png";
import steelModalImage from "../assets/steel-industry-photo.jpeg";
import steelScopeImage from "../assets/steel-industry-scope.png";

const cards = [
  {
    icon: <FaRecycle />,
    tag: "Low-Carbon Materials",
    title: "Aluminium Industry",
    subtitle: "Sustainable Aluminium Solutions",
    image: aluminiumModalImage,
    desc: "Specialized aluminium solutions for low-carbon sourcing, efficient processing, and circular material recovery across industrial operations.",
    points: [
      "Low-carbon aluminium sourcing support",
      "Scrap recovery and circular reuse planning",
      "Energy-efficient smelting and processing insights",
      "Emission reporting for aluminium operations",
    ],
    detailSections: [
      {
        heading: "Executive Summary",
        paragraphs: [
          "Aluminium sits at the core of modern industrial development, quietly enabling everything from infrastructure to clean energy systems. Its unique combination of lightweight properties, corrosion resistance, high conductivity and recyclability makes it indispensable across sectors such as transportation, construction, packaging, power transmission and renewable energy. As economies continue to urbanize and electrify, aluminium demand is expected to grow steadily, reinforcing its strategic importance in global supply chains.",
          "India has emerged as one of the world's major aluminium producers, supported by abundant bauxite reserves and vertically integrated industrial players such as NALCO, Hindalco Industries and Vedanta Aluminium. These companies operate across the full value chain, including mining, refining, smelting and downstream processing. While such integration enhances operational efficiency and cost control, it also concentrates environmental exposure within a single enterprise.",
          "Sustainability, once treated as a reporting requirement, is now becoming a critical business priority. Regulatory developments such as the European Union's Carbon Border Adjustment Mechanism (CBAM) and India's Carbon Credit Trading Scheme (CCTS) are transforming how emissions are perceived. Carbon is no longer just a metric in sustainability reports; it is increasingly becoming a financial variable that affects pricing, competitiveness, and market access.",
        ],
      },
      {
        heading: "Industry Operating Model",
        paragraphs: [
          "The aluminium industry operates through a highly integrated and energy-intensive production chain. The process begins with bauxite mining, where aluminium-bearing ore is extracted using open-pit mining techniques. This stage involves heavy machinery such as excavators and haul trucks, which are predominantly powered by diesel, contributing to direct emissions. The second stage is alumina refining through the Bayer process.",
          "In this process, bauxite is crushed and subjected to high temperature and pressure in a caustic soda solution. Aluminium oxide dissolves and is later precipitated as alumina (Al2O3). Refineries require continuous operation and consume significant thermal energy for digestion, evaporation, and calcination.",
          "The final stage is aluminium smelting using the Hall-Heroult process. Alumina is dissolved in molten cryolite and subjected to electrolysis, where electric current separates aluminium from oxygen. This stage is the most energy-intensive and requires a stable, uninterrupted electricity supply. Any disruption can damage the electrolytic cells and halt production for extended periods. Due to this requirement, many producers rely on captive power plants, often coal-based, to ensure reliability. This dependency on fossil fuel-based electricity plays a major role in determining the overall carbon footprint of aluminium production.",
        ],
      },
      {
        heading: "Emissions Architecture of the Industry",
        paragraphs: [
          "Emissions in aluminium production are distributed across multiple stages of the value chain and arise from different mechanisms. Process emissions are generated during electrolysis, where carbon anodes react with oxygen released from alumina, forming carbon dioxide. This is an inherent part of the current smelting technology and cannot be eliminated without significant innovation.",
          "Combustion emissions occur primarily in alumina refineries, where fuels such as coal, natural gas, or fuel oil are burned to generate the high temperatures required for processing. These emissions are directly tied to thermal energy demand. Electricity emissions represent the largest share of the industry's carbon footprint. Smelters consume vast amounts of electricity, and when this power is sourced from coal-based generation, emissions increase significantly.",
        ],
      },
      {
        heading: "Regulatory and Trade Pressures",
        paragraphs: [
          "The regulatory environment for carbon-intensive industries is evolving rapidly, with significant implications for aluminium producers.",
          "The European Union's Carbon Border Adjustment Mechanism (CBAM), set to take effect in 2026, requires importers to account for the carbon intensity of products such as aluminium. This effectively extends the EU's carbon pricing system to international trade, making emissions a direct cost factor for exporters.",
          "In India, the introduction of the Carbon Credit Trading Scheme (CCTS) marks a major step toward establishing a domestic carbon market. The scheme aims to set emission intensity targets and enable trading of carbon credits among industrial players.",
          "Additionally, existing mechanisms such as the Perform Achieve Trade (PAT) scheme are being strengthened to improve energy efficiency across industries. These regulatory developments indicate a clear shift toward integrating carbon costs into business operations.",
        ],
      },
      {
        heading: "Carbon Reduction Pathways",
        paragraphs: [
          "Despite the energy-intensive nature of aluminium production, several pathways exist to reduce emissions. Improving energy efficiency within smelters is one of the most immediate options. Advances in cell design, anode technology, and process control systems can reduce electricity consumption per unit of output.",
          "Renewable energy integration is another critical pathway. Companies are increasingly investing in solar and wind power or entering into long-term renewable energy agreements to reduce dependence on fossil fuels. Process innovation also holds long-term potential. Technologies such as inert anodes aim to replace carbon anodes in electrolysis, thereby eliminating process emissions. While promising, these technologies are still in the early stages of commercial deployment.",
          "Recycling offers one of the most effective solutions. Aluminium can be recycled indefinitely with minimal loss of quality, and producing recycled aluminium requires significantly less energy compared to primary production. Expanding recycling infrastructure can therefore play a major role in reducing emissions.",
        ],
      },
      {
        heading: "Carbon Credit Opportunities",
        paragraphs: [
          "Carbon markets provide an opportunity for aluminium producers to generate additional value from emission reduction initiatives. Projects focused on energy efficiency, renewable energy adoption, and process optimization can result in measurable emission reductions. If these reductions meet established standards, they can be converted into carbon credits.",
          "Recycling initiatives also offer potential for generating carbon credits by avoiding emissions associated with primary production. However, participation in carbon markets requires robust monitoring, reporting, and verification systems to ensure credibility.",
        ],
      },
      {
        heading: "Digital Infrastructure for Carbon Management",
        paragraphs: [
          "Effective carbon management in the aluminium industry requires advanced digital infrastructure capable of handling large volumes of operational data.",
          "Digital platforms also support regulatory compliance by maintaining auditable records and generating standardized reports. In addition, they facilitate carbon credit generation by ensuring accurate measurement and verification of emission reductions.",
          "As regulatory requirements and stakeholder expectations increase, digital infrastructure is becoming a critical component of industrial operations.",
        ],
      },
      {
        heading: "Strategic Outlook",
        paragraphs: [
          "The aluminium industry is entering a new phase where carbon intensity is becoming a key determinant of competitiveness. Global policies, including CBAM and domestic carbon markets, are reshaping the economic landscape. Companies that fail to adapt may face higher costs and reduced market access, while those that invest in low-carbon technologies and strategies can gain a competitive advantage.",
          "The transition toward low-carbon aluminium will require significant investment, technological innovation, and operational changes. However, it also presents an opportunity for industry leaders to differentiate themselves and capture emerging market demand.",
          "In the long term, aluminium will continue to play a vital role in enabling sustainable development. The challenge for producers lies in balancing growth with environmental responsibility, ensuring that the industry remains both economically viable and environmentally sustainable.",
        ],
      },
    ],
    tagColor: "#2e7d5e",
  },
  {
    icon: <FaCogs />,
    tag: "High Impact",
    title: "Steel Industry",
    subtitle: "Advanced Metallurgical Solutions",
    image: steelModalImage,
    desc: "Advanced steel manufacturing and metal processing solutions for structural and industrial applications.",
    points: [
      "Custom alloy & grade sourcing",
      "Carbon footprint per heat/batch",
      "Scrap optimization & recycled content",
      "CBAM readiness for steel exports",
    ],
    detailSections: [
      {
        heading: "Executive Summary",
        paragraphs: [
          "The steel industry remains one of the most critical pillars of global industrialization, enabling infrastructure development, transportation systems, energy networks, and manufacturing ecosystems. From bridges and railways to automobiles and wind turbines, steel is deeply embedded in both traditional and emerging sectors.",
          "Its strength, versatility, and recyclability make it indispensable in a world that is simultaneously urbanizing and transitioning toward cleaner energy systems.",
          "India has emerged as one of the largest steel producers globally, supported by a mix of large integrated steel plants and a vast network of secondary producers. The sector contributes significantly to GDP, employment, and industrial growth. However, steel production is inherently carbon-intensive due to its reliance on coal, high-temperature processes, and continuous energy demand.",
        ],
      },
      {
        heading: "Industry Operating Model",
        paragraphs: [
          "Steel production operates through two dominant pathways: the Blast Furnace-Basic Oxygen Furnace (BF-BOF) route and the Electric Arc Furnace (EAF) route. The BF-BOF route is the traditional method and accounts for a significant portion of global steel production. It begins with iron ore reduction in blast furnaces using coke as both fuel and reducing agent.",
          "The resulting molten iron is then refined into steel in basic oxygen furnaces. This process is highly energy-intensive and deeply dependent on coal, making it a major contributor to industrial emissions.",
          "The EAF route, in contrast, primarily uses scrap steel as input. Scrap is melted using electricity, significantly reducing the need for raw iron ore and coke. When powered by renewable energy, EAF-based production can substantially lower emissions. However, availability and quality of scrap remain limiting factors in scaling this method.",
        ],
      },
      {
        heading: "Emissions Architecture of the Industry",
        paragraphs: [
          "The emissions profile of the steel industry is multi-layered, with different sources contributing at various stages of production. Process emissions are primarily generated during the chemical reduction of iron ore in blast furnaces. Carbon reacts with oxygen to produce carbon dioxide, making this an unavoidable emission source under current technologies.",
          "Combustion emissions arise from burning fossil fuels such as coal, coke, and natural gas to achieve the high temperatures required for steelmaking. These emissions are directly linked to thermal energy demand.",
          "Electricity-related emissions depend on the energy mix used. In regions where electricity is generated from fossil fuels, even EAF operations can have significant carbon footprints. Supply chain emissions extend beyond the plant boundary, including mining of raw materials, transportation logistics, and downstream processing. These indirect emissions contribute significantly to the overall lifecycle footprint of steel products.",
        ],
      },
      {
        heading: "Regulatory and Trade Pressures",
        paragraphs: [
          "The regulatory environment for steel is tightening globally. Mechanisms such as carbon pricing and emissions trading systems are being implemented across multiple regions. The European Union's Carbon Border Adjustment Mechanism (CBAM) is a major development, requiring importers to account for the carbon intensity of steel products. This effectively imposes a carbon cost on exports, directly impacting competitiveness.",
          "In India, initiatives such as the Carbon Credit Trading Scheme (CCTS) and Perform Achieve Trade (PAT) are driving improvements in energy efficiency and emissions reduction. These frameworks indicate a shift toward integrating carbon into economic decision-making.",
          "As regulations evolve, companies must adapt quickly to avoid financial penalties and maintain access to global markets.",
        ],
      },
      {
        heading: "Carbon Reduction Pathways",
        paragraphs: [
          "Decarbonizing the steel industry requires a combination of incremental improvements and transformative technologies. Energy efficiency measures, including waste heat recovery and process optimization, can deliver immediate reductions in energy consumption.",
          "Renewable energy integration is a key pathway, particularly for EAF operations. However, ensuring reliable and continuous power supply remains a challenge. Fuel switching offers potential, with options such as natural gas, hydrogen, and biofuels being explored. Hydrogen-based steelmaking, in particular, is gaining attention as a long-term solution.",
          "Material efficiency and increased use of scrap steel can significantly reduce reliance on primary production. Recycling not only lowers emissions but also reduces resource consumption. Carbon capture and storage (CCS) technologies can capture emissions from existing processes, providing a transitional solution while new technologies mature.",
        ],
      },
      {
        heading: "Carbon Credit Opportunities",
        paragraphs: [
          "Carbon markets present new opportunities for steel producers to monetize emission reductions. Projects focused on energy efficiency, renewable energy adoption, fuel switching and recycling can generate carbon credits under recognized methodologies.",
          "Participation in carbon markets requires robust monitoring, reporting, and verification systems to ensure credibility and compliance. Companies that invest early in carbon management capabilities can unlock additional revenue streams while improving sustainability performance.",
        ],
      },
      {
        heading: "Digital Infrastructure for Carbon Management",
        paragraphs: [
          "Effective carbon management requires advanced digital infrastructure capable of handling complex and high-volume data. These systems support regulatory compliance, carbon accounting, and carbon credit lifecycle management. They also enhance transparency and traceability across supply chains.",
          "As stakeholder expectations increase, digital carbon infrastructure is becoming a critical component of industrial operations.",
        ],
      },
      {
        heading: "Strategic Outlook",
        paragraphs: [
          "The steel industry is entering a transformative phase where carbon intensity is becoming a central determinant of competitiveness. Global demand for low-carbon steel is increasing, driven by policy, investor pressure, and customer preferences. Companies that can demonstrate lower emissions will gain a competitive edge in international markets.",
          "The transition to low-carbon steel production will require significant investment, technological innovation, and collaboration across the value chain. While challenges remain, the shift also presents opportunities for differentiation, innovation, and long-term growth.",
          "In the coming years, the ability to measure, manage, and reduce carbon emissions will define leadership in the steel industry.",
        ],
      },
    ],
    tagColor: "#7c3aed",
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
              <h3 className="is-detail-title">{selectedIndustry.title}</h3>
            </div>
            <div className="is-detail-media">
              <img
                className="is-detail-image"
                src={selectedIndustry.image}
                alt={selectedIndustry.title}
              />
            </div>
            <div className="is-detail-body">
              <p className="is-detail-subtitle" style={{ color: selectedIndustry.tagColor }}>
                {selectedIndustry.subtitle}
              </p>
              {selectedIndustry.detailSections ? (
                <div className="is-detail-rich-content">
                  {selectedIndustry.detailSections.map((section) => (
                    <div key={section.heading}>
                      <section className="is-detail-section">
                        <h4 className="is-detail-section-title">{section.heading}</h4>
                        {section.paragraphs.map((paragraph, idx) => (
                          <p className="is-detail-text" key={`${section.heading}-${idx}`}>
                            {paragraph}
                          </p>
                        ))}
                      </section>
                      {selectedIndustry.title === "Steel Industry" &&
                        section.heading === "Emissions Architecture of the Industry" && (
                          <div className="is-detail-scope-block">
                            <h4 className="is-detail-section-title">Scope</h4>
                            <img
                              className="is-detail-scope-image"
                              src={steelScopeImage}
                              alt="Scope for Steel Industry"
                            />
                          </div>
                        )}
                      {selectedIndustry.title === "Aluminium Industry" &&
                        section.heading === "Emissions Architecture of the Industry" && (
                          <div className="is-detail-scope-block">
                            <h4 className="is-detail-section-title">Scope</h4>
                            <img
                              className="is-detail-scope-image"
                              src={aluminiumScopeImage}
                              alt="Scope for Aluminium Industry"
                            />
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <>
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
                </>
              )}
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
