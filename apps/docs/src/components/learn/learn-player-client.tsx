"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { ChevronLeft, ChevronRight, Code, X } from "lucide-react";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { BorderBeam } from "@/components/border-beam";
import { CopyButton } from "@/components/copy-button";
import { BareSceneProvider } from "@/components/learn/bare-scene-context";
import { useLearnMeta } from "@/components/learn/learn-player-context";
import { usePrefersReducedMotion } from "@/components/learn/scroll-scene";
import { ReplayButton } from "@/components/replay-button";
import { cn } from "@/lib/cn";
import { formatCode } from "@/lib/format-code";

export type PlayerChapter = {
  label: string;
  scene: ReactNode;
  code?: string;
  lang: string;
  isResult: boolean;
  prose: ReactNode;
};

const pad = (n: number) => String(n).padStart(2, "0");

// Subtle enter for the swapped scene, plus prose styling for the chapter text —
// the player root is `not-prose` (so the stage chrome is fully controlled), so
// the MDX chapter bodies need paragraph spacing + inline-code chips re-applied.
const PLAYER_CSS = `
@keyframes learn-scene-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
.learn-scene-in { animation: learn-scene-in 0.42s cubic-bezier(0.16, 1, 0.3, 1) both; }

.learn-step-prose {
  color: var(--foreground);
  font-size: 1.0625rem;
  line-height: 1.75;
  text-wrap: pretty;
}
.learn-step-prose p { margin-top: 1rem; }
.learn-step-prose p:first-child { margin-top: 0; }
.learn-step-prose strong { font-weight: 600; }
.learn-step-prose em { font-style: italic; }
.learn-step-prose code {
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 0.85em;
  padding: 0.12em 0.36em;
  border-radius: 6px;
  background: var(--muted, rgba(0, 0, 0, 0.05));
  border: 1px solid var(--border, rgba(0, 0, 0, 0.1));
  white-space: nowrap;
}
`;

// Grid card: bar row + scene row + an animated code row. The code container is
// always mounted; toggling `--code-row` between 0 and its height animates
// `grid-template-rows` (same technique as the Workbench code pane).
const STAGE_CARD =
  "relative grid overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_-14px_rgba(0,0,0,0.22)]";
const CODE_H_DESKTOP = "clamp(180px, 40vh, 360px)";
const CODE_H_MOBILE = "min(52svh, 420px)";

function stageRows(
  hasCode: boolean,
  codeOpen: boolean,
  sceneRow: string,
  codeH: string,
  reduced: boolean,
): CSSProperties {
  return {
    gridTemplateRows: hasCode
      ? `auto ${sceneRow} var(--code-row, 0px)`
      : `auto ${sceneRow}`,
    "--code-row": hasCode && codeOpen ? codeH : "0px",
    // easeOutCubic — a gentle, even glide (not the snappy front-load of expo) so
    // the scene resize + code reveal read as one soft, flowing motion.
    transition: reduced
      ? undefined
      : "grid-template-rows 340ms cubic-bezier(0.33, 1, 0.68, 1)",
  } as CSSProperties;
}

const BAR = "flex items-center gap-2.5 border-fd-border border-b px-3 py-2";
const COUNTER = "font-mono text-[13px] text-fd-muted-foreground tabular-nums";
const NAV_BTN =
  "inline-flex size-8 items-center justify-center rounded-[10px] border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:border-fd-primary/45 hover:text-fd-primary disabled:pointer-events-none disabled:opacity-40";
const STEP_TITLE =
  "flex items-baseline gap-3 [&>h2]:text-balance [&>h2]:font-semibold [&>h2]:text-2xl [&>h2]:text-[var(--foreground)] [&>h2]:tracking-tight";

/** Prettier-formats a chapter's code; seeds with the raw source so there's no
 * empty flash before prettier resolves. Empty / chapter switches derive the
 * seed during render — no sync setState in the effect. */
function useFormattedCode(code: string | undefined, lang: string) {
  const seed = code?.trim() ?? "";
  const [pretty, setPretty] = useState<{
    source: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    if (!code) return;
    let alive = true;
    const source = code;
    void formatCode(source, lang).then((next) => {
      if (alive) setPretty({ source, value: next });
    });
    return () => {
      alive = false;
    };
  }, [code, lang]);

  if (!code) return "";
  if (pretty?.source === code) return pretty.value;
  return seed;
}

function StepDot({
  index,
  active,
  onClick,
}: {
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Go to chapter ${index + 1}`}
      aria-current={active ? "step" : undefined}
      className="group relative inline-flex items-center justify-center p-2 active:scale-[0.96] motion-reduce:active:scale-100"
    >
      <span
        className={cn(
          "block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          active
            ? "w-5 bg-[var(--foreground)]"
            : "w-1.5 bg-[var(--muted-foreground)]/40 group-hover:bg-[var(--muted-foreground)]",
        )}
      />
    </button>
  );
}

/** The `</>` toggle that opens/closes the bottom code container. */
function CodeToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={open}
      aria-label={open ? "Hide code" : "Show code"}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-[10px] border transition-colors",
        open
          ? "border-fd-primary/45 bg-fd-primary/10 text-fd-primary"
          : "border-fd-border bg-fd-card text-fd-muted-foreground hover:border-fd-primary/45 hover:text-fd-primary",
      )}
    >
      <Code className="size-4" aria-hidden="true" />
    </button>
  );
}

/** The centered scene canvas that fills a stage card. The scene is a Learn scene
 * element (usually `<ScrollScene>`-wrapped); `BareSceneProvider` makes it render
 * chrome-less and drives its play state from `cycle`. */
function SceneCanvas({
  scene,
  cycle,
  playKey,
  reduced,
  className,
}: {
  scene: ReactNode;
  cycle: number;
  playKey: string;
  reduced: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center p-6 md:p-8",
        className,
      )}
    >
      <BareSceneProvider value={{ cycle, reduced }}>
        <div
          key={playKey}
          className={cn(
            "flex w-full items-center justify-center [&>*]:min-w-0",
            reduced ? "" : "learn-scene-in",
          )}
        >
          {scene}
        </div>
      </BareSceneProvider>
    </div>
  );
}

/** The bottom code drawer inside a stage card — header (lang + copy + close) +
 * scrollable highlighted source. */
function CodeContainer({
  lang,
  formatted,
  onClose,
  open,
}: {
  lang: string;
  formatted: string;
  onClose: () => void;
  open: boolean;
}) {
  return (
    <div
      // Always mounted so the grid-row height can animate; `inert` when closed
      // keeps it out of focus/AT while collapsed to 0px. Content fades + comes
      // into focus as the drawer opens (materialize, not a hard wipe).
      inert={!open}
      className={cn(
        "flex min-h-0 flex-col overflow-hidden border-fd-border border-t bg-fd-card transition-[opacity,filter] duration-[440ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none",
        open ? "opacity-100 blur-0" : "opacity-0 blur-[6px]",
      )}
    >
      <div className="flex items-center gap-2 border-fd-border/60 border-b px-3 py-1.5">
        <span className="font-mono text-[11px] text-fd-muted-foreground uppercase tracking-wider">
          {lang}
        </span>
        <div className="ms-auto flex items-center gap-1">
          <CopyButton value={formatted} className="rounded-[8px]" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Hide code"
            className="inline-flex size-7 items-center justify-center rounded-[8px] text-fd-muted-foreground transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <DynamicCodeBlock
          lang={lang}
          code={formatted}
          codeblock={{
            allowCopy: false,
            className: "my-0 h-full rounded-none border-0 shadow-none",
          }}
        />
      </div>
    </div>
  );
}

/** One self-contained, non-sticky chapter card — the mobile layout. Height is
 * dynamic (min-height + grows with content) so nothing is clipped. */
function MobileChapter({
  chapter,
  index,
  total,
  reduced,
}: {
  chapter: PlayerChapter;
  index: number;
  total: number;
  reduced: boolean;
}) {
  const [codeOpen, setCodeOpen] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [plays, setPlays] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const formatted = useFormattedCode(chapter.code, chapter.lang);
  const hasCode = !chapter.isResult && Boolean(chapter.code);

  // Play the scene once, when the card scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (reduced || !el || typeof IntersectionObserver === "undefined") {
      setCycle((c) => (c === 0 ? 1 : c));
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCycle((c) => (c === 0 ? 1 : c));
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section ref={ref} className="mb-12">
      <div
        className={cn(STAGE_CARD, "min-h-[360px]")}
        style={stageRows(hasCode, codeOpen, "auto", CODE_H_MOBILE, reduced)}
      >
        <BorderBeam play={plays} />
        <div className={BAR}>
          <span className={COUNTER}>
            {pad(index + 1)}
            <span className="text-fd-muted-foreground/50">/{pad(total)}</span>
          </span>
          <span className="min-w-0 truncate font-medium text-[13px] text-[var(--foreground)]">
            {chapter.isResult ? "Result" : chapter.label}
          </span>
          <div className="ms-auto flex items-center gap-1.5">
            {hasCode ? (
              <CodeToggle
                open={codeOpen}
                onClick={() => setCodeOpen((o) => !o)}
              />
            ) : null}
            {chapter.isResult ? null : (
              <ReplayButton onReplay={() => setPlays((p) => p + 1)} />
            )}
          </div>
        </div>
        <SceneCanvas
          scene={chapter.scene}
          cycle={cycle}
          playKey={`${cycle}-${plays}`}
          reduced={reduced}
          className="min-h-0 overflow-hidden"
        />
        {hasCode ? (
          <CodeContainer
            lang={chapter.lang}
            formatted={formatted}
            onClose={() => setCodeOpen(false)}
            open={codeOpen}
          />
        ) : null}
      </div>
      <div className="mt-4">
        <div className={STEP_TITLE}>
          <span className="font-mono text-fd-muted-foreground/60 text-sm tabular-nums">
            {pad(index + 1)}
          </span>
          <h2>{chapter.label}</h2>
        </div>
        <div className="learn-step-prose mt-3">{chapter.prose}</div>
      </div>
    </section>
  );
}

/**
 * Scroll-driven Learn article.
 *
 * Desktop (md+): a two-column read — the chapter texts scroll in the LEFT
 * column while the preview card pins on the RIGHT (`position: sticky`, aligned
 * under the breadcrumb). Whichever text step crosses the read-line swaps the
 * pinned preview's scene. A `</>` toggle opens a bottom code container inside
 * the card (collapsed by default).
 *
 * Mobile: a plain vertical stack of self-contained chapter cards (dynamic
 * height), each with its own scene + `</>` code toggle + text.
 *
 * Title + description come from `LearnPlayerProvider`. Supporting sections
 * (Accessibility, Motion Score) render as full-width MDX prose after this.
 */
export function LearnPlayerClient({ chapters }: { chapters: PlayerChapter[] }) {
  const meta = useLearnMeta();
  const [active, setActive] = useState(0);
  const [codeOpen, setCodeOpen] = useState(false);
  // Bumped only on a manual replay — drives the border beam + a fresh scene key.
  const [plays, setPlays] = useState(0);
  const reduced = usePrefersReducedMotion();
  const stepEls = useRef<(HTMLElement | null)[]>([]);
  const inView = useRef<Set<number>>(new Set());

  const chapter = chapters[active];
  const hasCode = !chapter.isResult && Boolean(chapter.code);
  const last = chapters.length - 1;
  const formatted = useFormattedCode(chapter.code, chapter.lang);

  // Scroll drives the active chapter: whichever left-column text step is
  // crossing the read-line wins. `max` so scrolling down advances to the later
  // step and scrolling up releases it.
  useEffect(() => {
    const els = stepEls.current.filter(Boolean) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const idx = Number((e.target as HTMLElement).dataset.step);
          if (e.isIntersecting) inView.current.add(idx);
          else inView.current.delete(idx);
        }
        if (inView.current.size) setActive(Math.max(...inView.current));
      },
      { rootMargin: "-24% 0px -52% 0px", threshold: 0 },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, []);

  // Land the step's title just under the header (desktop two-column read).
  const goto = (i: number) => {
    const el = stepEls.current[i];
    if (!el) return;
    setActive(i);
    const y = el.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  };
  const replay = () => setPlays((p) => p + 1);

  return (
    <div className="not-prose">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
      <style dangerouslySetInnerHTML={{ __html: PLAYER_CSS }} />

      {/* Desktop: text (left) scrolls, preview (right) pins under the breadcrumb. */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-10">
        {/* Text column. */}
        <div className="min-w-0">
          {meta ? (
            <header className="flex flex-col pt-1 pb-[8svh]">
              <h1 className="text-balance font-semibold text-3xl text-[var(--foreground)] tracking-tight">
                {meta.title}
              </h1>
              {meta.description ? (
                <p className="mt-4 text-pretty text-fd-muted-foreground text-lg leading-relaxed">
                  {meta.description}
                </p>
              ) : null}
              <p className="mt-8 inline-flex items-center gap-2 font-medium text-fd-muted-foreground text-xs uppercase tracking-wider">
                <span className="motion-safe:animate-bounce">↓</span>
                Scroll to step through it
              </p>
            </header>
          ) : null}

          {chapters.map((c, i) => (
            <section
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed authored order
              key={i}
              data-step={i}
              ref={(el) => {
                stepEls.current[i] = el;
              }}
              className={cn(
                "flex flex-col justify-start border-fd-border/60 border-t pt-[5svh] transition-opacity duration-500 first:border-t-0 motion-reduce:transition-none",
                // Last step matches the sticky stage height so the title can
                // reach the card top — then the stage unpins and post-player
                // sections (Motion Score) scroll in. Earlier steps keep a
                // shorter reading window + bottom gap before the next title.
                i === last
                  ? "min-h-[calc(100svh-var(--fd-docs-row-1,3.5rem)-2rem)] pb-0"
                  : "min-h-[66svh] pb-[11svh]",
                i === active ? "opacity-100" : "opacity-45",
              )}
            >
              <div className={STEP_TITLE}>
                <span className="font-mono text-fd-muted-foreground/60 text-sm tabular-nums">
                  {pad(i + 1)}
                </span>
                <h2>{c.label}</h2>
              </div>
              <div className="learn-step-prose mt-4">{c.prose}</div>
            </section>
          ))}
        </div>

        {/* Preview column — pinned. Pulled up to sit at the sticky position
            (aligned with the breadcrumb row) from the start, not below it. */}
        <div className="sticky top-[var(--fd-docs-row-1,3.5rem)] z-20 self-start pt-3 lg:-mt-[3.25rem]">
          <div
            className={cn(
              STAGE_CARD,
              "h-[calc(100svh-var(--fd-docs-row-1,3.5rem)-2rem)] min-h-[420px]",
            )}
            style={stageRows(
              hasCode,
              codeOpen,
              "minmax(0, 1fr)",
              CODE_H_DESKTOP,
              reduced,
            )}
          >
            <BorderBeam play={plays} />
            <div className={BAR}>
              <span className={COUNTER}>
                {pad(active + 1)}
                <span className="text-fd-muted-foreground/50">
                  /{pad(chapters.length)}
                </span>
              </span>
              <span className="hidden min-w-0 truncate font-medium text-[13px] text-[var(--foreground)] lg:inline">
                {chapter.isResult ? "Result" : chapter.label}
              </span>
              <div className="ms-auto flex items-center gap-1.5">
                <div className="mr-1 hidden items-center lg:flex">
                  {chapters.map((c, i) => (
                    <StepDot
                      key={c.label}
                      index={i}
                      active={i === active}
                      onClick={() => goto(i)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Previous chapter"
                  disabled={active === 0}
                  onClick={() => goto(Math.max(0, active - 1))}
                  className={NAV_BTN}
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next chapter"
                  disabled={active === last}
                  onClick={() => goto(Math.min(last, active + 1))}
                  className={NAV_BTN}
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
                {hasCode ? (
                  <CodeToggle
                    open={codeOpen}
                    onClick={() => setCodeOpen((o) => !o)}
                  />
                ) : null}
                {chapter.isResult ? null : <ReplayButton onReplay={replay} />}
              </div>
            </div>
            <SceneCanvas
              scene={chapter.scene}
              cycle={plays}
              playKey={`${active}-${plays}`}
              reduced={reduced}
              className="min-h-0 overflow-hidden"
            />
            {hasCode ? (
              <CodeContainer
                lang={chapter.lang}
                formatted={formatted}
                onClose={() => setCodeOpen(false)}
                open={codeOpen}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile + tablet: a plain stack of self-contained chapter cards. */}
      <div className="lg:hidden">
        {meta ? (
          <header className="pt-[2svh] pb-8">
            <h1 className="text-balance font-semibold text-3xl text-[var(--foreground)] tracking-tight">
              {meta.title}
            </h1>
            {meta.description ? (
              <p className="mt-4 text-pretty text-fd-muted-foreground text-lg leading-relaxed">
                {meta.description}
              </p>
            ) : null}
          </header>
        ) : null}
        {chapters.map((c, i) => (
          <MobileChapter
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed authored order
            key={i}
            chapter={c}
            index={i}
            total={chapters.length}
            reduced={reduced}
          />
        ))}
      </div>
    </div>
  );
}
