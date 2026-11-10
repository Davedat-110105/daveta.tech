"use client";

import Image from "next/image";
import { Piano } from "./piano";
import { SnapCarousel } from "./snap-carousel";

const recording = { file: "piano-222", duration: "2:22" };

/** Homelab photos from my own library. Hardware only: no screens, labels or addresses. */
const homelab = [
  {
    src: "/assets/personal/network-switch.webp",
    alt: "A hand holding a network switch with Ethernet cables plugged in",
    note: "The switch, mid cable spaghetti",
  },
  {
    src: "/assets/homelab/homelab-minipc.jpg",
    alt: "A hand holding a small black mini PC on a desk next to network cables",
    note: "A mini PC that thinks it is a server",
  },
  {
    src: "/assets/homelab/homelab-board.jpg",
    alt: "An NVIDIA Jetson Nano with a cooling fan and a ribbon cable in an open case",
    note: "A Jetson Nano for robotics, ribbon cable and all",
  },
];

function HomelabShot({ shot, sizes }: { shot: (typeof homelab)[number]; sizes: string }) {
  return (
    <figure className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))]">
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          draggable={false}
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <figcaption className="pt-3 text-sm text-[hsl(var(--body))]">{shot.note}</figcaption>
    </figure>
  );
}

/**
 * The piano recording is the centerpiece: the video sits large under the same
 * red light it was filmed in, with a playable keyboard beside it.
 * Everything else about life off the clock sits in one quiet row below.
 */
export function PersonalNotes() {
  return (
    <section
      id="personal"
      tabIndex={-1}
      aria-labelledby="personal-heading"
      className="mt-20 border-t border-[hsl(var(--stroke))] pt-16 md:mt-28 md:pt-24"
    >
      <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
        {/* The red falloff comes from the recording itself: a stage curtain
            under one warm light, so the frame looks lit rather than boxed. */}
        <div className="relative mx-auto w-full max-w-[22rem] md:col-span-5 md:max-w-none">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 rounded-[3rem] md:-inset-10 bg-[radial-gradient(closest-side,rgba(150,22,32,0.35),transparent)] blur-2xl"
          />
          <video
            aria-label={`Me playing piano, ${recording.duration}`}
            controls
            playsInline
            preload="none"
            poster={`/assets/personal/${recording.file}.webp`}
            className="relative aspect-[9/16] max-h-[78vh] w-full rounded-2xl border border-[hsl(var(--stroke))] bg-black object-cover shadow-2xl shadow-black/60"
          >
            <source src={`/assets/personal/${recording.file}.mp4`} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        </div>

        <div className="min-w-0 md:col-span-7">
          <h3 id="personal-heading" className="font-display text-4xl leading-none sm:text-5xl lg:text-6xl">
            Away from the desk
          </h3>
          <p className="mt-4 max-w-md text-base text-[hsl(var(--body))] sm:text-lg">
            I play piano. Here&apos;s me at the keys, and a keyboard you can
            try yourself.
          </p>

          <div className="mt-8 max-w-xl">
            <Piano />
          </div>
        </div>
      </div>

      <div className="mt-20 grid gap-10 md:mt-28 md:grid-cols-12 md:gap-12">
        <div className="min-w-0 md:col-span-8">
          <h4 className="text-lg font-semibold">What I&apos;m learning</h4>
          <dl className="mt-6 grid gap-8 sm:grid-cols-2">
            <div className="border-t border-[hsl(var(--stroke))] pt-4">
              <dt className="text-sm text-[hsl(var(--muted))]">Research</dt>
              <dd className="mt-2 font-display text-2xl leading-snug sm:text-3xl">
                I read papers I half understand, then take notes until I get the other half.
              </dd>
            </div>
            <div className="border-t border-[hsl(var(--stroke))] pt-4">
              <dt className="text-sm text-[hsl(var(--muted))]">Languages</dt>
              <dd className="mt-2 font-display text-2xl leading-snug sm:text-3xl">
                Vietnamese and English, fluently. French, slowly. TypeScript, loudly.
              </dd>
            </div>
          </dl>
        </div>
        <figure className="min-w-0 md:col-span-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))]">
            <Image
              src="/assets/personal/teaching-robot.webp"
              alt="A small grey and teal brick robot on a work table"
              fill
              sizes="(min-width: 768px) 340px, 92vw"
              className="object-cover"
            />
          </div>
          <figcaption className="pt-3">
            <span className="block font-semibold">Teaching kids</span>
            <span className="mt-1 block text-sm text-[hsl(var(--muted))]">A little robot from a session where I taught kids.</span>
          </figcaption>
        </figure>
      </div>

      <div className="mt-20 md:mt-28">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h4 className="font-display text-3xl leading-none sm:text-4xl">The homelab</h4>
          <p className="max-w-md text-base text-[hsl(var(--body))]">
            Where my side projects live, and sometimes where they go to rest.
          </p>
        </div>
        {/* Phones get a swipeable carousel; wider screens see all three at once. */}
        <div className="mt-8 md:hidden">
          <SnapCarousel label="Homelab photos" peek={36} gap={12}>
            {homelab.map((shot) => (
              <HomelabShot key={shot.src} shot={shot} sizes="80vw" />
            ))}
          </SnapCarousel>
        </div>
        <ul className="mt-8 hidden gap-4 md:grid md:grid-cols-3">
          {homelab.map((shot) => (
            <li key={shot.src}>
              <HomelabShot shot={shot} sizes="380px" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
