import { describe, expect, it } from "vitest";
import { Vector3 } from "three";
import { sampleCameraPath } from "./cameraPath";
import { buildings, towerBounds } from "./cityLayout";

describe("cinematic camera safety", () => {
  for (const mobile of [false, true]) {
    it(`${mobile ? "mobile" : "desktop"} path clears all facades, roofs and ground, including parallax and near plane`, () => {
      const position = new Vector3(),
        target = new Vector3();
      // Covers the 0.08 near plane, a .025 close-shot pointer offset and extra headroom.
      const clearance = mobile ? 0.35 : 0.3;
      for (let i = 0; i <= 5000; i++) {
        sampleCameraPath(i / 5000, mobile, position, target);
        expect(position.y).toBeGreaterThan(2);
        expect(position.distanceTo(target)).toBeGreaterThan(1);
        for (const b of buildings) {
          const collision =
            Math.abs(position.x - b.x) < b.w / 2 + clearance &&
            Math.abs(position.z - b.z) < b.d / 2 + clearance &&
            position.y < b.h + clearance;
          if (collision)
            throw new Error(
              `Building at ${b.x},${b.z}; camera ${position.toArray()}; progress ${i / 5000}`,
            );
        }
        for (const b of towerBounds) {
          if (
            Math.abs(position.x - b.x) < b.w / 2 + clearance &&
            Math.abs(position.z - b.z) < b.d / 2 + clearance &&
            Math.abs(position.y - b.y) < b.h / 2 + clearance
          )
            throw new Error(`Tower collision at ${i / 5000}`);
        }
      }
    });
    it(`${mobile ? "mobile" : "desktop"} direction is continuous and the path descends into the city`, () => {
      const p = new Vector3(),
        t = new Vector3(),
        old = new Vector3(),
        direction = new Vector3();
      sampleCameraPath(0, mobile, p, t);
      const beginning = p.clone();
      old.copy(t).sub(p).normalize();
      for (let i = 1; i <= 2000; i++) {
        sampleCameraPath(i / 2000, mobile, p, t);
        direction.copy(t).sub(p).normalize();
        expect(direction.angleTo(old)).toBeLessThan(0.04);
        old.copy(direction);
      }
      expect(p.distanceTo(beginning)).toBeGreaterThan(25);
      expect(p.y).toBeLessThan(beginning.y / 2);
    });
  }
});
