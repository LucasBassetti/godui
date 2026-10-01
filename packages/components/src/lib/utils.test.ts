import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins and de-duplicates Tailwind classes, last wins", () => {
    expect(cn("px-2 py-1", false && "hidden", "px-4")).toBe("py-1 px-4");
  });
});
