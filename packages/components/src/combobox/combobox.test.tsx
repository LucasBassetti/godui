import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
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

  it("multi-select: clicking the empty control area focuses the input, not a chip", async () => {
    const onToggle = vi.fn();
    render(
      <Combobox
        multiple
        options={options}
        values={["apple", "banana"]}
        onToggle={onToggle}
      />,
    );
    const input = screen.getByRole("combobox");
    // The wrapping <label> is the clickable control area around the chips.
    const control = input.closest("label");
    expect(control).not.toBeNull();
    await userEvent.click(control as HTMLLabelElement);
    // A bare <label> would proxy this click to the first chip's remove button
    // and toggle it off; the htmlFor association makes it focus the input instead.
    expect(onToggle).not.toHaveBeenCalled();
    expect(input).toHaveFocus();
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

  it("creatable: refocusing after a selection does not dump the value into the input", async () => {
    // Controlled so the selection sticks; refocusing must not seed the query
    // with the option's value id (the old onFocus hack showed "banana").
    function Harness() {
      const [value, setValue] = useState("");
      return (
        <Combobox
          options={options}
          creatable
          value={value}
          onChange={setValue}
        />
      );
    }
    render(<Harness />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.click(screen.getByRole("option", { name: "Banana" }));
    // Closed: shows the human label, not the value id.
    expect(input).toHaveValue("Banana");
    // Refocus: the field clears to let you search — it must not show "banana".
    await userEvent.click(input);
    expect(input).toHaveValue("");
  });

  it("creatable: shows an in-row spinner while onCreate is in flight, then closes", async () => {
    let resolveCreate: () => void = () => {};
    const onCreate = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolveCreate = r;
        }),
    );
    render(<Combobox options={options} creatable onCreate={onCreate} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.type(input, "Mango");
    await userEvent.click(screen.getByRole("option", { name: /Mango/ }));
    expect(onCreate).toHaveBeenCalledWith("Mango");
    // The popup stays open with an "Adding" state until the promise resolves.
    expect(screen.getByText(/Adding/)).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    resolveCreate();
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument(),
    );
  });

  it("async: shows an in-popup loading state, then selectable results", async () => {
    const onChange = vi.fn();
    const onSearch = vi.fn(async () => {
      await new Promise((r) => setTimeout(r, 50));
      return [{ label: "Next.js", value: "next" }] as ComboboxOption[];
    });
    render(<Combobox onSearch={onSearch} onChange={onChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    // A loading row renders inside the listbox while results resolve.
    expect(await screen.findByText(/Searching/)).toBeInTheDocument();
    // Then the result becomes selectable.
    await userEvent.click(
      await screen.findByRole("option", { name: "Next.js" }),
    );
    expect(onChange).toHaveBeenCalledWith(
      "next",
      expect.objectContaining({ value: "next" }),
    );
  });

  it("creatable: flashes a check icon in the field as success feedback after creating", async () => {
    render(<Combobox options={options} creatable />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.type(input, "Mango");
    await userEvent.click(screen.getByRole("option", { name: /Mango/ }));
    // The trailing search icon morphs to a check (the list is closed, so this
    // check can only be the field's success flash).
    await waitFor(() =>
      expect(
        document.querySelector('path[d="M20 6 9 17l-5-5"]'),
      ).toBeInTheDocument(),
    );
  });

  it("async: selecting shows the label and reopening keeps cached results without a fresh spinner", async () => {
    const onSearch = vi.fn(async () => {
      await new Promise((r) => setTimeout(r, 20));
      return [
        { label: "Next.js", value: "next" },
        { label: "Remix", value: "remix" },
      ] as ComboboxOption[];
    });
    render(<Combobox onSearch={onSearch} placeholder="Search" />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.click(
      await screen.findByRole("option", { name: "Next.js" }),
    );
    // Async picks resolve their label from the results cache (never in `options`).
    expect(input).toHaveValue("Next.js");
    const calls = onSearch.mock.calls.length;
    // Reopen with the same query: cached results show immediately, and — past the
    // debounce window — no refetch fired (so the loading spinner never reflashes).
    await userEvent.click(input);
    expect(screen.getByRole("option", { name: "Remix" })).toBeInTheDocument();
    expect(screen.queryByText(/Searching/)).not.toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 250));
    expect(onSearch).toHaveBeenCalledTimes(calls);
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

  it("a typing-dependent feature forces a searchable input on a short list", () => {
    // `few` has 3 options (≤ threshold) but `creatable` needs a text query.
    render(<Combobox options={few} creatable />);
    expect(screen.getByRole("combobox").tagName).toBe("INPUT");
  });

  it("pinnedAction: renders a persistent row and fires onSelect", async () => {
    const onSelect = vi.fn();
    render(
      <Combobox
        options={options}
        pinnedAction={{ label: "Manage", onSelect }}
      />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("button", { name: "Manage" }));
    expect(onSelect).toHaveBeenCalled();
  });

  it("emptyAction: shows a CTA in the empty state and fires onSelect", async () => {
    const onSelect = vi.fn();
    render(
      <Combobox
        options={options}
        emptyAction={{ label: "Invite someone", onSelect }}
      />,
    );
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.type(input, "zzz");
    await userEvent.click(
      screen.getByRole("button", { name: "Invite someone" }),
    );
    expect(onSelect).toHaveBeenCalledWith("zzz");
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
