import { ImageResponse } from "next/og";

/**
 * Apple touch icon — generated from the same brand geometry as the SVG mark so
 * the leaf never drifts between the favicon, the app icon and the OG image.
 * 180×180 is the standard iOS home-screen size.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const LEAF_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="180" height="180"><rect width="32" height="32" rx="7" fill="#0B4D36"/><g transform="translate(2.4 1.2) scale(0.85)"><path d="M16 29.2c0-6.4.9-11.4 3.9-15.3C22.7 10.4 25.6 8.6 29 7.6c1 5.4.4 10.2-2 13.8-2.4 3.6-6.3 5.6-11 5.7Z" fill="#F7F4EA" opacity="0.94"/><path d="M16 29.2c0-6.4-.9-11.4-3.9-15.3C9.3 10.4 6.4 8.6 3 7.6c-1 5.4-.4 10.2 2 13.8 2.4 3.6 6.3 5.6 11 5.7Z" fill="#F7F4EA" opacity="0.66"/><path d="M16 29.2V12.6" stroke="#0B4D36" stroke-width="2" stroke-linecap="round" opacity="0.85"/><circle cx="16" cy="30.2" r="1.5" fill="#F7F4EA"/></g></svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B4D36",
        }}
      >
        <img
          alt=""
          width={180}
          height={180}
          src={`data:image/svg+xml;base64,${Buffer.from(LEAF_SVG).toString("base64")}`}
        />
      </div>
    ),
    size,
  );
}
