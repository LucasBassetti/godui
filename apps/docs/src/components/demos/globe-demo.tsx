"use client";

import { Globe } from "@godui/components";

// Tuned for a dark hero band: subtle landmasses with small, refined icy-blue
// markers — closer to the understated telemetry dots on premium product pages.
const GLOBE_CONFIG = {
  dark: 1,
  diffuse: 1.1,
  mapBrightness: 3.4,
  baseColor: [0.22, 0.25, 0.32] as [number, number, number],
  markerColor: [0.62, 0.82, 1] as [number, number, number],
  glowColor: [0.14, 0.22, 0.45] as [number, number, number],
  markers: [
    { location: [37.7595, -122.4367] as [number, number], size: 0.045 },
    { location: [40.7128, -74.006] as [number, number], size: 0.05 },
    { location: [43.6532, -79.3832] as [number, number], size: 0.035 },
    { location: [-23.5505, -46.6333] as [number, number], size: 0.04 },
    { location: [51.5074, -0.1278] as [number, number], size: 0.05 },
    { location: [48.8566, 2.3522] as [number, number], size: 0.035 },
    { location: [50.1109, 8.6821] as [number, number], size: 0.04 },
    { location: [-33.9249, 18.4241] as [number, number], size: 0.035 },
    { location: [19.076, 72.8777] as [number, number], size: 0.045 },
    { location: [1.3521, 103.8198] as [number, number], size: 0.04 },
    { location: [35.6762, 139.6503] as [number, number], size: 0.045 },
    { location: [-33.8688, 151.2093] as [number, number], size: 0.04 },
    { location: [55.7558, 37.6173] as [number, number], size: 0.035 },
    { location: [25.2048, 55.2708] as [number, number], size: 0.035 },
    { location: [-1.2921, 36.8219] as [number, number], size: 0.03 },
  ],
};

const STATS = [
  { value: "35", label: "Regions" },
  { value: "50ms", label: "p95 latency" },
  { value: "99.99%", label: "Uptime SLA" },
];

export function GlobeDemo() {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#04060f] [background:radial-gradient(120%_120%_at_50%_-20%,#13204a_0%,#04060f_55%)]">
      {/* Faint grid that fades toward the globe. */}
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(100%_55%_at_50%_0%,black,transparent)]" />

      <div className="relative z-raised flex flex-col items-center px-6 pt-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
          <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" />
          All systems operational
        </span>

        <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Deployed across every region on Earth
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">
          Your app runs at the edge in 35 regions, routed to the closest data
          center for sub-50ms responses anywhere on the planet.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#04060f] [transition:opacity_200ms_ease] hover:opacity-90"
          >
            Start deploying
          </button>
          <button
            type="button"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white [transition:background_200ms_ease] hover:bg-white/5"
          >
            View regions
          </button>
        </div>

        <div className="mt-8 flex divide-x divide-white/10">
          {STATS.map((s) => (
            <div key={s.label} className="px-5 first:pl-0 last:pr-0">
              <div className="text-xl font-semibold tabular-nums text-white">
                {s.value}
              </div>
              <div className="text-xs text-white/45">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Globe sits at the bottom, glowing and masked into the band. */}
      <div className="relative mx-auto -mt-4 h-[330px] w-full max-w-[560px] [mask-image:linear-gradient(to_bottom,black_62%,transparent)]">
        <div className="absolute left-1/2 top-12 size-[400px] -translate-x-1/2 rounded-full bg-[#2b50b8]/25 blur-3xl" />
        <Globe config={GLOBE_CONFIG} className="!max-w-none" />
      </div>
    </div>
  );
}
