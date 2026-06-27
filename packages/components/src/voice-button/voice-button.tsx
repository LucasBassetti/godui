"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type VoiceButtonVariant = "default" | "outline";
export type VoiceButtonSize = "sm" | "md" | "lg";
export type VoiceButtonMode = "toggle" | "hold";
export type VoiceButtonStatus = "idle" | "recording" | "denied";

export type VoiceButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> & {
  variant?: VoiceButtonVariant;
  size?: VoiceButtonSize;
  /** `"toggle"` (click to start/stop) or `"hold"` (push-to-talk). Default `"toggle"`. */
  mode?: VoiceButtonMode;
  /** Number of live waveform bars. Default `5`. */
  bars?: number;
  /** Fires when recording starts (mic granted). */
  onStart?: () => void;
  /** Fires when recording stops, with the elapsed milliseconds. */
  onStop?: (durationMs: number) => void;
  /** Fires if microphone permission is denied or unavailable. */
  onDenied?: () => void;
};

const BUTTON_BASE =
  "relative inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-[var(--button-radius)] font-medium [outline-offset:4px] [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] [transition:background_200ms_ease,box-shadow_200ms_ease,color_200ms_ease,scale_120ms_ease] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const variantClass: Record<VoiceButtonVariant, string> = {
  default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  outline:
    "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
};

const recordingClass = "!bg-destructive !text-white !border-transparent";

const sizeClass: Record<VoiceButtonSize, string> = {
  sm: "[--button-radius:var(--button-radius-sm)] px-[var(--button-px-sm)] py-[var(--button-py-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)]",
  md: "[--button-radius:var(--button-radius-md)] px-[var(--button-px-md)] py-[var(--button-py-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)]",
  lg: "[--button-radius:var(--button-radius-lg)] px-[var(--button-px-lg)] py-[var(--button-py-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)]",
};

const MicIcon = () => (
  <svg
    className="size-[1.15em]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
  </svg>
);

const VoiceButton = React.forwardRef<HTMLButtonElement, VoiceButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      mode = "toggle",
      bars = 5,
      onStart,
      onStop,
      onDenied,
      className,
      children,
      "aria-label": ariaLabel,
      disabled,
      ...props
    },
    forwardedRef,
  ) => {
    const reduce = useReducedMotion() ?? false;
    const [status, setStatus] = React.useState<VoiceButtonStatus>("idle");
    const [levels, setLevels] = React.useState<number[]>(() =>
      Array(bars).fill(0.18),
    );

    // Stable keys for the fixed-length bar set (avoids index keys).
    const barKeys = React.useMemo(
      () =>
        Array.from(
          { length: bars },
          (_, i) => `bar-${i}-${Math.random().toString(36).slice(2)}`,
        ),
      [bars],
    );

    const stream = React.useRef<MediaStream | null>(null);
    const audioCtx = React.useRef<AudioContext | null>(null);
    const raf = React.useRef<number>(0);
    const startedAt = React.useRef(0);
    const mounted = React.useRef(true);

    const teardown = React.useCallback(() => {
      cancelAnimationFrame(raf.current);
      stream.current?.getTracks().forEach((t) => {
        t.stop();
      });
      stream.current = null;
      audioCtx.current?.close().catch(() => {});
      audioCtx.current = null;
    }, []);

    React.useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
        teardown();
      };
    }, [teardown]);

    const stop = React.useCallback(() => {
      if (status !== "recording") return;
      teardown();
      setLevels(Array(bars).fill(0.18));
      setStatus("idle");
      onStop?.(Date.now() - startedAt.current);
    }, [status, teardown, bars, onStop]);

    const start = async () => {
      if (status === "recording" || disabled) return;
      const md =
        typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
      if (!md?.getUserMedia || typeof AudioContext === "undefined") {
        setStatus("denied");
        onDenied?.();
        return;
      }
      try {
        const media = await md.getUserMedia({ audio: true });
        if (!mounted.current) {
          media.getTracks().forEach((t) => {
            t.stop();
          });
          return;
        }
        stream.current = media;
        const ctx = new AudioContext();
        audioCtx.current = ctx;
        const sourceNode = ctx.createMediaStreamSource(media);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        sourceNode.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(data);
          const step = Math.floor(data.length / bars) || 1;
          const next = Array.from({ length: bars }, (_, i) => {
            const v = data[i * step] / 255;
            return Math.max(0.15, Math.min(1, v * 1.4));
          });
          setLevels(next);
          raf.current = requestAnimationFrame(tick);
        };

        startedAt.current = Date.now();
        setStatus("recording");
        onStart?.();
        if (!reduce) tick();
      } catch {
        if (mounted.current) {
          setStatus("denied");
          onDenied?.();
        }
      }
    };

    const recording = status === "recording";

    const handlers =
      mode === "hold"
        ? {
            onPointerDown: start,
            onPointerUp: stop,
            onPointerLeave: stop,
            onPointerCancel: stop,
          }
        : { onClick: () => (recording ? stop() : start()) };

    return (
      <button
        ref={forwardedRef}
        type="button"
        data-status={status}
        aria-pressed={recording}
        aria-label={ariaLabel ?? (children ? undefined : "Record voice")}
        disabled={disabled}
        className={`${BUTTON_BASE} ${variantClass[variant]} ${recording ? recordingClass : ""} ${sizeClass[size]} ${className ?? ""}`}
        {...handlers}
        {...props}
      >
        {/* Pulsing recording ring. */}
        {recording && !reduce && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-destructive"
            animate={{ opacity: [0.6, 0], scale: [1, 1.25] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        <span className="relative inline-flex items-center">
          {recording ? (
            <span
              aria-hidden="true"
              className="flex h-[1.15em] items-center gap-[2px]"
            >
              {levels.map((lvl, i) => (
                <span
                  key={barKeys[i]}
                  className="w-[3px] rounded-full bg-current [transition:height_90ms_linear]"
                  style={{ height: `${Math.round(lvl * 100)}%` }}
                />
              ))}
            </span>
          ) : (
            <MicIcon />
          )}
        </span>

        {children != null && (
          <span>
            {status === "denied"
              ? "Mic blocked"
              : recording
                ? "Recording…"
                : children}
          </span>
        )}
      </button>
    );
  },
);
VoiceButton.displayName = "VoiceButton";

export { VoiceButton };
