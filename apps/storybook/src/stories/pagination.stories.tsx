import { Pagination } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { total: 10, defaultPage: 1 },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Middle: Story = { args: { total: 50, defaultPage: 25 } };
export const FewPages: Story = { args: { total: 4, defaultPage: 2 } };
export const WiderSiblings: Story = {
  args: { total: 50, defaultPage: 25, siblingCount: 2, boundaryCount: 2 },
};
