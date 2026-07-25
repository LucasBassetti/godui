import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Combobox, type ComboboxOption } from "./combobox";

const options: ComboboxOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
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

  it("multi-select toggles values and keeps the list open", async () => {
    const onToggle = vi.fn();
    render(
      <Combobox
        multiple
        options={options}
        values={["apple"]}
        onToggle={onToggle}
      />,
    );
    // The selected value shows as a chip.
    expect(screen.getByText("Apple")).toBeInTheDocument();

    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.click(screen.getByRole("option", { name: /Banana/ }));
    expect(onToggle).toHaveBeenCalledWith(
      "banana",
      expect.objectContaining({ value: "banana" }),
    );
    // The list stays open after a pick.
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("multi-select removes a value via its chip button", async () => {
    const onToggle = vi.fn();
    render(
      <Combobox
        multiple
        options={options}
        values={["apple"]}
        onToggle={onToggle}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove Apple" }));
    expect(onToggle).toHaveBeenCalledWith(
      "apple",
      expect.objectContaining({ value: "apple" }),
    );
  });

  it("multi-select: a disabled chip cannot be removed", async () => {
    const onToggle = vi.fn();
    render(
      <Combobox
        multiple
        disabled
        options={options}
        values={["apple"]}
        onToggle={onToggle}
      />,
    );
    const remove = screen.getByRole("button", { name: "Remove Apple" });
    expect(remove).toBeDisabled();
    await userEvent.click(remove);
    expect(onToggle).not.toHaveBeenCalled();
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
