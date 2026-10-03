import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Sheet",
  component: Sheet,
  tags: ["autodocs"],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIDES = ["top", "right", "bottom", "left"] as const;

function Panel({ side }: { side: (typeof SIDES)[number] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="capitalize">
          {side === "right" ? "Open sheet" : side}
        </Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const Default: Story = { render: () => <Panel side="right" /> };

export const Sides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2">
      {SIDES.map((side) => (
        <Panel key={side} side={side} />
      ))}
    </div>
  ),
};
