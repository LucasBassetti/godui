import { Textarea } from "@godui/components";

export function TextareaDisabledDemo() {
  return (
    <div className="w-full max-w-sm">
      <Textarea placeholder="Type your message here." disabled />
    </div>
  );
}
