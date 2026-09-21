"use client";

import { useEffect } from "react";

/**
 * Global error boundary — the last resort when the root layout itself fails.
 *
 * It must render its own `<html>`/`<body>` and cannot rely on any app chrome,
 * provider or font variable, so the styling here is intentionally inline and
 * minimal rather than pretending the design system is available.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[bhagya] root error:", error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F7F4EA",
          color: "#16221C",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#8A6D2F",
            }}
          >
            Bhagya Commerce
          </p>
          <h1
            style={{
              margin: "12px 0 0",
              fontSize: "28px",
              lineHeight: 1.2,
              fontWeight: 600,
            }}
          >
            The app failed to start
          </h1>
          <p style={{ margin: "12px 0 0", fontSize: "15px", color: "#5F6B64" }}>
            This is a rare, page-level failure. Reloading is usually enough. If it
            persists, quote the reference below when you contact support.
          </p>

          <button
            type="button"
            onClick={retry}
            style={{
              marginTop: "24px",
              minHeight: "44px",
              padding: "0 24px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#0B4D36",
              color: "#F7F4EA",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reload the app
          </button>

          {error.digest ? (
            <p style={{ marginTop: "16px", fontSize: "13px", color: "#6B756E" }}>
              Reference: <code>{error.digest}</code>
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
