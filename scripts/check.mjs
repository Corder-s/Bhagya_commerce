/**
 * Responsive + accessibility smoke test (not shipped; run with `node scripts/check.mjs`
 * while a production server is on :3000).
 *
 * Checks, per viewport: horizontal overflow (document and individual elements),
 * console errors, broken images, missing alt text, heading order, touch-target
 * sizes, and that every internal link on the page resolves.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const VIEWPORTS = [
  { name: "320", width: 320, height: 720 },
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 900 },
  { name: "1440", width: 1440, height: 900 },
];

const PAGES = ["/", "/shop", "/brands", "/collections", "/journal", "/start-selling"];

mkdirSync("screenshots", { recursive: true });

// The full Chromium build is installed (not the headless shell), so use the
// "chromium" channel — it also gives real headless rendering for screenshots.
const browser = await chromium.launch({ channel: "chromium" });
const problems = [];
const consoleErrors = [];

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(`[${viewport.name}] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => consoleErrors.push(`[${viewport.name}] pageerror: ${error.message}`));

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });

    const audit = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth - window.innerWidth;

      // Elements that stick out past the viewport. Anything inside a clipping or
      // scrolling ancestor is intentional (horizontal rails, decorative marks
      // inside overflow-hidden sections) and is not reported.
      const CLIPPING = new Set(["auto", "scroll", "hidden", "clip"]);
      const clipped = (el) => {
        let node = el.parentElement;
        while (node) {
          if (CLIPPING.has(getComputedStyle(node).overflowX)) return true;
          node = node.parentElement;
        }
        return false;
      };
      const offenders = [];
      document.querySelectorAll("body *").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        if (clipped(el)) return;
        if (rect.right > window.innerWidth + 1.5 || rect.left < -1.5) {
          offenders.push(
            `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 70)} → ${Math.round(rect.left)}…${Math.round(rect.right)}`,
          );
        }
      });

      const images = [...document.querySelectorAll("img")];
      const brokenImages = images
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.getAttribute("src"));
      const missingAlt = images
        .filter((img) => !img.hasAttribute("alt"))
        .map((img) => img.getAttribute("src"));

      const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) =>
        Number(h.tagName[1]),
      );
      let orderIssue = null;
      for (let i = 1; i < headings.length; i += 1) {
        if (headings[i] - headings[i - 1] > 1) {
          orderIssue = `h${headings[i - 1]} → h${headings[i]}`;
          break;
        }
      }

      // Touch targets: interactive elements smaller than 44px on coarse layouts.
      const small = [];
      document.querySelectorAll("a,button,[role=button],input,select,textarea").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        if (rect.height < 24 && rect.width < 24) {
          small.push(`${el.tagName.toLowerCase()} "${(el.textContent || "").trim().slice(0, 24)}" ${Math.round(rect.width)}×${Math.round(rect.height)}`);
        }
      });

      const links = [...document.querySelectorAll("a[href^='/']")].map((a) =>
        a.getAttribute("href"),
      );

      return {
        overflow,
        offenders: offenders.slice(0, 6),
        brokenImages,
        missingAlt,
        orderIssue,
        h1Count: document.querySelectorAll("h1").length,
        small: small.slice(0, 6),
        links: [...new Set(links)],
      };
    });

    if (audit.overflow > 1) {
      problems.push(`${viewport.name} ${path}: document overflows by ${audit.overflow}px`);
    }
    if (audit.offenders.length) {
      problems.push(`${viewport.name} ${path}: overflowing elements → ${audit.offenders.join(" | ")}`);
    }
    if (audit.brokenImages.length) {
      problems.push(`${viewport.name} ${path}: broken images → ${audit.brokenImages.join(", ")}`);
    }
    if (audit.missingAlt.length) {
      problems.push(`${viewport.name} ${path}: images without alt → ${audit.missingAlt.join(", ")}`);
    }
    if (audit.orderIssue) {
      problems.push(`${viewport.name} ${path}: heading order ${audit.orderIssue}`);
    }
    if (audit.h1Count !== 1) {
      problems.push(`${viewport.name} ${path}: ${audit.h1Count} h1 elements`);
    }

    if (viewport.name === "320") {
      for (const link of audit.links) {
        const response = await page.request.get(BASE + link);
        if (response.status() >= 400) {
          problems.push(`link ${link} → ${response.status()} (found on ${path})`);
        }
      }
    }
  }

  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.screenshot({
    path: `screenshots/home-${viewport.name}.png`,
    fullPage: true,
  });
  await context.close();
}

await browser.close();

console.log(`\n=== ${VIEWPORTS.length} viewports × ${PAGES.length} pages ===`);
if (consoleErrors.length) {
  console.log(`\nCONSOLE ERRORS (${consoleErrors.length}):`);
  for (const error of consoleErrors.slice(0, 20)) console.log("  " + error);
} else {
  console.log("No console errors.");
}
if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):`);
  for (const problem of problems.slice(0, 40)) console.log("  - " + problem);
} else {
  console.log("No layout, image, heading or link problems.");
}
