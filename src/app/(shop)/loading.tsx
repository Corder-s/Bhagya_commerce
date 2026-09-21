import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

/**
 * Loading state for the commerce group.
 *
 * Skeleton mirrors the real cart/checkout layout (items column + summary rail) so
 * the transition into content is positionally stable rather than a jump.
 */
export default function ShopLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="container-page py-8 sm:py-10 lg:py-12"
    >
      <span className="sr-only">Loading your cart</span>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-56 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <SkeletonCard key={index} className="flex-row items-center" />
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton lines={3} />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
