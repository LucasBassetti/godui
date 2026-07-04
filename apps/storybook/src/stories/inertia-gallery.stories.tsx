import { InertiaGallery, type InertiaGalleryProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range, toggle } from "../playground/argtypes";

const SHOTS = [
  { label: "Dune", img: "1018" },
  { label: "Harbor", img: "1024" },
  { label: "Ridge", img: "1036" },
  { label: "Bloom", img: "1062" },
  { label: "Quartz", img: "1074" },
  { label: "Meadow", img: "1080" },
];

function Shot({ label, img }: (typeof SHOTS)[number]) {
  return (
    <div className="relative size-full select-none">
      <img
        src={`https://picsum.photos/id/${img}/400/533`}
        alt={label}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
        {label}
      </span>
    </div>
  );
}

const meta = {
  title: "Layout/InertiaGallery",
  component: InertiaGallery,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    itemWidth: range(120, 320, 10, "Appearance"),
    gap: range(0, 80, 4, "Appearance"),
    falloff: range(0, 2, 0.1, "Appearance"),
    snap: toggle("Behavior"),
  },
  args: { defaultIndex: 2, itemWidth: 200, gap: 24, falloff: 1, snap: true },
  render: (args: InertiaGalleryProps) => (
    <div className="mx-auto w-full max-w-3xl p-6">
      <InertiaGallery {...args}>
        {SHOTS.map((s) => (
          <Shot key={s.label} {...s} />
        ))}
      </InertiaGallery>
    </div>
  ),
} satisfies Meta<typeof InertiaGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
