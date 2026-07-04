import { MorphGallery, type MorphGalleryProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range } from "../playground/argtypes";

const PHOTOS = [
  { id: "1002", caption: "Coastline at dawn" },
  { id: "1011", caption: "Alpine switchbacks" },
  { id: "1016", caption: "Fog over the valley" },
  { id: "1021", caption: "Desert monolith" },
  { id: "1033", caption: "Harbor lights" },
  { id: "1040", caption: "Pine ridge" },
  { id: "1044", caption: "Salt flats" },
  { id: "1057", caption: "River bend" },
  { id: "1068", caption: "Autumn canopy" },
];

const ITEMS = PHOTOS.map((p) => ({
  src: `https://picsum.photos/id/${p.id}/900/900`,
  alt: p.caption,
  caption: p.caption,
}));

const meta = {
  title: "Layout/MorphGallery",
  component: MorphGallery,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    columns: range(2, 5, 1, "Appearance"),
  },
  args: { columns: 3, items: ITEMS },
  render: (args: MorphGalleryProps) => (
    <div className="mx-auto max-w-2xl">
      <MorphGallery {...args} />
    </div>
  ),
} satisfies Meta<typeof MorphGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
