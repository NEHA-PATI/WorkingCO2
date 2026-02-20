import { useState } from "react";
import {
  FaCar,
  FaChargingStation,
  FaBicycle,
  FaInfoCircle,
  FaHome,
  FaUtensils,
  FaPlane,
  FaLeaf,
  FaChartBar,
  FaPlaneDeparture,
} from "react-icons/fa";
import CarbonDashboard from "@features/calculator/components/CarbonDashboard";
import FlightCalculatorForm from "@features/calculator/components/FlightCalculatorForm";

export default function FootprintCalculatorStep() {
  const [vehicle, setVehicle] = useState("electric");
  const [mileage, setMileage] = useState(125);
  const [transit, setTransit] = useState("often");
  const [activeTab, setActiveTab] = useState("travel");

  const tabs = [
    { id: "housing", label: "Housing", icon: <FaHome /> },
    { id: "food", label: "Food", icon: <FaUtensils /> },
    { id: "travel", label: "Travel", icon: <FaPlane /> },
    { id: "lifestyle", label: "Lifestyle", icon: <FaLeaf /> },
    { id: "results", label: "Results", icon: <FaChartBar /> },
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-sans">
      {/* Top Tabs Navigation */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
        <div className="grid grid-cols-5 gap-4 items-center text-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-slate-100 text-[#13ec5b]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {activeTab === "results" ? (
        <main className="flex-1 px-6 pb-16 max-w-7xl mx-auto w-full mt-8">
          <CarbonDashboard />
        </main>
      ) : activeTab === "travel" ? (
        <>
          <main className="flex-1 px-6 pb-16 max-w-5xl mx-auto w-full">
            <section className="mt-10">
              <h2 className="text-3xl font-bold mb-2">Transportation</h2>
              <p className="text-slate-600 text-lg mb-8">
                How do you get around on a daily basis?
              </p>
            </section>

            <section className="space-y-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
                  Primary Vehicle Type
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    {
                      id: "electric",
                      label: "Electric",
                      icon: <FaChargingStation />,
                    },
                    { id: "gasoline", label: "Gasoline", icon: <FaCar /> },
                    { id: "hybrid", label: "Hybrid", icon: <FaCar /> },
                    { id: "none", label: "No Car", icon: <FaBicycle /> },
                    { id: "flight", label: "Flight", icon: <FaPlaneDeparture /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setVehicle(item.id)}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                        vehicle === item.id
                          ? "border-[#13ec5b] bg-[#13ec5b]/5 text-[#13ec5b]"
                          : "border-transparent bg-slate-50 text-slate-600"
                      }`}
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <span className="font-bold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {vehicle === "flight" ? (
                <FlightCalculatorForm />
              ) : (
                <>
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                        Weekly Mileage
                      </h3>
                      <span className="text-2xl font-bold text-[#13ec5b]">
                        {mileage}{" "}
                        <span className="text-sm text-slate-400 font-medium">mi</span>
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      className="w-full accent-[#13ec5b]"
                    />

                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0 mi</span>
                      <span>500+ mi</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
                      Public Transit Usage
                    </h3>

                    <div className="flex p-1 bg-slate-100 rounded-xl max-w-md">
                      {["never", "often", "daily"].map((item) => (
                        <button
                          key={item}
                          onClick={() => setTransit(item)}
                          className={`flex-1 py-3 text-sm font-bold rounded-lg capitalize transition-all ${
                            transit === item
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </section>

            {vehicle !== "flight" && (
              <div className="mt-12 p-5 rounded-xl bg-[#13ec5b]/10 border border-[#13ec5b]/20 flex items-start gap-4 max-w-2xl">
                <FaInfoCircle className="text-[#13ec5b] text-xl mt-1" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  By switching to an EV, you&apos;ve already reduced your travel
                  footprint by{" "}
                  <span className="text-[#13ec5b] font-bold">~65%</span>
                  compared to the national average.
                </p>
              </div>
            )}
          </main>

          <footer className="mt-auto w-full p-6 bg-white border-t border-slate-200">
            <button className="w-full max-w-md mx-auto py-5 bg-[#13ec5b] text-slate-900 font-bold text-lg rounded-xl shadow-[0_8px_30px_rgb(19,236,91,0.3)] active:scale-95 transition-transform">
              Continue to Lifestyle
            </button>
          </footer>
        </>
      ) : (
        <main className="flex-1 px-6 pb-16 max-w-5xl mx-auto w-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold capitalize mb-2">{activeTab} section</h2>
            <p className="text-slate-600">This section UI will be added next.</p>
          </div>
        </main>
      )}
    </div>
  );
}
