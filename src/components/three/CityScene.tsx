import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import { cityMotion } from "../../hooks/useCityMotion";
import { CityFallback } from "./CityBoundary";

import { buildings, cityRandom as random } from "./cityLayout";
import CameraRig from "./CameraRig";
import JourneyLabels from "./JourneyLabels";
function Buildings() {
  const bodies = useRef<THREE.InstancedMesh>(null);
  const windows = useRef<THREE.InstancedMesh>(null);
  const rims = useRef<THREE.InstancedMesh>(null);
  const matrices = useMemo(() => {
    const obj = new THREE.Object3D();
    const body: THREE.Matrix4[] = [],
      glass: THREE.Matrix4[] = [],
      rim: THREE.Matrix4[] = [];
    buildings.forEach((b, i) => {
      obj.position.set(b.x, b.h / 2, b.z);
      obj.scale.set(b.w, b.h, b.d);
      obj.updateMatrix();
      body.push(obj.matrix.clone());
      obj.position.set(b.x, b.h + 0.035, b.z);
      obj.scale.set(b.w + 0.03, 0.055, b.d + 0.03);
      obj.updateMatrix();
      rim.push(obj.matrix.clone());
      for (
        let floor = 0.3;
        floor < b.h - 0.15;
        floor += Math.hypot(b.x, b.z) > 12 ? 0.58 : 0.29
      ) {
        for (let side = 0; side < 4; side++) {
          if (random(i * 19 + floor * 8 + side) > 0.25) {
            obj.position.set(
              b.x +
                (side % 2 === 0
                  ? (side === 0 ? 1 : -1) * (b.w / 2 + 0.006)
                  : 0),
              floor,
              b.z +
                (side % 2 === 1
                  ? (side === 1 ? 1 : -1) * (b.d / 2 + 0.006)
                  : 0),
            );
            obj.scale.set(
              side % 2 === 0 ? 0.014 : b.w * 0.77,
              0.045,
              side % 2 === 1 ? 0.014 : b.d * 0.77,
            );
            obj.updateMatrix();
            glass.push(obj.matrix.clone());
          }
        }
      }
    });
    return { body, glass, rim };
  }, []);
  useEffect(() => {
    matrices.body.forEach((m, i) => {
      bodies.current?.setMatrixAt(i, m);
      bodies.current?.setColorAt(
        i,
        new THREE.Color(
          buildings[i].z < 0
            ? "#7395ba"
            : buildings[i].x > 0
              ? "#83bdb0"
              : "#9cc7d1",
        ),
      );
    });
    matrices.glass.forEach((m, i) => windows.current?.setMatrixAt(i, m));
    matrices.rim.forEach((m, i) => rims.current?.setMatrixAt(i, m));
    [bodies, windows, rims].forEach((ref) => {
      if (ref.current) {
        ref.current.instanceMatrix.needsUpdate = true;
        ref.current.computeBoundingSphere();
      }
    });
  }, [matrices]);
  return (
    <>
      <instancedMesh
        ref={bodies}
        args={[undefined, undefined, matrices.body.length]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#173a49"
          metalness={0.7}
          roughness={0.38}
        />
      </instancedMesh>
      <instancedMesh
        ref={windows}
        args={[undefined, undefined, matrices.glass.length]}
      >
        <boxGeometry />
        <meshBasicMaterial color="#6fdce2" transparent opacity={0.72} />
      </instancedMesh>
      <instancedMesh
        ref={rims}
        args={[undefined, undefined, matrices.rim.length]}
      >
        <boxGeometry />
        <meshBasicMaterial color="#27868d" />
      </instancedMesh>
    </>
  );
}
function Scene({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const sunlight = useRef<THREE.DirectionalLight>(null);
  const traffic = useRef<THREE.InstancedMesh>(null);
  const nodes = useRef<THREE.Group>(null);
  const core = useRef<THREE.MeshStandardMaterial>(null);
  const { scene } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const fog = useMemo(() => new THREE.FogExp2("#0c1e29", 0.021), []);
  const atmosphere = useMemo(
    () =>
      ["#102a36", "#16323e", "#10242d", "#07121d"].map(
        (color) => new THREE.Color(color),
      ),
    [],
  );
  useEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);
  const trafficCount = mobile ? 12 : 28;
  const pointPositions = useMemo(
    () =>
      new Float32Array(
        Array.from({ length: (mobile ? 35 : 85) * 3 }, (_, i) =>
          i % 3 === 1 ? random(i) * 13 : (random(i) - 0.5) * 35,
        ),
      ),
    [mobile],
  );
  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime;
    if (core.current)
      core.current.emissiveIntensity =
        0.6 + (reduced ? 0 : Math.sin(t * 0.7) * 0.2);
    if (nodes.current)
      nodes.current.position.y = reduced ? 0 : Math.sin(t * 0.55) * 0.12;
    const phase = cityMotion.phase;
    const phaseIndex = Math.min(2, Math.floor(phase));
    fog.color
      .copy(atmosphere[phaseIndex])
      .lerp(atmosphere[phaseIndex + 1], phase - phaseIndex);
    fog.density =
      0.019 +
      phase * 0.002 +
      THREE.MathUtils.smoothstep(cityMotion.progress, 0.86, 1) * 0.028;
    if (sunlight.current)
      sunlight.current.intensity = 1.6 + Math.sin((phase / 3) * Math.PI) * 1.4;
    for (let i = 0; i < trafficCount; i++) {
      const lane = [-9.2, -4.6, 2.3, 4.6, 9.2][i % 5];
      const travel = ((t * (1.1 + phase * 0.16) + i * 3.1) % 28) - 14;
      dummy.position.set(i % 2 ? lane : travel, 0.07, i % 2 ? travel : lane);
      dummy.scale.set(i % 2 ? 0.045 : 0.48, 0.035, i % 2 ? 0.48 : 0.045);
      dummy.updateMatrix();
      traffic.current?.setMatrixAt(i, dummy.matrix);
    }
    if (traffic.current) traffic.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <>
      <CameraRig mobile={mobile} reduced={reduced} />
      <JourneyLabels mobile={mobile} reduced={reduced} />
      <ambientLight intensity={1.2} />
      <directionalLight
        ref={sunlight}
        position={[8, 18, 5]}
        intensity={2.2}
        color="#9bccdd"
      />
      <pointLight
        position={[0, 7, 0]}
        intensity={35}
        color="#43eced"
        distance={18}
      />
      <Buildings />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.3, 0.012, 0]}>
        <planeGeometry args={[0.92, 29]} />
        <meshStandardMaterial color="#102d38" roughness={0.8} />
      </mesh>
      {[1.91, 2.69].map((x) => (
        <mesh key={x} position={[x, 0.04, 0]}>
          <boxGeometry args={[0.024, 0.025, 29]} />
          <meshBasicMaterial color="#53aaa9" />
        </mesh>
      ))}
      {Array.from({ length: 24 }, (_, i) => (
        <mesh key={i} position={[2.3, 0.045, i * 1.2 - 14]}>
          <boxGeometry args={[0.025, 0.02, 0.28]} />
          <meshBasicMaterial color="#90d6c5" />
        </mesh>
      ))}
      <group position={[2.3, 2.5, -2.3]}>
        <mesh>
          <octahedronGeometry args={[0.16]} />
          <meshBasicMaterial color="#b5e2c2" />
        </mesh>
        <mesh position={[0, -1.25, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 2.5, 4]} />
          <meshBasicMaterial color="#73ada5" transparent opacity={0.35} />
        </mesh>
      </group>
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.075, 0.24, 8, 12, 1, true]} />
        <meshBasicMaterial
          color="#77ffe9"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <planeGeometry args={[35, 35]} />
        <meshStandardMaterial
          color="#0a1c27"
          metalness={0.65}
          roughness={0.4}
        />
      </mesh>
      <gridHelper
        args={[32.2, 14, "#236272", "#163744"]}
        position={[0, 0.008, 0]}
      />
      <gridHelper
        args={[36, 56, "#122b38", "#102735"]}
        position={[0, -0.025, 0]}
      />
      <group>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 1.25 + i * 2.1, 0]}>
            <boxGeometry args={[2.1 - i * 0.4, 2.5, 2.1 - i * 0.4]} />
            <meshStandardMaterial
              color="#1e5767"
              metalness={0.75}
              roughness={0.25}
            />
          </mesh>
        ))}
        {Array.from({ length: 23 }, (_, i) => (
          <mesh key={i} position={[0, 0.35 + i * 0.29, 0]}>
            <boxGeometry
              args={[
                i < 9 ? 2.13 : i < 16 ? 1.73 : 1.33,
                0.035,
                i < 9 ? 2.13 : i < 16 ? 1.73 : 1.33,
              ]}
            />
            <meshBasicMaterial color="#66d9dc" />
          </mesh>
        ))}
        <mesh position={[0, 8, 0]}>
          <cylinderGeometry args={[0.035, 0.065, 3.2, 6]} />
          <meshStandardMaterial
            ref={core}
            color="#9dffff"
            emissive="#62faff"
            emissiveIntensity={1}
          />
        </mesh>
        <mesh position={[0, 9.6, 0]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color="#d9ffff" />
        </mesh>
      </group>
      {[2.5, 3.1, 14.5].map((radius, i) => (
        <mesh
          key={radius}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.035, 0]}
        >
          <ringGeometry args={[radius, radius + 0.025, 80]} />
          <meshBasicMaterial
            color={i === 2 ? "#246578" : "#58cfd7"}
            transparent
            opacity={0.65}
          />
        </mesh>
      ))}
      <group ref={nodes}>
        {[
          [-7, 5, 0],
          [5, 6, -5],
          [7, 3, 8],
          [-6, 4, -9],
        ].map((p, i) => (
          <group key={i}>
            <Line
              points={[
                new THREE.Vector3(0, 7, 0),
                new THREE.Vector3(p[0] * 0.5, 8, p[2] * 0.5),
                new THREE.Vector3(...p),
              ]}
              color={i === 1 ? "#a193da" : "#4c9fba"}
              transparent
              opacity={0.45}
              lineWidth={0.7}
            />
            <mesh position={new THREE.Vector3(...p)}>
              <octahedronGeometry args={[0.17]} />
              <meshBasicMaterial color="#85f7e9" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[p[0], 0.08, p[2]]}>
              <ringGeometry args={[0.5, 0.55, 24]} />
              <meshBasicMaterial color="#56cfd0" transparent opacity={0.65} />
            </mesh>
          </group>
        ))}
      </group>
      <instancedMesh
        ref={traffic}
        args={[undefined, undefined, trafficCount]}
        frustumCulled={false}
      >
        <boxGeometry />
        <meshBasicMaterial color="#a2f7e6" />
      </instancedMesh>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pointPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#79a9bc"
          size={0.035}
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>
    </>
  );
}
export default function CityScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [quality, setQuality] = useState(1.4);
  const [failed, setFailed] = useState(false);
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches,
  );
  const reduced = !!useReducedMotion();
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const resize = () => setMobile(media.matches);
    media.addEventListener("change", resize);
    let intersecting = true;
    const update = () => setActive(intersecting && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        update();
      },
      { rootMargin: "100px" },
    );
    if (ref.current) observer.observe(ref.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      media.removeEventListener("change", resize);
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div className="city-canvas" ref={ref} aria-hidden="true">
      {failed ? (
        <CityFallback />
      ) : (
        <Canvas
          dpr={[1, mobile ? 1 : quality]}
          camera={{ position: [22, 21, 26], fov: 48, near: 0.08, far: 180 }}
          frameloop={active && !reduced ? "always" : "demand"}
          gl={{ antialias: !mobile, alpha: true, powerPreference: "low-power" }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => {
                e.preventDefault();
                setFailed(true);
              },
              { once: true },
            );
          }}
          fallback={<CityFallback />}
        >
          <PerformanceMonitor
            onDecline={() => setQuality(1)}
            flipflops={1}
            onFallback={() => setQuality(1)}
          >
            <Scene reduced={reduced} mobile={mobile} />
          </PerformanceMonitor>
        </Canvas>
      )}
    </div>
  );
}
