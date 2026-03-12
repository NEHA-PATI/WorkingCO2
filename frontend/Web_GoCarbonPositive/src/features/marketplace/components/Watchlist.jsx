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
  Switch,
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
  Heart,
  Bell,
  Eye,
  Trash2,
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  Mail,
  Smartphone,
  Settings,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const Watchlist = () => {
  const [activeTab, setActiveTab] = useState("watchlist"); // 'watchlist' or 'alerts'
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    asset: "",
    condition: "above",
    price: "",
    emailEnabled: true,
    smsEnabled: false,
  });

  // Mock watchlist data
  const watchlistItems = [
    {
      id: 1,
      asset: "Brazilian Forest Credits",
      seller: "Amazon Conservation Fund",
      currentPrice: 31.2,
      targetPrice: 29.0,
      priceChange: +2.3,
      priceChangePercent: +7.9,
      verification: "Gold Standard",
      dateAdded: "2024-01-15",
      alertsEnabled: true,
      available: 500,
    },
    {
      id: 2,
      asset: "Solar Energy Credits",
      seller: "SunPower Corp",
      currentPrice: 18.75,
      targetPrice: 20.0,
      priceChange: -0.5,
      priceChangePercent: -2.6,
      verification: "Green-e",
      dateAdded: "2024-01-18",
      alertsEnabled: true,
      available: 1000,
    },
    {
      id: 3,
      asset: "Wind Energy Credits",
      seller: "WindPower Ltd",
      currentPrice: 26.8,
      targetPrice: 25.0,
      priceChange: +1.8,
      priceChangePercent: +7.2,
      verification: "REGO",
      dateAdded: "2024-01-20",
      alertsEnabled: false,
      available: 750,
    },
  ];

  // Mock alerts data
  const priceAlerts = [
    {
      id: 1,
      asset: "Brazilian Forest Credits",
      condition: "drops below",
      targetPrice: 29.0,
      currentPrice: 31.2,
      status: "active",
      created: "2024-01-15",
      emailEnabled: true,
      smsEnabled: false,
      triggered: false,
    },
    {
      id: 2,
      asset: "Solar Energy Credits",
      condition: "rises above",
      targetPrice: 20.0,
      currentPrice: 18.75,
      status: "active",
      created: "2024-01-18",
      emailEnabled: true,
      smsEnabled: true,
      triggered: false,
    },
    {
      id: 3,
      asset: "EV Carbon Credits",
      condition: "drops below",
      targetPrice: 25.0,
      currentPrice: 23.45,
      status: "triggered",
      created: "2024-01-10",
      emailEnabled: true,
      smsEnabled: false,
      triggered: true,
      triggeredDate: "2024-01-19",
    },
  ];

  const notifications = [
    {
      id: 1,
      type: "price_alert",
      title: "Price Target Reached",
      message: "EV Carbon Credits dropped below $25.00",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "watchlist",
      title: "New Listing Added",
      message: "Solar Energy Credits from verified seller",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: 3,
      type: "price_alert",
      title: "Price Increase Alert",
      message: "Wind Energy Credits up 7.2% in 24h",
      timestamp: "2 days ago",
      read: true,
    },
  ];

  const removeFromWatchlist = (id) => {
    console.log("Removing item from watchlist:", id);
  };

  const toggleAlert = (id) => {
    console.log("Toggling alert for item:", id);
  };

  const createPriceAlert = () => {
    console.log("Creating price alert:", newAlert);
    setShowAddDialog(false);
    setNewAlert({
      asset: "",
      condition: "above",
      price: "",
      emailEnabled: true,
      smsEnabled: false,
    });
  };

  const WatchlistTab = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Items Watched
                </p>
                <p className="text-2xl font-bold">{watchlistItems.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Alerts
                </p>
                <p className="text-2xl font-bold">
                  {priceAlerts.filter((a) => a.status === "active").length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Price Change
                </p>
                <p className="text-2xl font-bold text-green-600">+4.2%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Watchlist Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Your Watchlist</span>
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Target Price</TableHead>
                  <TableHead>Change (24h)</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Alerts</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlistItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.asset}</div>
                        <div className="text-sm text-gray-500">
                          {item.seller}
                        </div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {item.verification}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        ${item.currentPrice}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Target className="h-3 w-3 text-gray-400" />
                        <span>${item.targetPrice}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "flex items-center space-x-1",
                          item.priceChange > 0
                            ? "text-green-600"
                            : "text-red-600",
                        )}
                      >
                        {item.priceChange > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span className="font-medium">
                          ${Math.abs(item.priceChange)} (
                          {item.priceChangePercent > 0 ? "+" : ""}
                          {item.priceChangePercent}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span>{item.available.toLocaleString()} credits</span>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={item.alertsEnabled}
                        onCheckedChange={() => toggleAlert(item.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ShoppingCart className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => removeFromWatchlist(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {watchlistItems.length === 0 && (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Your watchlist is empty</p>
              <p className="text-sm text-gray-400 mb-4">
                Add items to track prices and get alerts
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const AlertsTab = () => (
    <div className="space-y-6">
      {/* Price Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-500" />
            <span>Price Alerts</span>
          </CardTitle>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Price Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="alert-asset">Asset</Label>
                  <Input
                    id="alert-asset"
                    placeholder="Enter asset name"
                    value={newAlert.asset}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, asset: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alert-condition">Condition</Label>
                    <select
                      id="alert-condition"
                      value={newAlert.condition}
                      onChange={(e) =>
                        setNewAlert({ ...newAlert, condition: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="above">Rises above</option>
                      <option value="below">Drops below</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="alert-price">Target Price</Label>
                    <Input
                      id="alert-price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newAlert.price}
                      onChange={(e) =>
                        setNewAlert({ ...newAlert, price: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Notification Methods</Label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>Email notifications</span>
                    </div>
                    <Switch
                      checked={newAlert.emailEnabled}
                      onCheckedChange={(checked) =>
                        setNewAlert({ ...newAlert, emailEnabled: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-gray-500" />
                      <span>SMS notifications</span>
                    </div>
                    <Switch
                      checked={newAlert.smsEnabled}
                      onCheckedChange={(checked) =>
                        setNewAlert({ ...newAlert, smsEnabled: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    className="flex-1"
                    onClick={createPriceAlert}
                    disabled={!newAlert.asset || !newAlert.price}
                  >
                    Create Alert
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {priceAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-center justify-between p-4 border rounded-lg",
                  alert.status === "triggered"
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200",
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      {alert.status === "triggered" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Bell className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{alert.asset}</h4>
                      <p className="text-sm text-gray-600">
                        Alert when price {alert.condition} ${alert.targetPrice}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Current: ${alert.currentPrice}
                        </span>
                        <div className="flex items-center space-x-2 text-xs">
                          {alert.emailEnabled && (
                            <div className="flex items-center text-gray-500">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </div>
                          )}
                          {alert.smsEnabled && (
                            <div className="flex items-center text-gray-500">
                              <Smartphone className="h-3 w-3 mr-1" />
                              SMS
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      alert.status === "triggered" ? "default" : "secondary"
                    }
                    className={cn(
                      alert.status === "triggered"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700",
                    )}
                  >
                    {alert.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Recent Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg transition-colors",
                  !notification.read
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-gray-50",
                )}
              >
                <div className="flex-shrink-0 mt-1">
                  {notification.type === "price_alert" ? (
                    <Bell className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Heart className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={cn(
                      "font-medium",
                      !notification.read ? "text-blue-900" : "text-gray-900",
                    )}
                  >
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.timestamp}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          className={cn(
            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
            activeTab === "watchlist"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900",
          )}
          onClick={() => setActiveTab("watchlist")}
        >
          Watchlist ({watchlistItems.length})
        </button>
        <button
          className={cn(
            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
            activeTab === "alerts"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900",
          )}
          onClick={() => setActiveTab("alerts")}
        >
          Price Alerts (
          {priceAlerts.filter((a) => a.status === "active").length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "watchlist" && <WatchlistTab />}
      {activeTab === "alerts" && <AlertsTab />}
    </div>
  );
};

export default Watchlist;
