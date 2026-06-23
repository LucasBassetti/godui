import * as React from "react";

/**
 * Builds the displacement map fed to `feDisplacementMap`. The red channel
 * encodes the horizontal sampling shift, the green channel the vertical one;
 * `128` means "no shift". Two channel-isolated linear gradients are
 * screen-blended so R and G vary independently.
 *
 * `band` holds the gradient neutral across the middle so only the rim bends
 * (the flat panel's convex-edge look). A `band` of `0` ramps edge-to-edge — a
 * solid converging lens used for the circular cursor card.
 */
export function buildDisplacementMap(
  width: number,
  height: number,
  band = 0.3,
): string {
  const lo = (0.5 - band / 2).toFixed(3);
  const hi = (0.5 + band / 2).toFixed(3);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs>
<linearGradient id="x" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#ff0000"/>
<stop offset="${lo}" stop-color="#800000"/>
<stop offset="${hi}" stop-color="#800000"/>
<stop offset="1" stop-color="#000000"/>
</linearGradient>
<linearGradient id="y" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#00ff00"/>
<stop offset="${lo}" stop-color="#008000"/>
<stop offset="${hi}" stop-color="#008000"/>
<stop offset="1" stop-color="#000000"/>
</linearGradient>
</defs>
<rect width="${width}" height="${height}" fill="url(#x)"/>
<rect width="${width}" height="${height}" fill="url(#y)" style="mix-blend-mode:screen"/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const RED_CHANNEL = "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0";
const GREEN_CHANNEL = "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0";
const BLUE_CHANNEL = "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0";

/**
 * Chromatic-aberration displacement chain: runs the map at three scales and
 * recombines isolated R/G/B channels, so color fringes where the bend is
 * strongest.
 */
export function RefractionFilter({
  id,
  map,
  strength,
  dispersion,
}: {
  id: string;
  map: string;
  strength: number;
  dispersion: number;
}) {
  return (
    <filter
      id={id}
      x="0"
      y="0"
      width="100%"
      height="100%"
      colorInterpolationFilters="sRGB"
    >
      <feImage href={map} result="map" preserveAspectRatio="none" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale={strength * (1 + dispersion)}
        xChannelSelector="R"
        yChannelSelector="G"
        result="dispR"
      />
      <feColorMatrix
        in="dispR"
        type="matrix"
        values={RED_CHANNEL}
        result="red"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale={strength}
        xChannelSelector="R"
        yChannelSelector="G"
        result="dispG"
      />
      <feColorMatrix
        in="dispG"
        type="matrix"
        values={GREEN_CHANNEL}
        result="green"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale={strength * (1 - dispersion)}
        xChannelSelector="R"
        yChannelSelector="G"
        result="dispB"
      />
      <feColorMatrix
        in="dispB"
        type="matrix"
        values={BLUE_CHANNEL}
        result="blue"
      />
      <feBlend in="red" in2="green" mode="screen" result="rg" />
      <feBlend in="rg" in2="blue" mode="screen" />
    </filter>
  );
}

/** `backdrop-filter: url()` (live-DOM refraction) is Chrome/Edge only. */
export function useRefractionSupport(): boolean {
  const [refract, setRefract] = React.useState(false);
  React.useEffect(() => {
    setRefract(
      typeof CSS !== "undefined" &&
        typeof CSS.supports === "function" &&
        CSS.supports("backdrop-filter", "url(#a)"),
    );
  }, []);
  return refract;
}

export function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = value;
    }
  };
}
