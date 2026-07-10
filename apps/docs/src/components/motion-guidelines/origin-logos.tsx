import type { ComponentType, SVGProps } from "react";

/** Where a motion principle traces back to. The first origin on a card is the
 * strongest source; the rest are where the principle is shared. */
export type MotionOrigin = "disney" | "apple" | "material";

type LogoProps = SVGProps<SVGSVGElement>;

function AppleLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" {...props}>
      <title>Apple</title>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function MaterialLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" {...props}>
      <title>Material Design</title>
      <path d="M11.9998 23.9997c-1.6545 0-3.218-.309-4.691-.927-1.4544-.6364-2.7269-1.4909-3.8179-2.5639-1.073-1.0905-1.9274-2.3634-2.5634-3.8179C.3085 15.2179 0 13.6545 0 12c0-1.6725.309-3.2364.927-4.6909.6365-1.4545 1.491-2.718 2.564-3.791C4.5818 2.4278 5.8543 1.5733 7.3087.9548c1.473-.6365 3.0365-.9545 4.691-.9545 1.673 0 3.2364.318 4.6909.955 1.4544.618 2.7179 1.4725 3.7909 2.563 1.091 1.073 1.945 2.3364 2.5634 3.7909C23.6815 8.7641 24 10.3275 24 12c0 1.655-.3185 3.218-.955 4.6909-.618 1.4545-1.4724 2.7274-2.5634 3.818-1.073 1.0729-2.3365 1.9274-3.791 2.5639-1.455.618-3.0179.927-4.6909.927zm-7.6364-5.8633V5.8636A9.4843 9.4843 0 0 0 2.755 8.7001C2.373 9.7365 2.1825 10.8365 2.1825 12s.1905 2.2725.5724 3.3274a9.5713 9.5713 0 0 0 1.609 2.809zm1.5-13.7727H18.163a9.4848 9.4848 0 0 0-2.836-1.609c-1.0549-.382-2.1639-.5725-3.3273-.5725-1.1635 0-2.2725.1905-3.327.5725a9.5713 9.5713 0 0 0-2.8094 1.609Zm6.1364 10.3637 4.1179-8.1818H7.9088Zm1.091 2.727h4.3633V8.7276Zm-6.5454 0h4.3634L6.5454 8.7276Zm8.7813 3.791c1.0545-.382 2-.918 2.836-1.609H5.8628a9.5713 9.5713 0 0 0 2.8094 1.609c1.0545.3819 2.1635.5724 3.327.5724 1.0543 0 2.1823-.1579 3.3274-.5725zm4.3089-3.109a9.5713 9.5713 0 0 0 1.609-2.809c.382-1.055.5724-2.164.5724-3.3274 0-1.1635-.1905-2.2635-.5724-3.3-.382-1.055-.918-1.9999-1.609-2.8364Z" />
    </svg>
  );
}

/** Disney has no clean single-color wordmark glyph, so the classic Mickey-ears
 * silhouette stands in — instantly readable and rendered from three circles. */
function DisneyLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" {...props}>
      <title>Disney</title>
      <circle cx="5.5" cy="6" r="3.6" />
      <circle cx="18.5" cy="6" r="3.6" />
      <circle cx="12" cy="14" r="7" />
    </svg>
  );
}

const ORIGIN: Record<
  MotionOrigin,
  { label: string; Logo: ComponentType<LogoProps> }
> = {
  disney: { label: "Disney's 12 Principles", Logo: DisneyLogo },
  apple: { label: "Apple HIG", Logo: AppleLogo },
  material: { label: "Material 3", Logo: MaterialLogo },
};

/** Row of source logos shown to the right of a principle's title. */
export function OriginLogos({ origins }: { origins: MotionOrigin[] }) {
  return (
    <div className="flex shrink-0 items-center gap-2 pt-1">
      {origins.map((origin) => {
        const { label, Logo } = ORIGIN[origin];
        return (
          <Logo
            key={origin}
            role="img"
            aria-label={label}
            className="size-3.5 text-muted-foreground/70"
          />
        );
      })}
    </div>
  );
}
