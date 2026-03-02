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
  FaBullhorn,
  FaGlobe,
  FaLeaf,
  FaShieldHeart,
  FaUserGroup,
} from "react-icons/fa6";
import { GiChemicalDrop, GiRecycle } from "react-icons/gi";
import { HiMiniChartBar } from "react-icons/hi2";
import "@features/user/styles/HomeUser.css";

const HomeUser = () => {
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

  return (
    <div className="hp-root">
      <section className="hp-hero hp-hero-user">
        <video
          className="hp-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/homeanimation.mp4" type="video/mp4" />
        </video>
        <div className="hp-hero-overlay" />
        <div className="hp-hero-content hp-tab-switch-anim">
          <h1 className="hp-hero-title">
            Building a
            <br />
            Sustainable <span className="hp-green-text">Future</span>
          </h1>
          <p className="hp-hero-desc">
            Join us in creating a better world through sustainable development
            practices and environmental consciousness.
          </p>
          {!authLoading && !isAuthenticated && (
            <div className="hp-hero-btns">
              <button
                className="hp-btn-primary hp-hero-start-btn"
                onClick={() => navigate("/signup")}
              >
                Get Started <FaArrowRight />
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
              <button className="hp-tab-btn hp-tab-active" onClick={() => navigate("/experience/user")}>
                User
              </button>
              <button className="hp-tab-btn" onClick={() => navigate("/experience/organisation")}>
                Organisation
              </button>
            </div>
          </div>
          <div className="hp-tab-switch-anim">
            <h2 className="hp-section-title hp-rewards-title">
              <FaAward className="hp-title-icon" style={{ color: "#f59e0b" }} />
              Join Contest,Earn Rewards
            </h2>
            <p className="hp-section-sub">
              Redeem your hard-earned coins for real-world impact
            </p>
          </div>
        </div>
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
          <p className="hp-section-sub hp-tab-switch-anim">
            Stay in the loop with everything happening on the platform
          </p>
        </div>
        <div className="hp-announcements-list hp-tab-switch-anim">
          {userAnnouncements.map((a, i) => (
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
            Everything you need to know about the platform
          </p>
        </div>
        <div className="hp-faq-list hp-tab-switch-anim">
          {userFaqs.map((f, i) => (
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

export default HomeUser;
