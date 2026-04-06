import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Globe2,
  Info,
  Leaf,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

const SIGNUP_STEPS = [
  "use-platform",
  "type-user",
  "account",
  "organization",
  "verify",
  "success",
];

const COUNTRY_OPTIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "Australia",
];

const ROLE_OPTIONS = [
  {
    id: "buyer",
    label: "Buyer",
    description: "I want to offset",
    icon: ShoppingCart,
  },
  {
    id: "seller",
    label: "Seller",
    description: "I have carbon credits",
    icon: Leaf,
  },
  {
    id: "both",
    label: "Both",
    description: "Trade and consume",
    icon: Users,
  },
];

const BUSINESS_TYPES = ["Individual", "LLC", "Corporation", "NGO", "Government"];

const GOOGLE_ICON = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

function getStepMeta(view) {
  const current = SIGNUP_STEPS.findIndex((item) => item === view) + 1;
  return {
    current,
    total: SIGNUP_STEPS.length,
    percentage: `${Math.round((Math.max(1, current) / SIGNUP_STEPS.length) * 100)}%`,
  };
}

function formatCountdown(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function MarketplaceAuthModal({
  open,
  view,
  onClose,
  onNavigate,
  onLogin,
  onSignupComplete,
}) {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(54);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [platformConsent, setPlatformConsent] = useState({
    useOfPlatform: true,
    marketNews: true,
    termsAccepted: true,
  });

  const [userType, setUserType] = useState("company");

  const [signupAccount, setSignupAccount] = useState({
    role: "buyer",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [organizationProfile, setOrganizationProfile] = useState({
    country: "United States",
    phone: "",
    companyName: "",
    businessType: "Corporation",
    registrationNumber: "",
  });

  const [otp, setOtp] = useState(["4", "8", "", "", "", ""]);
  const otpRefs = useRef([]);

  const stepMeta = useMemo(() => getStepMeta(view), [view]);
  const otpValue = otp.join("");
  const canVerify = otpValue.length === 6 && !otpValue.includes("");
  const canContinuePlatform = platformConsent.termsAccepted;
  const canContinueAccount =
    signupAccount.fullName.trim().length >= 2 &&
    signupAccount.email.includes("@") &&
    signupAccount.password.length >= 6 &&
    signupAccount.password === signupAccount.confirmPassword;
  const canContinueOrganization =
    organizationProfile.country &&
    organizationProfile.phone.trim().length >= 7 &&
    organizationProfile.companyName.trim().length >= 2;

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (view !== "verify") return;
    setResendCountdown(54);
  }, [view]);

  useEffect(() => {
    if (view !== "verify" || resendCountdown <= 0) return undefined;
    const timer = setTimeout(() => {
      setResendCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearTimeout(timer);
  }, [view, resendCountdown]);

  if (!open) return null;

  const goToSignupStep = (step) => {
    if (!step || step === "use-platform") {
      onNavigate("/signup");
      return;
    }
    onNavigate(`/signup/${step}`);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (!loginForm.email || !loginForm.password) return;
    onLogin({
      isAuthenticated: true,
      name: loginForm.email.split("@")[0],
      email: loginForm.email,
      rememberMe,
      source: "marketplace-login",
      loggedInAt: new Date().toISOString(),
    });
  };

  const handleAccountContinue = () => {
    if (!canContinueAccount) return;
    const skipOrganization =
      userType === "individual" && signupAccount.role === "buyer";
    goToSignupStep(skipOrganization ? "verify" : "organization");
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (event) => {
    event.preventDefault();
    if (!canVerify) return;
    goToSignupStep("success");
  };

  const handleSignupSuccess = () => {
    const profileName =
      signupAccount.fullName.trim() ||
      organizationProfile.companyName.trim() ||
      "Marketplace User";
    onSignupComplete({
      isAuthenticated: true,
      name: profileName,
      email: signupAccount.email,
      rememberMe: true,
      source: "marketplace-signup",
      userType,
      accountRole: signupAccount.role,
      profile: organizationProfile,
      createdAt: new Date().toISOString(),
    });
  };

  const renderLogin = () => (
    <div className="marketplace1-auth-dialog relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-28px_rgba(25,28,27,0.2)]">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label="Close login modal"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="p-7 sm:p-10">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#005129] text-white shadow-lg shadow-[#005129]/20">
            <Leaf className="h-7 w-7" />
          </div>
          <h2 className="marketplace1-auth-headline text-3xl font-extrabold tracking-tight text-slate-900">
            Carbon Positive
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Welcome back to the marketplace
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLoginSubmit}>
          <label className="block">
            <span className="mb-2 block px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Email Address
            </span>
            <span className="group relative block">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#005129]" />
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="curator@carbonpositive.com"
                className="w-full rounded-xl border border-transparent bg-[#e6e9e7] py-3.5 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#005129]/30 focus:bg-white focus:shadow-[0_0_0_1px_#005129]"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Password
            </span>
            <span className="group relative block">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#005129]" />
              <input
                type={showLoginPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="••••••••"
                className="w-full rounded-xl border border-transparent bg-[#e6e9e7] py-3.5 pl-11 pr-12 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#005129]/30 focus:bg-white focus:shadow-[0_0_0_1px_#005129]"
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-[#005129]"
                aria-label="Toggle password visibility"
              >
                {showLoginPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </span>
          </label>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#005129] focus:ring-[#005129]"
              />
              Remember me
            </label>
            <button
              type="button"
              className="font-semibold text-[#005129] transition-colors hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-[#005129] py-3.5 text-base font-bold text-white shadow-lg shadow-[#005129]/20 transition-all hover:bg-[#0d5c35] active:scale-[0.99]"
          >
            Log In
          </button>
        </form>

        <div className="relative my-8">
          <div className="border-t border-[#bfc9be]/50" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Or continue with
          </span>
        </div>

        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl bg-[#eceeec] py-3 text-sm font-bold text-slate-500 opacity-70"
        >
          {GOOGLE_ICON}
          Google
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          New to Carbon Positive?
          <button
            type="button"
            onClick={() => goToSignupStep("use-platform")}
            className="ml-1 font-bold text-[#005129] transition-colors hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );

  const renderUsePlatform = () => (
    <div className="marketplace1-auth-dialog mx-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="marketplace1-auth-headline text-xl font-extrabold text-slate-900">
          Sign Up
        </h3>
        <span className="text-xs font-bold tracking-widest text-slate-500">
          {stepMeta.current}/{stepMeta.total}
        </span>
      </div>

      <h4 className="marketplace1-auth-headline text-lg font-bold text-[#005129]">
        Use of the Platform
      </h4>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        By default, your account may create and trade in the platform while
        preserving full traceability and institutional-grade transparency.
      </p>

      <div className="mt-5 space-y-3">
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={platformConsent.useOfPlatform}
            onChange={(event) =>
              setPlatformConsent((prev) => ({
                ...prev,
                useOfPlatform: event.target.checked,
              }))
            }
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#005129] focus:ring-[#005129]"
          />
          <span>
            I will use this platform to create and trade carbon credits for
            sustainable projects.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={platformConsent.marketNews}
            onChange={(event) =>
              setPlatformConsent((prev) => ({
                ...prev,
                marketNews: event.target.checked,
              }))
            }
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#005129] focus:ring-[#005129]"
          />
          <span>I want to be updated with market climate news and offers.</span>
        </label>
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={platformConsent.termsAccepted}
            onChange={(event) =>
              setPlatformConsent((prev) => ({
                ...prev,
                termsAccepted: event.target.checked,
              }))
            }
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#005129] focus:ring-[#005129]"
          />
          <span>I agree to Carbon Positive terms and conditions.</span>
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          disabled={!canContinuePlatform}
          onClick={() => goToSignupStep("type-user")}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1d8cf2] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-[#1578d4] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderTypeUser = () => (
    <div className="marketplace1-auth-dialog mx-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="marketplace1-auth-headline text-xl font-extrabold text-slate-900">
          Sign Up
        </h3>
        <span className="text-xs font-bold tracking-widest text-slate-500">
          {stepMeta.current}/{stepMeta.total}
        </span>
      </div>

      <h4 className="marketplace1-auth-headline text-lg font-bold text-[#005129]">
        Type of User
      </h4>
      <p className="mt-3 text-sm text-slate-500">
        Will you use the platform for your own individual needs or as a
        representative of your company?
      </p>

      <div className="mt-5 space-y-2.5">
        <button
          type="button"
          onClick={() => setUserType("individual")}
          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
            userType === "individual"
              ? "border-[#1d8cf2] bg-[#1d8cf2]/5"
              : "border-[#dbe1db] bg-white hover:bg-[#f4f7f4]"
          }`}
        >
          {userType === "individual" ? (
            <CheckCircle2 className="h-5 w-5 text-[#1d8cf2]" />
          ) : (
            <Circle className="h-5 w-5 text-slate-400" />
          )}
          <span className="text-sm font-medium text-slate-700">
            I am registering as an individual
          </span>
        </button>

        <button
          type="button"
          onClick={() => setUserType("company")}
          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
            userType === "company"
              ? "border-[#1d8cf2] bg-[#1d8cf2]/5"
              : "border-[#dbe1db] bg-white hover:bg-[#f4f7f4]"
          }`}
        >
          {userType === "company" ? (
            <CheckCircle2 className="h-5 w-5 text-[#1d8cf2]" />
          ) : (
            <Circle className="h-5 w-5 text-slate-400" />
          )}
          <span className="text-sm font-medium text-slate-700">
            I am registering as a company
          </span>
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToSignupStep("use-platform")}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => goToSignupStep("account")}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1d8cf2] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-[#1578d4]"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
  const renderAccountSetup = () => (
    <div className="marketplace1-auth-dialog mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#e2e6e2] px-5 py-4 sm:px-6">
        <div>
          <h3 className="marketplace1-auth-headline text-xl font-extrabold text-[#005129]">
            Account Setup
          </h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Step {stepMeta.current} of {stepMeta.total}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-5 pb-6 pt-5 sm:px-6">
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#e6e9e7]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#005129] to-[#1a6b3c]"
            style={{ width: stepMeta.percentage }}
          />
        </div>

        <div className="mb-5">
          <h4 className="marketplace1-auth-headline text-xl font-bold text-slate-900">
            Create your account
          </h4>
          <p className="mt-2 text-sm text-slate-500">
            Join the curated marketplace for high-integrity carbon offsets.
          </p>
        </div>

        <div className="mb-6">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Select your role
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {ROLE_OPTIONS.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() =>
                  setSignupAccount((prev) => ({ ...prev, role: role.id }))
                }
                className={`relative rounded-xl border p-4 text-left transition-all ${
                  signupAccount.role === role.id
                    ? "border-[#005129]/30 bg-[#a5f4b8]/25"
                    : "border-transparent bg-[#f2f4f2] hover:bg-[#e6e9e7]"
                }`}
              >
                <role.icon
                  className={`mb-2 h-5 w-5 ${
                    signupAccount.role === role.id ? "text-[#005129]" : "text-slate-500"
                  }`}
                />
                <p className="marketplace1-auth-headline text-sm font-bold text-slate-900">
                  {role.label}
                </p>
                <p className="mt-1 text-xs text-slate-500">{role.description}</p>
                {signupAccount.role === role.id && (
                  <span className="absolute right-3 top-3 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#005129] text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Full Name
            </span>
            <input
              type="text"
              value={signupAccount.fullName}
              onChange={(event) =>
                setSignupAccount((prev) => ({ ...prev, fullName: event.target.value }))
              }
              placeholder="John Doe"
              className="w-full rounded-xl border border-transparent bg-[#e6e9e7] px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#005129]/30 focus:bg-white focus:shadow-[0_0_0_1px_#005129]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Email Address
            </span>
            <input
              type="email"
              value={signupAccount.email}
              onChange={(event) =>
                setSignupAccount((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="john@example.com"
              className="w-full rounded-xl border border-transparent bg-[#e6e9e7] px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#005129]/30 focus:bg-white focus:shadow-[0_0_0_1px_#005129]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Password
            </span>
            <span className="relative block">
              <input
                type={showSignupPassword ? "text" : "password"}
                value={signupAccount.password}
                onChange={(event) =>
                  setSignupAccount((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                placeholder="••••••••"
                className="w-full rounded-xl border border-transparent bg-[#e6e9e7] px-4 py-3 pr-11 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#005129]/30 focus:bg-white focus:shadow-[0_0_0_1px_#005129]"
              />
              <button
                type="button"
                onClick={() => setShowSignupPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-[#005129]"
              >
                {showSignupPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Confirm Password
            </span>
            <input
              type="password"
              value={signupAccount.confirmPassword}
              onChange={(event) =>
                setSignupAccount((prev) => ({
                  ...prev,
                  confirmPassword: event.target.value,
                }))
              }
              placeholder="••••••••"
              className="w-full rounded-xl border border-transparent bg-[#e6e9e7] px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#005129]/30 focus:bg-white focus:shadow-[0_0_0_1px_#005129]"
            />
          </label>
        </div>

        <div className="my-5 border-t border-[#dbe1db]" />

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#cdd8cd] bg-[#f2f4f2] px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-[#e6e9e7]"
        >
          {GOOGLE_ICON}
          Sign up with Google
        </button>

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleAccountContinue}
            disabled={!canContinueAccount}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#005129] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#0d5c35] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Verification
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-center text-sm text-slate-500">
            Already have an account?
            <button
              type="button"
              onClick={() => onNavigate("/login")}
              className="ml-1 font-bold text-[#005129] transition-colors hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
  const renderOrganizationProfile = () => (
    <div className="marketplace1-auth-dialog mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="px-5 pb-6 pt-6 sm:px-6 sm:pt-7">
        <h3 className="marketplace1-auth-headline text-xl font-extrabold text-[#005129]">
          Organization Profile
        </h3>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Step {stepMeta.current} of {stepMeta.total}
        </p>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e6e9e7]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#005129] to-[#1a6b3c]"
            style={{ width: stepMeta.percentage }}
          />
        </div>

        <form className="mt-5 space-y-4" onSubmit={(event) => event.preventDefault()}>
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Country of Registry
            </span>
            <span className="relative block">
              <Globe2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={organizationProfile.country}
                onChange={(event) =>
                  setOrganizationProfile((prev) => ({
                    ...prev,
                    country: event.target.value,
                  }))
                }
                className="w-full appearance-none rounded-xl border border-transparent bg-[#e6e9e7] py-3 pl-11 pr-10 text-sm outline-none transition-all focus:border-[#005129]/30 focus:bg-white focus:shadow-[0_0_0_1px_#005129]"
              >
                {COUNTRY_OPTIONS.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Phone Number
            </span>
            <span className="relative block">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={organizationProfile.phone}
                onChange={(event) =>
                  setOrganizationProfile((prev) => ({
                    ...prev,
                    phone: event.target.value,
                  }))
                }
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border border-transparent bg-[#e6e9e7] py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#005129]/30 focus:bg-white focus:shadow-[0_0_0_1px_#005129]"
              />
            </span>
          </label>

          <div className="rounded-xl bg-[#c7ebd2]/35 p-4 text-xs text-[#2e4d3b]">
            <p className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#005129]" />
              You are registering as a seller or company profile. Additional
              details are required for institutional verification.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Legal Company Name
            </span>
            <span className="relative block">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={organizationProfile.companyName}
                onChange={(event) =>
                  setOrganizationProfile((prev) => ({
                    ...prev,
                    companyName: event.target.value,
                  }))
                }
                placeholder="EcoSphere Solutions"
                className="w-full rounded-xl border border-transparent bg-[#e6e9e7] py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#005129]/30 focus:bg-white focus:shadow-[0_0_0_1px_#005129]"
              />
            </span>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Business Type
              </span>
              <select
                value={organizationProfile.businessType}
                onChange={(event) =>
                  setOrganizationProfile((prev) => ({
                    ...prev,
                    businessType: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-transparent bg-[#e6e9e7] px-4 py-3 text-sm outline-none transition-all focus:border-[#005129]/30 focus:bg-white focus:shadow-[0_0_0_1px_#005129]"
              >
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Reg. Number
              </span>
              <input
                type="text"
                value={organizationProfile.registrationNumber}
                onChange={(event) =>
                  setOrganizationProfile((prev) => ({
                    ...prev,
                    registrationNumber: event.target.value,
                  }))
                }
                placeholder="ID-8829910"
                className="w-full rounded-xl border border-transparent bg-[#e6e9e7] px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#005129]/30 focus:bg-white focus:shadow-[0_0_0_1px_#005129]"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => goToSignupStep("account")}
              className="w-full rounded-xl bg-[#e6e9e7] px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-[#d8dad9] sm:w-auto"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => canContinueOrganization && goToSignupStep("verify")}
              disabled={!canContinueOrganization}
              className="w-full rounded-xl bg-[#005129] px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#0d5c35] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue to Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderVerifyEmail = () => (
    <div className="marketplace1-auth-dialog relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#005129] text-white">
          <Leaf className="h-5 w-5" />
        </div>
        <span className="marketplace1-auth-headline text-xl font-bold text-[#005129]">
          Carbon Positive
        </span>
      </div>

      <div className="mb-6">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="marketplace1-auth-headline text-xl font-extrabold text-slate-900">
            Verify your email
          </h2>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#005129]">
            Step {stepMeta.current} of {stepMeta.total}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#e6e9e7]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#005129] to-[#1a6b3c]"
            style={{ width: stepMeta.percentage }}
          />
        </div>
        <p className="mt-5 text-sm leading-relaxed text-slate-500">
          We sent a 6-digit verification code to{" "}
          <span className="font-semibold text-slate-700">
            {signupAccount.email || "curator@example.com"}
          </span>
          . Enter it below to activate your marketplace account.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleVerify}>
        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={`otp-${index}`}
              ref={(element) => {
                otpRefs.current[index] = element;
              }}
              value={digit}
              onChange={(event) => handleOtpChange(index, event.target.value)}
              onKeyDown={(event) => handleOtpKeyDown(index, event)}
              maxLength={1}
              className="h-14 w-12 rounded-xl border border-transparent bg-[#e6e9e7] text-center text-xl font-bold outline-none transition-all placeholder:text-slate-400 focus:border-[#005129]/30 focus:bg-white focus:shadow-[0_0_0_1px_#005129] sm:h-16 sm:w-14"
              placeholder="•"
              inputMode="numeric"
            />
          ))}
        </div>

        <div className="space-y-5">
          <button
            type="submit"
            disabled={!canVerify}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all ${
              canVerify
                ? "bg-[#16a34a] text-white shadow-lg shadow-[#16a34a]/25 hover:bg-[#15803d]"
                : "cursor-not-allowed bg-slate-300 text-slate-500"
            }`}
          >
            Verify Email
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="space-y-2 text-center">
            <p className="text-sm text-slate-500">Did not receive the code?</p>
            <button
              type="button"
              onClick={() => setResendCountdown(54)}
              disabled={resendCountdown > 0}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#005129] transition-colors hover:text-[#1a6b3c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Resend code in
              <span className="tabular-nums">{formatCountdown(resendCountdown)}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const renderSuccess = () => (
    <div className="marketplace1-auth-dialog relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#bfc9be]/30 bg-white shadow-2xl">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="p-7 text-center sm:p-10">
        <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-[#005129]/10">
          <CheckCircle2 className="h-14 w-14 text-[#005129]" />
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[#89d89e]" />
        </div>

        <h3 className="marketplace1-auth-headline text-3xl font-extrabold tracking-tight text-[#005129]">
          Welcome aboard!
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
          Your journey towards a carbon-positive future starts here. Your account
          is now ready to explore and trade verified climate projects.
        </p>

        <div className="mt-8 h-2 overflow-hidden rounded-full bg-[#e6e9e7]">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-[#005129] to-[#1a6b3c]" />
        </div>

        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={handleSignupSuccess}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#005129] py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#0d5c35]"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleSignupSuccess}
            className="w-full rounded-xl bg-[#eef2ee] py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-[#e6e9e7]"
          >
            Explore Marketplace first
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 border-t border-[#dbe1db] pt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#005129]" />
            Identity Verified
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-[#005129]" />
            Account Secured
          </span>
        </div>
      </div>

      <Leaf className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 text-[#005129]/5" />
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case "login":
        return renderLogin();
      case "use-platform":
        return renderUsePlatform();
      case "type-user":
        return renderTypeUser();
      case "account":
        return renderAccountSetup();
      case "organization":
        return renderOrganizationProfile();
      case "verify":
        return renderVerifyEmail();
      case "success":
        return renderSuccess();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="marketplace1-auth-backdrop absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="marketplace1-no-scrollbar relative z-[1] flex max-h-[94vh] w-full items-center justify-center overflow-y-auto py-2 sm:py-4">
        {renderContent()}
      </div>
    </div>
  );
}
