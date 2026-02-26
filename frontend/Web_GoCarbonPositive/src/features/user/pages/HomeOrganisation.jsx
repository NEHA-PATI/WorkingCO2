import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@contexts/AuthContext";
import {
  FaArrowRight,
  FaBookOpen,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaClock,
  FaBullhorn,
  FaGlobe,
  FaLeaf,
  FaShieldHeart,
} from "react-icons/fa6";
import { HiMiniChartBar } from "react-icons/hi2";
import "@features/user/styles/HomeOrganisation.css";

const HomeOrganisation = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [orgCarouselIndex, setOrgCarouselIndex] = useState(0);
  const [orgVisibleCount, setOrgVisibleCount] = useState(3);
  const [servicesCarouselIndex, setServicesCarouselIndex] = useState(0);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useAuth();

  const organisationSolutions = [
    {
      image: "/e-waste.jpg",
      title: "E-Waste Management",
      desc: "Recover valuable metals and components from discarded electronics through certified dismantling and sorting workflows. This reduces landfill burden, lowers raw material extraction pressure, and supports responsible circular manufacturing at scale.",
    },
    {
      image: "/plastic.jpg",
      title: "Plastic Recycling",
      desc: "Closed-loop plastic recovery programs sort, clean, and reprocess industrial and post-consumer waste into reusable feedstock. These systems reduce virgin polymer demand, improve material traceability, and help plants meet sustainability targets consistently.",
    },
    {
      image: "/battery.jpg",
      title: "Battery Recycling",
      desc: "Safe battery take-back and recovery pipelines process lithium-ion and lead-acid units with controlled handling standards. Recovered materials re-enter production streams, reducing hazardous waste risks and strengthening circular supply chain resilience.",
    },
    {
      image: "/steel.jpg",
      title: "Steel and Metal",
      desc: "Advanced steel and metal processing solutions improve material efficiency for structural and heavy industrial applications. Modern process controls reduce scrap rates, optimize furnace energy use, and support lower-emission manufacturing outcomes.",
    },
    {
      image: "/renewable.jpg",
      title: "Renewable Energy",
      desc: "Integrated solar, wind, and hybrid renewable systems deliver stable low-carbon power for industrial demand profiles. Smart load balancing and storage coordination improve reliability while reducing dependence on fossil-based electricity.",
    },
    {
      image: "/water.jpg",
      title: "Water Treatment",
      desc: "Industrial water purification and recycling technologies enable safer discharge and high reuse ratios across operations. Continuous monitoring and treatment optimization reduce freshwater intake while improving compliance with environmental standards.",
    },
    {
      image: "/cc.jpg",
      title: "Carbon Capture",
      desc: "Carbon capture programs identify, separate, and manage process emissions from high-impact operations. Coupled with verified offsets and reporting frameworks, they accelerate progress toward climate-neutral targets and ESG commitments.",
    },
    {
      image: "/sm.jpg",
      title: "Smart Manufacturing",
      desc: "IoT-enabled smart factory architecture uses real-time analytics to optimize throughput, quality, and energy consumption. Predictive insights reduce downtime, improve asset utilization, and support data-driven sustainability decisions.",
    },
  ];

  const services = [
    {
      icon: <FaGlobe style={{ color: "#3b82f6" }} />,
      title: "Carbon Marketplace and Portfolio",
      desc: "Source and trade verified carbon credits, compare project quality, and track portfolio performance across registries.",
      highlighted: false,
    },
    {
      icon: <FaShieldHeart style={{ color: "#0ea5e9" }} />,
      title: "Carbon Project Feasibility",
      desc: "Evaluate baselines, additionality, investment needs, and expected credit yield before committing to project development.",
      highlighted: false,
    },
    {
      icon: <FaLeaf style={{ color: "#22c55e" }} />,
      title: "Sustainability Asset Management",
      desc: "Manage renewable, efficiency, and nature-based assets with lifecycle tracking, KPI monitoring, and audit-ready records.",
      highlighted: true,
    },
    {
      icon: <FaBookOpen style={{ color: "#ef4444" }} />,
      title: "ESG and Compliance",
      desc: "Align disclosures with ESG frameworks and compliance mandates using structured evidence, controls, and reporting workflows.",
      highlighted: false,
    },
    {
      icon: <HiMiniChartBar style={{ color: "#f59e0b" }} />,
      title: "MRV",
      desc: "Implement Measurement, Reporting, and Verification pipelines for accurate emissions accounting and third-party validation.",
      highlighted: true,
    },
    {
      icon: <FaClock style={{ color: "#6b7280" }} />,
      title: "Methodology and Registry Advisory",
      desc: "Select suitable methodologies and registry pathways to streamline validation, issuance, and long-term project governance.",
      highlighted: false,
    },
  ];

  const organisationAnnouncements = [
    {
      date: "Feb 16, 2026",
      tag: "POLICY",
      tagClass: "hp-tag-feature",
      title: "New Corporate ESG Reporting Templates Added",
      desc: "Organisations can now generate pre-formatted quarterly ESG reports aligned with global disclosure frameworks.",
    },
    {
      date: "Feb 11, 2026",
      tag: "FEATURE",
      tagClass: "hp-tag-update",
      title: "Industrial Monitoring Dashboard Expanded",
      desc: "Track water use, energy load, and emissions intensity from a unified operations dashboard in near real time.",
    },
    {
      date: "Feb 6, 2026",
      tag: "INTEGRATION",
      tagClass: "hp-tag-community",
      title: "ERP Data Connectors Released",
      desc: "New integrations with enterprise ERP systems let teams sync production and utility data automatically.",
    },
    {
      date: "Jan 29, 2026",
      tag: "UPDATE",
      tagClass: "hp-tag-update",
      title: "Supplier Emissions Mapping Improved",
      desc: "Scope 3 supplier-level emission mapping now includes trend tracking and category-level benchmarking.",
    },
    {
      date: "Jan 22, 2026",
      tag: "COMPLIANCE",
      tagClass: "hp-tag-feature",
      title: "Audit Trail Module Introduced",
      desc: "A new audit trail provides verifiable change history for operational sustainability data and reports.",
    },
    {
      date: "Jan 14, 2026",
      tag: "FEATURE",
      tagClass: "hp-tag-feature",
      title: "Multi-Site Goal Management Is Live",
      desc: "Set site-wise reduction goals, assign owners, and compare progress across plants and business units.",
    },
  ];

  const organisationFaqs = [
    {
      q: "How can an organisation get started on the platform?",
      a: "Create an organisation account, add your facilities or teams, then connect operational data sources to begin baseline tracking.",
    },
    {
      q: "Does the platform support multi-site operations?",
      a: "Yes. You can manage multiple sites, assign local owners, and compare sustainability performance across units from one dashboard.",
    },
    {
      q: "Can we track Scope 1, 2, and 3 emissions?",
      a: "Yes. The platform supports all three scopes with configurable activity data inputs and reporting views for internal and external use.",
    },
    {
      q: "How do compliance and audit workflows work?",
      a: "Every major data update is logged with timestamps and user metadata, so audit teams can validate and trace reporting changes.",
    },
    {
      q: "Can our teams collaborate on targets and initiatives?",
      a: "Yes. You can assign sustainability goals, track initiatives, and monitor completion status across departments and locations.",
    },
  ];

  const maxOrgCarouselIndex = Math.max(
    0,
    organisationSolutions.length - orgVisibleCount,
  );

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 768) {
        setOrgVisibleCount(1);
        return;
      }
      if (window.innerWidth <= 1024) {
        setOrgVisibleCount(2);
        return;
      }
      setOrgVisibleCount(3);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  useEffect(() => {
    if (orgCarouselIndex > maxOrgCarouselIndex) {
      setOrgCarouselIndex(maxOrgCarouselIndex);
    }
  }, [orgCarouselIndex, maxOrgCarouselIndex]);

  const moveOrgCarouselPrev = () => {
    setOrgCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const moveOrgCarouselNext = () => {
    setOrgCarouselIndex((prev) => Math.min(maxOrgCarouselIndex, prev + 1));
  };

  const getServiceRelativeIndex = (index) => {
    let relativeIndex = index - servicesCarouselIndex;
    const total = services.length;

    if (relativeIndex > total / 2) relativeIndex -= total;
    if (relativeIndex < -total / 2) relativeIndex += total;

    return relativeIndex;
  };

  const moveServicesPrev = () => {
    setServicesCarouselIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const moveServicesNext = () => {
    setServicesCarouselIndex((prev) => (prev + 1) % services.length);
  };

  useEffect(() => {
    if (isServicesHovered) return undefined;

    const intervalId = setInterval(() => {
      setServicesCarouselIndex((prev) => (prev + 1) % services.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, [isServicesHovered, services.length]);

  return (
    <div className="hp-root">
      <section className="hp-hero hp-hero-organisation">
        <video
          className="hp-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source
            src="https://isorepublic.com/wp-content/uploads/2018/06/isorepublic-free-video-wind-turbine-sunrise.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hp-hero-overlay" />
        <div className="hp-hero-content hp-tab-switch-anim">
          <h1 className="hp-hero-title">
            Developing Verified
            <br />
            Carbon Credit <span className="hp-green-text">Projects</span>
          </h1>
          <p className="hp-hero-desc">
            End-to-end carbon project structuring, documentation, and
            certification support aligned with globally recognised standards.
          </p>
          {!authLoading && !isAuthenticated && (
            <div className="hp-hero-btns">
              <button
                className="hp-btn-primary hp-hero-start-btn"
                onClick={() =>
                  navigate("/industrial", {
                    state: { openDemo: true, demoIndustry: "Industrial Solutions" },
                  })
                }
              >
                Book Free Feasibility Review <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="hp-section hp-rewards-section">
        <div className="hp-section-header">
          <div className="hp-experience-row">
            <p className="hp-user-org-question">Choose your experience</p>
            <div className="hp-tab-switcher hp-tab-switcher-inline">
              <button className="hp-tab-btn" onClick={() => navigate("/experience/user")}>
                User
              </button>
              <button
                className="hp-tab-btn hp-tab-active"
                onClick={() => navigate("/experience/organisation")}
              >
                Organisation
              </button>
            </div>
          </div>
        </div>

        <div className="hp-org-apply-card">
          <div className="hp-org-apply-icon-wrap">
            <FaShieldHeart className="hp-org-apply-icon" />
          </div>
          <div className="hp-org-apply-content">
            <p className="hp-org-apply-eyebrow">Organisation Onboarding</p>
            <h3 className="hp-org-apply-title">
              Schedule a Carbon Project Consultation
            </h3>
            <p className="hp-org-apply-desc">
              Register your organisation to access verified sustainability workflows,
              team dashboards, and enterprise carbon reporting tools in one place.
            </p>
          </div>
          <button
            className="hp-btn-primary hp-org-apply-btn"
            onClick={() => navigate("/join-organisation")}
          >
            Schedule Consultation <FaArrowRight />
          </button>
        </div>

        <div className="hp-section-header hp-org-solutions-header">
          <h2 className="hp-section-title hp-rewards-title">
            <FaGlobe className="hp-title-icon" style={{ color: "#0ea5e9" }} />
            Industrial Solutions & Strategic Carbon Advisory
          </h2>
          <p className="hp-section-sub">
            Comprehensive sustainability-focused solutions designed for industrial
            operations
          </p>
        </div>

        <div className="hp-org-solutions-carousel">
          <button
            type="button"
            className="hp-org-carousel-btn"
            onClick={moveOrgCarouselPrev}
            disabled={orgCarouselIndex === 0}
            aria-label="Previous solutions"
          >
            <FaChevronLeft />
          </button>

          <div className="hp-org-solutions-viewport">
            <div
              className="hp-org-solutions-track"
              style={{
                transform: `translateX(-${(orgCarouselIndex * 100) / orgVisibleCount}%)`,
              }}
            >
              {organisationSolutions.map((solution, i) => (
                <div className="hp-org-solution-slide" key={i}>
                  <div className="hp-org-solution-card">
                    <div className="hp-org-solution-top">
                      <img
                        src={solution.image}
                        alt={solution.title}
                        className="hp-org-solution-image"
                        loading="lazy"
                      />
                    </div>
                    <div className="hp-org-solution-body">
                      <h3 className="hp-org-solution-title">{solution.title}</h3>
                      <p className="hp-org-solution-desc">{solution.desc}</p>
                      <button
                        className="hp-org-solution-learn"
                        onClick={() => navigate("/industrial")}
                      >
                        Learn More <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="hp-org-carousel-btn"
            onClick={moveOrgCarouselNext}
            disabled={orgCarouselIndex === maxOrgCarouselIndex}
            aria-label="Next solutions"
          >
            <FaChevronRight />
          </button>
        </div>
      </section>

      <section className="hp-section hp-services-section">
        <div className="hp-section-header">
          <h2 className="hp-section-title hp-dark-title">Our Services</h2>
          <p className="hp-section-sub">
            Tools and resources to empower your sustainable journey
          </p>
        </div>

        <div className="hp-org-services-carousel">
          <button
            type="button"
            className="hp-org-services-arrow"
            onClick={moveServicesPrev}
            aria-label="Previous service"
          >
            <FaChevronLeft />
          </button>

          <div
            className="hp-org-services-stage"
            onMouseEnter={() => setIsServicesHovered(true)}
            onMouseLeave={() => setIsServicesHovered(false)}
          >
            {services.map((s, i) => {
              const relative = getServiceRelativeIndex(i);
              const positionClass =
                relative === 0
                  ? "is-center"
                  : relative === -1
                    ? "is-left"
                    : relative === 1
                      ? "is-right"
                      : "is-hidden";

              return (
                <div className={`hp-org-services-item ${positionClass}`} key={s.title}>
                  <div
                    className={`hp-service-card hp-org-service-card ${s.highlighted ? "hp-service-highlighted" : ""}`}
                  >
                    <div className="hp-service-icon-wrap">
                      <span className="hp-service-icon">{s.icon}</span>
                    </div>
                    <h3 className="hp-service-title">{s.title}</h3>
                    <p className="hp-service-desc">{s.desc}</p>
                    <a className="hp-learn-more" href="#">
                      Learn more <FaArrowRight />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="hp-org-services-arrow"
            onClick={moveServicesNext}
            aria-label="Next service"
          >
            <FaChevronRight />
          </button>
        </div>
      </section>

      <section className="hp-section hp-announcements-section">
        <div className="hp-section-header">
          <h2 className="hp-section-title hp-dark-title">
            <FaBullhorn className="hp-title-icon" style={{ color: "#3b82f6" }} />
            Updates and Announcements
          </h2>
          <p className="hp-section-sub hp-tab-switch-anim">
            Stay informed about features and updates for enterprise sustainability
            operations
          </p>
        </div>
        <div className="hp-announcements-list hp-tab-switch-anim">
          {organisationAnnouncements.map((a, i) => (
            <div className="hp-announcement-row" key={i}>
              <div className="hp-announcement-dot" />
              <div className="hp-announcement-card">
                <div className="hp-announcement-meta">
                  <span className="hp-announcement-date">
                    <FaClock style={{ color: "#22c55e" }} />
                    {a.date}
                  </span>
                  <span className={`hp-tag ${a.tagClass}`}>{a.tag}</span>
                </div>
                <h3 className="hp-announcement-title">{a.title}</h3>
                <p className="hp-announcement-desc">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="hp-section hp-about-section">
        <div className="hp-about-inner">
          <div className="hp-about-icon-wrap">
            <span className="hp-about-icon">
              <FaGlobe style={{ color: "#2563eb" }} />
            </span>
          </div>
          <div className="hp-about-text">
            <h2 className="hp-about-title">About Us</h2>
            <p className="hp-about-desc">
              We specialise in developing structured carbon credit projects for
              industrial and renewable sectors. Our focus is on transparent
              documentation, realistic projections, and registry-aligned
              methodologies to help organisations unlock carbon as a strategic
              asset.
            </p>
            <button className="hp-btn-primary" onClick={() => navigate("/about")}>
              Know More <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      <section className="hp-section hp-faq-section">
        <div className="hp-section-header">
          <h2 className="hp-section-title hp-dark-title">
            Frequently Asked Questions
          </h2>
          <p className="hp-section-sub hp-tab-switch-anim">
            Everything you need to know for your organisation setup and operations
          </p>
        </div>
        <div className="hp-faq-list hp-tab-switch-anim">
          {organisationFaqs.map((f, i) => (
            <div
              className="hp-faq-item"
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="hp-faq-question">
                <span>{f.q}</span>
                <span className="hp-faq-chevron">
                  {openFaq === i ? (
                    <FaChevronUp style={{ color: "#22c55e" }} />
                  ) : (
                    <FaChevronDown style={{ color: "#22c55e" }} />
                  )}
                </span>
              </div>
              {openFaq === i && <p className="hp-faq-answer">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeOrganisation;
