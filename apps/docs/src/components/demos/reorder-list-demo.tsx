"use client";

import { ReorderItem, ReorderList } from "@godui/components";
import * as React from "react";

const INITIAL = [
  { id: "1", label: "Draft proposal" },
  { id: "2", label: "Review with design" },
  { id: "3", label: "Ship to staging" },
  { id: "4", label: "Announce" },
];

export function ReorderListDemo() {
  const [items, setItems] = React.useState(INITIAL);

  return (
    <div className="flex w-full justify-center py-6">
      <ReorderList values={items} onReorder={setItems} className="w-72">
        {items.map((item) => (
          <ReorderItem key={item.id} value={item}>
            <span aria-hidden className="text-muted-foreground">
              ⠿
            </span>
            {item.label}
          </ReorderItem>
        ))}
      </ReorderList>
    </div>
  );
}
