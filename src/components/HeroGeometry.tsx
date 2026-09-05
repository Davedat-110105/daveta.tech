"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";

const nodePositions = [
  [-1.48, 0.78, 0.38],
  [1.4, 0.62, 0.22],
  [-1.18, -0.98, 0.32],
  [1.32, -0.82, 0.18],
  [0.02, 1.7, -0.08],
  [0.06, -1.64, -0.08],
] as const;

export function HeroGeometry() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    const setup = async () => {
      const Three = await import("three");
      if (cancelled) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new Three.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }

      if (cancelled) {
        renderer.dispose();
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = Three.SRGBColorSpace;
      host.appendChild(renderer.domElement);
      host.dataset.ready = "true";

      const scene = new Three.Scene();
      const camera = new Three.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 0, 6.4);

      const assembly = new Three.Group();
      assembly.rotation.set(0.28, 0.46, -0.1);
      scene.add(assembly);

      const geometries: THREE.BufferGeometry[] = [];
      const materials: THREE.Material[] = [];

      const coreGeometry = new Three.DodecahedronGeometry(1.16, 0);
      const coreMaterial = new Three.MeshStandardMaterial({
        color: 0x607d7d,
        flatShading: true,
        metalness: 0.16,
        roughness: 0.7,
      });
      geometries.push(coreGeometry);
      materials.push(coreMaterial);

      const core = new Three.Mesh(coreGeometry, coreMaterial);
      assembly.add(core);

      const coreEdgesGeometry = new Three.EdgesGeometry(coreGeometry, 18);
      const coreEdgesMaterial = new Three.LineBasicMaterial({
        color: 0xd9e5de,
        opacity: 0.8,
        transparent: true,
      });
      geometries.push(coreEdgesGeometry);
      materials.push(coreEdgesMaterial);

      const coreEdges = new Three.LineSegments(coreEdgesGeometry, coreEdgesMaterial);
      coreEdges.scale.setScalar(1.006);
      assembly.add(coreEdges);

      const cageSourceGeometry = new Three.IcosahedronGeometry(1.78, 1);
      const cageGeometry = new Three.EdgesGeometry(cageSourceGeometry, 10);
      const cageMaterial = new Three.LineBasicMaterial({
        color: 0x8faaa6,
        opacity: 0.42,
        transparent: true,
      });
      geometries.push(cageSourceGeometry, cageGeometry);
      materials.push(cageMaterial);

      const cage = new Three.LineSegments(cageGeometry, cageMaterial);
      cage.rotation.set(0.42, -0.22, 0.18);
      assembly.add(cage);

      const nodeGeometry = new Three.SphereGeometry(0.045, 8, 8);
      const nodeMaterial = new Three.MeshBasicMaterial({ color: 0xb8d0c9 });
      geometries.push(nodeGeometry);
      materials.push(nodeMaterial);

      for (const [x, y, z] of nodePositions) {
        const node = new Three.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(x, y, z);
        assembly.add(node);
      }

      scene.add(new Three.HemisphereLight(0xd9e7df, 0x0a0e0f, 1.8));
      const keyLight = new Three.DirectionalLight(0xb7d5d0, 2.4);
      keyLight.position.set(3.4, 2.2, 4.2);
      scene.add(keyLight);
      const rimLight = new Three.DirectionalLight(0x5b7779, 1.45);
      rimLight.position.set(-3, -2.4, 2.1);
      scene.add(rimLight);

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
      let frame = 0;
      let visible = true;

      const draw = (time: number) => {
        const elapsed = time / 1000;
        pointer.x += (pointer.targetX - pointer.x) * 0.045;
        pointer.y += (pointer.targetY - pointer.y) * 0.045;

        if (!reducedMotion) {
          assembly.rotation.y = 0.46 + elapsed * 0.14 + pointer.x * 0.26;
          assembly.rotation.x = 0.28 + Math.sin(elapsed * 0.56) * 0.08 + pointer.y * 0.18;
          assembly.position.y = Math.sin(elapsed * 0.7) * 0.08;
          cage.rotation.z = 0.18 - elapsed * 0.08;
        }

        renderer.render(scene, camera);
      };

      const stop = () => {
        if (!frame) return;
        cancelAnimationFrame(frame);
        frame = 0;
      };

      const tick = (time: number) => {
        frame = 0;
        draw(time);
        if (visible && !reducedMotion) frame = requestAnimationFrame(tick);
      };

      const start = () => {
        if (!frame && visible && !reducedMotion) frame = requestAnimationFrame(tick);
      };

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        const safeWidth = Math.max(1, Math.round(width));
        const safeHeight = Math.max(1, Math.round(height));
        camera.aspect = safeWidth / safeHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(safeWidth, safeHeight, false);
        draw(performance.now());
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        },
        { threshold: 0 },
      );
      intersectionObserver.observe(host);

      const onPointerMove = (event: PointerEvent) => {
        const bounds = host.getBoundingClientRect();
        pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * -2;
      };
      const onPointerLeave = () => {
        pointer.targetX = 0;
        pointer.targetY = 0;
      };

      if (!reducedMotion) {
        host.addEventListener("pointermove", onPointerMove, { passive: true });
        host.addEventListener("pointerleave", onPointerLeave, { passive: true });
      }

      resize();
      start();

      teardown = () => {
        stop();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        host.removeEventListener("pointermove", onPointerMove);
        host.removeEventListener("pointerleave", onPointerLeave);
        for (const geometry of geometries) geometry.dispose();
        for (const material of materials) material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        delete host.dataset.ready;
      };
    };

    void setup();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return (
    <div ref={hostRef} className="geometry-canvas">
      <svg
        aria-hidden="true"
        className="geometry-fallback"
        focusable="false"
        viewBox="0 0 100 125"
      >
        <path d="M50 13 82 33 78 74 50 112 20 74 18 33 50 13Z" />
        <path d="m18 33 32 22 32-22M20 74l30-19 28 19M50 13v99" />
        <circle cx="18" cy="33" r="1.4" />
        <circle cx="82" cy="33" r="1.4" />
        <circle cx="20" cy="74" r="1.4" />
        <circle cx="78" cy="74" r="1.4" />
      </svg>
    </div>
  );
}
