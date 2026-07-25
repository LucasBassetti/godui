import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Combobox, type ComboboxOption } from "./combobox";

// 6 options → past the auto-searchable threshold (>5), so these render as the
// searchable input by default.
const options: ComboboxOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Date", value: "date" },
  { label: "Elderberry", value: "elderberry" },
  { label: "Fig", value: "fig" },
];

// A short fixed list (≤5) — auto-renders as a plain dropdown.
const few: ComboboxOption[] = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

describe("Combobox", () => {
  it("opens and filters options as you type", async () => {
    render(<Combobox options={options} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.type(input, "ban");
    expect(screen.getByRole("option", { name: /Banana/ })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /Apple/ }),
    ).not.toBeInTheDocument();
  });

  it("selects an option and fires onChange", async () => {
    const onChange = vi.fn();
    render(<Combobox options={options} onChange={onChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.click(screen.getByRole("option", { name: /Cherry/ }));
    expect(onChange).toHaveBeenCalledWith(
      "cherry",
      expect.objectContaining({ value: "cherry" }),
    );
  });

  it("non-searchable: a short list is a plain click-to-open dropdown", async () => {
    const onChange = vi.fn();
    render(<Combobox options={few} onChange={onChange} />);
    const control = screen.getByRole("combobox");
    expect(control.tagName).toBe("BUTTON");
    await userEvent.click(control);
    await userEvent.click(screen.getByRole("option", { name: /Large/ }));
    expect(onChange).toHaveBeenCalledWith(
      "lg",
      expect.objectContaining({ value: "lg" }),
    );
  });

  it("searchable={false} forces a dropdown even for a long list", () => {
    render(<Combobox options={options} searchable={false} />);
    expect(screen.getByRole("combobox").tagName).toBe("BUTTON");
  });

  it("searchableThreshold retunes the auto-search cutoff", () => {
    render(<Combobox options={few} searchableThreshold={2} />);
    expect(screen.getByRole("combobox").tagName).toBe("INPUT");
  });

  it("selects the active option with the keyboard", async () => {
    const onChange = vi.fn();
    render(<Combobox options={options} onChange={onChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith(
      "banana",
      expect.objectContaining({ value: "banana" }),
    );
  });

  it("shows the empty message when nothing matches", async () => {
    render(<Combobox options={options} emptyMessage="Nothing here" />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.type(input, "zzz");
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("does not open or accept input when disabled", async () => {
    const onChange = vi.fn();
    render(<Combobox options={options} disabled onChange={onChange} />);
    const input = screen.getByRole("combobox");
    expect(input).toBeDisabled();
    await userEvent.click(input);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /Apple/ }),
    ).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Combobox ref={ref} options={options} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(Combobox.displayName).toBe("Combobox");
  });
});
