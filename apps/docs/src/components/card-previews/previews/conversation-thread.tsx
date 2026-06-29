"use client";

export default function ConversationThreadPreview() {
  return (
    <div className="flex w-48 flex-col gap-2">
      <div className="flex justify-start">
        <div className="h-7 w-28 rounded-2xl rounded-bl-sm bg-[var(--muted-foreground)]/20" />
      </div>
      <div className="flex justify-end">
        <div className="h-7 w-32 rounded-2xl rounded-br-sm bg-primary" />
      </div>
      <div className="flex max-h-0 justify-start overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-12 group-hover:opacity-100">
        <div className="h-7 w-24 rounded-2xl rounded-bl-sm bg-[var(--muted-foreground)]/20" />
      </div>
    </div>
  );
}
