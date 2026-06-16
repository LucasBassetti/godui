import { TextAnimate, type TextAnimateProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Text/TextAnimate",
  component: TextAnimate,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Animate your ideas into reality",
    animation: "fadeIn",
    by: "word",
    startOnView: false,
    className: "text-4xl font-semibold tracking-tight",
  } satisfies TextAnimateProps,
} satisfies Meta<typeof TextAnimate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FadeIn: Story = {
  args: {
    animation: "fadeIn",
    by: "word",
  },
};

export const BlurInUp: Story = {
  args: {
    animation: "blurInUp",
    by: "word",
    children: "Blur in from below",
  },
};

export const CharacterSlideUp: Story = {
  args: {
    animation: "slideUp",
    by: "character",
    stagger: 0.03,
    children: "Character by character",
  },
};

export const ScaleUp: Story = {
  args: {
    animation: "scaleUp",
    by: "word",
    children: "Scale up with spring",
  },
};

export const SlideLeft: Story = {
  args: {
    animation: "slideLeft",
    by: "word",
    children: "Slide from the right",
  },
};

export const Heading: Story = {
  args: {
    as: "h1",
    animation: "blurInUp",
    by: "word",
    children: "Hero headline",
    className: "text-5xl font-bold tracking-tight",
  },
};

export const InView: Story = {
  args: {
    animation: "fadeIn",
    by: "word",
    startOnView: true,
    once: true,
    children: "Scroll to reveal this text",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "200vh", paddingTop: "80vh" }}>
        <Story />
      </div>
    ),
  ],
};

export const AllPresets: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-8">
      {(
        [
          "fadeIn",
          "blurIn",
          "blurInUp",
          "blurInDown",
          "slideUp",
          "slideDown",
          "slideLeft",
          "slideRight",
          "scaleUp",
          "scaleDown",
        ] as const
      ).map((animation) => (
        <TextAnimate
          key={animation}
          animation={animation}
          by="word"
          startOnView={false}
          className="text-2xl font-medium"
        >
          {animation}
        </TextAnimate>
      ))}
    </div>
  ),
};
