import { Input } from "@godui/components";

export function InputFileDemo() {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <label htmlFor="picture" className="font-medium text-sm">
        Picture
      </label>
      <Input id="picture" type="file" />
    </div>
  );
}
