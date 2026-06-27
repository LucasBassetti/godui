import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogTrigger,
} from "./morphing-dialog";

function Example() {
  return (
    <MorphingDialog>
      <MorphingDialogTrigger>Open</MorphingDialogTrigger>
      <MorphingDialogContent>
        <p>Dialog body</p>
        <MorphingDialogClose />
      </MorphingDialogContent>
    </MorphingDialog>
  );
}

describe("MorphingDialog", () => {
  it("renders the trigger and hides content until opened", () => {
    const { getByText, queryByRole } = render(<Example />);
    expect(getByText("Open")).toBeInTheDocument();
    expect(queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on trigger click", () => {
    const { getByText, getByRole } = render(<Example />);
    fireEvent.click(getByText("Open"));
    expect(getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onOpenChange(false) when the close button is clicked", () => {
    const onOpenChange = vi.fn();
    const { getByLabelText, getByRole } = render(
      <MorphingDialog open onOpenChange={onOpenChange}>
        <MorphingDialogTrigger>Open</MorphingDialogTrigger>
        <MorphingDialogContent>
          <p>Dialog body</p>
          <MorphingDialogClose />
        </MorphingDialogContent>
      </MorphingDialog>,
    );
    expect(getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(getByLabelText("Close dialog"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("respects the controlled open prop", () => {
    const { getByRole } = render(
      <MorphingDialog open>
        <MorphingDialogTrigger>Open</MorphingDialogTrigger>
        <MorphingDialogContent>Body</MorphingDialogContent>
      </MorphingDialog>,
    );
    expect(getByRole("dialog")).toBeInTheDocument();
  });
});
