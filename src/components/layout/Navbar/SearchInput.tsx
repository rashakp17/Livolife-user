"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import InputGroup from "@/components/ui/input-group";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { variantPricing } from "@/lib/pricing";
import PriceTag from "@/components/common/PriceTag";

type Suggestion = {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  srcUrl: string;
};

const SearchInput = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!query.trim() || !api) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${api}/product?search=${encodeURIComponent(query.trim())}&limit=5`,
          { signal: controller.signal }
        );
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
          setSuggestions([]);
          return;
        }
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          setSuggestions(
            data.products.slice(0, 5).map((p: any) => {
              const v = p.variants?.find((v: any) => v.isDefault) || p.variants?.[0];
              return {
                id: p._id,
                title: p.name,
                category: p.category?.name || "General",
                ...variantPricing(v),
                srcUrl: v?.images?.[0] || "/images/pic1.png",
              };
            })
          );
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current?.contains(e.target as Node) === false &&
        inputRef.current?.contains(e.target as Node) === false
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    inputRef.current?.focus();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileSearch();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  const closeMobileSearch = () => {
    setMobileOpen(false);
    setShowSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      setMobileOpen(false);
    }
  };

  const handleSuggestionClick = (id: string, name: string) => {
    router.push(`/shop/product/${id}/${name.split(" ").join("-")}`);
    setShowSuggestions(false);
    setMobileOpen(false);
  };

  return (
    <div
      className={cn(
        "md:relative md:flex md:items-center md:w-full md:mr-3 lg:mr-10",
        mobileOpen
          ? "absolute inset-0 z-30 flex items-center gap-2 px-4 bg-background md:px-0 md:bg-transparent"
          : "mr-4"
      )}
    >
      {!mobileOpen && (
        <button
          type="button"
          aria-label="Open search"
          onClick={() => setMobileOpen(true)}
          className="md:hidden flex items-center p-1"
        >
          <Image priority src="/icons/search.svg" height={22} width={22} alt="" className="min-w-[22px] min-h-[22px]" />
        </button>
      )}

      <form onSubmit={handleSearch} className={cn("flex-1", !mobileOpen && "hidden md:block")}>
        <InputGroup className="flex bg-white">
          <InputGroup.Text>
            <Image priority src="/icons/search.svg" height={20} width={20} alt="search" className="min-w-5 min-h-5 !filter-none opacity-60" />
          </InputGroup.Text>
          <InputGroup.Input
            ref={inputRef}
            type="search"
            name="search"
            placeholder="Search for products..."
            className="bg-transparent text-neutral-900 placeholder:text-neutral-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && suggestions.length > 0 && setShowSuggestions(true)}
          />
        </InputGroup>
      </form>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close search"
          onClick={closeMobileSearch}
          className="md:hidden flex items-center p-1 text-foreground"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="divide-y divide-black/5">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSuggestionClick(p.id, p.title)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-[#F0F0F0] transition-colors text-left"
                >
                  <div className="relative w-12 h-12 flex-shrink-0 rounded bg-[#F0F0F0] overflow-hidden">
                    <Image src={p.srcUrl} alt={p.title} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{p.title}</p>
                    <p className="text-xs text-white/60">{p.category}</p>
                    <PriceTag price={p.price} originalPrice={p.originalPrice} size="sm" className="mt-0.5" />
                  </div>
                </button>
              ))}
              <button
                onClick={() => { router.push(`/shop?search=${encodeURIComponent(query)}`); setShowSuggestions(false); }}
                className="w-full p-3 text-center text-sm font-medium text-black hover:bg-[#F0F0F0] transition-colors"
              >
                View all results for "{query}"
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-white/60 text-sm">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
