import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VoiceOrb } from "./voice-orb";

describe("VoiceOrb", () => {
  it("forwards ref to the container", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<VoiceOrb ref={ref} />);
    expect(ref.current?.getAttribute("data-slot")).toBe("voice-orb");
  });

  it("reflects the current state on the data attribute", () => {
    const { getByTestId } = render(
      <VoiceOrb data-testid="orb" state="listening" />,
    );
    expect(getByTestId("orb").getAttribute("data-state")).toBe("listening");
  });

  it("exposes amplitude as the --amp custom property when active", () => {
    const { getByTestId } = render(
      <VoiceOrb data-testid="orb" state="speaking" amplitude={0.5} />,
    );
    expect(getByTestId("orb").style.getPropertyValue("--amp")).not.toBe("");
  });

  it("clamps idle amplitude to zero", () => {
    const { getByTestId } = render(
      <VoiceOrb data-testid="orb" state="idle" amplitude={0.9} />,
    );
    expect(getByTestId("orb").style.getPropertyValue("--amp")).toBe("0");
  });
});
