import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
await mkdir("test-results/journey", { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--enable-webgl",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const errors = [],
  report = [];
try {
  for (const width of [1440, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
    await page.locator("canvas").waitFor();
    await page.locator(".preloader").waitFor({ state: "detached" });
    const extent = await page
      .locator("#overview")
      .evaluate((el) => el.getBoundingClientRect().height - innerHeight);
    const initial = await page
      .locator("canvas")
      .getAttribute("data-camera-position");
    const shots = [];
    for (const progress of [0, 0.18, 0.38, 0.58, 0.76, 0.92, 1]) {
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: "instant" }),
        extent * progress,
      );
      await page.waitForFunction(
        (p) =>
          Math.abs(
            Number(
              document
                .querySelector("canvas")
                ?.getAttribute("data-journey-progress"),
            ) - p,
          ) < 0.008,
        progress,
        { timeout: 20000 },
      );
      const frame = await page
        .locator("canvas")
        .evaluate((el) => ({
          position: el.dataset.cameraPosition,
          progress: el.dataset.journeyProgress,
          path: el.dataset.cameraPath,
        }));
      shots.push({ requested: progress, ...frame });
      assert.ok(
        Math.abs(
          await page
            .locator(".journey-stage")
            .evaluate((el) => el.getBoundingClientRect().top),
        ) < 2,
        "Stage must stay sticky",
      );
      assert.ok(
        await page.getByRole("link", { name: "Skip city journey" }).isVisible(),
      );
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        width,
      );
      await page.screenshot({
        path: `test-results/journey/${width}-${progress}.png`,
      });
    }
    assert.notEqual(
      initial,
      shots.at(-1).position,
      "Camera must physically move",
    );
    assert.equal(
      await page.locator(".hero-content").evaluate((el) => el.inert),
      true,
    );
    assert.equal(
      await page
        .locator(".journey-outro")
        .evaluate((el) => getComputedStyle(el).visibility),
      "visible",
    );
    await page.evaluate(
      (y) => window.scrollTo({ top: y + 300, behavior: "instant" }),
      extent,
    );
    assert.ok(
      (await page
        .locator(".journey-stage")
        .evaluate((el) => el.getBoundingClientRect().top)) < -200,
      "Sticky stage must release",
    );
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.getByRole("link", { name: "Skip city journey" }).click();
    const pulseTop = await page
      .locator("#pulse")
      .evaluate((el) => el.getBoundingClientRect().top);
    assert.ok(
      pulseTop >= 0 && pulseTop < 160,
      "Skip must land below navigation",
    );
    assert.equal(
      await page.evaluate(() => document.activeElement?.id),
      "pulse",
    );
    await page
      .getByRole("link", { name: "Back to Nexus 2050 overview", exact: true })
      .click();
    await page.waitForFunction(() => scrollY < 5);
    await page.waitForFunction(
      () =>
        Number(
          document
            .querySelector("canvas")
            ?.getAttribute("data-journey-progress"),
        ) < 0.008,
    );
    assert.equal(
      await page.locator(".hero-content").evaluate((el) => el.inert),
      false,
    );
    if (width === 1440) {
      await page.setViewportSize({ width: 390, height: 900 });
      await page.waitForFunction(
        () =>
          document.querySelector("canvas")?.getAttribute("data-camera-path") ===
          "mobile",
      );
    }
    report.push({ width, extent, shots, skip: true, release: true });
    await page.close();
  }
  const page = await browser.newPage({
    viewport: { width: 390, height: 900 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.locator("canvas").waitFor();
  const stable = await page
    .locator("canvas")
    .getAttribute("data-camera-position");
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
  assert.equal(
    await page.locator("canvas").getAttribute("data-camera-position"),
    stable,
  );
  assert.equal(
    await page
      .locator(".journey-stage")
      .evaluate((el) => getComputedStyle(el).position),
    "relative",
  );
  assert.equal(
    await page.locator("canvas").getAttribute("data-camera-path"),
    "reduced",
  );
  await page.getByRole("link", { name: "Skip city journey" }).click();
  report.push({ reducedMotion: true, stableCamera: true });
  await page.close();
  assert.deepEqual(errors, []);
  await writeFile(
    "test-results/journey/report.json",
    JSON.stringify({ report, errors }, null, 2),
  );
  console.log(JSON.stringify({ report, errors }, null, 2));
} finally {
  await browser.close();
}
