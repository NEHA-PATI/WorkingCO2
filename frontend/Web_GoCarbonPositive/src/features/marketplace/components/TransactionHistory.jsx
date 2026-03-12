import React, { useState } from "react";
import { cn } from "../lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/basic-ui";
import {
  History,
  Download,
  Filter,
  Search,
  Calendar,
  Hash,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Copy,
  ExternalLink,
  FileText,
  BarChart3,
} from "lucide-react";

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Mock transaction data
  const transactions = [
    {
      id: "TX-2024-001",
      type: "buy",
      asset: "Brazilian Forest Credits",
      quantity: 100,
      price: 23.45,
      total: 2345.0,
      fee: 23.45,
      status: "completed",
      date: "2024-01-20",
      time: "14:30:22",
      counterparty: "Amazon Conservation Fund",
      hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      verification: "VCS",
      notes: "Premium forest conservation credits with biodiversity benefits",
    },
    {
      id: "TX-2024-002",
      type: "sell",
      asset: "Solar Energy Credits",
      quantity: 50,
      price: 18.75,
      total: 937.5,
      fee: 9.38,
      status: "completed",
      date: "2024-01-18",
      time: "10:15:45",
      counterparty: "john.doe@email.com",
      hash: "0x9f8e7d6c5b4a3c2d1e0f9a8b7c6d5e4f3a2b1c0d",
      verification: "Green-e",
      notes: "",
    },
    {
      id: "TX-2024-003",
      type: "transfer",
      asset: "Wind Energy Credits",
      quantity: 25,
      price: 0,
      total: 0,
      fee: 0.5,
      status: "pending",
      date: "2024-01-19",
      time: "16:45:12",
      counterparty: "alice.smith@email.com",
      hash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
      verification: "REGO",
      notes: "Payment for consulting services",
    },
    {
      id: "TX-2024-004",
      type: "buy",
      asset: "EV Carbon Credits",
      quantity: 75,
      price: 26.8,
      total: 2010.0,
      fee: 20.1,
      status: "failed",
      date: "2024-01-17",
      time: "09:22:18",
      counterparty: "GreenTech Solutions",
      hash: null,
      verification: "VCS",
      notes: "Payment processing failed",
    },
    {
      id: "TX-2024-005",
      type: "sell",
      asset: "Industrial Efficiency Credits",
      quantity: 200,
      price: 21.3,
      total: 4260.0,
      fee: 42.6,
      status: "processing",
      date: "2024-01-21",
      time: "11:30:00",
      counterparty: "EcoManufacturing GmbH",
      hash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
      verification: "TÜV",
      notes: "Bulk purchase for corporate offsetting",
    },
  ];

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.counterparty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const txDate = new Date(tx.date);
      const now = new Date();
      const days = parseInt(dateFilter);
      const filterDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      matchesDate = txDate >= filterDate;
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // Calculate summary statistics
  const summary = {
    totalTransactions: filteredTransactions.length,
    totalVolume: filteredTransactions.reduce((sum, tx) => sum + tx.quantity, 0),
    totalValue: filteredTransactions.reduce((sum, tx) => sum + tx.total, 0),
    totalFees: filteredTransactions.reduce((sum, tx) => sum + tx.fee, 0),
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "buy":
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      case "sell":
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case "transfer":
        return <Hash className="h-4 w-4 text-purple-600" />;
      default:
        return <Hash className="h-4 w-4 text-gray-600" />;
    }
  };

  const exportData = (format) => {
    // Here you would implement actual export functionality
    console.log(
      `Exporting ${filteredTransactions.length} transactions as ${format}`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold">
                  {summary.totalTransactions}
                </p>
              </div>
              <History className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Volume
                </p>
                <p className="text-2xl font-bold">
                  {summary.totalVolume.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">credits</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">
                  ${summary.totalValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fees</p>
                <p className="text-2xl font-bold">
                  ${summary.totalFees.toFixed(2)}
                </p>
              </div>
              <Hash className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Options */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportData("csv")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportData("pdf")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5 text-green-600" />
            <span>Transaction History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.id}</div>
                        <div className="text-xs text-gray-500">
                          {transaction.counterparty}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(transaction.type)}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.asset}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {transaction.verification}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {transaction.quantity.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {transaction.price > 0 ? `$${transaction.price}` : "-"}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {transaction.total > 0
                            ? `$${transaction.total.toLocaleString()}`
                            : "-"}
                        </div>
                        {transaction.fee > 0 && (
                          <div className="text-xs text-gray-500">
                            Fee: ${transaction.fee}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          getStatusColor(transaction.status),
                        )}
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(transaction.status)}
                          <span className="capitalize">
                            {transaction.status}
                          </span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        <div>
                          <div>{transaction.date}</div>
                          <div className="text-xs text-gray-500">
                            {transaction.time}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setSelectedTransaction(transaction)
                              }
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        {transaction.hash && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigator.clipboard.writeText(transaction.hash)
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found</p>
              <p className="text-sm text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Dialog
          open={!!selectedTransaction}
          onOpenChange={() => setSelectedTransaction(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Hash className="h-5 w-5 text-green-600" />
                <span>Transaction Details</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-3">Transaction Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>ID:</span>
                      <span className="font-mono">
                        {selectedTransaction.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <div className="flex items-center space-x-1">
                        {getTypeIcon(selectedTransaction.type)}
                        <span className="capitalize">
                          {selectedTransaction.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          getStatusColor(selectedTransaction.status),
                        )}
                      >
                        {selectedTransaction.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>
                        {selectedTransaction.date} at {selectedTransaction.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Financial Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-semibold">
                        {selectedTransaction.quantity.toLocaleString()} credits
                      </span>
                    </div>
                    {selectedTransaction.price > 0 && (
                      <div className="flex justify-between">
                        <span>Price per credit:</span>
                        <span>${selectedTransaction.price}</span>
                      </div>
                    )}
                    {selectedTransaction.total > 0 && (
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>
                          ${selectedTransaction.total.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedTransaction.fee > 0 && (
                      <div className="flex justify-between">
                        <span>Fee:</span>
                        <span>${selectedTransaction.fee}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Asset Details */}
              <div>
                <h4 className="font-semibold mb-3">Asset Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Asset:</span>
                    <span className="font-semibold">
                      {selectedTransaction.asset}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verification:</span>
                    <Badge variant="secondary">
                      {selectedTransaction.verification}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Counterparty:</span>
                    <span>{selectedTransaction.counterparty}</span>
                  </div>
                  {selectedTransaction.notes && (
                    <div>
                      <span>Notes:</span>
                      <p className="mt-1 p-2 bg-gray-50 rounded text-gray-700">
                        {selectedTransaction.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Blockchain Info */}
              {selectedTransaction.hash && (
                <div>
                  <h4 className="font-semibold mb-3">Blockchain Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Transaction Hash:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs">
                          {selectedTransaction.hash.substring(0, 20)}...
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              selectedTransaction.hash,
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dispute Options */}
              {selectedTransaction.status === "completed" && (
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">
                        Need help with this transaction?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Report issues or disputes within 30 days
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Report Issue
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TransactionHistory;
