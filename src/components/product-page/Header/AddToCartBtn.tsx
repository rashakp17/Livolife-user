"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { Product } from "@/types/product.types";
import React from "react";

type Props = {
  data: Product & { quantity: number };
  attributes?: string[];
};

const AddToCartBtn = ({ data, attributes = [] }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all"
      onClick={() =>
        dispatch(
          addToCart({
            id: data.id as number,
            name: data.title,
            srcUrl: data.srcUrl,
            price: data.price,
            attributes,
            discount: data.discount,
            taxRate: data.taxRate ?? 0,
            quantity: data.quantity,
          })
        )
      }
    >
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
