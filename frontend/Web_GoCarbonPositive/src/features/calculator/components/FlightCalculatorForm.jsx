import { useEffect, useState } from "react";
import { FaPlaneDeparture } from "react-icons/fa";
import { fetchAirportCodes } from "@shared/utils/apiClient";

export default function FlightCalculatorForm({
  entries,
  onEntryChange,
  onAddEntry,
  onRemoveEntry,
}) {
  const [airportOptions, setAirportOptions] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadAirports = async () => {
      try {
        const codes = await fetchAirportCodes("", 500);
        if (mounted) {
          setAirportOptions(codes);
        }
      } catch (error) {
        if (mounted) {
          setAirportOptions([]);
        }
      }
    };

    loadAirports();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full min-h-full bg-slate-50 p-3 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl font-['Poppins']">
      <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-3.5 sm:p-5 md:p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <FaPlaneDeparture className="text-sky-500 text-xl sm:text-2xl" />
          <h1 className="text-xl sm:text-[30px] font-bold">Flight Carbon Calculator</h1>
        </div>

        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Flight Item {index + 1}</p>
                {entries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveEntry(index)}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                <div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Trip Type</label>
                    <select
                      name="tripType"
                      value={entry.tripType}
                      onChange={(e) => onEntryChange(index, e)}
                      className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                    >
                      <option value="one-way">One Way</option>
                      <option value="round-trip">Round Trip</option>
                      <option value="multi-city">Multi-City</option>
                      </select>
                  </div>
                </div>

                <div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      Departure Airport
                    </label>
                    <input
                      type="text"
                      name="departure"
                      list="airport-codes-list"
                      placeholder="Select airport (e.g. DEL)"
                      value={entry.departure}
                      maxLength={3}
                      onChange={(e) =>
                        onEntryChange(index, {
                          target: {
                            name: e.target.name,
                            value: e.target.value.toUpperCase(),
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 uppercase text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      Arrival Airport
                    </label>
                    <input
                      type="text"
                      name="arrival"
                      list="airport-codes-list"
                      placeholder="Select airport (e.g. LHR)"
                      value={entry.arrival}
                      maxLength={3}
                      onChange={(e) =>
                        onEntryChange(index, {
                          target: {
                            name: e.target.name,
                            value: e.target.value.toUpperCase(),
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 uppercase text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Cabin Class</label>
                    <select
                      name="cabinClass"
                      value={entry.cabinClass}
                      onChange={(e) => onEntryChange(index, e)}
                      className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                    >
                      <option value="economy">Economy</option>
                      <option value="premium">Premium Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                      </select>
                  </div>
                </div>

                <div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      Flight Legs (Multi-city)
                    </label>
                    <input
                      type="number"
                      name="legs"
                      min="1"
                      value={entry.legs}
                      onChange={(e) => onEntryChange(index, e)}
                      className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={onAddEntry}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
          >
            + Add Flight Category
          </button>
        </div>
      </div>
      <datalist id="airport-codes-list">
        {airportOptions.map((code) => (
          <option key={code} value={code} />
        ))}
      </datalist>
    </div>
  );
}
