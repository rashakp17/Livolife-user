import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const revalidate = 60;

const api = process.env.NEXT_PUBLIC_API_URL;

type ApiCategory = {
  _id?: string;
  name?: string;
  slug?: string;
  isActive?: boolean;
};

type ApiSubCategory = {
  _id?: string;
  name?: string;
  slug?: string;
  image?: string | { data?: unknown } | null;
  isActive?: boolean;
  category?: { _id?: string } | string | null;
};

type SubCategoryCard = {
  id: string;
  name: string;
  href: string;
  image: string | null;
};

/** Only a string is usable as an <Image src>; anything else falls back to the initial. */
const resolveImage = (sub: ApiSubCategory): string | null =>
  typeof sub.image === "string" && sub.image.trim() ? sub.image : null;

const parentId = (cat: ApiSubCategory["category"]): string =>
  typeof cat === "string" ? cat : cat?._id ?? "";

async function getCategory(slug: string): Promise<ApiCategory | null> {
  if (!api) return null;
  try {
    // There is no fetch-by-slug endpoint, and the category list is small enough
    // that matching client-side beats adding one.
    const res = await fetch(`${api}/category`, { next: { revalidate: 60 } });
    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
      return null;
    }
    const data = await res.json();
    const all: ApiCategory[] = Array.isArray(data)
      ? data
      : data.categories ?? data.data ?? [];

    return all.find((c) => c.slug === slug && c.isActive !== false) ?? null;
  } catch {
    return null;
  }
}

async function getSubCategories(categoryId: string): Promise<ApiSubCategory[]> {
  if (!api) return [];
  try {
    const res = await fetch(`${api}/subcategory/category/${categoryId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
      return [];
    }
    const data = await res.json();
    return Array.isArray(data.subCategories) ? data.subCategories : [];
  } catch {
    return [];
  }
}

export default async function CategorySubCategoriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category?._id || !category.name) notFound();

  const shopHref = `/shop?categories=${encodeURIComponent(category.name)}`;
  const raw = await getSubCategories(category._id);

  const subCategories: SubCategoryCard[] = raw
    .filter(
      (s) =>
        s?.name &&
        s.isActive !== false &&
        parentId(s.category) === category._id
    )
    .map((s) => ({
      id: s._id ?? s.slug ?? (s.name as string),
      name: s.name as string,
      // Both params, so the shop shows the right breadcrumb-ish labels and the
      // category filter stays meaningful if the shopper opens the filter drawer.
      href: `/shop?categories=${encodeURIComponent(
        category.name as string
      )}&subcategories=${encodeURIComponent(s.name as string)}`,
      image: resolveImage(s),
    }));

  // Nothing to choose between — don't park the shopper on an empty screen.
  if (subCategories.length === 0) redirect(shopHref);

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />

        <Breadcrumb className="mb-5 sm:mb-9">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/shop">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {category.name}
          </h1>
          {/* Escape hatch for anyone who wants the whole category rather than
              picking a subcategory first. */}
          <Link
            href={shopHref}
            className="text-sm font-medium text-foreground/70 underline underline-offset-4 hover:text-foreground"
          >
            View all products
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {subCategories.map((sub) => (
            <Link
              key={sub.id}
              href={sub.href}
              className="group block rounded-[4px] bg-card p-2 sm:p-2.5 shadow-[0_1px_3px_rgba(18,41,74,0.08)] ring-1 ring-border transition duration-200 hover:shadow-[0_6px_18px_rgba(18,41,74,0.12)] hover:ring-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2px] bg-secondary">
                {sub.image ? (
                  <Image
                    src={sub.image}
                    alt={sub.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-accent"
                  >
                    <span className="text-3xl sm:text-4xl font-bold text-foreground/25">
                      {sub.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <p className="mt-2.5 sm:mt-3 mb-1 px-1 text-center text-sm sm:text-base font-bold text-foreground leading-snug line-clamp-2">
                {sub.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
