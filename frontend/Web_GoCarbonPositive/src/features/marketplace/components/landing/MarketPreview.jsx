import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import useCurrency from "../../hooks/useCurrency";
import { formatPriceFromUSD } from "../../lib/currencyUtils";

const generateChartData = () => {
  const data = [];
  let price = 12;
  for (let i = 0; i < 30; i += 1) {
    price += (Math.random() - 0.45) * 1.5;
    price = Math.max(8, Math.min(25, price));
    data.push({
      day: `Day ${i + 1}`,
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50000 + 10000),
    });
  }
  return data;
};

const mockAssets = [
  {
    name: "Brazil Reforestation",
    registry: "Verra",
    type: "Nature-Based",
    price: 14.82,
    change: 3.2,
    volume: "42.1K",
  },
  {
    name: "India Wind Farm",
    registry: "Gold Standard",
    type: "Renewable",
    price: 8.45,
    change: -1.1,
    volume: "28.7K",
  },
  {
    name: "Kenya Biochar",
    registry: "Puro.earth",
    type: "Biochar",
    price: 22.3,
    change: 5.7,
    volume: "15.3K",
  },
  {
    name: "Iceland DAC",
    registry: "Verra",
    type: "DAC",
    price: 120,
    change: 2.1,
    volume: "8.9K",
  },
];

export default function MarketPreview() {
  const { currency, fxRate } = useCurrency();
  const [chartData] = useState(generateChartData);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const money = (value) =>
    formatPriceFromUSD(value, currency, fxRate, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <motion.div
      ref={ref}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-slate-700">Live Market Overview</span>
        </div>
        <div className="flex gap-2">
          {["1D", "1W", "1M", "6M", "1Y"].map((range) => (
            <button
              key={range}
              type="button"
              className={`rounded-lg px-3 py-1 text-xs transition-all ${
                range === "1M"
                  ? "bg-emerald-100 font-medium text-emerald-700"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-2 pt-6">
        <div className="mb-4 flex items-end gap-4">
          <span className="text-3xl font-bold text-slate-900">{money(14.82)}</span>
          <span className="mb-1 flex items-center gap-1 text-sm font-medium text-emerald-600">
            <TrendingUp className="h-3 w-3" /> +3.2%
          </span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#1e293b",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value, name) => [
                  name === "price" ? money(value) : Number(value).toLocaleString(),
                  name === "price" ? "Price" : "Volume",
                ]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#059669"
                strokeWidth={2}
                fill="url(#priceGrad)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-6 pb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-400">
              <th className="py-3 text-left font-medium">Project</th>
              <th className="hidden py-3 text-left font-medium sm:table-cell">
                Registry
              </th>
              <th className="py-3 text-right font-medium">Price</th>
              <th className="py-3 text-right font-medium">Change</th>
              <th className="hidden py-3 text-right font-medium md:table-cell">
                Volume
              </th>
            </tr>
          </thead>
          <tbody>
            {mockAssets.map((asset, index) => (
              <motion.tr
                key={asset.name}
                className="cursor-pointer border-b border-slate-50 transition-colors hover:bg-slate-50 last:border-0"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <td className="py-3">
                  <div className="text-sm font-medium text-slate-800">{asset.name}</div>
                  <div className="text-xs text-slate-400">{asset.type}</div>
                </td>
                <td className="hidden py-3 text-xs text-slate-500 sm:table-cell">
                  {asset.registry}
                </td>
                <td className="py-3 text-right font-mono text-sm font-semibold text-slate-800">
                  {money(asset.price)}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`flex items-center justify-end gap-1 text-xs font-medium ${
                      asset.change >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {asset.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {asset.change >= 0 ? "+" : ""}
                    {asset.change}%
                  </span>
                </td>
                <td className="hidden py-3 text-right font-mono text-xs text-slate-400 md:table-cell">
                  <span className="flex items-center justify-end gap-1">
                    <Activity className="h-3 w-3" /> {asset.volume}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
