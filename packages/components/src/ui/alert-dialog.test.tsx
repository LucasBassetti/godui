import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/alert-dialog";
import * as Godui from "./alert-dialog";
import { Button } from "./button";

function Usage({
  ui,
  defaultOpen,
  size,
}: {
  ui: typeof Shadcn;
  defaultOpen?: boolean;
  size?: "default" | "sm";
}) {
  const {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
  } = ui;
  return (
    <AlertDialog defaultOpen={defaultOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          <AlertDialogMedia>!</AlertDialogMedia>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe("AlertDialog", () => {
  it.each([
    "default",
    "sm",
  ] as const)("matches shadcn's data-slot tree and exports (size %s)", (size) => {
    const { unmount } = render(<Usage ui={Shadcn} defaultOpen size={size} />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} defaultOpen size={size} />);
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("ignores outside clicks and closes from Cancel", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("button", { name: "Show Dialog" }));
    const overlay = document.querySelector(
      '[data-slot="alert-dialog-overlay"]',
    ) as HTMLElement;
    await user.click(overlay);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
  });

  it("action and cancel keep their slots and Button's press motion", () => {
    render(<Usage ui={Godui} defaultOpen />);
    const action = screen.getByRole("button", { name: "Continue" });
    const cancel = screen.getByRole("button", { name: "Cancel" });
    expect(action).toHaveAttribute("data-slot", "alert-dialog-action");
    expect(cancel).toHaveAttribute("data-slot", "alert-dialog-cancel");
    expect(action.className).toContain("active:scale-[0.97]");
    expect(cancel.className).toContain("active:scale-[0.97]");
  });

  it("enters and exits with godui-motion keyframes only", () => {
    render(<Usage ui={Godui} defaultOpen />);
    const content = document.querySelector(
      '[data-slot="alert-dialog-content"]',
    );
    const overlay = document.querySelector(
      '[data-slot="alert-dialog-overlay"]',
    );
    expect(content?.className).toContain(
      "data-[state=open]:animate-godui-fade-scale-in",
    );
    expect(content?.className).toContain(
      "data-[state=closed]:animate-godui-fade-scale-out",
    );
    expect(overlay?.className).toContain(
      "data-[state=open]:animate-godui-fade-in",
    );
    for (const el of [content, overlay]) {
      expect(el?.className).not.toMatch(/animate-in|zoom-in|duration-\d/);
    }
  });
});
