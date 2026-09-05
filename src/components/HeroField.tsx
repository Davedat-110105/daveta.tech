"use client";

import { useEffect, useRef } from "react";

/**
 * The hero background: a single fullscreen quad running one fragment shader.
 *
 * Everything on screen — nebula, three parallax star layers and the measurement
 * grid — is generated per-pixel on the GPU. No textures, no geometry, no
 * dependencies. This shader also drew six animated signal traces; they were
 * removed, since sweeping curves across the hero copy read as decoration.
 *
 * Cost control, in order of importance:
 *   · device pixel ratio is capped at 1.5 (a 4K hero at dpr 3 is 25M pixels of
 *     five-octave noise, which is how you cook a laptop for a background)
 *   · the render loop stops entirely when the hero scrolls out of view
 *   · `prefers-reduced-motion` draws exactly one frame and never schedules another
 *   · if the context is lost or WebGL is unavailable, the element stays empty and
 *     the page background shows through
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uPointer;

const vec3 BG      = vec3(0.039, 0.039, 0.039); // #0a0a0a, matches --bg
const vec3 NEB_A   = vec3(0.165, 0.158, 0.162); // neutral graphite
const vec3 NEB_B   = vec3(0.148, 0.235, 0.318); // dim steel

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

/* One depth shell of stars. Cells are sparse, so most pixels cost a hash. */
float starLayer(vec2 uv, float density, float seed, float t) {
  vec2 g  = uv * density;
  vec2 id = floor(g);
  vec2 f  = fract(g) - 0.5;

  float h  = hash21(id + seed);
  float on = step(0.875, h);

  vec2 off = (vec2(hash21(id + seed + 1.7), hash21(id + seed + 3.1)) - 0.5) * 0.72;
  float d  = length(f - off);

  float bright = 0.35 + 0.65 * fract(h * 17.31);
  float twinkle = 0.62 + 0.38 * sin(t * 1.5 + h * 31.4);
  float core = smoothstep(0.048, 0.0, d);
  float halo = smoothstep(0.115, 0.0, d) * 0.075;

  return on * (core + halo) * bright * twinkle;
}

void main() {
  vec2 frag = gl_FragCoord.xy / uRes;
  vec2 uv = vec2(frag.x, 1.0 - frag.y);       // y down, matches the DOM
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 sky = vec2(uv.x * aspect, uv.y);

  vec3 col = BG;

  /* ---- nebula ------------------------------------------------------ */
  // Masked to the upper band so it never fights the headline — and skipped
  // outright below it, which is a coherent branch (whole scanlines take the
  // same path) and buys back most of the nebula's cost on the lower screen.
  float nmask = smoothstep(0.85, 0.05, uv.y);
  if (nmask > 0.003) {
    vec2 np = sky * vec2(1.25, 1.7) + vec2(uTime * 0.006, uTime * 0.002);
    np += (uPointer - 0.5) * 0.09;
    float warp = vnoise(np * 1.6);
    float n = fbm(np + warp * 0.7);
    n = smoothstep(0.30, 0.82, n) * nmask;
    vec3 neb = mix(NEB_A, NEB_B, smoothstep(0.25, 0.85, warp));
    col += neb * n * 1.1;
  }

  /* ---- stars, three parallax shells -------------------------------- */
  vec2 drift = (uPointer - 0.5);
  col += vec3(0.80, 0.78, 0.75) *
         starLayer(sky + drift * 0.016 + vec2(uTime * 0.0035, 0.0), 26.0, 1.0, uTime) * 0.55;
  col += vec3(0.93, 0.91, 0.88) *
         starLayer(sky + drift * 0.022 + vec2(uTime * 0.0065, 0.0), 16.0, 27.0, uTime) * 0.85;
  col += vec3(1.0) *
         starLayer(sky + drift * 0.040 + vec2(uTime * 0.0105, 0.0), 9.5, 71.0, uTime) * 1.05;

  /* ---- measurement grid -------------------------------------------- */
  vec2 cell = abs(fract(sky * 11.0) - 0.5);
  float grid = smoothstep(0.492, 0.5, max(cell.x, cell.y));
  col += vec3(0.58, 0.57, 0.55) * grid * 0.035;

  /* ---- settle into the page ---------------------------------------- */
  float vig = smoothstep(1.15, 0.28, length((uv - vec2(0.5, 0.34)) * vec2(1.0, 1.25)));
  col = mix(BG, col, clamp(vig, 0.0, 1.0));
  col = mix(col, BG, smoothstep(0.62, 1.0, uv.y));

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    // Logged in every environment on purpose: a silently-failing shader just
    // renders nothing, which is indistinguishable from "the design is flat".
    console.error("[HeroField] shader compile failed:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function HeroField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const gl = (cv.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    }) ||
      cv.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[HeroField] link failed:", gl.getProgramInfoLog(prog));
      }
      return;
    }
    gl.useProgram(prog);

    // One triangle large enough to cover the viewport — cheaper than two.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uPointer = gl.getUniformLocation(prog, "uPointer");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;

    // Render scale adapts down if the machine can't keep up. A per-pixel
    // fragment shader is cheap on a discrete GPU and expensive on a ten-year-old
    // integrated one; rather than guess from the user agent, measure and back
    // off. Scale only ever decreases, so this can't oscillate.
    let scale = Math.min(window.devicePixelRatio || 1, 1.5);
    let sampled = 0;
    let accum = 0;
    let last = 0;
    let downshifts = 0;

    const size = () => {
      const r = cv.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width * scale));
      h = Math.max(1, Math.round(r.height * scale));
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    /** Watches frame time over a 45-frame window and halves resolution twice at most. */
    const adapt = (t: number) => {
      if (downshifts >= 2) return;
      if (last) {
        accum += t - last;
        sampled++;
        // Whichever comes first: a healthy 45-frame window, or 700ms of wall
        // clock. On a fast machine that's ~0.75s; on a slow one the time bound
        // fires within a few frames, so it backs off almost immediately instead
        // of stuttering for ten seconds waiting to collect a frame count.
        if (sampled >= 45 || (accum >= 700 && sampled >= 3)) {
          const avg = accum / sampled;
          if (avg > 24) {
            // Sustained sub-40fps: drop to a smaller buffer and upscale in CSS.
            scale = Math.max(0.5, scale * 0.65);
            downshifts++;
            size();
          } else {
            downshifts = 2; // fast enough — stop measuring
          }
          sampled = 0;
          accum = 0;
        }
      }
      last = t;
    };

    const draw = (t: number) => {
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, t / 1000);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (t: number) => {
      raf = 0;
      adapt(t);
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      draw(t);
      if (visible && !still) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && visible && !still) raf = requestAnimationFrame(frame);
    };

    size();
    draw(0);
    if (!still) start();

    const ro = new ResizeObserver(() => {
      size();
      if (still) draw(0);
    });
    ro.observe(cv);

    // Stop rendering the moment the hero leaves the screen.
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([e]) => {
              visible = e.isIntersecting;
              if (visible) {
                last = 0; // don't count the offscreen gap as a slow frame
                start();
              } else if (raf) {
                cancelAnimationFrame(raf);
                raf = 0;
              }
            },
            { threshold: 0 },
          )
        : null;
    io?.observe(cv);

    const onPointer = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      pointer.tx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      pointer.ty = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onLost = (e: Event) => {
      e.preventDefault();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    cv.addEventListener("webglcontextlost", onLost);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      window.removeEventListener("pointermove", onPointer);
      cv.removeEventListener("webglcontextlost", onLost);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
