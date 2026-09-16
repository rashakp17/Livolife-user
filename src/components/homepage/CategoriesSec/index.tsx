import Image from "next/image";
import Link from "next/link";

type ApiCategory = {
  _id?: string;
  name?: string;
  slug?: string;
  // The API may send a plain URL string, or a Mongo Buffer object we cannot render.
  image?: string | { data?: unknown; contentType?: string } | null;
  imageUrl?: string;
  isActive?: boolean;
};

type Category = {
  id: string;
  name: string;
  href: string;
  image: string | null;
};

const api = process.env.NEXT_PUBLIC_API_URL;

/** Only a string is usable as an <Image src>; Buffer-shaped values fall back to the placeholder. */
function resolveImage(c: ApiCategory): string | null {
  if (typeof c.imageUrl === "string" && c.imageUrl.trim()) return c.imageUrl;
  if (typeof c.image === "string" && c.image.trim()) return c.image;
  return null;
}

type ApiSubCategory = {
  isActive?: boolean;
  category?: { _id?: string } | string | null;
};

const parentId = (cat: ApiSubCategory["category"]): string =>
  typeof cat === "string" ? cat : cat?._id ?? "";

/** Ids of categories that actually have something to drill into. */
async function getCategoriesWithChildren(): Promise<Set<string>> {
  if (!api) return new Set();
  try {
    const res = await fetch(`${api}/subcategory/list`, {
      next: { revalidate: 60 },
    });
    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
      return new Set();
    }
    const data = await res.json();
    const subs: ApiSubCategory[] = Array.isArray(data.subCategories)
      ? data.subCategories
      : [];

    return new Set(
      subs
        .filter((s) => s.isActive !== false)
        .map((s) => parentId(s.category))
        .filter(Boolean)
    );
  } catch {
    return new Set();
  }
}

async function getCategories(): Promise<Category[]> {
  if (!api) return [];
  try {
    // 60s to match the page's own revalidate and the product fetch. At the
    // previous 300s, a category added in admin took up to 5 minutes to appear
    // while products appeared in 1 — which reads as "the category is missing".
    const [res, withChildren] = await Promise.all([
      fetch(`${api}/category`, { next: { revalidate: 60 } }),
      getCategoriesWithChildren(),
    ]);
    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
      return [];
    }
    const data = await res.json();
    const raw: ApiCategory[] = Array.isArray(data)
      ? data
      : data.categories ?? data.data ?? [];

    return raw
      .filter((c) => c?.name && c.isActive !== false)
      .map((c) => ({
        id: c._id ?? c.slug ?? (c.name as string),
        name: c.name as string,
        // Step through the subcategories when there are any; otherwise that
        // screen would just bounce straight back out to the products anyway.
        href:
          c.slug && c._id && withChildren.has(c._id)
            ? `/shop/category/${c.slug}`
            : `/shop?categories=${encodeURIComponent(c.name as string)}`,
        image: resolveImage(c),
      }));
  } catch {
    return [];
  }
}

const CategoriesSec = async () => {
  const categories = await getCategories();

  // Nothing to show yet — render nothing rather than an empty heading.
  if (categories.length === 0) return null;

  return (
    // Sits directly on the light blue page background; cards are white.
    <section className="pb-9 sm:pb-14">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-5 sm:mb-7">
          Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group block rounded-[4px] bg-card p-2 sm:p-2.5 shadow-[0_1px_3px_rgba(18,41,74,0.08)] ring-1 ring-border transition duration-200 hover:shadow-[0_6px_18px_rgba(18,41,74,0.12)] hover:ring-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2px] bg-secondary">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
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
                      {cat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <p className="mt-2.5 sm:mt-3 mb-1 px-1 text-center text-sm sm:text-base font-bold text-foreground leading-snug line-clamp-2">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSec;
