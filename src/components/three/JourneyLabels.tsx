import { useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { cityMotion } from "../../hooks/useCityMotion";
const labels = [
  {
    point: [0, 0.4, 8] as [number, number, number],
    title: "Mobility Grid",
    detail: "Operational",
    start: 0.28,
    end: 0.57,
  },
  {
    point: [3.45, 3.8, 3.45] as [number, number, number],
    title: "Energy District",
    detail: "73% Renewable",
    start: 0.4,
    end: 0.66,
  },
  {
    point: [0, 6.8, 0] as [number, number, number],
    title: "Central Intelligence Core",
    detail: "24 districts connected",
    start: 0.56,
    end: 0.81,
  },
  {
    point: [2.3, 2.5, -2.3] as [number, number, number],
    title: "Environmental Node",
    detail: "AQI 38",
    start: 0.7,
    end: 0.86,
  },
  {
    point: [3.45, 4.4, -8.05] as [number, number, number],
    title: "Connected District 07",
    detail: "Command network",
    start: 0.85,
    end: 0.98,
  },
];
function Label({
  item,
  reduced,
}: {
  item: (typeof labels)[number];
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useFrame(() => {
    if (!ref.current) return;
    const p = cityMotion.progress;
    const opacity = reduced
      ? 0
      : MathUtils.smoothstep(p, item.start, item.start + 0.05) *
        (1 - MathUtils.smoothstep(p, item.end - 0.04, item.end));
    ref.current.style.opacity = String(opacity);
    ref.current.style.visibility = opacity > 0.01 ? "visible" : "hidden";
  });
  return (
    <Html
      position={item.point}
      center
      zIndexRange={[12, 1]}
      style={{ pointerEvents: "none" }}
    >
      <div
        ref={ref}
        className="journey-label"
        aria-hidden="true"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <span className="journey-label-stem" />
        <strong>{item.title}</strong>
        <span>{item.detail}</span>
        <small>DEMO SIMULATION DATA</small>
      </div>
    </Html>
  );
}
export default function JourneyLabels({
  mobile,
  reduced,
}: {
  mobile: boolean;
  reduced: boolean;
}) {
  const visible = useMemo(
    () =>
      mobile ? labels.filter((_, i) => i === 0 || i === 2 || i === 4) : labels,
    [mobile],
  );
  return (
    <>
      {visible.map((item) => (
        <Label key={item.title} item={item} reduced={reduced} />
      ))}
    </>
  );
}
