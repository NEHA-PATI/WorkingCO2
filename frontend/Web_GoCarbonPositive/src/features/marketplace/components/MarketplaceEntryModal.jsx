import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
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
  Textarea,
} from "./ui/basic-ui";
import { CheckCircle2, Lock, UserPlus } from "lucide-react";
import { getProjectTypes, registries } from "../config/mockMarketplaceData";

const ratingOptions = ["AAA", "AA", "A", "BBB", "BB"];

const emptyDetails = {
  project_name: "",
  project_description: "",
  project_type: "",
  registry: "",
  registry_project_id: "",
  methodology_code: "",
  methodology_description: "",
  validation_body: "",
  verification_body: "",
  country: "",
  region: "",
  vintage_years: "",
  total_credits: "",
  available_credits: "",
  price_min: "",
  price_max: "",
  credit_rating: "",
};

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function MarketplaceEntryModal({
  open,
  onOpenChange,
  onComplete,
  requestedTab = "overview",
  requireOnboarding = true,
}) {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("auth");
  const [errors, setErrors] = useState({});

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    password: "",
    agree: false,
  });
  const [details, setDetails] = useState(emptyDetails);

  const projectTypes = useMemo(() => getProjectTypes(), []);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setStep("auth");
  }, [open, requestedTab]);

  const authTitle =
    mode === "login" ? "Login to Continue" : "Signup to Continue";

  const handleAuthSubmit = () => {
    const nextErrors = {};

    if (mode === "login") {
      if (!isEmail(loginForm.email)) nextErrors.email = "Enter a valid email.";
      if ((loginForm.password || "").trim().length < 6) {
        nextErrors.password = "Password must be at least 6 characters.";
      }

      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;

      onComplete?.({
        mode: "login",
        requestedTab,
        onboardingCompleted: false,
        account: {
          name: loginForm.email.split("@")[0],
          email: loginForm.email,
        },
      });
      return;
    }

    if (signupForm.fullName.trim().length < 2) {
      nextErrors.fullName = "Enter your full name.";
    }
    if (!isEmail(signupForm.email)) nextErrors.signupEmail = "Enter a valid email.";
    if ((signupForm.password || "").length < 8) {
      nextErrors.signupPassword = "Password must be at least 8 characters.";
    }
    if (!signupForm.agree) nextErrors.agree = "Please accept terms to continue.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (requireOnboarding) {
      setStep("details");
      return;
    }

    onComplete?.({
      mode: "signup",
      requestedTab,
      onboardingCompleted: false,
      account: {
        name: signupForm.fullName,
        email: signupForm.email,
      },
    });
  };

  const handleDetailsSubmit = () => {
    const requiredFields = [
      "project_name",
      "project_type",
      "registry",
      "registry_project_id",
      "country",
      "vintage_years",
      "total_credits",
      "available_credits",
      "price_min",
      "price_max",
      "credit_rating",
    ];

    const nextErrors = {};
    requiredFields.forEach((field) => {
      if (!String(details[field] || "").trim()) {
        nextErrors[field] = "Required";
      }
    });

    if (
      Number(details.available_credits || 0) >
      Number(details.total_credits || 0)
    ) {
      nextErrors.available_credits = "Cannot exceed total credits.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onComplete?.({
      mode: "signup",
      requestedTab,
      onboardingCompleted: true,
      account: {
        name: signupForm.fullName,
        email: signupForm.email,
      },
      details,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0">
        <div className="grid grid-cols-1 rounded-2xl md:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white md:border-b-0 md:border-r">
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
            <div className="relative z-10 space-y-4">
              <Badge className="bg-white/20 text-white">Marketplace Access</Badge>
              <h2 className="font-display text-2xl font-semibold">
                {step === "details" ? "Complete Profile" : authTitle}
              </h2>
              <p className="text-sm text-emerald-50">
                {step === "details"
                  ? "First-time onboarding details from your marketplace schema."
                  : "This is UI-only authentication to enter the marketplace workspace."}
              </p>
              <div className="space-y-2 rounded-xl border border-white/20 bg-white/10 p-3 text-sm">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Requested route: {requestedTab}
                </p>
                <p className="flex items-center gap-2">
                  {mode === "login" ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  Mode: {mode === "login" ? "Login" : "Signup"}
                </p>
              </div>
            </div>
          </aside>

          <section className="p-6">
            <DialogHeader className="mb-4 p-0 pr-0">
              <DialogTitle>
                {step === "details"
                  ? "Marketplace First-Time Details"
                  : "Login / Signup"}
              </DialogTitle>
            </DialogHeader>

            {step === "auth" ? (
              <div className="space-y-5">
                <div className="inline-flex rounded-xl border border-slate-200 p-1">
                  <button
                    type="button"
                    className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
                      mode === "login"
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-slate-600"
                    }`}
                    onClick={() => {
                      setMode("login");
                      setErrors({});
                    }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
                      mode === "signup"
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-slate-600"
                    }`}
                    onClick={() => {
                      setMode("signup");
                      setErrors({});
                    }}
                  >
                    Signup
                  </button>
                </div>

                {mode === "login" ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input
                        value={loginForm.email}
                        onChange={(event) =>
                          setLoginForm((previous) => ({
                            ...previous,
                            email: event.target.value,
                          }))
                        }
                        placeholder="name@company.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-600">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={loginForm.password}
                        onChange={(event) =>
                          setLoginForm((previous) => ({
                            ...previous,
                            password: event.target.value,
                          }))
                        }
                        placeholder="At least 6 characters"
                      />
                      {errors.password && (
                        <p className="text-xs text-rose-600">{errors.password}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Full Name</Label>
                      <Input
                        value={signupForm.fullName}
                        onChange={(event) =>
                          setSignupForm((previous) => ({
                            ...previous,
                            fullName: event.target.value,
                          }))
                        }
                        placeholder="Your full name"
                      />
                      {errors.fullName && (
                        <p className="text-xs text-rose-600">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input
                        value={signupForm.email}
                        onChange={(event) =>
                          setSignupForm((previous) => ({
                            ...previous,
                            email: event.target.value,
                          }))
                        }
                        placeholder="name@company.com"
                      />
                      {errors.signupEmail && (
                        <p className="text-xs text-rose-600">{errors.signupEmail}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={signupForm.password}
                        onChange={(event) =>
                          setSignupForm((previous) => ({
                            ...previous,
                            password: event.target.value,
                          }))
                        }
                        placeholder="At least 8 characters"
                      />
                      {errors.signupPassword && (
                        <p className="text-xs text-rose-600">{errors.signupPassword}</p>
                      )}
                    </div>
                    <label className="flex items-start gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={signupForm.agree}
                        onChange={(event) =>
                          setSignupForm((previous) => ({
                            ...previous,
                            agree: event.target.checked,
                          }))
                        }
                      />
                      <span>
                        I accept marketplace terms and proceed with UI-only onboarding.
                      </span>
                    </label>
                    {errors.agree && (
                      <p className="text-xs text-rose-600">{errors.agree}</p>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => onOpenChange?.(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAuthSubmit}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {mode === "login"
                      ? "Continue to Dashboard"
                      : requireOnboarding
                        ? "Continue to Details"
                        : "Create Session"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label>Project Name</Label>
                    <Input
                      value={details.project_name}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          project_name: event.target.value,
                        }))
                      }
                      placeholder="e.g. Amazon REDD+ Conservation"
                    />
                    {errors.project_name && (
                      <p className="text-xs text-rose-600">{errors.project_name}</p>
                    )}
                  </div>

                  <div>
                    <Label>Project Type</Label>
                    <Select
                      value={details.project_type}
                      onValueChange={(value) =>
                        setDetails((previous) => ({ ...previous, project_type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.project_type && (
                      <p className="text-xs text-rose-600">{errors.project_type}</p>
                    )}
                  </div>

                  <div>
                    <Label>Registry</Label>
                    <Select
                      value={details.registry}
                      onValueChange={(value) =>
                        setDetails((previous) => ({ ...previous, registry: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select registry" />
                      </SelectTrigger>
                      <SelectContent>
                        {registries.map((registry) => (
                          <SelectItem key={registry.id} value={registry.id}>
                            {registry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.registry && (
                      <p className="text-xs text-rose-600">{errors.registry}</p>
                    )}
                  </div>

                  <div>
                    <Label>Registry Project ID</Label>
                    <Input
                      value={details.registry_project_id}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          registry_project_id: event.target.value,
                        }))
                      }
                      placeholder="e.g. VCS-2345"
                    />
                    {errors.registry_project_id && (
                      <p className="text-xs text-rose-600">
                        {errors.registry_project_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Country</Label>
                    <Input
                      value={details.country}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          country: event.target.value,
                        }))
                      }
                      placeholder="e.g. Brazil"
                    />
                    {errors.country && (
                      <p className="text-xs text-rose-600">{errors.country}</p>
                    )}
                  </div>

                  <div>
                    <Label>Vintage Years</Label>
                    <Input
                      value={details.vintage_years}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          vintage_years: event.target.value,
                        }))
                      }
                      placeholder="e.g. 2020-2025"
                    />
                    {errors.vintage_years && (
                      <p className="text-xs text-rose-600">{errors.vintage_years}</p>
                    )}
                  </div>

                  <div>
                    <Label>Total Credits</Label>
                    <Input
                      type="number"
                      value={details.total_credits}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          total_credits: event.target.value,
                        }))
                      }
                      placeholder="e.g. 500000"
                    />
                    {errors.total_credits && (
                      <p className="text-xs text-rose-600">{errors.total_credits}</p>
                    )}
                  </div>

                  <div>
                    <Label>Available Credits</Label>
                    <Input
                      type="number"
                      value={details.available_credits}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          available_credits: event.target.value,
                        }))
                      }
                      placeholder="e.g. 350000"
                    />
                    {errors.available_credits && (
                      <p className="text-xs text-rose-600">
                        {errors.available_credits}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Min Price (USD)</Label>
                    <Input
                      type="number"
                      value={details.price_min}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          price_min: event.target.value,
                        }))
                      }
                      placeholder="e.g. 10"
                    />
                    {errors.price_min && (
                      <p className="text-xs text-rose-600">{errors.price_min}</p>
                    )}
                  </div>

                  <div>
                    <Label>Max Price (USD)</Label>
                    <Input
                      type="number"
                      value={details.price_max}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          price_max: event.target.value,
                        }))
                      }
                      placeholder="e.g. 25"
                    />
                    {errors.price_max && (
                      <p className="text-xs text-rose-600">{errors.price_max}</p>
                    )}
                  </div>

                  <div>
                    <Label>Credit Rating</Label>
                    <Select
                      value={details.credit_rating}
                      onValueChange={(value) =>
                        setDetails((previous) => ({ ...previous, credit_rating: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {ratingOptions.map((rating) => (
                          <SelectItem key={rating} value={rating}>
                            {rating}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.credit_rating && (
                      <p className="text-xs text-rose-600">{errors.credit_rating}</p>
                    )}
                  </div>

                  <div>
                    <Label>Methodology Code</Label>
                    <Input
                      value={details.methodology_code}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          methodology_code: event.target.value,
                        }))
                      }
                      placeholder="e.g. VM0007"
                    />
                  </div>

                  <div>
                    <Label>Validation Body</Label>
                    <Input
                      value={details.validation_body}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          validation_body: event.target.value,
                        }))
                      }
                      placeholder="e.g. SCS Global Services"
                    />
                  </div>

                  <div>
                    <Label>Verification Body</Label>
                    <Input
                      value={details.verification_body}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          verification_body: event.target.value,
                        }))
                      }
                      placeholder="e.g. RINA"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Project Description</Label>
                    <Textarea
                      value={details.project_description}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          project_description: event.target.value,
                        }))
                      }
                      placeholder="Briefly describe your project."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Methodology Description</Label>
                    <Textarea
                      value={details.methodology_description}
                      onChange={(event) =>
                        setDetails((previous) => ({
                          ...previous,
                          methodology_description: event.target.value,
                        }))
                      }
                      placeholder="Describe the methodology used."
                    />
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <Button variant="outline" onClick={() => setStep("auth")}>
                    Back
                  </Button>
                  <Button
                    onClick={handleDetailsSubmit}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Complete & Open Dashboard
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
