import { Slider } from "@godui/components";

export function SliderDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-10">
      <Slider defaultValue={[50]} max={100} step={1} aria-label="Volume" />
      <Slider
        defaultValue={[25, 75]}
        max={100}
        step={5}
        aria-label="Price range"
      />
    </div>
  );
}
