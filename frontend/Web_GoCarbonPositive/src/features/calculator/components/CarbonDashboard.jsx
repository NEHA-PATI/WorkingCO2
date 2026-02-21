import {
  FaCar,
  FaHouse,
  FaLeaf,
  FaPlaneDeparture,
  FaTree,
  FaUtensils,
} from "react-icons/fa6";
import { useMemo, useState } from "react";

const resultData = {
  session_id: "6a07bbfc-29aa-4375-9231-9ce2408b1605",
  total: 1717.14,
  breakdown: {
    housing: { electricity: 324, lpg: 63.47 },
    food: { rice: 28.35, wheat: 10.5, milk: 45, chicken: 10.8, eggs: 9, vegetables: 6 },
    transport: { "2w": 30.8, "4w": 123.2 },
    flights: {
      "DEL-BOM-DEL": 272.89,
      "DEL-BLR": 369.11,
      "DEL-MAA-HYD-DEL": 424.02,
    },
  },
  percentages: { housing: 23, food: 6, transport: 9, flights: 62 },
  equivalents: { trees_needed: 82, car_km_equivalent: 14310, home_days_equivalent: 215 },
  score: {
    grade: "D",
    message: "High emissions. Consider reducing travel and energy usage.",
  },
  recommendations: [
    "Your route DEL-MAA-HYD-DEL is your largest single contributor (~424 kg CO2). Replacing one similar flight with train or virtual meetings would significantly reduce emissions.",
    "Improving home efficiency (LEDs, AC optimization, reducing standby power) could cut ~32 kg CO2 monthly.",
    "Carpooling, hybrid driving, or using public transport 1-2 days per week could save ~25 kg CO2.",
    "Switching partially to induction cooking or improving kitchen ventilation can reduce cooking-related emissions.",
  ],
  recommendation_summary:
    "Air travel is the dominant driver of your footprint. Reducing flight frequency will have the largest impact.",
};

const categoryMeta = {
  housing: {
    label: "Housing",
    icon: <FaHouse className="text-sky-500" />,
    color: "bg-sky-500",
    hex: "#0ea5e9",
  },
  food: {
    label: "Food",
    icon: <FaUtensils className="text-orange-500" />,
    color: "bg-orange-500",
    hex: "#f97316",
  },
  transport: {
    label: "Transport",
    icon: <FaCar className="text-emerald-500" />,
    color: "bg-emerald-500",
    hex: "#10b981",
  },
  flights: {
    label: "Flights",
    icon: <FaPlaneDeparture className="text-violet-500" />,
    color: "bg-violet-500",
    hex: "#8b5cf6",
  },
};

export default function CarbonDashboard({ resultData }) {
  const [activeDetailKey, setActiveDetailKey] = useState(null);

  const safeBreakdown = {
    housing: resultData?.breakdown?.housing || {},
    food: resultData?.breakdown?.food || {},
    transport: resultData?.breakdown?.transport || {},
    flights: resultData?.breakdown?.flights || {},
  };

  const categoryKeys = ["housing", "food", "transport", "flights"];
  const computedTotals = categoryKeys.reduce((acc, key) => {
    acc[key] = Object.values(safeBreakdown[key]).reduce((sum, n) => sum + Number(n || 0), 0);
    return acc;
  }, {});

  const categoryRows = categoryKeys
    .filter((key) => computedTotals[key] > 0 || Number(resultData?.percentages?.[key] || 0) > 0)
    .map((key) => {
      const fallbackPercent =
        Number(resultData?.total || 0) > 0
          ? Math.round((computedTotals[key] / Number(resultData.total)) * 100)
          : 0;

      return {
        key,
        percent: Number(resultData?.percentages?.[key] ?? fallbackPercent),
        total: computedTotals[key].toFixed(2),
      };
    });

  const pieMeta = useMemo(() => {
    let start = 0;
    const segments = categoryRows.map((row) => {
      const end = start + row.percent;
      const segment = `${categoryMeta[row.key].hex} ${start}% ${end}%`;
      start = end;
      return {
        ...row,
        segment,
      };
    });

    return {
      pieGradient: segments.map((item) => item.segment).join(", "),
    };
  }, [categoryRows]);

  const detailCards = [
    {
      key: "housing",
      title: "Housing",
      bgClass: "bg-sky-50/50",
      icon: categoryMeta.housing.icon,
      rows: [
        { label: "Electricity", value: `${safeBreakdown.housing.electricity || 0} kg` },
        { label: "LPG", value: `${safeBreakdown.housing.lpg || 0} kg` },
      ],
    },
    {
      key: "food",
      title: "Food",
      bgClass: "bg-orange-50/50",
      icon: categoryMeta.food.icon,
      rows: Object.entries(safeBreakdown.food).map(([k, v]) => ({
        label: k,
        value: `${v} kg`,
      })),
    },
    {
      key: "transport",
      title: "Transport",
      bgClass: "bg-emerald-50/50",
      icon: categoryMeta.transport.icon,
      rows: Object.entries(safeBreakdown.transport).map(([k, v]) => ({
        label: k,
        value: `${v} kg`,
      })),
    },
    {
      key: "flights",
      title: "Flights",
      bgClass: "bg-violet-50/50",
      icon: categoryMeta.flights.icon,
      rows: Object.entries(safeBreakdown.flights).map(([k, v]) => ({
        label: k,
        value: `${v} kg`,
      })),
    },
  ].filter((card) => card.rows.length > 0);

  const activeDetail = detailCards.find((card) => card.key === activeDetailKey) || null;

  return (
    <div className="w-full min-h-full bg-slate-50 p-2 sm:p-3 lg:p-4 rounded-2xl font-['Poppins']">
      <div className="w-full bg-white rounded-2xl shadow-xl p-2.5 sm:p-4 lg:p-6 space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-3 rounded-xl border border-slate-200 p-3 sm:p-4 bg-slate-50 min-h-[78px] flex flex-col justify-center">
            <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wide">
              Total Emissions
            </p>
            <p className="text-[24px] sm:text-[28px] leading-none font-bold mt-1.5">
              {resultData.total} kg CO2
            </p>
          </div>
          <div className="md:col-span-2 rounded-xl border border-slate-200 p-3 sm:p-4 bg-slate-50 min-h-[78px] flex flex-col justify-center">
            <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wide">
              Score
            </p>
            <p className="text-[30px] sm:text-[34px] leading-none font-bold mt-1 text-rose-500">
              {resultData.score.grade}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-bold mb-2.5 sm:mb-3">Category Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div
                  className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-slate-200"
                  style={{ background: `conic-gradient(${pieMeta.pieGradient})` }}
                >
                  <div className="absolute inset-[24%] rounded-full bg-white border border-slate-100 flex flex-col items-center justify-center text-center">
                    <p className="text-[11px] uppercase text-slate-500 font-semibold">Total</p>
                    <p className="text-sm sm:text-base font-bold">{resultData.total} kg</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categoryRows.map((row) => (
                  <div key={row.key} className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-2">
                    <span
                      className="inline-block h-3 w-3 rounded-sm"
                      style={{ backgroundColor: categoryMeta[row.key].hex }}
                    />
                    <p className="text-xs sm:text-sm text-slate-700">
                      <span className="font-semibold">{categoryMeta[row.key].label}</span>{" "}
                      <span className="font-bold">{row.percent}%</span>{" "}
                      <span className="text-slate-500">{row.total} kg</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-bold mb-2.5 sm:mb-3">Detailed Views</h3>
            <div className="grid grid-cols-1 gap-3">
              {detailCards.map((card) => (
                <div
                  key={card.key}
                  className={`rounded-xl border border-slate-200 ${card.bgClass} p-3.5 sm:p-4`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{card.icon}</span>
                      <p className="font-semibold text-sm sm:text-base">{card.title}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveDetailKey(card.key)}
                      className="px-3 py-1.5 rounded-md bg-white border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      View More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 sm:p-4">
            <p className="text-sm font-bold text-amber-700 mb-1">Score Message</p>
            <p className="text-sm">{resultData.score.message}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-bold mb-2">Recommendations</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
            {resultData.recommendations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm">
            <p className="font-semibold flex items-center gap-2 mb-1">
              <FaLeaf className="text-emerald-600" />
              Recommendation Summary
            </p>
            <p>{resultData.recommendation_summary}</p>
          </div>
        </div>
      </div>

      {activeDetail && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 p-4 flex items-center justify-center"
          onClick={() => setActiveDetailKey(null)}
          role="presentation"
        >
          <div
            className="w-full max-w-xl rounded-xl bg-white border border-slate-200 p-4 sm:p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeDetail.title} details`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h4 className="text-lg font-bold">{activeDetail.title} Details</h4>
              <button
                type="button"
                className="text-sm font-semibold text-slate-500 hover:text-slate-700"
                onClick={() => setActiveDetailKey(null)}
              >
                Close
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto rounded-lg border border-slate-100">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 p-3 text-sm">
                {activeDetail.rows.map((row) => (
                  <div key={row.label} className="contents">
                    <p className="text-slate-600 capitalize break-words">{row.label}</p>
                    <p className="text-right font-semibold">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
