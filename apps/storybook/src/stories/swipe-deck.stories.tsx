import { SwipeDeck, type SwipeDeckProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range, toggle } from "../playground/argtypes";

const CARDS = [
  { name: "Aria Wells", role: "Product Designer", img: "1027" },
  { name: "Mateo Cruz", role: "Staff Engineer", img: "1005" },
  { name: "Noah Kim", role: "Founder", img: "1012" },
  { name: "Lena Park", role: "Researcher", img: "1066" },
];

function ProfileCard({
  name,
  role,
  img,
}: {
  name: string;
  role: string;
  img: string;
}) {
  return (
    <div className="relative size-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      <img
        src={`https://picsum.photos/id/${img}/600/800`}
        alt={name}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="text-sm text-white/75">{role}</p>
      </div>
    </div>
  );
}

const meta = {
  title: "Layout/SwipeDeck",
  component: SwipeDeck,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    threshold: range(40, 220, 10, "Behavior"),
    loop: toggle("Behavior"),
  },
  args: { threshold: 120, loop: true },
  render: (args: SwipeDeckProps) => (
    <SwipeDeck {...args} actions={{ left: "Pass", right: "Connect" }}>
      {CARDS.map((c) => (
        <ProfileCard key={c.name} {...c} />
      ))}
    </SwipeDeck>
  ),
} satisfies Meta<typeof SwipeDeck>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
