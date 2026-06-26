import { type Facet, FilterBar } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const facets: Facet[] = [
  {
    id: "status",
    label: "Status",
    options: [
      { label: "Open", value: "open", count: 128 },
      { label: "In progress", value: "progress", count: 42 },
      { label: "Closed", value: "closed", count: 311 },
    ],
  },
  {
    id: "type",
    label: "Type",
    options: [
      { label: "Bug", value: "bug", count: 64 },
      { label: "Feature", value: "feature", count: 39 },
      { label: "Chore", value: "chore", count: 18 },
    ],
  },
  {
    id: "assignee",
    label: "Assignee",
    options: [
      { label: "Ada", value: "ada", count: 21 },
      { label: "Linus", value: "linus", count: 33 },
      { label: "Grace", value: "grace", count: 12 },
    ],
  },
];

const meta = {
  title: "Navigation/Filter Bar",
  component: FilterBar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { facets },
  decorators: [
    (Story) => (
      <div className="w-[640px] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  args: { defaultValue: { status: ["open"], type: ["bug", "feature"] } },
};

export const NoCounts: Story = { args: { showCounts: false } };
