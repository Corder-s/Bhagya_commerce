"use client";

import { useEffect } from "react";
import Link from "next/link";

import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/**
 * Route-level error boundary.
 *
 * Next 16 passes `{ error, retry }` — `retry()` re-renders the segment (the old
 * `reset()` name is gone). No stack trace or raw message is shown to the user;
 * the digest is surfaced so support can match it to server logs.
 */
export default function RouteError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // Phase 3 replaces this with the observability pipeline.
    console.error("[bhagya] route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center bg-canvas">
      <Container width="narrow" className="px-0">
        <ErrorState
          layout="page"
          size="lg"
          titleAs="h1"
          title="This page could not be loaded"
          description="Something went wrong while rendering this page. Trying again usually fixes it; if it keeps happening, the reference below helps us find the cause."
          digest={error.digest}
          onRetry={retry}
          secondaryAction={
            <Button asChild variant="ghost" size="md">
              <Link href="/">Return home</Link>
            </Button>
          }
        />
      </Container>
    </div>
  );
}
