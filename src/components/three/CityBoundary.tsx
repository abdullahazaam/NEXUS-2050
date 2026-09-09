import { Component, lazy, Suspense } from "react";
import type { ReactNode } from "react";
const CityScene = lazy(() => import("./CityScene"));
export function CityFallback() {
  return (
    <div
      className="city-fallback"
      role="img"
      aria-label="Illustrated smart city skyline with connected towers"
    >
      <div className="fallback-grid" />
      {Array.from({ length: 25 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${i * 4}%`,
            height: `${18 + ((i * 37) % 49)}%`,
            width: `${2 + (i % 3)}%`,
          }}
        />
      ))}
      <div className="fallback-core" />
    </div>
  );
}
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <CityFallback /> : this.props.children;
  }
}
export default function CityBoundary() {
  return (
    <Boundary>
      <Suspense fallback={<CityFallback />}>
        <CityScene />
      </Suspense>
    </Boundary>
  );
}
