import { useState } from "react";
import {
  FaCar,
  FaPlaneDeparture,
} from "react-icons/fa";
import {
  FaHouseChimney,
  FaBowlFood,
  FaPlaneUp,
  FaChartSimple,
} from "react-icons/fa6";
import CarbonDashboard from "@features/calculator/components/CarbonDashboard";
import FlightCalculatorForm from "@features/calculator/components/FlightCalculatorForm";

export default function FootprintCalculatorStep() {
  const [vehicle, setVehicle] = useState("vehicles");
  const [activeTab, setActiveTab] = useState("housing");
  const [vehicleEntries, setVehicleEntries] = useState([
    { vehicleType: "", fuelType: "", distanceTravelled: "", mileage: "" },
  ]);
  const [housingForm, setHousingForm] = useState({
    electricityKwh: "",
    lpgCylinders: "",
  });
  const [foodEntries, setFoodEntries] = useState([
    { category: "", daysConsumed: "", avgConsumptionPerDay: "" },
  ]);

  const handleHousingChange = (e) => {
    const { name, value } = e.target;
    setHousingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFoodChange = (index, e) => {
    const { name, value } = e.target;
    setFoodEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, [name]: value } : entry)),
    );
  };

  const addFoodEntry = () => {
    setFoodEntries((prev) => [
      ...prev,
      { category: "", daysConsumed: "", avgConsumptionPerDay: "" },
    ]);
  };

  const removeFoodEntry = (index) => {
    setFoodEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVehicleFormChange = (index, e) => {
    const { name, value } = e.target;
    setVehicleEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, [name]: value } : entry)),
    );
  };

  const addVehicleEntry = () => {
    setVehicleEntries((prev) => [
      ...prev,
      { vehicleType: "", fuelType: "", distanceTravelled: "", mileage: "" },
    ]);
  };

  const removeVehicleEntry = (index) => {
    setVehicleEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const tabs = [
    {
      id: "housing",
      label: "Housing",
      icon: FaHouseChimney,
      iconColor: "text-blue-500",
    },
    {
      id: "food",
      label: "Food",
      icon: FaBowlFood,
      iconColor: "text-amber-500",
    },
    {
      id: "travel",
      label: "Travel",
      icon: FaPlaneUp,
      iconColor: "text-emerald-500",
    },
    {
      id: "results",
      label: "Results",
      icon: FaChartSimple,
      iconColor: "text-violet-500",
    },
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-['Poppins'] overflow-x-hidden">
      {/* Top Tabs Navigation */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 px-2.5 py-1.5 sm:px-5 sm:py-2">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2 items-center text-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl border transition-all duration-200 ease-out min-h-[46px] sm:min-h-[56px] ${
                  activeTab === tab.id
                    ? "bg-slate-100/90 border-slate-300 text-slate-900 shadow-md ring-1 ring-slate-300/80 scale-[1.01]"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                }`}
              >
                <span
                  className={`inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-base sm:text-lg transition-transform duration-200 ${tab.iconColor} ${
                    activeTab === tab.id ? "scale-110" : "group-hover:scale-110 group-active:scale-95"
                  }`}
                >
                  <Icon />
                </span>
                <span
                  className={`text-xs sm:text-[15px] font-semibold tracking-tight transition-colors duration-200 ${
                    activeTab === tab.id ? "text-slate-900" : "text-slate-600"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {activeTab === "results" ? (
        <main className="flex-1 w-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <CarbonDashboard />
        </main>
      ) : activeTab === "travel" ? (
        <>
          <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 pb-6 sm:pb-8">
            <section className="mt-1 sm:mt-2">
              <h2 className="text-xl sm:text-2xl font-bold mb-0.5">Transportation</h2>
              <p className="text-slate-600 text-sm sm:text-base mb-2.5 sm:mb-3">
                How do you get around on a daily basis?
              </p>
            </section>

            <section className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2.5">
                  Primary Vehicle Type
                </h3>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                  {[
                    {
                      id: "vehicles",
                      label: "Vehicles",
                      icon: <FaCar className="text-emerald-500" />,
                    },
                    {
                      id: "flight",
                      label: "Flights",
                      icon: <FaPlaneDeparture className="text-violet-500" />,
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setVehicle(item.id)}
                      className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border-2 min-h-[50px] w-full transition-all duration-200 ease-out ${
                        vehicle === item.id
                          ? "border-[#13ec5b] bg-[#13ec5b]/5 text-slate-800 shadow-[0_8px_20px_rgba(19,236,91,0.16)]"
                          : "border-transparent bg-slate-50 text-slate-600 hover:border-slate-200 hover:bg-white hover:-translate-y-0.5 hover:shadow-sm"
                      }`}
                    >
                      <div className="text-lg leading-none">{item.icon}</div>
                      <span className="font-semibold text-sm leading-none">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {vehicle === "flight" ? (
                <FlightCalculatorForm />
              ) : (
                <div className="w-full space-y-3">
                  {vehicleEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700">Vehicle Item {index + 1}</p>
                        {vehicleEntries.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVehicleEntry(index)}
                            className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Vehicle Type</label>
                          <select
                            name="vehicleType"
                            value={entry.vehicleType}
                            onChange={(e) => handleVehicleFormChange(index, e)}
                            className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                          >
                            <option value="">Select vehicle type</option>
                            <option value="2-wheelers">2 Wheelers</option>
                            <option value="4-wheelers">4 Wheelers</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Fuel Type</label>
                          <select
                            name="fuelType"
                            value={entry.fuelType}
                            onChange={(e) => handleVehicleFormChange(index, e)}
                            className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                          >
                            <option value="">Select fuel type</option>
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="cng">CNG</option>
                            <option value="electric">Electric</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Distance Travelled</label>
                          <input
                            type="number"
                            name="distanceTravelled"
                            min="0"
                            placeholder="per month"
                            value={entry.distanceTravelled}
                            onChange={(e) => handleVehicleFormChange(index, e)}
                            className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Mileage</label>
                          <input
                            type="number"
                            name="mileage"
                            min="0"
                            placeholder="e.g. 18"
                            value={entry.mileage}
                            onChange={(e) => handleVehicleFormChange(index, e)}
                            className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addVehicleEntry}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                  >
                    + Add Vehicle Category
                  </button>
                </div>
              )}
            </section>

          </main>

        </>
      ) : activeTab === "housing" ? (
        <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 pb-6 sm:pb-10">
          <div className="w-full min-h-full bg-slate-50 p-3 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl font-['Poppins']">
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-3.5 sm:p-5 md:p-6 lg:p-8">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-[30px] font-bold">Housing Carbon Calculator</h2>
              </div>

              <div className="w-full space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Electricity Consumption (kWh)
                  </label>
                  <input
                    type="number"
                    name="electricityKwh"
                    min="0"
                    placeholder="e.g. 250"
                    value={housingForm.electricityKwh}
                    onChange={handleHousingChange}
                    className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Number of LPG Cylinders Used
                  </label>
                  <input
                    type="number"
                    name="lpgCylinders"
                    min="0"
                    placeholder="e.g. 2"
                    value={housingForm.lpgCylinders}
                    onChange={handleHousingChange}
                    className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : activeTab === "food" ? (
        <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 pb-6 sm:pb-10">
          <div className="w-full min-h-full bg-slate-50 p-3 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl font-['Poppins']">
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-3.5 sm:p-5 md:p-6 lg:p-8">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-[30px] font-bold">Food Carbon Calculator</h2>
              </div>

              <div className="w-full space-y-3">
                <div className="space-y-3">
                  {foodEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-3 h-full"
                    >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">Food Item {index + 1}</p>
                      {foodEntries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFoodEntry(index)}
                          className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">Add Food</label>
                        <select
                          name="category"
                          value={entry.category}
                          onChange={(e) => handleFoodChange(index, e)}
                          className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                        >
                          <option value="">Select category</option>
                          <option value="rice">Rice</option>
                          <option value="dal">Dal</option>
                          <option value="chicken">Chicken</option>
                          <option value="fish">Fish</option>
                          <option value="milk">Milk</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-1.5">
                          No. of Days Consumed
                        </label>
                        <input
                          type="number"
                          name="daysConsumed"
                          min="0"
                          placeholder="e.g. 5"
                          value={entry.daysConsumed}
                          onChange={(e) => handleFoodChange(index, e)}
                          className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-1.5">
                          Average consumption per day
                        </label>
                        <input
                          type="number"
                          name="avgConsumptionPerDay"
                          min="0"
                          placeholder="e.g. 2"
                          value={entry.avgConsumptionPerDay}
                          onChange={(e) => handleFoodChange(index, e)}
                          className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                </div>

                <button
                  type="button"
                  onClick={addFoodEntry}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                >
                  + Add Food Category
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pb-10 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold capitalize mb-2">{activeTab} section</h2>
            <p className="text-slate-600">This section UI will be added next.</p>
          </div>
        </main>
      )}
    </div>
  );
}
