import React from "react";
import useCurrency from "../hooks/useCurrency";
import "../styles/currency.css";

const CURRENCIES = ["USD", "INR"];

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="currency-toggle" role="group" aria-label="Currency toggle">
      {CURRENCIES.map((option) => (
        <button
          key={option}
          type="button"
          className={`currency-toggle__btn ${
            currency === option ? "currency-toggle__btn--active" : ""
          }`}
          onClick={() => setCurrency(option)}
          aria-pressed={currency === option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
