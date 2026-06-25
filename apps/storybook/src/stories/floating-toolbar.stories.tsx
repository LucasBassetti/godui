import { FloatingToolbar } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const icon = (path: string) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 18, height: 18 }}
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

const actions = [
  { icon: icon("M6 12h12M6 6h12M6 18h12"), label: "Align", active: true },
  { icon: icon("M4 7V4h16v3M9 20h6M12 4v16"), label: "Text" },
  { icon: icon("M21 15l-5-5L5 21"), label: "Image" },
  { icon: icon("M3 6h18M3 12h18M3 18h18"), label: "List" },
];

const meta = {
  title: "Overlays/Floating Toolbar",
  component: FloatingToolbar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { actions, open: true },
} satisfies Meta<typeof FloatingToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
