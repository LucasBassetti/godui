import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import { Calculator, Calendar, Settings, Smile, User } from "lucide-react";
import { useState } from "react";

const meta = {
  title: "UI/Command",
  component: Command,
  tags: ["autodocs"],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

function Items() {
  return (
    <>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>
          <Calendar />
          <span>Calendar</span>
        </CommandItem>
        <CommandItem>
          <Smile />
          <span>Search Emoji</span>
        </CommandItem>
        <CommandItem>
          <Calculator />
          <span>Calculator</span>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          <User />
          <span>Profile</span>
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <Settings />
          <span>Settings</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  );
}

export const Default: Story = {
  render: () => (
    <Command className="w-[450px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <Items />
      </CommandList>
    </Command>
  ),
};

function DialogDemo() {
  const [open, setOpen] = useState(true);
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <Items />
      </CommandList>
    </CommandDialog>
  );
}

export const Dialog: Story = { render: () => <DialogDemo /> };
