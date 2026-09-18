import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, AdaptiveDpr, PerformanceMonitor, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useShowcaseStore } from '../../store/useShowcaseStore';

// ============================================================================
// PROCEDURAL OPEN-PIT BENCH MESH & CONTOUR RINGS
// ============================================================================
function PitTerraceGeometry({ benchCount = 6, outerRadius = 7, depth = 4.2 }) {
  const { geometry, contourLines } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = [];
    const normals = [];
    const uvs = [];
    const lines = [];

    const segments = 48;
    const benchHeight = depth / benchCount;
    const radialStep = outerRadius / benchCount;

    // Generate concentric terrace steps (benches + slope faces)
    for (let b = 0; b < benchCount; b++) {
      const rOuter = outerRadius - b * radialStep;
      const rInner = outerRadius - (b + 1) * radialStep;
      const yTop = -b * benchHeight;
      const yBottom = -(b + 1) * benchHeight;

      // Extract contour ring coordinates for edge highlight
      const ringPoints = [];
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        const x = Math.cos(theta) * rOuter;
        const z = Math.sin(theta) * rOuter;
        ringPoints.push(new THREE.Vector3(x, yTop + 0.02, z));
      }
      lines.push(ringPoints);

      // Construct terrace flat bench surface & slope face
      for (let s = 0; s < segments; s++) {
        const t1 = (s / segments) * Math.PI * 2;
        const t2 = ((s + 1) / segments) * Math.PI * 2;

        const x1_o = Math.cos(t1) * rOuter;
        const z1_o = Math.sin(t1) * rOuter;
        const x2_o = Math.cos(t2) * rOuter;
        const z2_o = Math.sin(t2) * rOuter;

        const x1_i = Math.cos(t1) * rInner;
        const z1_i = Math.sin(t1) * rInner;
        const x2_i = Math.cos(t2) * rInner;
        const z2_i = Math.sin(t2) * rInner;

        // Flat bench ledge (quad)
        positions.push(
          x1_o, yTop, z1_o,
          x2_o, yTop, z2_o,
          x1_i, yTop, z1_i,

          x2_o, yTop, z2_o,
          x2_i, yTop, z2_i,
          x1_i, yTop, z1_i
        );
        for (let k = 0; k < 6; k++) {
          normals.push(0, 1, 0);
          uvs.push(0.5, 0.5);
        }

        // Steep slope face down to next bench level (quad)
        positions.push(
          x1_i, yTop, z1_i,
          x2_i, yTop, z2_i,
          x1_i, yBottom, z1_i,

          x2_i, yTop, z2_i,
          x2_i, yBottom, z2_i,
          x1_i, yBottom, z1_i
        );
        for (let k = 0; k < 6; k++) {
          normals.push(0, 0.3, 0.9);
          uvs.push(0.5, 0.5);
        }
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.computeVertexNormals();

    return { geometry: geo, contourLines: lines };
  }, [benchCount, outerRadius, depth]);

  return (
    <group>
      {/* Dark Graphite Strata Terrain */}
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial
          color="#0d0e10"
          roughness={0.88}
          metalness={0.22}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Luminous Bench Contour Rings */}
      {contourLines.map((pts, i) => {
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const isAccent = i === 2 || i === 4;
        return (
          <line key={i} geometry={lineGeo}>
            <lineBasicMaterial
              color={isAccent ? '#f5a524' : '#24272d'}
              transparent
              opacity={isAccent ? 0.45 : 0.6}
              linewidth={1}
            />
          </line>
        );
      })}
    </group>
  );
}

// ============================================================================
// STRATA AMBIENT DUST & MINERAL PARTICLES
// ============================================================================
function StrataDustParticles({ count = 450 }) {
  const pointsRef = useRef();

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 6.5;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -Math.random() * 4.5 + 0.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      sc[i] = Math.random() * 0.04 + 0.015;
    }
    return [pos, sc];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const prefersReducedMotion = useShowcaseStore.getState().prefersReducedMotion;
    if (!prefersReducedMotion) {
      pointsRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffd08a"
        transparent
        opacity={0.35}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================================================
// INTERACTIVE TELEMETRY RISK / VERIFIED NODE BEACON
// ============================================================================
function TelemetryBeacon({ node, isHovered, onHover, onClick }) {
  const pulseRef = useRef();
  const prefersReducedMotion = useShowcaseStore((s) => s.prefersReducedMotion);

  // Status-driven semantic colors
  const statusConfig = useMemo(() => {
    switch (node.status) {
      case 'risk':
        return { color: '#e0523f', glow: '#ff6b57', label: 'HAZARD', ringSpeed: 2.8 };
      case 'verifying':
        return { color: '#f5a524', glow: '#ffd08a', label: 'DGMS REVIEW', ringSpeed: 1.8 };
      case 'actioned':
        return { color: '#f5a524', glow: '#ffd08a', label: 'ACTION DISPATCHED', ringSpeed: 1.4 };
      case 'closed':
      default:
        return { color: '#2fbf71', glow: '#52e697', label: 'VERIFIED CLOSED', ringSpeed: 0.8 };
    }
  }, [node.status]);

  useFrame((state) => {
    if (pulseRef.current && !prefersReducedMotion) {
      const time = state.clock.getElapsedTime() * statusConfig.ringSpeed;
      const s = 1 + (time % 1.5) * 1.6;
      pulseRef.current.scale.set(s, s, s);
      pulseRef.current.material.opacity = Math.max(0, 0.7 - (time % 1.5) * 0.45);
    }
  });

  return (
    <group position={node.position}>
      {/* Emissive Core Sphere */}
      <mesh
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(node.id);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(node);
        }}
      >
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial
          color={statusConfig.color}
          emissive={statusConfig.color}
          emissiveIntensity={isHovered ? 2.5 : 1.6}
          roughness={0.2}
        />
      </mesh>

      {/* Pulsing Radar Ring */}
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.14, 0.22, 24]} />
        <meshBasicMaterial
          color={statusConfig.glow}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Local Spotlight Cast on Strata Wall */}
      <pointLight
        color={statusConfig.color}
        intensity={node.status === 'risk' ? 2.0 : 1.2}
        distance={2.5}
        decay={2}
      />

      {/* Hover HUD Telemetry Card */}
      {isHovered && (
        <Html distanceFactor={8} position={[0, 0.35, 0]} center zIndexRange={[100, 0]}>
          <div className="pointer-events-none p-2.5 min-w-[200px] bg-[#070708]/90 border border-[#24272d] rounded-md shadow-2xl backdrop-blur-md text-left font-mono">
            <div className="flex items-center justify-between gap-2 pb-1 border-b border-[#24272d]">
              <span className="text-[9px] uppercase tracking-wider text-[#8b9099]">{node.hazardCode}</span>
              <span
                className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${statusConfig.color}20`, color: statusConfig.color }}
              >
                {statusConfig.label}
              </span>
            </div>
            <div className="pt-1 text-[11px] font-semibold text-[#edeef0] truncate">{node.title}</div>
            <div className="text-[9px] text-[#8b9099] pt-0.5">Bench Level {node.benchLevel} · Opencast Pit</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================================================
// CAMERA DESCENT & SEARCHLIGHT CONTROLLER
// ============================================================================
function SceneRig() {
  const { camera } = useThree();
  const lightRef = useRef();
  const scrollProgress = useShowcaseStore((s) => s.scrollProgress);
  const pointer = useShowcaseStore((s) => s.pointer);
  const prefersReducedMotion = useShowcaseStore((s) => s.prefersReducedMotion);

  useFrame((state, delta) => {
    if (prefersReducedMotion) {
      // Static optimal isometric angle
      camera.position.set(0, 5.5, 9.5);
      camera.lookAt(0, -1.8, 0);
      return;
    }

    // Scroll drives the descent into the pit
    // Progress 0 (Hero): High survey angle [0, 6.5, 10.5]
    // Progress 0.4 (The Loop): Descended onto active bench [0.8, 2.2, 5.2]
    // Progress 1.0 (Impact / Base): Low angle near pit floor [0, 0.5, 4.2]
    const targetY = 6.5 - scrollProgress * 5.4;
    const targetZ = 10.5 - scrollProgress * 5.8;
    const targetX = Math.sin(scrollProgress * Math.PI) * 1.5 + pointer.x * 0.45;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 3);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 3);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 3);

    // Look down into the active working bench
    const lookAtY = -1.2 - scrollProgress * 2.2;
    camera.lookAt(0, lookAtY, 0);

    // Parallax the directional floodlight
    if (lightRef.current) {
      lightRef.current.position.x = 4 + pointer.x * 3;
      lightRef.current.position.y = 8 + pointer.y * 2;
    }
  });

  return (
    <>
      <ambientLight color="#16181c" intensity={0.65} />
      {/* Industrial Mine Floodlight */}
      <directionalLight
        ref={lightRef}
        position={[4, 8, 5]}
        color="#ffd08a"
        intensity={1.8}
        castShadow
      />
      {/* Rim light from the excavation void */}
      <directionalLight position={[-6, -2, -4]} color="#24272d" intensity={1.2} />
    </>
  );
}

// ============================================================================
// MAIN EXPORTED WEBGL SCENE WITH CONTEXT LOSS & SVG FALLBACK
// ============================================================================
export default function MineTerrainCanvas({ onNodeSelect }) {
  const [hasContextError, setHasContextError] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const activeRiskNodes = useShowcaseStore((s) => s.activeRiskNodes);
  const lowPowerMode = useShowcaseStore((s) => s.lowPowerMode);
  const prefersReducedMotion = useShowcaseStore((s) => s.prefersReducedMotion);

  // Safeguard: Fallback to SVG Vector contours if WebGL fails
  if (hasContextError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <svg viewBox="0 0 600 600" className="w-full h-full max-w-[500px]">
          <circle cx="300" cy="300" r="260" fill="none" stroke="#24272d" strokeWidth="1.5" />
          <circle cx="300" cy="300" r="200" fill="none" stroke="#f5a524" strokeWidth="1" strokeDasharray="6 4" />
          <circle cx="300" cy="300" r="140" fill="none" stroke="#24272d" strokeWidth="1.5" />
          <circle cx="300" cy="300" r="80" fill="none" stroke="#2fbf71" strokeWidth="1" />
          <circle cx="300" cy="300" r="20" fill="#e0523f" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative pointer-events-auto">
      <Canvas
        shadows={!lowPowerMode}
        dpr={lowPowerMode ? 1 : [1, 2]}
        gl={{
          antialias: !lowPowerMode,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 6.5, 10.5], fov: 42, near: 0.1, far: 80 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('[CoalGuard WebGL] Context lost. Switching to vector fallback.');
            setHasContextError(true);
          });
        }}
      >
        <PerformanceMonitor
          onDecline={() => {
            useShowcaseStore.getState().setLowPowerMode(true);
          }}
        />
        <AdaptiveDpr pixelated />

        <SceneRig />

        {/* 3D Opencast Pit Strata */}
        <Float speed={prefersReducedMotion ? 0 : 0.8} rotationIntensity={0.1} floatIntensity={0.15}>
          <PitTerraceGeometry benchCount={6} outerRadius={6.8} depth={4.5} />

          {/* Glowing Telemetry Risk Nodes */}
          {activeRiskNodes.map((node) => (
            <TelemetryBeacon
              key={node.id}
              node={node}
              isHovered={hoveredNodeId === node.id}
              onHover={setHoveredNodeId}
              onClick={onNodeSelect || (() => {})}
            />
          ))}
        </Float>

        {/* Floating Strata Mineral Dust */}
        <StrataDustParticles count={lowPowerMode ? 180 : 420} />

        {/* Restrained Bloom Glow on Risk & Verified Beacons (bypassed on low-power devices) */}
        {!lowPowerMode && !prefersReducedMotion && (
          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={0.55}
              luminanceSmoothing={0.8}
              height={300}
              intensity={0.65}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
