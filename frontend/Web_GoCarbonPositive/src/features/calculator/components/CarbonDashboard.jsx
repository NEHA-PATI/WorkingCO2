import {
  FaCar,
  FaUtensils,
  FaHome,
  FaShoppingBag,
  FaLightbulb,
} from "react-icons/fa";

export default function CarbonDashboard() {
  const progress = 65;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const breakdown = [
    {
      label: "Travel",
      value: "350kg",
      percent: 75,
      color: "bg-blue-500",
      icon: <FaCar />,
    },
    {
      label: "Food",
      value: "200kg",
      percent: 45,
      color: "bg-orange-500",
      icon: <FaUtensils />,
    },
    {
      label: "Home",
      value: "500kg",
      percent: 90,
      color: "bg-purple-500",
      icon: <FaHome />,
    },
    {
      label: "Shopping",
      value: "150kg",
      percent: 30,
      color: "bg-emerald-500",
      icon: <FaShoppingBag />,
    },
  ];

  return (
    <div className="bg-slate-50 p-10 rounded-3xl">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center">
            <div className="relative w-80 h-80 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="text-[#13ec5b] transition-all duration-500"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                />
              </svg>

              <div className="absolute flex flex-col items-center">
                <span className="text-6xl font-bold">1.2</span>
                <span className="text-sm font-bold text-slate-600 uppercase">
                  Tons CO2
                </span>
                <div className="mt-4 px-4 py-1 bg-[#13ec5b]/15 rounded-full border border-[#13ec5b]/20">
                  <span className="text-xs font-bold text-[#0eb947] uppercase">
                    -12% vs last month
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-base font-medium max-w-sm">
              You&apos;re currently{" "}
              <span className="text-[#0eb947] font-bold">{progress}%</span> of your
              monthly target budget.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Impact Breakdown</h2>
              <button className="text-sm font-bold text-[#0eb947] uppercase">
                Details
              </button>
            </div>

            <div className="space-y-5">
              {breakdown.map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <p className="font-bold">{item.label}</p>
                      <p className="text-sm font-bold text-slate-600">{item.value}</p>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="rounded-3xl bg-[#13ec5b] p-10 text-slate-900 shadow-xl max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <FaLightbulb />
              <h3 className="font-bold uppercase text-xs tracking-widest opacity-80">
                Daily Tip
              </h3>
            </div>
            <p className="text-2xl font-bold mb-3">
              Switch to LED bulbs to save 15kg CO2/year
            </p>
            <p className="text-base opacity-90 mb-6">
              It&apos;s a small change with a huge impact on your energy footprint.
            </p>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
