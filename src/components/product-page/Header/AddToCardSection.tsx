"use client";

import CartCounter from "@/components/ui/CartCounter";
import React from "react";
import GoToCartBtn from "./GoToCartBtn";
import { Product } from "@/types/product.types";
import {
  addToCart,
  remove,
  removeCartItem,
} from "@/lib/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { compareArrays } from "@/lib/utils";

type Props = {
  data: Product;
  attributes?: string[];
};

const AddToCardSection = ({ data, attributes = [] }: Props) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.carts.cart);

  // The count shown is whatever is in the cart right now, so it starts at 0 and
  // stays right when the shopper comes back to the page or edits the cart.
  const quantity =
    cart?.items.find(
      (item) =>
        item.id === (data.id as number) &&
        compareArrays(item.attributes, attributes)
    )?.quantity ?? 0;

  const cartItem = {
    id: data.id as number,
    name: data.title,
    srcUrl: data.srcUrl,
    price: data.price,
    originalPrice: data.originalPrice,
    attributes,
    discount: data.discount,
    taxRate: data.taxRate ?? 0,
  };

  return (
    <div className="fixed md:relative w-full bg-background border-t md:border-none border-border bottom-0 left-0 p-4 md:p-0 z-10 flex items-center justify-between sm:justify-start md:justify-center">
      <CartCounter
        value={quantity}
        onAdd={() => dispatch(addToCart({ ...cartItem, quantity: 1 }))}
        onRemove={() =>
          // Dropping the last one has to clear the line entirely; decrementing
          // it would leave a zero-quantity item sitting in the cart.
          quantity <= 1
            ? dispatch(remove({ id: cartItem.id, attributes, quantity }))
            : dispatch(removeCartItem({ id: cartItem.id, attributes }))
        }
      />
      <GoToCartBtn />
    </div>
  );
};

export default AddToCardSection;
