import { Drawer } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { open: false, onOpenChange: () => {} },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

const CATALOG = [
  {
    id: "hp",
    name: "Studio Headphones",
    price: 349,
    swatch: "bg-indigo-500/15",
  },
  { id: "watch", name: "Aurora Watch", price: 429, swatch: "bg-rose-500/15" },
  {
    id: "kb",
    name: "Mechanical Keyboard",
    price: 189,
    swatch: "bg-emerald-500/15",
  },
];

function CartDrawerDemo() {
  const [open, setOpen] = React.useState(false);
  const [cart, setCart] = React.useState<Record<string, number>>({ watch: 1 });

  const add = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const sub = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      const qty = (next[id] ?? 0) - 1;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  const lines = CATALOG.filter((p) => cart[p.id] > 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = lines.reduce((s, p) => s + p.price * cart[p.id], 0);
  const shipping = subtotal === 0 || subtotal > 500 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          ◆ Northwind Goods
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
        >
          Cart · {count}
        </button>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-3">
        {CATALOG.map((p) => (
          <div
            key={p.id}
            className="flex flex-col rounded-lg border border-border p-3"
          >
            <div className={`mb-3 aspect-square rounded-md ${p.swatch}`} />
            <div className="text-xs font-medium text-foreground">{p.name}</div>
            <div className="mt-0.5 text-xs tabular-nums text-muted-foreground">
              {money(p.price)}
            </div>
            <button
              type="button"
              onClick={() => add(p.id)}
              className="mt-2 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground hover:bg-accent"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      <Drawer open={open} onOpenChange={setOpen} title="Your cart">
        {lines.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Your cart is empty.
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {lines.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <div className={`size-12 shrink-0 rounded-md ${p.swatch}`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">
                      {p.name}
                    </div>
                    <div className="text-xs tabular-nums text-muted-foreground">
                      {money(p.price)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => sub(p.id)}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-accent"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm tabular-nums">
                      {cart[p.id]}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => add(p.id)}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-accent"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>Shipping</dt>
                <dd className="tabular-nums">
                  {shipping === 0 ? "Free" : money(shipping)}
                </dd>
              </div>
              <div className="flex justify-between pt-1 text-base font-semibold text-foreground">
                <dt>Total</dt>
                <dd className="tabular-nums">{money(total)}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Checkout · {money(total)}
            </button>
          </>
        )}
      </Drawer>
    </div>
  );
}

function FilterPanelDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
      >
        Filters
      </button>
      <Drawer open={open} onOpenChange={setOpen} side="right" title="Filters">
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              Category
            </div>
            <div className="flex flex-wrap gap-2">
              {["Audio", "Wearables", "Desk", "Mobile"].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border px-3 py-1 text-sm text-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              Price
            </div>
            <input type="range" className="w-full accent-[var(--primary)]" />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Show results
        </button>
      </Drawer>
    </>
  );
}

export const Cart: Story = { render: () => <CartDrawerDemo /> };

export const FilterPanel: Story = { render: () => <FilterPanelDemo /> };
