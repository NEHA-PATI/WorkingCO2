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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/basic-ui";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Store,
  UploadCloud,
} from "lucide-react";
import {
  calculateSuggestedPrice,
  getProjectTypes,
  registries,
} from "../config/mockMarketplaceData";
import useCurrency from "../hooks/useCurrency";
import { formatPriceFromUSD } from "../lib/currencyUtils";

const ratingOptions = ["AAA", "AA", "A", "BBB", "BB"];

const registryCodeById = Object.fromEntries(
  registries.map((registry) => [registry.id, registry.code]),
);

const initialForm = {
  registryId: registries[0]?.id || "",
  registryCreditId: "",
  projectType: getProjectTypes()[0] || "",
  score: "A",
  quantity: 1000,
  vintage: 2024,
  issuanceYear: 2023,
  liquidityScore: 62,
  volatilityScore: 18,
  permanenceYears: 40,
};

function isRegistryIdFormatValid(id) {
  return /^[A-Z]{2,6}-[A-Z0-9-]{5,}$/i.test(id.trim());
}

export default function SellCredits() {
  const { currency, fxRate } = useCurrency();
  const [form, setForm] = useState(initialForm);
  const [adapterStatus, setAdapterStatus] = useState("idle");
  const [formatStatus, setFormatStatus] = useState("idle");
  const [pricing, setPricing] = useState(null);
  const [activeListings, setActiveListings] = useState([]);
  const money = (value) =>
    formatPriceFromUSD(value, currency, fxRate, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const adapterMessage = useMemo(() => {
    if (adapterStatus === "validating") return "Registry adapter validation running...";
    if (adapterStatus === "valid")
      return "Registry adapter validated and compatible with submission schema.";
    if (adapterStatus === "invalid")
      return "Registry ID failed adapter validation. Check code prefix and format.";
    return "Run adapter validation before listing.";
  }, [adapterStatus]);

  const formatMessage = useMemo(() => {
    if (formatStatus === "validating") return "Running credit format verification...";
    if (formatStatus === "valid")
      return "Credit format verified against marketplace schema and vintage constraints.";
    if (formatStatus === "invalid")
      return "Credit format verification failed. Review quantity/vintage/permanence fields.";
    return "Run automated format verification.";
  }, [formatStatus]);

  const handleAdapterValidation = async () => {
    setAdapterStatus("validating");
    await new Promise((resolve) => setTimeout(resolve, 850));

    const expectedCode = registryCodeById[form.registryId];
    const normalizedId = form.registryCreditId.trim().toUpperCase();
    const hasFormat = isRegistryIdFormatValid(normalizedId);
    const hasPrefix = normalizedId.startsWith(`${expectedCode}-`);

    setAdapterStatus(hasFormat && hasPrefix ? "valid" : "invalid");
  };

  const handleFormatValidation = async () => {
    setFormatStatus("validating");
    await new Promise((resolve) => setTimeout(resolve, 650));

    const valid =
      Number(form.quantity) > 0 &&
      Number(form.vintage) >= 2015 &&
      Number(form.vintage) <= 2026 &&
      Number(form.issuanceYear) >= 2010 &&
      Number(form.issuanceYear) <= Number(form.vintage) &&
      Number(form.permanenceYears) >= 5;

    setFormatStatus(valid ? "valid" : "invalid");
  };

  const handleSuggestedPrice = () => {
    const suggestion = calculateSuggestedPrice({
      registryId: form.registryId,
      projectType: form.projectType,
      score: form.score,
      liquidityScore: Number(form.liquidityScore),
      volatilityScore: Number(form.volatilityScore),
    });
    setPricing(suggestion);
  };

  const handleCreateListing = () => {
    if (!pricing || adapterStatus !== "valid" || formatStatus !== "valid") return;

    const listing = {
      id: `${form.registryCreditId}-${Date.now().toString().slice(-5)}`,
      registry: registries.find((registry) => registry.id === form.registryId)?.name,
      projectType: form.projectType,
      score: form.score,
      quantity: Number(form.quantity),
      suggestedPrice: pricing.suggestedPrice,
      liquidityScore: Number(form.liquidityScore),
      volatilityScore: Number(form.volatilityScore),
    };

    setActiveListings((previous) => [listing, ...previous].slice(0, 12));
  };

  const canList = pricing && adapterStatus === "valid" && formatStatus === "valid";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Store className="h-5 w-5 text-brand-700" />
            Seller Portal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Registry</Label>
              <Select
                value={form.registryId}
                onValueChange={(value) => setForm((previous) => ({ ...previous, registryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {registries.map((registry) => (
                    <SelectItem key={registry.id} value={registry.id}>
                      {registry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Registry Credit ID</Label>
              <Input
                value={form.registryCreditId}
                placeholder={`${registryCodeById[form.registryId]}-2024-00001`}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, registryCreditId: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Project Type</Label>
              <Select
                value={form.projectType}
                onValueChange={(value) => setForm((previous) => ({ ...previous, projectType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getProjectTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Credit Rating</Label>
              <Select
                value={form.score}
                onValueChange={(value) => setForm((previous) => ({ ...previous, score: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((score) => (
                    <SelectItem key={score} value={score}>
                      {score}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="space-y-2">
              <Label>Quantity (t)</Label>
              <Input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, quantity: Number(event.target.value) || 0 }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Vintage</Label>
              <Input
                type="number"
                value={form.vintage}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, vintage: Number(event.target.value) || 0 }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Issuance Year</Label>
              <Input
                type="number"
                value={form.issuanceYear}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, issuanceYear: Number(event.target.value) || 0 }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Permanence (years)</Label>
              <Input
                type="number"
                value={form.permanenceYears}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    permanenceYears: Number(event.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Liquidity Score</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={form.liquidityScore}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    liquidityScore: Number(event.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Volatility Score</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={form.volatilityScore}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    volatilityScore: Number(event.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleAdapterValidation}>
              {adapterStatus === "validating" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="mr-2 h-4 w-4" />
              )}
              Validate Registry Adapter
            </Button>
            <Button variant="outline" onClick={handleFormatValidation}>
              {formatStatus === "validating" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Verify Credit Format
            </Button>
            <Button variant="outline" onClick={handleSuggestedPrice}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Run Suggested Pricing Engine
            </Button>
            <Button onClick={handleCreateListing} disabled={!canList}>
              Create Listing
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-slate-500">
                Adapter Validation
              </p>
              <p className="mt-1 text-sm text-slate-700">{adapterMessage}</p>
              <Badge
                className={
                  adapterStatus === "valid"
                    ? "mt-3 bg-emerald-100 text-emerald-700"
                    : adapterStatus === "invalid"
                      ? "mt-3 bg-rose-100 text-rose-700"
                      : "mt-3 bg-slate-200 text-slate-700"
                }
              >
                {adapterStatus.toUpperCase()}
              </Badge>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-slate-500">
                Format Verification
              </p>
              <p className="mt-1 text-sm text-slate-700">{formatMessage}</p>
              <Badge
                className={
                  formatStatus === "valid"
                    ? "mt-3 bg-emerald-100 text-emerald-700"
                    : formatStatus === "invalid"
                      ? "mt-3 bg-rose-100 text-rose-700"
                      : "mt-3 bg-slate-200 text-slate-700"
                }
              >
                {formatStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {pricing && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Suggested Pricing Engine Output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Base Market Price</p>
                <p className="text-lg font-bold text-slate-900">{money(pricing.basePrice)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Suggested Listing Price</p>
                <p className="text-lg font-bold text-emerald-700">
                  {money(pricing.suggestedPrice)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Rating Premium Driver</p>
                <p className="text-lg font-bold text-slate-900">
                  {pricing.ratingAdjustment >= 0 ? "+" : ""}
                  {money(pricing.ratingAdjustment)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Price Components (Registry + Type + Historical + Liquidity + Rating + Volatility)
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-2">
                <p>Registry adjustment: {money(pricing.registryAdjustment)}</p>
                <p>Rating adjustment: {money(pricing.ratingAdjustment)}</p>
                <p>Liquidity adjustment: {money(pricing.liquidityAdjustment)}</p>
                <p>Volatility adjustment: {money(pricing.volatilityAdjustment)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              Suggested prices are execution estimates and can move with liquidity and
              spread changes.
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Active Seller Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {activeListings.length === 0 ? (
            <p className="text-sm text-slate-600">
              No listings created yet. Complete validation and pricing to list a credit.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Listing ID</TableHead>
                  <TableHead>Registry</TableHead>
                  <TableHead>Project Type</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Qty (t)</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Liquidity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-semibold text-slate-900">{listing.id}</TableCell>
                    <TableCell>{listing.registry}</TableCell>
                    <TableCell>{listing.projectType}</TableCell>
                    <TableCell>
                      <Badge>{listing.score}</Badge>
                    </TableCell>
                    <TableCell>{listing.quantity.toLocaleString()}</TableCell>
                    <TableCell>{money(listing.suggestedPrice)}</TableCell>
                    <TableCell>{listing.liquidityScore}/100</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
