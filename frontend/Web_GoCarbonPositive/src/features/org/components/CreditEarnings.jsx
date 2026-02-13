// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   Button,
//   Badge,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@shared/ui/basic-ui";
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   FiTrendingUp,
//   FiTrendingDown,
//   FiDownload,
//   FiCalendar,
//   FiDollarSign,
//   FiFilter,
//   FiMoreHorizontal,
// } from "react-icons/fi";

// // SVG Icons
// const TrendingUpIcon = () => (
//           <FiTrendingUp size={24} style={{ color: "#10b981" }} />
// );

// const TrendingDownIcon = () => (
//   <FiTrendingDown size={16} style={{ color: "#ef4444" }} />
// );

// const DownloadIcon = () => (
//   <FiDownload size={16} style={{ color: "#3b82f6" }} />
// );

// const CalendarIcon = () => (
//   <FiCalendar size={16} style={{ color: "#6366f1" }} />
// );

// const DollarSignIcon = () => (
//           <FiDollarSign size={32} style={{ color: "#f59e0b" }} />
// );

// const BarChartIcon = () => (
//   <svg
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path d="M12 20V10m6 10V6M6 20v-4" />
//   </svg>
// );

// const PieChartIcon = () => (
//   <svg
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path d="M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z" />
//   </svg>
// );

// const FileTextIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
//     <path d="M14 2v6h6M16 13H8m0 4h5m3-8H8" />
//   </svg>
// );

// const CheckCircleIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
//     <polyline points="22 4 12 14.01 9 11.01" />
//   </svg>
// );

// const ClockIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <circle cx="12" cy="12" r="10" />
//     <polyline points="12 6 12 12 16 14" />
//   </svg>
// );

// const CreditEarnings = () => {
//   const [selectedPeriod, setSelectedPeriod] = useState("6months");

//   // Mock data for charts
//   const monthlyData = [
//     { month: "Jan", credits: 245, revenue: 12250, assets: 8 },
//     { month: "Feb", credits: 289, revenue: 14450, assets: 9 },
//     { month: "Mar", credits: 312, revenue: 15600, assets: 11 },
//     { month: "Apr", credits: 267, revenue: 13350, assets: 12 },
//     { month: "May", credits: 334, revenue: 16700, assets: 14 },
//     { month: "Jun", credits: 398, revenue: 19900, assets: 15 },
//     { month: "Jul", credits: 445, revenue: 22250, assets: 16 },
//     { month: "Aug", credits: 423, revenue: 21150, assets: 16 },
//     { month: "Sep", credits: 467, revenue: 23350, assets: 17 },
//     { month: "Oct", credits: 512, revenue: 25600, assets: 18 },
//     { month: "Nov", credits: 534, revenue: 26700, assets: 19 },
//     { month: "Dec", credits: 589, revenue: 29450, assets: 20 },
//   ];

//   const assetTypeData = [
//     { name: "Solar", value: 892, color: "var(--color-yellow-light)" },
//     { name: "Wind", value: 1534, color: "var(--color-cyan-light)" },
//     { name: "Trees", value: 678, color: "var(--color-green-light)" },
//     { name: "EV", value: 245, color: "var(--color-blue-light)" },
//     { name: "Hydro", value: 423, color: "var(--color-purple-light)" },
//     { name: "Carbon Capture", value: 1247, color: "var(--color-gray-light)" },
//   ];

//   const revenueData = [
//     { quarter: "Q1 2023", revenue: 42300, credits: 846 },
//     { quarter: "Q2 2023", revenue: 49950, credits: 999 },
//     { quarter: "Q3 2023", revenue: 67750, credits: 1355 },
//     { quarter: "Q4 2023", revenue: 81750, credits: 1635 },
//     { quarter: "Q1 2024", revenue: 94200, credits: 1884 },
//   ];

//   // Mock historical logs
//   const earningsHistory = [
//     {
//       id: "LOG-001",
//       date: "2024-01-15",
//       type: "Credit Generation",
//       asset: "Solar Farm #3",
//       credits: 45,
//       status: "Verified",
//       revenue: 2250,
//     },
//     {
//       id: "LOG-002",
//       date: "2024-01-14",
//       type: "Credit Sale",
//       asset: "Wind Farm #2",
//       credits: 123,
//       status: "Completed",
//       revenue: 6150,
//     },
//     {
//       id: "LOG-003",
//       date: "2024-01-13",
//       type: "Verification",
//       asset: "EV Fleet A",
//       credits: 28,
//       status: "Approved",
//       revenue: 1400,
//     },
//     {
//       id: "LOG-004",
//       date: "2024-01-12",
//       type: "Credit Generation",
//       asset: "Forest Project #1",
//       credits: 67,
//       status: "Pending",
//       revenue: 0,
//     },
//     {
//       id: "LOG-005",
//       date: "2024-01-11",
//       type: "Audit",
//       asset: "Hydro Plant #1",
//       credits: 89,
//       status: "Completed",
//       revenue: 4450,
//     },
//   ];

//   const exportData = (format, type) => {
//     console.log(`Exporting ${type} data in ${format} format`);
//   };

//   const totalCredits = assetTypeData.reduce((sum, item) => sum + item.value, 0);
//   const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
//   const averagePrice = totalRevenue / totalCredits;

//   return (
//     <motion.div
//       className="space-y-6"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Page Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-bold">Credit Earnings & Analytics</h1>
//           <p className="text-secondary mt-1">
//             Track revenue, monitor performance, and analyze credit generation
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <select
//             value={selectedPeriod}
//             onChange={(e) => setSelectedPeriod(e.target.value)}
//             className="select"
//           >
//             <option value="3months">Last 3 Months</option>
//             <option value="6months">Last 6 Months</option>
//             <option value="1year">Last Year</option>
//             <option value="2years">Last 2 Years</option>
//           </select>
//           <DropdownMenu>
//             <DropdownMenuTrigger>
//               <Button variant="outline">
//                 <DownloadIcon />
//                 <span className="ml-2">Export Reports</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuItem onClick={() => exportData("csv", "earnings")}>
//                 Export as CSV
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => exportData("pdf", "earnings")}>
//                 Export as PDF
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => exportData("xlsx", "earnings")}>
//                 Export as Excel
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid-4 md-grid-4">
//         <Card>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-secondary">Total Revenue</p>
//                 <p className="text-2xl font-bold text-green">
//                   ${totalRevenue.toLocaleString()}
//                 </p>
//                 <div className="flex items-center space-x-1 mt-1">
//                   <TrendingUpIcon className="text-green" />
//                   <span className="text-xs text-green">+18.2%</span>
//                 </div>
//               </div>
//               <DollarSignIcon className="text-green" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-secondary">Total Credits</p>
//                 <p className="text-2xl font-bold text-blue">
//                   {totalCredits.toLocaleString()}
//                 </p>
//                 <div className="flex items-center space-x-1 mt-1">
//                   <TrendingUpIcon className="text-green" />
//                   <span className="text-xs text-green">+12.5%</span>
//                 </div>
//               </div>
//               <BarChartIcon className="text-blue" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-secondary">Average Price</p>
//                 <p className="text-2xl font-bold text-purple">
//                   ${averagePrice.toFixed(2)}
//                 </p>
//                 <div className="flex items-center space-x-1 mt-1">
//                   <TrendingDownIcon className="text-red" />
//                   <span className="text-xs text-red">-2.1%</span>
//                 </div>
//               </div>
//               <PieChartIcon className="text-purple" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-secondary">Verified Credits</p>
//                 <p className="text-2xl font-bold text-orange">
//                   {Math.round(totalCredits * 0.87).toLocaleString()}
//                 </p>
//                 <div className="flex items-center space-x-1 mt-1">
//                   <span className="text-xs text-secondary">87% verified</span>
//                 </div>
//               </div>
//               <CheckCircleIcon className="text-orange" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Section */}
//       <div className="grid-2 lg-grid-2">
//         {/* Monthly Trends */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Credit Generation Trends</CardTitle>
//             <CardDescription>
//               Monthly credit generation over time
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <motion.div
//               className="chart-container h-80"
//               style={{ minHeight: 320, height: "20rem" }}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={monthlyData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="credits"
//                     stroke="var(--color-blue-light)"
//                     fill="var(--color-blue-light)"
//                     fillOpacity={0.2}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </motion.div>
//           </CardContent>
//         </Card>

//         {/* Asset Type Distribution */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Credits by Asset Type</CardTitle>
//             <CardDescription>
//               Distribution of credits across asset types
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <motion.div
//               className="chart-container h-80"
//               style={{ minHeight: 320, height: "20rem" }}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.1 }}
//             >
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={assetTypeData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={80}
//                     dataKey="value"
//                     label={({ name, percent }) =>
//                       `${name} ${(percent * 100).toFixed(0)}%`
//                     }
//                   >
//                     {assetTypeData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </motion.div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Revenue Analytics */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Revenue Analytics</CardTitle>
//           <CardDescription>
//             Quarterly revenue and credit performance
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <motion.div
//             className="chart-container h-80"
//             style={{ minHeight: 320, height: "20rem" }}
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={revenueData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="quarter" />
//                 <YAxis yAxisId="left" />
//                 <YAxis yAxisId="right" orientation="right" />
//                 <Tooltip />
//                 <Legend />
//                 <Bar
//                   yAxisId="left"
//                   dataKey="revenue"
//                   fill="var(--color-green-light)"
//                   name="Revenue ($)"
//                 />
//                 <Bar
//                   yAxisId="right"
//                   dataKey="credits"
//                   fill="var(--color-blue-light)"
//                   name="Credits"
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </motion.div>
//         </CardContent>
//       </Card>

//       {/* ML Forecasting */}
//       <Card>
//         <CardHeader>
//           <CardTitle>AI-Powered Forecasting</CardTitle>
//           <CardDescription>
//             Machine learning predictions for next quarter credits
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid-3 md-grid-3">
//             <motion.div
//               className="text-center p-6 bg-blue-50 rounded-lg"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="text-3xl font-bold text-blue">647</div>
//               <div className="text-sm text-blue mt-1">Predicted Credits</div>
//               <div className="text-xs text-secondary mt-2">Confidence: 85%</div>
//             </motion.div>
//             <motion.div
//               className="text-center p-6 bg-green-50 rounded-lg"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: 0.1 }}
//             >
//               <div className="text-3xl font-bold text-green">$32,350</div>
//               <div className="text-sm text-green mt-1">Estimated Revenue</div>
//               <div className="text-xs text-secondary mt-2">Confidence: 78%</div>
//             </motion.div>
//             <motion.div
//               className="text-center p-6 bg-purple-50 rounded-lg"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: 0.2 }}
//             >
//               <div className="text-3xl font-bold text-purple">15%</div>
//               <div className="text-sm text-purple mt-1">Growth Rate</div>
//               <div className="text-xs text-secondary mt-2">
//                 vs. Current Quarter
//               </div>
//             </motion.div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Historical Logs */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Earnings History</CardTitle>
//               <CardDescription>
//                 Recent credit generations, sales, and verifications
//               </CardDescription>
//             </div>
//             <Button variant="outline" size="sm">
//               <FileTextIcon />
//               <span className="ml-2">View All</span>
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Type</TableHead>
//                 <TableHead>Asset</TableHead>
//                 <TableHead>Credits</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Revenue</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {earningsHistory.map((log) => (
//                 <motion.tr
//                   key={log.id}
//                   className="table-row"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <TableCell>
//                     <div className="flex items-center space-x-2">
//                       <CalendarIcon className="text-secondary" />
//                       <span>{log.date}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant="outline">{log.type}</Badge>
//                   </TableCell>
//                   <TableCell className="font-semibold">{log.asset}</TableCell>
//                   <TableCell className="font-semibold">{log.credits}</TableCell>
//                   <TableCell>
//                     <Badge
//                       className={
//                         log.status === "Verified" ||
//                         log.status === "Completed" ||
//                         log.status === "Approved"
//                           ? "badge-green"
//                           : log.status === "Pending"
//                             ? "badge-yellow"
//                             : "badge-secondary"
//                       }
//                     >
//                       {log.status === "Verified" && (
//                         <CheckCircleIcon className="mr-1" />
//                       )}
//                       {log.status === "Pending" && (
//                         <ClockIcon className="mr-1" />
//                       )}
//                       {log.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="font-semibold text-green">
//                     {log.revenue > 0 ? `$${log.revenue.toLocaleString()}` : "-"}
//                   </TableCell>
//                 </motion.tr>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default CreditEarnings;




'use client';

import React, { useState, useEffect } from 'react';
import {
  FaDollarSign,
  FaCoins,
  FaChartLine,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaCalendar,
  FaLeaf,
  FaWind,
  FaSun,
  FaBolt,
  FaRobot,
  FaHistory,
  FaCheck,
  FaTint, // Added import for FaTrendingDown
} from 'react-icons/fa';

import "@features/org/styles/CreditEarnings.css";

const CreditEarnings = () => {
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState([]);
  const [animateStats, setAnimateStats] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setAnimateStats(true);
    // Generate mock chart data
    generateChartData();
  }, []);

  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map((month, idx) => ({
      month,
      value: Math.floor(Math.random() * 300 + 200),
      trend: Math.random() > 0.5 ? 'up' : 'down',
    }));
    setChartData(data);
  };

  const statCards = [
    {
      id: 1,
      title: 'Total Revenue',
      value: '$335,950',
      trend: '+18.2%',
      icon: FaDollarSign,
      color: '#10B981',
      isTrendUp: true,
    },
    {
      id: 2,
      title: 'Total Credits',
      value: '5,019',
      trend: '+12.5%',
      icon: FaCoins,
      color: '#3B82F6',
      isTrendUp: true,
    },
    {
      id: 3,
      title: 'Average Price',
      value: '$66.94',
      trend: '-2.1%',
      icon: FaChartLine,
      color: '#A855F7',
      isTrendUp: false,
    },
    {
      id: 4,
      title: 'Verified Credits',
      value: '4,367',
      trend: '87% verified',
      icon: FaCheckCircle,
      color: '#F97316',
      isTrendUp: true,
    },
  ];

  const assetTypes = [
    { name: 'Wind', percentage: 31, color: '#06B6D4', icon: FaWind },
    { name: 'Solar', percentage: 18, color: '#FBBF24', icon: FaSun },
    { name: 'Trees', percentage: 14, color: '#10B981', icon: FaLeaf },
    { name: 'EV', percentage: 5, color: '#EC4899', icon: FaBolt },
    { name: 'Hydro', percentage: 8, color: '#8B5CF6', icon: FaTint },
    { name: 'Carbon Capture', percentage: 25, color: '#9CA3AF', icon: FaLeaf },
  ];

  const forecastingData = [
    {
      label: 'Predicted Credits',
      value: '647',
      confidence: '85%',
      icon: FaCoins,
      color: '#3B82F6',
    },
    {
      label: 'Estimated Revenue',
      value: '$32,350',
      confidence: '78%',
      icon: FaDollarSign,
      color: '#10B981',
    },
    {
      label: 'Growth Rate',
      value: '15%',
      confidence: 'vs. Current Quarter',
      icon: FaArrowUp,
      color: '#A855F7',
    },
  ];

  const earningsHistory = [
    {
      date: '2024-01-15',
      type: 'CREDIT GENERATION',
      asset: 'Solar Farm #3',
      credits: 45,
      status: 'VERIFIED',
      revenue: '$2,250',
      statusColor: '#10B981',
    },
    {
      date: '2024-01-14',
      type: 'CREDIT SALE',
      asset: 'Wind Farm #2',
      credits: 123,
      status: 'COMPLETED',
      revenue: '$6,150',
      statusColor: '#3B82F6',
    },
    {
      date: '2024-01-13',
      type: 'VERIFICATION',
      asset: 'EV Fleet A',
      credits: 28,
      status: 'APPROVED',
      revenue: '$1,400',
      statusColor: '#A855F7',
    },
    {
      date: '2024-01-12',
      type: 'CREDIT GENERATION',
      asset: 'Hydro Plant',
      credits: 67,
      status: 'VERIFIED',
      revenue: '$3,350',
      statusColor: '#10B981',
    },
    {
      date: '2024-01-11',
      type: 'CREDIT SALE',
      asset: 'Solar Farm #1',
      credits: 89,
      status: 'COMPLETED',
      revenue: '$4,450',
      statusColor: '#3B82F6',
    },
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart data={chartData} />;
      case 'pie':
        return <PieChart data={assetTypes} />;
      case 'trend':
        return <TrendChart data={chartData} />;
      default:
        return <BarChart data={chartData} />;
    }
  };

  return (
    <div className="org-earnings-container">
      {/* Header Section */}
      <div className="org-earnings-header">
        <div className="org-earnings-header-content">
          <h1 className="org-earnings-title">Credit Earnings & Analytics</h1>
          <p className="org-earnings-subtitle">
            Track revenue, monitor performance, and analyze credit generation
          </p>
        </div>
        <div className="org-earnings-header-actions">
          <select className="org-earnings-time-filter">
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
            <option>All Time</option>
          </select>
          <button className="org-earnings-export-btn">
            <FaDownload size={16} />
            Export Reports
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`org-earnings-stats-grid ${animateStats ? 'animate' : ''}`}>
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className="org-earnings-stat-card"
              style={{ animationDelay: `${index * 0.05}s` }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="org-earnings-stat-header">
                <div
                  className="org-earnings-stat-icon"
                  style={{
                    backgroundColor: `${card.color}15`,
                    color: card.color,
                  }}
                >
                  <IconComponent size={20} />
                </div>
                <span
                  className={`org-earnings-stat-trend ${card.isTrendUp ? 'up' : 'down'
                    }`}
                >
                  {card.isTrendUp ? (
                    <FaArrowUp size={14} />
                  ) : (
                    <FaArrowDown size={14} />
                  )}
                  {card.trend}
                </span>
              </div>
              <div className="org-earnings-stat-content">
                <h3 className="org-earnings-stat-value">{card.value}</h3>
                <p className="org-earnings-stat-label">{card.title}</p>
              </div>
              <div
                className="org-earnings-stat-bar"
                style={{
                  backgroundColor: card.color,
                  width: hoveredCard === card.id ? '100%' : '40%',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="org-earnings-charts-section">
        <div className="org-earnings-charts-header">
          <h2 className="org-earnings-section-title">Credit Analysis & Trends</h2>
          <div className="org-earnings-chart-toggle">
            <button
              className={`org-earnings-toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
            >
              Bar Chart
            </button>
            <button
              className={`org-earnings-toggle-btn ${chartType === 'pie' ? 'active' : ''}`}
              onClick={() => setChartType('pie')}
            >
              Pie Chart
            </button>
            <button
              className={`org-earnings-toggle-btn ${chartType === 'trend' ? 'active' : ''}`}
              onClick={() => setChartType('trend')}
            >
              Trends
            </button>
          </div>
        </div>

        <div className="org-earnings-charts-container">
          <div className="org-earnings-chart-wrapper">
            <h3 className="org-earnings-chart-title">
              {chartType === 'bar'
                ? 'Monthly Credit Generation'
                : chartType === 'pie'
                  ? 'Credits by Asset Type'
                  : 'Generation Trends'}
            </h3>
            <p className="org-earnings-chart-subtitle">
              {chartType === 'bar'
                ? 'Monthly credit generation over time'
                : chartType === 'pie'
                  ? 'Distribution of credits across asset types'
                  : 'Trend analysis and growth patterns'}
            </p>
            {renderChart()}
          </div>

          {/* Revenue Analytics */}
          <div className="org-earnings-revenue-chart">
            <h3 className="org-earnings-chart-title">Revenue Analytics</h3>
            <p className="org-earnings-chart-subtitle">
              Quarterly revenue and credit performance
            </p>
            <QuarterlyBarChart />
          </div>
        </div>
      </div>

      {/* AI Forecasting Section */}
      <div className="org-earnings-forecasting-section">
        <div className="org-earnings-forecasting-header">
          <div>
            <h2 className="org-earnings-section-title">
              <FaRobot /> AI-Powered Forecasting
            </h2>
            <p className="org-earnings-section-subtitle">
              Machine learning predictions for next quarter credits
            </p>
          </div>
        </div>

        <div className="org-earnings-forecast-grid">
          {forecastingData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="org-earnings-forecast-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="org-earnings-forecast-icon" style={{ color: item.color }}>
                  <IconComponent size={24} />
                </div>
                <div className="org-earnings-forecast-content">
                  <h4 className="org-earnings-forecast-value">{item.value}</h4>
                  <p className="org-earnings-forecast-label">{item.label}</p>
                  <span className="org-earnings-forecast-confidence">
                    Confidence: {item.confidence}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Earnings History */}
      <div className="org-earnings-history-section">
        <div className="org-earnings-history-header">
          <div>
            <h2 className="org-earnings-section-title">
              <FaHistory /> Earnings History
            </h2>
            <p className="org-earnings-section-subtitle">
              Recent credit generations, sales, and verifications
            </p>
          </div>
          <button className="org-earnings-view-all-btn">
            <FaCalendar size={14} />
            View All
          </button>
        </div>

        <div className="org-earnings-table-wrapper">
          <table className="org-earnings-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Asset</th>
                <th>Credits</th>
                <th>Status</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {earningsHistory.map((item, index) => (
                <tr
                  key={index}
                  className="org-earnings-table-row"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td>
                    <span className="org-earnings-table-date">
                      <FaCalendar size={14} />
                      {item.date}
                    </span>
                  </td>
                  <td>
                    <span className="org-earnings-table-type">{item.type}</span>
                  </td>
                  <td>
                    <strong>{item.asset}</strong>
                  </td>
                  <td>{item.credits}</td>
                  <td>
                    <span
                      className="org-earnings-table-status"
                      style={{ borderColor: item.statusColor }}
                    >
                      <FaCheck size={12} style={{ color: item.statusColor }} />
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <span className="org-earnings-table-revenue">{item.revenue}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Bar Chart Component
const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="org-earnings-bar-chart">
      <div className="org-earnings-chart-y-axis">
        {[0, 100, 200, 300].map((val) => (
          <span key={val}>{val}</span>
        ))}
      </div>
      <div className="org-earnings-chart-bars">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="org-earnings-bar-wrapper"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="org-earnings-bar-item">
              <div
                className="org-earnings-bar"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.trend === 'up' ? '#10B981' : '#3B82F6',
                }}
              />
            </div>
            <span className="org-earnings-bar-label">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pie Chart Component
const PieChart = ({ data }) => {
  let currentAngle = -90;
  const radius = 80;

  const slices = data.map((item, idx) => {
    const sliceAngle = (item.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 100 + radius * Math.cos(startRad);
    const y1 = 100 + radius * Math.sin(startRad);
    const x2 = 100 + radius * Math.cos(endRad);
    const y2 = 100 + radius * Math.sin(endRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M 100 100`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    return {
      path: pathData,
      color: item.color,
      label: item.name,
      percentage: item.percentage,
      icon: item.icon,
    };
  });

  return (
    <div className="org-earnings-pie-chart">
      <svg viewBox="0 0 200 200" className="org-earnings-pie-svg">
        {slices.map((slice, idx) => (
          <path
            key={idx}
            d={slice.path}
            fill={slice.color}
            className="org-earnings-pie-slice"
            style={{ animationDelay: `${idx * 0.1}s` }}
          />
        ))}
      </svg>
      <div className="org-earnings-pie-legend">
        {data.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="org-earnings-legend-item"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div
                className="org-earnings-legend-color"
                style={{ backgroundColor: item.color }}
              />
              <span className="org-earnings-legend-label">
                {item.name} {item.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Trend Chart Component
const TrendChart = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const points = data
    .map((item, idx) => {
      const x = (idx / (data.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 80;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="org-earnings-trend-chart">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="org-earnings-trend-svg">
        {/* Grid lines */}
        {[20, 40, 60, 80].map((y) => (
          <line
            key={`grid-${y}`}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="#E5E7EB"
            strokeDasharray="2,2"
          />
        ))}
        {/* Fill area */}
        <polyline
          points={`0,100 ${points} 100,100`}
          fill="url(#trendGradient)"
          className="org-earnings-trend-fill"
        />
        {/* Line */}
        <polyline points={points} fill="none" stroke="#3B82F6" strokeWidth="0.5" />
      </svg>
      <defs>
        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <div className="org-earnings-trend-labels">
        {data.map((item, idx) => (
          <span key={idx} style={{ left: `${(idx / (data.length - 1)) * 100}%` }}>
            {item.month}
          </span>
        ))}
      </div>
    </div>
  );
};

// Quarterly Bar Chart Component
const QuarterlyBarChart = () => {
  const quarters = [
    { label: 'Q1 2023', revenue: 42000, credits: 900 },
    { label: 'Q2 2023', revenue: 50000, credits: 1100 },
    { label: 'Q3 2023', revenue: 68000, credits: 1400 },
    { label: 'Q4 2023', revenue: 85000, credits: 1600 },
    { label: 'Q1 2024', revenue: 95000, credits: 1800 },
  ];

  const maxRevenue = 100000;
  const maxCredits = 2000;

  return (
    <div className="org-earnings-quarterly-chart">
      <div className="org-earnings-chart-y-axis">
        <span>0</span>
        <span>25000</span>
        <span>50000</span>
        <span>75000</span>
        <span>100000</span>
      </div>
      <div className="org-earnings-quarterly-bars">
        {quarters.map((q, idx) => (
          <div
            key={idx}
            className="org-earnings-quarter-group"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="org-earnings-bar-pair">
              <div
                className="org-earnings-quarterly-bar revenue"
                style={{ height: `${(q.revenue / maxRevenue) * 100}%` }}
              />
              <div
                className="org-earnings-quarterly-bar credits"
                style={{ height: `${(q.credits / maxCredits) * 100}%` }}
              />
            </div>
            <span className="org-earnings-quarter-label">{q.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditEarnings;
