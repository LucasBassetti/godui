import { ContainerScroll } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Layout/Container Scroll",
  component: ContainerScroll,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    header: (
      <>
        <h2 className="text-3xl font-bold text-foreground md:text-5xl">
          Scroll to bring it to life
        </h2>
        <p className="mt-4 text-muted-foreground">
          The frame un-tilts and settles as you scroll.
        </p>
      </>
    ),
    children: (
      <img src="https://picsum.photos/id/1005/1200/750" alt="Dashboard" />
    ),
  },
  render: (args) => <ContainerScroll {...args} />,
} satisfies Meta<typeof ContainerScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
