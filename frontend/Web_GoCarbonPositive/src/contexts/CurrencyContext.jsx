import React, { createContext, useMemo, useState } from "react";

const CurrencyContext = createContext(null);

const STORAGE_KEY = "carbon_positive_currency";
const DEFAULT_CURRENCY = "USD";
const DEFAULT_FX_RATE = 82.5;

function getInitialCurrency() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "USD" || stored === "INR") {
      return stored;
    }
  } catch (_error) {
    // ignore localStorage read errors
  }
  return DEFAULT_CURRENCY;
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(getInitialCurrency);

  const setCurrency = (nextCurrency) => {
    if (nextCurrency !== "USD" && nextCurrency !== "INR") {
      return;
    }
    setCurrencyState(nextCurrency);
    try {
      localStorage.setItem(STORAGE_KEY, nextCurrency);
    } catch (_error) {
      // ignore localStorage write errors
    }
  };

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      fxRate: DEFAULT_FX_RATE,
    }),
    [currency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export default CurrencyContext;
