import { OrbitCarousel, type OrbitCarouselProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range } from "../playground/argtypes";

const CARDS = [
  { title: "Aurora", img: "1041" },
  { title: "Basalt", img: "1047" },
  { title: "Cirrus", img: "1052" },
  { title: "Drift", img: "1059" },
  { title: "Ember", img: "1069" },
];

function OrbitCard({ title, img }: (typeof CARDS)[number]) {
  return (
    <div className="relative size-full select-none">
      <img
        src={`https://picsum.photos/id/${img}/320/400`}
        alt={title}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
    </div>
  );
}

const meta = {
  title: "Layout/OrbitCarousel",
  component: OrbitCarousel,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    radius: range(160, 360, 10, "Appearance"),
    angleStep: range(12, 44, 2, "Appearance"),
    itemWidth: range(100, 240, 10, "Appearance"),
    itemHeight: range(120, 300, 10, "Appearance"),
  },
  args: {
    defaultIndex: 2,
    radius: 230,
    angleStep: 26,
    itemWidth: 160,
    itemHeight: 200,
  },
  render: (args: OrbitCarouselProps) => (
    <OrbitCarousel {...args}>
      {CARDS.map((c) => (
        <OrbitCard key={c.title} {...c} />
      ))}
    </OrbitCarousel>
  ),
} satisfies Meta<typeof OrbitCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
