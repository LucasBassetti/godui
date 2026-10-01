import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReorderItem, ReorderList } from "./reorder-list";

describe("ReorderList", () => {
  it("renders an item per value", () => {
    const values = ["Alpha", "Beta", "Gamma"];
    const { getByText, container } = render(
      <ReorderList values={values} onReorder={() => {}}>
        {values.map((v) => (
          <ReorderItem key={v} value={v}>
            {v}
          </ReorderItem>
        ))}
      </ReorderList>,
    );
    expect(getByText("Alpha")).toBeInTheDocument();
    expect(getByText("Gamma")).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-slot="reorder-item"]'),
    ).toHaveLength(3);
  });

  it("renders the list container as a ul", () => {
    const { container } = render(
      <ReorderList values={[]} onReorder={() => {}}>
        {null}
      </ReorderList>,
    );
    const list = container.querySelector('[data-slot="reorder-list"]');
    expect(list?.tagName).toBe("UL");
  });
});
