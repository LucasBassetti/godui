import type { ComponentProps } from "react";

type GoduiLogoProps = Omit<ComponentProps<"img">, "src" | "alt"> & {
  alt?: string;
};

// GodUI mark — rendered from the PNG asset in /public.
export function GoduiLogo({ alt = "GodUI", ...props }: GoduiLogoProps) {
  // biome-ignore lint/performance/noImgElement: small static logo, no layout shift
  return <img src="/logo.png" alt={alt} {...props} />;
}
