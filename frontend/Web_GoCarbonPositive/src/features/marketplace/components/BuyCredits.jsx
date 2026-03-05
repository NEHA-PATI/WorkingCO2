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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "./ui/basic-ui";
import {
  CreditCard,
  Wallet,
  Shield,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Receipt,
  DollarSign,
  Bitcoin,
  Banknote,
  Lock,
  ArrowRight,
  Clock,
  Star,
  MapPin,
} from "lucide-react";

const BuyCredits = () => {
  const [selectedListing, setSelectedListing] = useState("forest-credits");
  const [quantity, setQuantity] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [autoInvest, setAutoInvest] = useState(false);
  const [step, setStep] = useState(1); // 1: Select, 2: Payment, 3: Confirmation

  // Mock listings for purchase
  const listings = {
    "forest-credits": {
      title: "Brazilian Rainforest Protection Credits",
      price: 23.45,
      seller: "Amazon Conservation Fund",
      verification: "Gold Standard",
      location: "Amazon, Brazil",
      rating: 4.9,
      available: 5000,
      description: "High-quality forest conservation credits",
      features: [
        "Verified deforestation prevention",
        "Biodiversity protection",
        "Community benefits",
        "Real-time monitoring",
      ],
    },
    "solar-credits": {
      title: "Solar Farm Renewable Energy Credits",
      price: 18.75,
      seller: "SunPower Corp",
      verification: "Green-e",
      location: "Arizona, USA",
      rating: 4.7,
      available: 3000,
      description: "Utility-scale solar energy credits",
      features: [
        "100% renewable energy",
        "Grid-connected",
        "Real-time generation data",
        "Long-term contracts",
      ],
    },
    "wind-credits": {
      title: "Offshore Wind Energy Credits",
      price: 26.8,
      seller: "WindPower Ltd",
      verification: "REGO",
      location: "North Sea, UK",
      rating: 4.6,
      available: 2500,
      description: "Premium offshore wind energy credits",
      features: [
        "Offshore wind generation",
        "High capacity factor",
        "Minimal environmental impact",
        "Blockchain verified",
      ],
    },
  };

  const currentListing = listings[selectedListing];
  const subtotal = quantity * currentListing.price;
  const platformFee = subtotal * 0.025; // 2.5% platform fee
  const carbonNeutralShipping = 2.99;
  const total = subtotal + platformFee + carbonNeutralShipping;

  const paymentMethods = [
    {
      id: "card",
      name: "Credit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express",
      processingTime: "Instant",
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      icon: Bitcoin,
      description: "Bitcoin, Ethereum, USDC",
      processingTime: "5-10 minutes",
    },
    {
      id: "wire",
      name: "Wire Transfer",
      icon: Banknote,
      description: "Bank transfer",
      processingTime: "1-3 business days",
    },
    {
      id: "wallet",
      name: "Carbon Wallet",
      icon: Wallet,
      description: "Use your platform balance",
      processingTime: "Instant",
      balance: 1250.75,
    },
  ];

  const handlePurchase = () => {
    setStep(3);
    // Here you would integrate with actual payment processing
    setTimeout(() => {
      console.log("Purchase completed!");
    }, 2000);
  };

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Purchase Successful!
              </h2>
              <p className="text-gray-600">
                Your carbon credits have been successfully purchased and added
                to your portfolio.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Credits Purchased:</span>
                  <p className="font-semibold">{quantity} credits</p>
                </div>
                <div>
                  <span className="text-gray-600">Total Paid:</span>
                  <p className="font-semibold">${total.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Transaction ID:</span>
                  <p className="font-semibold text-xs">
                    TX-{Math.random().toString(36).substring(2, 15)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Verification:</span>
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {currentListing.verification}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full">
                <Receipt className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" className="w-full">
                View Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Credit Selection */}
      <div className="lg:col-span-2 space-y-6">
        {step === 1 && (
          <>
            {/* Listing Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  <span>Select Credits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="listing-select">Choose Credit Type</Label>
                  <Select
                    value={selectedListing}
                    onValueChange={setSelectedListing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(listings).map(([key, listing]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center justify-between w-full">
                            <span>{listing.title}</span>
                            <span className="text-green-600 font-semibold ml-2">
                              ${listing.price}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selected Listing Details */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{currentListing.title}</h4>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {currentListing.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${currentListing.price}
                      </p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm">{currentListing.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {currentListing.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {currentListing.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-xs text-gray-600"
                      >
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-sm text-gray-600">Available:</span>
                    <span className="text-sm font-semibold">
                      {currentListing.available.toLocaleString()} credits
                    </span>
                  </div>
                </div>

                {/* Quantity Selection */}
                <div>
                  <Label htmlFor="quantity">Quantity (Credits)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    max={currentListing.available}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: {currentListing.available.toLocaleString()} credits
                  </p>
                </div>

                {/* Auto Investment */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="auto-invest" className="font-medium">
                      Auto-Invest
                    </Label>
                    <p className="text-sm text-gray-600">
                      Automatically purchase more credits monthly
                    </p>
                  </div>
                  <Switch
                    id="auto-invest"
                    checked={autoInvest}
                    onCheckedChange={setAutoInvest}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {step === 2 && (
          <>
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-colors",
                          paymentMethod === method.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:bg-gray-50",
                        )}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <div className="flex-1">
                            <h4 className="font-medium">{method.name}</h4>
                            <p className="text-sm text-gray-600">
                              {method.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {method.processingTime}
                              </span>
                              {method.balance && (
                                <span className="text-xs text-green-600 font-medium">
                                  Balance: ${method.balance}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Payment Form */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "crypto" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label htmlFor="crypto-type">Cryptocurrency</Label>
                      <Select defaultValue="usdc">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usdc">USDC</SelectItem>
                          <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                          <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="wallet-address">Wallet Address</Label>
                      <Input
                        id="wallet-address"
                        placeholder="0x..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600">
                    Your payment information is secure and encrypted. We use
                    industry-standard security measures to protect your data.
                  </span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-green-600" />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Credits ({quantity}x)</span>
                <span className="text-sm">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Platform Fee (2.5%)</span>
                <span className="text-sm">${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Carbon Neutral Shipping</span>
                <span className="text-sm">${carbonNeutralShipping}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-green-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="font-medium text-green-800 mb-2">
                Environmental Impact
              </h4>
              <div className="space-y-1 text-sm text-green-700">
                <div className="flex justify-between">
                  <span>CO₂ Offset:</span>
                  <span className="font-semibold">{quantity} tons</span>
                </div>
                <div className="flex justify-between">
                  <span>Equivalent:</span>
                  <span className="font-semibold">
                    {Math.round(quantity * 2.3)} trees planted
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {step === 1 && (
                <Button
                  className="w-full"
                  onClick={() => setStep(2)}
                  disabled={quantity === 0}
                >
                  Continue to Payment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              {step === 2 && (
                <>
                  <Button className="w-full" onClick={handlePurchase}>
                    <Lock className="h-4 w-4 mr-2" />
                    Complete Purchase
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep(1)}
                  >
                    Back to Selection
                  </Button>
                </>
              )}
            </div>

            {/* Trust Signals */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Verified</span>
                </div>
                <div className="flex items-center">
                  <Lock className="h-3 w-3 mr-1" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>Guaranteed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyCredits;
