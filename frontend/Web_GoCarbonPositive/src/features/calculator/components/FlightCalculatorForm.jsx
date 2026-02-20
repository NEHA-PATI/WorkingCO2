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
    <div className="w-full min-h-full bg-slate-50 p-3 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl font-['Poppins']">
      <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-3.5 sm:p-5 md:p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <FaPlaneDeparture className="text-sky-500 text-xl sm:text-2xl" />
          <h1 className="text-xl sm:text-[30px] font-bold">Flight Carbon Calculator</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Trip Type</label>
              <select
                name="tripType"
                value={form.tripType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              >
                <option value="one-way">One Way</option>
                <option value="round-trip">Round Trip</option>
                <option value="multi-city">Multi-City</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Departure Airport
              </label>
              <input
                type="text"
                name="departure"
                placeholder="e.g. DEL"
                value={form.departure}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Arrival Airport
              </label>
              <input
                type="text"
                name="arrival"
                placeholder="e.g. LHR"
                value={form.arrival}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Cabin Class</label>
              <select
                name="cabinClass"
                value={form.cabinClass}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              >
                <option value="economy">Economy</option>
                <option value="premium">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Flight Legs (Multi-city)
              </label>
              <input
                type="number"
                name="legs"
                min="1"
                value={form.legs}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Aircraft Type (Optional)
              </label>
              <input
                type="text"
                name="aircraft"
                placeholder="e.g. Boeing 787"
                value={form.aircraft}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Airline (Optional)
              </label>
              <input
                type="text"
                name="airline"
                placeholder="e.g. Air India"
                value={form.airline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Travel Date (Optional)
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-violet-500 text-sm sm:text-base" />
                <input
                  type="date"
                  name="travelDate"
                  value={form.travelDate}
                  onChange={handleChange}
                  className="w-full pl-10 sm:pl-12 pr-3.5 sm:pr-4 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-7">
          <button className="block w-full sm:w-auto sm:min-w-[280px] mx-auto px-6 sm:px-8 py-2.5 bg-[#13ec5b] text-slate-900 font-semibold text-sm sm:text-base rounded-xl shadow-md hover:bg-[#0eb947] transition-colors">
            Calculate Flight Emissions
          </button>
        </div>
      </div>
    </div>
  );
}
