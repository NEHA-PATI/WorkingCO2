import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import "../styles/marketplace1.css";

function toTitle(value = "") {
  return value
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ListingDetailPage() {
  const { listingId } = useParams();
  const location = useLocation();
  const projectName = toTitle(listingId || "this project");
  const rootPath = location.pathname.startsWith("/marketplace1")
    ? "/marketplace1"
    : "/marketplace";

  return (
    <div className="marketplace1-root min-h-screen bg-[#fbf9f8] px-4 py-12 text-[#1b1c1c] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to={rootPath}
          className="inline-flex items-center gap-2 rounded-full border border-[#dbe1db] bg-white px-4 py-2 text-sm font-semibold text-[#005129] transition-colors hover:bg-[#f2f5f2]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="mt-8 rounded-3xl border border-[#dbe1db] bg-white p-8 shadow-sm sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#8ef9ad]/30 px-3 py-1 text-xs font-bold text-[#006d39]">
            <Sparkles className="h-4 w-4" />
            Marketplace1 In Progress
          </div>
          <h1 className="marketplace1-headline mt-4 text-3xl font-black sm:text-4xl">
            {projectName}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            The new listing detail experience is being built next in
            `features/marketplace1`. For now, this route is connected so we can
            layer in components, modals, and full trading flows step by step.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={rootPath}
              className="rounded-full bg-[#005129] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105"
            >
              Continue Exploring
            </Link>
            <button
              type="button"
              className="rounded-full border border-[#dbe1db] px-5 py-2.5 text-sm font-bold text-[#005129]"
            >
              Open Interest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
