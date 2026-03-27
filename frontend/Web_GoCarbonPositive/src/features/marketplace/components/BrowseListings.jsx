import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/basic-ui";
import { Heart, TrendingUp } from "lucide-react";
import {
  getMarketplaceCatalog,
  registries,
} from "../config/mockMarketplaceData";
import CreditListingCard from "./CreditListingCard";
import MarketplaceFilters from "./MarketplaceFilters";

const DEFAULT_FILTERS = {
  search: "",
  registry: "all",
  projectType: "all",
  removalType: "all",
  qualityCategory: "all",
  vintageYear: [2015, 2026],
  priceRange: [0, 260],
};

function applySort(items, sortBy) {
  const next = [...items];

  if (sortBy === "price_asc") {
    return next.sort(
      (a, b) => a.listing.price_per_tonne - b.listing.price_per_tonne,
    );
  }

  if (sortBy === "price_desc") {
    return next.sort(
      (a, b) => b.listing.price_per_tonne - a.listing.price_per_tonne,
    );
  }

  if (sortBy === "quality_desc") {
    return next.sort((a, b) => b.listing.quality_score - a.listing.quality_score);
  }

  if (sortBy === "newest_vintage") {
    return next.sort((a, b) => b.listing.vintage_year - a.listing.vintage_year);
  }

  return next.sort(
    (a, b) =>
      b.listing.quality_score * 0.6 + b.listing.quantity * 0.00001 -
      (a.listing.quality_score * 0.6 + a.listing.quantity * 0.00001),
  );
}

export default function BrowseListings() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("featured");
  const [watchlist, setWatchlist] = useState(() => new Set());
  const catalog = useMemo(() => getMarketplaceCatalog(), []);

  const filteredCatalog = useMemo(() => {
    const searched = catalog.filter(({ listing, project }) => {
      const normalizedSearch = filters.search.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        project.name.toLowerCase().includes(normalizedSearch) ||
        listing.id.toLowerCase().includes(normalizedSearch);
      const matchesRegistry =
        filters.registry === "all" || project.registry_id === filters.registry;
      const matchesProjectType =
        filters.projectType === "all" || project.project_type === filters.projectType;
      const matchesRemovalType =
        filters.removalType === "all" ||
        project.removal_vs_avoidance === filters.removalType;
      const matchesQuality =
        filters.qualityCategory === "all" ||
        listing.quality_category === filters.qualityCategory;
      const matchesVintage =
        listing.vintage_year >= filters.vintageYear[0] &&
        listing.vintage_year <= filters.vintageYear[1];
      const matchesPrice =
        listing.price_per_tonne >= filters.priceRange[0] &&
        listing.price_per_tonne <= filters.priceRange[1];

      return (
        matchesSearch &&
        matchesRegistry &&
        matchesProjectType &&
        matchesRemovalType &&
        matchesQuality &&
        matchesVintage &&
        matchesPrice
      );
    });

    return applySort(searched, sortBy);
  }, [catalog, filters, sortBy]);

  const resultsSummary = useMemo(() => {
    const totalTonnage = filteredCatalog.reduce(
      (sum, entry) => sum + entry.listing.quantity,
      0,
    );
    const avgPrice =
      filteredCatalog.length === 0
        ? 0
        : filteredCatalog.reduce(
            (sum, entry) => sum + entry.listing.price_per_tonne,
            0,
          ) / filteredCatalog.length;
    return { totalTonnage, avgPrice };
  }, [filteredCatalog]);

  const toggleWatchlist = (listingId) => {
    setWatchlist((previous) => {
      const next = new Set(previous);
      if (next.has(listingId)) {
        next.delete(listingId);
      } else {
        next.add(listingId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-6 xl:h-fit">
          <MarketplaceFilters
            filters={filters}
            setFilters={setFilters}
            registries={registries}
          />
        </aside>

        <section className="space-y-4">
          <Card className="border-slate-200 bg-white">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {filteredCatalog.length} Listings
                </h3>
                <p className="text-sm text-slate-600">
                  {resultsSummary.totalTonnage.toLocaleString()} t available | Avg $
                  {resultsSummary.avgPrice.toFixed(2)}/t
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => navigate("/marketplace?tab=sell")}
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Add Listings
                </Button>
                <Badge variant="secondary">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Market Active
                </Badge>
                <Badge variant="outline">
                  <Heart className="mr-1 h-3 w-3" />
                  Watchlist {watchlist.size}
                </Badge>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="quality_desc">Highest Quality</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="newest_vintage">Newest Vintage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {filteredCatalog.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {filteredCatalog.map(({ listing, project, registry }) => (
                <CreditListingCard
                  key={listing.id}
                  listing={listing}
                  project={project}
                  registry={registry}
                  isWatched={watchlist.has(listing.id)}
                  onToggleWatch={toggleWatchlist}
                />
              ))}
            </div>
          ) : (
            <Card className="border-slate-200 bg-white">
              <CardContent className="py-12 text-center">
                <p className="text-lg font-semibold text-slate-900">No listings found</p>
                <p className="mt-1 text-sm text-slate-600">
                  Adjust filters or clear them to see more results.
                </p>
                <Button className="mt-4" onClick={() => setFilters(DEFAULT_FILTERS)}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

