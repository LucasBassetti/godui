import { useFlipGroup } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";

/**
 * Fixtures for the runtime motion-trace harness (apps/storybook/motion-trace).
 * GpuOnly animates transform/opacity; LayoutThrash animates width on purpose so
 * the harness can prove it catches layout work. Not product components.
 */
const meta: Meta = { title: "Internal/Motion Trace", tags: ["!autodocs"] };
export default meta;

const KEYFRAMES = `
@keyframes trace-gpu { from { opacity: 0; transform: translateY(40px) scale(.9) } to { opacity: 1; transform: none } }
@keyframes trace-thrash { from { width: 40px } to { width: 400px } }
@keyframes trace-shadow { from { box-shadow: 0 0 0 rgb(0 0 0 / 0) } to { box-shadow: 0 20px 40px rgb(0 0 0 / .5) } }`;

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

export const BoxShadow: StoryObj = {
  render: () => <Fixture animation="trace-shadow" />,
};

/** WAAPI with composite:"add" — Chrome can't composite it (negative control). */
function WaapiAddFixture() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on || !ref.current) return;
    ref.current.animate(
      [{ transform: "translateY(40px)" }, { transform: "none" }],
      { duration: 600, composite: "add" },
    );
  }, [on]);
  return (
    <div>
      <button type="button" data-testid="go" onClick={() => setOn(true)}>
        Go
      </button>
      <div ref={ref} style={{ height: 40, width: 40, background: "black" }} />
    </div>
  );
}

export const WaapiAdd: StoryObj = { render: () => <WaapiAddFixture /> };

/** The real useFlipGroup: a row grows, the item below FLIPs. */
function FlipFixture() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useFlipGroup(ref, open, { duration: 600 });
  return (
    <div ref={ref}>
      <button type="button" data-testid="go" onClick={() => setOpen((v) => !v)}>
        Go
      </button>
      <div style={{ height: open ? 160 : 40, background: "#ddd" }} />
      <div data-flip style={{ height: 40, width: 40, background: "black" }} />
    </div>
  );
}

export const Flip: StoryObj = { render: () => <FlipFixture /> };
