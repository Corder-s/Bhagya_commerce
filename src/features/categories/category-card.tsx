import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { MediaTile } from "@/components/common/media-tile";
import { marketingRoutes } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/catalogue";

/**
 * CategoryCard — editorial, not a product tile.
 *
 * Photograph on top, then the name in the display serif with a one-line
 * descriptor. The card links to the shop with the category pre-selected, which
 * is the route contract the catalogue service will honour in Phase 2.
 */
export function CategoryCard({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  return (
    <article className={cn("group h-full", className)}>
      <Link
        href={{ pathname: marketingRoutes.shop, query: { category: category.slug } }}
        className="flex h-full flex-col rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-canvas-deep">
          {category.image ? (
            <Image
              src={category.image.src}
              alt={category.image.alt}
              width={category.image.width}
              height={category.image.height}
              sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 70vw"
              className="size-full object-cover transition-transform duration-slow ease-brand group-hover:scale-[1.04]"
            />
          ) : (
            <MediaTile label={category.name} tone={category.tone} />
          )}
        </div>

        <div className="flex flex-1 items-start justify-between gap-4 pt-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-heading-lg text-ink">
              {category.name}
            </h3>
            <p className="text-body-sm text-ink-soft">{category.descriptor}</p>
          </div>
          <ArrowUpRight
            className="mt-1 size-4 shrink-0 text-ink-faint transition-colors duration-fast group-hover:text-primary"
            aria-hidden="true"
          />
        </div>
      </Link>
    </article>
  );
}
