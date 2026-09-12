"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CartBtn = () => {
  const { cart } = useAppSelector((state: RootState) => state.carts);

  return (
    <Link href="/cart" className="relative mr-[14px] p-1">
      <Image
        priority
        src="/icons/cart.svg"
        height={100}
        width={100}
        alt="cart"
        className="max-w-[22px] max-h-[22px]"
      />
      {cart && cart.totalQuantities > 0 && (
        // Use the theme tokens, not bg-black/text-white: globals.css remaps
        // .bg-black to --primary, which is near-white inside the navbar's
        // .surface-dark scope, so the white label became invisible on it.
        <span className="bg-primary text-primary-foreground rounded-full min-w-[18px] px-1 text-xs font-semibold leading-[18px] text-center absolute -top-3 left-1/2 -translate-x-1/2">
          {cart.totalQuantities}
        </span>
      )}
    </Link>
  );
};

export default CartBtn;
