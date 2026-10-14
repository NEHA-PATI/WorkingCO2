import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  Globe2,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CircleMarker,
  MapContainer,
  Polygon,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarketplaceNavbar from "../components/MarketplaceNavbar";
import MarketplaceVerificationTimeline from "../components/MarketplaceVerificationTimeline";
import "../styles/marketplace1.css";

const SLUG_TO_ID = {
  "amazon-rainforest-protection": "VCS-1382",
  "mekong-delta-wind-farm": "GS-5921",
  "blue-carbon-mangroves": "PURO-229",
  "regenerative-soil-sequestration": "ACR-882",
};

const LISTING_SEED = {
  "VCS-1382": {
    name: "Amazonas REDD+ Preservation Project",
    registry: "Verra",
    registryId: "1477",
    methodology: "IFM/REDD+",
    location: "Amazonas, Brazil",
    region: "Jurua River Basin",
    price: 18.5,
    vintage: 2023,
    issuance: 2022,
    permanence: "100+ Years",
    rating: "A+",
    sdgs: 4,
    qty: 4200,
    areaHa: 243110,
    coords: [-3.46, -62.21],
    gallery: [
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1800",
      "https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&q=80&w=1200",
    ],
    seller: { name: "Ecosphere Asset Management", location: "Geneva, CH", trustScore: "9.8/10" },
  },
  "GS-5921": {
    name: "Binh Thuan Wind Cluster",
    registry: "Gold Standard",
    registryId: "5921",
    methodology: "Renewable Energy",
    location: "Binh Thuan, Vietnam",
    region: "South-Central Coast",
    price: 12.2,
    vintage: 2022,
    issuance: 2021,
    permanence: "40+ Years",
    rating: "A",
    sdgs: 3,
    qty: 128000,
    areaHa: 18200,
    coords: [11.08, 108.27],
    gallery: [
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1800",
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1467533003447-e295ff1b0435?auto=format&fit=crop&q=80&w=1200",
    ],
    seller: { name: "Delta Renewable Holdings", location: "Singapore, SG", trustScore: "9.3/10" },
  },
  "PURO-229": {
    name: "Kalimantan Blue Carbon",
    registry: "Puro.earth",
    registryId: "229",
    methodology: "Blue Carbon",
    location: "Kalimantan, Indonesia",
    region: "Mangrove Delta Zone",
    price: 45,
    vintage: 2024,
    issuance: 2023,
    permanence: "100+ Years",
    rating: "A+",
    sdgs: 5,
    qty: 8120,
    areaHa: 9640,
    coords: [-1.26, 115.21],
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1800",
      "https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1457530378978-8bac673b8062?auto=format&fit=crop&q=80&w=1200",
    ],
    seller: { name: "Blue Tides Conservation", location: "Jakarta, ID", trustScore: "9.7/10" },
  },
  "ACR-882": {
    name: "Appalachian Improved Forest",
    registry: "ACR",
    registryId: "882",
    methodology: "IFM",
    location: "West Virginia, USA",
    region: "Appalachian Core",
    price: 24.5,
    vintage: 2023,
    issuance: 2022,
    permanence: "100+ Years",
    rating: "B+",
    sdgs: 3,
    qty: 35000,
    areaHa: 38600,
    coords: [38.59, -80.45],
    gallery: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1800",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&q=80&w=1200",
    ],
    seller: { name: "Timberline Climate Trust", location: "Denver, US", trustScore: "9.1/10" },
  },
  "ISO-004": {
    name: "Orca Direct Air Capture",
    registry: "Isometric",
    registryId: "004",
    methodology: "DACCS",
    location: "Hellisheidi, Iceland",
    region: "Reykjanes Belt",
    price: 92,
    vintage: 2024,
    issuance: 2024,
    permanence: "1000+ Years",
    rating: "AAA",
    sdgs: 2,
    qty: 1200,
    areaHa: 120,
    coords: [64.03, -21.4],
    gallery: [
      "https://picsum.photos/seed/iso-004/1800/900",
      "https://picsum.photos/seed/iso-004-a/1200/700",
      "https://picsum.photos/seed/iso-004-b/1200/700",
      "https://picsum.photos/seed/iso-004-c/1200/700",
    ],
    seller: { name: "Nordic Carbon Systems", location: "Reykjavik, IS", trustScore: "9.9/10" },
  },
  "VCS-2210": {
    name: "Kenya Cookstove Project",
    registry: "Verra",
    registryId: "2210",
    methodology: "Cookstoves",
    location: "Nairobi, Kenya",
    region: "Nairobi County",
    price: 9.8,
    vintage: 2022,
    issuance: 2021,
    permanence: "40+ Years",
    rating: "A",
    sdgs: 6,
    qty: 250000,
    areaHa: 6400,
    coords: [-1.29, 36.82],
    gallery: [
      "https://picsum.photos/seed/vcs-2210/1800/900",
      "https://picsum.photos/seed/vcs-2210-a/1200/700",
      "https://picsum.photos/seed/vcs-2210-b/1200/700",
      "https://picsum.photos/seed/vcs-2210-c/1200/700",
    ],
    seller: { name: "East Africa Impact Fund", location: "Nairobi, KE", trustScore: "9.0/10" },
  },
  "PURO-312": {
    name: "Biochar Sludge Removal",
    registry: "Puro.earth",
    registryId: "312",
    methodology: "Biochar",
    location: "Espoo, Finland",
    region: "Uusimaa",
    price: 68,
    vintage: 2024,
    issuance: 2024,
    permanence: "1000+ Years",
    rating: "AAA",
    sdgs: 4,
    qty: 4500,
    areaHa: 420,
    coords: [60.2, 24.65],
    gallery: [
      "https://picsum.photos/seed/puro-312/1800/900",
      "https://picsum.photos/seed/puro-312-a/1200/700",
      "https://picsum.photos/seed/puro-312-b/1200/700",
      "https://picsum.photos/seed/puro-312-c/1200/700",
    ],
    seller: { name: "Circular Carbon Labs", location: "Helsinki, FI", trustScore: "9.8/10" },
  },
  "GS-4122": {
    name: "Andhra Pradesh Solar",
    registry: "Gold Standard",
    registryId: "4122",
    methodology: "Renewable Energy",
    location: "Andhra Pradesh, India",
    region: "Rayalaseema Solar Zone",
    price: 8.5,
    vintage: 2021,
    issuance: 2020,
    permanence: "40+ Years",
    rating: "B",
    sdgs: 2,
    qty: 500000,
    areaHa: 22500,
    coords: [15.91, 79.74],
    gallery: [
      "https://picsum.photos/seed/gs-4122/1800/900",
      "https://picsum.photos/seed/gs-4122-a/1200/700",
      "https://picsum.photos/seed/gs-4122-b/1200/700",
      "https://picsum.photos/seed/gs-4122-c/1200/700",
    ],
    seller: { name: "Surya Utility Markets", location: "Hyderabad, IN", trustScore: "8.9/10" },
  },
  "VCS-994": {
    name: "Congolian Basin Forestry",
    registry: "Verra",
    registryId: "994",
    methodology: "IFM/REDD+",
    location: "DR Congo",
    region: "Congo Basin",
    price: 21,
    vintage: 2023,
    issuance: 2022,
    permanence: "100+ Years",
    rating: "A",
    sdgs: 5,
    qty: 150000,
    areaHa: 97800,
    coords: [-4.03, 21.75],
    gallery: [
      "https://picsum.photos/seed/vcs-994/1800/900",
      "https://picsum.photos/seed/vcs-994-a/1200/700",
      "https://picsum.photos/seed/vcs-994-b/1200/700",
      "https://picsum.photos/seed/vcs-994-c/1200/700",
    ],
    seller: { name: "Basin Conservation Partners", location: "Kinshasa, CD", trustScore: "9.2/10" },
  },
  "CAR-606": {
    name: "Iowa Ag Methane",
    registry: "CAR",
    registryId: "606",
    methodology: "Agricultural",
    location: "Iowa, USA",
    region: "Midwest Agricultural Belt",
    price: 14.2,
    vintage: 2023,
    issuance: 2022,
    permanence: "40+ Years",
    rating: "B+",
    sdgs: 2,
    qty: 55000,
    areaHa: 16400,
    coords: [41.87, -93.09],
    gallery: [
      "https://picsum.photos/seed/car-606/1800/900",
      "https://picsum.photos/seed/car-606-a/1200/700",
      "https://picsum.photos/seed/car-606-b/1200/700",
      "https://picsum.photos/seed/car-606-c/1200/700",
    ],
    seller: { name: "Prairie Climate Cooperative", location: "Des Moines, US", trustScore: "8.7/10" },
  },
};

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function getProjectType(methodology = "") {
  const value = methodology.toLowerCase();
  if (value.includes("redd") || value.includes("ifm")) return "Nature-based";
  if (value.includes("renewable")) return "Energy Transition";
  if (value.includes("blue carbon")) return "Blue Carbon";
  if (value.includes("daccs") || value.includes("biochar")) return "Carbon Removal";
  if (value.includes("cookstoves")) return "Community Impact";
  if (value.includes("agricultural")) return "Methane Abatement";
  return "Mixed Portfolio";
}

function resolveListing(listingId) {
  const normalized = String(listingId || "").toLowerCase();
  const mappedId = SLUG_TO_ID[normalized];
  const key = mappedId || String(listingId || "").toUpperCase();
  const seed = LISTING_SEED[key];

  if (seed) return { id: key, ...seed };

  return {
    id: key || "CUSTOM-001",
    name: `${String(listingId || "custom").replace(/-/g, " ")} Project`,
    registry: "Registry",
    registryId: "0000",
    methodology: "Mixed Portfolio",
    location: "Global",
    region: "Registered Area",
    price: 19.5,
    vintage: 2023,
    issuance: 2022,
    permanence: "100+ Years",
    rating: "A",
    sdgs: 3,
    qty: 15000,
    areaHa: 12000,
    coords: [8, 0],
    gallery: [
      "https://picsum.photos/seed/marketplace-custom/1800/900",
      "https://picsum.photos/seed/marketplace-custom-a/1200/700",
      "https://picsum.photos/seed/marketplace-custom-b/1200/700",
      "https://picsum.photos/seed/marketplace-custom-c/1200/700",
    ],
    seller: { name: "Carbon Positive Seller", location: "Global", trustScore: "8.9/10" },
  };
}

function buildBoundary([lat, lng], areaHa) {
  const areaScale = Math.sqrt(Math.max(areaHa, 100)) / 450;
  const scale = clamp(areaScale, 0.3, 1.35);
  return [
    [lat + 0.8 * scale, lng - 1.1 * scale],
    [lat + 1.1 * scale, lng - 0.2 * scale],
    [lat + 0.6 * scale, lng + 1.0 * scale],
    [lat - 0.25 * scale, lng + 1.15 * scale],
    [lat - 0.85 * scale, lng + 0.35 * scale],
    [lat - 0.55 * scale, lng - 0.95 * scale],
  ];
}

function scaleBoundary(boundary, center, factor) {
  const [cLat, cLng] = center;
  return boundary.map(([lat, lng]) => [
    cLat + (lat - cLat) * factor,
    cLng + (lng - cLng) * factor,
  ]);
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const TAB_ITEMS = [
  { id: "description", label: "Description" },
  { id: "impact", label: "Impact & Scores" },
  { id: "documents", label: "Documents" },
];

export default function ListingDetailPage() {
  const { listingId } = useParams();
  const location = useLocation();
  const rootPath = location.pathname.startsWith("/marketplace1")
    ? "/marketplace1"
    : "/marketplace";
  const listing = useMemo(() => resolveListing(listingId), [listingId]);
  const projectType = useMemo(() => getProjectType(listing.methodology), [listing.methodology]);
  const boundary = useMemo(() => buildBoundary(listing.coords, listing.areaHa), [listing.areaHa, listing.coords]);
  const innerBoundary = useMemo(() => scaleBoundary(boundary, listing.coords, 0.72), [boundary, listing.coords]);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(100);
  const minQty = Math.min(10, listing.qty);

  useEffect(() => {
    setActiveTab("description");
    setSelectedImage(0);
    setQuantity(clamp(100, minQty, listing.qty));
  }, [listing.id, listing.qty, minQty]);

  const total = quantity * listing.price;
  const descriptionParagraphs = [
    `${listing.name} is governed through an institutional monitoring framework that prioritizes transparent measurement, reporting, and verification across each issuance cycle.`,
    "The project combines satellite observation, geospatial boundary checks, and local stewardship to maintain credit integrity and reduce reversal risk over time.",
    "Beyond carbon outcomes, the implementation plan includes biodiversity safeguards and measurable community co-benefits that are audited and documented annually.",
    "Every issuance lot is mapped to a verifiable boundary, with historical baselines and annual deltas reviewed before credits are released for trade.",
    "Carbon Positive applies layered controls including automated duplicate checks, manual evidence review, and legal attestations prior to publishing any listing.",
    "This process is designed for enterprise buyers who need traceable climate assets, consistent documentation quality, and continuous post-listing monitoring.",
  ];

  const impactMetrics = [
    ["tCO2e Avoided (Cumulative)", "1,244,812", "Permanence score 9.2/10", TrendingUp],
    ["Hectares Protected", listing.areaHa.toLocaleString(), "Biodiversity score 9.5/10", Globe2],
    ["Direct Beneficiaries", "15,244", "Community score 8.8/10", Users],
    ["Monitoring Coverage", "96%", "Near-real-time satellite cadence", CheckCircle2],
  ];

  const scoreBoxes = [
    ["Quality Rating", listing.rating],
    ["Permanence", listing.permanence],
    ["Project Type", projectType],
    ["Vintage", String(listing.vintage)],
    ["Issuance", String(listing.issuance)],
    ["SDG Alignment", `${listing.sdgs} Goals`],
    ["Registry", listing.registry],
    ["Geo Coverage", `${listing.areaHa.toLocaleString()} ha`],
  ];

  const documents = [
    ["Project Design Document (PDD).pdf", `${listing.registry} Ref ${listing.id} | 12.8 MB | Updated Oct 2025`, "Publicly Verified"],
    ["Monitoring & Verification Statement.pdf", "Independent VVB review | 4.2 MB | Updated Jan 2026", "Audit Complete"],
    ["Issuance and Retirement Ledger.csv", `${listing.registry} export | 2.6 MB | Updated Mar 2026`, "Registry Synced"],
    ["GIS Boundary and Land Tenure Pack.zip", "Boundary geometry + QA checks | 8.5 MB | Updated Mar 2026", "Controlled Access"],
  ];

  function updateQuantity(nextValue) {
    setQuantity(clamp(nextValue, minQty, listing.qty));
  }

  return (
    <div className="marketplace1-root min-h-screen bg-[#faf9f5] text-[#1a1c1a]">
      <MarketplaceNavbar rootPath={rootPath} activeItem="listings" />

      <main className="mx-auto max-w-screen-2xl pb-24 pt-24 sm:pt-28">
        <section className="marketplace1-detail-hero relative mb-12 w-full overflow-hidden">
          <Link
            to={`${rootPath}/browse`}
            className="absolute left-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/50 sm:left-6 sm:top-6"
            aria-label="Back to listings"
            title="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="h-full">
            <img
              src={listing.gallery[0]}
              alt={listing.name}
              className="marketplace1-detail-hero-image h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/35 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 lg:p-12">
            <div className="max-w-5xl space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  {listing.registry} ID: {listing.registryId}
                </span>
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  High Integrity
                </span>
              </div>
              <h1 className="marketplace1-headline max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                {listing.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-white/90">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/20 px-3 py-1.5">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1">
                  {listing.region}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="space-y-14 lg:col-span-8">
            <section className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-[#dbe3db] bg-white shadow-sm">
                <img
                  src={listing.gallery[selectedImage]}
                  alt={`${listing.name} preview`}
                  className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[460px]"
                />
              </div>
              <div className="grid h-24 grid-cols-4 gap-3 sm:h-32 sm:gap-4 lg:gap-6">
                {listing.gallery.map((image, index) => (
                  <button
                    key={`${listing.id}-gallery-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-xl border ${
                      selectedImage === index
                        ? "border-[#005129] ring-2 ring-[#005129]/20"
                        : "border-transparent hover:opacity-85"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${listing.name} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[#dbe3db] bg-white p-5 shadow-sm sm:p-8 lg:p-10">
              <div className="marketplace1-no-scrollbar mb-8 flex gap-8 overflow-x-auto border-b border-[#e5ece5] pb-1">
                {TAB_ITEMS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap border-b-2 pb-4 text-lg font-bold transition-colors ${
                      activeTab === tab.id
                        ? "border-[#005129] text-[#005129]"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "description" && (
                <div className="space-y-8">
                  <div className="space-y-4 text-[15px] leading-relaxed text-slate-600">
                    {descriptionParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-[#dbe3db] bg-[#f8faf8] p-4 sm:p-5">
                    <h3 className="marketplace1-headline text-lg font-bold text-slate-900 sm:text-xl">
                      Verification Coverage
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Boundary map and full methodology timeline are shown below
                      as dedicated sections for easier review during due
                      diligence.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-[#dbe3db] bg-white p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          Biome
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          Tropical Wet Forest
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#dbe3db] bg-white p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          Jurisdiction
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {listing.location}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#dbe3db] bg-white p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          Monitoring
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          Satellite + Ground Audit
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "impact" && (
                <div id="impact" className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {impactMetrics.map((metric) => {
                      const Icon = metric[3];
                      return (
                        <div
                          key={metric[0]}
                          className="rounded-2xl border border-[#dbe3db] bg-[#f9fbf9] p-4"
                        >
                          <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f4ea] text-[#005129]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <p className="marketplace1-headline text-2xl font-black text-[#005129]">
                            {metric[1]}
                          </p>
                          <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                            {metric[0]}
                          </p>
                          <p className="mt-2 text-xs font-semibold text-slate-600">
                            {metric[2]}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      Score Breakdown
                    </h4>
                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                      {scoreBoxes.map((item) => (
                        <div
                          key={item[0]}
                          className="rounded-xl border border-[#dbe3db] bg-white px-3 py-2.5"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            {item[0]}
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {item[1]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      SDG Performance
                    </h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-[#dbe3db] bg-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            SDG 15
                          </span>
                          <span className="rounded-full bg-[#edf3ed] px-2 py-0.5 text-[10px] font-bold text-[#005129]">
                            Verified
                          </span>
                        </div>
                        <h5 className="marketplace1-headline text-lg font-bold text-slate-900">
                          Life on Land
                        </h5>
                        <div className="mt-3 space-y-1.5 text-sm">
                          <div className="flex justify-between"><span className="text-slate-600">IUCN Species Monitored</span><span className="font-bold text-slate-800">42</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Reforested Buffer Area</span><span className="font-bold text-slate-800">1,400 ha</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Deforestation Risk Trend</span><span className="font-bold text-slate-800">-18% YoY</span></div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-[#dbe3db] bg-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            SDG 01
                          </span>
                          <span className="rounded-full bg-[#edf3ed] px-2 py-0.5 text-[10px] font-bold text-[#005129]">
                            Verified
                          </span>
                        </div>
                        <h5 className="marketplace1-headline text-lg font-bold text-slate-900">
                          No Poverty
                        </h5>
                        <div className="mt-3 space-y-1.5 text-sm">
                          <div className="flex justify-between"><span className="text-slate-600">Income Improvement</span><span className="font-bold text-slate-800">+34%</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Green Jobs Created</span><span className="font-bold text-slate-800">112</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Education Grants</span><span className="font-bold text-slate-800">450</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div id="documents" className="space-y-5">
                  <div className="rounded-2xl border border-[#dbe3db] bg-[#f8faf8] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="marketplace1-headline text-lg font-bold text-slate-900">
                          Registry Transparency Room
                        </h4>
                        <p className="text-sm text-slate-600">
                          Buyer-ready files for issuance, monitoring, and
                          retirement verification.
                        </p>
                      </div>
                      <span className="rounded-full border border-[#cfe0d2] bg-white px-3 py-1 text-xs font-bold text-[#005129]">
                        Last Sync: 2h ago
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {documents.map((document) => (
                      <button
                        key={document[0]}
                        type="button"
                        className="w-full rounded-2xl border border-[#dbe3db] bg-white p-4 text-left transition-colors hover:bg-[#f8faf8]"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#edf5ee] text-[#005129]">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-900">
                                {document[0]}
                              </p>
                              <p className="text-xs text-slate-500">
                                {document[1]}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-[#edf3ed] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#005129]">
                              {document[2]}
                            </span>
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe3db] text-slate-600">
                              <Download className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-[2.5rem] border border-[#dbe3db] bg-white p-6 shadow-sm sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#edf5ee] text-[#005129] sm:h-20 sm:w-20">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="marketplace1-headline text-xl font-bold text-slate-900">
                      {listing.seller.name}
                    </p>
                    <p className="text-sm text-slate-600">{listing.seller.location}</p>
                  </div>
                </div>
                <div className="space-y-1 text-left sm:text-right">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    Seller Trust Score
                  </p>
                  <p className="text-lg font-black text-[#005129]">
                    {listing.seller.trustScore}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <aside className="space-y-8 lg:sticky lg:top-12">
              <section className="rounded-[3rem] border border-[#dbe3db] bg-white p-6 shadow-sm sm:p-10">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-end gap-2">
                      <span className="marketplace1-headline text-5xl font-black text-[#005129]">
                        {formatPrice(listing.price)}
                      </span>
                      <span className="mb-1 text-sm font-bold text-slate-500">
                        / tCO2
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-[#cfe0d2] bg-[#edf6ee] px-3 py-2">
                      <span className="text-sm font-bold text-[#145c34]">
                        {listing.qty.toLocaleString()} tCO2 remaining
                      </span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#005129]">
                        Vintage {listing.vintage}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-[0.14em] text-slate-500">
                        Purchase Quantity
                      </span>
                      <span className="font-bold text-slate-500">
                        Min {minQty} tCO2
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-[#dbe3db] bg-[#f7faf7] p-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(quantity - 10)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#dbe3db] bg-white text-slate-700 transition-colors hover:bg-[#edf4ee]"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        min={minQty}
                        max={listing.qty}
                        onChange={(event) =>
                          updateQuantity(Number.parseInt(event.target.value, 10))
                        }
                        className="h-11 flex-1 rounded-xl border border-[#dbe3db] bg-white px-3 text-center text-xl font-black text-[#005129] outline-none focus:border-[#8bbf97]"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(quantity + 10)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#dbe3db] bg-white text-slate-700 transition-colors hover:bg-[#edf4ee]"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-dashed border-[#d8e1d8] pt-6">
                    <span className="text-sm font-bold text-slate-600">
                      Total Investment
                    </span>
                    <span className="marketplace1-headline text-2xl font-black text-[#005129]">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <Link
                    to={`${rootPath}/checkout/1`}
                    className="inline-flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[#005129] text-base font-black text-white shadow-lg shadow-[#005129]/20 transition-transform hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </Link>
                </div>

                <div className="mt-8 space-y-3 border-t border-[#e2e9e2] pt-7">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#edf5ee] text-[#005129]">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    Institutional escrow protection
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#edf5ee] text-[#005129]">
                      <CalendarDays className="h-4 w-4" />
                    </span>
                    Automated retirement certificate
                  </div>
                </div>
              </section>

              <section className="relative overflow-hidden rounded-[2.5rem] bg-emerald-950 p-8 text-white shadow-xl">
                <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-white/5" />
                <h4 className="relative z-10 mb-3 text-lg font-bold">
                  Large Volume Inquiries?
                </h4>
                <p className="relative z-10 mb-6 text-sm text-emerald-100/80">
                  For institutional orders over 50,000 tCO2, contact our private
                  placement desk.
                </p>
                <Link
                  to="/contact"
                  className="relative z-10 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-950 transition-all hover:gap-3"
                >
                  Contact Advisor
                </Link>
              </section>
            </aside>
          </div>
        </div>

        <section className="mt-10 px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#dbe3db] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="marketplace1-headline text-xl font-bold text-slate-900 sm:text-2xl">
                  Project Boundary & Land Area
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Geospatial view of the registered zone with highlighted land
                  boundary and active monitoring centroid.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[#cfe0d2] bg-[#f8fcf9] px-3 py-1 text-xs font-bold text-[#005129]">
                  {listing.areaHa.toLocaleString()} ha
                </span>
                <span className="rounded-full border border-[#cfe0d2] bg-[#f8fcf9] px-3 py-1 text-xs font-bold text-[#005129]">
                  {projectType}
                </span>
                <span className="rounded-full border border-[#cfe0d2] bg-[#f8fcf9] px-3 py-1 text-xs font-bold text-[#005129]">
                  {listing.location}
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#dbe3db]">
              <MapContainer
                center={listing.coords}
                zoom={7}
                scrollWheelZoom={false}
                className="marketplace1-detail-map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <Polygon
                  positions={boundary}
                  pathOptions={{
                    color: "#005129",
                    weight: 2.5,
                    fillColor: "#72dc93",
                    fillOpacity: 0.22,
                  }}
                />
                <Polygon
                  positions={innerBoundary}
                  pathOptions={{
                    color: "#1a6b3c",
                    weight: 1.5,
                    dashArray: "6 6",
                    fillColor: "#89d89e",
                    fillOpacity: 0.18,
                  }}
                />
                <CircleMarker
                  center={listing.coords}
                  radius={7}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 2,
                    fillColor: "#005129",
                    fillOpacity: 1,
                  }}
                >
                  <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                    <span className="text-xs font-bold">{listing.region}</span>
                  </Tooltip>
                </CircleMarker>
              </MapContainer>
            </div>
          </div>
        </section>

        <section className="mt-10 px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#dbe3db] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <MarketplaceVerificationTimeline />
          </div>
        </section>
      </main>
    </div>
  );
}
