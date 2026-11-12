export function convertPrice(priceUSD, currency, fxRate) {
  const normalizedPrice = Number(priceUSD) || 0;

  if (currency === "INR") {
    return Number((normalizedPrice * fxRate).toFixed(2));
  }

  return Number(normalizedPrice.toFixed(2));
}

export function formatPrice(value, currency, options = {}) {
  const normalizedValue = Number(value) || 0;
  const {
    maximumFractionDigits = 2,
    minimumFractionDigits = 0,
  } = options;

  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(normalizedValue);
}

export function formatPriceFromUSD(priceUSD, currency, fxRate, options = {}) {
  return formatPrice(convertPrice(priceUSD, currency, fxRate), currency, options);
}
