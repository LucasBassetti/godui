"use client";

import * as React from "react";

export type VoiceOrbState = "idle" | "listening" | "speaking";

export type VoiceOrbProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "ref"
> & {
  /** Conversation phase the orb visualizes. Defaults to `"idle"`. */
  state?: VoiceOrbState;
  /**
   * Live audio level, `0`–`1`. Drives the core swell and corona spread while
   * `state="speaking"` (and the ring while `"listening"`). Pair with
   * {@link useAudioAmplitude} or feed your own analyser. Defaults to `0`.
   */
  amplitude?: number;
  /** Diameter in pixels. Defaults to `160`. */
  size?: number;
};

// Smooth, clamp and ease the raw level so a noisy analyser doesn't make the orb
// jitter — a touch of curve gives quiet speech visible life without the loud
// peaks blowing out.
const shape = (a: number) => {
  const c = Math.min(1, Math.max(0, a));
  return c ** 0.6;
};

const VoiceOrb = React.forwardRef<HTMLDivElement, VoiceOrbProps>(
  (
    { state = "idle", amplitude = 0, size = 160, className, style, ...props },
    ref,
  ) => {
    const level = state === "idle" ? 0 : shape(amplitude);

    return (
      <div
        ref={ref}
        data-slot="voice-orb"
        data-state={state}
        className={`relative grid aspect-square place-items-center [container-type:size] ${className ?? ""}`}
        style={
          {
            width: size,
            height: size,
            "--amp": level,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Corona — amplitude swells the wrapper; the inner layer spins. The
            split keeps the keyframe (rotate) from clobbering the inline scale. */}
        <div
          aria-hidden
          className="absolute inset-0 will-change-transform"
          style={{ transform: `scale(${0.92 + level * 0.35})` }}
        >
          <div className="size-full rounded-full opacity-70 blur-2xl [background:conic-gradient(from_0deg,var(--rainbow-1),var(--rainbow-2),var(--rainbow-3),var(--rainbow-4),var(--rainbow-5),var(--rainbow-1))] animate-voice-orb-spin motion-reduce:animate-none" />
        </div>

        {/* Core — wrapper breathes (keyframe scale); inner swells with speech. */}
        <div
          aria-hidden
          className="relative size-[78%] will-change-transform animate-voice-orb-breathe motion-reduce:animate-none"
        >
          <div
            className="size-full rounded-full shadow-[0_8px_40px_-8px_var(--rainbow-3),inset_0_2px_12px_rgba(255,255,255,0.35)] [background:radial-gradient(circle_at_32%_28%,color-mix(in_oklch,white_55%,var(--rainbow-1)),var(--rainbow-2)_42%,var(--primary)_100%)]"
            style={{ transform: `scale(${1 + level * 0.22})` }}
          >
            {/* Specular highlight to read as a lit sphere, not a flat disc. */}
            <span className="absolute left-[22%] top-[16%] size-[28%] rounded-full bg-white/55 blur-md" />
          </div>
        </div>

        {/* Listening ring — expands and fades, faster the louder the input. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full border border-[var(--ring)] opacity-0 data-[on=true]:animate-voice-orb-ring motion-reduce:animate-none"
          data-on={state === "listening"}
          style={{ animationDuration: `${1.6 - level * 0.7}s` }}
        />
      </div>
    );
  },
);
VoiceOrb.displayName = "VoiceOrb";

/**
 * Drives a `0`–`1` amplitude from a `MediaStream` (e.g. a microphone) or any
 * audio source you wrap in one. Returns `0` when `stream` is `null`, on the
 * server, or where Web Audio is unavailable, so it's safe to call
 * unconditionally and hand straight to {@link VoiceOrb}'s `amplitude`.
 */
export function useAudioAmplitude(stream: MediaStream | null): number {
  const [amplitude, setAmplitude] = React.useState(0);

  React.useEffect(() => {
    if (!stream) {
      setAmplitude(0);
      return;
    }
    const Ctx =
      typeof window !== "undefined"
        ? (window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext)
        : undefined;
    if (!Ctx) return;

    const ctx = new Ctx();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;

    const tick = () => {
      analyser.getByteTimeDomainData(data);
      // RMS of the waveform around the 128 zero-point → perceptual loudness.
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      setAmplitude(Math.min(1, Math.sqrt(sum / data.length) * 3));
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      source.disconnect();
      ctx.close();
    };
  }, [stream]);

  return amplitude;
}

export { VoiceOrb };
