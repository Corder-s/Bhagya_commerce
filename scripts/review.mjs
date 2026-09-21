/**
 * Review pass: screenshots for design review, plus a scroll test that proves
 * every reveal element actually becomes visible (not just "should").
 *
 * Run with:  LD_LIBRARY_PATH=... node scripts/review.mjs
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
mkdirSync("screenshots", { recursive: true });

const browser = await chromium.launch({ channel: "chromium" });

/* ---------------------------------------------------------------- screenshots */
// Reduced motion so the full-page capture shows the finished state rather than
// elements still waiting for their scroll trigger (the CSS reveal is what a
// reduced-motion visitor sees anyway: content, no movement).
for (const viewport of [
  { name: "1440", width: 1440, height: 900 },
  { name: "1024", width: 1024, height: 800 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
  { name: "320", width: 320, height: 720 },
]) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  for (const path of ["/", "/start-selling", "/shop"]) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    // Walk the page first: full-page screenshots are captured without real
    // scrolling, so scroll-triggered reveals would otherwise be photographed in
    // their hidden state.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 45));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    const slug = path === "/" ? "home" : path.slice(1);
    await page.screenshot({
      path: `screenshots/${slug}-${viewport.name}.png`,
      fullPage: true,
    });
  }
  await context.close();
}

/* ------------------------------------------------------------- reveal behaviour */
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
await page.goto(BASE + "/", { waitUntil: "networkidle" });

const before = await page.evaluate(() => {
  const all = [...document.querySelectorAll("[data-reveal], [data-reveal-group]")];
  const hidden = all.filter((el) => Number(getComputedStyle(el).opacity) < 0.9);
  return { total: all.length, hidden: hidden.length };
});

// Scroll the whole page the way a visitor would, then let the last reveal settle.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.75;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((resolve) => setTimeout(resolve, 60));
  }
});
await page.waitForTimeout(1200);

const after = await page.evaluate(() => {
  const all = [...document.querySelectorAll("[data-reveal], [data-reveal-group]")];
  const stillHidden = all.filter((el) => Number(getComputedStyle(el).opacity) < 0.9);
  const children = [...document.querySelectorAll("[data-reveal-group] > *")];
  const hiddenChildren = children.filter((el) => Number(getComputedStyle(el).opacity) < 0.9);
  return {
    total: all.length,
    hidden: stillHidden.length,
    children: children.length,
    hiddenChildren: hiddenChildren.length,
  };
});

// No-JS simulation: strip the html.js class and confirm nothing stays hidden.
const noJs = await page.evaluate(() => {
  document.documentElement.classList.remove("js");
  return [...document.querySelectorAll("[data-reveal], [data-reveal-group], [data-reveal-group] > *")]
    .filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length;
});

console.log(JSON.stringify({ beforeReveal: before, afterScroll: after, hiddenWithoutJs: noJs }, null, 1));

await context.close();
await browser.close();
