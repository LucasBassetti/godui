import { AnimatedTestimonials } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const testimonials = [
  {
    quote:
      "GodUI shipped the smoothest interactions I've put in production this year.",
    name: "Ada Lovelace",
    role: "Design Engineer, Analytical",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
  },
  {
    quote: "Spring physics out of the box. Everything just feels expensive.",
    name: "Grace Hopper",
    role: "Staff Engineer, Compiler Co.",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
  },
  {
    quote: "Dropped the components in and our landing page converted better.",
    name: "Alan Turing",
    role: "Founder, Enigma",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
  },
];

const meta = {
  title: "Layout/AnimatedTestimonials",
  component: AnimatedTestimonials,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { testimonials, autoplay: true, interval: 5000 },
} satisfies Meta<typeof AnimatedTestimonials>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoAutoplay: Story = { args: { autoplay: false } };
