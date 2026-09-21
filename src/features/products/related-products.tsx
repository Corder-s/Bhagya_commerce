import { ProductCard } from "@/features/products/product-card";
import { marketingRoutes } from "@/config/routes";
import type { ProductDetail } from "@/types/catalogue";

export function RelatedProducts({ products }: { products: readonly ProductDetail[] }) {
  if (!products.length) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-20 border-t border-line pt-14">
      <h2
        id="related-heading"
        className="mb-8 text-display-xs font-bold text-ink"
      >
        You might also like
      </h2>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
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
