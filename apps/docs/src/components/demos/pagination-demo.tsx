"use client";

import { Pagination } from "@godui/components";
import { useState } from "react";

// 40 members → 10 pages at 4 per page, so the pagination shows real
// ellipsis truncation (1 … 4 5 6 … 10) on desktop and mobile.
const NAMES = [
  "Ada Lovelace",
  "Linus Torvalds",
  "Grace Hopper",
  "Alan Turing",
  "Katherine Johnson",
  "Margaret Hamilton",
  "Dennis Ritchie",
  "Barbara Liskov",
  "Donald Knuth",
  "Edsger Dijkstra",
  "Tim Berners-Lee",
  "Vint Cerf",
  "Radia Perlman",
  "Leslie Lamport",
  "John McCarthy",
  "Frances Allen",
  "Shafi Goldwasser",
  "Adi Shamir",
  "Ken Thompson",
  "Bjarne Stroustrup",
  "Guido van Rossum",
  "James Gosling",
  "Brendan Eich",
  "John Carmack",
  "Anita Borg",
  "Claude Shannon",
  "John von Neumann",
  "Tony Hoare",
  "Niklaus Wirth",
  "Brian Kernighan",
  "Douglas Engelbart",
  "Sophie Wilson",
  "Steve Wozniak",
  "Yukihiro Matsumoto",
  "Rasmus Lerdorf",
  "Rich Hickey",
  "Joe Armstrong",
  "Evan You",
  "Dan Abramov",
  "Rich Harris",
];

const ROLES = ["Admin", "Member", "Member", "Viewer"];

const ROWS = NAMES.map((name, i) => ({
  id: i,
  name,
  email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@northwind.com`,
  role: i === 0 ? "Owner" : ROLES[i % ROLES.length],
}));

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
          <li key={row.id} className="flex items-center gap-3 px-4 py-2.5">
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
      <div className="flex flex-col items-start gap-3 border-border border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="whitespace-nowrap text-muted-foreground text-xs tabular-nums">
          {start + 1}–{Math.min(start + PAGE_SIZE, ROWS.length)} of{" "}
          {ROWS.length}
        </span>
        <Pagination total={total} page={page} onPageChange={setPage} />
      </div>
    </div>
  );
}
