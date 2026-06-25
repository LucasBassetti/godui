import { Lamp } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Effects/Lamp",
  component: Lamp,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Lamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Lamp>
      <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Ship in the spotlight
      </h2>
    </Lamp>
  ),
};
