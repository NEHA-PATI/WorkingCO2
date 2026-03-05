const registries = [
  { id: "verra", name: "Verra", code: "VCS", valuation: 1.03, liquidity: 1.08 },
  { id: "gold-standard", name: "Gold Standard", code: "GS", valuation: 1.05, liquidity: 1.03 },
  { id: "acr", name: "American Carbon Registry", code: "ACR", valuation: 1.04, liquidity: 0.96 },
  { id: "car", name: "Climate Action Reserve", code: "CAR", valuation: 1.02, liquidity: 0.94 },
  { id: "puro-earth", name: "Puro.earth", code: "PURO", valuation: 1.19, liquidity: 0.74 },
  { id: "carbonfuture", name: "Carbonfuture", code: "CF", valuation: 1.16, liquidity: 0.71 },
];

const ratingPremiumMultipliers = { AAA: 1.26, AA: 1.15, A: 1.07, BBB: 1, BB: 0.88 };
const ratingScore = { AAA: 96, AA: 88, A: 80, BBB: 73, BB: 64 };
const qualityCategory = { AAA: "premium", AA: "high", A: "standard", BBB: "standard", BB: "basic" };

const projectTypeRegimes = {
  "Nature-Based Solutions": { base: 24, vol: 24, liq: 78, type: "avoidance" },
  "Renewable Energy": { base: 13, vol: 12, liq: 84, type: "avoidance" },
  Biochar: { base: 105, vol: 10, liq: 46, type: "removal" },
  "Direct Air Capture": { base: 220, vol: 8, liq: 30, type: "removal" },
  "Industrial CCS": { base: 128, vol: 9, liq: 40, type: "removal" },
  "Blue Carbon": { base: 49, vol: 18, liq: 58, type: "removal" },
  "Methane Capture": { base: 33, vol: 15, liq: 65, type: "avoidance" },
  "Waste-to-Energy": { base: 27, vol: 14, liq: 62, type: "hybrid" },
};

const seeds = [
  { id: "CRD-NBS-001", name: "Amazon Corridor Protection Initiative", registryId: "verra", projectType: "Nature-Based Solutions", score: "AA", vintage: 2022, issuanceYear: 2020, availableVolume: 92000, country: "Brazil", methodology: "VM0015", permanenceYears: 35, additionality: "Additionality validated via counterfactual deforestation pathway.", coBenefits: ["Biodiversity", "Watershed", "Community"], minimumPurchase: 25 },
  { id: "CRD-REN-001", name: "Western India Utility Solar Cluster", registryId: "gold-standard", projectType: "Renewable Energy", score: "A", vintage: 2024, issuanceYear: 2021, availableVolume: 128000, country: "India", methodology: "GS-RE-001", permanenceYears: 18, additionality: "Financial additionality met under IRR threshold test.", coBenefits: ["Clean Grid", "Air Quality"], minimumPurchase: 40 },
  { id: "CRD-BIO-001", name: "Nordic Biochar Carbon Removal Pool", registryId: "puro-earth", projectType: "Biochar", score: "AAA", vintage: 2025, issuanceYear: 2023, availableVolume: 21000, country: "Finland", methodology: "Puro-BCR-2022", permanenceYears: 200, additionality: "Durable storage and feedstock diversion validated by lifecycle accounting.", coBenefits: ["Soil Carbon", "Circularity"], minimumPurchase: 5 },
  { id: "CRD-DAC-001", name: "Basin Direct Air Capture Hub", registryId: "carbonfuture", projectType: "Direct Air Capture", score: "AAA", vintage: 2025, issuanceYear: 2024, availableVolume: 8600, country: "United States", methodology: "CF-DAC-01", permanenceYears: 1000, additionality: "Capex-dependent engineered removal; no viable baseline financing path.", coBenefits: ["Innovation", "Deep Decarbonization"], minimumPurchase: 1 },
  { id: "CRD-CCS-001", name: "Steel Kiln Carbon Capture Retrofit", registryId: "acr", projectType: "Industrial CCS", score: "AA", vintage: 2023, issuanceYear: 2021, availableVolume: 18800, country: "United States", methodology: "ACR-ICCS-02", permanenceYears: 500, additionality: "Retrofit economics non-viable without credit revenue support.", coBenefits: ["Industrial Transition"], minimumPurchase: 3 },
  { id: "CRD-BLUE-001", name: "Delta Mangrove Restoration Portfolio", registryId: "verra", projectType: "Blue Carbon", score: "AA", vintage: 2021, issuanceYear: 2018, availableVolume: 33200, country: "Indonesia", methodology: "VM0033", permanenceYears: 70, additionality: "Independent coastal baseline demonstrates restoration additionality.", coBenefits: ["Coastal Protection", "Fisheries"], minimumPurchase: 8 },
  { id: "CRD-MTH-001", name: "Metro Landfill Methane Capture", registryId: "car", projectType: "Methane Capture", score: "A", vintage: 2024, issuanceYear: 2021, availableVolume: 64400, country: "Mexico", methodology: "CAR-LFG-04", permanenceYears: 18, additionality: "Capture rates exceed regulatory baseline through monitored controls.", coBenefits: ["Public Health", "Power"], minimumPurchase: 12 },
  { id: "CRD-WTE-001", name: "Urban Waste-to-Energy Expansion", registryId: "gold-standard", projectType: "Waste-to-Energy", score: "BB", vintage: 2022, issuanceYear: 2019, availableVolume: 51200, country: "Turkey", methodology: "GS-WTE-06", permanenceYears: 22, additionality: "Additionality supported by constrained municipal offtake economics.", coBenefits: ["Waste Diversion", "Grid Reliability"], minimumPurchase: 10 },
];

const registryById = Object.fromEntries(registries.map((r) => [r.id, r]));

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function rng(seed) {
  let x = seed >>> 0;
  return () => {
    x += 0x6d2b79f5;
    let t = Math.imul(x ^ (x >>> 15), x | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeHistory(credit, regime, registry) {
  const random = rng(hash(credit.id));
  const base = regime.base * (ratingPremiumMultipliers[credit.score] || 1) * (registry?.valuation || 1);
  const dailyVol = clamp((regime.vol / 100) * (1 + (100 - regime.liq) / 240) / 11, 0.004, 0.06);
  let prev = base;
  const points = [];

  for (let d = 240; d >= 0; d -= 1) {
    const dt = new Date();
    dt.setDate(dt.getDate() - d);
    const drift = (random() - 0.48) * dailyVol;
    const shock = (random() - 0.5) * dailyVol * 1.8;
    const open = prev;
    const close = clamp(open * (1 + drift + shock), base * 0.45, base * 2.5);
    const high = Math.max(open, close) * (1 + random() * dailyVol * 0.9);
    const low = Math.min(open, close) * (1 - random() * dailyVol * 0.9);
    const volume = Math.max(1, Math.round(credit.availableVolume * 0.002 * (regime.liq / 100) * (0.7 + random())));
    points.push({
      date: dt.toISOString().slice(0, 10),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(Math.max(0.2, low).toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
      bodyBase: Number(Math.min(open, close).toFixed(2)),
      bodyRange: Number(Math.max(0.02, Math.abs(close - open)).toFixed(2)),
      wickBase: Number(Math.max(0.1, Math.min(low, open, close)).toFixed(2)),
      wickRange: Number(Math.max(0.02, high - low).toFixed(2)),
      candleDirection: close >= open ? "up" : "down",
    });
    prev = close;
  }
  return points;
}

function historicalVolatility(history) {
  const returns = [];
  for (let i = 1; i < history.length; i += 1) {
    returns.push((history[i].close - history[i - 1].close) / history[i - 1].close);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / Math.max(1, returns.length);
  const variance = returns.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(1, returns.length);
  return Math.sqrt(variance) * Math.sqrt(252) * 100;
}

const credits = seeds.map((seed) => {
  const regime = projectTypeRegimes[seed.projectType];
  const registry = registryById[seed.registryId];
  const priceHistory = makeHistory(seed, regime, registry);
  const volumeHistory = priceHistory.map((p) => ({ date: p.date, volume: p.volume }));
  const latest = priceHistory[priceHistory.length - 1];
  const liquidityScore = clamp(Math.round(regime.liq * (registry?.liquidity || 1)), 20, 98);
  const volatilityScore = clamp(Math.round(historicalVolatility(priceHistory)), 5, 65);
  return {
    id: seed.id,
    registry: registry.name,
    registryId: seed.registryId,
    projectType: seed.projectType,
    score: seed.score,
    vintage: seed.vintage,
    issuanceYear: seed.issuanceYear,
    priceHistory,
    volumeHistory,
    availableVolume: seed.availableVolume,
    country: seed.country,
    methodology: seed.methodology,
    permanenceYears: seed.permanenceYears,
    liquidityScore,
    volatilityScore,
    removalType: regime.type,
    qualityCategory: qualityCategory[seed.score] || "standard",
    qualityScore: ratingScore[seed.score] || 70,
    projectName: seed.name,
    additionalityAnalysis: seed.additionality,
    coBenefits: seed.coBenefits,
    description: `${seed.name} with registry-validated methodology and institutional MRV controls.`,
    minimumPurchase: seed.minimumPurchase,
    currentPrice: latest.close,
    currentSpread: Number((latest.close * (0.0015 + (100 - liquidityScore) * 0.00003)).toFixed(2)),
    verificationBody: registry.name,
  };
});

const listings = credits.map((credit) => ({
  id: credit.id,
  project_id: credit.id,
  quality_category: credit.qualityCategory,
  quality_score: credit.qualityScore,
  price_per_tonne: Number(credit.currentPrice.toFixed(2)),
  quantity: credit.availableVolume,
  vintage_year: credit.vintage,
  minimum_purchase: credit.minimumPurchase,
  listing_status: "active",
  liquidity_score: credit.liquidityScore,
  volatility_score: credit.volatilityScore,
  score: credit.score,
  bid_ask_spread: credit.currentSpread,
  issuance_year: credit.issuanceYear,
}));

const projects = credits.map((credit) => ({
  id: credit.id,
  registry_id: credit.registryId,
  name: credit.projectName,
  methodology: credit.methodology,
  country: credit.country,
  project_type: credit.projectType,
  removal_vs_avoidance: credit.removalType,
  co_benefits: credit.coBenefits,
  description: credit.description,
  start_date: `${credit.issuanceYear}-01-01`,
  crediting_period_end: `${credit.issuanceYear + 12}-12-31`,
  permanence_duration: credit.permanenceYears,
  project_documents: [`https://example.com/docs/${credit.id.toLowerCase()}-registry-pack.pdf`],
  additionality_analysis: credit.additionalityAnalysis,
  verification_body: credit.verificationBody,
}));

const qualityScores = credits.map((credit) => {
  const base = credit.qualityScore;
  return {
    project_id: credit.id,
    registry_credibility: clamp(base + 4, 40, 99),
    removal_vs_avoidance: clamp(base + (credit.removalType === "removal" ? 8 : -2), 35, 99),
    permanence: clamp(base + Math.round(credit.permanenceYears / 40), 40, 99),
    vintage_freshness: clamp(base + (credit.vintage >= 2023 ? 6 : 1), 35, 99),
    methodology_strength: clamp(base + 3, 35, 99),
    transparency: clamp(base + 2, 35, 99),
    explanation: [
      `Rating premium for ${credit.score} reflected in valuation.`,
      `${credit.removalType === "removal" ? "Removal" : "Avoidance/hybrid"} profile impacts premium/discount.`,
      `Liquidity ${credit.liquidityScore}/100 and volatility ${credit.volatilityScore}/100 shape spread.`,
    ],
  };
});

const byListingId = Object.fromEntries(listings.map((l) => [l.id, l]));
const byProjectId = Object.fromEntries(projects.map((p) => [p.id, p]));
const byQualityId = Object.fromEntries(qualityScores.map((q) => [q.project_id, q]));
const byCreditId = Object.fromEntries(credits.map((c) => [c.id, c]));

function getMarketplaceCatalog() {
  return listings.map((listing) => ({
    listing,
    project: byProjectId[listing.project_id],
    registry: registryById[byProjectId[listing.project_id]?.registry_id] ?? null,
    qualityScore: byQualityId[listing.project_id] ?? null,
    credit: byCreditId[listing.id] ?? null,
  }));
}

function getListingBundle(listingId) {
  const listing = byListingId[String(listingId)];
  if (!listing) return null;
  const project = byProjectId[listing.project_id];
  return {
    listing,
    project,
    registry: registryById[project.registry_id] ?? null,
    qualityScore: byQualityId[project.id] ?? null,
    credit: byCreditId[listing.id] ?? null,
  };
}

function timeframeSize(tf) {
  if (tf === "1D") return 24;
  if (tf === "1W") return 7;
  if (tf === "1M") return 30;
  if (tf === "6M") return 180;
  if (tf === "1Y") return 240;
  return null;
}

function withLabels(points) {
  return points.map((p, _, arr) => {
    const d = new Date(p.date);
    const label = arr.length > 60
      ? d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
      : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { ...p, label };
  });
}

function getExchangeSeries(timeframe = "1M") {
  const base = credits[0]?.priceHistory ?? [];
  const merged = base.map((_, i) => {
    let volume = 0;
    let ow = 0;
    let cw = 0;
    let high = -Infinity;
    let low = Infinity;
    let dominant = null;
    credits.forEach((c) => {
      const p = c.priceHistory[i];
      volume += p.volume;
      ow += p.open * p.volume;
      cw += p.close * p.volume;
      high = Math.max(high, p.high);
      low = Math.min(low, p.low);
      if (!dominant || dominant.volumeTraded < p.volume) {
        dominant = { registry: c.registry, projectType: c.projectType, score: c.score, volumeTraded: p.volume, tradePrice: p.close };
      }
    });
    const open = ow / volume;
    const close = cw / volume;
    return {
      date: base[i].date,
      open: Number(open.toFixed(2)),
      close: Number(close.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      volume: Math.round(volume),
      bodyBase: Number(Math.min(open, close).toFixed(2)),
      bodyRange: Number(Math.max(0.02, Math.abs(close - open)).toFixed(2)),
      wickBase: Number(Math.min(low, open, close).toFixed(2)),
      wickRange: Number(Math.max(0.02, high - low).toFixed(2)),
      candleDirection: close >= open ? "up" : "down",
      registry: dominant.registry,
      projectType: dominant.projectType,
      score: dominant.score,
      volumeTraded: dominant.volumeTraded,
      tradePrice: Number(dominant.tradePrice.toFixed(2)),
    };
  });
  const size = timeframeSize(timeframe);
  return withLabels(size ? merged.slice(-size) : merged);
}

function getRegistryComparisonData() {
  return registries.map((registry) => {
    const rs = credits.filter((c) => c.registryId === registry.id);
    const avg = rs.reduce((s, c) => s + c.currentPrice, 0) / Math.max(1, rs.length);
    const volume = rs.reduce((s, c) => s + c.volumeHistory.slice(-30).reduce((v, x) => v + x.volume, 0), 0);
    const dominantProjectType = Object.entries(rs.reduce((m, c) => ({ ...m, [c.projectType]: (m[c.projectType] || 0) + 1 }), {}))
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
    const liquidityDepth = Math.round(rs.reduce((s, c) => s + c.availableVolume * (c.liquidityScore / 100), 0));
    const volatility = rs.reduce((s, c) => s + c.volatilityScore, 0) / Math.max(1, rs.length);
    const ratingPremiumImpact = rs.reduce((s, c) => s + (((ratingPremiumMultipliers[c.score] || 1) - 1) * 100), 0) / Math.max(1, rs.length);
    return { id: registry.id, name: registry.name, code: registry.code, averagePrice: Number(avg.toFixed(2)), volume: Math.round(volume), dominantProjectType, liquidityDepth, volatility: Number(volatility.toFixed(2)), ratingPremiumImpact: Number(ratingPremiumImpact.toFixed(2)) };
  });
}

function getExchangeMetrics(timeframe = "1M") {
  const s = getExchangeSeries(timeframe);
  const last = s[s.length - 1];
  const prev = s[Math.max(0, s.length - 2)];
  const priceChangePct = prev ? ((last.close - prev.close) / prev.close) * 100 : 0;
  const volume24h = Math.round(s.slice(-24).reduce((sum, p) => sum + p.volume, 0));
  const averageMarketPrice = s.reduce((sum, p) => sum + p.close, 0) / Math.max(1, s.length);
  const cmp = getRegistryComparisonData();
  const topRegistry = cmp.sort((a, b) => b.averagePrice - a.averagePrice)[0];
  const typeMap = credits.reduce((m, c) => ({ ...m, [c.projectType]: (m[c.projectType] || 0) + c.volumeHistory.slice(-30).reduce((x, v) => x + v.volume, 0) }), {});
  const mostTradedProjectType = Object.entries(typeMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const volatilityPct = Number((s.reduce((sum, p) => sum + (Math.abs((p.high - p.low) / p.close) * 100), 0) / Math.max(1, s.length)).toFixed(2));
  const liquidityScore = Math.round(credits.reduce((sum, c) => sum + c.liquidityScore, 0) / credits.length);
  return { lastPrice: last.close, priceChangePct: Number(priceChangePct.toFixed(2)), volume24h, averageMarketPrice: Number(averageMarketPrice.toFixed(2)), highestRegistryPrice: `${topRegistry?.name || "N/A"} $${topRegistry?.averagePrice?.toFixed(2) || "0.00"}`, mostTradedProjectType, volatilityPct, liquidityScore };
}

function getProjectTypes() {
  return Object.keys(projectTypeRegimes);
}

function getProjectSegmentationData(projectType) {
  const xs = credits.filter((c) => c.projectType === projectType);
  const prices = xs.map((x) => x.currentPrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const step = Math.max(1, (max - min) / 4);
  const priceDistribution = Array.from({ length: 4 }).map((_, i) => {
    const from = min + i * step;
    const to = from + step;
    return { bucket: `$${from.toFixed(0)}-$${to.toFixed(0)}`, count: prices.filter((p) => p >= from && p < to).length };
  });
  const historicalVolatility = xs[0].priceHistory.slice(-30).map((p, i) => {
    const cohort = xs.map((x) => x.priceHistory.slice(-30)[i].close);
    const avg = cohort.reduce((s, v) => s + v, 0) / cohort.length;
    const dev = Math.sqrt(cohort.reduce((s, v) => s + (v - avg) ** 2, 0) / cohort.length);
    return { date: p.date, label: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), volatility: Number(((dev / avg) * 100).toFixed(2)) };
  });
  const volumeTrend = xs[0].volumeHistory.slice(-30).map((p, i) => ({ date: p.date, label: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), volume: xs.reduce((s, x) => s + x.volumeHistory.slice(-30)[i].volume, 0) }));
  const registryDominance = Object.entries(xs.reduce((m, x) => ({ ...m, [x.registry]: (m[x.registry] || 0) + x.availableVolume }), {})).map(([name, volume]) => ({ name, volume })).sort((a, b) => b.volume - a.volume);
  const ratingImpactDistribution = Object.entries(xs.reduce((m, x) => ({ ...m, [x.score]: (m[x.score] || 0) + 1 }), {})).map(([score, count]) => ({ score, count, premium: Number((((ratingPremiumMultipliers[score] || 1) - 1) * 100).toFixed(2)) }));
  return {
    projectType,
    credits: xs,
    priceDistribution,
    historicalVolatility,
    volumeTrend,
    registryDominance,
    ratingImpactDistribution,
    summary: {
      averagePrice: Number((xs.reduce((s, x) => s + x.currentPrice, 0) / xs.length).toFixed(2)),
      averageVolatility: Number((xs.reduce((s, x) => s + x.volatilityScore, 0) / xs.length).toFixed(2)),
      averageLiquidity: Number((xs.reduce((s, x) => s + x.liquidityScore, 0) / xs.length).toFixed(2)),
    },
  };
}

function getOrderBook(listingId) {
  const c = byCreditId[listingId];
  if (!c) return { mid: 0, spread: 0, bids: [], asks: [] };
  const mid = c.currentPrice;
  const spread = c.currentSpread;
  const factor = 1 + c.liquidityScore / 55;
  const bids = Array.from({ length: 10 }).map((_, i) => ({ level: i + 1, price: Number((mid - spread * (i + 0.6)).toFixed(2)), volume: Math.round((c.availableVolume / (16 + i * 2)) * factor) }));
  const asks = Array.from({ length: 10 }).map((_, i) => ({ level: i + 1, price: Number((mid + spread * (i + 0.6)).toFixed(2)), volume: Math.round((c.availableVolume / (18 + i * 2)) * factor) }));
  return { mid, spread: Number(spread.toFixed(2)), bids, asks };
}

function getLiquidityDepthSeries(orderBook) {
  let bid = 0;
  let ask = 0;
  return orderBook.bids.map((b, i) => {
    bid += b.volume;
    ask += orderBook.asks[i].volume;
    return { label: `L${i + 1}`, bidPrice: b.price, askPrice: orderBook.asks[i].price, bidDepth: bid, askDepth: ask };
  });
}

function getTradeTicker(limit = 18) {
  return Array.from({ length: limit }).map((_, i) => {
    const c = credits[(i * 3) % credits.length];
    const p = c.priceHistory[c.priceHistory.length - 1 - (i % 5)];
    return {
      id: `${c.id}-${i}`,
      side: i % 2 === 0 ? "BUY" : "SELL",
      projectType: c.projectType,
      registry: c.registry,
      score: c.score,
      price: p.close,
      volume: Math.max(1, Math.round(p.volume / 3)),
      time: `${9 + (i % 10)}:${String((i * 7) % 60).padStart(2, "0")}`,
    };
  });
}

function getHeatmapByProjectType() {
  const map = credits.reduce((m, c) => ({ ...m, [c.projectType]: (m[c.projectType] || 0) + c.volumeHistory.slice(-60).reduce((s, v) => s + v.volume, 0) }), {});
  const max = Math.max(...Object.values(map), 1);
  return Object.entries(map).map(([projectType, volume]) => ({ projectType, volume, intensity: Number((volume / max).toFixed(2)) }));
}

function getIssuanceTrend() {
  const grouped = {};
  credits.forEach((c) => {
    if (!grouped[c.issuanceYear]) {
      grouped[c.issuanceYear] = { year: c.issuanceYear, total: 0 };
      getProjectTypes().forEach((t) => {
        grouped[c.issuanceYear][t] = 0;
      });
    }
    grouped[c.issuanceYear][c.projectType] += c.availableVolume;
    grouped[c.issuanceYear].total += c.availableVolume;
  });
  return Object.values(grouped).sort((a, b) => a.year - b.year);
}

function getSimilarCredits(listingId) {
  const source = byCreditId[listingId];
  if (!source) return [];
  return credits.filter((c) => c.id !== source.id).sort((a, b) => {
    const typeBoost = (a.projectType === source.projectType ? 2 : 0) - (b.projectType === source.projectType ? 2 : 0);
    if (typeBoost !== 0) return -typeBoost;
    return Math.abs((ratingScore[a.score] || 70) - (ratingScore[source.score] || 70)) - Math.abs((ratingScore[b.score] || 70) - (ratingScore[source.score] || 70));
  }).slice(0, 4);
}

function calculateSuggestedPrice({ registryId, projectType, score, liquidityScore, volatilityScore }) {
  const registry = registryById[registryId];
  const regime = projectTypeRegimes[projectType];
  if (!registry || !regime) return null;
  const base = regime.base;
  const registryAdjustment = base * (registry.valuation - 1);
  const ratingAdjustment = base * ((ratingPremiumMultipliers[score] || 1) - 1);
  const liquidityAdjustment = base * ((liquidityScore - 50) / 400);
  const volatilityAdjustment = base * ((volatilityScore - regime.vol) / 650);
  const suggestedPrice = Math.max(1, base + registryAdjustment + ratingAdjustment + liquidityAdjustment - volatilityAdjustment);
  return {
    basePrice: Number(base.toFixed(2)),
    registryAdjustment: Number(registryAdjustment.toFixed(2)),
    ratingAdjustment: Number(ratingAdjustment.toFixed(2)),
    liquidityAdjustment: Number(liquidityAdjustment.toFixed(2)),
    volatilityAdjustment: Number((-volatilityAdjustment).toFixed(2)),
    suggestedPrice: Number(suggestedPrice.toFixed(2)),
  };
}

export { listings, projects, qualityScores, registries, credits, ratingPremiumMultipliers, projectTypeRegimes };
export {
  getMarketplaceCatalog,
  getListingBundle,
  getExchangeSeries,
  getExchangeMetrics,
  getRegistryComparisonData,
  getProjectTypes,
  getProjectSegmentationData,
  getOrderBook,
  getLiquidityDepthSeries,
  getTradeTicker,
  getHeatmapByProjectType,
  getIssuanceTrend,
  getSimilarCredits,
  calculateSuggestedPrice,
};
