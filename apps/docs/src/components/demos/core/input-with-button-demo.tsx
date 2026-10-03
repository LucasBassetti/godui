import { Button, Input } from "@godui/components";

export function InputWithButtonDemo() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <label htmlFor="newsletter-email" className="font-medium text-sm">
        Email
      </label>
      <div className="flex items-center gap-2">
        <Input id="newsletter-email" type="email" placeholder="Email" />
        <Button type="submit" variant="outline">
          Subscribe
        </Button>
      </div>
    </div>
  );
}
