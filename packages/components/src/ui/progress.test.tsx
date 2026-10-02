import { render, screen } from "@testing-library/react";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/progress";
import * as Godui from "./progress";

function Usage({ ui }: { ui: typeof Shadcn }) {
  const { Progress } = ui;
  return <Progress value={60} className="w-[60%]" aria-label="Upload" />;
}

const indicator = () =>
  document.querySelector<HTMLElement>('[data-slot="progress-indicator"]');

describe("Progress", () => {
  it("matches shadcn's data-slot tree and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} />);
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("keeps shadcn's inline translate for the value", () => {
    render(<Usage ui={Godui} />);
    expect(indicator()?.style.transform).toBe("translateX(-40%)");
  });

  it("passes the value to Radix, so a determinate bar reports it and isn't indeterminate", () => {
    render(<Usage ui={Godui} />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "60");
    expect(indicator()).toHaveAttribute("data-state", "loading");
  });

  it("rounds the fill like the track, so its leading end isn't a square cut", () => {
    render(<Godui.Progress value={40} />);
    expect(indicator()?.className).toContain("rounded-full");
  });

  it("slides the fill on a spring with transform only", () => {
    render(<Usage ui={Godui} />);
    const cls = indicator()?.className ?? "";
    expect(cls).toContain("transition-[transform]");
    expect(cls).toContain("duration-(--godui-duration-slow)");
    expect(cls).toContain("ease-spring-smooth");
    expect(cls).toContain("motion-reduce:transition-none");
    expect(cls).not.toContain("transition-all");
  });

  it("sweeps when indeterminate (value null or omitted)", () => {
    const { unmount } = render(<Godui.Progress value={null} />);
    expect(indicator()).toHaveAttribute("data-state", "indeterminate");
    unmount();
    render(<Godui.Progress />);
    const el = indicator();
    expect(el).toHaveAttribute("data-state", "indeterminate");
    expect(el?.className).toContain(
      "data-[state=indeterminate]:animate-godui-progress-indeterminate",
    );
    expect(el?.className).toContain("data-[state=indeterminate]:w-2/5");
  });

  it("reduced motion: indeterminate becomes a full-width pulse in place", () => {
    render(<Godui.Progress value={null} />);
    const cls = indicator()?.className ?? "";
    expect(cls).toContain("motion-reduce:data-[state=indeterminate]:w-full");
    expect(cls).toContain(
      "motion-reduce:data-[state=indeterminate]:animate-pulse",
    );
    // The inline translateX(-100%) would hide a non-sweeping bar; cancel it.
    expect(cls).toContain(
      "motion-reduce:data-[state=indeterminate]:transform-none!",
    );
  });
});
