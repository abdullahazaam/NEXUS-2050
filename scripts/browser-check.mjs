import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--enable-webgl",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const errors = [];
const results = [];
try {
  for (const width of [1440, 1024, 768, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    page.on("pageerror", (error) => errors.push(`${width}: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error")
        errors.push(`${width}: ${message.text()}`);
    });
    await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
    await page.locator("canvas").waitFor({ timeout: 30000 });
    await page.screenshot({ path: `test-results/hero-${width}.png` });
    const overflow = await page.evaluate(() => ({
      viewport: innerWidth,
      body: document.documentElement.scrollWidth,
      items: [...document.querySelectorAll("main *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width > 0 &&
            r.right > innerWidth + 1 &&
            !el.closest(".hero-city,.vision-atmosphere,.sim-city")
          );
        })
        .map((el) => el.className)
        .slice(0, 10),
    }));
    assert.ok(
      overflow.body <= width,
      `Horizontal overflow at ${width}: ${JSON.stringify(overflow)}`,
    );
    for (const [name, title] of [
      ["Energy", "Renewable Energy"],
      ["Environment", "Environmental Monitoring"],
      ["Response", "Emergency Response"],
      ["Infrastructure", "Connected Infrastructure"],
      ["Safety", "Public Safety"],
      ["Mobility", "Smart Mobility"],
    ]) {
      await page.locator(".system-node").filter({ hasText: name }).click();
      await page
        .locator("#system-detail h3")
        .filter({ hasText: title })
        .waitFor();
    }
    for (const range of ["1H", "24H", "7D", "30D"]) {
      await page.getByRole("button", { name: range, exact: true }).click();
      assert.equal(
        await page
          .getByRole("button", { name: range, exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
      assert.ok(
        (await page.locator(".traffic-chart .chart-unit").innerText()).includes(
          range,
        ),
      );
    }
    await page.locator("#intelligence").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/command-${width}.png` });
    for (const name of [
      "Peak-Hour Pressure",
      "Emergency Mode",
      "Sustainable Future",
      "Normal Day",
    ]) {
      await page.getByRole("button", { name: new RegExp(name) }).click();
      assert.equal(
        await page
          .getByRole("button", { name: new RegExp(name) })
          .getAttribute("aria-pressed"),
        "true",
      );
    }
    const traffic = page.getByRole("slider", {
      name: "Traffic demand",
      exact: true,
    });
    await traffic.focus();
    await page.keyboard.press("End");
    assert.equal(await traffic.inputValue(), "100");
    assert.ok(
      (await page.locator(".sim-results .pill").innerText()).includes("CUSTOM"),
    );
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    assert.equal(await traffic.inputValue(), "55");
    for (const label of [
      "Public transport capacity",
      "Renewable energy allocation",
      "Industrial activity",
      "Emergency readiness",
    ]) {
      const slider = page.getByRole("slider", { name: label, exact: true });
      await slider.focus();
      await page.keyboard.press("Home");
      assert.equal(await slider.inputValue(), "0");
      await page.keyboard.press("End");
      assert.equal(await slider.inputValue(), "100");
    }
    await page.getByRole("button", { name: /Sustainable Future/ }).click();
    await page.locator("#simulation").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/simulation-${width}.png` });
    if (width === 390) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      assert.equal(await page.locator("#mobile-navigation").isVisible(), true);
      await page
        .locator("#mobile-navigation")
        .getByRole("link", { name: /Technology/ })
        .click();
      assert.equal(
        await page
          .getByRole("button", { name: "Open navigation" })
          .getAttribute("aria-expanded"),
        "false",
      );
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.keyboard.press("Escape");
      assert.equal(
        await page
          .getByRole("button", { name: "Open navigation" })
          .getAttribute("aria-expanded"),
        "false",
      );
    }
    const invalidAnchors = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.getAttribute("href"))
        .filter((href) => !document.querySelector(href)),
    );
    assert.deepEqual(invalidAnchors, []);
    await page
      .locator("#technology")
      .getByRole("button", { name: /Urban Sensors/ })
      .click();
    assert.ok(
      (await page.locator("#architecture-description").innerText()).includes(
        "COLLECT",
      ),
    );
    for (const id of [
      "overview",
      "systems",
      "intelligence",
      "simulation",
      "technology",
      "vision",
    ]) {
      await page
        .locator(`.footer a[href="#${id}"],.desktop-links a[href="#${id}"]`)
        .first()
        .evaluate((a) => a.click());
      assert.equal(new URL(page.url()).hash, `#${id}`);
    }
    await page.screenshot({
      path: `test-results/full-${width}.png`,
      fullPage: true,
    });
    results.push({
      width,
      overflow,
      controls: "passed",
      canvas: await page.locator("canvas").count(),
    });
    await page.close();
  }
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.locator(".preloader").waitFor({ state: "detached" });
  await page.screenshot({ path: "test-results/hero-animated.png" });
  await page
    .locator("canvas")
    .evaluate((canvas) =>
      canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
    );
  await page.locator(".city-fallback").waitFor();
  results.push({ contextLoss: "fallback passed" });
  await page.close();
  assert.deepEqual(errors, [], "Browser errors detected");
  await writeFile(
    "test-results/browser-report.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(JSON.stringify({ results, errors }, null, 2));
} finally {
  await browser.close();
}
