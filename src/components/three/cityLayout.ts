// Shared by the instanced city and camera-clearance tests. Dimensions are world units.
export const cityRandom = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const buildings = Array.from({ length: 144 }, (_, i) => {
  const x = ((i % 12) - 5.5) * 2.3;
  const z = (Math.floor(i / 12) - 5.5) * 2.3;
  return {
    x,
    z,
    h: 0.9 + cityRandom(i + 2) * (Math.hypot(x, z) < 8 ? 5.8 : 3.4),
    w: 0.7 + cityRandom(i + 6) * 0.65,
    d: 0.65 + cityRandom(i + 8) * 0.65,
  };
}).filter(
  (b) => Math.hypot(b.x, b.z) > 3.1 && !(b.x > 3 && b.z > 2 && b.z < 7),
);

export const towerBounds = [0, 1, 2].map((i) => ({
  x: 0,
  z: 0,
  y: 1.25 + i * 2.1,
  w: 2.1 - i * 0.4,
  d: 2.1 - i * 0.4,
  h: 2.5,
}));
