import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/basic-ui";
import {
  Area,
  AreaChart,
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  Activity,
  ArrowDownUp,
  BarChart3,
  DollarSign,
  Layers,
  TrendingDown,
  TrendingUp,
  Waves,
} from "lucide-react";
import {
  credits,
  getExchangeMetrics,
  getExchangeSeries,
  getHeatmapByProjectType,
  getIssuanceTrend,
  getLiquidityDepthSeries,
  getOrderBook,
  getTradeTicker,
} from "../config/mockMarketplaceData";
import { cn } from "../lib/utils";
import useCurrency from "../hooks/useCurrency";
import { formatPriceFromUSD } from "../lib/currencyUtils";

const timeframeOptions = ["1D", "1W", "1M", "6M", "1Y", "ALL"];

function ExchangeTooltip({ active, payload, label, money }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-slate-500">Registry</span>
        <span className="font-medium text-slate-900">{point.registry}</span>
        <span className="text-slate-500">Project Type</span>
        <span className="font-medium text-slate-900">{point.projectType}</span>
        <span className="text-slate-500">Credit Score</span>
        <span className="font-medium text-slate-900">{point.score}</span>
        <span className="text-slate-500">Volume Traded</span>
        <span className="font-medium text-slate-900">
          {point.volumeTraded.toLocaleString()} t
        </span>
        <span className="text-slate-500">Trade Price</span>
        <span className="font-medium text-slate-900">{money(point.tradePrice)}</span>
      </div>
    </div>
  );
}

function MetricCard({ title, value, hint, trend = "neutral" }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">{title}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-600">{hint}</p>
          </div>
          <div
            className={cn(
              "rounded-full p-2",
              trend === "up" && "bg-emerald-100 text-emerald-700",
              trend === "down" && "bg-rose-100 text-rose-700",
              trend === "neutral" && "bg-slate-100 text-slate-700",
            )}
          >
            {trend === "up" && <TrendingUp className="h-4 w-4" />}
            {trend === "down" && <TrendingDown className="h-4 w-4" />}
            {trend === "neutral" && <Activity className="h-4 w-4" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExchangeDashboard() {
  const { currency, fxRate } = useCurrency();
  const [timeframe, setTimeframe] = useState("1M");
  const [chartMode, setChartMode] = useState("candlestick");
  const [selectedListingId, setSelectedListingId] = useState(credits[0]?.id || "");
  const [tickerOffset, setTickerOffset] = useState(0);

  const ticker = useMemo(() => getTradeTicker(26), []);
  const series = useMemo(() => getExchangeSeries(timeframe), [timeframe]);
  const metrics = useMemo(() => getExchangeMetrics(timeframe), [timeframe]);
  const heatmap = useMemo(() => getHeatmapByProjectType(), []);
  const issuanceTrend = useMemo(() => getIssuanceTrend(), []);
  const orderBook = useMemo(() => getOrderBook(selectedListingId), [selectedListingId]);
  const depthSeries = useMemo(() => getLiquidityDepthSeries(orderBook), [orderBook]);
  const money = (value) =>
    formatPriceFromUSD(value, currency, fxRate, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTickerOffset((previous) => (previous + 1) % ticker.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [ticker.length]);

  const visibleTicker = useMemo(() => {
    const wrapped = [...ticker, ...ticker];
    return wrapped.slice(tickerOffset, tickerOffset + 12);
  }, [ticker, tickerOffset]);

  const spreadBps =
    orderBook.mid > 0 ? Number(((orderBook.spread / orderBook.mid) * 10000).toFixed(1)) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard
          title="24h Volume"
          value={`${metrics.volume24h.toLocaleString()} t`}
          hint="Institutional flow"
          trend="up"
        />
        <MetricCard
          title="Avg Market Price"
          value={money(metrics.averageMarketPrice)}
          hint={`Last ${timeframe}`}
          trend={metrics.priceChangePct >= 0 ? "up" : "down"}
        />
        <MetricCard
          title="Highest Registry"
          value={money(metrics.highestRegistryAveragePrice || 0)}
          hint={metrics.highestRegistryName || "N/A"}
          trend="up"
        />
        <MetricCard
          title="Most Traded Type"
          value={metrics.mostTradedProjectType}
          hint="30-day turnover"
          trend="neutral"
        />
        <MetricCard
          title="Volatility"
          value={`${metrics.volatilityPct}%`}
          hint="Annualized"
          trend={metrics.volatilityPct > 18 ? "down" : "neutral"}
        />
        <MetricCard
          title="Liquidity Score"
          value={`${metrics.liquidityScore}/100`}
          hint="Depth-weighted"
          trend="up"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand-700" />
              Exchange Dashboard
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border border-slate-200 bg-white p-1">
                <Button
                  size="sm"
                  variant={chartMode === "candlestick" ? "default" : "ghost"}
                  onClick={() => setChartMode("candlestick")}
                >
                  Candlestick
                </Button>
                <Button
                  size="sm"
                  variant={chartMode === "line" ? "default" : "ghost"}
                  onClick={() => setChartMode("line")}
                >
                  Line
                </Button>
              </div>
              <div className="flex rounded-lg border border-slate-200 bg-white p-1">
                {timeframeOptions.map((option) => (
                  <Button
                    key={option}
                    size="sm"
                    variant={timeframe === option ? "default" : "ghost"}
                    onClick={() => setTimeframe(option)}
                    className="px-2"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={series}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="price" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip content={<ExchangeTooltip money={money} />} />
                {chartMode === "line" ? (
                  <>
                    <Area
                      yAxisId="price"
                      type="monotone"
                      dataKey="close"
                      stroke="#059669"
                      fill="url(#exchangeLine)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="exchangeLine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.32} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                  </>
                ) : (
                  <>
                    <Bar yAxisId="price" dataKey="wickBase" stackId="wick" fill="transparent" barSize={3} />
                    <Bar yAxisId="price" dataKey="wickRange" stackId="wick" fill="#94a3b8" barSize={3} />
                    <Bar yAxisId="price" dataKey="bodyBase" stackId="body" fill="transparent" barSize={9} />
                    <Bar yAxisId="price" dataKey="bodyRange" stackId="body" barSize={9}>
                      {series.map((point) => (
                        <Cell
                          key={`${point.date}-body`}
                          fill={point.candleDirection === "up" ? "#059669" : "#dc2626"}
                        />
                      ))}
                    </Bar>
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[120px] rounded-xl border border-slate-200/80 bg-slate-50/60 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString()} t`, "Volume"]}
                />
                <Area type="monotone" dataKey="volume" stroke="#2563eb" fill="#bfdbfe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowDownUp className="h-4 w-4 text-brand-700" />
              Order Book
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedListingId} onValueChange={setSelectedListingId}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {credits.map((credit) => (
                    <SelectItem key={credit.id} value={credit.id}>
                      {credit.projectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline">
                Spread {money(orderBook.spread)} ({spreadBps} bps)
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bid</TableHead>
                  <TableHead className="text-right">Vol</TableHead>
                  <TableHead>Ask</TableHead>
                  <TableHead className="text-right">Vol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderBook.bids.slice(0, 8).map((bid, index) => {
                  const ask = orderBook.asks[index];
                  return (
                    <TableRow key={`${bid.level}-${ask?.level || index}`}>
                      <TableCell className="text-emerald-700">{money(bid.price)}</TableCell>
                      <TableCell className="text-right">{bid.volume.toLocaleString()}</TableCell>
                      <TableCell className="text-rose-700">{money(ask?.price || 0)}</TableCell>
                      <TableCell className="text-right">
                        {(ask?.volume || 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Waves className="h-4 w-4 text-brand-700" />
              Liquidity Depth
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={depthSeries}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "bidPrice" || name === "askPrice") {
                      return [money(value), name];
                    }
                    return [`${Number(value).toLocaleString()} t`, name];
                  }}
                />
                <Area type="monotone" dataKey="bidDepth" stroke="#059669" fill="#bbf7d0" />
                <Area type="monotone" dataKey="askDepth" stroke="#dc2626" fill="#fecaca" />
                <Line type="monotone" dataKey="bidPrice" stroke="#10b981" strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="askPrice" stroke="#ef4444" strokeDasharray="4 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Institutional Trade Ticker</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 overflow-x-auto pb-2">
          {visibleTicker.map((item) => (
            <div
              key={item.id}
              className={cn(
                "min-w-[220px] rounded-xl border px-3 py-2 text-xs",
                item.side === "BUY"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-rose-200 bg-rose-50 text-rose-900",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{item.side}</span>
                <span>{item.time}</span>
              </div>
              <div className="mt-1">{item.registry}</div>
              <div>{item.projectType}</div>
              <div className="mt-1 flex items-center justify-between">
                <span>{item.volume.toLocaleString()} t</span>
                <span className="font-semibold">{money(item.price)}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4 text-brand-700" />
              Most Traded Project Type Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {heatmap.map((item) => (
              <div
                key={item.projectType}
                className="rounded-lg border border-slate-200 p-3"
                style={{
                  backgroundColor: `rgba(16,185,129,${0.08 + item.intensity * 0.42})`,
                }}
              >
                <p className="text-sm font-semibold text-slate-900">{item.projectType}</p>
                <p className="text-xs text-slate-700">{item.volume.toLocaleString()} t (60d)</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-brand-700" />
              Issuance Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={issuanceTrend}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString()} t`, "Issued"]}
                />
                <Area type="monotone" dataKey="total" stroke="#0f766e" fill="#99f6e4" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
