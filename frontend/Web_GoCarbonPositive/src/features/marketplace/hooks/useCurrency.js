import { useContext } from "react";
import CurrencyContext from "@contexts/CurrencyContext";

export default function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }

  return context;
}
