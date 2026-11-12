import React from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, CardContent, CardHeader } from "./ui/basic-ui";
import { Calendar, ChevronRight, Heart, MapPin } from "lucide-react";
import { cn } from "../lib/utils";
import PriceDisplay from "./PriceDisplay";

const qualityColors = {
  premium: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
  high: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white",
  standard: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
  basic: "bg-gradient-to-r from-slate-500 to-slate-600 text-white",
};

const typeColors = {
  removal: "bg-emerald-100 text-emerald-700 border-emerald-200",
  avoidance: "bg-blue-100 text-blue-700 border-blue-200",
  hybrid: "bg-purple-100 text-purple-700 border-purple-200",
};

export default function CreditListingCard({
  listing,
  project,
  registry,
  isWatched = false,
  onToggleWatch,
}) {
  const qualityColor = qualityColors[listing.quality_category] ?? qualityColors.standard;
  const typeColor = typeColors[project.removal_vs_avoidance] ?? typeColors.avoidance;

  return (
    <Card className="group overflow-hidden border-slate-200 bg-white transition-all duration-300 hover:shadow-2xl">
      <div className={cn("h-1.5", qualityColor)} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              {registry?.logo_url ? (
                <img src={registry.logo_url} alt={registry.name} className="h-5 w-auto" />
              ) : (
                <Badge variant="outline" className="text-xs">
                  {registry?.code || "N/A"}
                </Badge>
              )}
              <Badge className={cn("border text-xs", typeColor)}>
                {project.removal_vs_avoidance}
              </Badge>
            </div>
            <h3 className="line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
              {project.name}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{project.methodology}</p>
          </div>

          <div className={cn("rounded-lg px-3 py-1.5 shadow-lg", qualityColor)}>
            <div className="text-xs font-medium opacity-90">Quality</div>
            <div className="text-lg font-bold">{listing.quality_score || "N/A"}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="truncate">{project.country}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>Vintage {listing.vintage_year}</span>
          </div>
        </div>

        {Array.isArray(project.co_benefits) && project.co_benefits.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.co_benefits.slice(0, 3).map((benefit) => (
              <Badge
                key={benefit}
                variant="secondary"
                className="border-0 bg-slate-100 text-xs text-slate-700"
              >
                {benefit}
              </Badge>
            ))}
            {project.co_benefits.length > 3 && (
              <Badge
                variant="secondary"
                className="border-0 bg-slate-100 text-xs text-slate-700"
              >
                +{project.co_benefits.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-1 text-xs text-slate-500">Price per tonne</div>
              <PriceDisplay
                priceUSD={listing.price_usd ?? listing.price_per_tonne}
                unit="tCO2e"
                showApprox
                size="lg"
              />
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Available</div>
              <div className="text-lg font-semibold text-emerald-700">
                {listing.quantity.toLocaleString()} t
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "shrink-0 border-slate-200",
              isWatched ? "text-rose-600" : "text-slate-500",
            )}
            onClick={() => onToggleWatch?.(listing.id)}
            aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Heart className={cn("h-4 w-4", isWatched && "fill-current")} />
          </Button>

          <Link className="w-full" to={`/marketplace/listing/${listing.id}`}>
            <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-700 hover:to-teal-700 group-hover:shadow-emerald-500/40">
              View Details
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
