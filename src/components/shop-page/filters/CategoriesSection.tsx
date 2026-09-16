"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleCategory,
  toggleSubCategory,
} from "@/lib/features/filters/filtersSlice";
import type { RootState } from "@/lib/store";

type Category = { _id?: string; name: string; slug: string };

/** `category` arrives populated from /subcategory, but tolerate a bare id. */
type SubCategory = {
  _id?: string;
  name: string;
  slug?: string;
  isActive?: boolean;
  category?: { _id?: string; name?: string } | string | null;
};

/** Subcategories are grouped by their parent's *name*, since that is what the
 *  category list gives us and what the shop filters by. */
const parentName = (sub: SubCategory): string => {
  if (sub.category && typeof sub.category !== "string" && sub.category.name) {
    return sub.category.name;
  }
  return "";
};

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const selectedCategories = useSelector((state: RootState) => state.filters.categories);
  const selectedSubCategories = useSelector((state: RootState) => state.filters.subCategories);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!api) { setLoading(false); return; }

    // Module-level cache — only fetch once per session
    if ((window as any).__categoryCache && (window as any).__subCategoryCache) {
      setCategories((window as any).__categoryCache);
      setSubCategories((window as any).__subCategoryCache);
      setLoading(false);
      return;
    }

    const fetchFilters = async () => {
      try {
        // One round trip for both lists — a failure in either must not blank
        // out the other, so they settle independently.
        const [catRes, subRes] = await Promise.allSettled([
          fetch(`${api}/category`),
          fetch(`${api}/subcategory/list`),
        ]);

        let cats: Category[] = [];
        if (catRes.status === "fulfilled" && catRes.value.ok &&
            catRes.value.headers.get("content-type")?.includes("application/json")) {
          const data = await catRes.value.json();
          if (Array.isArray(data)) cats = data;
          else if (Array.isArray(data.categories)) cats = data.categories;
          else if (Array.isArray(data.data)) cats = data.data;
        }

        let subs: SubCategory[] = [];
        if (subRes.status === "fulfilled" && subRes.value.ok &&
            subRes.value.headers.get("content-type")?.includes("application/json")) {
          const data = await subRes.value.json();
          if (Array.isArray(data.subCategories)) subs = data.subCategories;
        }

        (window as any).__categoryCache = cats;
        (window as any).__subCategoryCache = subs;
        setCategories(cats);
        setSubCategories(subs);
      } catch {
        setCategories([]);
        setSubCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, [api]);

  return (
    <Accordion type="single" collapsible defaultValue="filter-category">
      <AccordionItem value="filter-category" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Category
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {categories.map((cat) => {
                const children = subCategories.filter(
                  (s) => parentName(s) === cat.name && s.isActive !== false
                );

                return (
                  <div key={cat.name} className="flex flex-col">
                    <label className="flex items-center space-x-2 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => dispatch(toggleCategory(cat.name))}
                        className="w-4 h-4 rounded border-white/30 cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground">{cat.name}</span>
                    </label>

                    {/* Indented children. A subcategory is selectable on its own —
                        it already implies its parent, so ticking it is enough. */}
                    {children.length > 0 && (
                      <div className="ml-6 flex flex-col space-y-1 border-l border-black/10 pl-3">
                        {children.map((sub) => (
                          <label
                            key={sub._id ?? sub.name}
                            className="flex items-center space-x-2 cursor-pointer py-0.5"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSubCategories.includes(sub.name)}
                              onChange={() => dispatch(toggleSubCategory(sub.name))}
                              className="w-3.5 h-3.5 rounded border-white/30 cursor-pointer"
                            />
                            <span className="text-xs text-muted-foreground">{sub.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No categories found</div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoriesSection;
