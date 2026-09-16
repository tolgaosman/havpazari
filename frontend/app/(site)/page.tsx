import { BrandMarquee } from "@/components/home/BrandMarquee";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedRail } from "@/components/home/FeaturedRail";
import { Hero } from "@/components/home/Hero";
import { StoreStrip } from "@/components/home/StoreStrip";
import { getBrands, getCategories, getFeaturedProducts, getSiteSettings } from "@/lib/api";

export default async function HomePage() {
  const [categories, featuredProducts, brands, settings] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getBrands(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <CategoryGrid categories={categories} />
      <FeaturedRail products={featuredProducts} />
      <BrandMarquee brands={brands} />
      <StoreStrip settings={settings} />
    </>
  );
}
