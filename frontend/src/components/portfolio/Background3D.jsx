import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * High-performance 3D WebGL background featuring:
 * 1. Glowing 3D Particle Globe with latitude/longitude orbits & glowing core
 * 2. Floating geometric wireframe shapes (Icosahedron, Octahedron, Torus Knot, Dodecahedron)
 * 3. Fluid mouse parallax & orbital camera physics
 * 4. 100% offline-ready, no heavy external Spline CDN downloads required
 */
export default function Background3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if WebGL is available
    let canvas;
    try {
      canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return;
    } catch {
      return;
    }

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080810, 0.045);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent for CSS gradients
    container.appendChild(renderer.domElement);

    // --- Dynamic Circular Glow Sprite for Particles ---
    const createGlowTexture = () => {
      const size = 64;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d");
      const grad = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(129, 140, 248, 0.9)");
      grad.addColorStop(0.55, "rgba(99, 102, 241, 0.35)");
      grad.addColorStop(1, "rgba(15, 23, 42, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    };

    const glowTexture = createGlowTexture();

    // ==========================================
    // 1. 3D GLOWING PARTICLE GLOBE
    // ==========================================
    const globeGroup = new THREE.Group();
    // Position globe slightly to the right side on desktop for balanced layout
    const isMobile = window.innerWidth < 768;
    globeGroup.position.set(isMobile ? 0 : 3.2, isMobile ? 0.5 : 0, 0);
    scene.add(globeGroup);

    const globeRadius = isMobile ? 3.2 : 4.4;
    const particleCount = isMobile ? 2200 : 4200;

    const globeGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const color1 = new THREE.Color(0x6366f1); // Indigo
    const color2 = new THREE.Color(0x38bdf8); // Sky blue
    const color3 = new THREE.Color(0xd946ef); // Magenta/fuchsia

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci sphere distribution for uniform spherical coverage
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      // Small radial perturbation for rich organic cloud depth
      const r = globeRadius * (0.97 + Math.random() * 0.06);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Mix colors based on position
      const mixedColor = new THREE.Color();
      const normY = (y + globeRadius) / (globeRadius * 2);
      if (normY < 0.5) {
        mixedColor.lerpColors(color1, color2, normY * 2);
      } else {
        mixedColor.lerpColors(color2, color3, (normY - 0.5) * 2);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      scales[i] = Math.random() * 0.7 + 0.4;
    }

    globeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    globeGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    globeGeometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    const globeMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const globePoints = new THREE.Points(globeGeometry, globeMaterial);
    globeGroup.add(globePoints);

    // Latitude & Longitude Orbit Rings
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });

    const createLatitudeRing = (radius, y) => {
      const segments = 64;
      const ringGeom = new THREE.BufferGeometry();
      const ringPositions = [];
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        ringPositions.push(radius * Math.cos(theta), y, radius * Math.sin(theta));
      }
      ringGeom.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(ringPositions, 3)
      );
      return new THREE.Line(ringGeom, ringMaterial);
    };

    [-2.2, -1.0, 0, 1.0, 2.2].forEach((yVal) => {
      const ringR = Math.sqrt(Math.max(0, globeRadius * globeRadius - yVal * yVal));
      if (ringR > 0.5) {
        globeGroup.add(createLatitudeRing(ringR, yVal));
      }
    });

    // Outer orbital glowing ring tilted at an angle
    const orbitRingGeom = new THREE.RingGeometry(globeRadius * 1.25, globeRadius * 1.27, 80);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeom, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2.8;
    orbitRing.rotation.y = Math.PI / 6;
    globeGroup.add(orbitRing);

    // Orbiting Satellite Nodes
    const satelliteGroup = new THREE.Group();
    globeGroup.add(satelliteGroup);

    const satelliteCount = 5;
    const satellites = [];
    for (let s = 0; s < satelliteCount; s++) {
      const satGeom = new THREE.SphereGeometry(0.1, 16, 16);
      const satMat = new THREE.MeshBasicMaterial({
        color: s % 2 === 0 ? 0x38bdf8 : 0xd946ef,
        transparent: true,
        opacity: 0.9,
      });
      const sat = new THREE.Mesh(satGeom, satMat);
      const angle = (s / satelliteCount) * Math.PI * 2;
      const radius = globeRadius * (1.18 + (s % 3) * 0.15);
      satellites.push({
        mesh: sat,
        baseAngle: angle,
        radius,
        speed: 0.6 + s * 0.25,
        tilt: 0.3 + (s * Math.PI) / 4,
      });
      satelliteGroup.add(sat);
    }

    // ==========================================
    // 2. FLOATING 3D GEOMETRIC SHAPES
    // ==========================================
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);

    const shapes = [];

    // Helper to create wireframe geometry mesh with glow
    const createWireframeShape = (geometry, colorHex, position, scale, rotationSpeed) => {
      // Wireframe
      const wireMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });

      // Semi-transparent inner core
      const coreMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.08,
      });

      const mesh = new THREE.Mesh(geometry, wireMat);
      const innerMesh = new THREE.Mesh(geometry, coreMat);
      innerMesh.scale.set(0.95, 0.95, 0.95);
      mesh.add(innerMesh);

      mesh.position.set(...position);
      mesh.scale.set(scale, scale, scale);
      floatingGroup.add(mesh);

      return {
        mesh,
        basePos: { ...mesh.position },
        rotSpeed: rotationSpeed,
        floatSeed: Math.random() * 100,
        floatSpeed: 0.8 + Math.random() * 0.6,
      };
    };

    // Shape 1: Glowing Icosahedron (Top Left)
    shapes.push(
      createWireframeShape(
        new THREE.IcosahedronGeometry(1.4, 0),
        0x6366f1,
        [isMobile ? -2.5 : -5.8, 3.8, -2],
        1.1,
        { x: 0.006, y: 0.009, z: 0.004 }
      )
    );

    // Shape 2: Cyan Octahedron (Left Center)
    shapes.push(
      createWireframeShape(
        new THREE.OctahedronGeometry(1.2, 0),
        0x06b6d4,
        [isMobile ? -2.2 : -7.0, -1.2, 0],
        1.0,
        { x: -0.008, y: 0.007, z: -0.005 }
      )
    );

    // Shape 3: Fuchsia Dodecahedron (Bottom Left)
    shapes.push(
      createWireframeShape(
        new THREE.DodecahedronGeometry(1.3, 0),
        0xd946ef,
        [isMobile ? -1.8 : -4.8, -4.5, -1],
        0.95,
        { x: 0.005, y: -0.008, z: 0.007 }
      )
    );

    // Shape 4: Torus Knot (Far Right Top)
    shapes.push(
      createWireframeShape(
        new THREE.TorusKnotGeometry(1.1, 0.32, 50, 10),
        0x818cf8,
        [isMobile ? 2.5 : 6.8, 4.2, -3.5],
        0.8,
        { x: 0.008, y: 0.005, z: 0.009 }
      )
    );

    // Shape 5: Tetrahedron (Bottom Right)
    shapes.push(
      createWireframeShape(
        new THREE.TetrahedronGeometry(1.2, 0),
        0x38bdf8,
        [isMobile ? 2.2 : 6.2, -4.0, -1.5],
        0.9,
        { x: -0.006, y: 0.009, z: 0.006 }
      )
    );

    // ==========================================
    // 3. AMBIENT BACKGROUND STARDUST PARTICLES
    // ==========================================
    const starCount = 350;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 35;
      starPositions[i + 1] = (Math.random() - 0.5) * 35;
      starPositions[i + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.45,
    });
    const stars = new THREE.Points(starGeom, starMat);
    scene.add(stars);

    // ==========================================
    // 4. MOUSE PARALLAX & FLUID DAMPING
    // ==========================================
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e) => {
      // Normalize pointer coordinates [-1, 1]
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Handle Window Resize
    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mobileNow = width < 768;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      globeGroup.position.set(mobileNow ? 0 : 3.2, mobileNow ? 0.5 : 0, 0);
    };

    window.addEventListener("resize", onResize);

    // ==========================================
    // 5. ANIMATION LOOP WITH LERP DAMPING
    // ==========================================
    let animationFrameId;
    let clock = new THREE.Clock();
    let isVisible = true;

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        clock.start();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerping
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      // Rotate Globe smoothly
      globeGroup.rotation.y = elapsed * 0.12 + targetX * 0.35;
      globeGroup.rotation.x = Math.sin(elapsed * 0.08) * 0.1 - targetY * 0.25;

      // Pulse globe particles slightly
      const wave = Math.sin(elapsed * 1.5) * 0.02 + 1;
      globePoints.scale.set(wave, wave, wave);

      // Animate Satellites
      satellites.forEach((sat) => {
        const theta = sat.baseAngle + elapsed * sat.speed;
        sat.mesh.position.x = Math.cos(theta) * sat.radius;
        sat.mesh.position.z = Math.sin(theta) * sat.radius;
        sat.mesh.position.y = Math.sin(theta * 1.8 + sat.tilt) * 1.4;
      });

      // Animate Floating Geometric Shapes
      shapes.forEach((s) => {
        s.mesh.rotation.x += s.rotSpeed.x;
        s.mesh.rotation.y += s.rotSpeed.y;
        s.mesh.rotation.z += s.rotSpeed.z;

        // Organic sinusoidal floating
        const floatY = Math.sin(elapsed * s.floatSpeed + s.floatSeed) * 0.45;
        const floatX = Math.cos(elapsed * (s.floatSpeed * 0.7) + s.floatSeed) * 0.25;
        s.mesh.position.y = s.basePos.y + floatY - targetY * 0.5;
        s.mesh.position.x = s.basePos.x + floatX + targetX * 0.5;
      });

      // Slow drift of background stars
      stars.rotation.y = elapsed * 0.015;

      // Camera subtle parallax
      camera.position.x = targetX * 0.6;
      camera.position.y = targetY * 0.4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Geometries, Materials, and Textures
      globeGeometry.dispose();
      globeMaterial.dispose();
      glowTexture.dispose();
      orbitRingGeom.dispose();
      orbitRingMat.dispose();
      starGeom.dispose();
      starMat.dispose();

      shapes.forEach((s) => {
        s.mesh.geometry.dispose();
        if (Array.isArray(s.mesh.material)) {
          s.mesh.material.forEach((m) => m.dispose());
        } else {
          s.mesh.material.dispose();
        }
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="canvas-3d-background-container"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        opacity: 0.92,
      }}
    />
  );
}
