import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRUITS = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

function Fruits({ position }: { position?: "item-aligned" | "popper" }) {
  return (
    <div className="flex min-h-80 items-start justify-center pt-10">
      <Select>
        <SelectTrigger className="w-[180px] text-foreground" aria-label="Fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent position={position}>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {FRUITS.map((fruit) => (
              <SelectItem key={fruit} value={fruit.toLowerCase()}>
                {fruit}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export const Default: Story = { render: () => <Fruits /> };
export const Popper: Story = { render: () => <Fruits position="popper" /> };
