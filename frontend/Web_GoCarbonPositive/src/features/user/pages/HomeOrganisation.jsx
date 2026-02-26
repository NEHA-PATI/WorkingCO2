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
  const BLOG_VISIBLE_COUNT = 3;
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
      date: "Mar 20, 2026",
      tag: "BLOG",
      tagClass: "hp-tag-feature",
      title: "New Blog Published: How Enterprises Build Carbon Portfolios",
      desc: "A practical walkthrough on screening high-integrity projects and balancing risk across registry-backed credits.",
    },
    {
      date: "Mar 16, 2026",
      tag: "BLOG",
      tagClass: "hp-tag-feature",
      title: "New Blog Published: MRV That Stands Up to Verification",
      desc: "Key data controls, evidence chains, and QA checks are now documented for stronger audit confidence.",
    },
    {
      date: "Mar 11, 2026",
      tag: "BLOG",
      tagClass: "hp-tag-feature",
      title: "New Blog Published: From ESG Reporting to Action Plans",
      desc: "A new guide explains how teams can convert disclosure requirements into measurable site-level initiatives.",
    },
    {
      date: "Mar 8, 2026",
      tag: "COMMUNITY",
      tagClass: "hp-tag-community",
      title: "Upcoming Community Spotlight: Industry Network",
      desc: "Cross-sector collaboration sessions are now open for enterprises and solution partners.",
    },
    {
      date: "Mar 4, 2026",
      tag: "COMMUNITY",
      tagClass: "hp-tag-community",
      title: "Upcoming Community Spotlight: ESG Leaders Circle",
      desc: "Executive knowledge exchange sessions will focus on governance, reporting strategy, and implementation scale-up.",
    },
    {
      date: "Feb 28, 2026",
      tag: "COMMUNITY",
      tagClass: "hp-tag-community",
      title: "Upcoming Community Spotlight: Climate Action Events",
      desc: "Workshops and live events are scheduled around decarbonisation planning and MRV readiness.",
    },
    {
      date: "Feb 24, 2026",
      tag: "COMMUNITY",
      tagClass: "hp-tag-community",
      title: "Upcoming Community Spotlight: Research and Policy Collaboration",
      desc: "New collaboration tracks align policy, methodology design, and practical on-ground implementation.",
    },
  ];

  const blogHighlights = [
    {
      image: "https://picsum.photos/seed/gocarbon-blog-1/640/360",
      title: "How Enterprises Build Carbon Portfolios",
      excerpt:
        "A practical walkthrough of screening high-integrity projects and balancing risk across registry-backed credits.",
      date: "Mar 2026",
    },
    {
      image: "https://picsum.photos/seed/gocarbon-blog-2/640/360",
      title: "MRV That Stands Up to Verification",
      excerpt:
        "Key data controls, evidence chains, and QA checks that improve audit confidence in emissions reporting.",
      date: "Feb 2026",
    },
    {
      image: "https://picsum.photos/seed/gocarbon-blog-3/640/360",
      title: "From ESG Reporting to Action Plans",
      excerpt:
        "How to translate disclosure requirements into site-level initiatives with measurable outcomes.",
      date: "Feb 2026",
    },
    {
      image: "https://picsum.photos/seed/gocarbon-blog-4/640/360",
      title: "Choosing the Right Methodology and Registry",
      excerpt:
        "A decision framework for methodology fit, issuance timelines, and long-term governance readiness.",
      date: "Jan 2026",
    },
  ];
  const communityHighlights = [
    {
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      title: "Industry Network",
      subtitle: "Cross-Sector Collaboration",
      excerpt:
        "Build partnerships with enterprises, solution providers, and project developers to scale verified sustainability programs across operations.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      title: "ESG Leaders Circle",
      subtitle: "Executive Knowledge Exchange",
      excerpt:
        "Engage with ESG decision-makers to share governance practices, reporting strategies, and implementation models for measurable outcomes.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
      title: "Climate Action Events",
      subtitle: "Workshops and Live Sessions",
      excerpt:
        "Join curated events focused on decarbonisation planning, MRV readiness, and practical pathways to meet climate commitments.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      title: "Research and Policy Collaboration",
      subtitle: "Standards and Policy Alignment",
      excerpt:
        "Collaborate on evidence-based frameworks that connect policy updates, methodology design, and on-ground implementation for industry adoption.",
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
            src="/organimation.mp4"
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
        <div className="hp-org-announcements-layout">
          <div className="hp-org-announcements-primary">
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
          </div>

          <div className="hp-org-announcements-side">
            <aside className="hp-org-blog-panel hp-tab-switch-anim">
              <h3 className="hp-org-blog-title">Blog Posts</h3>
              <div className="hp-org-blog-viewport">
                <div className="hp-org-blog-track hp-org-blog-track-static">
                  {blogHighlights.slice(0, BLOG_VISIBLE_COUNT).map((post) => (
                    <article className="hp-org-blog-card" key={post.title}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="hp-org-blog-image"
                        loading="lazy"
                      />
                      <div className="hp-org-blog-content">
                        <span className="hp-org-blog-date">{post.date}</span>
                        <h4 className="hp-org-blog-card-title">{post.title}</h4>
                        <p className="hp-org-blog-card-desc">{post.excerpt}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="hp-btn-primary hp-org-blog-view-more"
                onClick={() => navigate("/blog")}
              >
                View More <FaArrowRight />
              </button>
            </aside>

            <aside className="hp-org-blog-panel hp-org-community-panel hp-tab-switch-anim">
              <h3 className="hp-org-blog-title">Upcoming Communities</h3>
              <div className="hp-org-blog-viewport hp-org-community-viewport">
                <div className="hp-org-blog-track hp-org-blog-track-static">
                  {communityHighlights.map((post) => (
                    <article className="hp-org-blog-card" key={`community-${post.title}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="hp-org-blog-image"
                        loading="lazy"
                      />
                      <div className="hp-org-blog-content">
                        <h4 className="hp-org-blog-card-title">{post.title}</h4>
                        <p className="hp-org-blog-card-subtitle">{post.subtitle}</p>
                        <p className="hp-org-blog-card-desc">{post.excerpt}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </aside>
          </div>
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
