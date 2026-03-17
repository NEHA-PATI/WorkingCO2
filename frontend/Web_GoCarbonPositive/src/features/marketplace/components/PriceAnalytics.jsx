import React, { useState } from "react";
import { cn } from "../lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/basic-ui";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  DollarSign,
  Activity,
  AlertTriangle,
  Target,
  Zap,
} from "lucide-react";
import useCurrency from "../hooks/useCurrency";
import { formatPriceFromUSD } from "../lib/currencyUtils";

const PriceAnalytics = () => {
  const { currency, fxRate } = useCurrency();
  const [timeframe, setTimeframe] = useState("7d");
  const [chartType, setChartType] = useState("price");
  const money = (value, options = {}) =>
    formatPriceFromUSD(value, currency, fxRate, options);

  // Mock data for different timeframes
  const priceData = {
    "1d": [
      { time: "00:00", price: 23.45, volume: 1200, prediction: 23.8 },
      { time: "04:00", price: 23.52, volume: 980, prediction: 23.9 },
      { time: "08:00", price: 23.38, volume: 1650, prediction: 24.1 },
      { time: "12:00", price: 23.67, volume: 2100, prediction: 24.2 },
      { time: "16:00", price: 23.89, volume: 1850, prediction: 24.3 },
      { time: "20:00", price: 23.76, volume: 1350, prediction: 24.1 },
    ],
    "7d": [
      { time: "Mon", price: 22.15, volume: 15420, prediction: 23.2 },
      { time: "Tue", price: 23.42, volume: 18930, prediction: 23.8 },
      { time: "Wed", price: 23.18, volume: 22150, prediction: 24.1 },
      { time: "Thu", price: 23.89, volume: 19850, prediction: 24.5 },
      { time: "Fri", price: 23.76, volume: 25670, prediction: 24.8 },
      { time: "Sat", price: 24.12, volume: 12350, prediction: 25.1 },
      { time: "Sun", price: 23.95, volume: 14220, prediction: 25.3 },
    ],
    "30d": [
      { time: "Week 1", price: 21.8, volume: 89420, prediction: 22.5 },
      { time: "Week 2", price: 22.4, volume: 95630, prediction: 23.2 },
      { time: "Week 3", price: 23.1, volume: 112340, prediction: 24.1 },
      { time: "Week 4", price: 23.95, volume: 108750, prediction: 25.3 },
    ],
    "90d": [
      { time: "Month 1", price: 20.5, volume: 342000, prediction: 21.8 },
      { time: "Month 2", price: 22.1, volume: 389000, prediction: 23.5 },
      { time: "Month 3", price: 23.95, volume: 425000, prediction: 25.3 },
    ],
  };

  const volumeBySource = [
    { name: "Solar", value: 35, volume: 142000, color: "#FFB020" },
    { name: "Wind", value: 28, volume: 113000, color: "#3B82F6" },
    { name: "Forest", value: 20, volume: 81000, color: "#10B981" },
    { name: "EV", value: 12, volume: 48000, color: "#8B5CF6" },
    { name: "Industrial", value: 5, volume: 20000, color: "#F97316" },
  ];

  const marketDepth = [
    { price: 22.5, buyVolume: 1500, sellVolume: 0 },
    { price: 23.0, buyVolume: 2300, sellVolume: 0 },
    { price: 23.5, buyVolume: 1800, sellVolume: 0 },
    { price: 24.0, buyVolume: 2100, sellVolume: 900 },
    { price: 24.5, buyVolume: 0, sellVolume: 1200 },
    { price: 25.0, buyVolume: 0, sellVolume: 1800 },
    { price: 25.5, buyVolume: 0, sellVolume: 2200 },
  ];

  const volatilityData = [
    { period: "1h", volatility: 2.3, trend: "up" },
    { period: "6h", volatility: 4.7, trend: "up" },
    { period: "24h", volatility: 8.2, trend: "down" },
    { period: "7d", volatility: 12.5, trend: "up" },
    { period: "30d", volatility: 18.9, trend: "up" },
  ];

  const currentData = priceData[timeframe] || priceData["7d"];

  const aiPredictions = [
    {
      timeframe: "1 hour",
      prediction: "+1.2%",
      confidence: 78,
      direction: "up",
      factors: ["Increased demand", "Low supply"],
    },
    {
      timeframe: "24 hours",
      prediction: "+3.5%",
      confidence: 65,
      direction: "up",
      factors: ["Market sentiment", "Technical indicators"],
    },
    {
      timeframe: "7 days",
      prediction: "+8.2%",
      confidence: 52,
      direction: "up",
      factors: ["Seasonal trends", "Policy announcements"],
    },
  ];

  const PriceChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={currentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="price" orientation="left" />
          <YAxis yAxisId="volume" orientation="right" />
          <Tooltip
            formatter={(value, name) => [
              name === "price" || name === "prediction"
                ? money(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : value.toLocaleString(),
              name === "price" ? "Price" : name === "prediction" ? "Prediction" : "Volume",
            ]}
          />
          <Area
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke="#059669"
            fill="url(#priceGradient)"
            strokeWidth={2}
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="prediction"
            stroke="#3B82F6"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
          <Bar
            yAxisId="volume"
            dataKey="volume"
            fill="#E5E7EB"
            opacity={0.3}
            radius={[2, 2, 0, 0]}
          />
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );

  const VolumeChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={currentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip formatter={(value) => [value.toLocaleString(), "Volume"]} />
          <Bar
            dataKey="volume"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const MarketDepthChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={marketDepth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [
              value.toLocaleString(),
              name === "buyVolume" ? "Buy Orders" : "Sell Orders",
            ]}
          />
          <Area
            type="stepAfter"
            dataKey="buyVolume"
            stackId="1"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
          />
          <Area
            type="stepAfter"
            dataKey="sellVolume"
            stackId="2"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const renderChart = () => {
    switch (chartType) {
      case "price":
        return <PriceChart />;
      case "volume":
        return <VolumeChart />;
      case "depth":
        return <MarketDepthChart />;
      default:
        return <PriceChart />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Price</p>
                <p className="text-xl font-bold">
                  {money(23.76, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +1.4%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">24h High</p>
                <p className="text-xl font-bold">
                  {money(24.12, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">
                  vs {money(22.89, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} low
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volume (24h)</p>
                <p className="text-xl font-bold">108.2K</p>
                <p className="text-xs text-blue-600">+8.2%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volatility</p>
                <p className="text-xl font-bold">8.2%</p>
                <p className="text-xs text-orange-600">24h</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span>Price Analytics</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="depth">Market Depth</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1D</SelectItem>
                  <SelectItem value="7d">7D</SelectItem>
                  <SelectItem value="30d">30D</SelectItem>
                  <SelectItem value="90d">90D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>{renderChart()}</CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume by Source */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-green-600" />
              <span>Volume by Source</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={volumeBySource}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {volumeBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value}%`,
                      props.payload.name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {volumeBySource.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span>AI Price Predictions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiPredictions.map((prediction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{prediction.timeframe}</span>
                    <Badge
                      variant={
                        prediction.direction === "up" ? "default" : "secondary"
                      }
                      className={cn(
                        prediction.direction === "up"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700",
                      )}
                    >
                      {prediction.prediction}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {prediction.factors.join(", ")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {prediction.confidence}% confidence
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={cn(
                        "h-2 rounded-full",
                        prediction.confidence > 70
                          ? "bg-green-500"
                          : prediction.confidence > 50
                            ? "bg-yellow-500"
                            : "bg-red-500",
                      )}
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">AI Prediction Disclaimer</p>
                <p className="mt-1">
                  Predictions are based on historical data and market
                  indicators. Past performance does not guarantee future
                  results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Volatility Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-green-600" />
            <span>Volatility Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {volatilityData.map((item, index) => (
              <div
                key={index}
                className="text-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="text-sm text-gray-600">{item.period}</div>
                <div className="text-lg font-bold mt-1">{item.volatility}%</div>
                <div className="flex items-center justify-center mt-2">
                  {item.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceAnalytics;
