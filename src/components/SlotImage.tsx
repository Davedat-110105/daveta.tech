"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Cover image with a graceful stand-in.
 *
 * Real assets live in /public/assets. A slot whose file is not there yet falls
 * back to a drafting plate rather than a broken image, so a missing cover reads
 * as reserved space instead of a bug.
 */
export function SlotImage({
  src,
  label,
  alt = "",
  sizes = "100vw",
  priority = false,
}: {
  src: string;
  label: string;
  /** Leave empty only when the neighbouring text already names the image. */
  alt?: string;
  /** Responsive hint. Set it per slot, otherwise next/image ships the widest file. */
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="slot-plate relative grid h-full w-full place-items-center px-4"
        aria-hidden="true"
      >
        <span className="text-center font-mono text-[10px] leading-relaxed tracking-[0.14em] text-faint">
          {label}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className="object-cover object-top"
    />
  );
}
