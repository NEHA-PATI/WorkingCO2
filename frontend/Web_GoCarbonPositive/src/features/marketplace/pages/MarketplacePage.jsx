import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import "../styles/marketplace.css";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/basic-ui";
import {
  BarChart3,
  Building2,
  Calculator,
  CandlestickChart,
  CreditCard,
  Eye,
  Heart,
  History,
  PieChart,
  Send,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

import BrowseListings from "../components/BrowseListings";
import BuyCredits from "../components/BuyCredits";
import ExchangeDashboard from "../components/ExchangeDashboard";
import ProjectTypeSegmentation from "../components/ProjectTypeSegmentation";
import RegistryComparison from "../components/RegistryComparison";
import OffsetCalculator from "../components/OffsetCalculator";
import Overview from "../components/Overview";
import PriceAnalytics from "../components/PriceAnalytics";
import RatingsReviews from "../components/RatingsReviews";
import SellCredits from "../components/SellCredits";
import TransactionHistory from "../components/TransactionHistory";
import TransferCredits from "../components/TransferCredits";
import Watchlist from "../components/Watchlist";
import { getExchangeMetrics } from "../config/mockMarketplaceData";

const tabs = [
  {
    id: "overview",
    label: "Overview",
    icon: Sparkles,
    component: Overview,
    description: "Marketplace overview, broad metrics, and featured activity",
  },
  {
    id: "exchange",
    label: "Exchange",
    icon: CandlestickChart,
    component: ExchangeDashboard,
    description: "Institutional market tape, depth, spread, and execution flow",
  },
  {
    id: "registries",
    label: "Registries",
    icon: Building2,
    component: RegistryComparison,
    description: "Compare pricing and liquidity by registry credibility",
  },
  {
    id: "segments",
    label: "Segments",
    icon: PieChart,
    component: ProjectTypeSegmentation,
    description: "Project-type segmentation with rating and volatility impact",
  },
  {
    id: "browse",
    label: "Browse",
    icon: Eye,
    component: BrowseListings,
    description: "Browse verified marketplace listings",
  },
  {
    id: "buy",
    label: "Buy",
    icon: ShoppingCart,
    component: BuyCredits,
    description: "Purchase credits with smart settlement",
  },
  {
    id: "sell",
    label: "Sell",
    icon: CreditCard,
    component: SellCredits,
    description: "List your holdings with flexible pricing",
    showInBar: false,
  },
  {
    id: "transfer",
    label: "Transfer",
    icon: Send,
    component: TransferCredits,
    description: "Move credits across wallets and users",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    component: PriceAnalytics,
    description: "Track trend signals and market depth",
  },
  {
    id: "history",
    label: "History",
    icon: History,
    component: TransactionHistory,
    description: "Audit your complete transaction activity",
  },
  {
    id: "watchlist",
    label: "Watchlist",
    icon: Heart,
    component: Watchlist,
    description: "Monitor assets and active alerts",
  },
  {
    id: "calculator",
    label: "Calculator",
    icon: Calculator,
    component: OffsetCalculator,
    description: "Estimate and offset your footprint",
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: Star,
    component: RatingsReviews,
    description: "Compare seller reputation and trust",
  },
];

const Marketplace = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const activeTabConfig = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) ?? tabs[0],
    [activeTab],
  );
  const exchangeMetrics = useMemo(() => getExchangeMetrics("1M"), []);
  const summaryCards = useMemo(
    () => [
      {
        label: "Market Price",
        value: `$${exchangeMetrics.lastPrice.toFixed(2)}`,
        delta: `${exchangeMetrics.priceChangePct >= 0 ? "+" : ""}${exchangeMetrics.priceChangePct.toFixed(2)}% in 24h`,
      },
      {
        label: "24h Volume",
        value: `${exchangeMetrics.volume24h.toLocaleString()} t`,
        delta: `Volatility ${exchangeMetrics.volatilityPct.toFixed(2)}%`,
      },
      {
        label: "Liquidity",
        value: `${exchangeMetrics.liquidityScore}/100`,
        delta: `${exchangeMetrics.mostTradedProjectType} leading`,
      },
    ],
    [exchangeMetrics],
  );

  const ActiveComponent = activeTabConfig.component;
  const visibleTabs = useMemo(
    () => tabs.filter((tab) => tab.showInBar !== false),
    [],
  );

  useEffect(() => {
    const requestedTab = new URLSearchParams(location.search).get("tab");
    if (!requestedTab) return;
    if (tabs.some((tab) => tab.id === requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [location.search]);

  return (
    <div className="marketplace-shell min-h-screen pb-2 pt-0">
      <main className="w-full">
        <section
          className="marketplace-tabbar sticky z-20 border-b border-slate-200 bg-white"
          style={{ top: "var(--navbar-height, 72px)" }}
        >
          <nav className="flex items-center gap-1 overflow-x-auto px-2 py-1">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "inline-flex min-w-fit items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2",
                    isActive
                      ? "bg-emerald-50 text-emerald-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </section>

        {activeTab === "overview" ? (
          <section className="space-y-2 px-2 py-2">
            <section className="glass-panel animate-fade-up rounded-xl p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl space-y-4">
                  <Badge className="inline-flex bg-brand-100 text-brand-800">
                    <Sparkles className="mr-1.5 h-3 w-3" />
                    Live Carbon Exchange
                  </Badge>
                  <h1 className="font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-[2.15rem]">
                    Carbon Credit Marketplace
                  </h1>
                  <p className="text-sm text-slate-600 sm:text-base">
                    Discover, trade, and track verified carbon credits with
                    transparent pricing and measurable climate impact.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Market Active
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Shield className="mr-2 h-4 w-4" />
                    Blockchain Verified
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
                {summaryCards.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-slate-200/70 bg-white/85 p-3"
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-brand-700">{stat.delta}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="animate-fade-up [animation-delay:180ms]">
              <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
                <CardHeader className="space-y-1.5 border-slate-100 pb-3">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <activeTabConfig.icon className="h-5 w-5 text-brand-700" />
                    <span>{activeTabConfig.label}</span>
                  </CardTitle>
                  <p className="text-sm text-slate-600">
                    {activeTabConfig.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ActiveComponent />
                </CardContent>
              </Card>
            </section>
          </section>
        ) : (
          <section className="animate-fade-up [animation-delay:180ms] px-2 py-2">
            <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
              <CardHeader className="space-y-1.5 border-slate-100 pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <activeTabConfig.icon className="h-5 w-5 text-brand-700" />
                  <span>{activeTabConfig.label}</span>
                </CardTitle>
                <p className="text-sm text-slate-600">
                  {activeTabConfig.description}
                </p>
              </CardHeader>
              <CardContent>
                <ActiveComponent />
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default Marketplace;
