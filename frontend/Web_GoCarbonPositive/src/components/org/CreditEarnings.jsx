import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./basic-ui";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDownload,
  FiCalendar,
  FiDollarSign,
  FiFilter,
  FiMoreHorizontal,
} from "react-icons/fi";

// SVG Icons
const TrendingUpIcon = () => (
          <FiTrendingUp size={24} style={{ color: "#10b981" }} />
);

const TrendingDownIcon = () => (
  <FiTrendingDown size={16} style={{ color: "#ef4444" }} />
);

const DownloadIcon = () => (
  <FiDownload size={16} style={{ color: "#3b82f6" }} />
);

const CalendarIcon = () => (
  <FiCalendar size={16} style={{ color: "#6366f1" }} />
);

const DollarSignIcon = () => (
          <FiDollarSign size={32} style={{ color: "#f59e0b" }} />
);

const BarChartIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 20V10m6 10V6M6 20v-4" />
  </svg>
);

const PieChartIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z" />
  </svg>
);

const FileTextIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
    <path d="M14 2v6h6M16 13H8m0 4h5m3-8H8" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CreditEarnings = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  // Mock data for charts
  const monthlyData = [
    { month: "Jan", credits: 245, revenue: 12250, assets: 8 },
    { month: "Feb", credits: 289, revenue: 14450, assets: 9 },
    { month: "Mar", credits: 312, revenue: 15600, assets: 11 },
    { month: "Apr", credits: 267, revenue: 13350, assets: 12 },
    { month: "May", credits: 334, revenue: 16700, assets: 14 },
    { month: "Jun", credits: 398, revenue: 19900, assets: 15 },
    { month: "Jul", credits: 445, revenue: 22250, assets: 16 },
    { month: "Aug", credits: 423, revenue: 21150, assets: 16 },
    { month: "Sep", credits: 467, revenue: 23350, assets: 17 },
    { month: "Oct", credits: 512, revenue: 25600, assets: 18 },
    { month: "Nov", credits: 534, revenue: 26700, assets: 19 },
    { month: "Dec", credits: 589, revenue: 29450, assets: 20 },
  ];

  const assetTypeData = [
    { name: "Solar", value: 892, color: "var(--color-yellow-light)" },
    { name: "Wind", value: 1534, color: "var(--color-cyan-light)" },
    { name: "Trees", value: 678, color: "var(--color-green-light)" },
    { name: "EV", value: 245, color: "var(--color-blue-light)" },
    { name: "Hydro", value: 423, color: "var(--color-purple-light)" },
    { name: "Carbon Capture", value: 1247, color: "var(--color-gray-light)" },
  ];

  const revenueData = [
    { quarter: "Q1 2023", revenue: 42300, credits: 846 },
    { quarter: "Q2 2023", revenue: 49950, credits: 999 },
    { quarter: "Q3 2023", revenue: 67750, credits: 1355 },
    { quarter: "Q4 2023", revenue: 81750, credits: 1635 },
    { quarter: "Q1 2024", revenue: 94200, credits: 1884 },
  ];

  // Mock historical logs
  const earningsHistory = [
    {
      id: "LOG-001",
      date: "2024-01-15",
      type: "Credit Generation",
      asset: "Solar Farm #3",
      credits: 45,
      status: "Verified",
      revenue: 2250,
    },
    {
      id: "LOG-002",
      date: "2024-01-14",
      type: "Credit Sale",
      asset: "Wind Farm #2",
      credits: 123,
      status: "Completed",
      revenue: 6150,
    },
    {
      id: "LOG-003",
      date: "2024-01-13",
      type: "Verification",
      asset: "EV Fleet A",
      credits: 28,
      status: "Approved",
      revenue: 1400,
    },
    {
      id: "LOG-004",
      date: "2024-01-12",
      type: "Credit Generation",
      asset: "Forest Project #1",
      credits: 67,
      status: "Pending",
      revenue: 0,
    },
    {
      id: "LOG-005",
      date: "2024-01-11",
      type: "Audit",
      asset: "Hydro Plant #1",
      credits: 89,
      status: "Completed",
      revenue: 4450,
    },
  ];

  const exportData = (format, type) => {
    console.log(`Exporting ${type} data in ${format} format`);
  };

  const totalCredits = assetTypeData.reduce((sum, item) => sum + item.value, 0);
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const averagePrice = totalRevenue / totalCredits;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Credit Earnings & Analytics</h1>
          <p className="text-secondary mt-1">
            Track revenue, monitor performance, and analyze credit generation
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="select"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="2years">Last 2 Years</option>
          </select>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                <DownloadIcon />
                <span className="ml-2">Export Reports</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportData("csv", "earnings")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData("pdf", "earnings")}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData("xlsx", "earnings")}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-4 md-grid-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Total Revenue</p>
                <p className="text-2xl font-bold text-green">
                  ${totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUpIcon className="text-green" />
                  <span className="text-xs text-green">+18.2%</span>
                </div>
              </div>
              <DollarSignIcon className="text-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Total Credits</p>
                <p className="text-2xl font-bold text-blue">
                  {totalCredits.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUpIcon className="text-green" />
                  <span className="text-xs text-green">+12.5%</span>
                </div>
              </div>
              <BarChartIcon className="text-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Average Price</p>
                <p className="text-2xl font-bold text-purple">
                  ${averagePrice.toFixed(2)}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingDownIcon className="text-red" />
                  <span className="text-xs text-red">-2.1%</span>
                </div>
              </div>
              <PieChartIcon className="text-purple" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Verified Credits</p>
                <p className="text-2xl font-bold text-orange">
                  {Math.round(totalCredits * 0.87).toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-xs text-secondary">87% verified</span>
                </div>
              </div>
              <CheckCircleIcon className="text-orange" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid-2 lg-grid-2">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Generation Trends</CardTitle>
            <CardDescription>
              Monthly credit generation over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              className="chart-container h-80"
              style={{ minHeight: 320, height: "20rem" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="credits"
                    stroke="var(--color-blue-light)"
                    fill="var(--color-blue-light)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </CardContent>
        </Card>

        {/* Asset Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Credits by Asset Type</CardTitle>
            <CardDescription>
              Distribution of credits across asset types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              className="chart-container h-80"
              style={{ minHeight: 320, height: "20rem" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {assetTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>
            Quarterly revenue and credit performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            className="chart-container h-80"
            style={{ minHeight: 320, height: "20rem" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="var(--color-green-light)"
                  name="Revenue ($)"
                />
                <Bar
                  yAxisId="right"
                  dataKey="credits"
                  fill="var(--color-blue-light)"
                  name="Credits"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>

      {/* ML Forecasting */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Forecasting</CardTitle>
          <CardDescription>
            Machine learning predictions for next quarter credits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid-3 md-grid-3">
            <motion.div
              className="text-center p-6 bg-blue-50 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-3xl font-bold text-blue">647</div>
              <div className="text-sm text-blue mt-1">Predicted Credits</div>
              <div className="text-xs text-secondary mt-2">Confidence: 85%</div>
            </motion.div>
            <motion.div
              className="text-center p-6 bg-green-50 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="text-3xl font-bold text-green">$32,350</div>
              <div className="text-sm text-green mt-1">Estimated Revenue</div>
              <div className="text-xs text-secondary mt-2">Confidence: 78%</div>
            </motion.div>
            <motion.div
              className="text-center p-6 bg-purple-50 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="text-3xl font-bold text-purple">15%</div>
              <div className="text-sm text-purple mt-1">Growth Rate</div>
              <div className="text-xs text-secondary mt-2">
                vs. Current Quarter
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Earnings History</CardTitle>
              <CardDescription>
                Recent credit generations, sales, and verifications
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <FileTextIcon />
              <span className="ml-2">View All</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earningsHistory.map((log) => (
                <motion.tr
                  key={log.id}
                  className="table-row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="text-secondary" />
                      <span>{log.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.type}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{log.asset}</TableCell>
                  <TableCell className="font-semibold">{log.credits}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        log.status === "Verified" ||
                        log.status === "Completed" ||
                        log.status === "Approved"
                          ? "badge-green"
                          : log.status === "Pending"
                            ? "badge-yellow"
                            : "badge-secondary"
                      }
                    >
                      {log.status === "Verified" && (
                        <CheckCircleIcon className="mr-1" />
                      )}
                      {log.status === "Pending" && (
                        <ClockIcon className="mr-1" />
                      )}
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green">
                    {log.revenue > 0 ? `$${log.revenue.toLocaleString()}` : "-"}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreditEarnings;
