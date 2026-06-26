"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

export type PromptComposerVariant = "comfortable" | "compact" | "minimal";

export type PromptAttachment = {
  /** Stable id for the attachment. */
  id: string;
  /** File name shown on the chip. */
  name: string;
  /** Optional byte size, rendered as a human label. */
  size?: number;
};

export type PromptComposerProps = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit"
> & {
  /** Controlled textarea value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Fired on every keystroke. */
  onValueChange?: (value: string) => void;
  /** Fired on submit (⌘/Ctrl+Enter or send button) with the text + attachments. */
  onSend?: (value: string, attachments: PromptAttachment[]) => void;
  /** When streaming, the send button morphs into a stop button. */
  isStreaming?: boolean;
  /** Fired when the stop button is pressed while streaming. */
  onStop?: () => void;
  placeholder?: string;
  variant?: PromptComposerVariant;
  /** Visual density of the textarea (max rows before scroll). */
  maxRows?: number;
  disabled?: boolean;
  /** Controlled attachments. Omit for internal drag/drop + paste handling. */
  attachments?: PromptAttachment[];
  onAttachmentsChange?: (attachments: PromptAttachment[]) => void;
  /** Available models for the inline picker. Hidden when omitted. */
  models?: string[];
  model?: string;
  onModelChange?: (model: string) => void;
};

const PANEL_BASE =
  "group/composer relative flex w-full flex-col gap-2 rounded-2xl border border-border bg-card/80 p-2.5 shadow-sm backdrop-blur-md transition-[box-shadow,border-color] focus-within:border-ring focus-within:shadow-md";

const variantPanel: Record<PromptComposerVariant, string> = {
  comfortable: "",
  compact: "gap-1.5 p-2",
  minimal: "border-transparent bg-muted/40 shadow-none focus-within:shadow-sm",
};

const TEXTAREA_BASE =
  "w-full resize-none bg-transparent px-2 pt-1.5 text-sm leading-6 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50";

const ICON_BUTTON =
  "inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40";

function formatBytes(bytes?: number): string | null {
  if (bytes == null) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const PromptComposer = React.forwardRef<HTMLFormElement, PromptComposerProps>(
  (
    {
      value,
      defaultValue = "",
      onValueChange,
      onSend,
      isStreaming = false,
      onStop,
      placeholder = "Ask anything…",
      variant = "comfortable",
      maxRows = 8,
      disabled = false,
      attachments,
      onAttachmentsChange,
      models,
      model,
      onModelChange,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const text = isControlled ? value : internalValue;

    const attachControlled = attachments !== undefined;
    const [internalAttachments, setInternalAttachments] = React.useState<
      PromptAttachment[]
    >([]);
    const chips = attachControlled ? attachments : internalAttachments;

    const [dragging, setDragging] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const setText = (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    };

    const setChips = (next: PromptAttachment[]) => {
      if (!attachControlled) setInternalAttachments(next);
      onAttachmentsChange?.(next);
    };

    // Auto-grow the textarea up to maxRows.
    // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure on value change
    React.useLayoutEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      const lineHeight = 24;
      const max = lineHeight * maxRows;
      el.style.height = `${Math.min(el.scrollHeight, max)}px`;
      el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
    }, [text, maxRows]);

    const canSend = text.trim().length > 0 || chips.length > 0;

    const submit = () => {
      if (isStreaming) {
        onStop?.();
        return;
      }
      if (!canSend || disabled) return;
      onSend?.(text, chips);
      setText("");
      setChips([]);
    };

    const filesToAttachments = (files: FileList): PromptAttachment[] =>
      Array.from(files).map((file) => ({
        id: `${file.name}-${file.size}-${crypto.randomUUID?.() ?? Math.random()}`,
        name: file.name,
        size: file.size,
      }));

    return (
      <form
        ref={ref}
        data-slot="prompt-composer"
        data-variant={variant}
        data-streaming={isStreaming ? "" : undefined}
        data-dragging={dragging ? "" : undefined}
        className={`${PANEL_BASE} ${variantPanel[variant]} ${dragging ? "border-ring ring-2 ring-ring/40" : ""} ${className ?? ""}`}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!dragging) setDragging(true);
        }}
        onDragLeave={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) {
            setChips([...chips, ...filesToAttachments(e.dataTransfer.files)]);
          }
        }}
        {...props}
      >
        <AnimatePresence initial={false}>
          {chips.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-1.5 overflow-hidden px-1"
            >
              <AnimatePresence initial={false}>
                {chips.map((chip) => (
                  <motion.span
                    key={chip.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background py-1 pl-2 pr-1 text-xs text-foreground shadow-2xs"
                  >
                    <PaperclipIcon className="size-3 text-muted-foreground" />
                    <span className="max-w-[12rem] truncate">{chip.name}</span>
                    {formatBytes(chip.size) ? (
                      <span className="text-muted-foreground tabular-nums">
                        {formatBytes(chip.size)}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      aria-label={`Remove ${chip.name}`}
                      className="inline-flex size-4 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      onClick={() =>
                        setChips(chips.filter((c) => c.id !== chip.id))
                      }
                    >
                      <CloseIcon className="size-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="Prompt"
          className={TEXTAREA_BASE}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
          onPaste={(e) => {
            if (e.clipboardData.files.length) {
              setChips([
                ...chips,
                ...filesToAttachments(e.clipboardData.files),
              ]);
            }
          }}
        />

        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-0.5">
            <label className={ICON_BUTTON} aria-label="Attach files">
              <PaperclipIcon className="size-4" />
              <input
                type="file"
                multiple
                className="sr-only"
                disabled={disabled}
                onChange={(e) => {
                  if (e.target.files?.length) {
                    setChips([...chips, ...filesToAttachments(e.target.files)]);
                    e.target.value = "";
                  }
                }}
              />
            </label>
            {models && models.length > 0 ? (
              <ModelPicker
                models={models}
                model={model ?? models[0]}
                onModelChange={onModelChange}
              />
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {text.length > 0 ? (
              <span className="text-xs tabular-nums text-muted-foreground">
                {text.length}
              </span>
            ) : null}
            <button
              type={isStreaming ? "button" : "submit"}
              disabled={!isStreaming && (!canSend || disabled)}
              aria-label={isStreaming ? "Stop generating" : "Send message"}
              onClick={isStreaming ? onStop : undefined}
              className="relative inline-flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-[transform,opacity,background-color] hover:bg-primary/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isStreaming ? (
                  <motion.span
                    key="stop"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.12 }}
                  >
                    <StopIcon className="size-3.5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="send"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.12 }}
                  >
                    <ArrowUpIcon className="size-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </form>
    );
  },
);
PromptComposer.displayName = "PromptComposer";

function ModelPicker({
  models,
  model,
  onModelChange,
}: {
  models: string[];
  model: string;
  onModelChange?: (model: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {model}
        <ChevronIcon
          className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute bottom-full left-0 z-popover mb-1.5 min-w-40 origin-bottom rounded-xl border border-border bg-popover p-1 shadow-lg"
          >
            {models.map((m) => (
              <li key={m}>
                <button
                  type="button"
                  role="option"
                  aria-selected={m === model}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onModelChange?.(m);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent ${m === model ? "font-medium text-foreground" : "text-muted-foreground"}`}
                >
                  {m}
                  {m === model ? (
                    <CheckIcon className="size-3.5 text-primary" />
                  ) : null}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

type IconProps = { className?: string };
const svg = "0 0 24 24";
function ArrowUpIcon({ className }: IconProps) {
  return (
    <svg
      viewBox={svg}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
function StopIcon({ className }: IconProps) {
  return (
    <svg
      viewBox={svg}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
function PaperclipIcon({ className }: IconProps) {
  return (
    <svg
      viewBox={svg}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}
function CloseIcon({ className }: IconProps) {
  return (
    <svg
      viewBox={svg}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function ChevronIcon({ className }: IconProps) {
  return (
    <svg
      viewBox={svg}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function CheckIcon({ className }: IconProps) {
  return (
    <svg
      viewBox={svg}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export { PromptComposer };
