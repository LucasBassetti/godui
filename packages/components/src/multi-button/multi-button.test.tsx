import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CompactMultiButton,
  MultiButton,
  MultiButtonGroup,
  type MultiButtonItem,
} from "./multi-button";

const motionPreference = vi.hoisted(() => ({ reduced: false }));

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    useReducedMotion: () => motionPreference.reduced,
  };
});

const Icon = ({ className }: { className?: string }) => (
  <svg className={className} aria-hidden="true" />
);

const ActionIcon = ({ className }: { className?: string }) => (
  <svg className={className} data-testid="action-icon" aria-hidden="true" />
);

const RestIcon = ({ className }: { className?: string }) => (
  <svg className={className} data-testid="rest-icon" aria-hidden="true" />
);

const items: MultiButtonItem[] = [
  { id: "view", icon: Icon, label: "View" },
  { id: "edit", icon: Icon, label: "Edit" },
];

const LONG_ACTION_LABEL = "Download comprehensive report";

function createItems(count: number): MultiButtonItem[] {
  const labels = [
    "View",
    "Edit",
    "Comment",
    "Share",
    "Duplicate",
    "Archive",
    LONG_ACTION_LABEL,
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `action-${index}`,
    icon: Icon,
    label: labels[index] ?? `Action ${index + 1}`,
  }));
}

function createRestItems(count: number): MultiButtonItem[] {
  return createItems(count).map((item) => ({ ...item, icon: ActionIcon }));
}

const itemCountCases = [
  { count: 2, gooey: false, treatment: "classic" },
  { count: 2, gooey: true, treatment: "gooey" },
  { count: 7, gooey: false, treatment: "classic" },
  { count: 7, gooey: true, treatment: "gooey" },
] as const;

function finishWidthTransition(group: HTMLElement) {
  fireEvent.transitionEnd(group, { propertyName: "width" });
}

function expectRestIconVisibility(button: HTMLElement, visible: boolean) {
  const restIcon = within(button).getByTestId("rest-icon");
  const actionIcon = within(button).getByTestId("action-icon");
  const restLayer = restIcon.closest<HTMLElement>(
    '[data-slot="multi-button-rest-icon"]',
  );
  const actionLayer = actionIcon.closest<HTMLElement>(
    '[data-slot="multi-button-action-icon"]',
  );

  expect(restLayer).toHaveStyle({ opacity: visible ? "1" : "0" });
  expect(actionLayer).toHaveStyle({ opacity: visible ? "0" : "1" });
}

function touchTap(element: HTMLElement) {
  const shouldClick = fireEvent.pointerDown(element, {
    button: 0,
    isPrimary: true,
    pointerId: 1,
    pointerType: "touch",
  });
  fireEvent.pointerUp(element, {
    button: 0,
    isPrimary: true,
    pointerId: 1,
    pointerType: "touch",
  });
  if (shouldClick) fireEvent.click(element);
}

function mockMeasuredLabelWidths(widths: Record<string, number>) {
  return vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function getBoundingClientRect(this: HTMLElement) {
      const isMeasurement = this.hasAttribute("data-slot");
      const width = isMeasurement ? (widths[this.textContent ?? ""] ?? 0) : 0;
      return DOMRect.fromRect({ height: 16, width });
    });
}

beforeEach(() => {
  motionPreference.reduced = false;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MultiButton", () => {
  it("renders one accessible button per item", () => {
    render(<MultiButton items={items} />);

    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("uses button cursor affordances", () => {
    render(<MultiButton items={[items[0], { ...items[1], disabled: true }]} />);

    expect(screen.getByRole("button", { name: "View" })).toHaveClass(
      "cursor-pointer",
    );
    expect(screen.getByRole("button", { name: "Edit" })).toHaveClass(
      "disabled:cursor-not-allowed",
    );
  });

  it("reveals the focused label and fires the item action", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <MultiButton
        items={[{ ...items[0], onClick }, items[1]]}
        variant="outline"
        size="sm"
      />,
    );

    await user.tab();
    const viewButton = screen.getByRole("button", { name: "View" });
    expect(within(viewButton).getByText("View")).toBeInTheDocument();
    await user.click(viewButton);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("reserves label space without changing the rail width on hover", async () => {
    const user = userEvent.setup();
    render(<MultiButton items={items} size="lg" />);

    const group = screen.getByRole("group");
    const widthAtRest = group.style.width;
    const viewButton = screen.getByRole("button", { name: "View" });
    await user.hover(viewButton);

    expect(group.style.width).toBe(widthAtRest);
    expect(within(viewButton).getByText("View")).toBeInTheDocument();
  });

  it("sizes the active action to its own label instead of the longest label", async () => {
    const user = userEvent.setup();
    render(
      <MultiButton
        items={[
          items[0],
          { ...items[1], id: "download", label: "Download report" },
        ]}
      />,
    );

    const group = screen.getByRole("group");
    const widthAtRest = group.style.width;
    const viewButton = screen.getByRole("button", { name: "View" });
    await user.hover(viewButton);

    await waitFor(() =>
      expect(Number.parseFloat(viewButton.style.width)).toBeCloseTo(78, 0),
    );
    expect(group.style.width).toBe(widthAtRest);
  });

  it("supports a token-backed faint highlight", async () => {
    const user = userEvent.setup();
    render(<MultiButton items={items} highlightColor="var(--primary)" />);

    const group = screen.getByRole("group");
    const viewButton = screen.getByRole("button", { name: "View" });
    expect(group.style.getPropertyValue("--multi-button-highlight")).toBe(
      "var(--primary)",
    );

    await user.hover(viewButton);
    const highlight = viewButton.querySelector(
      '[data-slot="multi-button-highlight"]',
    );
    expect(highlight).toHaveClass("inset-0", "opacity-[0.14]");
    expect(highlight).not.toHaveClass("rounded-full");
  });

  it("offers the SVG metaball treatment as an opt-in gooey mode", () => {
    const { container } = render(<MultiButton items={items} gooey />);

    const blob = container.querySelector('[data-slot="multi-button-blob"]');
    expect(blob?.querySelector("feGaussianBlur")).toHaveAttribute(
      "stdDeviation",
      "6",
    );
    expect(blob?.querySelector("g")).toHaveAttribute(
      "filter",
      expect.stringContaining("url(#"),
    );
    expect(blob).toHaveAttribute("width", "100%");
    expect(
      container.querySelector('[data-slot="multi-button-item-label-measure"]')
        ?.parentElement,
    ).toHaveClass("w-0", "overflow-hidden");
  });

  it.each([
    ["default", "var(--primary)"],
    ["outline", "var(--background)"],
    ["secondary", "var(--secondary)"],
    ["ghost", "color-mix(in oklab, var(--muted) 50%, transparent)"],
  ] as const)("keeps the %s Gooey surface aligned with its Classic variant", (variant, fill) => {
    const { container } = render(
      <MultiButton items={items} gooey variant={variant} />,
    );

    expect(
      container.querySelector('[data-slot="multi-button-blob"] rect'),
    ).toHaveAttribute("fill", fill);
  });

  it("keeps the icon mounted when the label is dismissed", async () => {
    const user = userEvent.setup();
    render(<MultiButton items={items} />);

    const button = screen.getByRole("button", { name: "View" });
    await user.hover(button);
    await user.unhover(button);

    const iconLane = button.querySelector<HTMLElement>(
      '[data-slot="multi-button-icon"]',
    );
    expect(iconLane?.querySelector("svg")).toBeInTheDocument();
    expect(iconLane).toHaveStyle({ width: "40px" });
  });

  it("forwards refs and exposes display names", () => {
    const buttonRef = createRef<HTMLDivElement>();
    const groupRef = createRef<HTMLDivElement>();
    render(
      <MultiButtonGroup ref={groupRef} data-testid="multi-button-group">
        <MultiButton ref={buttonRef} items={items} />
      </MultiButtonGroup>,
    );

    expect(buttonRef.current).toBeInstanceOf(HTMLDivElement);
    expect(groupRef.current).toBeInstanceOf(HTMLDivElement);
    expect(groupRef.current).toHaveAttribute(
      "data-testid",
      "multi-button-group",
    );
    expect(MultiButton.displayName).toBe("MultiButton");
    expect(MultiButtonGroup.displayName).toBe("MultiButtonGroup");
  });

  it("measures custom-width labels without clipping and synchronizes grouped rails", async () => {
    mockMeasuredLabelWidths({
      "A genuinely wide custom action": 184,
      Edit: 38,
      View: 42,
    });
    const wideItems: MultiButtonItem[] = [
      items[0],
      {
        ...items[1],
        ariaLabel: "Wide action",
        id: "wide",
        label: <span>A genuinely wide custom action</span>,
      },
    ];
    const { container } = render(
      <MultiButtonGroup>
        <MultiButton items={items} />
        <MultiButton items={wideItems} />
      </MultiButtonGroup>,
    );

    const rails = Array.from(
      container.querySelectorAll<HTMLElement>('[data-slot="multi-button"]'),
    );
    await waitFor(() => {
      expect(rails).toHaveLength(2);
      expect(rails[0]?.style.width).toBe(rails[1]?.style.width);
    });

    const wideButton = screen.getByRole("button", { name: "Wide action" });
    fireEvent.mouseEnter(wideButton);
    await waitFor(() =>
      expect(Number.parseFloat(wideButton.style.width)).toBeGreaterThanOrEqual(
        220,
      ),
    );
    expect(Number.parseFloat(rails[1]?.style.width ?? "0")).toBeGreaterThan(
      Number.parseFloat(wideButton.style.width),
    );
  });

  it.each(itemCountCases)("supports $count actions in $treatment mode", async ({
    count,
    gooey,
  }) => {
    const scalableItems = createItems(count);
    const activeItem = scalableItems.at(-1) as MultiButtonItem;
    const activeLabel = activeItem.label as string;
    const measuredWidth = count > 2 ? 184 : 64;
    mockMeasuredLabelWidths({
      [activeLabel]: measuredWidth,
    });
    const { container } = render(
      <MultiButton items={scalableItems} gooey={gooey} />,
    );

    const group = screen.getByRole("group");
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(count);
    expect(container.querySelectorAll("button")).toHaveLength(count);
    expect(group).not.toHaveAttribute("aria-expanded");
    expect(
      container.querySelectorAll('[data-slot="multi-button-blob"] rect'),
    ).toHaveLength(gooey ? count : 0);

    const widthAtRest = group.style.width;
    const activeButton = screen.getByRole("button", {
      name: activeLabel,
    });
    fireEvent.mouseEnter(activeButton);

    await waitFor(() => {
      expect(activeButton).toHaveAttribute("data-state", "open");
      expect(within(activeButton).getByText(activeLabel)).toBeVisible();
      expect(
        Number.parseFloat(activeButton.style.width),
      ).toBeGreaterThanOrEqual(40 + measuredWidth);
    });
    expect(group.style.width).toBe(widthAtRest);
  });
});

describe("CompactMultiButton", () => {
  it.each(
    itemCountCases,
  )("uses a rest icon for $count $treatment actions", async ({
    count,
    gooey,
  }) => {
    const restItems = createRestItems(count);
    const { container } = render(
      <CompactMultiButton
        items={restItems}
        selectedId={restItems[0]?.id as string}
        restIcon={RestIcon}
        restAriaLabel="More actions"
        gooey={gooey}
      />,
    );

    const group = screen.getByRole("group");
    const restButton = screen.getByRole("button", { name: "More actions" });
    expect(container.querySelectorAll("button")).toHaveLength(count);
    expect(screen.getAllByRole("button")).toEqual([restButton]);
    expect(screen.getByTestId("rest-icon")).toBeInTheDocument();
    expect(screen.getAllByTestId("action-icon")).toHaveLength(count);
    expectRestIconVisibility(restButton, true);

    fireEvent.mouseEnter(group);
    fireEvent.mouseEnter(restButton);
    expect(group).toHaveAttribute("aria-expanded", "true");
    expect(restButton).toHaveAttribute("aria-label", restItems[0]?.label);
    await waitFor(() => expectRestIconVisibility(restButton, false));
    expect(
      screen.getByRole("button", { name: restItems[0]?.label as string }),
    ).toBe(restButton);
    expect(screen.getByTestId("rest-icon")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toEqual([restButton]);
    expect(
      within(restButton).queryByText(restItems[0]?.label as string),
    ).not.toBeInTheDocument();

    finishWidthTransition(group);
    expectRestIconVisibility(restButton, false);
    expect(screen.getAllByRole("button")).toHaveLength(count);
    await waitFor(() =>
      expect(
        within(restButton).getByText(restItems[0]?.label as string),
      ).toBeVisible(),
    );
    for (const item of restItems) {
      expect(
        screen.getByRole("button", { name: item.label as string }),
      ).toBeInTheDocument();
    }
    expect(screen.getAllByTestId("action-icon")).toHaveLength(count);

    fireEvent.mouseLeave(group);
    expect(group).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "More actions" })).toBe(
      restButton,
    );
    expect(screen.getByTestId("rest-icon")).toBeInTheDocument();
    expect(screen.getAllByTestId("action-icon")).toHaveLength(count);
    expect(screen.getAllByRole("button")).toEqual([restButton]);
    expect(restButton).toHaveAttribute("aria-label", "More actions");
    await waitFor(() => expectRestIconVisibility(restButton, true));
  });

  it.each([
    { gooey: false, treatment: "classic" },
    { gooey: true, treatment: "gooey" },
  ])("switches the $treatment rest icon immediately under reduced motion", async ({
    gooey,
  }) => {
    motionPreference.reduced = true;
    const restItems = createRestItems(3);
    render(
      <CompactMultiButton
        items={restItems}
        selectedId={restItems[0]?.id as string}
        restIcon={RestIcon}
        restAriaLabel="More actions"
        gooey={gooey}
      />,
    );

    const group = screen.getByRole("group");
    const restButton = screen.getByRole("button", { name: "More actions" });
    fireEvent.mouseEnter(group);
    fireEvent.mouseEnter(restButton);

    expect(group).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expectRestIconVisibility(restButton, false));
    expect(screen.getAllByRole("button")).toHaveLength(restItems.length);
    expect(screen.getAllByTestId("action-icon")).toHaveLength(restItems.length);

    fireEvent.mouseLeave(group);
    expect(group).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "More actions" })).toBe(
      restButton,
    );
    expect(screen.getByTestId("rest-icon")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toEqual([restButton]);
    await waitFor(() => expectRestIconVisibility(restButton, true));
  });

  it.each([
    { gooey: false, treatment: "classic" },
    { gooey: true, treatment: "gooey" },
  ])("preserves the $treatment two-tap contract with a rest icon", async ({
    gooey,
  }) => {
    const onClick = vi.fn();
    const restItems = createRestItems(3).map((item, index) =>
      index === 2 ? { ...item, onClick } : item,
    );
    render(
      <CompactMultiButton
        items={restItems}
        selectedId={restItems[0]?.id as string}
        restIcon={RestIcon}
        restAriaLabel="More actions"
        gooey={gooey}
      />,
    );

    const group = screen.getByRole("group");
    const restButton = screen.getByRole("button", { name: "More actions" });
    touchTap(restButton);

    expect(group).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("rest-icon")).toBeInTheDocument();
    expect(onClick).not.toHaveBeenCalled();
    await waitFor(() => expectRestIconVisibility(restButton, false));
    expect(screen.getAllByRole("button")).toEqual([restButton]);
    expect(restButton).toHaveAttribute("aria-label", restItems[0]?.label);
    finishWidthTransition(group);
    expectRestIconVisibility(restButton, false);

    const actionButton = screen.getByRole("button", { name: "Comment" });
    touchTap(actionButton);

    expect(onClick).toHaveBeenCalledOnce();
    expect(group).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "More actions" })).toHaveFocus();
    expect(screen.getByTestId("rest-icon")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(restButton).toHaveAttribute("aria-label", "More actions");
    await waitFor(() => expectRestIconVisibility(restButton, true));
  });

  it.each([
    { gooey: false, treatment: "classic" },
    { gooey: true, treatment: "gooey" },
  ])("preserves focus through the $treatment rest-to-action handoff", async ({
    gooey,
  }) => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const restItems = createRestItems(5).map((item, index) =>
      index === 0 ? { ...item, onClick } : item,
    );
    render(
      <CompactMultiButton
        items={restItems}
        selectedId={restItems[0]?.id as string}
        restIcon={RestIcon}
        restAriaLabel="More actions"
        gooey={gooey}
      />,
    );

    const group = screen.getByRole("group");
    const restButton = screen.getByRole("button", { name: "More actions" });
    await user.tab();
    expect(restButton).toHaveFocus();
    expect(group).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("rest-icon")).toBeInTheDocument();
    await waitFor(() => expectRestIconVisibility(restButton, false));
    expect(restButton).toHaveAttribute("aria-label", restItems[0]?.label);
    expect(screen.getAllByRole("button")).toEqual([restButton]);
    expect(within(restButton).queryByText("View")).not.toBeInTheDocument();

    finishWidthTransition(group);
    const selectedAction = screen.getByRole("button", { name: "View" });
    expect(selectedAction).toBe(restButton);
    expect(selectedAction).toHaveFocus();
    expectRestIconVisibility(restButton, false);

    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledOnce();
    expect(group).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "More actions" })).toBe(
      restButton,
    );
    expect(restButton).toHaveFocus();
    expect(screen.getByTestId("rest-icon")).toBeInTheDocument();
    expect(restButton).toHaveAttribute("aria-label", "More actions");
    await waitFor(() => expectRestIconVisibility(restButton, true));
  });

  it("keeps every item mounted for the compact morph and expands on hover", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CompactMultiButton items={items} selectedId="edit" variant="ghost" />,
    );

    const viewButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="View"]',
    );
    const selectedButton = screen.getByRole("button", { name: "Edit" });
    const group = screen.getByRole("group");
    expect(container.querySelectorAll("button")).toHaveLength(2);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(selectedButton.querySelector("svg")).toBeInTheDocument();
    expect(selectedButton).toHaveStyle({ width: "40px" });
    expect(
      container.querySelector('[data-slot="multi-button-blob"]'),
    ).not.toBeInTheDocument();
    expect(group).toHaveClass("[transition:width_200ms_ease-out]");

    await user.hover(selectedButton);
    expect(selectedButton).toHaveAttribute("data-state", "closed");
    expect(within(selectedButton).queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(
      container.querySelector<HTMLButtonElement>('button[aria-label="View"]'),
    ).toBe(viewButton);
    finishWidthTransition(group);
    expect(selectedButton).toHaveAttribute("data-state", "open");
    expect(within(selectedButton).getByText("Edit")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(Number.parseFloat(viewButton?.style.width ?? "0")).toBeGreaterThan(
      0,
    );

    await user.unhover(selectedButton);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(viewButton).toHaveStyle({ width: "0px" });
  });

  it("keeps the outline treatment out of compact layout geometry", () => {
    render(
      <CompactMultiButton items={items} selectedId="edit" variant="outline" />,
    );

    const group = screen.getByRole("group");
    expect(group).toHaveClass("ring-1", "ring-inset", "ring-border/80");
    expect(group).not.toHaveClass("border");
  });

  it("offers the SVG metaball treatment as an opt-in gooey mode", () => {
    const { container } = render(
      <CompactMultiButton items={items} selectedId="edit" gooey />,
    );

    const group = screen.getByRole("group");
    const blob = container.querySelector('[data-slot="multi-button-blob"]');
    expect(blob?.querySelector("feGaussianBlur")).toHaveAttribute(
      "stdDeviation",
      "6",
    );
    expect(blob?.querySelector("feColorMatrix")).toHaveAttribute(
      "values",
      "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10",
    );
    expect(blob?.querySelector("g")).toHaveAttribute(
      "filter",
      expect.stringContaining("url(#"),
    );
    expect(blob).toHaveAttribute("width", "100%");
    expect(group).toHaveClass(
      "[transition:width_200ms_cubic-bezier(0.3,0.7,0.4,1)]",
    );
  });

  it("waits for the gooey rail to expand before revealing an option", async () => {
    const user = userEvent.setup();
    render(<CompactMultiButton items={items} selectedId="edit" gooey />);

    const editButton = screen.getByRole("button", { name: "Edit" });
    const group = screen.getByRole("group");
    await user.hover(editButton);

    expect(editButton).toHaveAttribute("data-state", "closed");
    expect(within(editButton).queryByText("Edit")).not.toBeInTheDocument();
    finishWidthTransition(group);
    expect(editButton).toHaveAttribute("data-state", "open");
    expect(within(editButton).getByText("Edit")).toBeInTheDocument();
  });

  it("opens on the first touch tap, then activates and closes on the second", () => {
    const onClick = vi.fn();
    const { container } = render(
      <CompactMultiButton
        items={[{ ...items[0], onClick }, items[1]]}
        selectedId="edit"
      />,
    );

    const group = screen.getByRole("group");
    const editButton = screen.getByRole("button", { name: "Edit" });
    touchTap(editButton);

    expect(onClick).not.toHaveBeenCalled();
    expect(group).toHaveAttribute("aria-expanded", "true");
    finishWidthTransition(group);

    const viewButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="View"]',
    );
    expect(viewButton).not.toHaveAttribute("aria-hidden");
    touchTap(viewButton as HTMLButtonElement);

    expect(onClick).toHaveBeenCalledOnce();
    expect(group).toHaveAttribute("aria-expanded", "false");
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("closes after an outside touch in the component's owner document", () => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    const iframeDocument = iframe.contentDocument;

    if (!iframeDocument) {
      iframe.remove();
      throw new Error("Expected the test iframe to have a content document");
    }

    const { unmount } = render(
      <CompactMultiButton items={items} selectedId="edit" />,
      { container: iframeDocument.body },
    );
    const group = within(iframeDocument.body).getByRole("group");
    const editButton = within(group).getByRole("button", { name: "Edit" });

    touchTap(editButton);
    expect(group).toHaveAttribute("aria-expanded", "true");

    fireEvent.pointerDown(iframeDocument.body, {
      button: 0,
      isPrimary: true,
      pointerId: 2,
      pointerType: "touch",
    });

    expect(group).toHaveAttribute("aria-expanded", "false");

    unmount();
    iframe.remove();
  });

  it("closes after keyboard activation while retaining sensible focus", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <CompactMultiButton
        items={[items[0], { ...items[1], onClick }]}
        selectedId="edit"
      />,
    );

    await user.tab();
    const group = screen.getByRole("group");
    const editButton = screen.getByRole("button", { name: "Edit" });
    expect(editButton).toHaveFocus();
    finishWidthTransition(group);

    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledOnce();
    expect(group).toHaveAttribute("aria-expanded", "false");
    expect(editButton).toHaveFocus();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("moves focus to a newly selected compact action after activation", async () => {
    const user = userEvent.setup();

    function StatefulCompactMultiButton() {
      const [selectedId, setSelectedId] = useState("edit");
      return (
        <CompactMultiButton
          items={[
            { ...items[0], onClick: () => setSelectedId("view") },
            { ...items[1], onClick: () => setSelectedId("edit") },
          ]}
          selectedId={selectedId}
        />
      );
    }

    const { container } = render(<StatefulCompactMultiButton />);
    await user.tab();
    const group = screen.getByRole("group");
    finishWidthTransition(group);

    const viewButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="View"]',
    );
    act(() => viewButton?.focus());
    await user.keyboard("{Enter}");

    expect(group).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(viewButton).toHaveFocus());
    expect(screen.getAllByRole("button")).toEqual([viewButton]);
  });

  it.each([
    { gooey: false, mode: "classic" },
    { gooey: true, mode: "gooey" },
  ])("resolves the $mode compact rail immediately with decorative motion disabled", ({
    gooey,
  }) => {
    motionPreference.reduced = true;
    const { container } = render(
      <CompactMultiButton items={items} selectedId="edit" gooey={gooey} />,
    );

    const group = screen.getByRole("group");
    const editButton = screen.getByRole("button", { name: "Edit" });
    fireEvent.mouseEnter(group);
    fireEvent.mouseEnter(editButton);

    expect(group).toHaveAttribute("aria-expanded", "true");
    expect(editButton).toHaveAttribute("data-state", "open");
    expect(within(editButton).getByText("Edit")).toBeInTheDocument();
    expect(group).toHaveClass("motion-reduce:[transition:none]");
    expect(editButton).toHaveClass("motion-reduce:[transition:none]");
    expect(editButton).not.toHaveClass("active:scale-[0.96]");
    expect(
      editButton.querySelector('[data-slot="multi-button-icon"]'),
    ).toHaveClass("motion-reduce:[transition:none]");
    expect(
      editButton.querySelector('[data-slot="multi-button-highlight"]'),
    ).toHaveClass("motion-reduce:[transition:none]");
    if (gooey) {
      expect(
        container.querySelector('[data-slot="multi-button-blob"] g'),
      ).not.toHaveAttribute("filter");
    }
  });

  it("composes consumer hover and focus handlers with compact expansion", () => {
    const onBlurCapture = vi.fn();
    const onFocusCapture = vi.fn();
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    render(
      <CompactMultiButton
        items={items}
        selectedId="edit"
        onBlurCapture={onBlurCapture}
        onFocusCapture={onFocusCapture}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />,
    );

    const group = screen.getByRole("group");
    const editButton = screen.getByRole("button", { name: "Edit" });
    fireEvent.mouseEnter(group);
    expect(onMouseEnter).toHaveBeenCalledOnce();
    expect(group).toHaveAttribute("aria-expanded", "true");
    fireEvent.mouseLeave(group);
    expect(onMouseLeave).toHaveBeenCalledOnce();
    expect(group).toHaveAttribute("aria-expanded", "false");

    fireEvent.focus(editButton);
    expect(onFocusCapture).toHaveBeenCalledOnce();
    expect(group).toHaveAttribute("aria-expanded", "true");
    fireEvent.blur(editButton, { relatedTarget: document.body });
    expect(onBlurCapture).toHaveBeenCalledOnce();
    expect(group).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps collapsed and partially expanded actions out of the accessibility tree", () => {
    const { container } = render(
      <CompactMultiButton items={items} selectedId="edit" />,
    );

    const group = screen.getByRole("group");
    const editButton = screen.getByRole("button", { name: "Edit" });
    const viewButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="View"]',
    );
    expect(group).toHaveAttribute("aria-expanded", "false");
    expect(viewButton).toHaveAttribute("aria-hidden", "true");
    expect(viewButton).toHaveAttribute("tabindex", "-1");

    fireEvent.mouseEnter(group);
    expect(group).toHaveAttribute("aria-expanded", "true");
    expect(viewButton).toHaveAttribute("aria-hidden", "true");
    expect(viewButton).toHaveAttribute("tabindex", "-1");

    finishWidthTransition(group);
    expect(viewButton).not.toHaveAttribute("aria-hidden");
    expect(viewButton).not.toHaveAttribute("tabindex", "-1");
    expect(screen.getAllByRole("button")).toHaveLength(2);

    fireEvent.mouseLeave(group);
    expect(group).toHaveAttribute("aria-expanded", "false");
    expect(screen.getAllByRole("button")).toEqual([editButton]);
  });

  it("uses transition completion for readiness through interrupted close and reopen", () => {
    render(<CompactMultiButton items={items} selectedId="edit" gooey />);

    const group = screen.getByRole("group");
    const editButton = screen.getByRole("button", { name: "Edit" });
    fireEvent.mouseEnter(group);
    fireEvent.mouseEnter(editButton);
    expect(editButton).toHaveAttribute("data-state", "closed");

    fireEvent.mouseLeave(group);
    fireEvent.mouseEnter(group);
    fireEvent.mouseEnter(editButton);
    expect(editButton).toHaveAttribute("data-state", "closed");

    finishWidthTransition(group);
    expect(editButton).toHaveAttribute("data-state", "open");
    expect(within(editButton).getByText("Edit")).toBeInTheDocument();
  });

  it.each([
    "sm",
    "md",
    "lg",
  ] as const)("provides at least a 40px target in the %s size", (size) => {
    render(<CompactMultiButton items={items} selectedId="edit" size={size} />);

    const group = screen.getByRole("group");
    const editButton = screen.getByRole("button", { name: "Edit" });
    expect(Number.parseFloat(group.style.width)).toBeGreaterThanOrEqual(40);
    expect(Number.parseFloat(editButton.style.width)).toBeGreaterThanOrEqual(
      40,
    );
    expect(group).toHaveClass("h-10");
  });

  it.each(
    itemCountCases,
  )("expands $count actions accessibly in $treatment mode", async ({
    count,
    gooey,
  }) => {
    const scalableItems = createItems(count);
    const selectedItem = scalableItems[0] as MultiButtonItem;
    const activeItem = scalableItems.at(-1) as MultiButtonItem;
    const activeLabel = activeItem.label as string;
    const measuredWidth = count > 2 ? 184 : 64;
    mockMeasuredLabelWidths({
      [activeLabel]: measuredWidth,
    });
    const { container } = render(
      <CompactMultiButton
        items={scalableItems}
        selectedId={selectedItem.id}
        gooey={gooey}
      />,
    );

    const group = screen.getByRole("group");
    const selectedButton = screen.getByRole("button", {
      name: selectedItem.label as string,
    });
    expect(container.querySelectorAll("button")).toHaveLength(count);
    expect(screen.getAllByRole("button")).toEqual([selectedButton]);
    expect(group).toHaveAttribute("aria-expanded", "false");
    expect(
      container.querySelectorAll('[data-slot="multi-button-blob"] rect'),
    ).toHaveLength(gooey ? count : 0);

    fireEvent.mouseEnter(group);
    fireEvent.mouseEnter(selectedButton);
    expect(group).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("button")).toEqual([selectedButton]);

    finishWidthTransition(group);
    expect(screen.getAllByRole("button")).toHaveLength(count);
    for (const button of container.querySelectorAll("button")) {
      expect(button).not.toHaveAttribute("aria-hidden");
      expect(button).not.toHaveAttribute("tabindex", "-1");
    }

    const widthAtRest = group.style.width;
    const activeButton = screen.getByRole("button", {
      name: activeLabel,
    });
    fireEvent.mouseEnter(activeButton);
    await waitFor(() => {
      expect(activeButton).toHaveAttribute("data-state", "open");
      expect(within(activeButton).getByText(activeLabel)).toBeVisible();
      expect(
        Number.parseFloat(activeButton.style.width),
      ).toBeGreaterThanOrEqual(40 + measuredWidth);
    });
    expect(group.style.width).toBe(widthAtRest);
  });

  it.each([
    { gooey: false, mode: "regular" },
    { gooey: true, mode: "gooey" },
  ])("closes the $mode compact rail immediately after an action", async ({
    gooey,
  }) => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <CompactMultiButton
        items={[items[0], { ...items[1], onClick }]}
        selectedId="edit"
        gooey={gooey}
      />,
    );

    const group = screen.getByRole("group");
    const editButton = screen.getByRole("button", { name: "Edit" });
    await user.hover(editButton);
    finishWidthTransition(group);
    expect(editButton).toHaveAttribute("data-state", "open");

    await user.click(editButton);

    expect(onClick).toHaveBeenCalledOnce();
    expect(group).toHaveStyle({ width: "40px" });
    expect(editButton).toHaveAttribute("data-state", "closed");
    expect(editButton.querySelector("svg")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(editButton).toHaveFocus();
  });
});
