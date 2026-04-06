import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bolt,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Leaf,
  LineChart,
  LogOut,
  Menu,
  Play,
  Share2,
  ShieldCheck,
  Sprout,
  UserRound,
  X,
} from "lucide-react";
import "../styles/marketplace1.css";

const BUY_MENU_ITEMS = [
  "Request PO",
  "Request Meeting",
  "Large Order",
  "Approved Buyer",
  "Contact",
];

const STATS = [
  { value: "12.5M+", label: "Credits Traded" },
  { value: "450+", label: "Global Projects" },
  { value: "62", label: "Countries Active" },
  { value: "1.2K+", label: "Verified Sellers" },
];

const INTEGRITY_POINTS = [
  {
    title: "Third-Party Vetted",
    description:
      "Rigorous auditing by global standards including Verra and Gold Standard.",
    icon: ShieldCheck,
  },
  {
    title: "Real-time Tracking",
    description: "Transparent registry monitoring for double-counting prevention.",
    icon: LineChart,
  },
  {
    title: "Co-benefit Focus",
    description: "Supporting biodiversity and local communities beyond just carbon.",
    icon: Sprout,
  },
];

const BUYER_STEPS = [
  {
    number: "01",
    title: "Discover & Analyze",
    description:
      "Browse high-quality projects filtered by vintage, region, and UN Sustainable Development Goals.",
  },
  {
    number: "02",
    title: "Instant Purchase",
    description:
      "Secure credits instantly via PO or credit card with automated retirement certificates issued in your name.",
    elevated: true,
  },
  {
    number: "03",
    title: "Impact Reporting",
    description:
      "Access real-time project updates, photos, and verification documents for your ESG compliance.",
  },
];

const FEATURED_PROJECTS = [
  {
    id: "amazon-rainforest-protection",
    location: "Brazil",
    name: "Amazon Rainforest Protection",
    price: "$18.50",
    registry: "VERRA VCS",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD2J1-U7xbpFxru2l9AzERQbTIpdx7mw-RhYV9qfpXo_oF-hbmsGcIuNGCA2EEvJssX7mKwVPkdTb0gLEKZUXe3nSEFQ15ROJl3KWh-zuYTNB5mOWByEVQBYuxQoGvQn6dSSxFsBl0Riq73cqPaYMUEI24-iHMQDO6z9JLO1-GisObbdsFRWudBfHvQQekRh2Bj3vB5_sVONHt3dnW7a9jBVLAK0tR0ocIRTOByBm3bNDqL1ltPkzHlNCizVpYgFcxGqL4kmFCBV8s",
    alt: "Aerial view of dense tropical rainforest",
  },
  {
    id: "mekong-delta-wind-farm",
    location: "Vietnam",
    name: "Mekong Delta Wind Farm",
    price: "$12.00",
    registry: "GOLD STANDARD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBb1YNmXg1V3nbFTz3GGhFrO4JLEl88oSkaR26zUutUZOvtCbwhMPJWtTNvy5YqHzpIgqnfwZ-F-nDWJcxeLGoKUCjNVQ9yjSb6dR5DhXoF1ldsXJYK5f45m8vNQRniLe5GjKo2HEVz7NCZ7zm3WKN_uoDyrroirHtZnOgykdcaGiRNeqPHcw-b5aD7S1zGiZTdRUdNF5Hk2CkMAlf-Ga22eDbRrEmXU37pfuIPPuTZb4mQK7M8-x3okBI2pYEPi3N2_ukpE7Cv-T8",
    alt: "Offshore wind turbines over blue sea",
  },
  {
    id: "blue-carbon-mangroves",
    location: "Kenya",
    name: "Blue Carbon Mangroves",
    price: "$24.00",
    registry: "PURO.EARTH",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0VSoyPL8bw8CO3JpIXoegwPGRO22g6ovFngRfXrOQv-UF-ffSbAvLgLdfhvPU8TzVS6NsvhGrnAuKYrvYpjkZZ7krRzrXETDCA1N_Zz9FVt6JtZI2YouqJDJ09apzOm0DkoFFpGj-IlFnbYP_HY3nKMFsy_RIHv7OUeaqYEl1kajUnCnMR4bxKJp5CGY6QSBoSpGT0ZlHT8n5KeNhxSdgLcbKgrbzpk09TliW8owR1WUy1H4KaJmg5ow4o0xiweoWQo1W7U5UxYg",
    alt: "Mangrove roots in reflective water",
  },
  {
    id: "regenerative-soil-sequestration",
    location: "USA",
    name: "Regenerative Soil Sequestration",
    price: "$21.50",
    registry: "VERRA VCS",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGUgH1XzeUp58jAuH-L4MXRo6oXK0zL5EyA6ES990LMuiOSqIB7MXZ5WjHsvAEnNU-9BKmVLsib5ttrx2MUbLkugW12DdInFYPb22s1r9zftOpVaO6Rfv81VaceOxzBvxPymoMKMG1cvrVIwBt10nF0VoHDCMh5otcbQgUtP-J-SCB6oAHj6ho1KMB3xaxAXSqh3ulXuor6YGw-lSKh-Bg8x4m_AXyC11gpMIk9nFfQ2dCIn99ZUAeYNe_k-N5hvcithK2bqhb_RQ",
    alt: "Regenerative farm soil with green sprouts",
  },
];

const TRUSTED_BY = ["VERRA", "GOLD STANDARD", "PURO.EARTH", "ICROA", "CDR.fyi"];

const FAQ_ITEMS = [
  {
    question: 'What makes a credit "Verified"?',
    answer:
      "Each credit must pass registry issuance, independent validation, and serial-number traceability before listing.",
  },
  {
    question: "How long does the retirement process take?",
    answer:
      "Most retirements complete within minutes, while select registries may require up to one business day.",
  },
  {
    question: "Can I buy credits as an individual?",
    answer:
      "Yes. Individuals can purchase from curated listings with the same transparency and retirement records.",
  },
  {
    question: "What are co-benefits?",
    answer:
      "Co-benefits include measurable outcomes like biodiversity support, livelihood improvements, and cleaner ecosystems.",
  },
  {
    question: "How do you prevent double-counting?",
    answer:
      "We continuously monitor registry serials and retirement states with transaction-level audit trails.",
  },
  {
    question: "Do you support carbon removal (CDR)?",
    answer:
      "Yes, including engineered and nature-based removals based on verification quality and permanence.",
  },
  {
    question: "What are your transaction fees?",
    answer:
      "Fees depend on order type and settlement flow. You can review the exact fee stack before checkout.",
  },
];

const FOOTER_COLUMNS = [
  {
    title: "Solutions",
    links: ["Project Vetting", "API Integration", "Bulk Orders", "Advisory"],
  },
  {
    title: "Marketplace",
    links: [
      "Browse Projects",
      "Credit Registry",
      "Pricing Guide",
      "Methodologies",
    ],
  },
  {
    title: "Resources",
    links: ["News", "Legal", "FAQ", "Work With Us"],
  },
  {
    title: "Contact",
    links: ["Support", "Press", "Privacy Policy", "Terms of Service"],
  },
];

const TICKER_ITEMS = [
  { bold: "342 tons", text: "sequestered today" },
  { bold: "Project Alpha", text: "just retired 50 credits" },
  { bold: "2,104", text: "active buyers online" },
  { bold: "12.4M", text: "total tonnes offset" },
];

export default function MarketplaceLanding({
  rootPath = "/marketplace",
  authSession = null,
  onOpenLogin = () => {},
  onOpenSignup = () => {},
  onLogout = () => {},
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const tickerTrack = [...TICKER_ITEMS, ...TICKER_ITEMS];
  const listingBasePath = `${rootPath}/listing`;
  const isLoggedIn = Boolean(authSession?.isAuthenticated);
  const displayName = authSession?.name || "Marketplace User";

  return (
    <div className="marketplace1-root min-h-screen overflow-x-clip bg-[#fbf9f8] text-[#1b1c1c]">
      <nav className="marketplace1-glass fixed inset-x-0 top-0 z-50 border-b border-[#dbe1db]/80 bg-[#fbf9f8]/80">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to={rootPath}
            className="flex items-center gap-2 text-base font-black tracking-tight text-[#153d29] sm:text-xl"
          >
            <Leaf className="h-5 w-5 text-[#005129]" />
            <span className="marketplace1-headline">Carbon Positive</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex">
            <span className="cursor-pointer border-b-2 border-[#005129] pb-1 text-[#005129]">
              Solutions
            </span>
            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 transition-colors hover:text-[#005129]"
              >
                Buy
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="invisible absolute left-0 top-full z-20 mt-3 w-52 rounded-2xl border border-[#dce3dc] bg-white p-4 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <ul className="space-y-2 text-sm">
                  {BUY_MENU_ITEMS.map((item) => (
                    <li
                      key={item}
                      className="cursor-pointer rounded-lg px-2 py-1 transition-colors hover:bg-[#f2f5f2] hover:text-[#005129]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <span className="cursor-pointer transition-colors hover:text-[#005129]">
              Sell
            </span>
            <span className="cursor-pointer transition-colors hover:text-[#005129]">
              Resources
            </span>
            <span className="cursor-pointer transition-colors hover:text-[#005129]">
              About
            </span>
          </div>

          {isLoggedIn ? (
            <div className="hidden items-center gap-3 lg:flex">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#005129]">
                <UserRound className="h-4 w-4" />
                <span className="max-w-[180px] truncate">{displayName}</span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-full border border-[#cdd8cd] bg-white px-4 py-2 text-sm font-bold text-[#005129] transition-colors hover:bg-[#f2f5f2]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <button
                type="button"
                onClick={onOpenLogin}
                className="rounded-full px-4 py-2 text-sm font-bold text-[#005129] transition-transform hover:scale-105"
              >
                Login
              </button>
              <button
                type="button"
                onClick={onOpenSignup}
                className="rounded-full bg-[#005129] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#005129]/20 transition-transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe1db] bg-white/80 text-[#005129] lg:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#dbe1db] bg-[#fbf9f8] px-4 pb-6 pt-4 lg:hidden">
            <div className="space-y-4 text-sm font-semibold text-slate-700">
              <p className="text-[#005129]">Solutions</p>
              <div>
                <p className="mb-2 text-[#005129]">Buy</p>
                <div className="flex flex-wrap gap-2">
                  {BUY_MENU_ITEMS.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#dbe1db] bg-white px-3 py-1 text-xs text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <p>Sell</p>
              <p>Resources</p>
              <p>About</p>
              <div className="flex gap-2 pt-2">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#005129] px-4 py-2 text-xs font-bold text-[#005129]"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenLogin();
                      }}
                      className="rounded-full border border-[#005129] px-4 py-2 text-xs font-bold text-[#005129]"
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenSignup();
                      }}
                      className="rounded-full bg-[#005129] px-4 py-2 text-xs font-bold text-white"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:min-h-screen lg:px-8 lg:pb-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#fbf9f8] via-[#fbf9f8] to-[#89d89e]/20" />
          <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#005129]/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#006d39]/20 bg-[#8ef9ad]/20 px-3 py-1 text-xs font-bold text-[#006d39] sm:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#006d39] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#006d39]" />
              </span>
              Live Marketplace Active
            </div>

            <h1 className="marketplace1-headline max-w-3xl text-4xl font-black leading-[0.9] tracking-tight text-[#1b1c1c] sm:text-6xl lg:text-7xl xl:text-8xl">
              The Marketplace for <span className="text-[#005129]">Verified</span>{" "}
              Carbon Credits
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Empowering organizations to take immediate climate action through
              high-integrity carbon removals and avoidance projects globally.
            </p>

            <div className="flex flex-wrap gap-3 pt-2 sm:gap-4">
              <Link
                to={`${listingBasePath}/amazon-rainforest-protection`}
                className="inline-flex items-center gap-2 rounded-full bg-[#005129] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 sm:px-8 sm:py-4 sm:text-lg"
              >
                Browse Credits
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <button
                type="button"
                className="rounded-full border border-[#bfc9be]/50 bg-white px-6 py-3 text-sm font-bold text-[#005129] transition-transform hover:scale-105 sm:px-8 sm:py-4 sm:text-lg"
              >
                How it Works
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-square">
              <div className="marketplace1-orbit-spin absolute inset-0 opacity-20">
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full text-[#005129]"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="2 4"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="1 3"
                  />
                </svg>
              </div>
              <div className="mx-auto h-[370px] w-[370px] overflow-hidden rounded-full border-8 border-white bg-[#f6f3f2] shadow-2xl shadow-[#005129]/20 xl:h-96 xl:w-96">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIJ5cJWnoyT9ykVv1ZZvmtvsTZKLgWgvghRNMHuOlliOAHQbaLHgX1ZQLjJUmfM2IyJw8odYVEBM-HeZMCDlkqpZt83qoCb_8qmgyWRot1-WNuIayVF7CPZTY6WNKahjJBBt8zdK1xUT6_8aWdGyE50wKmCQ5JY7JKyLalY4xW-MIs8sxTsH_UyOa3yvjl5Kt0ciJPylPij0oYsVAdVpotwjE-f8YCSyzX1-1aLgUYvu5fDvjlj0ot1X5kzM5UFla7nqWLbp61V0w"
                  alt="Planet Earth orbital view"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="absolute right-8 top-10 h-4 w-4 animate-pulse rounded-full bg-[#006d39]" />
              <span className="absolute bottom-16 left-8 h-3 w-3 animate-bounce rounded-full bg-[#713500]" />
            </div>
          </div>
        </div>

        <div className="mt-14 flex justify-center text-slate-400">
          <ChevronDown className="h-7 w-7 animate-bounce" />
        </div>
      </section>

      <section className="bg-[#f6f3f2] py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center ${
                  index > 1 ? "md:border-l md:border-[#d3dbd3]" : ""
                } ${index % 2 === 1 ? "border-l border-[#e5e9e5] md:border-l-0" : ""}`}
              >
                <p className="text-3xl font-black text-[#005129] sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8 lg:py-24">
        <div className="group relative">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#eae8e7] shadow-2xl">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnbYiJitE1J-7d-7ZZgPdwiGvdtnvJRk9AxPEkdXCuWkYP7PrnEZm8pxD3Ue-AIdeyDd7TTsWqTdd3-Dk6G7dxIMVchNTJbTS7RrcDnp6SgDXRF2eHLbbitPwBpdCU4kFZD6oJDRzBVzQK_FEjPoWft9S8kLqVei-Y5sLFniVQ4Xl1tpZN9VrDFgHgkOtkFCEabt7I1nnxPnHag4Smms762LppiFRZt4Cgf4RXbsAaHDIz3MI9Lp5G2ze_F3TM4Zh3vbzSlG03o2g"
              alt="Reforestation project in misty morning light"
              className="h-full w-full object-cover grayscale-[0.35] transition-all duration-700 group-hover:grayscale-0"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#005129]/90 text-white transition-transform hover:scale-110 sm:h-20 sm:w-20"
                aria-label="Play project showcase"
              >
                <Play className="h-8 w-8 fill-current sm:h-10 sm:w-10" />
              </button>
            </div>
          </div>
          <div className="absolute -bottom-5 -right-5 -z-10 h-40 w-40 rounded-full bg-[#713500]/10 blur-2xl sm:h-48 sm:w-48" />
        </div>

        <div className="space-y-8 sm:space-y-10">
          <div className="space-y-4">
            <h2 className="marketplace1-headline text-3xl font-black text-[#1b1c1c] sm:text-4xl">
              Integrity in Every Ton.
            </h2>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              We do not just sell credits, we curate impact. Our vetting process
              ensures every ton of carbon avoided or removed is permanent,
              additional, and verifiable.
            </p>
          </div>

          <div className="space-y-5">
            {INTEGRITY_POINTS.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a6b3c]/10 text-[#005129]">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1b1c1c] sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 sm:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f3f2] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-4 text-center sm:mb-16">
            <h2 className="marketplace1-headline text-3xl font-black sm:text-4xl">
              Simplified Carbon Markets
            </h2>
            <div className="inline-flex rounded-full bg-[#eae8e7] p-1">
              <button
                type="button"
                className="rounded-full bg-[#005129] px-5 py-2 text-xs font-bold text-white shadow-sm sm:px-8 sm:text-sm"
              >
                For Buyers
              </button>
              <button
                type="button"
                className="rounded-full px-5 py-2 text-xs font-bold text-slate-500 transition-colors hover:text-[#005129] sm:px-8 sm:text-sm"
              >
                For Sellers
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {BUYER_STEPS.map((step) => (
              <article
                key={step.number}
                className={`group rounded-3xl border-b-4 border-transparent bg-white p-8 shadow-sm transition-all hover:border-[#005129] hover:shadow-xl sm:p-10 ${
                  step.elevated ? "md:translate-y-4" : ""
                }`}
              >
                <p className="mb-5 text-5xl font-black text-[#005129]/15 transition-colors group-hover:text-[#005129]/25 sm:text-6xl">
                  {step.number}
                </p>
                <h3 className="marketplace1-headline mb-3 text-2xl font-black">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="marketplace1-headline text-3xl font-black sm:text-4xl">
              Featured Projects
            </h2>
            <p className="mt-2 text-slate-500">Actively sequestering carbon right now.</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dce3dc] transition-colors hover:bg-[#f0eded]"
              aria-label="Previous projects"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dce3dc] transition-colors hover:bg-[#f0eded]"
              aria-label="Next projects"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="marketplace1-no-scrollbar flex gap-5 overflow-x-auto pb-6 sm:gap-8 sm:pb-8">
          {FEATURED_PROJECTS.map((project) => (
            <article
              key={project.id}
              className="group min-w-[280px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-lg sm:min-w-[320px]"
            >
              <div className="relative h-44 sm:h-48">
                <img
                  src={project.image}
                  alt={project.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#005129] backdrop-blur-sm">
                  {project.registry}
                </span>
              </div>
              <div className="space-y-3 p-5 sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  {project.location}
                </p>
                <h3 className="text-lg font-bold text-[#1b1c1c] sm:text-xl">
                  {project.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-[#005129]">
                    {project.price}
                    <span className="ml-1 text-sm font-normal text-slate-400">/ton</span>
                  </p>
                  <Link
                    to={`${listingBasePath}/${project.id}`}
                    className="inline-flex items-center text-[#005129] transition-transform hover:translate-x-1"
                    aria-label={`View ${project.name}`}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#bfc9be]/30 py-10 sm:py-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 text-center opacity-60 transition-opacity duration-500 hover:opacity-100 sm:gap-12 sm:px-6 lg:justify-between lg:px-8">
          {TRUSTED_BY.map((brand) => (
            <span
              key={brand}
              className="marketplace1-headline text-lg font-black tracking-[0.2em] sm:text-2xl"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[2rem] bg-[#005129] p-8 text-center sm:rounded-[2.5rem] sm:p-12 md:flex-row md:items-center md:justify-between md:text-left md:p-16">
          <div className="absolute right-0 top-0 h-72 w-72 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#1a6b3c] opacity-40 blur-[90px]" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="marketplace1-headline text-3xl font-black text-white sm:text-4xl md:text-5xl">
              Developed a high-impact climate project?
            </h2>
            <p className="text-base text-[#9ae9ae] sm:text-lg">
              Get listed on one of the most trusted carbon marketplaces and connect
              with institutional buyers searching for quality credits.
            </p>
          </div>
          <div className="relative z-10">
            <button
              type="button"
              className="rounded-full bg-[#8ef9ad] px-8 py-4 text-base font-black text-[#00210d] shadow-2xl transition-transform hover:scale-105 sm:px-10 sm:py-5 sm:text-xl"
            >
              Start Selling Now
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <h2 className="marketplace1-headline mb-10 text-center text-3xl font-black sm:mb-14 sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = activeFaq === index;
            return (
              <article
                key={item.question}
                className="rounded-2xl border border-transparent bg-[#f6f3f2] p-5 transition-colors hover:border-[#dbe1db] hover:bg-[#f0eded] sm:p-6"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <h3 className="text-base font-bold sm:text-lg">{item.question}</h3>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-[#005129]" : "text-slate-500"
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="pt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {item.answer}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-stone-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2">
            <div className="mb-5 flex items-center gap-2 text-lg font-bold text-[#153d29]">
              <Leaf className="h-5 w-5 text-[#005129]" />
              <span className="marketplace1-headline">Carbon Positive</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              Building infrastructure for a net-zero future through transparency,
              integrity, and practical climate action.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eae8e7] text-slate-700 transition-colors hover:bg-[#005129] hover:text-white"
                aria-label="Carbon Positive website"
              >
                <Globe2 className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eae8e7] text-slate-700 transition-colors hover:bg-[#005129] hover:text-white"
                aria-label="Carbon Positive social share"
              >
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="mb-3 text-sm font-bold text-[#1b1c1c] sm:text-base">
                {column.title}
              </h3>
              <ul className="space-y-2 text-sm text-slate-500">
                {column.links.map((link) => (
                  <li
                    key={link}
                    className="cursor-pointer transition-colors hover:text-[#005129]"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-stone-200 pt-6 text-sm text-slate-500 md:flex-row">
          <p>© 2026 Carbon Positive. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a href="#" className="transition-colors hover:text-[#005129]">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-[#005129]">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-[#005129]">
              Cookie Settings
            </a>
          </div>
        </div>
      </footer>

      <aside className="marketplace1-glass fixed bottom-4 left-1/2 z-40 hidden w-[min(92vw,1024px)] -translate-x-1/2 items-center gap-6 overflow-hidden rounded-full border border-white/30 bg-white/70 px-6 py-3 shadow-2xl md:flex">
        <div className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#005129]">
          <Bolt className="h-4 w-4" />
          Live Impact
        </div>
        <div className="marketplace1-marquee-track flex gap-12 whitespace-nowrap">
          {tickerTrack.map((entry, index) => (
            <span key={`${entry.bold}-${index}`} className="text-sm text-slate-600">
              <strong className="text-[#006d39]">{entry.bold}</strong> {entry.text}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}
