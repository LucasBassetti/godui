import { Pagination } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, hidden, range } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    page: hidden(),
    total: range(1, 100, 1, "Content"),
    defaultPage: range(1, 100, 1, "State"),
    boundaryCount: range(0, 4, 1, "Behavior"),
    siblingCount: range(0, 4, 1, "Behavior"),
    onPageChange: action("pageChange"),
  },
  args: {
    total: 50,
    defaultPage: 25,
    boundaryCount: 1,
    siblingCount: 1,
    onPageChange: fn(),
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
