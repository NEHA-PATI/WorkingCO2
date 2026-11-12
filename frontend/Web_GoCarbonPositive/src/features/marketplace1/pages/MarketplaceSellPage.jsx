import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiActivity,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiDatabase,
  FiEdit3,
  FiGlobe,
  FiLock,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { MdOutlineForest, MdOutlineLandscape } from "react-icons/md";

import MarketplaceNavbar from "../components/MarketplaceNavbar";
import "../styles/marketplace1.css";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA2FMYg2o1FDhvLEdhqos_XEC4oer4Hk4qhKzcKaA0GKSqz3zWZYf0OSuFHiZ12HQQ_8jkfFV1VAOB_x27046OjTHJy7_U8UxERD5_XBDy3M3sEC3Sqv0N9rEeTkblXPuwgwCV8n5busF1dlVAyKepQj-DsCe0S1sGG1PyFh4dKOaIgZBesBcB_VEXj7RkNM_TUcbfmmYW-VCa-Guqp006z7SlX7IUHHQ1UwuTvzXRZigls-KSGiU7lPuvOhoBT6FcwC0WoAauueFDu";

const MIST_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBvP_PJPFgszxa3WevOV72xMVqs5oxZS8aUDrH_ZQaLkrdQYKTNfZLDuzhLo1UKtglkgyV0KU9XyI0XSf4CkyJ3i1FDlAAJuhbmTtgi6pUTyw04p4sU1m9kSH6wD4FPlVRGMsZ2hAkOcBX2QKYaM-d5LNHK8VPW1p1iwEutQOHoiZrA3zRTDfCjoY_4i4XCUofjJWwOUeMSfYZpu79xAIE0Cg1pUBunxSWjnd1_TGaVvVJy6ucLgl4gueG-1Q3DF176kZbzuiArp5gc";

const FOREST_PATH_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAceyJEZzYiIWf9UDmhysBJjVyk8TFPFhD6249UaqG2ePGCmDoC5UA-hkrBC7WQfdlzQtP4mgLTU71tP4cH_UzFeFc-sAjyJ-gh18LegRLpLPj1rqdHCeV6jj7qzyTM2aYGC7pB16XvNq2akrFpBO4iuEBEZ_1t28uPPW_4GYYMixAy17mACxhwHxbAM_mPkarTaJPsRFEtZmidzwdTQrye1MAp2KUG-pwiTW2v0d5IT608ZvyYXSzxa59ASM_tdtJ86PZ8dwuyiC2T";

const SELLER_TYPES = [
  {
    id: "individual",
    title: "Individual Sellers",
    copy: "Empowering family forests and small-scale community projects to access global markets.",
    action: "Apply as Individual",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzz_qQBzIsYSFD29bGbSHluNrXXLWjy7uPT9ML44KaYQYVmQSVkJiPfFBW_br_AlQX2DmzFsnM_3ScELg9tgzSvJE6It1wLLhpfJkPCcU4yRq5eUFMU-PsmWXtp6SBxcrXOiP1Xv386LBqgejc2Lt_eEnGXfClfdVmPjIz3a4cPNor6EzhpvgK-S431vtFnlscIBK61oPSNmsp0KzekJN80rv4Mn63QDZgkhEpBQfDJLu-6o2t_5-wF33D38TljjsSQGbV5yahsQB-",
    icon: MdOutlineForest,
    to: "/create-listing/seller-details",
  },
  {
    id: "corporate",
    title: "Corporate Asset Holders",
    copy: "For institutional funds and ESG portfolios managing large-scale nature-based assets.",
    action: "Apply as Corporate",
    image: FOREST_PATH_IMAGE,
    icon: MdOutlineLandscape,
    to: "/create-listing/seller-details",
  },
];

const ONBOARDING_STEPS = [
  {
    label: "Step 01",
    title: "Initial Project Review",
    icon: FiEdit3,
  },
  {
    label: "Step 02",
    title: "Technical MRV Assessment",
    icon: FiBarChart2,
  },
  {
    label: "Step 03",
    title: "Market Listing and Issuance",
    icon: FiCheck,
  },
];

const JOURNEY_STEPS = [
  {
    id: "01",
    title: "Submit Project Details",
    text: "Upload your methodology and verification documents through our encrypted portal.",
  },
  {
    id: "02",
    title: "Validation Phase",
    text: "Our in-house science team ensures all data meets rigorous global standards.",
  },
  {
    id: "03",
    title: "Listing and Discovery",
    text: "Gain immediate visibility via AI-curated search for institutional ESG buyers.",
  },
];

const CHECKLIST = [
  {
    title: "Proof of Land Rights",
    text: "Ownership or management certification.",
  },
  {
    title: "Carbon Baseline Report",
    text: "Initial biomass measurements.",
  },
  {
    title: "GIS Boundary Data",
    text: "Shapefiles or GeoJSON coordinates.",
  },
];

const BENEFITS = [
  {
    title: "Institutional Demand",
    text: "Direct access to Fortune 500 ESG procurement teams and climate funds.",
    icon: FiTrendingUp,
  },
  {
    title: "Market Intelligence",
    text: "Real-time pricing analytics and benchmarks based on global vintage data.",
    icon: FiActivity,
  },
  {
    title: "On-Chain Ledger",
    text: "Immutable proof of credit ownership, transfer history, and retirement.",
    icon: FiDatabase,
  },
  {
    title: "Universal Registry",
    text: "Integrated with Verra, Gold Standard, and regional registries.",
    icon: FiGlobe,
  },
];

const TRUST_FEATURES = [
  {
    title: "Manual Verification",
    text: "Every project is vetted by in-house environmental scientists and foresters.",
    icon: FiShield,
  },
  {
    title: "Escrow Protection",
    text: "Funds are secured in tier-1 institutions until credit delivery is finalized.",
    icon: FiLock,
  },
  {
    title: "Satellite MRV",
    text: "Remote sensing to monitor biomass growth and forest health continuously.",
    icon: HiOutlineSparkles,
  },
];

const TESTIMONIALS = [
  {
    name: "Elias Thornwood",
    role: "Legacy Forest Project, Norway",
    quote:
      "Carbon Positive provided the technical bridge I needed. Within three months, our conservation area was generating enough revenue to hire five full-time rangers.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAIxgBxyyiN8kAwSyMq1Yrw_vyM4iQDodxbza5xJaIMqkLTSrKoxp8M2ey16wQUlJsIQDX7h06wXVyBLm3Y_kqZfCJXxu-UEtbK0DKS1Vhjb6UyAbIMGEyUjkd_CrQHxa8z5Fw1GjtRt00k6_ur21YE96rzqSEfznVpnOrao3ugh2kF6hAdL5eLb9NFjJkJ56A54hakSHL6Oer7vRXI6PkTeFIPbVuB8iGUflR2REZ5dMIVQDd2aLTzRVCKct9ttOkM4BrW6vp7I2xs",
    stats: [
      { value: "12k", label: "Tons Sequestered" },
      { value: "$140k", label: "Annual Revenue" },
    ],
  },
  {
    name: "Sarah Chen",
    role: "Blue Carbon Initiatives, Indonesia",
    quote:
      "The transparency of the platform changed everything. We could show buyers exactly how their investment was helping restore mangrove ecosystems in real-time.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJjYZ7maMxR0HSZqJ4m61Wzye_0i102yaeEvmrQvf9AQxkYuxSuHCVJjzfTn9xAHXrAJIcQ-DJruZ4Wk8uK21zaScENv3TKi8u-JfBLXHUkwjHtxGAf9_V841SQyh8_yhEjaU1S3el-EFWbOYm5ipEn5Bhoe1xlyNntNxRpVcWJntI0e-TLHks0pOX4F2TU-rj6wuGKopAEiMoFIcA_7ny5IQbRmkhLN4Fi6CAy7g0pRHA0c-NTbR1-dAEaKjaFvm37NEHLUxkmww9",
    stats: [
      { value: "45k", label: "Credits Sold" },
      { value: "98%", label: "Verification Score" },
    ],
  },
];

const HERO_METRICS = [
  {
    value: "1,240+",
    label: "Projects Onboarded",
  },
  {
    value: "$86M",
    label: "Credits Traded",
  },
  {
    value: "98.6%",
    label: "Buyer Confidence",
  },
];

function HeroSection({ rootPath }) {
  return (
    <header className="mkt-sell-hero">
      <div className="mkt-sell-hero-media">
        <img className="mkt-sell-hero-image" src={HERO_IMAGE} alt="Premium aerial forest view" />
        <div className="mkt-sell-hero-overlay" />
      </div>
      <div className="mkt-sell-wrap">
        <div className="mkt-sell-kicker">
          <span className="mkt-sell-kicker-dot" /> Verified Carbon Projects
        </div>
        <h1 className="mkt-sell-title">
          Fuel climate action with
          <span className="mkt-sell-title-accent"> transparency.</span>
        </h1>
        <div className="mkt-sell-hero-actions">
          <Link className="mkt-btn mkt-btn-primary" to={`${rootPath}/create-listing/seller-details`}>
            Upload my project
          </Link>
          <Link className="mkt-btn-inline" to={`${rootPath}/browse`}>
            View Marketplace
            <FiArrowRight className="mkt-btn-inline-icon" />
          </Link>
        </div>
        <div className="mkt-sell-metric-rail">
          {HERO_METRICS.map((metric) => (
            <article className="mkt-sell-metric-item" key={metric.label}>
              <p className="mkt-sell-metric-value">{metric.value}</p>
              <p className="mkt-sell-metric-label">{metric.label}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="mkt-sell-scroll-indicator">
        <FiArrowDown />
      </div>
    </header>
  );
}

function SellerJourneySection({ rootPath }) {
  return (
    <>
      <section className="mkt-sell-section">
        <div className="mkt-sell-section-bg">
          <img className="mkt-sell-section-bg-image" src={MIST_IMAGE} alt="Misty forest" />
        </div>
        <div className="mkt-sell-wrap mkt-sell-grid-two">
          <div className="mkt-sell-copy">
            <h2 className="mkt-sell-heading">Empowering the world's best conservationists.</h2>
            <p className="mkt-sell-lead">
              Joining Carbon Positive is the most direct path to connecting your reforestation or
              conservation project with global institutional capital.
            </p>
            <div className="mkt-sell-hero-actions">
              <Link className="mkt-btn mkt-btn-primary" to={`${rootPath}/create-listing/seller-details`}>
                Submit Onboarding Form
              </Link>
              <Link className="mkt-btn mkt-btn-secondary" to={`${rootPath}/methodology`}>
                Read Documentation
              </Link>
            </div>
          </div>
          <div className="mkt-sell-stack">
            {ONBOARDING_STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="mkt-sell-onboard-card">
                  <div className="mkt-sell-onboard-icon">
                    <Icon />
                  </div>
                  <div>
                    <p className="mkt-sell-onboard-step">{item.label}</p>
                    <h4 className="mkt-sell-onboard-title">{item.title}</h4>
                    {index === 2 ? null : <span className="mkt-sell-onboard-line" />}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mkt-sell-section mkt-sell-section-muted">
        <div className="mkt-sell-wrap mkt-sell-grid-two">
          <div className="mkt-sell-journey">
            <h3 className="mkt-sell-heading">The Journey to Market</h3>
            <p className="mkt-sell-lead">
              Our streamlined process ensures your high-integrity credits reach premium buyers fast.
            </p>
            <div className="mkt-sell-stack">
              {JOURNEY_STEPS.map((step) => (
                <article className="mkt-sell-journey-item" key={step.id}>
                  <span className="mkt-sell-journey-index">{step.id}</span>
                  <div>
                    <h4 className="mkt-sell-journey-title">{step.title}</h4>
                    <p className="mkt-sell-journey-text">{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="mkt-sell-checklist-card">
            <h4 className="mkt-sell-checklist-title">Pre-Listing Checklist</h4>
            <ul className="mkt-sell-stack">
              {CHECKLIST.map((item) => (
                <li className="mkt-sell-checklist-item" key={item.title}>
                  <span className="mkt-sell-checkmark">
                    <FiCheck />
                  </span>
                  <div className="mkt-sell-check-content">
                    <p>{item.title}</p>
                    <span>{item.text}</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mkt-sell-help">
              Need help gathering these? Our team offers technical support for qualifying projects.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}

function SellerTypesSection() {
  return (
    <section className="mkt-sell-section">
      <div className="mkt-sell-wrap">
        <div className="mkt-sell-types-grid">
          {SELLER_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <article
                className={`mkt-sell-type-card ${type.id === "corporate" ? "mkt-sell-type-corporate" : ""}`}
                key={type.id}
              >
                <img className="mkt-sell-type-image" src={type.image} alt={type.title} />
                <div className="mkt-sell-type-overlay" />
                <div className="mkt-sell-type-content">
                  <span className="mkt-sell-type-icon">
                    <Icon />
                  </span>
                  <h3 className="mkt-sell-type-title">{type.title}</h3>
                  <p className="mkt-sell-type-text">{type.copy}</p>
                  <Link className="mkt-sell-type-action" to={type.to}>
                    {type.action}
                    <FiArrowRight className="mkt-sell-type-action-icon" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <>
      <section className="mkt-sell-section mkt-sell-section-soft">
        <div className="mkt-sell-wrap">
          <div className="mkt-sell-benefit-head">
            <div>
              <h2 className="mkt-sell-heading">Unlocking Environmental Value</h2>
              <p className="mkt-sell-lead">
                Infrastructure designed specifically for the next generation of ecological assets.
              </p>
            </div>
            <span className="mkt-sell-mini-link">Explore all features</span>
          </div>

          <div className="mkt-sell-benefit-grid">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article className="mkt-sell-benefit-card" key={benefit.title}>
                  <span className="mkt-sell-benefit-icon">
                    <Icon />
                  </span>
                  <h4 className="mkt-sell-benefit-title">{benefit.title}</h4>
                  <p className="mkt-sell-benefit-text">{benefit.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mkt-sell-section mkt-sell-section-light">
        <div className="mkt-sell-wrap">
          <div className="mkt-sell-trust-head">
            <p className="mkt-sell-kicker mkt-sell-kicker-light">Security and Verification</p>
            <h2 className="mkt-sell-heading">High-Integrity by Design</h2>
          </div>
          <div className="mkt-sell-trust-grid">
            {TRUST_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article className="mkt-sell-trust-item" key={feature.title}>
                  <span className="mkt-sell-trust-icon">
                    <Icon />
                  </span>
                  <h4 className="mkt-sell-trust-title">{feature.title}</h4>
                  <p className="mkt-sell-trust-text">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function TestimonialsSection() {
  return (
    <section className="mkt-sell-section">
      <div className="mkt-sell-wrap">
        <div className="mkt-sell-testimonial-head">
          <div>
            <h2 className="mkt-sell-heading">Voices of Impact</h2>
            <p className="mkt-sell-lead">
              Meet the pioneers transforming their land into carbon-negative powerhouses.
            </p>
          </div>
          <div className="mkt-sell-control-row">
            <button className="mkt-btn mkt-btn-circle" type="button" aria-label="Previous testimonial">
              <FiArrowLeft />
            </button>
            <button className="mkt-btn mkt-btn-circle" type="button" aria-label="Next testimonial">
              <FiArrowRight />
            </button>
          </div>
        </div>

        <div className="mkt-sell-testimonial-grid">
          {TESTIMONIALS.map((item) => (
            <article className="mkt-sell-testimonial-card" key={item.name}>
              <div className="mkt-sell-person">
                <div className="mkt-sell-avatar-wrap">
                  <img className="mkt-sell-avatar" src={item.avatar} alt={item.name} />
                  <span className="mkt-sell-avatar-quote">"</span>
                </div>
                <div>
                  <h5 className="mkt-sell-person-name">{item.name}</h5>
                  <p className="mkt-sell-person-role">{item.role}</p>
                </div>
              </div>
              <p className="mkt-sell-quote">"{item.quote}"</p>
              <div className="mkt-sell-stats">
                {item.stats.map((stat) => (
                  <div className="mkt-sell-stat" key={stat.label}>
                    <span className="mkt-sell-stat-value">{stat.value}</span>
                    <span className="mkt-sell-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ rootPath }) {
  return (
    <section className="mkt-sell-cta">
      <div className="mkt-sell-cta-overlay">
        <img src={FOREST_PATH_IMAGE} alt="Forest canopy" className="mkt-sell-cta-image" />
      </div>
      <div className="mkt-sell-wrap mkt-sell-cta-content">
        <h2 className="mkt-sell-cta-title">
          Ready to monetize your
          <span className="mkt-sell-cta-accent"> climate impact?</span>
        </h2>
        <p className="mkt-sell-cta-copy">
          Join the global marketplace of high-integrity nature-based solutions. Fast onboarding,
          transparent pricing, instant liquidity.
        </p>
        <div className="mkt-sell-cta-actions">
          <Link className="mkt-btn mkt-btn-primary" to={`${rootPath}/create-listing/seller-details`}>
            Start My Application
          </Link>
          <Link className="mkt-btn mkt-btn-ghost" to="/contact">
            Request a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function MarketplaceSellPage() {
  const location = useLocation();
  const rootPath = location.pathname.startsWith("/marketplace1")
    ? "/marketplace1"
    : "/marketplace";

  return (
    <div className="mkt-root mkt-sell-page">
      <div className="mkt-sell-nav-host">
        <MarketplaceNavbar rootPath={rootPath} activeItem="sell" />
      </div>
      <HeroSection rootPath={rootPath} />
      <SellerJourneySection rootPath={rootPath} />
      <SellerTypesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection rootPath={rootPath} />
    </div>
  );
}
