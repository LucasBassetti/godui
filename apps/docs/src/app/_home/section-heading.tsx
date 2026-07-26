import type { ReactNode } from "react";

/**
 * Shared marketing section header: small eyebrow label + balanced title +
 * optional lead paragraph. Keeps every landing section on the same rhythm.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  const isCenter = align === "center";
  return (
    <div
      className={
        isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left"
      }
    >
      <span className="inline-flex items-center rounded-full border border-fd-border bg-fd-card px-3 py-1 font-medium text-fd-muted-foreground text-xs uppercase tracking-wider">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-balance font-semibold text-3xl text-fd-foreground tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-pretty text-fd-muted-foreground sm:text-lg ${
            isCenter ? "mx-auto max-w-xl" : ""
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
