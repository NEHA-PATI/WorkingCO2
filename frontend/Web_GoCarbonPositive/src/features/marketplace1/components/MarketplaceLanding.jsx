import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileCheck2,
  FlaskConical,
  Leaf,
  LineChart,
  Play,
  Rocket,
  ShieldCheck,
  Sprout,
  Target,
} from "lucide-react";
import MarketplaceNavbar from "./MarketplaceNavbar";
import earthVideo from "../store/earth.mp4";
import verraLogo from "../store/logos/verra-logo.svg";
import goldStandardLogo from "../store/logos/gold-standard-logo.svg";
import puroEarthLogo from "../store/logos/puro-earth-logo.svg";
import icroaLogo from "../store/logos/icroa-logo.png";
import icaoCorsiaLogo from "../store/logos/icao-corsia-logo.svg";
import cdrFyiLogo from "../store/logos/cdr-fyi-logo.svg";
import Footer from "@shared/components/Footer";
import "../styles/marketplace1.css";

const MARKET_SNAPSHOT = [
  { value: "12.8M+", label: "Credits Traded" },
  { value: "530+", label: "Verified Projects" },
  { value: "70", label: "Countries Covered" },
  { value: "99.3%", label: "Traceable Retirements" },
];

const TRUST_MARKERS = [
  "Registry-verified inventory",
  "Transparent retirement trail",
  "Co-benefits visibility",
  "Enterprise-ready reporting",
];

const WHY_POINTS = [
  {
    title: "Bridge residual emissions responsibly",
    description:
      "Use verified credits for hard-to-abate emissions while reduction and electrification plans continue.",
    icon: Leaf,
  },
  {
    title: "Stay ahead of compliance and disclosure",
    description:
      "Structure portfolios with clear project metadata, methodologies, vintages, and retirement evidence.",
    icon: ShieldCheck,
  },
  {
    title: "Fund real-world climate impact",
    description:
      "Direct spending toward projects with measurable climate, biodiversity, and community outcomes.",
    icon: Sprout,
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "STEP-01",
    badge: "Onboarding",
    time: "2-4 Days",
    title: "Initial Project Review",
    description:
      "Submit baseline project information, methodology references, and ownership details for eligibility screening.",
    icon: FileCheck2,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=900",
    color: "#3B6D11",
    background: "#EAF3DE",
    border: "#C0DD97",
  },
  {
    step: "STEP-02",
    badge: "MRV",
    time: "5-8 Days",
    title: "Technical MRV Assessment",
    description:
      "Our climate analysts evaluate additionality, monitoring setup, permanence risk, and reporting quality.",
    icon: FlaskConical,
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=900",
    color: "#185FA5",
    background: "#E6F1FB",
    border: "#B5D4F4",
  },
  {
    step: "STEP-03",
    badge: "Due Diligence",
    time: "3-5 Days",
    title: "Registry & Documentation Validation",
    description:
      "Registry records, verification evidence, and serial-trace checks are validated before listing approval.",
    icon: Target,
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=900",
    color: "#534AB7",
    background: "#EEEDFE",
    border: "#CECBF6",
  },
  {
    step: "STEP-04",
    badge: "Compliance",
    time: "2-3 Days",
    title: "Risk and Integrity Review",
    description:
      "Governance, safeguard coverage, and market integrity checks are finalized for transaction readiness.",
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900",
    color: "#993C1D",
    background: "#FAECE7",
    border: "#F5C4B3",
  },
  {
    step: "STEP-05",
    badge: "Pricing",
    time: "1-2 Days",
    title: "Pricing and Buyer Positioning",
    description:
      "Volume, vintage, co-benefits, and demand signals are used to position the project for buyer discovery.",
    icon: LineChart,
    image: "/renewable.jpg",
    color: "#854F0B",
    background: "#FAEEDA",
    border: "#FAC775",
  },
  {
    step: "STEP-06",
    badge: "Go Live",
    time: "Live",
    title: "Marketplace Listing and Issuance",
    description:
      "Your credits become discoverable in the marketplace with transparent metadata and retirement-ready flow.",
    icon: Rocket,
    image:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=900",
    color: "#0F6E56",
    background: "#E1F5EE",
    border: "#9FE1CB",
  },
];

const SOLUTION_TRACKS = [
  {
    title: "Buy Carbon Credits",
    description:
      "Find high-integrity credits with rich project documentation and market-ready execution support.",
    icon: LineChart,
    cta: "Browse Active Listings",
    action: "browse",
  },
  {
    title: "Sell Carbon Credits",
    description:
      "List validated project volumes, connect with quality buyers, and improve discovery through trusted screening.",
    icon: ShieldCheck,
    cta: "Open Sell Workspace",
    action: "sell",
  },
  {
    title: "Portfolio Solutions",
    description:
      "Build a phased strategy across avoidance, removals, and retirement timing with reporting support.",
    icon: Sprout,
    cta: "Access Buyer Desk",
    action: "login",
  },
];

const PROJECT_CATEGORIES = [
  {
    id: "nature-based-removals",
    title: "Nature-Based Removals",
    subtitle: "Mangroves, afforestation, regenerative landscapes",
    image: "/water.jpg",
  },
  {
    id: "renewable-transitions",
    title: "Renewable Transitions",
    subtitle: "Solar, wind, and distributed clean energy systems",
    image: "/renewable.jpg",
  },
  {
    id: "industrial-decarbonization",
    title: "Industrial Decarbonization",
    subtitle: "Process efficiency, methane controls, and fuel switch",
    image: "/steel.jpg",
  },
  {
    id: "circular-economy-projects",
    title: "Circular Economy",
    subtitle: "Waste diversion, e-waste recovery, and material reuse",
    image: "/e-waste.jpg",
  },
];

const STANDARDS = [
  { name: "VERRA", logo: verraLogo },
  { name: "GOLD STANDARD", logo: goldStandardLogo },
  { name: "PURO.EARTH", logo: puroEarthLogo },
  { name: "ICROA", logo: icroaLogo },
  { name: "CORSIA", logo: icaoCorsiaLogo },
  { name: "CDR.fyi", logo: cdrFyiLogo },
];

const FAQ_ITEMS = [
  {
    question: "How do you verify carbon credit quality?",
    answer:
      "Every listing includes methodology, vintage, registry details, and third-party verification references before it is promoted.",
  },
  {
    question: "Can we buy as a company and retire centrally?",
    answer:
      "Yes. Enterprise buyers can consolidate orders and retire credits at a portfolio level with downloadable records.",
  },
  {
    question: "Do you support long-term offtake conversations?",
    answer:
      "Yes. Teams can initiate forward-looking procurement discussions for recurring or larger-volume purchase windows.",
  },
  {
    question: "What drives price variation between projects?",
    answer:
      "Price usually varies by methodology, vintage, geography, co-benefits, permanence profile, and prevailing demand.",
  },
  {
    question: "Can project developers list credits here?",
    answer:
      "Yes. Project developers can onboard, submit documentation, and progress through marketplace verification for listing.",
  },
];

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function MarketplaceActionButton({
  track,
  browsePath,
  sellPath,
  onOpenSignup,
  onOpenLogin,
}) {
  if (track.action === "browse") {
    return (
      <Link to={browsePath} className="marketplace1-landing-pill-link">
        {track.cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  if (track.action === "sell") {
    return (
      <Link to={sellPath} className="marketplace1-landing-pill-link">
        {track.cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  if (track.action === "signup") {
    return (
      <button
        type="button"
        className="marketplace1-landing-pill-link"
        onClick={onOpenSignup}
      >
        {track.cta}
        <ArrowRight className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      className="marketplace1-landing-pill-link"
      onClick={onOpenLogin}
    >
      {track.cta}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

export default function MarketplaceLanding({
  rootPath = "/marketplace",
  authSession = null,
  onOpenLogin = () => { },
  onOpenSignup = () => { },
  onLogout = () => { },
}) {
  const [activeFaq, setActiveFaq] = useState(0);
  const listingBasePath = `${rootPath}/listing`;
  const browsePath = `${rootPath}/browse`;
  const sellPath = `${rootPath}/sell`;

  return (
    <div className="marketplace1-root marketplace1-landing min-h-screen overflow-x-clip bg-[#f5f7f4] text-[#102117]">
      <MarketplaceNavbar
        rootPath={rootPath}
        activeItem="home"
        authSession={authSession}
        onOpenLogin={onOpenLogin}
        onOpenSignup={onOpenSignup}
        onLogout={onLogout}
      />

      <main className="marketplace1-landing-main">
        <section className="marketplace1-landing-hero">
          <video
            className="marketplace1-landing-hero-bg"
            src={earthVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />

          <div className="marketplace1-landing-shell marketplace1-landing-hero-content">
            <span className="marketplace1-landing-badge">Live Global Carbon Marketplace</span>

            <h1 className="marketplace1-headline marketplace1-landing-title">
              Trade Verified Carbon Credits with a clearer climate strategy.
            </h1>

            <p className="marketplace1-landing-subtitle">
              Built for buyers, developers, and sustainability teams that need transparent
              pricing, trusted projects, and traceable retirements in one workflow.
            </p>

            <div className="marketplace1-landing-hero-actions">
              <Link
                to={browsePath}
                className="marketplace1-landing-btn marketplace1-landing-btn-primary"
              >
                Browse Credits
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to={sellPath}
                className="marketplace1-landing-btn marketplace1-landing-btn-secondary"
              >
                Sell Carbon Credits
              </Link>
              <button
                type="button"
                className="marketplace1-landing-btn marketplace1-landing-btn-ghost"
                onClick={() => scrollToSection("marketplace1-why")}
              >
                Why Carbon Credits
              </button>
            </div>

            <div
              className="marketplace1-landing-trust-markers"
              role="list"
              aria-label="Marketplace trust markers"
            >
              {TRUST_MARKERS.map((marker) => (
                <span
                  key={marker}
                  role="listitem"
                  className="marketplace1-landing-trust-chip"
                >
                  {marker}
                </span>
              ))}
            </div>

            <div
              className="marketplace1-landing-metrics"
              role="list"
              aria-label="Marketplace snapshot"
            >
              {MARKET_SNAPSHOT.map((stat) => (
                <article
                  key={stat.label}
                  role="listitem"
                  className="marketplace1-landing-metric-card"
                >
                  <p className="marketplace1-headline marketplace1-landing-metric-value">
                    {stat.value}
                  </p>
                  <p className="marketplace1-landing-metric-label">{stat.label}</p>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="marketplace1-landing-scroll-indicator"
              onClick={() => scrollToSection("marketplace1-why")}
              aria-label="Scroll to why carbon credits section"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </section>

        <section
          id="marketplace1-why"
          className="marketplace1-landing-section marketplace1-landing-section-plain"
        >
          <div className="marketplace1-landing-shell marketplace1-landing-two-column">
            <div className="marketplace1-landing-copy-column">
              <p className="marketplace1-landing-section-label">Why Carbon Credits</p>
              <h2 className="marketplace1-headline marketplace1-landing-section-title">
                Use carbon credits as part of a reduction-first net-zero roadmap.
              </h2>
              <p className="marketplace1-landing-section-description">
                Carbon credits are not a shortcut. They are a bridge for residual emissions,
                enabling organizations to finance credible climate action while decarbonization
                programs scale.
              </p>

              <div className="marketplace1-landing-point-stack">
                {WHY_POINTS.map((point) => (
                  <article key={point.title} className="marketplace1-landing-point-card">
                    <span className="marketplace1-landing-point-icon" aria-hidden="true">
                      <point.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="marketplace1-headline marketplace1-landing-point-title">
                        {point.title}
                      </h3>
                      <p className="marketplace1-landing-point-description">
                        {point.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="marketplace1-landing-inline-cta">
                <Link to={browsePath} className="marketplace1-landing-inline-link">
                  Explore verified listings
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  className="marketplace1-landing-inline-link"
                  onClick={onOpenLogin}
                >
                  Access buyer desk
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <aside
              className="marketplace1-landing-video-column"
              aria-label="Carbon credit explainer video"
            >
              <header className="marketplace1-landing-video-head">
                <p>
                  <Play className="h-4 w-4" />
                  Video Explainer
                </p>
                <span>2 min overview</span>
              </header>

              <video
                className="marketplace1-landing-video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                controls
                poster="/water.jpg"
              >
                <source src="/homeanimation.mp4" type="video/mp4" />
              </video>

              <p className="marketplace1-landing-video-description">
                Understand credit quality, pricing drivers, retirement flow, and how to align
                purchases with your reporting strategy.
              </p>

              <div className="marketplace1-landing-video-tags">
                <span>Integrity checks</span>
                <span>Pricing factors</span>
                <span>Retirement workflow</span>
              </div>
            </aside>
          </div>
        </section>

        <section
          id="marketplace1-how"
          className="marketplace1-landing-section marketplace1-landing-section-soft"
        >
          <div className="marketplace1-landing-shell">
            <div className="marketplace1-landing-center-header">
              <p className="marketplace1-landing-section-label">How It Works</p>
              <h2 className="marketplace1-headline marketplace1-landing-section-title">
                6-step infographic flow for project onboarding to listing.
              </h2>
              <p className="marketplace1-landing-section-description marketplace1-landing-centered-description">
                The step tags, badges, icons, and timeline chips stay outside each detail card
                for cleaner scanning and faster decision-making.
              </p>
            </div>

            <div className="marketplace1-how-hz-scroll">
              <div
                className="marketplace1-how-hz-grid"
                role="list"
                aria-label="Six step carbon market workflow"
              >
                <div className="marketplace1-how-hz-track" aria-hidden="true" />
                {HOW_IT_WORKS_STEPS.map((item) => (
                  <article
                    key={item.step}
                    role="listitem"
                    className="marketplace1-how-hz-step"
                    style={{
                      "--marketplace1-how-step-color": item.color,
                      "--marketplace1-how-step-bg": item.background,
                      "--marketplace1-how-step-border": item.border,
                    }}
                  >
                    <div className="marketplace1-how-hz-icon-ring" aria-hidden="true">
                      <item.icon className="marketplace1-how-hz-icon" />
                    </div>
                    <span className="marketplace1-how-hz-track-dot" aria-hidden="true" />
                    <span className="marketplace1-how-hz-step-tag">{item.step}</span>

                    <div className="marketplace1-how-hz-card">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="marketplace1-how-hz-card-image"
                      />
                      <div className="marketplace1-how-hz-card-content">
                        <div className="marketplace1-how-hz-meta">
                          <span className="marketplace1-how-hz-badge">{item.badge}</span>
                          <span className="marketplace1-how-hz-time">
                            <Clock3 className="marketplace1-how-hz-time-icon" />
                            {item.time}
                          </span>
                        </div>
                        <h3 className="marketplace1-headline marketplace1-how-hz-title">
                          {item.title}
                        </h3>
                        <p className="marketplace1-how-hz-description">{item.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="marketplace1-landing-section marketplace1-landing-section-plain">
          <div className="marketplace1-landing-shell">
            <div className="marketplace1-landing-center-header">
              <p className="marketplace1-landing-section-label">Solutions</p>
              <h2 className="marketplace1-headline marketplace1-landing-section-title">
                Carbon credit solutions for every maturity stage.
              </h2>
              <p className="marketplace1-landing-section-description marketplace1-landing-centered-description">
                Move from discovery to transactions with dedicated tracks for buyers,
                sellers, and enterprise sustainability teams.
              </p>
            </div>

            <div
              className="marketplace1-landing-solution-grid"
              role="list"
              aria-label="Marketplace solutions"
            >
              {SOLUTION_TRACKS.map((track) => (
                <article
                  key={track.title}
                  role="listitem"
                  className="marketplace1-landing-solution-card"
                >
                  <div className="marketplace1-landing-solution-icon" aria-hidden="true">
                    <track.icon className="h-6 w-6" />
                  </div>
                  <h3 className="marketplace1-headline marketplace1-landing-solution-title">
                    {track.title}
                  </h3>
                  <p className="marketplace1-landing-solution-description">
                    {track.description}
                  </p>
                  <MarketplaceActionButton
                    track={track}
                    browsePath={browsePath}
                    sellPath={sellPath}
                    onOpenSignup={onOpenSignup}
                    onOpenLogin={onOpenLogin}
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="marketplace1-landing-section marketplace1-landing-section-soft">
          <div className="marketplace1-landing-shell">
            <div className="marketplace1-landing-center-header">
              <p className="marketplace1-landing-section-label">Project Universe</p>
              <h2 className="marketplace1-headline marketplace1-landing-section-title">
                High-impact categories buyers track right now.
              </h2>
              <p className="marketplace1-landing-section-description marketplace1-landing-centered-description">
                Explore nature-based and engineered pathways with category-level discovery.
              </p>
            </div>

            <div
              className="marketplace1-landing-category-grid"
              role="list"
              aria-label="Carbon project categories"
            >
              {PROJECT_CATEGORIES.map((item) => (
                <article
                  key={item.id}
                  role="listitem"
                  className="marketplace1-landing-category-card"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="marketplace1-landing-category-image"
                  />
                  <div className="marketplace1-landing-category-content">
                    <p className="marketplace1-landing-category-subtitle">{item.subtitle}</p>
                    <h3 className="marketplace1-headline marketplace1-landing-category-title">
                      {item.title}
                    </h3>
                    <Link
                      to={`${listingBasePath}/${item.id}`}
                      className="marketplace1-landing-category-link"
                    >
                      View related listings
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="marketplace1-landing-standards">
          <div className="marketplace1-landing-shell marketplace1-landing-standards-inner">
            <div className="marketplace1-landing-center-header marketplace1-landing-standards-header">
              <p className="marketplace1-landing-section-label">Standards</p>
              <h2 className="marketplace1-headline marketplace1-landing-section-title">
                Standards and frameworks tracked
              </h2>
            </div>

            <div className="marketplace1-landing-standards-row" role="list" aria-label="Tracked standards">
              {STANDARDS.map((item) => (
                <article key={item.name} role="listitem" className="marketplace1-landing-standard-card">
                  <img
                    src={item.logo}
                    alt={`${item.name} logo`}
                    className="marketplace1-landing-standard-logo"
                    loading="lazy"
                  />
                  <p>{item.name}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="marketplace1-landing-section marketplace1-landing-section-plain">
          <div className="marketplace1-landing-shell">
            <div className="marketplace1-landing-cta-wrap">
              <div className="marketplace1-landing-cta-copy">
                <p className="marketplace1-landing-section-label marketplace1-landing-section-label-light">
                  Ready To Move
                </p>
                <h2 className="marketplace1-headline marketplace1-landing-cta-title">
                  Build your carbon credit portfolio with confidence.
                </h2>
                <p className="marketplace1-landing-cta-description">
                  Start with curated supply, clear due diligence context, and a transaction flow
                  designed for both speed and traceability.
                </p>
              </div>

              <div className="marketplace1-landing-cta-actions">
                <Link
                  to={browsePath}
                  className="marketplace1-landing-btn marketplace1-landing-btn-primary"
                >
                  Browse Credits
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to={sellPath}
                  className="marketplace1-landing-btn marketplace1-landing-btn-secondary"
                >
                  Become a Seller
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="marketplace1-landing-section marketplace1-landing-section-plain">
          <div className="marketplace1-landing-shell marketplace1-landing-faq-shell">
            <div className="marketplace1-landing-center-header">
              <p className="marketplace1-landing-section-label">FAQs</p>
              <h2 className="marketplace1-headline marketplace1-landing-section-title">
                Answers before you buy or list.
              </h2>
            </div>

            <div className="marketplace1-landing-faq-stack">
              {FAQ_ITEMS.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <article key={faq.question} className="marketplace1-landing-faq-item">
                    <button
                      type="button"
                      className="marketplace1-landing-faq-trigger"
                      onClick={() => setActiveFaq(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                    {isOpen && <p className="marketplace1-landing-faq-answer">{faq.answer}</p>}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
