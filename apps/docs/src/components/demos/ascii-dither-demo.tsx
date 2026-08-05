"use client";

import { AsciiDither } from "@godui/components";
import { DemoMedia } from "@/components/demos/_kit";

const PORTRAIT =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=512&h=640&fit=crop&q=80";
const VIDEO =
  "https://videos.pexels.com/video-files/1409899/1409899-sd_640_360_25fps.mp4";

function Cell({
  children,
  caption,
  ratio = "portrait",
  stack = false,
}: {
  children: React.ReactNode;
  caption: string;
  ratio?: "portrait" | "video";
  stack?: boolean;
}) {
  const size =
    ratio === "video"
      ? stack
        ? "aspect-video max-w-[38rem]"
        : "aspect-video max-w-[22rem]"
      : "aspect-[4/5] max-w-[16rem]";
  return (
    <figure className="flex w-full min-w-0 flex-1 flex-col items-center gap-2">
      <div
        className={`mx-auto w-full overflow-hidden rounded-xl border border-border bg-card ${size}`}
      >
        {children}
      </div>
      <figcaption className="font-mono text-muted-foreground text-xs">
        {caption}
      </figcaption>
    </figure>
  );
}

function Compare({
  original,
  rendered,
  label,
  ratio,
  stack = false,
}: {
  original: React.ReactNode;
  rendered: React.ReactNode;
  label: string;
  ratio?: "portrait" | "video";
  stack?: boolean;
}) {
  return (
    <DemoMedia max={stack ? "3xl" : "2xl"}>
      <div
        className={`flex items-center justify-center gap-4 ${stack ? "flex-col" : "flex-wrap sm:flex-nowrap"}`}
      >
        <Cell caption="original" ratio={ratio} stack={stack}>
          {original}
        </Cell>
        <span
          aria-hidden="true"
          className={`shrink-0 text-2xl text-muted-foreground ${stack ? "block rotate-90" : "hidden sm:block"}`}
        >
          →
        </span>
        <Cell caption={label} ratio={ratio} stack={stack}>
          {rendered}
        </Cell>
      </div>
    </DemoMedia>
  );
}

export function AsciiDitherDemo() {
  return (
    <Compare
      label="ascii"
      original={
        // biome-ignore lint/performance/noImgElement: static demo comparison
        <img
          src={PORTRAIT}
          alt="Original headphones"
          className="size-full object-cover"
        />
      }
      rendered={
        <AsciiDither
          src={PORTRAIT}
          alt="Headphones rendered as ASCII characters"
          variant="ascii"
          cellSize={4}
          contrast={1.4}
          color="theme"
          interactive
          reveal
        />
      }
    />
  );
}

export function AsciiDitherDitherDemo() {
  return (
    <Compare
      label="dither"
      original={
        // biome-ignore lint/performance/noImgElement: static demo comparison
        <img
          src={PORTRAIT}
          alt="Original headphones"
          className="size-full object-cover"
        />
      }
      rendered={
        <AsciiDither
          src={PORTRAIT}
          alt="Headphones rendered as halftone dither dots"
          variant="dither"
          dotShape="circle"
          cellSize={4}
          contrast={1.3}
          color="theme"
          reveal
        />
      }
    />
  );
}

export function AsciiDitherVideoDemo() {
  return (
    <Compare
      label="ascii"
      ratio="video"
      stack
      original={
        <video
          src={VIDEO}
          className="size-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      }
      rendered={
        <AsciiDither
          src={VIDEO}
          alt="Ocean waves rendered as ASCII"
          type="video"
          cellSize={5}
          contrast={1.35}
          color="theme"
          reveal={false}
        />
      }
    />
  );
}

export function AsciiDitherGlitchDemo() {
  return (
    <Compare
      label="glitch"
      original={
        // biome-ignore lint/performance/noImgElement: static demo comparison
        <img
          src={PORTRAIT}
          alt="Original headphones"
          className="size-full object-cover"
        />
      }
      rendered={
        <AsciiDither
          src={PORTRAIT}
          alt="Headphones rendered as ASCII with ambient glitch"
          variant="ascii"
          cellSize={4}
          contrast={1.4}
          color="theme"
          glitch
          reveal={false}
        />
      }
    />
  );
}
