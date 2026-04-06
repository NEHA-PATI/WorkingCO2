import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "./polyfills";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { AuthProvider } from "@contexts/AuthContext";
import { CurrencyProvider } from "@contexts/CurrencyContext";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <AuthProvider>
            <ToastContainer />
            <App />
          </AuthProvider>
        </CurrencyProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
