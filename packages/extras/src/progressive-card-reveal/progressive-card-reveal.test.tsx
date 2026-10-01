import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProgressiveCardReveal } from "./progressive-card-reveal";

const labels = ["Flight", "Driving", "Walking"];

function renderReveal(activeIndex: number, onActiveChange = vi.fn()) {
  const utils = render(
    <ProgressiveCardReveal
      activeIndex={activeIndex}
      onActiveChange={onActiveChange}
    >
      {labels.map((label) => (
        <ProgressiveCardReveal.Card key={label}>
          <ProgressiveCardReveal.CardCollapsed>
            {`${label} pill`}
          </ProgressiveCardReveal.CardCollapsed>
          <ProgressiveCardReveal.CardExpanded>
            {`${label} details`}
          </ProgressiveCardReveal.CardExpanded>
        </ProgressiveCardReveal.Card>
      ))}
    </ProgressiveCardReveal>,
  );
  return { ...utils, onActiveChange };
}

describe("ProgressiveCardReveal", () => {
  it("expands the active card and collapses the rest", () => {
    renderReveal(1);
    expect(screen.getByText("Driving details")).toBeInTheDocument();
    expect(screen.getByText("Flight pill")).toBeInTheDocument();
    expect(screen.getByText("Walking pill")).toBeInTheDocument();
    expect(screen.queryByText("Flight details")).not.toBeInTheDocument();
    expect(screen.queryByText("Driving pill")).not.toBeInTheDocument();
  });

  it("renders each collapsed card as a button", () => {
    renderReveal(1);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("fires onActiveChange with the clicked card's index", async () => {
    const { onActiveChange } = renderReveal(1);
    await userEvent.click(screen.getByText("Flight pill"));
    expect(onActiveChange).toHaveBeenCalledWith(0);
    await userEvent.click(screen.getByText("Walking pill"));
    expect(onActiveChange).toHaveBeenCalledWith(2);
  });

  it("sets displayName on the compound parts", () => {
    expect(ProgressiveCardReveal.displayName).toBe("ProgressiveCardReveal");
    expect(ProgressiveCardReveal.Card.displayName).toBe(
      "ProgressiveCardReveal.Card",
    );
  });

  it("throws when a Card is rendered outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <ProgressiveCardReveal.Card>
          <ProgressiveCardReveal.CardCollapsed>
            Orphan
          </ProgressiveCardReveal.CardCollapsed>
        </ProgressiveCardReveal.Card>,
      ),
    ).toThrow(/inside <ProgressiveCardReveal>/);
    spy.mockRestore();
  });
});
