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

async function getCategories(): Promise<Category[]> {
  if (!api) return [];
  try {
    const res = await fetch(`${api}/category`, { next: { revalidate: 300 } });
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
        href: `/shop?categories=${encodeURIComponent(c.name as string)}`,
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
    <section className="max-w-frame mx-auto px-4 xl:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7">Categories</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-card">
                  <Image
                    src="/images/livo-mark.png"
                    alt=""
                    width={330}
                    height={330}
                    aria-hidden="true"
                    className="w-1/3 h-auto opacity-20"
                  />
                </div>
              )}
            </div>

            <div className="px-2 py-3 sm:px-3 sm:py-4">
              <p className="text-center text-sm sm:text-base font-medium leading-snug line-clamp-2">
                {cat.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSec;
