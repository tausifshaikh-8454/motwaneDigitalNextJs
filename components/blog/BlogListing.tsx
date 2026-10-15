import Link from "next/link";
import { Carousel } from "@/components/ui/Carousel";
import { WpImage } from "@/components/ui/WpImage";
import { MustReadCard, PostCard } from "./PostCard";
import type { BlogSettings, WPCategory, WPPost } from "@/types/wp";

function pageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}page/${page}/`;
}

/** Shared layout for /blog/, /blog/page/N/ and /blog/category/<slug>/. */
export function BlogListing({
  settings,
  mustRead,
  categories,
  activeCategory,
  posts,
  sliderPosts,
  page,
  totalPages,
  basePath,
}: {
  settings: BlogSettings | null;
  mustRead: WPPost[];
  categories: WPCategory[];
  activeCategory: string | null;
  posts: WPPost[];
  /** Every post of this listing, shown as a slider on phones */
  sliderPosts: WPPost[];
  page: number;
  totalPages: number;
  basePath: string;
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {settings?.hero_image && (
          <WpImage image={settings.hero_image} fill priority sizes="100vw" className="-z-20 object-cover object-right lg:object-top" />
        )}
        <div className="absolute inset-0 -z-10 bg-black/30" />
        <div className="container-site flex min-h-[30vh] flex-col justify-center py-12 text-white lg:min-h-[50vh]">
          {settings?.hero_title && (
            <h1 className="text-[32px] font-bold uppercase leading-[1.3] lg:text-h1">{settings.hero_title}</h1>
          )}
          {settings?.hero_text && <p className="mt-5 max-w-[700px] text-base leading-[1.5] lg:text-lg">{settings.hero_text}</p>}
        </div>
      </section>

      {/* Must Read */}
      {mustRead.length > 0 && (
        <section className="container-site py-10 lg:py-[50px]">
          {settings?.must_read_heading && (
            <h2 className="text-xl font-medium leading-[1.6] text-primary [text-shadow:0_2px_4px_rgba(13,108,179,0.25)]">
              {settings.must_read_heading}
            </h2>
          )}
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {mustRead.map((p) => (
              <MustReadCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* Category filter */}
      {categories.length > 0 && (
        <section
          className="relative isolate overflow-hidden bg-[#002b4b] bg-cover bg-center bg-no-repeat lg:bg-fixed"
          style={settings?.categories_image ? { backgroundImage: `url(${settings.categories_image.url})` } : undefined}
        >
          <div className="absolute inset-0 -z-10 bg-[#002b4b]/55" />
          <div className="container-site py-12 text-center lg:py-[70px]">
            {settings?.categories_heading && (
              <h2 className="text-2xl font-medium leading-[1.4] text-white lg:text-[30px]">{settings.categories_heading}</h2>
            )}
            <nav aria-label="Blog categories" className="mt-6">
              <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:gap-x-6">
                {[{ slug: null as string | null, name: settings?.all_label || "All" }, ...categories].map((c) => {
                  const active = c.slug === activeCategory;
                  const href = c.slug ? `/blog/category/${c.slug}/` : "/blog/";
                  return (
                    <li key={c.slug ?? "all"}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={`block border-b-2 p-2 text-base leading-[1.4] transition-colors lg:text-xl ${
                          active ? "border-[#f0b100] text-[#f0b100]" : "border-transparent text-white hover:text-[#f0b100]"
                        }`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="container-site py-12 lg:py-[50px]">
        {posts.length ? (
          <>
            {/* Tablet and desktop: grid with page numbers */}
            <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <PostCard key={p.id} post={p} priority={i < 3} />
              ))}
            </div>
            {/* Phones: one card at a time, swipe or use the arrows */}
            <Carousel className="md:hidden" dots={false} arrows autoplayMs={5000}>
              {sliderPosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </Carousel>
          </>
        ) : (
          <p className="py-10 text-center text-body">No articles found.</p>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-10 hidden items-center justify-center gap-3 font-bold md:flex">
            {page > 1 ? (
              <Link href={pageHref(basePath, page - 1)} className="text-primary hover:underline">
                Prev
              </Link>
            ) : (
              <span className="text-body">Prev</span>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
              n === page ? (
                <span key={n} aria-current="page" className="text-body">
                  {n}
                </span>
              ) : (
                <Link key={n} href={pageHref(basePath, n)} className="text-primary hover:underline">
                  {n}
                </Link>
              ),
            )}
            {page < totalPages ? (
              <Link href={pageHref(basePath, page + 1)} className="text-primary hover:underline">
                Next
              </Link>
            ) : (
              <span className="text-body">Next</span>
            )}
          </nav>
        )}
      </section>
    </>
  );
}
