import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  Circle,
  CreditCard,
  ShoppingCart,
  Download,
  FileCheck2,
  Landmark,
  Lock,
  ShieldCheck,
  Truck,
} from "lucide-react";
import MarketplaceNavbar from "../components/MarketplaceNavbar";
import "../styles/marketplace1.css";

const STEP_MIN = 1;
const STEP_MAX = 6;

const STEPS = [
  { id: 1, title: "Review Cart", Icon: ShoppingCart },
  { id: 2, title: "Contact & Billing", Icon: Building2 },
  { id: 3, title: "Payment Method", Icon: CreditCard },
  { id: 4, title: "Delivery Method", Icon: Truck },
  { id: 5, title: "Review & Place Order", Icon: FileCheck2 },
  { id: 6, title: "Transaction Confirmed", Icon: BadgeCheck },
];

function clampStep(value) {
  const parsed = Number.parseInt(String(value || STEP_MIN), 10);
  if (Number.isNaN(parsed)) return STEP_MIN;
  return Math.min(Math.max(parsed, STEP_MIN), STEP_MAX);
}

function CheckoutSidebar({ currentStep }) {
  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-80 flex-col border-r border-[#dde4dd] bg-[#f4f4f0] px-5 py-8 lg:flex">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Checkout Status
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-700">
          CarbonPositive Marketplace
        </p>
      </div>

      <div className="relative flex-1">
        <div className="absolute left-6 top-4 bottom-4 w-[2px] bg-[#d9e1d9]" />
        <div className="space-y-5">
          {STEPS.map((step) => {
            const done = step.id < currentStep;
            const active = step.id === currentStep;
            return (
              <div key={step.id} className="relative flex items-start gap-4">
                <div
                  className={`relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#f4f4f0] ${
                    done
                      ? "bg-[#e6f6ea] text-[#0f7a3f]"
                      : active
                        ? "bg-[#005129] text-white shadow-lg shadow-[#005129]/25"
                        : "bg-[#dfe3df] text-slate-400"
                  }`}
                >
                  {done ? (
                    <Check className="h-5 w-5" />
                  ) : active ? (
                    <step.Icon className="h-5 w-5" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                <div className="pt-2">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                      active ? "text-[#005129]" : "text-slate-400"
                    }`}
                  >
                    Step {step.id}
                  </p>
                  <p
                    className={`text-sm font-bold ${
                      active ? "text-[#005129]" : done ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-[#dce5dc] bg-white p-4">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
          <ShieldCheck className="h-4 w-4 text-[#005129]" />
          Secure Checkout
        </div>
        <p className="text-xs leading-relaxed text-slate-600">
          PCI-compliant payment rails and immutable registry audit trail.
        </p>
      </div>
    </aside>
  );
}

function CartStep() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="marketplace1-headline text-3xl font-black tracking-tight text-[#1a1c1a]">
            Review Your Selection
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Confirm quantities and pricing before proceeding.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#dce4dc] bg-white p-6 shadow-sm">
        <div className="grid grid-cols-12 border-b border-[#e8eee8] pb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          <div className="col-span-6">Asset Details</div>
          <div className="col-span-2 text-center">Vintage</div>
          <div className="col-span-2 text-right">Price/Ton</div>
          <div className="col-span-2 text-right">Subtotal</div>
        </div>
        <div className="grid grid-cols-12 items-center py-5 text-sm">
          <div className="col-span-6 flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=500"
              alt="Project"
              className="h-20 w-24 rounded-lg object-cover"
            />
            <div>
              <p className="font-bold text-slate-900">Amazon Biodiversity Preservation</p>
              <p className="mt-1 text-xs text-slate-500">VERRA • VCS Project 1421</p>
              <div className="mt-3 inline-flex items-center rounded-md border border-[#d6ded6] bg-[#f8faf8]">
                <button className="px-3 py-1 text-slate-500">-</button>
                <span className="px-2 text-xs font-semibold">500</span>
                <button className="px-3 py-1 text-slate-500">+</button>
              </div>
            </div>
          </div>
          <div className="col-span-2 text-center font-medium text-slate-600">2023</div>
          <div className="col-span-2 text-right font-semibold text-slate-900">$18.50</div>
          <div className="col-span-2 text-right font-bold text-[#005129]">$9,250.00</div>
        </div>
      </div>
    </div>
  );
}

function BillingStep() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="marketplace1-headline text-3xl font-black tracking-tight text-[#1a1c1a]">
            Contact & Billing
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Confirm your institutional identity and billing nexus.
          </p>
        </div>
      </div>
      <div className="grid gap-6">
        <section className="rounded-2xl border border-[#dbe4db] bg-white p-6">
          <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
            Institutional Representative
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input className="rounded-lg border border-[#dbe4db] bg-[#f6f9f6] p-3 text-sm" defaultValue="Alexander von Humboldt" />
            <input className="rounded-lg border border-[#dbe4db] bg-[#f6f9f6] p-3 text-sm" defaultValue="alexander@ecology.institution.org" />
            <input className="rounded-lg border border-[#dbe4db] bg-[#f6f9f6] p-3 text-sm" placeholder="Company (Optional)" />
            <input className="rounded-lg border border-[#dbe4db] bg-[#f6f9f6] p-3 text-sm" placeholder="VAT / Tax ID (Optional)" />
          </div>
        </section>
        <section className="rounded-2xl border border-[#dbe4db] bg-white p-6">
          <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
            Billing Nexus
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input className="rounded-lg border border-[#dbe4db] bg-[#f6f9f6] p-3 text-sm md:col-span-2" defaultValue="Switzerland" />
            <input className="rounded-lg border border-[#dbe4db] bg-[#f6f9f6] p-3 text-sm md:col-span-2" placeholder="Street Address" />
            <input className="rounded-lg border border-[#dbe4db] bg-[#f6f9f6] p-3 text-sm" placeholder="City" />
            <input className="rounded-lg border border-[#dbe4db] bg-[#f6f9f6] p-3 text-sm" placeholder="Postal Code" />
          </div>
        </section>
      </div>
    </div>
  );
}

function PaymentStep() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="marketplace1-headline text-3xl font-black tracking-tight text-[#1a1c1a]">
          Payment Method
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Select your preferred settlement method.
        </p>
      </div>
      <section className="rounded-2xl border border-[#dbe4db] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-[#005129]" />
          <h3 className="font-bold">Corporate Card</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input className="rounded-lg border border-[#dbe4db] bg-[#f6f9f6] p-3 text-sm md:col-span-2" defaultValue="INSTITUTIONAL PARTNERS GMBH" />
          <input className="rounded-lg border border-[#dbe4db] bg-[#f6f9f6] p-3 text-sm md:col-span-2" placeholder="•••• •••• •••• ••••" />
          <input className="rounded-lg border border-[#dbe4db] bg-[#f6f9f6] p-3 text-sm" placeholder="MM / YY" />
          <input className="rounded-lg border border-[#dbe4db] bg-[#f6f9f6] p-3 text-sm" placeholder="CVC" />
        </div>
      </section>
      <section className="rounded-2xl border-l-4 border-[#005129] border border-[#dbe4db] bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5 text-[#005129]" />
            <h3 className="font-bold">Bank Wire Transfer</h3>
          </div>
          <span className="rounded-full bg-[#e9f6ec] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f6f39]">
            Selected
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <p><span className="text-slate-500">IBAN:</span> GB89 SCBL 0044 0012 3456 78</p>
          <p><span className="text-slate-500">SWIFT:</span> SCBLGB2LXXX</p>
          <p><span className="text-slate-500">Beneficiary:</span> Institutional Ecology Registry Ltd.</p>
          <p><span className="text-slate-500">Bank:</span> Standard Chartered</p>
        </div>
      </section>
    </div>
  );
}

function DeliveryStep() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="marketplace1-headline text-3xl font-black tracking-tight text-[#1a1c1a]">
          Delivery Method
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Choose how you want to receive retirement documentation.
        </p>
      </div>
      <section className="rounded-2xl border-2 border-[#005129] bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileCheck2 className="h-5 w-5 text-[#005129]" />
            <h3 className="font-bold">Digital Retirement Certificate</h3>
          </div>
          <span className="font-bold text-[#005129]">Free</span>
        </div>
        <p className="text-sm text-slate-600">
          Instant issuance upon settlement with unique serial references.
        </p>
      </section>
      <section className="rounded-2xl border border-[#dbe4db] bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-slate-500" />
            <h3 className="font-bold">Physical Commemorative Certificate</h3>
          </div>
          <span className="font-bold">$75.00</span>
        </div>
        <p className="text-sm text-slate-600">
          Embossed recycled print delivered within 14 business days.
        </p>
      </section>
    </div>
  );
}

function ReviewStep() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="marketplace1-headline text-3xl font-black tracking-tight text-[#1a1c1a]">
          Review & Place Order
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Verify all details before final submission.
        </p>
      </div>
      <section className="rounded-2xl border border-[#dbe4db] bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
          Selection Summary
        </h3>
        <div className="space-y-2 text-sm text-slate-700">
          <p><span className="font-semibold">Project:</span> Amazon REDD+ Preservation</p>
          <p><span className="font-semibold">Credits:</span> 12,450 tCO2e</p>
          <p><span className="font-semibold">Entity:</span> Global Climate Trust</p>
          <p><span className="font-semibold">Payment:</span> Bank Wire Transfer</p>
          <p><span className="font-semibold">Delivery:</span> Digital Certificate</p>
        </div>
      </section>
      <div className="space-y-3 rounded-2xl border border-[#dbe4db] bg-white p-6">
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[#bfc9be] text-[#005129]" />
          I agree to the Master Carbon Credit Purchase Agreement.
        </label>
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[#bfc9be] text-[#005129]" />
          I confirm institutional information accuracy for reporting.
        </label>
      </div>
    </div>
  );
}

function SuccessStep({ rootPath }) {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[#dbe4db] bg-white p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#e9f6ec] text-[#0e7a3e]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h2 className="marketplace1-headline text-3xl font-black tracking-tight text-[#1a1c1a]">
              Transaction Confirmed
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your purchase is recorded on the registry ledger.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[#e2e9e2] bg-[#f8faf8] p-4 text-sm">
            <p><span className="text-slate-500">Transaction ID:</span> TXN-99824-CP</p>
            <p className="mt-1"><span className="text-slate-500">Amount:</span> $250,245.00</p>
            <p className="mt-1"><span className="text-slate-500">Method:</span> Bank Transfer</p>
          </div>
          <div className="rounded-xl bg-[#1a6b3c] p-4 text-sm text-white">
            <p className="text-xs uppercase tracking-[0.14em] text-white/70">Impact Summary</p>
            <p className="mt-2 text-3xl font-black">12,450</p>
            <p className="text-xs text-white/80">tCO2e retired permanently</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbe4db] bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-[#f6faf7]">
            <Download className="h-4 w-4" />
            Download Receipt
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbe4db] bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-[#f6faf7]">
            <Lock className="h-4 w-4" />
            View on Registry
          </button>
          <Link
            to={`${rootPath}/portfolio`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbe4db] bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-[#f6faf7]"
          >
            Go to Portfolio
          </Link>
        </div>
      </div>

      <div className="text-center">
        <Link
          to={rootPath}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#005129]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to CarbonPositive Marketplace
        </Link>
      </div>
    </div>
  );
}

function StepContent({ step, rootPath }) {
  if (step === 1) return <CartStep />;
  if (step === 2) return <BillingStep />;
  if (step === 3) return <PaymentStep />;
  if (step === 4) return <DeliveryStep />;
  if (step === 5) return <ReviewStep />;
  return <SuccessStep rootPath={rootPath} />;
}

export default function MarketplaceCheckoutPage() {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const rootPath = location.pathname.startsWith("/marketplace1")
    ? "/marketplace1"
    : "/marketplace";

  const initialStep = useMemo(() => clampStep(stepId), [stepId]);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState("next");

  useEffect(() => {
    const incoming = clampStep(stepId);
    setDirection(incoming >= currentStep ? "next" : "prev");
    setCurrentStep(incoming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId]);

  const goToStep = (nextStep) => {
    const target = clampStep(nextStep);
    setDirection(target >= currentStep ? "next" : "prev");
    navigate(`${rootPath}/checkout/${target}`);
  };

  const canPrev = currentStep > STEP_MIN;
  const canNext = currentStep < STEP_MAX;

  return (
    <div className="marketplace1-root min-h-screen bg-[#faf9f5] text-[#1a1c1a]">
      <MarketplaceNavbar rootPath={rootPath} activeItem="buy" />
      <div className="mx-auto flex max-w-screen-2xl pt-20">
        <CheckoutSidebar currentStep={currentStep} />

        <main className="min-h-[calc(100vh-5rem)] flex-1 px-5 py-8 sm:px-8 lg:px-12">
          <Link
            to={`${rootPath}/browse`}
            className="mb-5 inline-flex items-center text-[#005129] hover:text-[#0f6f39]"
            aria-label="Back to browse"
            title="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial={
                direction === "next"
                  ? { opacity: 0, y: 44 }
                  : { opacity: 0, y: -44 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                direction === "next"
                  ? { opacity: 0, y: -28 }
                  : { opacity: 0, y: 28 }
              }
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto w-full max-w-5xl"
            >
              <StepContent step={currentStep} rootPath={rootPath} />
            </motion.div>
          </AnimatePresence>

          {currentStep < STEP_MAX && (
            <div className="mx-auto mt-10 flex w-full max-w-5xl items-center justify-between rounded-2xl border border-[#dde5dd] bg-white p-5">
              <button
                type="button"
                onClick={() => canPrev && goToStep(currentStep - 1)}
                disabled={!canPrev}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                  canPrev
                    ? "text-slate-600 hover:bg-[#f3f7f3]"
                    : "cursor-not-allowed text-slate-300"
                }`}
              >
                Previous
              </button>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Total Due
                </p>
                <p className="marketplace1-headline text-2xl font-black text-[#005129]">
                  $250,245.00
                </p>
              </div>
              <button
                type="button"
                onClick={() => canNext && goToStep(currentStep + 1)}
                disabled={!canNext}
                className="inline-flex items-center gap-2 rounded-lg bg-[#005129] px-5 py-3 text-sm font-bold text-white hover:brightness-110"
              >
                {currentStep === 5 ? "Place Order" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
