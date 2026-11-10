"use client";

import { useEffect, useRef } from "react";

import { keys } from "./piano-audio";

/**
 * The light show above the keyboard. Holding a key grows a bar of light up
 * from it; letting go sets the bar free to rise and fade into the dark. Each
 * strike also throws a few sparks and leaves a glow where the key meets the
 * stage. Drawn on one 2D canvas, and the loop only runs while light is on it.
 */

export type LightsApi = {
  on: (midi: number, id: string) => void;
  off: (id: string) => void;
};

type Bar = {
  id: string;
  x: number; // 0..1 of width, left edge
  w: number; // 0..1 of width
  color: [string, string];
  bottom: number; // px above the keyboard
  top: number;
  held: boolean;
  glow: number;
};

type Spark = { x: number; y: number; vx: number; vy: number; life: number; age: number; color: string };

const RISE = 150; // px per second
const WHITE_BAR: [string, string] = ["#b8d3f2", "#4e85bf"];
const BLACK_BAR: [string, string] = ["#9fe0f0", "#2f6fa8"];

function geometry(midi: number) {
  const key = keys.find((item) => item.midi === midi);
  if (!key) return null;
  // Matches the flat keyboard: white keys 12.5% wide, black keys 7.5% wide
  // centered on the line between two white keys.
  return key.sharp
    ? { x: key.slot * 0.125 - 0.0375 + 0.006, w: 0.075 - 0.012, color: BLACK_BAR }
    : { x: key.slot * 0.125 + 0.012, w: 0.125 - 0.024, color: WHITE_BAR };
}

export function PianoLights({ apiRef, reduceMotion }: { apiRef: React.MutableRefObject<LightsApi | null>; reduceMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const bars: Bar[] = [];
    const sparks: Spark[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let last = 0;

    const fit = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    fit();
    const resize = new ResizeObserver(() => {
      fit();
      draw();
    });
    resize.observe(canvas);

    const roundedBar = (x: number, y: number, w: number, h: number, r: number) => {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Faint lane lines, one per key, so the stage reads as a score.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(255,255,255,0.035)";
      for (let i = 1; i < 8; i++) ctx.fillRect(Math.round(i * 0.125 * width), 0, 1, height);

      ctx.globalCompositeOperation = "lighter";
      for (const bar of bars) {
        const x = bar.x * width;
        const w = bar.w * width;
        const y0 = height - bar.top;
        const h = Math.max(bar.top - bar.bottom, 2);
        // Fade as the bar climbs, so it dissolves into the dark at the top.
        const fade = Math.max(0, 1 - bar.bottom / (height * 0.95));
        const gradient = ctx.createLinearGradient(0, y0 + h, 0, y0);
        gradient.addColorStop(0, bar.color[0]);
        gradient.addColorStop(1, bar.color[1]);
        ctx.globalAlpha = 0.9 * fade;
        ctx.shadowColor = bar.color[1];
        ctx.shadowBlur = 22;
        ctx.fillStyle = gradient;
        roundedBar(x, y0, w, h, 5);
        ctx.fill();
        // A bright core line down the middle of the bar.
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 0.5 * fade;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + w / 2 - 1, y0 + 3, 2, Math.max(h - 6, 0));

        // Where a held key meets the stage, a pool of light.
        if (bar.glow > 0.01) {
          const cx = x + w / 2;
          const pool = ctx.createRadialGradient(cx, height, 0, cx, height, w * 1.4);
          pool.addColorStop(0, `rgba(150,195,245,${0.55 * bar.glow})`);
          pool.addColorStop(1, "rgba(150,195,245,0)");
          ctx.globalAlpha = 1;
          ctx.fillStyle = pool;
          ctx.fillRect(cx - w * 1.4, height - w * 1.4, w * 2.8, w * 1.4);
        }
      }

      for (const spark of sparks) {
        const t = spark.age / spark.life;
        ctx.globalAlpha = Math.max(0, 1 - t);
        ctx.shadowColor = spark.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = spark.color;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, 1.8 * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      for (let i = bars.length - 1; i >= 0; i--) {
        const bar = bars[i];
        if (bar.held) {
          bar.top += RISE * dt;
          bar.glow += (1 - bar.glow) * (1 - Math.exp(-dt * 20));
        } else if (reduceMotion) {
          bar.glow *= Math.exp(-dt * 6);
          bar.bottom += (bar.top - bar.bottom) * (1 - Math.exp(-dt * 4));
        } else {
          bar.top += RISE * dt;
          bar.bottom += RISE * dt;
          bar.glow *= Math.exp(-dt * 8);
        }
        if (bar.bottom >= height || bar.top - bar.bottom < 0.5) bars.splice(i, 1);
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.age += dt;
        spark.vy += 220 * dt; // gravity pulls them back a little
        spark.x += spark.vx * dt;
        spark.y += spark.vy * dt;
        if (spark.age >= spark.life) sparks.splice(i, 1);
      }

      draw();
      if (bars.length || sparks.length) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    apiRef.current = {
      on(midi, id) {
        const shape = geometry(midi);
        if (!shape) return;
        bars.push({ id, ...shape, bottom: 0, top: reduceMotion ? height * 0.5 : 6, held: true, glow: 0 });
        if (bars.length > 60) bars.shift();
        if (!reduceMotion) {
          const cx = (shape.x + shape.w / 2) * width;
          for (let i = 0; i < 9; i++) {
            sparks.push({
              x: cx + (Math.random() - 0.5) * shape.w * width * 0.6,
              y: height - 2,
              vx: (Math.random() - 0.5) * 90,
              vy: -(90 + Math.random() * 170),
              life: 0.55 + Math.random() * 0.45,
              age: 0,
              color: shape.color[0],
            });
          }
        }
        wake();
      },
      off(id) {
        for (const bar of bars) if (bar.id === id) bar.held = false;
        wake();
      },
    };

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      apiRef.current = null;
    };
  }, [apiRef, reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />;
}
