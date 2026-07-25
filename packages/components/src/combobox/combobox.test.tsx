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

  it("creatable: commits a typed value that is not an option", async () => {
    const onChange = vi.fn();
    render(<Combobox options={options} creatable onChange={onChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.type(input, "Mango");
    await userEvent.click(screen.getByRole("option", { name: /Mango/ }));
    expect(onChange).toHaveBeenCalledWith(
      "Mango",
      expect.objectContaining({ value: "Mango" }),
    );
  });

  it("creatable: onCreate persists the typed value instead of committing it", async () => {
    const onCreate = vi.fn();
    const onChange = vi.fn();
    render(
      <Combobox
        options={options}
        creatable
        onCreate={onCreate}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.type(input, "Mango");
    await userEvent.click(screen.getByRole("option", { name: /Mango/ }));
    expect(onCreate).toHaveBeenCalledWith("Mango");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("creatable: Enter selects the highlighted match, not the create row", async () => {
    const onChange = vi.fn();
    const onCreate = vi.fn();
    render(
      <Combobox
        options={options}
        creatable
        onChange={onChange}
        onCreate={onCreate}
      />,
    );
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    // "Ban" partially matches "Banana" and is also creatable (no exact match).
    await userEvent.type(input, "Ban");
    await userEvent.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith(
      "banana",
      expect.objectContaining({ value: "banana" }),
    );
    expect(onCreate).not.toHaveBeenCalled();
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
