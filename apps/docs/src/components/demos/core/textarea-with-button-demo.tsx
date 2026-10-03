import { Button, Textarea } from "@godui/components";

export function TextareaWithButtonDemo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  );
}
