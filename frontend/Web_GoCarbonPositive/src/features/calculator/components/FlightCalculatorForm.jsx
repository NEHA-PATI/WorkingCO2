import { useState } from "react";
import { FaPlaneDeparture } from "react-icons/fa";

export default function FlightCalculatorForm() {
  const [entries, setEntries] = useState([
    {
      tripType: "one-way",
      departure: "",
      arrival: "",
      cabinClass: "economy",
      legs: 1,
    },
  ]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, [name]: value } : entry)),
    );
  };

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        tripType: "one-way",
        departure: "",
        arrival: "",
        cabinClass: "economy",
        legs: 1,
      },
    ]);
  };

  const removeEntry = (index) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2200);
  };

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
                    onClick={() => removeEntry(index)}
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
                      onChange={(e) => handleChange(index, e)}
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
                      placeholder="e.g. DEL"
                      value={entry.departure}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
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
                      placeholder="e.g. LHR"
                      value={entry.arrival}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Cabin Class</label>
                    <select
                      name="cabinClass"
                      value={entry.cabinClass}
                      onChange={(e) => handleChange(index, e)}
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
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addEntry}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
          >
            + Add Flight Category
          </button>
        </div>

        <div className="mt-5 sm:mt-7">
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="block w-full sm:w-auto sm:min-w-[280px] mx-auto px-6 sm:px-8 py-2.5 bg-[#13ec5b] text-slate-900 font-semibold text-sm sm:text-base rounded-xl shadow-md hover:bg-[#0eb947] transition-colors"
          >
            Submit Details
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Confirm Submission</h3>
            <p className="text-sm text-slate-600 mb-4">Do you want to submit these details?</p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-4 right-4 z-[60] rounded-lg bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold shadow-lg">
          Details submitted successfully
        </div>
      )}
    </div>
  );
}
