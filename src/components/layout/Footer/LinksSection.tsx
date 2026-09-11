import React from "react";
import { FooterLinks } from "./footer.types";
import Link from "next/link";
import { cn } from "@/lib/utils";

const footerLinksData: FooterLinks[] = [
  {
    id: 1,
    title: "contact details",
    children: [
      {
        id: 11,
        label: "Email: Shameenaharis1272@gmail.com",
        url: "mailto:Shameenaharis1272@gmail.com",
      },
      {
        id: 12,
        label: "Contact Number: 9744147967",
        url: "tel:9744147967",
      },
    ],
  },
];

const LinksSection = () => {
  return (
    <>
      {footerLinksData.map((item) => (
        <section className="flex flex-col mt-5 col-span-2 col-start-1 items-center text-center sm:col-start-2 sm:col-span-2" key={item.id}>
          <h3 className="font-medium text-sm md:text-base uppercase tracking-widest mb-6">
            {item.title}
          </h3>
          {item.children.map((link) => (
            <Link
              href={link.url}
              key={link.id}
              className={cn([
                !link.url.startsWith("mailto:") && !link.url.startsWith("tel:") && "capitalize",
                "text-muted-foreground hover:text-primary transition-all text-sm md:text-base mb-4 w-fit break-all text-center",
              ])}
            >
              {link.label}
            </Link>
          ))}
        </section>
      ))}
    </>
  );
};

export default LinksSection;
