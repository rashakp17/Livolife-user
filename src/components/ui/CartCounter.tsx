"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { cn } from "@/lib/utils";

type CartCounterProps = {
  isZeroDelete?: boolean;
  onAdd?: (value: number) => void;
  onRemove?: (value: number) => void;
  className?: string;
  initialValue?: number;
  /**
   * Drives the count from the outside. Pass it when the real number lives
   * elsewhere (the cart) and must survive remounts — the internal counter
   * would otherwise drift once the count reaches 0 and stops tracking.
   */
  value?: number;
};

const CartCounter = ({
  isZeroDelete,
  onAdd,
  onRemove,
  className,
  initialValue = 1,
  value,
}: CartCounterProps) => {
  const [counter, setCounter] = useState<number>(initialValue);
  const isControlled = value !== undefined;
  const count = isControlled ? value : counter;

  const addToCart = () => {
    if (onAdd) {
      onAdd(count + 1);
    }
    if (!isControlled) setCounter(counter + 1);
  };

  const remove = () => {
    if ((count === 1 && !isZeroDelete && !isControlled) || count <= 0) return;

    if (onRemove) {
      onRemove(count - 1);
    }
    if (isControlled || count - 1 <= 0) return;
    setCounter(counter - 1);
  };

  return (
    <div
      className={cn(
        "bg-[#F0F0F0] w-full min-w-[110px] max-w-[110px] sm:max-w-[170px] py-3 md:py-3.5 px-4 sm:px-5 rounded-full flex items-center justify-between",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-5 w-5 sm:h-6 sm:w-6 text-xl hover:bg-transparent"
        onClick={() => remove()}
        disabled={count <= 0}
      >
        <FaMinus />
      </Button>
      <span className="font-medium text-sm sm:text-base">
        {isControlled ? count : !isZeroDelete ? counter : initialValue}
      </span>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-5 w-5 sm:h-6 sm:w-6 text-xl hover:bg-transparent"
        onClick={() => addToCart()}
      >
        <FaPlus />
      </Button>
    </div>
  );
};

export default CartCounter;
