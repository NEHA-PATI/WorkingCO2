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
  Label,
  Textarea,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/basic-ui";
import {
  Send,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Wallet,
  Copy,
  Eye,
  Hash,
  Calendar,
  Filter,
  ArrowRight,
  Bell,
} from "lucide-react";

const TransferCredits = () => {
  const [transferType, setTransferType] = useState("user"); // 'user' or 'wallet'
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState("send"); // 'send' or 'history'

  // Mock transfer history
  const transferHistory = [
    {
      id: "TX-001",
      type: "sent",
      recipient: "john.doe@email.com",
      amount: 50,
      fee: 0.5,
      status: "completed",
      date: "2024-01-20",
      hash: "0x1a2b3c4d5e6f...",
      message: "Payment for consulting services",
    },
    {
      id: "TX-002",
      type: "received",
      sender: "alice.smith@email.com",
      amount: 25,
      fee: 0,
      status: "completed",
      date: "2024-01-18",
      hash: "0x9f8e7d6c5b4a...",
      message: "Thank you for the environmental project",
    },
    {
      id: "TX-003",
      type: "sent",
      recipient: "0x742d35Cc6123...",
      amount: 100,
      fee: 1.0,
      status: "pending",
      date: "2024-01-19",
      hash: "0x3c4d5e6f7a8b...",
      message: "",
    },
  ];

  const networkFees = {
    fast: { fee: 1.5, time: "~2 minutes" },
    standard: { fee: 0.75, time: "~5 minutes" },
    economy: { fee: 0.25, time: "~15 minutes" },
  };

  const [selectedFee, setSelectedFee] = useState("standard");

  const handleTransfer = () => {
    // Here you would integrate with actual blockchain transfer
    console.log("Transfer initiated:", {
      transferType,
      recipient,
      amount,
      message,
      fee: networkFees[selectedFee].fee,
    });
  };

  const SendTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5 text-green-600" />
            <span>Send Carbon Credits</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transfer Type Selection */}
          <div>
            <Label className="text-base font-medium">Transfer Method</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors",
                  transferType === "user"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:bg-gray-50",
                )}
                onClick={() => setTransferType("user")}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Platform User</span>
                </div>
                <p className="text-sm text-gray-600">
                  Send to registered users by email or username
                </p>
              </div>

              <div
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors",
                  transferType === "wallet"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:bg-gray-50",
                )}
                onClick={() => setTransferType("wallet")}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Wallet Address</span>
                </div>
                <p className="text-sm text-gray-600">
                  Send to any blockchain wallet address
                </p>
              </div>
            </div>
          </div>

          {/* Recipient Input */}
          <div>
            <Label htmlFor="recipient">
              {transferType === "user"
                ? "Recipient Email or Username"
                : "Wallet Address"}
            </Label>
            <div className="relative">
              {transferType === "user" ? (
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              ) : (
                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              )}
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="pl-10"
                placeholder={
                  transferType === "user"
                    ? "john.doe@email.com or @johndoe"
                    : "0x742d35Cc6123..."
                }
              />
            </div>
            {transferType === "wallet" && (
              <p className="text-xs text-gray-500 mt-1">
                Make sure the address is correct. Transfers cannot be reversed.
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <Label htmlFor="amount">Amount (Credits)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">Available: 847.5 credits</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setAmount("847.5")}
              >
                Max
              </Button>
            </div>
          </div>

          {/* Network Fee Selection */}
          <div>
            <Label className="text-base font-medium">Network Fee</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {Object.entries(networkFees).map(([key, fee]) => (
                <div
                  key={key}
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-colors text-center",
                    selectedFee === key
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:bg-gray-50",
                  )}
                  onClick={() => setSelectedFee(key)}
                >
                  <div className="font-medium capitalize">{key}</div>
                  <div className="text-sm text-gray-600">{fee.time}</div>
                  <div className="text-sm font-semibold">{fee.fee} credits</div>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note to the recipient..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/500 characters
            </p>
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="2fa" className="font-medium">
                  Two-Factor Authentication
                </Label>
                <p className="text-sm text-gray-600">
                  Require 2FA verification for this transfer
                </p>
              </div>
              <Switch
                id="2fa"
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="notifications" className="font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-gray-600">
                  Send confirmation and status updates via email
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>

          {/* Transfer Summary */}
          {amount && recipient && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Transfer Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">{amount} credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee:</span>
                  <span>{networkFees[selectedFee].fee} credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span>{networkFees[selectedFee].time}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Deducted:</span>
                  <span>
                    {(
                      parseFloat(amount) + networkFees[selectedFee].fee
                    ).toFixed(2)}{" "}
                    credits
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Security Warning */}
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">
                Important Security Notice
              </p>
              <p className="text-yellow-700 mt-1">
                Carbon credit transfers are irreversible. Please verify the
                recipient address carefully before confirming the transaction.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              className="flex-1"
              onClick={handleTransfer}
              disabled={!amount || !recipient}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Credits
            </Button>
            <Button variant="outline">Save as Draft</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const HistoryTab = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-green-600" />
            <span>Transfer History</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Recipient/Sender</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transferHistory.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {transfer.type === "sent" ? (
                          <Send className="h-4 w-4 text-red-500" />
                        ) : (
                          <ArrowRight className="h-4 w-4 text-green-500 rotate-180" />
                        )}
                        <span className="font-medium capitalize">
                          {transfer.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {transfer.recipient || transfer.sender}
                        </div>
                        {transfer.message && (
                          <div className="text-xs text-gray-500 mt-1">
                            "{transfer.message}"
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        {transfer.amount} credits
                      </span>
                    </TableCell>
                    <TableCell>
                      {transfer.fee > 0 ? `${transfer.fee} credits` : "Free"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transfer.status === "completed"
                            ? "default"
                            : transfer.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className={cn(
                          transfer.status === "completed" &&
                          "bg-green-100 text-green-700",
                          transfer.status === "pending" &&
                          "bg-yellow-100 text-yellow-700",
                        )}
                      >
                        {transfer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="text-sm">{transfer.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigator.clipboard.writeText(transfer.hash)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Sent (30d)
                </p>
                <p className="text-2xl font-bold">175</p>
                <p className="text-xs text-gray-500">credits</p>
              </div>
              <Send className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Received (30d)
                </p>
                <p className="text-2xl font-bold">125</p>
                <p className="text-xs text-gray-500">credits</p>
              </div>
              <ArrowRight className="h-8 w-8 text-green-500 rotate-180" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Network Fees (30d)
                </p>
                <p className="text-2xl font-bold">5.75</p>
                <p className="text-xs text-gray-500">credits</p>
              </div>
              <Hash className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          className={cn(
            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
            activeTab === "send"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900",
          )}
          onClick={() => setActiveTab("send")}
        >
          Send Credits
        </button>
        <button
          className={cn(
            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
            activeTab === "history"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900",
          )}
          onClick={() => setActiveTab("history")}
        >
          Transfer History
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "send" && <SendTab />}
      {activeTab === "history" && <HistoryTab />}
    </div>
  );
};

export default TransferCredits;
