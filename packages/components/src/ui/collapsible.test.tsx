import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/collapsible";
import * as Godui from "./collapsible";

// jsdom has no layout. Every child of the test parent is 40px tall, plus 40px
// while it contains an open collapsible panel.
const ROW = 40;
const heightOf = (el: Element) => {
  const panel = el.querySelector('[data-slot="collapsible-content"]');
  return ROW + (panel && !panel.hasAttribute("hidden") ? ROW : 0);
};
function topOf(el: Element): number {
  if (!el.parentElement?.hasAttribute("data-parent")) return 0;
  let top = 0;
  for (
    let prev = el.previousElementSibling;
    prev;
    prev = prev.previousElementSibling
  ) {
    top += heightOf(prev);
  }
  return top;
}

const originalRect = Element.prototype.getBoundingClientRect;
let animate: ReturnType<typeof vi.fn>;

beforeEach(() => {
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const top = topOf(this);
    return { top, left: 0, width: 300, height: ROW, x: 0, y: top } as DOMRect;
  };
  animate = vi.fn(() => ({ cancel: vi.fn(), onfinish: null }));
  Element.prototype.animate = animate as unknown as Element["animate"];
});

afterEach(() => {
  Element.prototype.getBoundingClientRect = originalRect;
  delete (Element.prototype as Partial<Element>).animate;
});

function Usage({ ui, open }: { ui: typeof Shadcn; open?: boolean }) {
  const { Collapsible, CollapsibleContent, CollapsibleTrigger } = ui;
  return (
    <div data-parent>
      <p data-testid="before">Before</p>
      <Collapsible defaultOpen={open}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>@radix-ui/colors</CollapsibleContent>
      </Collapsible>
      <p data-testid="after">After</p>
      <div data-testid="after-2">More</div>
    </div>
  );
}

const animated = () => animate.mock.contexts as unknown as Element[];

describe("Collapsible", () => {
  it("matches shadcn's data-slot tree and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} open />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} open />);
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("FLIPs only the following element siblings", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    expect(animated()).toEqual([
      screen.getByTestId("after"),
      screen.getByTestId("after-2"),
    ]);
    const [frames] = animate.mock.calls[0] as unknown as [Keyframe[]];
    expect(frames[0]).toMatchObject({ translate: "0px -40px" });
  });

  it("slides the panel in and fades it out", () => {
    render(<Usage ui={Godui} open />);
    const panel = document.querySelector('[data-slot="collapsible-content"]');
    expect(panel?.className).toContain(
      "data-[state=open]:animate-godui-slide-in-from-top",
    );
    expect(panel?.className).toContain(
      "data-[state=closed]:animate-godui-fade-out",
    );
  });

  it("asChild content works like shadcn's", () => {
    const { Collapsible, CollapsibleContent } = Godui;
    render(
      <Collapsible defaultOpen>
        <CollapsibleContent asChild>
          <section>Panel</section>
        </CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.getByText("Panel")).toBeInTheDocument();
  });

  it("reduced motion: siblings move without animating", async () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    try {
      const user = userEvent.setup();
      render(<Usage ui={Godui} />);
      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(animate).not.toHaveBeenCalled();
    } finally {
      window.matchMedia = original;
    }
  });
});
