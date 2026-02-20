import { useState } from "react";
import { FaPlaneDeparture, FaCalendarAlt } from "react-icons/fa";

export default function FlightCalculatorForm() {
  const [form, setForm] = useState({
    tripType: "one-way",
    departure: "",
    arrival: "",
    cabinClass: "economy",
    legs: 1,
    aircraft: "",
    airline: "",
    travelDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-slate-50 p-6 rounded-3xl">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="flex items-center gap-3 mb-10">
          <FaPlaneDeparture className="text-[#13ec5b] text-2xl" />
          <h1 className="text-3xl font-bold">Flight Carbon Calculator</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Trip Type</label>
              <select
                name="tripType"
                value={form.tripType}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              >
                <option value="one-way">One Way</option>
                <option value="round-trip">Round Trip</option>
                <option value="multi-city">Multi-City</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Departure Airport
              </label>
              <input
                type="text"
                name="departure"
                placeholder="e.g. DEL"
                value={form.departure}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Arrival Airport
              </label>
              <input
                type="text"
                name="arrival"
                placeholder="e.g. LHR"
                value={form.arrival}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Cabin Class</label>
              <select
                name="cabinClass"
                value={form.cabinClass}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              >
                <option value="economy">Economy</option>
                <option value="premium">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Flight Legs (Multi-city)
              </label>
              <input
                type="number"
                name="legs"
                min="1"
                value={form.legs}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Aircraft Type (Optional)
              </label>
              <input
                type="text"
                name="aircraft"
                placeholder="e.g. Boeing 787"
                value={form.aircraft}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Airline (Optional)
              </label>
              <input
                type="text"
                name="airline"
                placeholder="e.g. Air India"
                value={form.airline}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Travel Date (Optional)
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  name="travelDate"
                  value={form.travelDate}
                  onChange={handleChange}
                  className="w-full pl-12 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <button className="w-full py-5 bg-[#13ec5b] text-slate-900 font-bold text-lg rounded-2xl shadow-lg hover:bg-[#0eb947] transition-colors">
            Calculate Flight Emissions
          </button>
        </div>
      </div>
    </div>
  );
}
