import React from "react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/basic-ui";
import { SlidersHorizontal, X } from "lucide-react";
import useCurrency from "../hooks/useCurrency";
import { formatPriceFromUSD } from "../lib/currencyUtils";

const projectTypes = [
  "Nature-Based Solutions",
  "Renewable Energy",
  "Biochar",
  "Direct Air Capture",
  "Industrial CCS",
  "Blue Carbon",
  "Methane Capture",
  "Waste-to-Energy",
];

const DEFAULT_FILTERS = {
  search: "",
  registry: "all",
  projectType: "all",
  removalType: "all",
  qualityCategory: "all",
  vintageYear: [2015, 2026],
  priceRange: [0, 260],
};

function updateRangePair(range, index, value) {
  const numeric = Number(value);
  const next = [...range];
  next[index] = numeric;
  if (index === 0 && next[0] > next[1]) next[0] = next[1];
  if (index === 1 && next[1] < next[0]) next[1] = next[0];
  return next;
}

export default function MarketplaceFilters({ filters, setFilters, registries }) {
  const { currency, fxRate } = useCurrency();
  const handleClearFilters = () => setFilters(DEFAULT_FILTERS);
  const priceLabel = (value) =>
    formatPriceFromUSD(value, currency, fxRate, { maximumFractionDigits: 0 });

  const hasActiveFilters =
    filters.search ||
    filters.registry !== "all" ||
    filters.projectType !== "all" ||
    filters.removalType !== "all" ||
    filters.qualityCategory !== "all" ||
    filters.vintageYear[0] !== DEFAULT_FILTERS.vintageYear[0] ||
    filters.vintageYear[1] !== DEFAULT_FILTERS.vintageYear[1] ||
    filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
    filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1];

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-slate-600 hover:text-slate-900"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Search</Label>
          <Input
            placeholder="Project name or ID..."
            value={filters.search}
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
            className="border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Registry</Label>
          <Select
            value={filters.registry}
            onValueChange={(value) => setFilters({ ...filters, registry: value })}
          >
            <SelectTrigger className="border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Registries</SelectItem>
              {registries.map((registry) => (
                <SelectItem key={registry.id} value={registry.id}>
                  {registry.name} ({registry.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Project Type</Label>
          <Select
            value={filters.projectType}
            onValueChange={(value) => setFilters({ ...filters, projectType: value })}
          >
            <SelectTrigger className="border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {projectTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Carbon Type</Label>
          <Select
            value={filters.removalType}
            onValueChange={(value) => setFilters({ ...filters, removalType: value })}
          >
            <SelectTrigger className="border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="removal">Removal</SelectItem>
              <SelectItem value="avoidance">Avoidance</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Quality Tier</Label>
          <Select
            value={filters.qualityCategory}
            onValueChange={(value) =>
              setFilters({ ...filters, qualityCategory: value })
            }
          >
            <SelectTrigger className="border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Qualities</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Vintage Year</Label>
          <div className="space-y-2 px-1">
            <input
              type="range"
              min={2015}
              max={2026}
              step={1}
              value={filters.vintageYear[0]}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  vintageYear: updateRangePair(filters.vintageYear, 0, event.target.value),
                })
              }
              className="w-full accent-emerald-600"
            />
            <input
              type="range"
              min={2015}
              max={2026}
              step={1}
              value={filters.vintageYear[1]}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  vintageYear: updateRangePair(filters.vintageYear, 1, event.target.value),
                })
              }
              className="w-full accent-emerald-600"
            />
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>{filters.vintageYear[0]}</span>
            <span>{filters.vintageYear[1]}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">
            Price per tonne ({currency})
          </Label>
          <div className="space-y-2 px-1">
            <input
              type="range"
              min={0}
              max={260}
              step={1}
              value={filters.priceRange[0]}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  priceRange: updateRangePair(filters.priceRange, 0, event.target.value),
                })
              }
              className="w-full accent-emerald-600"
            />
            <input
              type="range"
              min={0}
              max={260}
              step={1}
              value={filters.priceRange[1]}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  priceRange: updateRangePair(filters.priceRange, 1, event.target.value),
                })
              }
              className="w-full accent-emerald-600"
            />
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>{priceLabel(filters.priceRange[0])}</span>
            <span>{priceLabel(filters.priceRange[1])}</span>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
            <Badge className="bg-emerald-100 text-emerald-700">
              Active Filters
              <X className="ml-1 h-3 w-3" />
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
