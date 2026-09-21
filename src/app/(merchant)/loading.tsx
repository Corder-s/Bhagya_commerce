import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

/** Workspace loading state — KPI row, then a table-shaped block. */
export default function MerchantLoading() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-8">
      <span className="sr-only">Loading workspace</span>

      <div className="flex flex-col gap-3 border-b border-line pb-6">
        <Skeleton className="h-7 w-56 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} className="h-32" />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-md border border-line bg-surface p-4"
          >
            <Skeleton variant="circle" className="size-10 rounded-md" />
            <Skeleton className="w-1/4" />
            <Skeleton className="ml-auto w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
