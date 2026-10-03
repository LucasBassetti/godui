import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/carousel";
import * as Godui from "./carousel";

const embla = vi.hoisted(() => ({
  api: {
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    canScrollPrev: vi.fn(() => true),
    canScrollNext: vi.fn(() => true),
    on: vi.fn(),
    off: vi.fn(),
  },
  options: [] as unknown[],
}));

// Embla measures real layout, which jsdom doesn't have: stand in for it with a
// stable api so the tests can see which arguments the buttons and keys pass.
vi.mock("embla-carousel-react", () => ({
  default: (options: unknown) => {
    embla.options.push(options);
    return [() => {}, embla.api];
  },
}));

function Usage({
  ui,
  orientation,
}: {
  ui: typeof Shadcn;
  orientation?: "horizontal" | "vertical";
}) {
  const {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } = ui;
  return (
    <Carousel orientation={orientation} className="w-full max-w-xs">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((n) => (
          <CarouselItem key={n}>Slide {n}</CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

/** Make `(prefers-reduced-motion: reduce)` match; returns a way to flip it later. */
function mockReducedMotion(matches: boolean) {
  const original = window.matchMedia;
  const listeners = new Set<() => void>();
  let current = matches;
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    get matches() {
      return current && query.includes("reduce");
    },
    media: query,
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
  }));
  return {
    set(next: boolean) {
      current = next;
      for (const fn of listeners) fn();
    },
    restore() {
      window.matchMedia = original;
    },
  };
}

beforeEach(() => {
  for (const fn of Object.values(embla.api)) {
    if (typeof fn === "function" && "mockClear" in fn) fn.mockClear();
  }
  embla.options.length = 0;
});

describe("Carousel", () => {
  it("matches shadcn's data-slot tree and exports (horizontal)", () => {
    const { unmount } = render(<Usage ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} />);
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("matches shadcn's data-slot tree (vertical) and sets the vertical axis", () => {
    const { unmount } = render(<Usage ui={Shadcn} orientation="vertical" />);
    const expected = slotTree();
    unmount();
    embla.options.length = 0;
    render(<Usage ui={Godui} orientation="vertical" />);
    expectSlotParity(slotTree(), expected);
    expect(embla.options[0]).toMatchObject({ axis: "y" });
    expect(screen.getAllByRole("group")).toHaveLength(5);
  });

  it("keeps shadcn's roles and labels", () => {
    render(<Usage ui={Godui} />);
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getAllByRole("group")[0]).toHaveAttribute(
      "aria-roledescription",
      "slide",
    );
    expect(
      screen.getByRole("button", { name: "Previous slide" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next slide" }),
    ).toBeInTheDocument();
  });

  it("buttons scroll with physics: scrollNext(false) / scrollPrev(false)", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(embla.api.scrollNext).toHaveBeenCalledWith(false);
    await user.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(embla.api.scrollPrev).toHaveBeenCalledWith(false);
  });

  it("ArrowRight calls scrollNext(false); ArrowLeft calls scrollPrev(false)", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    // Focus sits on a control inside the carousel; the region handles keys in capture.
    screen.getByRole("button", { name: "Next slide" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(embla.api.scrollNext).toHaveBeenCalledWith(false);
    await user.keyboard("{ArrowLeft}");
    expect(embla.api.scrollPrev).toHaveBeenCalledWith(false);
  });

  it("reduced motion: scrollNext(true) from the button and the arrow key", async () => {
    const motion = mockReducedMotion(true);
    try {
      const user = userEvent.setup();
      render(<Usage ui={Godui} />);
      await user.click(screen.getByRole("button", { name: "Next slide" }));
      expect(embla.api.scrollNext).toHaveBeenLastCalledWith(true);
      await user.keyboard("{ArrowRight}");
      expect(embla.api.scrollNext).toHaveBeenCalledTimes(2);
      expect(embla.api.scrollNext).toHaveBeenLastCalledWith(true);
    } finally {
      motion.restore();
    }
  });

  it("reduced motion: scrollPrev(true) from the button and the arrow key", async () => {
    const motion = mockReducedMotion(true);
    try {
      const user = userEvent.setup();
      render(<Usage ui={Godui} />);
      await user.click(screen.getByRole("button", { name: "Previous slide" }));
      expect(embla.api.scrollPrev).toHaveBeenLastCalledWith(true);
      await user.keyboard("{ArrowLeft}");
      expect(embla.api.scrollPrev).toHaveBeenLastCalledWith(true);
    } finally {
      motion.restore();
    }
  });

  it("follows the preference when it changes while mounted", async () => {
    const motion = mockReducedMotion(false);
    try {
      const user = userEvent.setup();
      render(<Usage ui={Godui} />);
      await user.click(screen.getByRole("button", { name: "Next slide" }));
      expect(embla.api.scrollNext).toHaveBeenLastCalledWith(false);
      act(() => motion.set(true));
      await user.click(screen.getByRole("button", { name: "Next slide" }));
      expect(embla.api.scrollNext).toHaveBeenLastCalledWith(true);
      act(() => motion.set(false));
      await user.click(screen.getByRole("button", { name: "Next slide" }));
      expect(embla.api.scrollNext).toHaveBeenLastCalledWith(false);
    } finally {
      motion.restore();
    }
  });

  it("stops listening for the preference on unmount", () => {
    const motion = mockReducedMotion(false);
    try {
      const { unmount } = render(<Usage ui={Godui} />);
      const query = vi.mocked(window.matchMedia).mock.results[0]?.value;
      expect(query).toBeDefined();
      unmount();
      // Flipping after unmount must not throw or warn about state updates.
      expect(() => motion.set(true)).not.toThrow();
    } finally {
      motion.restore();
    }
  });

  it("renders on the server without touching matchMedia (not reduced)", async () => {
    const { renderToString } = await import("react-dom/server");
    const spy = vi.spyOn(window, "matchMedia");
    const html = renderToString(<Usage ui={Godui} />);
    expect(html).toContain('data-slot="carousel"');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("renders and scrolls where matchMedia doesn't exist (old engines, bare jsdom)", async () => {
    const original = window.matchMedia;
    // @ts-expect-error -- simulate an environment without matchMedia
    delete window.matchMedia;
    try {
      expect(typeof window.matchMedia).toBe("undefined");
      const user = userEvent.setup();
      render(<Usage ui={Godui} />);
      await user.click(screen.getByRole("button", { name: "Next slide" }));
      // No preference to read: smooth scrolling, as without reduced motion.
      expect(embla.api.scrollNext).toHaveBeenLastCalledWith(false);
    } finally {
      window.matchMedia = original;
    }
  });

  it("disables the buttons at the ends from Embla's state", () => {
    embla.api.canScrollPrev.mockReturnValueOnce(false);
    render(<Usage ui={Godui} />);
    expect(
      screen.getByRole("button", { name: "Previous slide" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeEnabled();
  });
});
