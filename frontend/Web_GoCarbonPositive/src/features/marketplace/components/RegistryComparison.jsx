import React, { useMemo } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/basic-ui";
import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, Gauge, ShieldCheck, Waves } from "lucide-react";
import { credits, getRegistryComparisonData } from "../config/mockMarketplaceData";
import useCurrency from "../hooks/useCurrency";
import { formatPriceFromUSD } from "../lib/currencyUtils";

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export default function RegistryComparison() {
  const { currency, fxRate } = useCurrency();
  const money = (value, options = {}) => formatPriceFromUSD(value, currency, fxRate, options);
  const comparisonRows = useMemo(() => getRegistryComparisonData(), []);

  const highlights = useMemo(() => {
    const cdrTypes = new Set(["Direct Air Capture", "Biochar", "Industrial CCS"]);
    const cdrCredits = credits.filter((credit) => cdrTypes.has(credit.projectType));
    const nbsCredits = credits.filter(
      (credit) => credit.projectType === "Nature-Based Solutions",
    );
    const removalCredits = credits.filter((credit) => credit.removalType === "removal");
    const avoidanceCredits = credits.filter(
      (credit) => credit.removalType === "avoidance" || credit.removalType === "hybrid",
    );

    const cdrAverage = mean(cdrCredits.map((credit) => credit.currentPrice));
    const marketAverage = mean(credits.map((credit) => credit.currentPrice));
    const removalAverage = mean(removalCredits.map((credit) => credit.currentPrice));
    const avoidanceAverage = mean(avoidanceCredits.map((credit) => credit.currentPrice));
    const nbsVolatility = mean(nbsCredits.map((credit) => credit.volatilityScore));
    const marketVolatility = mean(credits.map((credit) => credit.volatilityScore));

    return {
      cdrPremiumPct: marketAverage
        ? ((cdrAverage - marketAverage) / marketAverage) * 100
        : 0,
      removalPremiumPct: avoidanceAverage
        ? ((removalAverage - avoidanceAverage) / avoidanceAverage) * 100
        : 0,
      nbsVolatilityDelta: nbsVolatility - marketVolatility,
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">
                  CDR Premium
                </p>
                <p className="text-xl font-bold text-slate-900">
                  +{highlights.cdrPremiumPct.toFixed(1)}%
                </p>
                <p className="text-sm text-slate-600">
                  CDR credits trade above market averages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Waves className="mt-0.5 h-5 w-5 text-amber-600" />
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">
                  Nature-Based Volatility
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {highlights.nbsVolatilityDelta > 0 ? "+" : ""}
                  {highlights.nbsVolatilityDelta.toFixed(1)} pts
                </p>
                <p className="text-sm text-slate-600">
                  Nature-based solutions show higher volatility.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Gauge className="mt-0.5 h-5 w-5 text-sky-600" />
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">
                  Removal Premium
                </p>
                <p className="text-xl font-bold text-slate-900">
                  +{highlights.removalPremiumPct.toFixed(1)}%
                </p>
                <p className="text-sm text-slate-600">
                  Removal credits command structural premium.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-brand-700" />
            Registry Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registry</TableHead>
                <TableHead>Avg Price</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Dominant Type</TableHead>
                <TableHead>Liquidity Depth</TableHead>
                <TableHead>Volatility</TableHead>
                <TableHead>Rating Premium</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {row.name}
                    <Badge variant="outline" className="ml-2">
                      {row.code}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {money(row.averagePrice, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>{row.volume.toLocaleString()} t</TableCell>
                  <TableCell>{row.dominantProjectType}</TableCell>
                  <TableCell>{row.liquidityDepth.toLocaleString()} t</TableCell>
                  <TableCell>{row.volatility.toFixed(2)}%</TableCell>
                  <TableCell>+{row.ratingPremiumImpact.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Registry Price vs Volatility</CardTitle>
        </CardHeader>
        <CardContent className="h-[290px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={comparisonRows}>
              <XAxis dataKey="code" />
              <YAxis yAxisId="price" orientation="left" />
              <YAxis yAxisId="volatility" orientation="right" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "averagePrice") {
                    return [
                      money(value, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }),
                      "Average Price",
                    ];
                  }
                  if (name === "volatility") {
                    return [`${Number(value).toFixed(2)}%`, "Volatility"];
                  }
                  return [value, name];
                }}
              />
              <Bar
                yAxisId="price"
                dataKey="averagePrice"
                fill="#059669"
                radius={[6, 6, 0, 0]}
              />
              <Line
                yAxisId="volatility"
                type="monotone"
                dataKey="volatility"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
