import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";
import { cityMotion } from "../../hooks/useCityMotion";
import { sampleCameraPath } from "./cameraPath";

export default function CameraRig({
  mobile,
  reduced,
}: {
  mobile: boolean;
  reduced: boolean;
}) {
  const { camera, pointer, gl } = useThree();
  const progress = useRef(cityMotion.progress);
  const vectors = useMemo(
    () => ({ position: new Vector3(), target: new Vector3() }),
    [],
  );
  useFrame((_, delta) => {
    progress.current = reduced
      ? 0
      : MathUtils.damp(
          progress.current,
          cityMotion.progress,
          9,
          Math.min(delta, 0.1),
        );
    sampleCameraPath(
      progress.current,
      mobile,
      vectors.position,
      vectors.target,
    );
    // At street level, the maximum offset is 0.025 units inside a 0.95-unit clear corridor.
    const parallax =
      mobile || reduced
        ? 0
        : MathUtils.lerp(
            0.22,
            0.025,
            MathUtils.smoothstep(progress.current, 0.15, 0.5),
          );
    vectors.position.x += pointer.x * parallax;
    vectors.position.y += pointer.y * parallax * 0.45;
    camera.position.copy(vectors.position);
    camera.up.set(0, 1, 0);
    camera.lookAt(vectors.target);
    // Development-only instrumentation lets browser tests inspect real camera movement.
    if (import.meta.env.DEV) {
      gl.domElement.dataset.cameraPosition = camera.position
        .toArray()
        .map((n) => n.toFixed(3))
        .join(",");
      gl.domElement.dataset.journeyProgress = progress.current.toFixed(3);
      gl.domElement.dataset.cameraPath = reduced
        ? "reduced"
        : mobile
          ? "mobile"
          : "desktop";
    }
  }, -1);
  return null;
}
