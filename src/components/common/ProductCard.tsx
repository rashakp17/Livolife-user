import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product.types";
import PriceTag from "./PriceTag";

type ProductCardProps = {
  data: Product;
  // pass true for above-the-fold cards (first row) to eagerly load
  priority?: boolean;
};

const ProductCard = ({ data, priority = false }: ProductCardProps) => {
  return (
    <Link
      href={`/shop/product/${data.id}/${data.title.split(" ").join("-")}`}
      className="flex flex-col items-start aspect-auto"
    >
      <div className="relative bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden">
        <Image
          src={data.srcUrl}
          fill
          sizes="(max-width: 768px) 50vw, 295px"
          className="rounded-md object-contain hover:scale-110 transition-all duration-500"
          alt={data.title}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
      </div>
      <strong className="text-black xl:text-xl">{data.title}</strong>
      <p className="text-muted-foreground text-sm xl:text-base">{data.category}</p>
      <PriceTag price={data.price} originalPrice={data.originalPrice} />
    </Link>
  );
};

// Prevent re-renders when parent re-renders but product data hasn't changed
export default React.memo(ProductCard);
