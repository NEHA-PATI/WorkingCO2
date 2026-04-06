import React from "react";
import useCurrency from "../hooks/useCurrency";
import { convertPrice, formatPrice } from "../lib/currencyUtils";
import "../styles/currency.css";

export default function PriceDisplay({
  priceUSD,
  unit = "tCO2e",
  showApprox = false,
  size = "md",
}) {
  const { currency, fxRate } = useCurrency();
  const activePrice = convertPrice(priceUSD, currency, fxRate);
  const alternateCurrency = currency === "USD" ? "INR" : "USD";
  const approxPrice = convertPrice(priceUSD, alternateCurrency, fxRate);

  return (
    <div className={`price-display price-display--${size}`}>
      <span className="price-display__primary">
        {formatPrice(activePrice, currency)} / {unit}
      </span>
      {showApprox && (
        <span className="price-display__secondary">
          Approx. {formatPrice(approxPrice, alternateCurrency)}
        </span>
      )}
    </div>
  );
}
