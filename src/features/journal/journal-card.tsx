import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { MediaTile } from "@/components/common/media-tile";
import { marketingRoutes } from "@/config/routes";
import { formatDate, formatReadingTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { JournalPost } from "@/types/catalogue";

/**
 * JournalCard — an article in the editorial grid.
 *
 * Photograph optional by design: the CMS will not always have art on publish
 * day, and a tile reads better than a grey box. The category and reading time
 * sit above the headline in small caps, the way a magazine standfirst does.
 */
export function JournalCard({
  post,
  className,
}: {
  post: JournalPost;
  className?: string;
}) {
  return (
    <article className={cn("group flex h-full flex-col", className)}>
      <div className="relative aspect-3/2 overflow-hidden rounded-lg bg-canvas-deep">
        {post.image ? (
          <Image
            src={post.image.src}
            alt={post.image.alt}
            width={post.image.width}
            height={post.image.height}
            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
            className="size-full object-cover transition-transform duration-slow ease-brand group-hover:scale-[1.03]"
          />
        ) : (
          <MediaTile label={post.category} tone={post.tone} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 pt-4">
        <p className="label-text text-gold-deep">
          {post.category}
          <span className="text-ink-faint"> · {formatReadingTime(post.readingTimeMinutes)}</span>
        </p>

        <h3 className="font-display text-heading-xl text-ink text-balance">
          <Link
            href={marketingRoutes.journal}
            className="hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-body-sm text-ink-soft">{post.excerpt}</p>

        <p className="mt-auto flex items-center gap-2 pt-3 text-caption text-ink-faint">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <ArrowRight
            className="size-3.5 transition-transform duration-fast group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </p>
      </div>
    </article>
  );
}
