"use client";

/*
 * Adapted from "Snap Carousel" by ddoemonn on 21st.dev
 * (https://21st.dev/r/ddoemonn/snap-carousel). Retheming: the original ships
 * stone-on-white controls; here they run on the portfolio's scoped
 * --surface/--stroke/--text/--signal channels, the viewport keeps its
 * rounded corners off so slides own their own shape, and the default export
 * is dropped.
 */

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useIsomorphicLayoutEffect,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

const CELL = {
  type: "spring",
  stiffness: 520,
  damping: 34,
  mass: 0.45,
} as const;

const CROSSFADE = {
  type: "spring",
  stiffness: 260,
  damping: 34,
  mass: 0.8,
} as const;

const WALL = {
  type: "spring",
  stiffness: 700,
  damping: 30,
  mass: 0.5,
} as const;

const WALL_IMPULSE = 900;

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

type DragInfo = {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
};

export type UseSnapCarouselOptions = {
  count: number;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  gap?: number;
  momentum?: number;
  maxFlick?: number;
  disabled?: boolean;
};

export function useSnapCarousel({
  count,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  gap = 12,
  momentum = 0.14,
  maxFlick = 1,
  disabled = false,
}: UseSnapCarouselOptions) {
  const total = Math.max(1, Math.floor(count));

  const [uncontrolled, setUncontrolled] = useState(() =>
    clamp(defaultIndex, 0, total - 1),
  );
  const [slideWidth, setSlideWidth] = useState(0);
  const [dragging, setDragging] = useState(false);

  const index = clamp(controlled ?? uncontrolled, 0, total - 1);
  const [target, setTarget] = useState(index);
  const step = slideWidth + gap;

  const viewportRef = useRef<HTMLDivElement>(null);
  const anim = useRef<{ stop: () => void } | null>(null);
  const desired = useRef<number | null>(null);
  const lastStep = useRef(0);

  const live = useRef(index);
  live.current = index;
  const metrics = useRef({ step, total, momentum, maxFlick });
  metrics.current = { step, total, momentum, maxFlick };
  const changed = useRef(onIndexChange);
  changed.current = onIndexChange;

  const x = useMotionValue(0);
  const reduced = useReducedMotion();

  const glide = useCallback(
    (to: number, velocity = 0) => {
      desired.current = to;
      anim.current?.stop();
      anim.current = animate(
        x,
        to,
        reduced ? { duration: 0 } : { ...CROSSFADE, velocity },
      );
    },
    [x, reduced],
  );

  const goTo = useCallback(
    (next: number, velocity = 0) => {
      const shelf = metrics.current;
      const to = clamp(Math.round(next), 0, shelf.total - 1);
      setTarget(to);
      if (to !== live.current) {
        live.current = to;
        setUncontrolled(to);
        changed.current?.(to);
      }
      glide(-to * shelf.step, velocity);
    },
    [glide],
  );

  const bounce = useCallback(
    (dir: 1 | -1) => {
      const shelf = metrics.current;
      const to = -live.current * shelf.step;
      desired.current = to;
      anim.current?.stop();
      anim.current = animate(
        x,
        to,
        reduced ? { duration: 0 } : { ...WALL, velocity: -dir * WALL_IMPULSE },
      );
    },
    [x, reduced],
  );

  const move = useCallback(
    (dir: 1 | -1) => {
      const to = live.current + dir;
      if (to < 0 || to > metrics.current.total - 1) bounce(dir);
      else goTo(to);
    },
    [bounce, goTo],
  );

  const next = useCallback(() => move(1), [move]);
  const prev = useCallback(() => move(-1), [move]);

  const pick = useCallback(
    (velocity: number) => {
      const shelf = metrics.current;
      if (shelf.step === 0) return live.current;
      const at = -x.get() / shelf.step;
      const anchor = clamp(Math.round(at), 0, shelf.total - 1);
      const projected = at - (velocity * shelf.momentum) / shelf.step;
      return clamp(
        clamp(
          Math.round(projected),
          anchor - shelf.maxFlick,
          anchor + shelf.maxFlick,
        ),
        0,
        shelf.total - 1,
      );
    },
    [x],
  );

  useIsomorphicLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setSlideWidth((current) =>
        Math.abs(current - width) < 0.5 ? current : width,
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (step === 0) return;
    const to = -index * step;

    if (lastStep.current !== step) {
      lastStep.current = step;
      desired.current = to;
      anim.current?.stop();
      x.set(to);
      return;
    }
    if (dragging || desired.current === to) return;
    glide(to);
  }, [index, step, dragging, glide, x]);

  useEffect(() => () => anim.current?.stop(), []);

  const onDragStart = useCallback(() => {
    anim.current?.stop();
    setDragging(true);
    setTarget(live.current);
  }, []);

  const onDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: DragInfo) => {
      const to = pick(info.velocity.x);
      setTarget((current) => (current === to ? current : to));
    },
    [pick],
  );

  const onDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: DragInfo) => {
      setDragging(false);
      goTo(pick(info.velocity.x), info.velocity.x);
    },
    [goTo, pick],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(metrics.current.total - 1);
      }
    },
    [goTo, next, prev],
  );

  const onScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    event.currentTarget.scrollLeft = 0;
    event.currentTarget.scrollTop = 0;
  }, []);

  const viewportProps = {
    tabIndex: 0,
    role: "group" as const,
    "aria-roledescription": "carousel",
    onKeyDown,
    onScroll,
  };

  const trackProps = {
    drag: (disabled || total < 2 ? false : "x") as false | "x",
    dragDirectionLock: true,
    dragMomentum: false,
    dragElastic: 0.14,
    dragConstraints: { left: -(total - 1) * step, right: 0 },
    onDragStart,
    onDrag,
    onDragEnd,
    style: { x, gap: `${gap}px`, touchAction: "pan-y" as const },
  };

  return {
    index,
    count: total,
    target,
    shown: dragging ? target : index,
    dragging,
    slideWidth,
    step,
    x,
    goTo,
    next,
    prev,
    viewportRef,
    viewportProps,
    trackProps,
  };
}

export type UseSnapCarouselResult = ReturnType<typeof useSnapCarousel>;

const CARET_LEFT = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 256 256"
    fill="none"
    aria-hidden="true"
  >
    <polyline
      points="160 208 80 128 160 48"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CARET_RIGHT = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 256 256"
    fill="none"
    aria-hidden="true"
  >
    <polyline
      points="96 48 176 128 96 208"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type SnapCarouselProps = {
  children: React.ReactNode;
  label: string;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  gap?: number;
  peek?: number;
  momentum?: number;
  maxFlick?: number;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
};

export function SnapCarousel({
  children,
  label,
  index,
  defaultIndex = 0,
  onIndexChange,
  gap = 12,
  peek = 0,
  momentum = 0.14,
  maxFlick = 1,
  prevLabel = "Previous slide",
  nextLabel = "Next slide",
  className = "",
}: SnapCarouselProps) {
  const slides = Children.toArray(children);
  const hintId = useId();
  const reduced = useReducedMotion();

  const car = useSnapCarousel({
    count: slides.length,
    index,
    defaultIndex,
    onIndexChange,
    gap,
    momentum,
    maxFlick,
  });

  const button =
    "grid size-9 cursor-pointer place-items-center rounded-full border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] text-[hsl(var(--text))] outline-none transition-colors duration-150 hover:border-[hsl(var(--signal))]/60 hover:text-[hsl(var(--signal))] active:translate-y-px focus-visible:ring-2 focus-visible:ring-[hsl(var(--signal))]";

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={car.viewportRef}
        aria-label={label}
        aria-describedby={hintId}
        style={{
          paddingLeft: peek,
          paddingRight: peek,
          ...(peek > 0
            ? {
                WebkitMaskImage: `linear-gradient(to right, transparent 0, black ${peek + 14}px, black calc(100% - ${peek + 14}px), transparent 100%)`,
                maskImage: `linear-gradient(to right, transparent 0, black ${peek + 14}px, black calc(100% - ${peek + 14}px), transparent 100%)`,
              }
            : {}),
        }}
        className="relative overflow-hidden py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--signal))]"
        {...car.viewportProps}
      >
        <motion.div
          {...car.trackProps}
          className={`flex items-stretch ${
            car.dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {slides.map((slide, i) => (
            <motion.div
              key={isValidElement(slide) && slide.key ? slide.key : i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              inert={i !== car.index}
              initial={false}
              animate={
                i === car.shown
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0.96, opacity: 0.55 }
              }
              transition={reduced ? { duration: 0 } : CROSSFADE}
              className="w-full shrink-0 select-none"
            >
              {slide}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="flex items-center gap-[3px]">
          {slides.map((slide, i) => (
            <button
              key={isValidElement(slide) && slide.key ? slide.key : i}
              type="button"
              onClick={() => car.goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === car.index ? "true" : undefined}
              className="grid h-6 w-5 cursor-pointer place-items-center rounded outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--signal))]"
            >
              <motion.span
                initial={false}
                animate={
                  i === car.shown
                    ? { scaleX: 1, opacity: 1 }
                    : { scaleX: 0.36, opacity: 0.26 }
                }
                transition={reduced ? { duration: 0 } : CELL}
                className="block h-[5px] w-[16px] rounded-full bg-[hsl(var(--text))]"
              />
            </button>
          ))}
        </span>
        <span className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={car.prev}
            aria-label={prevLabel}
            className={button}
          >
            {CARET_LEFT}
          </button>
          <button
            type="button"
            onClick={car.next}
            aria-label={nextLabel}
            className={button}
          >
            {CARET_RIGHT}
          </button>
        </span>
      </div>
      <span id={hintId} className="sr-only">
        Left and right arrow keys move between {slides.length} slides.
      </span>
      <span aria-live="polite" aria-atomic className="sr-only">
        Slide {car.index + 1} of {slides.length}
      </span>
    </div>
  );
}

