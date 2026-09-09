import { CatmullRomCurve3, MathUtils, Vector3 } from "three";

export const journeyStops = [0, 0.18, 0.38, 0.58, 0.76, 0.92, 1];
type Point = [number, number, number];
const desktopPositions: Point[] = [
  [22, 21, 26],
  [13, 17, 23],
  [2.3, 9, 16],
  [2.3, 3.1, 7],
  [2.3, 2.8, 1.8],
  [2.3, 3.1, -4.5],
  [2.3, 3.8, -7],
];
const desktopTargets: Point[] = [
  [-6, 2, 0],
  [-2, 2, 0],
  [2.3, 3, 3],
  [0.5, 3.3, -1],
  [0, 4, -1],
  [1.8, 3, -10],
  [3, 3, -14],
];
// The mobile route stays above every roof; it shares the same district approach.
const mobilePositions: Point[] = [
  [42, 43, 58],
  [26, 28, 38],
  [9, 17, 25],
  [3.8, 10, 15],
  [3.8, 8.2, 7],
  [3.8, 8.5, 1],
  [4.6, 9, -3],
];
const mobileTargets: Point[] = [
  [0, 11, 0],
  [0, 8, 0],
  [0, 4, 0],
  [0, 3, -1],
  [0, 3, -2],
  [1, 3, -7],
  [3, 3, -12],
];
const curve = (points: Point[]) =>
  new CatmullRomCurve3(
    points.map((p) => new Vector3(...p)),
    false,
    "centripetal",
  );
const routes = {
  desktop: { position: curve(desktopPositions), target: curve(desktopTargets) },
  mobile: { position: curve(mobilePositions), target: curve(mobileTargets) },
};

// Keyframe timing is separate from curve geometry. One shared parameter keeps the
// camera on the collision-tested path, even after a fast wheel or anchor jump.
export function sampleCameraPath(
  progress: number,
  mobile: boolean,
  position: Vector3,
  target: Vector3,
) {
  const p = MathUtils.clamp(progress, 0, 1);
  let segment = 0;
  while (segment < journeyStops.length - 2 && p > journeyStops[segment + 1])
    segment++;
  const local =
    (p - journeyStops[segment]) /
    (journeyStops[segment + 1] - journeyStops[segment]);
  const t = (segment + local) / (journeyStops.length - 1);
  const route = routes[mobile ? "mobile" : "desktop"];
  route.position.getPoint(t, position);
  route.target.getPoint(t, target);
}
