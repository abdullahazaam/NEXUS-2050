import { describe, expect, it } from "vitest";
import { presets, simulate } from "./simulation";
describe("urban simulation relationships", () => {
  it("higher traffic increases congestion and carbon", () => {
    const normal = simulate(presets["Normal Day"]);
    const busy = simulate({ ...presets["Normal Day"], traffic: 95 });
    expect(busy.congestion).toBeGreaterThan(normal.congestion);
    expect(busy.carbon).toBeGreaterThan(normal.carbon);
  });
  it("transit relieves congestion and renewable energy reduces emissions", () => {
    const normal = simulate(presets["Normal Day"]);
    expect(
      simulate({ ...presets["Normal Day"], transport: 100 }).congestion,
    ).toBeLessThan(normal.congestion);
    expect(
      simulate({ ...presets["Normal Day"], renewable: 100 }).carbon,
    ).toBeLessThan(normal.carbon);
  });
  it("readiness lowers response time", () => {
    expect(
      simulate({ ...presets["Normal Day"], readiness: 100 }).response,
    ).toBeLessThan(
      simulate({ ...presets["Normal Day"], readiness: 20 }).response,
    );
  });
  it("industry increases emissions and reduces stability", () => {
    const low = simulate({ ...presets["Normal Day"], industry: 0 }),
      high = simulate({ ...presets["Normal Day"], industry: 100 });
    expect(high.carbon).toBeGreaterThan(low.carbon);
    expect(high.stability).toBeLessThan(low.stability);
  });
  it("sustainable preset outperforms peak-hour pressure", () => {
    expect(simulate(presets["Sustainable Future"]).efficiency).toBeGreaterThan(
      simulate(presets["Peak-Hour Pressure"]).efficiency,
    );
  });
  it("keeps outputs bounded at input extremes and is deterministic", () => {
    for (let mask = 0; mask < 32; mask++) {
      const input = {
        traffic: mask & 1 ? 100 : 0,
        transport: mask & 2 ? 100 : 0,
        renewable: mask & 4 ? 100 : 0,
        industry: mask & 8 ? 100 : 0,
        readiness: mask & 16 ? 100 : 0,
      };
      const output = simulate(input);
      expect(output).toEqual(simulate(input));
      for (const key of ["efficiency", "congestion", "stability"] as const) {
        expect(output[key]).toBeGreaterThanOrEqual(0);
        expect(output[key]).toBeLessThanOrEqual(100);
      }
      expect(output.response).toBeGreaterThan(0);
    }
  });
});
