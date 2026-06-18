import { MagicTab, type MagicTabProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const items = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics" },
  { value: "reports", label: "Reports" },
  { value: "settings", label: "Settings" },
];

const meta = {
  title: "Navigation/Magic Tab",
  component: MagicTab,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    items,
  } satisfies Partial<MagicTabProps>,
} satisfies Meta<typeof MagicTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items,
    variant: "default",
  } satisfies MagicTabProps,
};

export const Secondary: Story = {
  args: {
    items,
    variant: "secondary",
  } satisfies MagicTabProps,
};

export const WithoutRainbow: Story = {
  args: {
    items,
    rainbow: false,
  } satisfies MagicTabProps,
};

export const WithDisabledTab: Story = {
  args: {
    items: [
      { value: "overview", label: "Overview" },
      { value: "analytics", label: "Analytics", disabled: true },
      { value: "reports", label: "Reports" },
    ],
  } satisfies MagicTabProps,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <MagicTab items={items} size="sm" />
      <MagicTab items={items} size="md" />
      <MagicTab items={items} size="lg" />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("analytics");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <MagicTab items={items} value={value} onValueChange={setValue} />
        <p style={{ textAlign: "center", margin: 0 }}>
          Selected: <strong>{value}</strong>
        </p>
      </div>
    );
  },
};

export const Playground: Story = {
  args: {
    items,
    variant: "default",
    size: "md",
    rainbow: true,
  } satisfies MagicTabProps,
};
