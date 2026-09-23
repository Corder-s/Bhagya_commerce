import { ProductCard } from "@/features/products/product-card";
import { marketingRoutes } from "@/config/routes";
import type { ProductDetail } from "@/types/catalogue";

export function RelatedProducts({ products }: { products: readonly ProductDetail[] }) {
  if (!products.length) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-20 border-t border-line pt-14">
      <div className="mb-8">
        <p className="text-caption font-semibold uppercase tracking-[0.1em] text-gold-deep">
          Curated Discoveries
        </p>
        <h2
          id="related-heading"
          className="mt-1 font-display text-display-md font-medium text-ink"
        >
          You May Also Like
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            href={marketingRoutes.product(product.slug)}
          />
        ))}
      </div>
    </section>
  );
}
