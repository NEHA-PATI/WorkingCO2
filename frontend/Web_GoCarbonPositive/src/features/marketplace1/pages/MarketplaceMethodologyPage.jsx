import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiDownload,
  FiFileText,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { MdOutlineGppGood } from "react-icons/md";

import MarketplaceNavbar from "../components/MarketplaceNavbar";
import "../styles/marketplace1.css";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCuzylS9wqSdt3czRDAb0ejGSv27MSEth99VPOagp7NBWCr3xYsUsHyCjKkGacnt68IhsQzGoFjtxtZCgOf2BCKwnT2MqZ5XujcM2YfUnmm4pctlWDlkKD-vcdSmXVppPYfLgueGN9_-MhqRrbXYvF7X0sMywKPdJgPtA9OJULVs5KpjaHqmgd3dCFTij-3ap77c6KXU24hVXyPKhAkTaDKIVnKALekPkSnZ_oUlDo_xsZplHadaNqHpkpoiGv7PvZpIPGiAjgAAEhQ";

const PIPELINE_STEPS = [
  { index: 1, label: "Declaration", color: "#3B6D11" },
  { index: 2, label: "Intake", color: "#3B6D11" },
  { index: 3, label: "Pre-screen", color: "#185FA5" },
  { index: 4, label: "Review", color: "#534AB7" },
  { index: 5, label: "Scoring", color: "#854F0B" },
  { index: 6, label: "Gate", color: "#993C1D" },
  { index: 7, label: "Legal", color: "#3B6D11" },
  { index: 8, label: "Monitoring", color: "#185FA5" },
];

const STAGE_DETAILS = [
  {
    stage: "01",
    color: "#3B6D11",
    title: "Seller declaration",
    owner: "Seller (self-service)",
    duration: "~5 min",
    description:
      "Seller completes profile, declares project details, sets quantity and price.",
    checks: ["Seller type, role", "Project metadata", "Credit quantity and price per ton"],
  },
  {
    stage: "02",
    color: "#3B6D11",
    title: "Document intake",
    owner: "Seller upload + automated scan",
    duration: "~10 min",
    description:
      "Documents uploaded, file integrity checked, virus scan runs automatically.",
    checks: [
      "Issuance cert and registry screenshot",
      "Balance proof and file format",
      "Automated virus scan",
    ],
  },
  {
    stage: "03",
    color: "#185FA5",
    title: "Automated pre-screening",
    owner: "System (background job)",
    duration: "1-5 min",
    description:
      "Rule-based checks run instantly. No human involvement at this stage.",
    checks: [
      "Project ID format and Registry ping",
      "Serial range logic and Volume anomaly",
      "Duplicate scan and Price outlier",
    ],
  },
  {
    stage: "04",
    color: "#534AB7",
    title: "Manual document review",
    owner: "Carbon Positive reviewer",
    duration: "1-3 business days",
    description:
      "Reviewer opens every document and manually cross-checks project ID on public registry page.",
    checks: [
      "Cert matches project ID",
      "Registry manually checked",
      "Identity cross-match and confidence score",
    ],
  },
  {
    stage: "05",
    color: "#854F0B",
    title: "Risk and fraud scoring",
    owner: "System risk engine",
    duration: "Background",
    description:
      "Composite trust score computed from seller history, document confidence, and anomaly signals.",
    checks: [
      "Trust score computed",
      "Volume and price deviation analysis",
      "Seller history and composite score",
    ],
  },
  {
    stage: "06",
    color: "#993C1D",
    title: "Admin decision gate",
    owner: "Senior admin",
    duration: "Same day",
    description:
      "Admin reviews risk score and reviewer notes. Makes final listing status decision.",
    checks: ["Risk score review", "Reviewer notes audit", "Decision log and status set"],
  },
  {
    stage: "07",
    color: "#3B6D11",
    title: "Legal declaration sign-off",
    owner: "Seller (required action)",
    duration: "~2 min",
    description:
      "Seller confirms legal declarations before listing is made public.",
    checks: [
      "Ownership and non-double-sale",
      "Accuracy confirmed",
      "T&C and penalty clause acceptance",
    ],
  },
  {
    stage: "08",
    color: "#185FA5",
    title: "Listing live + monitoring",
    owner: "System (continuous)",
    duration: "Ongoing",
    description:
      "Listing becomes visible. Continuous monitoring watches for duplicates and anomalies.",
    checks: ["Listing published", "Duplicate monitor active", "Audit log and dashboard visibility"],
  },
];

const FRAUD_LAYERS = [
  {
    title: "Volume Anomaly",
    text: "Detection of unrealistic sequestration rates based on biome-specific growth benchmarks.",
  },
  {
    title: "Duplicate Registry Check",
    text: "Scanning of Verra, Gold Standard, and regional registries for overlapping serial numbers.",
  },
  {
    title: "Price Outlier Tagging",
    text: "Automatic flagging of projects listing significantly below regional development costs.",
  },
  {
    title: "Serial Range Validation",
    text: "Verification that every credit is tied to a specific, unique polygon of protected land.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What happens if a project fails verification?",
    answer:
      "The developer is issued a deficiency report and has 30 days to rectify data gaps or provide additional evidence.",
  },
  {
    question: "Who covers the verification costs?",
    answer:
      "Carbon Positive covers the initial manual audit costs. A listing fee is applied only after a successful sale.",
  },
];

export default function MarketplaceMethodologyPage() {
  const location = useLocation();
  const rootPath = location.pathname.startsWith("/marketplace1")
    ? "/marketplace1"
    : "/marketplace";

  return (
    <div className="marketplace1-root min-h-screen bg-[#f8fafb] text-[#191c1d]">
      <div className="mkt-sell-nav-host">
        <MarketplaceNavbar rootPath={rootPath} activeItem="resources" />
      </div>

      <main className="mx-auto max-w-[1100px] px-4 pb-20 pt-6 sm:px-6 lg:px-0">
        <section className="grid items-center gap-10 py-10 md:grid-cols-2 md:py-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Resources</span>
              <span>•</span>
              <span className="text-[#1a6b3c]">Methodology</span>
            </div>
            <span className="inline-flex rounded-full bg-[#d8f2df] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#1a6b3c]">
              Documentation
            </span>
            <h1 className="marketplace1-headline text-4xl font-black leading-[1.1] tracking-tight text-[#191c1d] md:text-5xl">
              How Carbon Positive verifies your credits
            </h1>
            <p className="text-base leading-relaxed text-slate-600">
              A rigorous 8-stage manual verification pipeline designed to ensure every ton of
              carbon reduction meets institutional standards for additionality, permanence,
              and transparency.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700">
                <FiShield className="text-[#1a6b3c]" />
                8 verification stages
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700">
                <FiClock className="text-[#1a6b3c]" />
                ~3 day avg. review
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700">
                <FiUsers className="text-[#1a6b3c]" />
                100% manually reviewed
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`${rootPath}/create-listing/seller-details`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#005129] px-6 py-3 text-sm font-bold text-white"
              >
                Start listing
                <FiArrowRight />
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-[#e6e8e9] px-6 py-3 text-sm font-bold text-[#191c1d]"
              >
                Download PDF
                <FiDownload />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="marketplace1-headline text-xl font-black text-[#191c1d]">
                  Verification Flow
                </h3>
                <span className="rounded-full bg-[#8ef9ad] px-2 py-0.5 text-[10px] font-bold uppercase text-[#005229]">
                  Live System
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-[#f2f4f5] p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#005129] text-xs font-bold text-white">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                      Intake
                    </p>
                    <p className="text-sm font-bold text-[#191c1d]">Seller Declaration</p>
                  </div>
                  <FiCheck className="text-[#005129]" />
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[#f2f4f5] p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#005129] text-xs font-bold text-white">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                      Analysis
                    </p>
                    <p className="text-sm font-bold text-[#191c1d]">Manual Risk Scoring</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-[#005129] animate-pulse" />
                </div>
                <div className="flex items-center gap-3 p-3 opacity-45">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-300 text-xs font-bold text-white">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                      Finality
                    </p>
                    <p className="text-sm font-bold text-[#191c1d]">Legal Sign-off</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-semibold text-slate-500">
                <span>Success Rate: 98.4%</span>
                <span>View Protocol 2.4</span>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#1a6b3c]/10 blur-3xl" />
          </div>
        </section>

        <section className="space-y-6 py-10">
          <h2 className="marketplace1-headline text-3xl font-black text-[#191c1d]">
            A fully manual verification pipeline
          </h2>
          <div className="grid gap-6 text-slate-600 md:grid-cols-2">
            <p>
              Unlike automated exchanges that rely purely on API feeds from registries,
              Carbon Positive mandates a human-in-the-loop architecture. Every project
              submitted to our marketplace undergoes multi-layer inspection by internal
              environmental analysts.
            </p>
            <p>
              This manual override catches nuance in additionality claims and local
              socio-economic impacts that satellite monitoring can miss, bridging the gap
              between institutional finance and on-ground climate impact.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <FiFileText className="mb-4 text-xl text-[#1a6b3c]" />
              <h4 className="mb-2 text-sm font-bold text-[#191c1d]">No registry API blind trust</h4>
              <p className="text-xs text-slate-600">
                We verify source documents directly instead of relying only on third-party feeds.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <FiUsers className="mb-4 text-xl text-[#1a6b3c]" />
              <h4 className="mb-2 text-sm font-bold text-[#191c1d]">Human review</h4>
              <p className="text-xs text-slate-600">
                Multiple analysts sign off on each vintage before listing goes live.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <MdOutlineGppGood className="mb-4 text-xl text-[#1a6b3c]" />
              <h4 className="mb-2 text-sm font-bold text-[#191c1d]">Immutable audit trail</h4>
              <p className="text-xs text-slate-600">
                Every decision point is logged for transparent governance and compliance.
              </p>
            </article>
          </div>
        </section>

        <section className="py-10">
          <div className="mb-8 text-center">
            <h2 className="marketplace1-headline text-3xl font-black text-[#191c1d]">
              The 8-stage pipeline
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              End-to-end flow from seller contact to final issuance and monitoring.
            </p>
          </div>
          <div className="relative overflow-x-auto pb-2">
            <div className="absolute left-0 right-0 top-5 hidden h-[2px] bg-slate-200 md:block" />
            <div className="grid min-w-[720px] grid-cols-8 gap-3">
              {PIPELINE_STEPS.map((item) => (
                <div key={item.index} className="space-y-3 text-center">
                  <div
                    className="mx-auto grid h-10 w-10 place-items-center rounded-full text-sm font-black text-white shadow-md"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.index}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6 py-10">
          <h3 className="marketplace1-headline text-center text-3xl font-black text-[#191c1d]">
            Detailed Stage Protocol
          </h3>
          {STAGE_DETAILS.map((stage) => (
            <article key={stage.stage} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                <div className="flex items-center gap-4">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stage.stage}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-[#191c1d]">{stage.title}</h4>
                    <p className="text-xs font-medium text-slate-500">{stage.owner}</p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {stage.duration}
                </span>
              </header>
              <div className="grid gap-6 p-5 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold text-[#191c1d]">What happens:</p>
                  <p className="text-sm leading-relaxed text-slate-600">{stage.description}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Checks
                  </p>
                  <ul className="space-y-2">
                    {stage.checks.map((check) => (
                      <li key={check} className="flex items-start gap-2 text-xs font-medium text-slate-600">
                        <FiCheck className="mt-0.5" style={{ color: stage.color }} />
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-5 py-10 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-7">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#d8f2df] text-[#1a6b3c]">
              <FiUsers />
            </div>
            <h3 className="mb-2 text-xl font-black text-[#191c1d]">The Seller</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Responsible for data hygiene, documentation accuracy, and project integrity.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-7">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#d8f2df] text-[#1a6b3c]">
              <FiShield />
            </div>
            <h3 className="mb-2 text-xl font-black text-[#191c1d]">Our Team</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Environmental analysts and reviewers execute the multi-stage manual checks.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-7">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#d8f2df] text-[#1a6b3c]">
              <HiOutlineSparkles />
            </div>
            <h3 className="mb-2 text-xl font-black text-[#191c1d]">The Systems</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Monitoring engines continuously surface anomalies for analyst review.
            </p>
          </article>
        </section>

        <section className="rounded-[2rem] bg-[#eceeef] p-8 md:p-10">
          <h2 className="marketplace1-headline mb-3 text-3xl font-black text-[#191c1d]">
            Fraud Detection Layers
          </h2>
          <p className="mb-8 text-sm text-slate-600">
            Pattern matching controls to prevent greenwashing and double-counting.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {FRAUD_LAYERS.map((layer, idx) => (
              <article key={layer.title} className="flex gap-4">
                <span className="text-3xl font-black text-[#1a6b3c]/30">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="mb-1 text-sm font-bold text-[#191c1d]">{layer.title}</h4>
                  <p className="text-sm text-slate-600">{layer.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="py-12">
          <h2 className="marketplace1-headline mb-6 text-3xl font-black text-[#191c1d]">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6">
            {FAQ_ITEMS.map((faq) => (
              <article key={faq.question} className="py-6">
                <h4 className="text-sm font-bold text-[#191c1d]">{faq.question}</h4>
                <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
              </article>
            ))}
            <div className="py-6 text-center">
              <button type="button" className="text-sm font-bold text-[#1a6b3c] hover:underline">
                Read all 14 FAQ items
              </button>
            </div>
          </div>
        </section>
      </main>

      <section className="relative overflow-hidden py-24">
        <img src={HERO_IMAGE} alt="Misty forest canopy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#0b2a1d]/80" />
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8ef9ad]">Ready to list?</p>
          <h2 className="marketplace1-headline mx-auto mt-4 max-w-3xl text-4xl font-black leading-tight text-white md:text-5xl">
            Join the new standard of environmental integrity
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to={`${rootPath}/create-listing/seller-details`}
              className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#27500A]"
            >
              Apply for Verification
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-white/40 bg-transparent px-8 py-3.5 text-sm font-bold text-white"
            >
              Speak to an Analyst
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
