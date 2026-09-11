import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Link from "next/link";
import React, { Suspense } from "react";
import Image from "next/image";
import CartBtn from "./CartBtn";
import SearchInput from "../SearchInput";

const TopNavbar = () => {
  return (
    <nav className="sticky top-0 bg-background border-b border-border z-20">
      <div className="flex relative max-w-frame mx-auto items-center justify-between md:justify-start py-5 md:py-6 px-4 xl:px-0">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center mr-3 lg:mr-10"
          >
            <Image
              src="/images/livo-logo.png"
              alt="Livolife"
              width={560}
              height={258}
              className="w-[104px] md:w-[124px] h-auto"
              priority
            />
          </Link>
        </div>
        <Suspense fallback={<div className="w-full md:mr-3 lg:mr-10 h-10 bg-[#F0F0F0] rounded-full animate-pulse" />}>
          <SearchInput />
        </Suspense>
        <div className="flex items-center">
          <Suspense fallback={<div className="w-6 h-6 mr-[14px]" />}>
            <CartBtn />
          </Suspense>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
