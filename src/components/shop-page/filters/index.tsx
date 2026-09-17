"use client";

import React, { useEffect } from "react";
import CategoriesSection from "@/components/shop-page/filters/CategoriesSection";
import PriceSection from "@/components/shop-page/filters/PriceSection";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import {
  resetFilters,
  setCategories,
} from "@/lib/features/filters/filtersSlice";

const parseList = (value: string | null): string[] =>
  value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];

const Filters = ({ onApply }: { onApply?: () => void }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useSelector((state: RootState) => state.filters);

  // Arriving from a category link means the URL already carries a selection.
  // Without this the boxes render unticked, and the first Apply would silently
  // throw that selection away.
  const categoriesParam = searchParams.get("categories");

  useEffect(() => {
    dispatch(setCategories(parseList(categoriesParam)));
  }, [dispatch, categoriesParam]);

  const handleApplyFilter = () => {
    const params = new URLSearchParams();

    if (filters.categories.length > 0) {
      params.append("categories", filters.categories.join(","));
    }
    if (filters.sizes.length > 0) {
      params.append("sizes", filters.sizes.join(","));
    }
    // Only append price if not default range
    if (filters.priceRange[0] > 0) {
      params.append("minPrice", filters.priceRange[0].toString());
    }
    if (filters.priceRange[1] < 5000) {
      params.append("maxPrice", filters.priceRange[1].toString());
    }

    const queryString = params.toString();
    router.push(`/shop${queryString ? `?${queryString}` : ""}`);
    onApply?.();
  };

  const handleResetFilter = () => {
    dispatch(resetFilters());
    router.push("/shop");
    onApply?.();
  };

  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection />
      <hr className="border-t-black/10" />
      <PriceSection />
      <div className="flex gap-2">
        <Button
          type="button"
          className="bg-black w-full rounded-full text-sm font-medium py-4 h-12"
          onClick={handleApplyFilter}
        >
          Apply Filter
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full text-sm font-medium py-4 h-12 border-black/20"
          onClick={handleResetFilter}
        >
          Reset
        </Button>
      </div>
    </>
  );
};

export default Filters;
