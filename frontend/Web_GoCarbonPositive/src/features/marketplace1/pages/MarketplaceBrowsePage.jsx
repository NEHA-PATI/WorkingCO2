import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Filter,
  Globe2,
  Grid3X3,
  Leaf,
  List,
  Map as MapIcon,
  MapPin,
  ReceiptText,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarketplaceNavbar from "../components/MarketplaceNavbar";
import "../styles/marketplace1.css";

const BROWSE_PROJECTS = [
  {
    id: "VCS-1382",
    name: "Amazonas REDD+ Preservation",
    registry: "Verra",
    methodology: "IFM/REDD+",
    price: 18.5,
    location: "Amazonas, Brazil",
    coords: [-3.46, -62.21],
    vintage: 2023,
    permanence: "100+ Years",
    permanenceYears: 100,
    rating: "A+",
    sdgs: 4,
    qty: 42500,
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "GS-5921",
    name: "Binh Thuan Wind Cluster",
    registry: "Gold Standard",
    methodology: "Renewable Energy",
    price: 12.2,
    location: "Binh Thuan, Vietnam",
    coords: [11.08, 108.27],
    vintage: 2022,
    permanence: "40+ Years",
    permanenceYears: 40,
    rating: "A",
    sdgs: 3,
    qty: 128000,
    image:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "PURO-229",
    name: "Kalimantan Blue Carbon",
    registry: "Puro.earth",
    methodology: "Blue Carbon",
    price: 45,
    location: "Kalimantan, Indonesia",
    coords: [-1.26, 115.21],
    vintage: 2024,
    permanence: "100+ Years",
    permanenceYears: 100,
    rating: "A+",
    sdgs: 5,
    qty: 8120,
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ISO-004",
    name: "Orca Direct Air Capture",
    registry: "Isometric",
    methodology: "DACCS",
    price: 92,
    location: "Hellisheidi, Iceland",
    coords: [64.03, -21.4],
    vintage: 2024,
    permanence: "1000+ Years",
    permanenceYears: 1000,
    rating: "AAA",
    sdgs: 2,
    qty: 1200,
    image:
      "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ACR-882",
    name: "Appalachian Improved Forest",
    registry: "ACR",
    methodology: "IFM",
    price: 24.5,
    location: "West Virginia, USA",
    coords: [38.59, -80.45],
    vintage: 2023,
    permanence: "100+ Years",
    permanenceYears: 100,
    rating: "B+",
    sdgs: 3,
    qty: 35000,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "VCS-2210",
    name: "Kenya Cookstove Project",
    registry: "Verra",
    methodology: "Cookstoves",
    price: 9.8,
    location: "Nairobi, Kenya",
    coords: [-1.29, 36.82],
    vintage: 2022,
    permanence: "40+ Years",
    permanenceYears: 40,
    rating: "A",
    sdgs: 6,
    qty: 250000,
    image:
      "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "PURO-312",
    name: "Biochar Sludge Removal",
    registry: "Puro.earth",
    methodology: "Biochar",
    price: 68,
    location: "Espoo, Finland",
    coords: [60.2, 24.65],
    vintage: 2024,
    permanence: "1000+ Years",
    permanenceYears: 1000,
    rating: "AAA",
    sdgs: 4,
    qty: 4500,
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024adb0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "GS-4122",
    name: "Andhra Pradesh Solar",
    registry: "Gold Standard",
    methodology: "Renewable Energy",
    price: 8.5,
    location: "Andhra Pradesh, India",
    coords: [15.91, 79.74],
    vintage: 2021,
    permanence: "40+ Years",
    permanenceYears: 40,
    rating: "B",
    sdgs: 2,
    qty: 500000,
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "VCS-994",
    name: "Congolian Basin Forestry",
    registry: "Verra",
    methodology: "IFM/REDD+",
    price: 21,
    location: "DR Congo",
    coords: [-4.03, 21.75],
    vintage: 2023,
    permanence: "100+ Years",
    permanenceYears: 100,
    rating: "A",
    sdgs: 5,
    qty: 150000,
    image:
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "CAR-606",
    name: "Iowa Ag Methane",
    registry: "CAR",
    methodology: "Agricultural",
    price: 14.2,
    location: "Iowa, USA",
    coords: [41.87, -93.09],
    vintage: 2023,
    permanence: "40+ Years",
    permanenceYears: 40,
    rating: "B+",
    sdgs: 2,
    qty: 55000,
    image:
      "https://images.unsplash.com/photo-1509391366360-fe5bb6585828?auto=format&fit=crop&q=80&w=800",
  },
];

const PERMANENCE_OPTIONS = [40, 100, 1000];
const VIEW_OPTIONS = [
  { id: "grid", label: "Grid", icon: Grid3X3 },
  { id: "list", label: "List", icon: List },
  { id: "map", label: "Map", icon: MapIcon },
];

const REGISTRY_OPTIONS = Array.from(
  new Set(BROWSE_PROJECTS.map((project) => project.registry)),
);
const METHODOLOGY_OPTIONS = [
  "IFM",
  "REDD+",
  "Renewable Energy",
  "Blue Carbon",
  "DACCS",
  "Biochar",
  "Agricultural",
  "Cookstoves",
];
const MAX_QTY = Math.max(...BROWSE_PROJECTS.map((project) => project.qty), 1);
const COUNTRY_OPTIONS = Array.from(
  new Set(
    BROWSE_PROJECTS.map((project) => {
      const parts = project.location.split(",");
      return (parts[parts.length - 1] || project.location).trim();
    }),
  ),
).sort((a, b) => a.localeCompare(b));

const PROJECT_DETAILS_BY_ID = {
  "VCS-1382": "Forest conservation with community-based anti-deforestation patrols.",
  "GS-5921": "Utility-scale wind deployment displacing fossil-heavy grid power.",
  "PURO-229": "Mangrove restoration protecting coastlines and blue-carbon sinks.",
  "ISO-004": "Engineered direct-air-capture with long-term geological storage.",
  "ACR-882": "Improved forest management increasing canopy health and resilience.",
  "VCS-2210": "Efficient cookstoves reducing fuel use and indoor air pollution.",
  "PURO-312": "Biochar pathway with robust MRV and durable carbon locking.",
  "GS-4122": "Distributed solar capacity expansion for high-demand regional grids.",
  "VCS-994": "Large-scale tropical forest preservation across high-risk zones.",
  "CAR-606": "Agricultural methane reduction through capture and utilization.",
};

function getProjectCountry(project) {
  const parts = project.location.split(",");
  return (parts[parts.length - 1] || project.location).trim();
}

function getProjectType(methodology) {
  const normalized = methodology.toLowerCase();
  if (normalized.includes("renewable")) return "Energy Transition";
  if (normalized.includes("daccs")) return "Engineered Removal";
  if (normalized.includes("biochar")) return "Carbon Removal";
  if (normalized.includes("cookstoves")) return "Community Impact";
  if (normalized.includes("agricultural")) return "Methane Abatement";
  if (normalized.includes("blue carbon")) return "Blue Carbon";
  if (normalized.includes("ifm") || normalized.includes("redd")) {
    return "Nature-based";
  }
  return "Mixed Portfolio";
}

function getIssuanceYear(project) {
  return Math.max(2019, project.vintage - 1);
}

function getProjectDetails(project) {
  return (
    PROJECT_DETAILS_BY_ID[project.id] ||
    "Verified credits with registry-backed issuance and transparent traceability."
  );
}

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function isMethodMatch(methodology, selectedTokens) {
  if (!selectedTokens.length) return true;
  const normalizedMethod = methodology.toLowerCase();
  return selectedTokens.some((token) =>
    normalizedMethod.includes(token.toLowerCase()),
  );
}

export default function MarketplaceBrowsePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const rootPath = location.pathname.startsWith("/marketplace1")
    ? "/marketplace1"
    : "/marketplace";

  const [view, setView] = useState("grid");
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(110);
  const [selectedRegistries, setSelectedRegistries] = useState([]);
  const [selectedMethodologies, setSelectedMethodologies] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [minPermanenceYears, setMinPermanenceYears] = useState(0);
  const viewTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
    },
    [],
  );

  const filteredProjects = BROWSE_PROJECTS.filter((project) => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      project.name.toLowerCase().includes(normalizedSearch) ||
      project.id.toLowerCase().includes(normalizedSearch);
    const matchesPrice = project.price <= maxPrice;
    const matchesRegistry =
      !selectedRegistries.length || selectedRegistries.includes(project.registry);
    const matchesMethodology = isMethodMatch(
      project.methodology,
      selectedMethodologies,
    );
    const matchesCountry =
      selectedCountry === "all" || getProjectCountry(project) === selectedCountry;
    const matchesPermanence = project.permanenceYears >= minPermanenceYears;
    return (
      matchesSearch &&
      matchesPrice &&
      matchesRegistry &&
      matchesMethodology &&
      matchesCountry &&
      matchesPermanence
    );
  });

  const totalTonnes = filteredProjects.reduce((sum, item) => sum + item.qty, 0);
  const mapCenter = filteredProjects.length ? filteredProjects[0].coords : [20, 0];
  const mapKey = filteredProjects.map((item) => item.id).join("-") || "empty";

  const switchView = (nextView) => {
    if (nextView === view) return;
    if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
    setIsViewLoading(true);
    setView(nextView);
    viewTimerRef.current = setTimeout(() => setIsViewLoading(false), 220);
  };

  const toggleRegistry = (registry) => {
    setSelectedRegistries((current) =>
      current.includes(registry)
        ? current.filter((item) => item !== registry)
        : [...current, registry],
    );
  };

  const toggleMethodology = (methodology) => {
    setSelectedMethodologies((current) =>
      current.includes(methodology)
        ? current.filter((item) => item !== methodology)
        : [...current, methodology],
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setMaxPrice(110);
    setSelectedRegistries([]);
    setSelectedMethodologies([]);
    setSelectedCountry("all");
    setMinPermanenceYears(0);
  };

  return (
    <div className="marketplace1-root min-h-screen bg-[#faf9f5] text-[#1a1c1a]">
      <MarketplaceBrowsePageContent
        rootPath={rootPath}
        view={view}
        onSwitchView={switchView}
        isViewLoading={isViewLoading}
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        selectedRegistries={selectedRegistries}
        toggleRegistry={toggleRegistry}
        selectedMethodologies={selectedMethodologies}
        toggleMethodology={toggleMethodology}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        minPermanenceYears={minPermanenceYears}
        setMinPermanenceYears={setMinPermanenceYears}
        resetFilters={resetFilters}
        filteredProjects={filteredProjects}
        totalTonnes={totalTonnes}
        mapCenter={mapCenter}
        mapKey={mapKey}
        onOpenListing={(projectId) => navigate(`${rootPath}/listing/${projectId}`)}
      />
    </div>
  );
}

function MarketplaceBrowsePageContent({
  rootPath,
  view,
  onSwitchView,
  isViewLoading,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  searchQuery,
  setSearchQuery,
  maxPrice,
  setMaxPrice,
  selectedRegistries,
  toggleRegistry,
  selectedMethodologies,
  toggleMethodology,
  selectedCountry,
  setSelectedCountry,
  minPermanenceYears,
  setMinPermanenceYears,
  resetFilters,
  filteredProjects,
  totalTonnes,
  mapCenter,
  mapKey,
  onOpenListing,
}) {
  const filtersPanel = (
    <div className="space-y-7">
      <div>
        <h2 className="marketplace1-headline text-lg font-bold tracking-tight text-[#1A6B3C]">
          Project Filters
        </h2>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Refine by integrity metrics
        </p>
      </div>

      <section>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Registries
        </h3>
        <div className="space-y-2.5">
          {REGISTRY_OPTIONS.map((registry) => (
            <label key={registry} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={selectedRegistries.includes(registry)}
                onChange={() => toggleRegistry(registry)}
                className="h-4 w-4 rounded border-slate-300 text-[#1A6B3C] focus:ring-[#1A6B3C]"
              />
              <span>{registry}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Price Range ($/ton)
        </h3>
        <input
          type="range"
          min={0}
          max={110}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg accent-[#1A6B3C]"
        />
        <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-500">
          <span>$0</span>
          <span>Up to ${maxPrice}</span>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Methodology Type
        </h3>
        <div className="space-y-2.5">
          {METHODOLOGY_OPTIONS.map((methodology) => (
            <label key={methodology} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={selectedMethodologies.includes(methodology)}
                onChange={() => toggleMethodology(methodology)}
                className="h-4 w-4 rounded border-slate-300 text-[#1A6B3C] focus:ring-[#1A6B3C]"
              />
              <span>{methodology}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Country
        </h3>
        <div className="relative">
          <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={selectedCountry}
            onChange={(event) => setSelectedCountry(event.target.value)}
            className="w-full rounded-xl border border-[#d8ded8] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#1A6B3C]/40 focus:ring-2 focus:ring-[#1A6B3C]/20"
          >
            <option value="all">All Locations</option>
            {COUNTRY_OPTIONS.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Min. Permanence
        </h3>
        <div className="flex flex-wrap gap-2">
          {PERMANENCE_OPTIONS.map((years) => (
            <button
              key={years}
              type="button"
              onClick={() =>
                setMinPermanenceYears((current) => (current === years ? 0 : years))
              }
              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${
                minPermanenceYears === years
                  ? "border-[#1A6B3C] bg-[#1A6B3C] text-white"
                  : "border-[#c8d2c8] bg-white text-slate-600 hover:border-[#1A6B3C] hover:text-[#1A6B3C]"
              }`}
            >
              {years}+ Yrs
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={resetFilters}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d8ded8] bg-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600 transition-colors hover:text-[#1A6B3C]"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset All Filters
      </button>
    </div>
  );

  return (
    <>
      <MarketplaceNavbar rootPath={rootPath} activeItem="listings" />

      <div className="mx-auto max-w-[1700px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-6 xl:flex-row">
          <aside className="hidden xl:block xl:w-[290px]">
            <div className="sticky top-24 rounded-2xl border border-[#dce2dc] bg-[#f4f4f0] p-5 shadow-sm">{filtersPanel}</div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-8 space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="marketplace1-headline text-3xl font-bold tracking-tight sm:text-4xl">Carbon Credit Registry</h1>
                  <p className="mt-1 text-sm text-slate-500">
                    {filteredProjects.length} projects matching your criteria.{" "}
                    <span className="font-semibold text-[#1A6B3C]">{totalTonnes.toLocaleString()} tonnes</span> available.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#d8ded8] bg-white px-3 py-2 text-sm font-bold text-[#1A6B3C] xl:hidden"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </button>
                  <label className="relative w-full sm:w-[320px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search by Project ID or Name..."
                      className="w-full rounded-xl border border-transparent bg-[#eef1ee] py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#1A6B3C]/30 focus:bg-white focus:shadow-[0_0_0_1px_#1A6B3C]"
                    />
                  </label>
                  <div className="inline-flex items-center gap-1 rounded-xl bg-[#e8ece8] p-1">
                    {VIEW_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => onSwitchView(option.id)}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold transition-all sm:text-sm ${
                          view === option.id ? "bg-white text-[#1A6B3C] shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        <option.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {isViewLoading ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div className="h-[360px] animate-pulse rounded-2xl bg-[#e9eeea]" />
                <div className="h-[360px] animate-pulse rounded-2xl bg-[#e9eeea]" />
                <div className="h-[360px] animate-pulse rounded-2xl bg-[#e9eeea] md:col-span-2 xl:col-span-1" />
              </div>
            ) : (
              <BrowseViewSwitcher
                view={view}
                rootPath={rootPath}
                filteredProjects={filteredProjects}
                mapCenter={mapCenter}
                mapKey={mapKey}
                onOpenListing={onOpenListing}
              />
            )}
          </main>
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-7 right-7 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1A6B3C] text-white shadow-2xl transition-transform hover:scale-105 active:scale-95"
        aria-label="Open order cart"
      >
        <ReceiptText className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#faf9f5] bg-[#ba1a1a] text-[10px] font-bold">3</span>
      </button>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[85] xl:hidden">
          <button type="button" className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" />
          <aside className="marketplace1-no-scrollbar absolute left-0 top-0 h-full w-[88vw] max-w-sm overflow-y-auto border-r border-[#dbe3db] bg-[#f4f4f0] p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#1A6B3C]">
                <Filter className="h-4 w-4" />
                Filters
              </span>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-slate-700" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            {filtersPanel}
          </aside>
        </div>
      )}
    </>
  );
}

function BrowseViewSwitcher({
  view,
  rootPath,
  filteredProjects,
  mapCenter,
  mapKey,
  onOpenListing,
}) {
  if (view === "list") {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#dbe3db] bg-white">
        <div className="marketplace1-no-scrollbar overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse text-left">
            <thead className="border-b border-[#e1e7e1] bg-[#f3f6f3]">
              <tr>
                <th className="p-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Project / ID</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Methodology</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Registry</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Location</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Vintage</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Rating</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">$/Ton</th>
                <th className="p-4 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Qty Avail.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2ee]">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="group cursor-pointer transition-colors hover:bg-[#f6faf7]" onClick={() => onOpenListing(project.id)}>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 transition-colors group-hover:text-[#1A6B3C]">{project.name}</span>
                      <span className="mt-1 text-[10px] font-mono text-slate-500">{project.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-600">{project.methodology}</td>
                  <td className="p-4"><span className="rounded-full bg-[#edf1ed] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">{project.registry}</span></td>
                  <td className="p-4 text-xs text-slate-600">{project.location}</td>
                  <td className="p-4 text-xs font-mono font-bold text-slate-700">{project.vintage}</td>
                  <td className="p-4"><span className="rounded bg-[#c7ebd2]/45 px-2 py-1 text-[10px] font-bold text-[#1A6B3C]">{project.rating}</span></td>
                  <td className="p-4 text-sm font-bold text-[#1A6B3C]">{formatPrice(project.price)}</td>
                  <td className="p-4 text-right text-xs font-mono font-bold text-slate-600">{project.qty.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (view === "map") {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#dbe3db] bg-white shadow-sm">
        <MapContainer key={mapKey} center={mapCenter} zoom={2} scrollWheelZoom className="marketplace1-map-view">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {filteredProjects.map((project) => (
            <CircleMarker
              key={project.id}
              center={project.coords}
              radius={8}
              pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#1A6B3C", fillOpacity: 0.92 }}
            >
              <Popup className="marketplace1-map-popup" minWidth={230}>
                <div className="space-y-2.5">
                  <img src={project.image} alt={project.name} className="h-24 w-full rounded-lg object-cover" loading="lazy" />
                  <h4 className="marketplace1-headline text-sm font-bold text-slate-900">{project.name}</h4>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    <span>{project.id}</span>
                    <span className="text-[#1A6B3C]">{project.rating}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#edf1ed] pt-2">
                    <span className="text-sm font-bold text-[#1A6B3C]">{formatPrice(project.price)}</span>
                    <span className="text-[10px] font-semibold text-slate-500">{project.qty.toLocaleString()} t</span>
                  </div>
                  <Link
                    to={`${rootPath}/listing/${project.id}`}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-[#1A6B3C] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#14542f]"
                  >
                    View Listing
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {filteredProjects.map((project) => {
        const volumeFill = Math.max(
          8,
          Math.round((project.qty / MAX_QTY) * 100),
        );
        const projectType = getProjectType(project.methodology);
        const issuanceYear = getIssuanceYear(project);
        const projectDetails = getProjectDetails(project);

        return (
          <Link
            key={project.id}
            to={`${rootPath}/listing/${project.id}`}
            className="group overflow-hidden rounded-2xl border border-[#dbe3db] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={project.image}
                alt={project.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#1A6B3C]/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white">
                  {project.registry}
                </span>
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-700">
                  {project.vintage}
                </span>
                <span className="rounded-full bg-black/75 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white">
                  {project.rating}
                </span>
              </div>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="marketplace1-headline text-lg font-bold text-slate-900 transition-colors group-hover:text-[#1A6B3C]">
                  {project.name}
                </h3>
                <span className="rounded bg-[#ecefec] px-2 py-1 text-[10px] font-mono font-bold text-slate-500">
                  {project.id}
                </span>
              </div>

              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                {project.location}
              </p>

              <div className="space-y-2 border-t border-[#e6ece6] pt-3">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Project Type
                  </span>
                  <span className="text-right font-semibold text-slate-700">
                    {projectType}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Vintage
                  </span>
                  <span className="text-right font-semibold text-slate-700">
                    {project.vintage}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Issuance
                  </span>
                  <span className="text-right font-semibold text-slate-700">
                    {issuanceYear}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Methodology
                  </span>
                  <span className="text-right font-semibold text-slate-700">
                    {project.methodology}
                  </span>
                </div>
                <div className="rounded-lg bg-[#f4f7f4] px-2.5 py-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Details
                  </p>
                  <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-600">
                    {projectDetails}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[#1A6B3C]/20 bg-gradient-to-r from-[#edf8f0] to-[#f6fbf7] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#2e5b3f]">
                      Available Tons
                    </span>
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1A6B3C]/12 text-[#1A6B3C]">
                      <Leaf className="h-3 w-3" />
                    </span>
                  </div>
                  <p className="marketplace1-headline mt-1 text-lg font-bold text-[#14542f]">
                    {project.qty.toLocaleString()}
                    <span className="ml-1 text-[10px] font-semibold text-[#1A6B3C]/80">
                      t
                    </span>
                  </p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/80">
                    <div
                      className="h-full rounded-full bg-[#1A6B3C]"
                      style={{ width: `${volumeFill}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-[#dfe6df] bg-[#f2f5f2] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Price / Tonne
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#1A6B3C]">
                      {project.rating}
                    </span>
                  </div>
                  <p className="marketplace1-headline mt-1 text-2xl font-bold text-[#1A6B3C]">
                    {formatPrice(project.price)}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    SDG: {project.sdgs} goals
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
