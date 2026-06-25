"use client";

import { Drawer } from "@godui/components";
import {
  Headphones,
  Keyboard,
  Minus,
  Plus,
  ShoppingBag,
  Watch,
} from "lucide-react";
import { type ComponentType, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  swatch: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

const PRODUCTS: Product[] = [
  {
    id: "hp",
    name: "Studio Headphones",
    price: 349,
    swatch: "bg-indigo-500/15 text-indigo-500",
    Icon: Headphones,
  },
  {
    id: "watch",
    name: "Aurora Watch",
    price: 429,
    swatch: "bg-rose-500/15 text-rose-500",
    Icon: Watch,
  },
  {
    id: "kb",
    name: "Mechanical Keyboard",
    price: 189,
    swatch: "bg-emerald-500/15 text-emerald-500",
    Icon: Keyboard,
  },
];

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({ watch: 1 });

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

  const lines = PRODUCTS.filter((p) => cart[p.id] > 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = lines.reduce((sum, p) => sum + p.price * cart[p.id], 0);
  const shipping = subtotal === 0 || subtotal > 500 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card">
      {/* Storefront header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          ◆ Northwind Goods
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
        >
          <ShoppingBag className="size-4" strokeWidth={2} />
          Cart
          {count > 0 ? (
            <span className="ml-0.5 rounded-full bg-primary-foreground/20 px-1.5 text-xs tabular-nums">
              {count}
            </span>
          ) : null}
        </button>
      </div>

      {/* Product grid */}
      <div className="grid gap-3 p-4 sm:grid-cols-3">
        {PRODUCTS.map((p) => (
          <div
            key={p.id}
            className="flex flex-col rounded-lg border border-border p-3"
          >
            <div
              className={`mb-3 flex aspect-square items-center justify-center rounded-md ${p.swatch}`}
            >
              <p.Icon className="size-7" strokeWidth={1.75} />
            </div>
            <div className="text-xs font-medium text-foreground">{p.name}</div>
            <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
              {money(p.price)}
            </div>
            <button
              type="button"
              onClick={() => add(p.id)}
              className="mt-2 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground [transition:background_200ms_ease] hover:bg-accent"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      <Drawer open={open} onOpenChange={setOpen} side="right" title="Your cart">
        {lines.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Your cart is empty.
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {lines.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-md ${p.swatch}`}
                  >
                    <p.Icon className="size-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">
                      {p.name}
                    </div>
                    <div className="text-xs text-muted-foreground tabular-nums">
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
                      <Minus className="size-3.5" strokeWidth={2} />
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
                      <Plus className="size-3.5" strokeWidth={2} />
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
