import React, { useMemo, useState } from "react";
import {
  Badge,
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
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PieChart, TrendingUp } from "lucide-react";
import {
  getProjectSegmentationData,
  getProjectTypes,
  ratingPremiumMultipliers,
} from "../config/mockMarketplaceData";
import useCurrency from "../hooks/useCurrency";
import { formatPriceFromUSD } from "../lib/currencyUtils";

const scoreOrder = ["AAA", "AA", "A", "BBB", "BB"];

const scoreClasses = {
  AAA: "bg-emerald-100 text-emerald-700 border-emerald-200",
  AA: "bg-blue-100 text-blue-700 border-blue-200",
  A: "bg-cyan-100 text-cyan-700 border-cyan-200",
  BBB: "bg-amber-100 text-amber-700 border-amber-200",
  BB: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function ProjectTypeSegmentation() {
  const { currency, fxRate } = useCurrency();
  const projectTypes = useMemo(() => getProjectTypes(), []);
  const [projectType, setProjectType] = useState(projectTypes[0] || "");
  const money = (value, options = {}) => formatPriceFromUSD(value, currency, fxRate, options);
  const data = useMemo(
    () => getProjectSegmentationData(projectType),
    [projectType],
  );
  const priceDistribution = useMemo(
    () =>
      data.priceDistribution.map((item) => ({
        ...item,
        bucketLabel: `${money(item.from, { maximumFractionDigits: 0 })}-${money(item.to, {
          maximumFractionDigits: 0,
        })}`,
      })),
    [currency, data.priceDistribution, fxRate],
  );

  const orderedRatings = useMemo(() => {
    return [...data.ratingImpactDistribution].sort(
      (a, b) => scoreOrder.indexOf(a.score) - scoreOrder.indexOf(b.score),
    );
  }, [data.ratingImpactDistribution]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">
              Project-Type Segmentation
            </p>
            <h3 className="text-xl font-bold text-slate-900">{projectType}</h3>
            <p className="text-sm text-slate-600">
              Price distribution, volatility trend, volume dynamics, registry share, and
              rating premium profile.
            </p>
          </div>
          <div className="w-full sm:w-72">
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Avg Price</p>
            <p className="text-2xl font-bold text-slate-900">
              {money(data.summary.averagePrice, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Volatility</p>
            <p className="text-2xl font-bold text-slate-900">
              {data.summary.averageVolatility.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Liquidity</p>
            <p className="text-2xl font-bold text-slate-900">
              {data.summary.averageLiquidity.toFixed(0)}/100
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">
              Dominant Registry
            </p>
            <p className="text-xl font-bold text-slate-900">
              {data.registryDominance[0]?.name || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Price Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bucketLabel" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Historical Volatility</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.historicalVolatility}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Volatility"]} />
                <Line
                  type="monotone"
                  dataKey="volatility"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Volume Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.volumeTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString()} t`, "Volume"]}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#2563eb"
                  fill="#bfdbfe"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Registry Dominance</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.registryDominance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString()} t`, "Volume"]}
                />
                <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                  {data.registryDominance.map((entry) => (
                    <Cell key={entry.name} fill="#0f766e" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <PieChart className="h-4 w-4 text-brand-700" />
            Rating Impact Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {orderedRatings.map((item) => (
              <div key={item.score} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <Badge className={scoreClasses[item.score] || "bg-slate-100 text-slate-700"}>
                    {item.score}
                  </Badge>
                  <span className="text-xs text-slate-500">{item.count} credits</span>
                </div>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {item.premium >= 0 ? "+" : ""}
                  {item.premium.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-600">
                  Multiplier {(ratingPremiumMultipliers[item.score] || 1).toFixed(2)}x
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-brand-700" />
            Credits in Segment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Registry</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Liquidity</TableHead>
                <TableHead>Volatility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.credits.map((credit) => (
                <TableRow key={credit.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {credit.projectName}
                  </TableCell>
                  <TableCell>{credit.registry}</TableCell>
                  <TableCell>
                    <Badge
                      className={scoreClasses[credit.score] || "bg-slate-100 text-slate-700"}
                    >
                      {credit.score}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {money(credit.currentPrice, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>{credit.liquidityScore}/100</TableCell>
                  <TableCell>{credit.volatilityScore.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
