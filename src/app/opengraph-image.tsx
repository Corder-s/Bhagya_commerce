import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

/**
 * Default Open Graph card (1200×630).
 *
 * Typography note: satori ships with a default sans only, so this card uses the
 * system sans stack rather than the editorial serif. Fetching Cormorant for OG
 * rendering would add a network dependency to every build — a deliberate
 * trade-off until OG images are rendered from real content in Phase 2.
 */
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LEAF_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="88" height="88"><g><path d="M16 29.2c0-6.4.9-11.4 3.9-15.3C22.7 10.4 25.6 8.6 29 7.6c1 5.4.4 10.2-2 13.8-2.4 3.6-6.3 5.6-11 5.7Z" fill="#F7F4EA" opacity="0.94"/><path d="M16 29.2c0-6.4-.9-11.4-3.9-15.3C9.3 10.4 6.4 8.6 3 7.6c-1 5.4-.4 10.2 2 13.8 2.4 3.6 6.3 5.6 11 5.7Z" fill="#F7F4EA" opacity="0.66"/><path d="M16 29.2V12.6" stroke="#0B4D36" stroke-width="2" stroke-linecap="round" opacity="0.85"/><circle cx="16" cy="30.2" r="1.5" fill="#F7F4EA"/></g></svg>`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#0B4D36",
          padding: "64px 72px",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            alt=""
            width={88}
            height={88}
            src={`data:image/svg+xml;base64,${Buffer.from(LEAF_SVG).toString("base64")}`}
          />
          <span
            style={{
              fontSize: 34,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#F7F4EA",
            }}
          >
            Bhagya Commerce
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 74, fontWeight: 600, color: "#F7F4EA", lineHeight: 1.05 }}>
            Good for People.
          </span>
          <span style={{ fontSize: 74, fontWeight: 600, color: "#C9D6CD", lineHeight: 1.05 }}>
            Great for Tomorrow.
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 26, color: "#C9D6CD" }}>
            A conscious marketplace for independent Indian brands
          </span>
          <span
            style={{
              fontSize: 22,
              color: "#B89552",
              border: "1px solid #B89552",
              borderRadius: 9999,
              padding: "10px 22px",
            }}
          >
            bhagyacommerce.com
          </span>
        </div>
      </div>
    ),
    size,
  );
}
