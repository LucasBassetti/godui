import { type Facet, FilterBar } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, hidden, toggle } from "../playground/argtypes";
import { padded } from "../playground/stage";

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
  decorators: [padded()],
  argTypes: {
    facets: hidden(),
    value: hidden(),
    defaultValue: hidden(),
    searchable: toggle("Behavior"),
    showCounts: toggle("Appearance"),
    onChange: action("change"),
  },
  args: { facets, searchable: true, showCounts: true, onChange: fn() },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
