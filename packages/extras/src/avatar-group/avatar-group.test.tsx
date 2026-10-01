import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { AvatarGroup } from "./avatar-group";

const avatars = [
  { fallback: "AB", alt: "Ada" },
  { fallback: "CD", alt: "Carl" },
  { fallback: "EF", alt: "Eve" },
  { fallback: "GH", alt: "Gus" },
  { fallback: "IJ", alt: "Ivy" },
];

describe("AvatarGroup", () => {
  it("renders an overflow chip when avatars exceed max", () => {
    render(<AvatarGroup avatars={avatars} max={3} />);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("renders no overflow chip when within max", () => {
    render(<AvatarGroup avatars={avatars.slice(0, 2)} max={4} />);
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("renders links when href is provided", () => {
    render(
      <AvatarGroup
        avatars={[{ fallback: "AB", alt: "Ada", href: "/ada" }]}
        max={4}
      />,
    );
    expect(screen.getByRole("link", { name: "Ada" })).toHaveAttribute(
      "href",
      "/ada",
    );
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<AvatarGroup ref={ref} avatars={avatars} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(AvatarGroup.displayName).toBe("AvatarGroup");
  });
});
