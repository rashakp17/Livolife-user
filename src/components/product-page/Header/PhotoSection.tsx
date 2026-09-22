"use client";

import { Product } from "@/types/product.types";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const AUTO_SLIDE_MS = 2000;

const PhotoSection = ({ data }: { data: Product }) => {
  const images = Array.from(
    new Set((data.gallery?.length ? data.gallery : [data.srcUrl]).filter(Boolean))
  );
  const imagesKey = images.join("|");
  const hasMultiple = images.length > 1;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // When the variant changes (image set changes), start again from its first image
  useEffect(() => {
    setCurrent(0);
  }, [imagesKey]);

  const go = useCallback(
    (step: number) =>
      setCurrent((i) => (i + step + images.length) % images.length),
    [images.length]
  );

  // Auto-advance; `current` is a dependency so a manual arrow click restarts the 2s timer
  useEffect(() => {
    if (!hasMultiple || paused) return;
    const timer = setTimeout(() => go(1), AUTO_SLIDE_MS);
    return () => clearTimeout(timer);
  }, [current, hasMultiple, paused, go]);

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:space-x-3.5">
    <div
      className="relative flex items-center justify-center bg-white ring-1 ring-border rounded-[13px] sm:rounded-[20px] w-full sm:w-96 md:w-full mx-auto h-[300px] sm:h-full max-h-[530px] sm:min-h-[330px] lg:min-h-[380px] xl:min-h-[530px] overflow-hidden mb-2 sm:mb-3 lg:mb-0 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          fill
          sizes="(max-width: 768px) 100vw, 444px"
          className={`object-cover group-hover:scale-110 transition-all duration-500 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          alt={data.title}
          priority={index === 0}
          unoptimized
        />
      ))}

      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow text-black transition-colors"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow text-black transition-colors"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex space-x-1.5">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`Show image ${index + 1}`}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all ${
                  index === current ? "w-5 bg-black" : "w-2 bg-black/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default PhotoSection;
