import { EncryptedCard, type EncryptedCardProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

function CardBody() {
  return (
    <div className="p-6">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span className="size-1.5 rounded-full bg-primary" />
        Secure
      </span>
      <h3 className="mt-3 text-lg font-semibold">End-to-end encrypted</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Every payload is sealed with AES-256 before it leaves the device. Hover
        to peek behind the cipher.
      </p>
    </div>
  );
}

const meta = {
  title: "Effects/Encrypted Card",
  component: EncryptedCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    speed: 55,
    revealRadius: 130,
    streamColor: "var(--primary)",
    streamOpacity: 1,
  } satisfies EncryptedCardProps,
  argTypes: {
    speed: { control: { type: "range", min: 20, max: 200, step: 5 } },
    revealRadius: { control: { type: "range", min: 60, max: 260, step: 10 } },
    streamColor: { control: "text" },
    streamOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
  },
  render: (args) => (
    <EncryptedCard {...args} className="w-80">
      <CardBody />
    </EncryptedCard>
  ),
} satisfies Meta<typeof EncryptedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TightReveal: Story = {
  args: { revealRadius: 80, speed: 35 },
};

export const AccentStream: Story = {
  args: { streamColor: "color-mix(in oklch, var(--primary) 70%, #22d3ee)" },
};

export const SubtleStream: Story = {
  args: { streamOpacity: 0.4 },
};
