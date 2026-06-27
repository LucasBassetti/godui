import { ImageAccordion, type ImageAccordionProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range } from "../playground/argtypes";

const PANELS = [
  {
    image: "https://picsum.photos/id/1018/900/1200",
    title: "Mountains",
    description: "Alpine ridges at first light.",
  },
  {
    image: "https://picsum.photos/id/1015/900/1200",
    title: "Rivers",
    description: "Glacial water carving the valley.",
  },
  {
    image: "https://picsum.photos/id/1039/900/1200",
    title: "Waterfalls",
    description: "A 60-metre drop into the basin.",
  },
  {
    image: "https://picsum.photos/id/1043/900/1200",
    title: "Forests",
    description: "Old growth as far as you can see.",
  },
  {
    image: "https://picsum.photos/id/1056/900/1200",
    title: "Coastline",
    description: "Where the cliffs meet the sea.",
  },
];

const meta = {
  title: "Layout/ImageAccordion",
  component: ImageAccordion,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    defaultIndex: range(0, 4, 1, "Behavior"),
    activeGrow: range(2, 10, 1, "Appearance"),
    height: { control: "text", table: { category: "Appearance" } },
  },
  args: { panels: PANELS, defaultIndex: 0, activeGrow: 5, height: "26rem" },
  render: (args: ImageAccordionProps) => (
    <ImageAccordion {...args} className="w-[42rem] max-w-[90vw]" />
  ),
} satisfies Meta<typeof ImageAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
