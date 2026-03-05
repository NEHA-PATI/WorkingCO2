import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/basic-ui";
import {
  getLiquidityDepthSeries,
  getListingBundle,
  getOrderBook,
  getSimilarCredits,
} from "../config/mockMarketplaceData";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Receipt,
  ShoppingCart,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const qualityGradients = {
  premium: "from-purple-600 to-indigo-600",
  high: "from-emerald-600 to-teal-600",
  standard: "from-blue-500 to-cyan-500",
  basic: "from-slate-500 to-slate-600",
};

const scoreClasses = {
  AAA: "bg-emerald-100 text-emerald-700 border-emerald-200",
  AA: "bg-blue-100 text-blue-700 border-blue-200",
  A: "bg-cyan-100 text-cyan-700 border-cyan-200",
  BBB: "bg-amber-100 text-amber-700 border-amber-200",
  BB: "bg-rose-100 text-rose-700 border-rose-200",
};

const money = (value) => `$${Number(value).toFixed(2)}`;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export default function ListingDetailPage() {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const bundle = useMemo(() => getListingBundle(listingId), [listingId]);

  const [orderOpen, setOrderOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(0);
  const [registryConfirmed, setRegistryConfirmed] = useState(false);
  const [settlementMethod, setSettlementMethod] = useState("registry_transfer");
  const [retireOnSettlement, setRetireOnSettlement] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  useEffect(() => {
    if (!bundle?.listing) return;
    const min = bundle.listing.minimum_purchase || 1;
    setQuantity(min);
    setLimitPrice(bundle.listing.price_per_tonne);
  }, [bundle]);

  if (!bundle) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-3 text-2xl font-bold text-slate-900">Listing not found</h2>
          <Button onClick={() => navigate("/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    );
  }

  const { listing, project, registry, qualityScore, credit } = bundle;
  const minPurchase = listing.minimum_purchase || 1;
  const finalQty = clamp(Number(quantity) || minPurchase, minPurchase, listing.quantity);
  const qualityColor = qualityGradients[listing.quality_category] || qualityGradients.standard;
  const slippagePct = Number(Math.max(0.15, (100 - listing.liquidity_score) / 130).toFixed(2));
  const executionPrice =
    orderType === "market"
      ? Number((listing.price_per_tonne * (1 + slippagePct / 100)).toFixed(2))
      : Number(limitPrice || listing.price_per_tonne);
  const subtotal = finalQty * executionPrice;
  const fee = subtotal * 0.025;
  const total = subtotal + fee;
  const orderBook = getOrderBook(listing.id);
  const depth = getLiquidityDepthSeries(orderBook);
  const similar = getSimilarCredits(listing.id);
  const spreadBps =
    orderBook.mid > 0 ? Number(((orderBook.spread / orderBook.mid) * 10000).toFixed(1)) : 0;

  const goNext = () => {
    if (!registryConfirmed) {
      toast.error("Please confirm registry details.");
      return;
    }
    setStep(2);
  };

  const confirmOrder = () => {
    const now = new Date();
    const result = {
      orderId: `ORD-${listing.id}-${String(now.getTime()).slice(-6)}`,
      transferMechanism: `${registry?.code || "Registry"} ledger transfer`,
      settlementTimeline:
        settlementMethod === "escrow_settlement"
          ? "T+2 business days"
          : settlementMethod === "bilateral_netting"
            ? "T+1 business day"
            : "Same day registry confirmation",
      total,
      quantity: finalQty,
      executionPrice,
    };
    setOrderResult(result);
    setStep(3);
    toast.success("Order confirmed.");
  };

  const downloadInvoice = () => {
    if (!orderResult) return;
    const text = [
      `Order ID: ${orderResult.orderId}`,
      `Project: ${project.name}`,
      `Registry: ${registry?.name || "N/A"}`,
      `Quantity: ${orderResult.quantity} t`,
      `Execution Price: ${money(orderResult.executionPrice)}`,
      `Total: ${money(orderResult.total)}`,
      `Settlement: ${orderResult.settlementTimeline}`,
      `Retire On Settlement: ${retireOnSettlement ? "Yes" : "No"}`,
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${orderResult.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate("/marketplace")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${qualityColor}`} />
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{registry?.code || "N/A"}</Badge>
                      <Badge className={scoreClasses[listing.score] || "bg-slate-100 text-slate-700"}>
                        Rating {listing.score}
                      </Badge>
                      <Badge variant="secondary">{project.project_type}</Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
                    <p className="text-slate-600">{project.methodology}</p>
                  </div>
                  <div className={`rounded-xl bg-gradient-to-br px-4 py-3 text-white ${qualityColor}`}>
                    <p className="text-xs">Quality Score</p>
                    <p className="text-3xl font-bold">{listing.quality_score}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-lg border p-3"><p className="text-xs text-slate-500">Registry</p><p className="font-semibold">{registry?.name}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-slate-500">Vintage</p><p className="font-semibold">{listing.vintage_year}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-slate-500">Issuance</p><p className="font-semibold">{listing.issuance_year}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-slate-500">Available</p><p className="font-semibold text-emerald-700">{listing.quantity.toLocaleString()} t</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-slate-500">Country</p><p className="font-semibold">{project.country}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-slate-500">Verification</p><p className="font-semibold">{project.verification_body || registry?.name}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-slate-500">Permanence</p><p className="font-semibold">{project.permanence_duration || "N/A"} years</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-slate-500">Spread</p><p className="font-semibold">{money(orderBook.spread)} ({spreadBps} bps)</p></div>
              </CardContent>
            </Card>

            <Card>
              <Tabs defaultValue="overview">
                <CardHeader className="pb-3">
                  <TabsList className="w-full justify-start bg-slate-100">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="market">Market Data</TabsTrigger>
                    <TabsTrigger value="docs">Documents</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent>
                  <TabsContent value="overview" className="mt-0 space-y-4">
                    <div><h3 className="font-semibold">Project Description</h3><p className="text-slate-700">{project.description}</p></div>
                    <div><h3 className="font-semibold">Additionality Analysis</h3><p className="text-slate-700">{project.additionality_analysis || "Not provided."}</p></div>
                    {project.co_benefits?.length > 0 && <div className="flex flex-wrap gap-2">{project.co_benefits.map((b) => <Badge key={b} variant="secondary"><CheckCircle2 className="mr-1 h-3 w-3" />{b}</Badge>)}</div>}
                    {qualityScore && <div className="grid grid-cols-2 gap-3">{[
                      ["Registry Credibility", qualityScore.registry_credibility],
                      ["Permanence", qualityScore.permanence],
                      ["Methodology", qualityScore.methodology_strength],
                      ["Transparency", qualityScore.transparency],
                    ].map(([k, v]) => <div key={k} className="rounded-lg border p-3"><p className="text-xs text-slate-500">{k}</p><p className="font-semibold">{v}/100</p></div>)}</div>}
                  </TabsContent>

                  <TabsContent value="market" className="mt-0 space-y-5">
                    <div className="h-[240px] rounded-lg border p-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={credit.priceHistory.slice(-90)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis />
                          <Tooltip formatter={(value, name) => [name === "close" ? money(value) : value, name]} />
                          <Area type="monotone" dataKey="close" stroke="#059669" fill="#bbf7d0" />
                          <Line type="monotone" dataKey="volume" stroke="#2563eb" dot={false} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="h-[220px] rounded-lg border p-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={depth}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="bidDepth" stroke="#059669" fill="#bbf7d0" />
                          <Area type="monotone" dataKey="askDepth" stroke="#dc2626" fill="#fecaca" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <Table>
                      <TableHeader><TableRow><TableHead>Bid</TableHead><TableHead className="text-right">Vol</TableHead><TableHead>Ask</TableHead><TableHead className="text-right">Vol</TableHead></TableRow></TableHeader>
                      <TableBody>{orderBook.bids.slice(0, 8).map((bid, i) => {
                        const ask = orderBook.asks[i];
                        return <TableRow key={`${bid.level}-${i}`}><TableCell className="text-emerald-700">{money(bid.price)}</TableCell><TableCell className="text-right">{bid.volume.toLocaleString()}</TableCell><TableCell className="text-rose-700">{money(ask?.price || 0)}</TableCell><TableCell className="text-right">{(ask?.volume || 0).toLocaleString()}</TableCell></TableRow>;
                      })}</TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="docs" className="mt-0">
                    {project.project_documents?.length > 0 ? project.project_documents.map((doc, i) => <a key={`${doc}-${i}`} href={doc} target="_blank" rel="noopener noreferrer" className="mb-2 flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50"><span className="flex items-center gap-2 text-sm font-medium"><FileText className="h-4 w-4 text-slate-400" />Project Document {i + 1}</span></a>) : <p className="text-sm text-slate-600">No documents available.</p>}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Similar Credits</CardTitle></CardHeader>
              <CardContent className="space-y-2">{similar.map((c) => <Link key={c.id} to={`/marketplace/listing/${c.id}`} className="block rounded-lg border p-3 hover:bg-slate-50"><p className="font-semibold">{c.projectName}</p><p className="text-xs text-slate-600">{c.registry} | Rating {c.score} | {c.projectType} | {money(c.currentPrice)}/t</p></Link>)}</CardContent>
            </Card>
          </div>

          <Card className="h-fit lg:sticky lg:top-6">
            <CardHeader><CardTitle>Purchase Credits</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-bold">{money(listing.price_per_tonne)}</p>
              <p className="text-sm text-slate-600">Liquidity {listing.liquidity_score}/100 | Volatility {listing.volatility_score}/100</p>
              <Button className="w-full" onClick={() => setOrderOpen(true)}><ShoppingCart className="mr-2 h-4 w-4" />Initiate Buy Order</Button>
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />Execution can vary based on live spread and market depth.</div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Institutional Buy Flow</DialogTitle></DialogHeader>
            {step === 1 && <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div><Label>Quantity (tons)</Label><Input type="number" min={minPurchase} max={listing.quantity} value={finalQty} onChange={(e) => setQuantity(Number(e.target.value))} /></div>
                <div><Label>Order Type</Label><Select value={orderType} onValueChange={setOrderType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="market">Market</SelectItem><SelectItem value="limit">Limit</SelectItem></SelectContent></Select></div>
              </div>
              {orderType === "limit" && <div><Label>Limit Price (USD)</Label><Input type="number" value={limitPrice} onChange={(e) => setLimitPrice(Number(e.target.value))} /></div>}
              <div className="flex items-center justify-between rounded-lg border p-3"><div><p className="text-sm font-semibold">Registry Confirmation</p><p className="text-xs text-slate-600">{registry?.name} ({registry?.code})</p></div><Switch checked={registryConfirmed} onCheckedChange={setRegistryConfirmed} /></div>
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <p>Estimated execution price: {money(executionPrice)}</p>
                <p>Slippage estimate: {slippagePct}%</p>
                <p>Fee (2.5%): {money(fee)}</p>
                <p className="font-semibold text-emerald-700">Estimated total: {money(total)}</p>
              </div>
              <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOrderOpen(false)}>Cancel</Button><Button onClick={goNext}>Continue</Button></div>
            </div>}

            {step === 2 && <div className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><p className="font-semibold">Risk Disclosure</p><p>Market volatility and spread shifts may impact final execution and settlement timing.</p></div>
              <div className="rounded-lg border p-3 text-sm"><p className="font-semibold">Volatility Warning</p><p>Volatility score {listing.volatility_score}/100 with liquidity {listing.liquidity_score}/100.</p></div>
              <div><Label>Settlement Method</Label><Select value={settlementMethod} onValueChange={setSettlementMethod}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="registry_transfer">Registry Transfer Settlement</SelectItem><SelectItem value="bilateral_netting">Bilateral Netting</SelectItem><SelectItem value="escrow_settlement">Escrow Settlement</SelectItem></SelectContent></Select></div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"><p className="font-semibold">ESG Impact Summary</p><p>{finalQty.toLocaleString()} tCO2e linked to {project.project_type} in {project.country}.</p></div>
              <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button onClick={confirmOrder}>Confirm Order</Button></div>
            </div>}

            {step === 3 && orderResult && <div className="space-y-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3"><p className="font-semibold text-emerald-900">Order ID: {orderResult.orderId}</p><p className="text-sm text-emerald-800">Registry transfer mechanism: {orderResult.transferMechanism}</p><p className="text-sm text-emerald-800">Settlement timeline: {orderResult.settlementTimeline}</p></div>
              <div className="rounded-lg border p-3"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Retirement Option</p><p className="text-xs text-slate-600">Retire credits immediately after settlement.</p></div><Switch checked={retireOnSettlement} onCheckedChange={setRetireOnSettlement} /></div></div>
              <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={downloadInvoice}><Receipt className="mr-2 h-4 w-4" />Download Invoice</Button><Button onClick={() => { setOrderOpen(false); setStep(1); setOrderResult(null); }}>Done</Button></div>
            </div>}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
