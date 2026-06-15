import { Typography, type TypographyProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Typography",
  component: Typography,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
  args: {
    variant: "h1",
    children: "The quick brown fox jumps",
  } satisfies TypographyProps,
};

export const Heading2: Story = {
  args: {
    variant: "h2",
    children: "The quick brown fox jumps",
  } satisfies TypographyProps,
};

export const Paragraph: Story = {
  args: {
    variant: "p",
    children:
      "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
  } satisfies TypographyProps,
};

export const Lead: Story = {
  args: {
    variant: "lead",
    children: "A larger, muted paragraph used for intros.",
  } satisfies TypographyProps,
};

export const Muted: Story = {
  args: {
    variant: "muted",
    children: "Muted helper text.",
  } satisfies TypographyProps,
};

export const Code: Story = {
  args: {
    variant: "code",
    children: "npm install @godui/components",
  } satisfies TypographyProps,
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="p">
        Paragraph text used for general body copy across the app.
      </Typography>
      <Typography variant="lead">Lead paragraph for page intros.</Typography>
      <Typography variant="large">Large text</Typography>
      <Typography variant="small">Small text</Typography>
      <Typography variant="muted">Muted helper text</Typography>
      <Typography variant="code">inline code</Typography>
    </div>
  ),
};
