import { cn } from "@/lib/utils";
import { offerPercent } from "@/lib/pricing";

const SIZES = {
  sm: { price: "text-sm", original: "text-xs", pct: "text-xs" },
  md: { price: "text-xl xl:text-2xl", original: "text-sm xl:text-base", pct: "text-sm xl:text-base" },
  lg: { price: "text-2xl sm:text-[32px]", original: "text-base sm:text-xl", pct: "text-base sm:text-xl" },
};

/** 1499 → "1,499" (Indian grouping, so 150000 → "1,50,000"). */
const formatINR = (n: number) => n.toLocaleString("en-IN");

type PriceTagProps = {
  /** What the shopper pays. */
  price: number;
  /** Actual price before the offer; omit when there is no offer. */
  originalPrice?: number;
  size?: keyof typeof SIZES;
  className?: string;
};

/** "↓68%  MRP ~~1,499~~  ₹483" — the % off, the actual price (labelled MRP) struck through, then the offer price. */
const PriceTag = ({ price, originalPrice, size = "md", className }: PriceTagProps) => {
  const s = SIZES[size];
  const pct = offerPercent(price, originalPrice);

  return (
    // last-baseline so the stacked "MRP / ~~price~~" lines up on its number, not its label
    <div className={cn("flex [align-items:last_baseline] flex-wrap gap-x-2 gap-y-1", className)}>
      {pct > 0 && (
        <>
          <span className={cn("font-bold text-[#388E3C]", s.pct)}>↓{pct}%</span>
          <span className="flex flex-col leading-tight">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              MRP
            </span>
            <span className={cn("text-muted-foreground line-through", s.original)}>
              {formatINR(originalPrice!)}
            </span>
          </span>
        </>
      )}
      <span className={cn("font-bold text-black", s.price)}>₹{formatINR(price)}</span>
    </div>
  );
};

export default PriceTag;
