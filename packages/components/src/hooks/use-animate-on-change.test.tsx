import { renderHook } from "@testing-library/react";
import { useAnimateOnChange } from "./use-animate-on-change";

describe("useAnimateOnChange", () => {
  it("is false on mount and stays false while the value holds", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useAnimateOnChange(value),
      { initialProps: { value: true as unknown } },
    );
    expect(result.current).toBe(false);
    rerender({ value: true });
    expect(result.current).toBe(false);
  });

  it("turns true in the render where the value changes, and stays true", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useAnimateOnChange(value),
      { initialProps: { value: "a" as unknown } },
    );
    rerender({ value: "b" });
    expect(result.current).toBe(true);
    rerender({ value: "a" });
    expect(result.current).toBe(true);
  });

  it("a remount starts over", () => {
    const first = renderHook(({ value }) => useAnimateOnChange(value), {
      initialProps: { value: 1 as unknown },
    });
    first.rerender({ value: 2 });
    first.unmount();
    const second = renderHook(() => useAnimateOnChange(2));
    expect(second.result.current).toBe(false);
  });
});
