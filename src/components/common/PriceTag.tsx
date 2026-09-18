import { cn } from "@/lib/utils";
import { offerPercent } from "@/lib/pricing";

const SIZES = {
  sm: { price: "text-sm", original: "text-xs", badge: "text-[10px] py-0.5 px-2" },
  md: { price: "text-xl xl:text-2xl", original: "text-base xl:text-xl", badge: "text-[10px] xl:text-xs py-1.5 px-3.5" },
  lg: { price: "text-2xl sm:text-[32px]", original: "text-xl sm:text-[28px]", badge: "text-xs sm:text-sm py-1.5 px-3.5" },
};

type PriceTagProps = {
  /** What the shopper pays. */
  price: number;
  /** Actual price before the offer; omit when there is no offer. */
  originalPrice?: number;
  size?: keyof typeof SIZES;
  className?: string;
};

/** Offer price, the actual price struck through, and the "% off" badge. */
const PriceTag = ({ price, originalPrice, size = "md", className }: PriceTagProps) => {
  const s = SIZES[size];
  const pct = offerPercent(price, originalPrice);

  return (
    <div className={cn("flex items-center flex-wrap gap-x-2 gap-y-1", className)}>
      <span className={cn("font-bold text-black", s.price)}>₹{price}</span>
      {pct > 0 && (
        <>
          <span className={cn("font-bold text-muted-foreground line-through", s.original)}>
            ₹{originalPrice}
          </span>
          <span className={cn("font-medium rounded-full bg-[#FF3333]/10 text-[#FF3333]", s.badge)}>
            -{pct}%
          </span>
        </>
      )}
    </div>
  );
};

export default PriceTag;
