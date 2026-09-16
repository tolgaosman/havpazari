import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactCta } from "@/components/product/ContactCta";
import { LicenseNotice } from "@/components/product/LicenseNotice";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { SpecSheet } from "@/components/product/SpecSheet";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { getAllProductSlugs, getProductBySlug, getRelatedProducts, getSiteSettings } from "@/lib/api";
import { discountPercent, formatPrice, stockPresentation } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { StockStatus } from "@/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Ürün Bulunamadı" };

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

const AVAILABILITY: Record<StockStatus, string> = {
  in_stock: "https://schema.org/InStock",
  low_stock: "https://schema.org/LimitedAvailability",
  out_of_stock: "https://schema.org/OutOfStock",
  order_only: "https://schema.org/BackOrder",
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [related, settings] = await Promise.all([
    getRelatedProducts(product),
    getSiteSettings(),
  ]);
  const stock = stockPresentation(product.stockStatus);
  const discount = discountPercent(product.price, product.compareAtPrice);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand.name },
    image: product.images.map((image) => image.url),
    url: `${settings.url}/urun/${product.slug}`,
    ...(product.price !== null && {
      offers: {
        "@type": "Offer",
        priceCurrency: "TRY",
        price: product.price,
        availability: AVAILABILITY[product.stockStatus],
        url: `${settings.url}/urun/${product.slug}`,
      },
    }),
  };

  return (
    <div className="container-page pb-24 pt-32 sm:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        className="mb-8"
        items={[
          { label: "Mağaza", href: "/magaza" },
          { label: product.category.name, href: `/magaza?kategori=${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal immediate>
          <ProductGallery images={product.images} productName={product.name} />
        </Reveal>

        <Reveal immediate delay={0.08} className="flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span lang="en" className="font-mono text-xs uppercase tracking-[0.2em] text-ash-dim">
                {product.brand.name} · {product.sku}
              </span>
              {product.isNew && <Badge variant="brass">Yeni</Badge>}
            </div>
            <h1 lang="en" className="mt-2 text-display-sm font-bold uppercase leading-tight text-optic sm:text-display-md">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span
              className={cn("size-2 rounded-full", stock.dotClassName)}
              aria-hidden="true"
            />
            <span className={stock.textClassName}>{stock.label}</span>
          </div>

          {product.price !== null ? (
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-optic sm:text-4xl">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice !== null && (
                <>
                  <span className="text-lg text-ash-dim line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  {discount !== null && <Badge variant="blaze">%{discount} indirim</Badge>}
                </>
              )}
            </div>
          ) : (
            <p className="font-display text-2xl font-bold uppercase text-brass">
              Fiyat İçin Arayın
            </p>
          )}

          <p className="leading-relaxed text-ash">{product.description}</p>

          {product.requiresLicense && <LicenseNotice />}

          <ContactCta productName={product.name} sku={product.sku} settings={settings} />

          <SpecSheet specs={product.specs} />
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-steel pt-16 sm:mt-28 sm:pt-20">
          <Reveal className="mb-8 flex flex-col gap-3">
            <span className="rule-brass w-16" aria-hidden="true" />
            <h2 className="text-display-sm font-bold uppercase text-optic sm:text-display-md">
              Benzer Ürünler
            </h2>
          </Reveal>

          <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
            {related.map((item) => (
              <StaggerItem key={item.id}>
                <ProductCard product={item} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <div className="mt-16 text-center">
        <Link
          href="/magaza"
          className="font-display text-sm font-semibold uppercase tracking-wide text-brass transition-colors duration-200 hover:text-brass-bright"
        >
          ← Tüm ürünlere dön
        </Link>
      </div>
    </div>
  );
}
