import React from "react";
import { cn } from "../lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "./ui/basic-ui";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
  Users,
} from "lucide-react";

// Mock market data
const priceData = [
  { time: "00:00", price: 23.45, volume: 1200 },
  { time: "04:00", price: 23.52, volume: 980 },
  { time: "08:00", price: 23.38, volume: 1650 },
  { time: "12:00", price: 23.67, volume: 2100 },
  { time: "16:00", price: 23.89, volume: 1850 },
  { time: "20:00", price: 23.76, volume: 1350 },
];

const volumeData = [
  { day: "Mon", volume: 15420, value: 362000 },
  { day: "Tue", volume: 18930, value: 447000 },
  { day: "Wed", volume: 22150, value: 523000 },
  { day: "Thu", volume: 19850, value: 468000 },
  { day: "Fri", volume: 25670, value: 605000 },
  { day: "Sat", volume: 12350, value: 291000 },
  { day: "Sun", volume: 14220, value: 335000 },
];

const featuredListings = [
  {
    id: 1,
    title: "Verified Forest Carbon Credits",
    price: 23.45,
    change: +2.3,
    volume: 15420,
    type: "Forest",
    verification: "VCS",
    location: "Brazil",
  },
  {
    id: 2,
    title: "Renewable Energy Credits",
    price: 18.92,
    change: -1.2,
    volume: 8930,
    type: "Renewable",
    verification: "Gold Standard",
    location: "India",
  },
  {
    id: 3,
    title: "Methane Capture Credits",
    price: 31.76,
    change: +5.8,
    volume: 6240,
    type: "Methane",
    verification: "CDM",
    location: "USA",
  },
];

const Overview = () => {
  return (
    <div className="space-y-6">
      {/* Market Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Market Price
                </p>
                <p className="text-2xl font-bold">$23.76</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +1.4% (24h)
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">24h Volume</p>
                <p className="text-2xl font-bold">108.2K</p>
                <p className="text-xs text-blue-600 flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  +8.2% vs yesterday
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Traders
                </p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-purple-600 flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  +12 new today
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Market Cap</p>
                <p className="text-2xl font-bold">$2.4M</p>
                <p className="text-xs text-orange-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  ATH this month
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span>Price Movement (24h)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Price"]}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#059669"
                    fill="url(#priceGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient
                      id="priceGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#059669"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Volume (7d)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [value.toLocaleString(), "Volume"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: "#2563eb" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Listings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Featured Listings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredListings.map((listing) => (
              <div
                key={listing.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {listing.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {listing.location} • {listing.verification}
                    </p>
                  </div>
                  <Badge variant="secondary">{listing.type}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Price</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">${listing.price}</span>
                      <span
                        className={cn(
                          "text-xs flex items-center",
                          listing.change > 0
                            ? "text-green-600"
                            : "text-red-600",
                        )}
                      >
                        {listing.change > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(listing.change)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Volume</span>
                    <span className="text-sm font-medium">
                      {listing.volume.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
