"use client";

import {
  useAudioAmplitude,
  VoiceOrb,
  type VoiceOrbState,
} from "@godui/components";
import * as React from "react";

const STATES: VoiceOrbState[] = ["idle", "listening", "speaking"];

export function VoiceOrbDemo() {
  const [state, setState] = React.useState<VoiceOrbState>("speaking");
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const micAmp = useAudioAmplitude(stream);

  // Synthetic amplitude when no mic is attached, so the orb always feels alive.
  // Idle is handled in render (amplitude 0), so the loop only runs while active —
  // and it's kicked off via rAF so no setState fires synchronously in the effect.
  const [synthAmp, setSynthAmp] = React.useState(0);
  React.useEffect(() => {
    if (stream || state === "idle") return;
    let raf = 0;
    const loop = () => {
      const t = performance.now() / 1000;
      const base = state === "speaking" ? 0.55 : 0.3;
      setSynthAmp(base + base * Math.sin(t * 6) * Math.sin(t * 1.7));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state, stream]);

  const amplitude = stream ? micAmp : state === "idle" ? 0 : synthAmp;

  const toggleMic = async () => {
    if (stream) {
      for (const t of stream.getTracks()) t.stop();
      setStream(null);
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(s);
      setState("listening");
    } catch {
      // Permission denied or unavailable — stay on the synthetic signal.
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-8 py-6">
      <VoiceOrb state={state} amplitude={amplitude} />

      <div className="flex flex-wrap items-center justify-center gap-2">
        {STATES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setState(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize [transition:background_150ms_ease] ${
              state === s
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground hover:bg-accent/70"
            }`}
          >
            {s}
          </button>
        ))}
        <button
          type="button"
          onClick={toggleMic}
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium [transition:background_150ms_ease] hover:bg-accent"
        >
          {stream ? "Stop mic" : "Use mic"}
        </button>
      </div>
    </div>
  );
}
