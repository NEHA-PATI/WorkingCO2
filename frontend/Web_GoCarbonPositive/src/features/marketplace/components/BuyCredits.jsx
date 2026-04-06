import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  AlertTriangle,
  Building2,
  CheckCircle2,
  CreditCard,
  Landmark,
  Lock,
  Receipt,
  Shield,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { getMarketplaceCatalog } from "../config/mockMarketplaceData";
import useCurrency from "../hooks/useCurrency";
import { formatPriceFromUSD } from "../lib/currencyUtils";

const settlementAccounts = [
  {
    id: "treasury_wallet",
    name: "Corporate Treasury Wallet",
    type: "Custodial Wallet",
    balance: 146250.75,
    currency: "USD",
  },
  {
    id: "registry_escrow",
    name: "Registry Escrow Account",
    type: "Escrow Ledger",
    balance: 98240.5,
    currency: "USD",
  },
  {
    id: "bank_wire_main",
    name: "Primary Wire Account",
    type: "Bank Settlement",
    balance: 320000.0,
    currency: "USD",
  },
];

const settlementMethods = [
  { id: "registry_transfer", label: "Registry Transfer Settlement" },
  { id: "bilateral_netting", label: "Bilateral Netting" },
  { id: "escrow_settlement", label: "Escrow Settlement" },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export default function BuyCredits() {
  const { currency, fxRate } = useCurrency();
  const catalog = useMemo(() => getMarketplaceCatalog(), []);
  const money = (value) =>
    formatPriceFromUSD(value, currency, fxRate, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const [selectedListingId, setSelectedListingId] = useState(
    () => catalog[0]?.listing.id || "",
  );
  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(0);
  const [registryConfirmed, setRegistryConfirmed] = useState(false);
  const [accountId, setAccountId] = useState(settlementAccounts[0].id);
  const [settlementMethod, setSettlementMethod] = useState("registry_transfer");
  const [retireOnSettlement, setRetireOnSettlement] = useState(false);
  const [agreedRisk, setAgreedRisk] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const selectedBundle = useMemo(
    () => catalog.find((entry) => entry.listing.id === selectedListingId) ?? catalog[0],
    [catalog, selectedListingId],
  );
  const selectedAccount = useMemo(
    () =>
      settlementAccounts.find((account) => account.id === accountId) ??
      settlementAccounts[0],
    [accountId],
  );

  if (!selectedBundle) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-600">No marketplace listings available.</p>
        </CardContent>
      </Card>
    );
  }

  const { listing, project, registry } = selectedBundle;
  const minPurchase = listing.minimum_purchase || 1;
  const maxPurchase = listing.quantity;
  const finalQty = clamp(Number(quantity) || minPurchase, minPurchase, maxPurchase);
  const slippagePct = Number(
    Math.max(0.15, (100 - listing.liquidity_score) / 130).toFixed(2),
  );
  const executionPrice =
    orderType === "market"
      ? Number((listing.price_per_tonne * (1 + slippagePct / 100)).toFixed(2))
      : Number(limitPrice || listing.price_per_tonne);
  const subtotal = finalQty * executionPrice;
  const platformFee = subtotal * 0.025;
  const settlementFee = subtotal * 0.0045;
  const total = subtotal + platformFee + settlementFee;

  const canMoveToStep2 = registryConfirmed;
  const canConfirm = agreedRisk;

  const goToStep2 = () => {
    if (!canMoveToStep2) return;
    setStep(2);
  };

  const goToStep3 = () => {
    if (!canConfirm) return;
    const now = new Date();
    setOrderResult({
      orderId: `MKT-BUY-${String(now.getTime()).slice(-6)}`,
      quantity: finalQty,
      executionPrice,
      total,
      settlementMethod:
        settlementMethods.find((method) => method.id === settlementMethod)?.label ||
        settlementMethod,
      accountName: selectedAccount.name,
      retireOnSettlement,
      createdAt: now.toISOString(),
    });
    setStep(3);
  };

  const resetFlow = () => {
    setStep(1);
    setRegistryConfirmed(false);
    setAgreedRisk(false);
    setOrderResult(null);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
              Unified Buy Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`inline-flex items-center rounded-full px-2.5 py-1 font-semibold ${
                    step === n
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Step {n}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {step === 1 && (
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">1. Setup Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Listing</Label>
                <Select
                  value={selectedListingId}
                  onValueChange={(value) => {
                    setSelectedListingId(value);
                    const next = catalog.find((entry) => entry.listing.id === value);
                    const nextMin = next?.listing.minimum_purchase || 1;
                    setQuantity(nextMin);
                    setLimitPrice(next?.listing.price_per_tonne || 0);
                    setRegistryConfirmed(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose listing" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalog.map((entry) => (
                      <SelectItem key={entry.listing.id} value={entry.listing.id}>
                        {entry.project.name} ({entry.registry?.code}) -{" "}
                        {money(entry.listing.price_per_tonne)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{project.name}</p>
                <p className="text-xs text-slate-600">
                  {project.project_type} | {registry?.name} | Rating {listing.score}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{project.country}</Badge>
                  <Badge variant="outline">
                    Available {listing.quantity.toLocaleString()} t
                  </Badge>
                  <Badge variant="outline">Min {minPurchase} t</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Quantity (tons)</Label>
                  <Input
                    type="number"
                    min={minPurchase}
                    max={maxPurchase}
                    value={finalQty}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Order Type</Label>
                  <Select value={orderType} onValueChange={setOrderType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {orderType === "limit" && (
                <div className="space-y-2">
                  <Label>Limit Price (USD)</Label>
                  <Input
                    type="number"
                    value={limitPrice}
                    onChange={(event) => setLimitPrice(Number(event.target.value))}
                  />
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Registry Confirmation
                  </p>
                  <p className="text-xs text-slate-600">
                    Verify {registry?.name} ({registry?.code}) details before continue.
                  </p>
                </div>
                <Switch
                  checked={registryConfirmed}
                  onCheckedChange={setRegistryConfirmed}
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-sm">
                <p>Estimated execution: {money(executionPrice)}</p>
                <p>Slippage estimate: {slippagePct}%</p>
                <p>Platform fee (2.5%): {money(platformFee)}</p>
                <p>Settlement fee (0.45%): {money(settlementFee)}</p>
              </div>

              {!canMoveToStep2 && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  Confirm registry details to move to settlement account step.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                2. Account & Settlement Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Settlement Account</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {settlementAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Account Type</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedAccount.type}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Available Balance</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {money(selectedAccount.balance)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Currency</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedAccount.currency}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Settlement Method</Label>
                <Select value={settlementMethod} onValueChange={setSettlementMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {settlementMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Retire on Settlement
                  </p>
                  <p className="text-xs text-slate-600">
                    Retire credits immediately after successful settlement.
                  </p>
                </div>
                <Switch
                  checked={retireOnSettlement}
                  onCheckedChange={setRetireOnSettlement}
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <input
                  id="risk-consent"
                  type="checkbox"
                  checked={agreedRisk}
                  onChange={(event) => setAgreedRisk(event.target.checked)}
                />
                <label htmlFor="risk-consent">
                  I understand market volatility and spread changes can impact
                  execution.
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && orderResult && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader className="border-emerald-200 pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-emerald-900">
                <CheckCircle2 className="h-5 w-5" />
                3. Order Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-emerald-200 bg-white p-3">
                  <p className="text-xs text-slate-500">Order ID</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {orderResult.orderId}
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-white p-3">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {money(orderResult.total)}
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-white p-3">
                  <p className="text-xs text-slate-500">Settlement</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {orderResult.settlementMethod}
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-white p-3">
                  <p className="text-xs text-slate-500">Account</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {orderResult.accountName}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline">
                  <Receipt className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
                <Button onClick={resetFlow}>Place Another Order</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="h-fit border-slate-200 bg-white lg:sticky lg:top-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="font-semibold text-slate-900">{project.name}</p>
            <p className="text-xs text-slate-600">
              {registry?.name} | {project.project_type}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Quantity</span>
              <span>{finalQty.toLocaleString()} t</span>
            </div>
            <div className="flex justify-between">
              <span>Execution Price</span>
              <span>{money(executionPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>{money(platformFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Settlement Fee</span>
              <span>{money(settlementFee)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2">
              <div className="flex justify-between font-semibold text-slate-900">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
            <p className="font-semibold">Environmental Impact</p>
            <p className="mt-1">Offset volume: {finalQty.toLocaleString()} tCO2e</p>
            <p>Equivalent tree estimate: {Math.round(finalQty * 2.3).toLocaleString()}</p>
          </div>

          {step === 1 && (
            <Button className="w-full" onClick={goToStep2} disabled={!canMoveToStep2}>
              Continue to Account Step
            </Button>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Button className="w-full" onClick={goToStep3} disabled={!canConfirm}>
                <Lock className="mr-2 h-4 w-4" />
                Confirm Order
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                Back to Setup
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Landmark className="mr-2 h-4 w-4" />
                View Settlement Activity
              </Button>
              <Button variant="outline" className="w-full">
                <Wallet className="mr-2 h-4 w-4" />
                Open Portfolio
              </Button>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              Verified
            </span>
            <span className="inline-flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" />
              Secure
            </span>
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              Registry Linked
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
