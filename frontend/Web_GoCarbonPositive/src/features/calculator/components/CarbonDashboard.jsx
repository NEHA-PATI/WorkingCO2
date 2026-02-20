import {
  FaCar,
  FaHouse,
  FaLeaf,
  FaPlaneDeparture,
  FaTree,
  FaUtensils,
} from "react-icons/fa6";
import { MdOutlineDirectionsCar } from "react-icons/md";
import { PiHouseLine } from "react-icons/pi";

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

export default function CarbonDashboard() {
  const categoryRows = Object.entries(resultData.percentages).map(([key, value]) => ({
    key,
    percent: value,
    total:
      Object.values(resultData.breakdown[key]).reduce((sum, n) => sum + Number(n), 0).toFixed(2),
  }));

  let start = 0;
  const pieGradient = categoryRows
    .map((row) => {
      const end = start + row.percent;
      const segment = `${categoryMeta[row.key].hex} ${start}% ${end}%`;
      start = end;
      return segment;
    })
    .join(", ");

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
                  style={{ background: `conic-gradient(${pieGradient})` }}
                >
                  <div className="absolute inset-[24%] rounded-full bg-white border border-slate-100 flex flex-col items-center justify-center text-center">
                    <p className="text-[11px] uppercase text-slate-500 font-semibold">Total</p>
                    <p className="text-sm sm:text-base font-bold">{resultData.total} kg</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {categoryRows.map((row) => (
                  <div key={row.key} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 sm:px-4 py-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base sm:text-lg">{categoryMeta[row.key].icon}</span>
                      <span className="text-sm sm:text-base font-semibold text-slate-900">
                        {categoryMeta[row.key].label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-bold text-slate-700">{row.percent}%</p>
                      <p className="text-xs sm:text-sm text-slate-500">{row.total} kg</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-bold mb-2.5 sm:mb-3">Detailed Views</h3>
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-100 bg-sky-50/50 p-3">
                <p className="font-semibold text-sm mb-2">Housing</p>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-xs sm:text-sm">
                  <p className="text-slate-600">Electricity</p>
                  <p className="text-right font-semibold">{resultData.breakdown.housing.electricity} kg</p>
                  <p className="text-slate-600">LPG</p>
                  <p className="text-right font-semibold">{resultData.breakdown.housing.lpg} kg</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-orange-50/50 p-3">
                <p className="font-semibold text-sm mb-2">Food</p>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-xs sm:text-sm">
                  {Object.entries(resultData.breakdown.food).map(([k, v]) => (
                    <div key={k} className="contents">
                      <p className="text-slate-600 capitalize break-words">{k}</p>
                      <p className="text-right font-semibold">{v} kg</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-emerald-50/50 p-3">
                <p className="font-semibold text-sm mb-2">Transport</p>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-xs sm:text-sm">
                  {Object.entries(resultData.breakdown.transport).map(([k, v]) => (
                    <div key={k} className="contents">
                      <p className="text-slate-600">{k}</p>
                      <p className="text-right font-semibold">{v} kg</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-violet-50/50 p-3">
                <p className="font-semibold text-sm mb-2">Flights</p>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-xs sm:text-sm">
                  {Object.entries(resultData.breakdown.flights).map(([k, v]) => (
                    <div key={k} className="contents">
                      <p className="text-slate-600 break-all">{k}</p>
                      <p className="text-right font-semibold">{v} kg</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-bold mb-2.5 sm:mb-3">Equivalents</h3>
            <div className="grid sm:grid-cols-3 gap-2 text-sm">
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="font-semibold flex items-center gap-1">
                  <FaTree className="text-emerald-600" /> Trees
                </p>
                <p>{resultData.equivalents.trees_needed}</p>
              </div>
              <div className="bg-sky-50 rounded-lg p-3">
                <p className="font-semibold flex items-center gap-1">
                  <MdOutlineDirectionsCar className="text-sky-600" /> Car km
                </p>
                <p>{resultData.equivalents.car_km_equivalent}</p>
              </div>
              <div className="bg-violet-50 rounded-lg p-3">
                <p className="font-semibold flex items-center gap-1">
                  <PiHouseLine className="text-violet-600" /> Home days
                </p>
                <p>{resultData.equivalents.home_days_equivalent}</p>
              </div>
            </div>
          </div>

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
    </div>
  );
}
