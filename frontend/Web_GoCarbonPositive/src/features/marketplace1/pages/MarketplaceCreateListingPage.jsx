import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiCheck, FiCheckCircle, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

import MarketplaceNavbar from "../components/MarketplaceNavbar";
import Step1Individual from "../components/Step1Individual";
import Step1Organisation from "../components/Step1Organisation";
import Step2Registry from "../components/Step2Registry";
import Step3Credit from "../components/Step3Credit";
import Step4Documents from "../components/Step4Documents";
import Step5Verification from "../components/Step5Verification";
import Step6Legal from "../components/Step6Legal";
import "../styles/marketplace1.css";

const STEP_ITEMS = [
  { index: 1, id: "seller-details", title: "Seller Details" },
  { index: 2, id: "registry-project-details", title: "Registry and Project Details" },
  { index: 3, id: "credit-details", title: "Credit Details" },
  { index: 4, id: "document-upload", title: "Document Upload" },
  { index: 5, id: "verification-status", title: "Verification Status" },
  { index: 6, id: "legal-declarations", title: "Legal and Declarations" },
];

function resolveStepIndex(stepId) {
  if (!stepId) return 1;

  const fromNumber = Number(stepId);
  if (Number.isInteger(fromNumber) && fromNumber >= 1 && fromNumber <= STEP_ITEMS.length) {
    return fromNumber;
  }

  const fromPrefixed = Number(String(stepId).replace(/step[-_]?/i, ""));
  if (Number.isInteger(fromPrefixed) && fromPrefixed >= 1 && fromPrefixed <= STEP_ITEMS.length) {
    return fromPrefixed;
  }

  const byId = STEP_ITEMS.find((item) => item.id === stepId);
  return byId ? byId.index : 1;
}

function getStepPath(index) {
  const step = STEP_ITEMS.find((item) => item.index === index);
  return step ? `/create-listing/${step.id}` : "/create-listing/seller-details";
}

export default function MarketplaceCreateListingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { stepId } = useParams();
  const rootPath = location.pathname.startsWith("/marketplace1")
    ? "/marketplace1"
    : "/marketplace";

  const [currentStep, setCurrentStep] = useState(() => resolveStepIndex(stepId));
  const [completedSteps, setCompletedSteps] = useState([]);
  const [sellerType, setSellerType] = useState("individual");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const resolved = resolveStepIndex(stepId);
    setCurrentStep(resolved);
  }, [stepId]);

  const currentStepItem = useMemo(
    () => STEP_ITEMS.find((item) => item.index === currentStep) || STEP_ITEMS[0],
    [currentStep],
  );

  const goToStep = (nextStep) => {
    const bounded = Math.min(Math.max(nextStep, 1), STEP_ITEMS.length);
    setCurrentStep(bounded);
    navigate(getStepPath(bounded));
  };

  const handleNext = () => {
    setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
    goToStep(currentStep + 1);
  };

  const handleBack = () => {
    goToStep(currentStep - 1);
  };

  const handleSubmitSuccess = () => {
    setCompletedSteps((prev) => (prev.includes(6) ? prev : [...prev, 6]));
    setIsSuccessModalOpen(true);
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      if (sellerType === "organization") {
        return <Step1Organisation sellerType={sellerType} onSellerTypeChange={setSellerType} />;
      }
      return <Step1Individual sellerType={sellerType} onSellerTypeChange={setSellerType} />;
    }

    if (currentStep === 2) return <Step2Registry />;
    if (currentStep === 3) return <Step3Credit />;
    if (currentStep === 4) return <Step4Documents />;
    if (currentStep === 5) return <Step5Verification />;
    return <Step6Legal onSubmitSuccess={handleSubmitSuccess} />;
  };

  return (
    <div className="mkt-root mkt-create-page">
      <div className="mkt-create-nav-host">
        <MarketplaceNavbar rootPath={rootPath} activeItem="sell" />
      </div>

      <div className="mkt-create-shell">
        <aside className="mkt-create-sidebar">
          <div className="mkt-create-sidebar-head">
            <h1 className="mkt-create-sidebar-title">Listing Wizard</h1>
            <p className="mkt-create-sidebar-sub">
              Step {currentStep} of {STEP_ITEMS.length}
            </p>
          </div>

          <div className="mkt-create-timeline-wrap">
            <span className="mkt-create-timeline-line" />
            <nav className="mkt-create-timeline" aria-label="Create listing steps">
              {STEP_ITEMS.map((item) => {
                const isCurrent = item.index === currentStep;
                const isCompleted = completedSteps.includes(item.index) || item.index < currentStep;
                const isFuture = !isCurrent && !isCompleted;
                const isUnlocked = isCompleted || isCurrent || item.index === currentStep + 1;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`mkt-create-step-item ${
                      isCurrent
                        ? "mkt-create-step-item-current"
                        : isCompleted
                          ? "mkt-create-step-item-complete"
                          : "mkt-create-step-item-future"
                    }`}
                    onClick={() => {
                      if (isUnlocked || item.index < currentStep) {
                        goToStep(item.index);
                      }
                    }}
                    disabled={!isUnlocked && item.index > currentStep}
                  >
                    <span
                      className={`mkt-create-step-circle ${
                        isCurrent
                          ? "mkt-create-step-circle-current"
                          : isCompleted
                            ? "mkt-create-step-circle-complete"
                            : "mkt-create-step-circle-future"
                      }`}
                    >
                      {isCompleted ? <FiCheck /> : item.index}
                    </span>
                    <span className="mkt-create-step-copy">
                      <span className="mkt-create-step-meta">Step {item.index}</span>
                      <span className="mkt-create-step-title">{item.title}</span>
                    </span>
                    <span className={`mkt-create-step-dot ${isFuture ? "mkt-create-step-dot-future" : ""}`} />
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="mkt-create-main">
          <div className="mkt-create-main-inner">
            <div className="mkt-step-transition">{renderStepContent()}</div>
          </div>
        </main>
      </div>

      <div className="mkt-create-actionbar">
        <div className="mkt-create-actionbar-left">
          <span className="mkt-create-actionbar-step">Current Step</span>
          <p>{currentStepItem.title}</p>
        </div>

        <div className="mkt-create-actionbar-buttons">
          <button
            type="button"
            className="mkt-btn mkt-btn-secondary"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <FiChevronLeft />
            Back
          </button>

          <button
            type="button"
            className={`mkt-btn mkt-btn-primary ${currentStep === STEP_ITEMS.length ? "mkt-btn-disabled" : ""}`}
            onClick={handleNext}
            disabled={currentStep === STEP_ITEMS.length}
          >
            Next
            <FiChevronRight />
          </button>
        </div>
      </div>

      {isSuccessModalOpen ? (
        <div className="mkt-modal-overlay" role="dialog" aria-modal="true" aria-label="Listing created">
          <div className="mkt-modal-card">
            <button
              type="button"
              className="mkt-modal-close"
              aria-label="Close success modal"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              <FiX />
            </button>

            <span className="mkt-modal-icon">
              <FiCheckCircle />
            </span>

            <h2 className="mkt-modal-title">Listing Created Successfully</h2>
            <p className="mkt-modal-copy">
              Your carbon credit listing has been submitted and is now in the compliance queue.
            </p>

            <div className="mkt-modal-actions">
              <button
                type="button"
                className="mkt-btn mkt-btn-secondary"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  navigate(`${rootPath}/browse`);
                }}
              >
                Go to Marketplace
              </button>
              <button
                type="button"
                className="mkt-btn mkt-btn-primary"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setCompletedSteps([]);
                  setSellerType("individual");
                  goToStep(1);
                }}
              >
                Create Another Listing
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
