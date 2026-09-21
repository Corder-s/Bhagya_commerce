import { Skeleton } from "@/components/ui/skeleton";

/** Account-area loading state — header, sidebar and content rows. */
export default function CustomerLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="container-page py-8 sm:py-10 lg:py-12"
    >
      <span className="sr-only">Loading your account</span>

      <div className="flex flex-col gap-3 border-b border-line pb-6">
        <Skeleton className="h-7 w-48 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div className="hidden flex-col gap-2 lg:flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} variant="block" className="h-32" />
          ))}
        </div>
      </div>
    </div>
  );
}
