import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

/**
 * Fixtures for the runtime motion-trace harness (apps/storybook/motion-trace).
 * GpuOnly animates transform/opacity; LayoutThrash animates width on purpose so
 * the harness can prove it catches layout work. Not product components.
 */
const meta: Meta = { title: "Internal/Motion Trace", tags: ["!autodocs"] };
export default meta;

const KEYFRAMES = `
@keyframes trace-gpu { from { opacity: 0; transform: translateY(40px) scale(.9) } to { opacity: 1; transform: none } }
@keyframes trace-thrash { from { width: 40px } to { width: 400px } }`;

function Fixture({ animation }: { animation: string }) {
  const [on, setOn] = useState(false);
  return (
    <div>
      <style>{KEYFRAMES}</style>
      <button type="button" data-testid="go" onClick={() => setOn((v) => !v)}>
        Go
      </button>
      {on ? (
        <div
          data-testid="box"
          style={{
            height: 40,
            width: 40,
            background: "black",
            animation: `${animation} 600ms linear both`,
          }}
        />
      ) : null}
    </div>
  );
}

export const GpuOnly: StoryObj = {
  render: () => <Fixture animation="trace-gpu" />,
};
export const LayoutThrash: StoryObj = {
  render: () => <Fixture animation="trace-thrash" />,
};
