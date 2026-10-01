import { fireEvent, render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { QrCode, StoreBadge, StoreBadgeGroup } from "./store-badge";

describe("StoreBadge", () => {
  it("renders App Store copy and link", () => {
    const { getByText, container } = render(
      <StoreBadge store="app-store" href="https://apps.apple.com/app" />,
    );
    expect(getByText("App Store")).toBeInTheDocument();
    expect(container.querySelector("a")).toHaveAttribute(
      "href",
      "https://apps.apple.com/app",
    );
  });

  it("renders Google Play copy", () => {
    const { getByText } = render(<StoreBadge store="google-play" href="#" />);
    expect(getByText("Google Play")).toBeInTheDocument();
  });

  it("marks the store on the root", () => {
    const { container } = render(<StoreBadge store="google-play" href="#" />);
    expect(
      container.querySelector('[data-slot="store-badge"]'),
    ).toHaveAttribute("data-store", "google-play");
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<StoreBadge ref={ref} store="app-store" href="#" />);
    expect(ref.current).not.toBeNull();
    expect(StoreBadge.displayName).toBe("StoreBadge");
  });

  it("does not render a QR popover without the qr prop", () => {
    const { queryByRole } = render(
      <StoreBadge store="app-store" href="https://apps.apple.com" />,
    );
    expect(queryByRole("dialog")).toBeNull();
  });

  it("reveals the QR popover on hover when qr is set", () => {
    const { container, getByRole, queryByRole } = render(
      <StoreBadge
        store="app-store"
        href="https://apps.apple.com/app"
        qr
        qrLabel="Scan to install"
      />,
    );
    expect(queryByRole("dialog")).toBeNull();
    const badge = container.querySelector(
      '[data-slot="store-badge"]',
    ) as HTMLElement;
    // The wrapper span owns the hover handlers.
    fireEvent.mouseEnter(badge.parentElement as HTMLElement);
    expect(getByRole("dialog")).toHaveAttribute(
      "aria-label",
      "Scan to install",
    );
  });
});

describe("QrCode", () => {
  it("renders an accessible QR svg for the value", () => {
    const { getByRole } = render(<QrCode value="https://godui.design" />);
    const svg = getByRole("img");
    expect(svg).toHaveAttribute(
      "aria-label",
      "QR code for https://godui.design",
    );
    expect(svg.querySelector("path")?.getAttribute("d")).toBeTruthy();
  });

  it("uses a custom label and renders a center logo", () => {
    const { getByRole, getByTestId } = render(
      <QrCode
        value="x"
        label="Scan me"
        logo={<span data-testid="logo">L</span>}
      />,
    );
    expect(getByRole("img")).toHaveAttribute("aria-label", "Scan me");
    expect(getByTestId("logo")).toBeInTheDocument();
  });
});

describe("StoreBadgeGroup", () => {
  it("renders its children", () => {
    const { getByText } = render(
      <StoreBadgeGroup>
        <StoreBadge store="app-store" href="#" />
        <StoreBadge store="google-play" href="#" />
      </StoreBadgeGroup>,
    );
    expect(getByText("App Store")).toBeInTheDocument();
    expect(getByText("Google Play")).toBeInTheDocument();
  });
});
