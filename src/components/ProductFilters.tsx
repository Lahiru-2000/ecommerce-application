import React, { useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { ProductFilters as IProductFilters } from "../types/product";
import { CATEGORIES, STOCK_STATUS_OPTIONS } from "../constants";
import { getActiveFilterCount } from "../utils/filters";

interface ProductFiltersProps {
  filters: IProductFilters;
  onFiltersChange: (filters: IProductFilters) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const activeFilterCount = useMemo(
    () => getActiveFilterCount(filters),
    [filters]
  );

  const handleInputChange = (field: keyof IProductFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={(e: { target: { value: string } }) =>
                handleInputChange("search", e.target.value)
              }
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="w-full lg:w-48">
          <Select
            value={filters.category || "all"}
            onValueChange={(value: string) =>
              handleInputChange("category", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category: any) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="flex gap-2 w-full lg:w-auto">
          <Input
            placeholder="Min price"
            type="number"
            min="0"
            step="0.01"
            value={filters.minPrice}
            onChange={(e: { target: { value: string } }) =>
              handleInputChange("minPrice", e.target.value)
            }
            className="w-full lg:w-24"
          />
          <Input
            placeholder="Max price"
            type="number"
            min="0"
            step="0.01"
            value={filters.maxPrice}
            onChange={(e) => handleInputChange("maxPrice", e.target.value)}
            className="w-full lg:w-24"
          />
        </div>

        {/* Stock Status */}
        <div className="w-full lg:w-40">
          <Select
            value={filters.stockStatus}
            onValueChange={(value: any) =>
              handleInputChange("stockStatus", value as any)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STOCK_STATUS_OPTIONS.map(
                (option: { value: any; label: any }) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <X className="h-4 w-4" />
            <span>Clear ({activeFilterCount})</span>
          </Button>
        )}
      </div>
    </div>
  );
};
