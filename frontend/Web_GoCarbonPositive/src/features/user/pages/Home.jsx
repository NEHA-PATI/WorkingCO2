import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@contexts/AuthContext";
import {
  FaArrowRight,
  FaAward,
  FaBookOpen,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaCoins,
  FaGift,
  FaGlobe,
  FaLeaf,
  FaBullhorn,
  FaShieldHeart,
  FaUserGroup,
} from "react-icons/fa6";
import { GiChemicalDrop, GiRecycle } from "react-icons/gi";
import { HiMiniChartBar } from "react-icons/hi2";
import "../styles/Home.css";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useAuth();

  const rewards = [
    {
      icon: <FaLeaf style={{ color: "#16a34a" }} />,
      title: "Complete tasks",
      desc: "Do various tasks to earn points",
      
    },
    {
      icon: <FaShieldHeart style={{ color: "#ec4899" }} />,
      title: "Eco Badge",
      desc: "Get badges for your consistency",
      
    },
    {
      icon: <FaGift style={{ color: "#f97316" }} />,
      title: "Win exclusive rewards",
      desc: "Get internship, expert consulting , and goodies ",
      
    },
    {
      icon: <GiRecycle style={{ color: "#14b8a6" }} />,
      title: "Streak Points",
      desc: "Stay consistent and Earn more points ",
      
    },
  ];

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
      icon: <GiChemicalDrop style={{ color: "#2563eb" }} />,
      image: "/steel.jpg",
      title: "Steel and Metal",
      desc: "Advanced steel and metal processing solutions improve material efficiency for structural and heavy industrial applications. Modern process controls reduce scrap rates, optimize furnace energy use, and support lower-emission manufacturing outcomes.",
    },
    {
      icon: <FaLeaf style={{ color: "#16a34a" }} />,
      image: "/renewable.jpg",
      title: "Renewable Energy",
      desc: "Integrated solar, wind, and hybrid renewable systems deliver stable low-carbon power for industrial demand profiles. Smart load balancing and storage coordination improve reliability while reducing dependence on fossil-based electricity.",
    },
    {
      icon: <FaShieldHeart style={{ color: "#06b6d4" }} />,
      image: "/water.jpg",
      title: "Water Treatment",
      desc: "Industrial water purification and recycling technologies enable safer discharge and high reuse ratios across operations. Continuous monitoring and treatment optimization reduce freshwater intake while improving compliance with environmental standards.",
    },
    {
      icon: <FaGlobe style={{ color: "#0f766e" }} />,
      image: "/cc.jpg",
      title: "Carbon Capture",
      desc: "Carbon capture programs identify, separate, and manage process emissions from high-impact operations. Coupled with verified offsets and reporting frameworks, they accelerate progress toward climate-neutral targets and ESG commitments.",
    },
    {
      icon: <HiMiniChartBar style={{ color: "#4f46e5" }} />,
      image: "/sm.jpg",
      title: "Smart Manufacturing",
      desc: "IoT-enabled smart factory architecture uses real-time analytics to optimize throughput, quality, and energy consumption. Predictive insights reduce downtime, improve asset utilization, and support data-driven sustainability decisions.",
    },
  ];

  const services = [
    {
      icon: <GiChemicalDrop style={{ color: "#8b5cf6" }} />,
      title: "Carbon Footprint Calculator",
      desc: "Measure your personal or organisational carbon footprint with our AI-powered calculator. Get detailed breakdowns and actionable insights.",
      highlighted: false,
    },
    {
      icon: <HiMiniChartBar style={{ color: "#0ea5e9" }} />,
      title: "Sustainability Analytics",
      desc: "Track your green journey with real-time dashboards. Visualise your impact over time and benchmark against peers.",
      highlighted: false,
    },
    {
      icon: <FaLeaf style={{ color: "#22c55e" }} />,
      title: "Tree Planting Campaigns",
      desc: "Participate in community-driven tree planting initiatives. Every coin you redeem plants a real tree somewhere in the world.",
      highlighted: true,
    },
    {
      icon: <FaGlobe style={{ color: "#3b82f6" }} />,
      title: "Carbon Offset Marketplace",
      desc: "Browse verified carbon offset projects and invest your coins towards real environmental change across the globe.",
      highlighted: false,
    },
    {
      icon: <FaUserGroup style={{ color: "#f59e0b" }} />,
      title: "Community Challenges",
      desc: "Join group challenges to reduce carbon emissions together. Compete, collaborate, and make a collective difference.",
      highlighted: true,
    },
    {
      icon: <FaBookOpen style={{ color: "#ef4444" }} />,
      title: "Green Learning Hub",
      desc: "Access curated articles, courses, and resources on sustainability. Earn bonus points while you learn about the planet.",
      highlighted: false,
    },
  ];

  const userAnnouncements = [
    {
      date: "Feb 15, 2026",
      tag: "REWARD",
      tagClass: "hp-tag-reward",
      title: "New Streak Rewards Unlocked!",
      desc: "We have added 28-day mega streak bonuses. Stay consistent and earn up to +100 bonus points.",
    },
    {
      date: "Feb 10, 2026",
      tag: "FEATURE",
      tagClass: "hp-tag-feature",
      title: "Carbon Calculator v2.0 Released",
      desc: "Our calculator now supports Scope 3 emissions tracking for organisations. Try it today.",
    },
    {
      date: "Feb 5, 2026",
      tag: "COMMUNITY",
      tagClass: "hp-tag-community",
      title: "Global Tree Planting Challenge Launched",
      desc: "Join over 10,000 users worldwide in our biggest community challenge yet. Plant 1 million trees by March 2026.",
    },
    {
      date: "Jan 28, 2026",
      tag: "UPDATE",
      tagClass: "hp-tag-update",
      title: "New Carbon Offset Marketplace Partners",
      desc: "We have onboarded 15 new verified carbon offset projects across Asia, Africa, and South America.",
    },
    {
      date: "Jan 20, 2026",
      tag: "FEATURE",
      tagClass: "hp-tag-feature",
      title: "Organisation Dashboard 2.0 Is Here",
      desc: "Companies can now manage team sustainability goals, view collective impact reports, and assign challenges to employees.",
    },
    {
      date: "Jan 12, 2026",
      tag: "REWARD",
      tagClass: "hp-tag-reward",
      title: "Eco Badge Collection Expanded",
      desc: "We have added 10 new exclusive eco badges to collect. Unlock them by completing special sustainability missions.",
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

  const userFaqs = [
    {
      q: "What is a carbon footprint?",
      a: "A carbon footprint is the total amount of greenhouse gases, particularly CO2, emitted directly or indirectly by an individual, organisation, event, or product.",
    },
    {
      q: "How do I earn coins?",
      a: "You earn coins by completing eco-friendly actions, daily check-ins, participating in challenges, and learning through our Green Learning Hub.",
    },
    {
      q: "What can I do with my coins?",
      a: "Coins can be redeemed for planting trees, unlocking eco badges, getting gift vouchers from sustainable brands, or offsetting carbon emissions.",
    },
    {
      q: "How does the streak system work?",
      a: "A streak is built by completing at least one eco action every day. The longer your streak, the higher your bonus multipliers and exclusive rewards.",
    },
    {
      q: "Can organisations use this platform?",
      a: "Yes! Organisations have dedicated dashboards, team challenges, Scope 3 emissions tracking, and group reporting tools.",
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

  const activeAnnouncements =
    activeTab === "organisation" ? organisationAnnouncements : userAnnouncements;
  const activeFaqs = activeTab === "organisation" ? organisationFaqs : userFaqs;
  const heroContent =
  activeTab === "organisation"
    ? {
        titleLine1: "Developing Verified",
        titleLine2: "Carbon Credit",
        highlight: "Projects",
        description:
          "End-to-end carbon project structuring, feasibility assessment, and registry-aligned certification support for industrial operations.",
      }
      : {
          titleLine1: "Building a",
          titleLine2: "Sustainable",
          highlight: "Future",
          description:
            "Join us in creating a better world through sustainable development practices and environmental consciousness.",
        };
  return (
    <div className="hp-root">
      <section
        className={`hp-hero ${activeTab === "organisation" ? "hp-hero-organisation" : "hp-hero-user"}`}
      >
        {activeTab === "organisation" && (
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
        )}
        <div className="hp-hero-overlay" />
        <div className="hp-hero-content hp-tab-switch-anim" key={`hero-content-${activeTab}`}>
          <h1 className="hp-hero-title">
            {heroContent.titleLine1}
            <br />
            {heroContent.titleLine2}{" "}
            <span className="hp-green-text">{heroContent.highlight}</span>
          </h1>
          <p className="hp-hero-desc">{heroContent.description}</p>
          {!authLoading && !isAuthenticated && (
            <>
              <div className="hp-hero-btns">
                {activeTab === "organisation" ? (
  <button
    className="hp-btn-primary hp-hero-start-btn"
    onClick={() => navigate("/contact")}
  >
    Book Free Feasibility Review <FaArrowRight />
  </button>
) : (
  <button
    className="hp-btn-primary hp-hero-start-btn"
    onClick={() => navigate("/signup")}
  >
    Get Started <FaArrowRight />
  </button>
)}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="hp-section hp-rewards-section">
        <div className="hp-section-header">
          <div className="hp-experience-row">
            <p className="hp-user-org-question">Choose your experience</p>
            <div className="hp-tab-switcher hp-tab-switcher-inline">
              <button
                className={`hp-tab-btn ${activeTab === "user" ? "hp-tab-active" : ""}`}
                onClick={() => {
                  setActiveTab("user");
                  setOpenFaq(null);
                }}
              >
               Individual
              </button>
              <button
                className={`hp-tab-btn ${activeTab === "organisation" ? "hp-tab-active" : ""}`}
                onClick={() => {
                  setActiveTab("organisation");
                  setOpenFaq(null);
                }}
              >
                Organisation
              </button>
            </div>
          </div>
          <div className="hp-tab-switch-anim" key={`rewards-header-${activeTab}`}>
            {activeTab !== "organisation" && (
              <>
                <h2 className="hp-section-title hp-rewards-title">
                  <FaAward className="hp-title-icon" style={{ color: "#f59e0b" }} />
                  Join Contest,Earn Rewards
                </h2>
                <p className="hp-section-sub">
                  Redeem your hard-earned coins for real-world impact
                </p>
              </>
            )}
          </div>
        </div>
        <div className="hp-tab-switch-anim" key={`rewards-content-${activeTab}`}>
          {activeTab === "organisation" && (
            <div className="hp-org-apply-card">
              <div className="hp-org-apply-icon-wrap">
                <FaShieldHeart className="hp-org-apply-icon" />
              </div>
              <div className="hp-org-apply-content">
                <p className="hp-org-apply-eyebrow">Organisation Onboarding</p>
                <h3 className="hp-org-apply-title">
 Request a Carbon Project Consultation
</h3>
                <p className="hp-org-apply-desc">
                  Share your organisation details to begin a structured evaluation of your carbon project potential.
                </p>
              </div>
              <button
                className="hp-btn-primary hp-org-apply-btn"
                onClick={() => navigate("/join-organisation")}
              >
                Request Consultation <FaArrowRight />
              </button>
            </div>
          )}
          {activeTab === "organisation" && (
            <div className="hp-section-header hp-org-solutions-header">
              <h2 className="hp-section-title hp-rewards-title">
                <FaGlobe className="hp-title-icon" style={{ color: "#0ea5e9" }} />
                Industrial Solutions & Strategic Carbon Advisory
              </h2>
              <p className="hp-section-sub">
                Enabling industrial enterprises to reduce emissions, align with global standards, and unlock long-term carbon value.
              </p>
            </div>
          )}
          {activeTab === "organisation" ? (
            <div className="hp-org-solutions-grid">
              {organisationSolutions.map((solution, i) => (
                <div className="hp-org-solution-card" key={i}>
                  <div className="hp-org-solution-top">
                    {solution.image ? (
                      <img
                        src={solution.image}
                        alt={solution.title}
                        className="hp-org-solution-image"
                        loading="lazy"
                      />
                    ) : (
                      <span className="hp-org-solution-icon">{solution.icon}</span>
                    )}
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
              ))}
            </div>
          ) : (
            <div className="hp-rewards-grid">
              {rewards.map((r, i) => (
                <div className="hp-reward-card" key={i}>
                  <div className="hp-reward-icon-wrap">
                    <span className="hp-reward-icon">{r.icon}</span>
                  </div>
                  <h3 className="hp-reward-title">{r.title}</h3>
                  <p className="hp-reward-desc">{r.desc}</p>
                  <span className="hp-coins-badge">
                    <FaCoins style={{ color: "#eab308" }} />
                    {r.coins}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="hp-section hp-services-section">
        <div className="hp-section-header">
          <h2 className="hp-section-title hp-dark-title">Our Services</h2>
          <p className="hp-section-sub">
            Tools and resources to empower your sustainable journey
          </p>
        </div>
        <div className="hp-services-grid">
          {services.map((s, i) => (
            <div
              className={`hp-service-card ${s.highlighted ? "hp-service-highlighted" : ""}`}
              key={i}
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
          ))}
        </div>
      </section>

      <section className="hp-section hp-announcements-section">
        <div className="hp-section-header">
          <h2 className="hp-section-title hp-dark-title">
            <FaBullhorn className="hp-title-icon" style={{ color: "#3b82f6" }} />
            Updates and Announcements
          </h2>
          <p className="hp-section-sub hp-tab-switch-anim" key={`ann-sub-${activeTab}`}>
            {activeTab === "organisation"
              ? "Stay informed about features and updates for enterprise sustainability operations"
              : "Stay in the loop with everything happening on the platform"}
          </p>
        </div>
        <div className="hp-announcements-list hp-tab-switch-anim" key={`ann-list-${activeTab}`}>
          {activeAnnouncements.map((a, i) => (
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
  We specialise in developing structured carbon credit projects for industrial and renewable sectors. 
  Our focus is on transparent documentation, realistic projections, and registry-aligned methodologies 
  to help organisations unlock carbon as a strategic asset.
</p>
            <button className="hp-btn-primary" onClick={() => navigate("/about")}>Know More <FaArrowRight />

            </button>
          </div>
        </div>
      </section>

      <section className="hp-section hp-faq-section">
        <div className="hp-section-header">
          <h2 className="hp-section-title hp-dark-title">
            Frequently Asked Questions
          </h2>
          <p className="hp-section-sub hp-tab-switch-anim" key={`faq-sub-${activeTab}`}>
            {activeTab === "organisation"
              ? "Everything you need to know for your organisation setup and operations"
              : "Everything you need to know about the platform"}
          </p>
        </div>
        <div className="hp-faq-list hp-tab-switch-anim" key={`faq-list-${activeTab}`}>
          {activeFaqs.map((f, i) => (
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

export default HomePage;
