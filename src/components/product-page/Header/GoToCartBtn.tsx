"use client";

import Link from "next/link";
import React from "react";

/**
 * Navigation only — the item is put in the cart by the counter's +, so this
 * button never adds anything.
 */
const GoToCartBtn = () => {
  return (
    <Link
      href="/cart"
      className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all flex items-center justify-center"
    >
      Go to Cart
    </Link>
  );
};

export default GoToCartBtn;
