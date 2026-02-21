exports.generateReport = (total, breakdown, pucInsights = {}) => {
  const sum = (obj) =>
    Object.values(obj || {}).reduce((a, b) => a + b, 0);

  const housing = sum(breakdown.housing);
  const food = sum(breakdown.food);
  const transport = sum(breakdown.transport);
  const flights = sum(breakdown.flights);

  const percentage = (value) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  // =========================
  // CARBON SCORE
  // =========================
  let baseScore = 0;
  if (total <= 200) {
    baseScore = 90;
  } else if (total <= 400) {
    baseScore = 75;
  } else if (total <= 700) {
    baseScore = 60;
  } else {
    baseScore = 45;
  }

  const noPucPenalty = (pucInsights.noPucCount || 0) * 4;
  const expiredPucPenalty = (pucInsights.expiredCount || 0) * 2;
  const compliantPucBonus = (pucInsights.compliantLowEmissionCount || 0) * 2;

  const adjustedScore = Math.max(
    0,
    Math.min(100, baseScore - noPucPenalty - expiredPucPenalty + compliantPucBonus)
  );

  let grade = "";
  let scoreMessage = "";
  if (adjustedScore >= 85) {
    grade = "A";
    scoreMessage = "Excellent! Your carbon footprint is very low.";
  } else if (adjustedScore >= 70) {
    grade = "B";
    scoreMessage = "Good job! You are below average emissions.";
  } else if (adjustedScore >= 55) {
    grade = "C";
    scoreMessage = "Average footprint. There is room for improvement.";
  } else {
    grade = "D";
    scoreMessage = "High emissions. Consider reducing travel and energy usage.";
  }

  // =========================
  // RECOMMENDATIONS ENGINE
  // =========================
  const recommendationCandidates = [];

  // ---------- FLIGHTS ----------
  if (flights > 0) {
    const flightRoutes = Object.entries(breakdown.flights || {}).sort(
      (a, b) => b[1] - a[1]
    );
    const [topRoute, topRouteEmission] = flightRoutes[0];

    recommendationCandidates.push({
      text: `Your route "${topRoute}" is your largest single contributor (~${Math.round(topRouteEmission)} kg CO2). Replacing one similar flight with train or virtual meetings would significantly reduce emissions.`,
      savings: topRouteEmission,
      category: "flights"
    });
  }

  // ---------- ELECTRICITY ----------
  const electricity = breakdown.housing.electricity || 0;
  if (electricity > 0) {
    const savings = electricity * 0.1;
    recommendationCandidates.push({
      text: `Improving home efficiency (LEDs, AC optimization, reducing standby power) could cut ~${Math.round(savings)} kg CO2 monthly.`,
      savings,
      category: "housing"
    });
  }

  // ---------- LPG ----------
  const lpg = breakdown.housing.lpg || 0;
  if (lpg > 0) {
    recommendationCandidates.push({
      text: "Switching partially to induction cooking or improving kitchen ventilation can reduce cooking-related emissions.",
      savings: lpg * 0.1,
      category: "housing"
    });
  }

  // ---------- CAR ----------
  const carEmission = breakdown.transport["4w"] || 0;
  if (carEmission > 0) {
    const savings = carEmission * 0.2;
    recommendationCandidates.push({
      text: `Carpooling, hybrid driving, or using public transport 1-2 days per week could save ~${Math.round(savings)} kg CO2.`,
      savings,
      category: "transport"
    });
  }

  // ---------- FOOD ----------
  const chicken = breakdown.food.chicken || 0;
  if (chicken > 0) {
    const savings = chicken * 0.5;
    recommendationCandidates.push({
      text: `Replacing half of your chicken meals with plant-based alternatives could reduce ~${Math.round(savings)} kg CO2.`,
      savings,
      category: "food"
    });
  }

  if ((pucInsights.expiredCount || 0) > 0) {
    recommendationCandidates.push({
      text: "Your vehicle PUC certificate is expired. Renewing it can reduce emissions and improve your sustainability score.",
      savings: 20,
      category: "transport"
    });
  }

  // ---------- SORT BY IMPACT ----------
  recommendationCandidates.sort((a, b) => b.savings - a.savings);

  // ---------- PICK TOP 4 ----------
  const topRecommendations = recommendationCandidates.slice(0, 4);

  // ---------- FINAL TEXT LIST ----------
  const recommendations = topRecommendations.map((r) => r.text);

  // ---------- SUMMARY ----------
  let summary = "";
  if (flights > housing && flights > transport) {
    summary =
      "Air travel is the dominant driver of your footprint. Reducing flight frequency will have the largest impact.";
  } else if (housing > flights && housing > transport) {
    summary =
      "Home energy consumption is your primary emission source. Efficiency improvements can significantly lower your footprint.";
  } else if (transport > flights && transport > housing) {
    summary =
      "Personal vehicle usage is a key contributor. Mobility changes can meaningfully reduce emissions.";
  } else {
    summary =
      "Your emissions are distributed across multiple categories. Balanced improvements across lifestyle areas will help reduce your footprint.";
  }

  return {
    total,
    breakdown,
    percentages: {
      housing: percentage(housing),
      food: percentage(food),
      transport: percentage(transport),
      flights: percentage(flights)
    },
    equivalents: {
      trees_needed: Math.round(total / 21),
      car_km_equivalent: Math.round(total / 0.12),
      home_days_equivalent: Math.round(total / 8)
    },
    score: {
      grade,
      message: scoreMessage,
      value: adjustedScore
    },
    recommendations,
    recommendation_summary: summary
  };
};
