"use client";

import { WorldMap } from "@godui/components";

export function WorldMapDemo() {
  return (
    <div className="w-full px-4 py-10">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Ship to every region
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Traffic routes to the nearest edge — visualized live across the globe.
        </p>
      </div>
      <div className="mx-auto mt-6 max-w-4xl">
        <WorldMap
          connections={[
            {
              start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
              end: { lat: 51.5074, lng: -0.1278, label: "London" },
            },
            {
              start: { lat: 51.5074, lng: -0.1278, label: "London" },
              end: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
            },
            {
              start: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
              end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
            },
            {
              start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
              end: { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
            },
            {
              start: { lat: 40.7128, lng: -74.006, label: "New York" },
              end: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
            },
          ]}
        />
      </div>
    </div>
  );
}
