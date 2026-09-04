import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060608, 0.025);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 24);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060608, 1);
    container.appendChild(renderer.domElement);

    // 2. Geological Coal Seam Wireframe Terrain Grid (Wave deformation)
    const gridX = 40;
    const gridZ = 40;
    const planeGeo = new THREE.PlaneGeometry(50, 50, gridX, gridZ);
    planeGeo.rotateX(-Math.PI / 2);

    const posAttr = planeGeo.attributes.position;
    const originalY = new Float32Array(posAttr.count);

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // Create coal basin undulating valleys
      const dist = Math.sqrt(x * x + z * z);
      const elevation = Math.sin(x * 0.25) * Math.cos(z * 0.25) * 1.8 - Math.exp(-dist * 0.08) * 2.5;
      posAttr.setY(i, elevation);
      originalY[i] = elevation;
    }
    planeGeo.computeVertexNormals();

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x22222a,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const terrain = new THREE.Mesh(planeGeo, wireMat);
    terrain.position.y = -3.5;
    scene.add(terrain);

    // 3. Indian Mining Cluster Nodes (3D coordinates)
    const coalNodesData = [
      { name: 'Jharia (BCCL)', x: 4.5, y: -0.5, z: 2.2, color: 0xF5A623, size: 0.35 },
      { name: 'Raniganj (ECL)', x: 6.8, y: -0.3, z: 2.0, color: 0xFFD60A, size: 0.3 },
      { name: 'Korba (SECL)', x: 0.5, y: -0.6, z: 3.5, color: 0xF5A623, size: 0.38 },
      { name: 'Singrauli (NCL)', x: 1.2, y: 0.2, z: -0.5, color: 0xF5A623, size: 0.32 },
      { name: 'Talcher (MCL)', x: 4.8, y: -0.8, z: 5.5, color: 0xFFD60A, size: 0.36 },
      { name: 'Nagpur/Wardha (WCL)', x: -2.8, y: -0.2, z: 3.8, color: 0xF5A623, size: 0.28 },
      { name: 'Singareni (SCCL)', x: -1.5, y: -1.0, z: 7.2, color: 0xFFD60A, size: 0.34 },
      { name: 'Neyveli (NLC)', x: -1.0, y: -1.8, z: 12.0, color: 0xF5A623, size: 0.3 },
      { name: 'Ranchi HQ (CCL)', x: 3.2, y: -0.2, z: 1.8, color: 0x00F0FF, size: 0.4 },
      { name: 'Kolkata HQ (CIL)', x: 7.5, y: -0.7, z: 3.2, color: 0x00F0FF, size: 0.45 },
    ];

    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const nodeMeshes = [];
    const ringMeshes = [];

    coalNodesData.forEach((node) => {
      // Core glowing sphere
      const sphereGeo = new THREE.SphereGeometry(node.size, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: node.color,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(node.x, node.y, node.z);
      nodesGroup.add(sphereMesh);
      nodeMeshes.push(sphereMesh);

      // Outer radar pulse ring
      const ringGeo = new THREE.RingGeometry(node.size * 1.5, node.size * 1.9, 24);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(node.x, node.y, node.z);
      nodesGroup.add(ringMesh);
      ringMeshes.push({ mesh: ringMesh, baseScale: 1, speed: 0.8 + Math.random() * 0.8 });
    });

    // 4. Connecting Laser Lines between Nodes
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    const connections = [
      [8, 0], // Ranchi to Jharia
      [0, 1], // Jharia to Raniganj
      [1, 9], // Raniganj to Kolkata HQ
      [8, 3], // Ranchi to Singrauli
      [8, 2], // Ranchi to Korba
      [2, 4], // Korba to Talcher
      [2, 5], // Korba to Wardha
      [5, 6], // Wardha to Singareni
      [6, 7], // Singareni to Neyveli
      [9, 4], // Kolkata to Talcher
    ];

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xF5A623,
      transparent: true,
      opacity: 0.35,
    });

    connections.forEach(([i, j]) => {
      const p1 = coalNodesData[i];
      const p2 = coalNodesData[j];
      const points = [
        new THREE.Vector3(p1.x, p1.y, p1.z),
        new THREE.Vector3((p1.x + p2.x) / 2, Math.max(p1.y, p2.y) + 0.8, (p1.z + p2.z) / 2),
        new THREE.Vector3(p2.x, p2.y, p2.z),
      ];
      const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
      const curvePoints = curve.getPoints(24);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const line = new THREE.Line(lineGeo, lineMat);
      linesGroup.add(line);
    });

    // 5. Floating Dust / Embers / Data Particles
    const particlesCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particlesCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 35;
      particlePositions[i * 3 + 1] = Math.random() * 14 - 3;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: Math.random() * 0.012 + 0.004,
        z: (Math.random() - 0.5) * 0.008,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xFFD60A,
      size: 0.12,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particlesMesh);

    // 6. Interactive Mouse Tracking
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      targetRotationY = mouseX * 0.15;
      targetRotationX = mouseY * 0.08;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / group rotation with inertia
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      nodesGroup.rotation.y = currentRotationY * 0.6;
      linesGroup.rotation.y = currentRotationY * 0.6;
      terrain.rotation.z = currentRotationY * 0.3;

      if (!prefersReducedMotion) {
        // Pulse outer rings
        ringMeshes.forEach((item) => {
          const s = 1 + Math.sin(elapsedTime * item.speed * 2) * 0.45;
          item.mesh.scale.set(s, s, s);
          item.mesh.material.opacity = Math.max(0.1, 0.7 - s * 0.3);
        });

        // Undulate terrain vertices subtly
        const pArray = terrain.geometry.attributes.position.array;
        for (let i = 0; i < posAttr.count; i++) {
          const idx = i * 3 + 1; // Y coordinate
          const x = posAttr.getX(i);
          const z = posAttr.getZ(i);
          pArray[idx] = originalY[i] + Math.sin(elapsedTime * 0.8 + x * 0.3 + z * 0.2) * 0.3;
        }
        terrain.geometry.attributes.position.needsUpdate = true;

        // Animate particles rising
        const pPositions = particlesMesh.geometry.attributes.position.array;
        for (let i = 0; i < particlesCount; i++) {
          const yIdx = i * 3 + 1;
          pPositions[yIdx] += particleVelocities[i].y;
          pPositions[i * 3] += particleVelocities[i].x;
          pPositions[i * 3 + 2] += particleVelocities[i].z;

          if (pPositions[yIdx] > 12) {
            pPositions[yIdx] = -3;
          }
        }
        particlesMesh.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      planeGeo.dispose();
      wireMat.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
