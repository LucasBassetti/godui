"use client";

import { Pagination } from "@godui/components";
import { useState } from "react";

const ROWS = [
  { name: "Ada Lovelace", email: "ada@northwind.com", role: "Owner" },
  { name: "Linus Torvalds", email: "linus@northwind.com", role: "Admin" },
  { name: "Grace Hopper", email: "grace@northwind.com", role: "Admin" },
  { name: "Alan Turing", email: "alan@northwind.com", role: "Member" },
  { name: "Katherine Johnson", email: "kat@northwind.com", role: "Member" },
  { name: "Margaret Hamilton", email: "maggie@northwind.com", role: "Member" },
  { name: "Dennis Ritchie", email: "dennis@northwind.com", role: "Member" },
  { name: "Barbara Liskov", email: "barbara@northwind.com", role: "Member" },
  { name: "Donald Knuth", email: "don@northwind.com", role: "Viewer" },
  { name: "Edsger Dijkstra", email: "edsger@northwind.com", role: "Viewer" },
  { name: "Tim Berners-Lee", email: "tim@northwind.com", role: "Viewer" },
  { name: "Vint Cerf", email: "vint@northwind.com", role: "Viewer" },
];

const PAGE_SIZE = 4;

export function PaginationDemo() {
  const [page, setPage] = useState(1);
  const total = Math.ceil(ROWS.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const rows = ROWS.slice(start, start + PAGE_SIZE);

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-border border-b px-4 py-3 font-semibold text-foreground text-sm">
        Members
      </div>
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.email} className="flex items-center gap-3 px-4 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-foreground text-xs">
              {row.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-foreground text-sm">
                {row.name}
              </span>
              <span className="block truncate text-muted-foreground text-xs">
                {row.email}
              </span>
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs">
              {row.role}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-border border-t px-4 py-3">
        <span className="text-muted-foreground text-xs tabular-nums">
          {start + 1}–{Math.min(start + PAGE_SIZE, ROWS.length)} of{" "}
          {ROWS.length}
        </span>
        <Pagination total={total} page={page} onPageChange={setPage} />
      </div>
    </div>
  );
}
