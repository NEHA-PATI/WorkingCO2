import React, { useState } from "react";
import "../styles/user/CaseStudy.css";

/**
 * CaseStudy.jsx
 * Single-page React component that recreates the 5 screenshots in sequence:
 * 1. Hero / Project Overview
 * 2. Impact Summary / Project Story
 * 3. Timeline
 * 4. Testimonials
 * 5. Related Case Studies + share CTA
 *
 * All class names are prefixed with caseStudy- to avoid collisions.
 *
 * Buttons use dummy navigation via window.location.href or simple JS actions.
 */

const stats = [
  { title: "CO₂ OFFSET", value: "12,000 tons" },
  { title: "TREES PLANTED", value: "500,000" },
  { title: "RENEWABLE ENERGY", value: "8.2M kWh" },
  { title: "COMMUNITIES IMPACTED", value: "24" },
];

const timelineItems = [
  {
    id: 1,
    date: "Jan 2022",
    title: "Project Kickoff",
    desc:
      "Baseline carbon assessment and stakeholder alignment. We engaged local partners to ensure continuity and capacity building while monitoring biodiversity with satellite data.",
  },
  {
    id: 2,
    date: "Apr 2022",
    title: "Implementation",
    desc: "Tree planting and solar microgrid installation phase.",
  },
  {
    id: 3,
    date: "Dec 2022",
    title: "Key Achievements",
    desc: "Reached 12k tons CO₂ offset; 500k+ trees planted.",
  },
  {
    id: 4,
    date: "Aug 2023",
    title: "Completion",
    desc: "Ongoing monitoring and community training complete.",
  },
];

const testimonials = [
  {
    name: "Amina N.",
    role: "Community Leader",
    text:
      "Energy access transformed our clinic—refrigeration for vaccines and evening care are now possible.",
  },
  {
    name: "Jonas P.",
    role: "Project Manager",
    text:
      "We tracked survival rates rigorously. The microgrid reliability exceeded 99% after phase two.",
  },
  {
    name: "GreenRoots NGO",
    role: "Partner Organization",
    text:
      "The carbon sequestration results are transparent and verifiable—setting a new benchmark.",
  },
];

const related = [
  { id: "solar", title: "Solar for Schools", loc: "Ghana" },
  { id: "mangrove", title: "Mangrove Revival", loc: "Indonesia" },
  { id: "biogas", title: "Community Biogas", loc: "India" },
  { id: "savanna", title: "Savanna Restoration", loc: "Tanzania" },
];

export default function CaseStudy() {
  const [activeTimeline, setActiveTimeline] = useState(timelineItems[0].id);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const handleReadReport = () => {
    window.location.href = "/read-report"; // dummy route
  };

  const handleShare = async () => {
    const shareData = {
      title: "Green Valley Reforestation - Case Study",
      text: "Check out this case study.",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        alert("Share canceled.");
      }
    } else {
      // fallback: copy link
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch {
        alert("Unable to copy link. URL: " + window.location.href);
      }
    }
  };

  const handlePlayVideo = () => {
    alert("Play video — replace with modal or video player.");
  };

  const openCase = (id) => {
    // dummy navigation to a case detail
    window.location.href = `/case/${id}`;
  };

  return (
    <div className="caseStudy-page">
      {/* NAVBAR */}
      <header className="caseStudy-navbar">
        <div className="caseStudy-navbar-left">
          <div className="caseStudy-logo">
            <div className="caseStudy-logo-icon">🍃</div>
            <span className="caseStudy-brand">EcoImpact</span>
          </div>
        </div>
        <nav className="caseStudy-nav">
          <a href="#overview">Overview</a>
          <a href="#impact">Impact</a>
          <a href="#story">Story</a>
          <a href="#timeline">Timeline</a>
          <a href="#media">Media</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#reports">Reports</a>
        </nav>
        <div className="caseStudy-navbar-right">
          <select className="caseStudy-filter">
            <option>All</option>
          </select>
          <button
            className="caseStudy-downloadBtn"
            onClick={() => (window.location.href = "/download-report")}
          >
            Download Report
          </button>
        </div>
      </header>

      {/* BREADCRUMB + HERO */}
      <section className="caseStudy-hero" id="overview">
        <div className="caseStudy-breadcrumb">
          Home / Case Studies / <span>Green Valley Reforestation</span>
        </div>

        <h1 className="caseStudy-mainTitle">
          Our Impact Stories – Carbon Positive Case Studies
        </h1>
        <p className="caseStudy-subtitle">
          Real-world results from our sustainability initiatives.
        </p>

        <div className="caseStudy-heroContent">
          <div className="caseStudy-heroImage">
            {/* replace with real project image */}
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop"
              alt="project"
            />
          </div>

          <aside className="caseStudy-overviewPanel" id="impact">
            <div className="caseStudy-metaRow">
              <span>🌱 Green Valley Project</span>
              <span>📍 Kenya, East Africa</span>
              <span>⏱ 20 months</span>
            </div>

            <h2>Project Overview</h2>
            <p className="caseStudy-overviewText">
              A multi-village reforestation and renewable energy initiative
              designed to create long-term carbon sinks and energy access for
              remote communities.
            </p>

            <div className="caseStudy-statsGrid">
              {stats.map((s, i) => (
                <div className="caseStudy-statCard" key={i}>
                  <div className="caseStudy-statIcon">🌿</div>
                  <div className="caseStudy-statText">
                    <div className="caseStudy-statTitle">{s.title}</div>
                    <div className="caseStudy-statValue">{s.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="caseStudy-ctaRow">
              <button className="caseStudy-btn primary" onClick={handleReadReport}>
                Read Full Report
              </button>
              <button className="caseStudy-btn ghost" onClick={handleShare}>
                Share
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* IMPACT SUMMARY & PROJECT STORY */}
      <section className="caseStudy-impactStory">
        <div className="caseStudy-impactSummary">
          <h3>Impact Summary</h3>
          <div className="caseStudy-impactCards">
            {stats.map((s, i) => (
              <div className="caseStudy-impactCard" key={i}>
                <div className="caseStudy-impactIcon">🌱</div>
                <div>
                  <div className="caseStudy-impactLabel">{s.title}</div>
                  <div className="caseStudy-impactValue">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="caseStudy-storyAndGallery" id="story">
          <div className="caseStudy-projectStory">
            <h3>Project Story</h3>
            <p>
              Starting as a grassroots movement to combat rapid deforestation,
              the project united local communities, NGOs, and renewable energy
              experts. While logistics and seasonal drought posed challenges, a
              phased approach ensured survival rates above 85% and reliable
              microgrid uptime.
            </p>
            <p>
              Outcome: a thriving canopy recovery, measurable CO₂ sequestration,
              and inclusive access to clean energy—powering schools, clinics,
              and small businesses.
            </p>

            <div className="caseStudy-beforeAfter">
              <h4>Before & After</h4>
              <img
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=70&auto=format&fit=crop"
                alt="before after"
              />
            </div>
          </div>

          <aside className="caseStudy-gallery">
            <div className="caseStudy-galleryHeader">Project Gallery</div>
            <div className="caseStudy-galleryImage">
              <img
                src={[
                  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop",
                ][galleryIndex % 2]}
                alt="gallery"
              />
            </div>
            <div className="caseStudy-galleryControls">
              <button
                onClick={() => setGalleryIndex((g) => Math.max(0, g - 1))}
                aria-label="prev"
              >
                ◀
              </button>
              <button onClick={() => setGalleryIndex((g) => g + 1)} aria-label="next">
                ▶
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* VIDEO BANNER */}
      <section className="caseStudy-videoBanner" id="media">
        <div className="caseStudy-videoInner">
          <button className="caseStudy-playBtn" onClick={handlePlayVideo}>
            ▶ Play Video
          </button>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="caseStudy-timeline" id="timeline">
        <h3>Timeline</h3>

        <div className="caseStudy-timelineStrip">
          {timelineItems.map((t) => (
            <div
              key={t.id}
              className={`caseStudy-timeCard ${
                activeTimeline === t.id ? "active" : ""
              }`}
              onClick={() => setActiveTimeline(t.id)}
            >
              <div className="caseStudy-timeDate">{t.date}</div>
              <div className="caseStudy-timeTitle">{t.title}</div>
            </div>
          ))}
        </div>

        <div className="caseStudy-timelineDetail">
          {timelineItems
            .filter((i) => i.id === activeTimeline)
            .map((t) => (
              <div key={t.id}>
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </div>
            ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="caseStudy-testimonials" id="testimonials">
        <h3>Testimonials</h3>
        <div className="caseStudy-testGrid">
          {testimonials.map((t, i) => (
            <div className="caseStudy-testCard" key={i}>
              <div className="caseStudy-testHeader">
                <div className="caseStudy-avatar">{t.name[0]}</div>
                <div>
                  <div className="caseStudy-testName">{t.name}</div>
                  <div className="caseStudy-testRole">{t.role}</div>
                </div>
              </div>
              <p className="caseStudy-quote">“{t.text}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* RELATED CASE STUDIES */}
      <section className="caseStudy-related">
        <h3>Related Case Studies</h3>
        <div className="caseStudy-relatedGrid">
          {related.map((r) => (
            <div className="caseStudy-relatedCard" key={r.id}>
              <img
                src={`https://picsum.photos/seed/${r.id}/600/360`}
                alt={r.title}
              />
              <div className="caseStudy-relatedBody">
                <div className="caseStudy-relatedTag">Reforestation</div>
                <div className="caseStudy-relatedTitle">{r.title}</div>
                <div className="caseStudy-relatedLoc">{r.loc}</div>
                <button
                  className="caseStudy-btn primary small"
                  onClick={() => openCase(r.id)}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHARE CTA */}
      <section className="caseStudy-shareCTA">
        <div className="caseStudy-shareInner">
          <div>
            <h4>Share this Case Study</h4>
            <p>Spread the word and inspire more climate action.</p>
          </div>
          <div className="caseStudy-shareBtns">
            <button onClick={() => (window.location.href = "https://twitter.com/")}>
              Twitter
            </button>
            <button onClick={() => (window.location.href = "https://linkedin.com/")}>
              LinkedIn
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="caseStudy-footer">
        <div>© {new Date().getFullYear()} EcoImpact</div>
        <div className="caseStudy-footerLinks">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </footer>
    </div>
  );
}