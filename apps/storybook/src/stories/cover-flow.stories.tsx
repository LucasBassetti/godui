import { CoverFlow, type CoverFlowProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range, toggle } from "../playground/argtypes";

const COVERS = [
  { title: "Nightfall", artist: "Aurora Grey", img: "1043" },
  { title: "Golden Hour", artist: "Marlowe", img: "1025" },
  { title: "Deep Field", artist: "Vesper", img: "1039" },
  { title: "Slow Tide", artist: "Costa", img: "1015" },
  { title: "Paper Moons", artist: "Halden", img: "1050" },
];

function Cover({ title, artist, img }: (typeof COVERS)[number]) {
  return (
    <div className="relative size-full select-none">
      <img
        src={`https://picsum.photos/id/${img}/500/500`}
        alt={title}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-xs text-white/70">{artist}</p>
      </div>
    </div>
  );
}

const meta = {
  title: "Layout/CoverFlow",
  component: CoverFlow,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    itemWidth: range(140, 320, 10, "Appearance"),
    itemHeight: range(140, 360, 10, "Appearance"),
    gap: range(0, 120, 4, "Appearance"),
    perspective: range(600, 2000, 50, "Appearance"),
    reflection: toggle("Appearance"),
  },
  args: {
    defaultIndex: 2,
    itemWidth: 220,
    itemHeight: 220,
    gap: 0,
    perspective: 1200,
    reflection: true,
  },
  render: (args: CoverFlowProps) => (
    <CoverFlow {...args}>
      {COVERS.map((c) => (
        <Cover key={c.title} {...c} />
      ))}
    </CoverFlow>
  ),
} satisfies Meta<typeof CoverFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
