import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Theme/Spacing",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const spacingScale = [
  { label: "1 (4px)", value: 4 },
  { label: "2 (8px)", value: 8 },
  { label: "3 (12px)", value: 12 },
  { label: "4 (16px)", value: 16 },
  { label: "5 (20px)", value: 20 },
  { label: "6 (24px)", value: 24 },
  { label: "8 (32px)", value: 32 },
  { label: "10 (40px)", value: 40 },
  { label: "12 (48px)", value: 48 },
  { label: "16 (64px)", value: 64 },
  { label: "20 (80px)", value: 80 },
  { label: "24 (96px)", value: 96 },
];

export const Scale: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {spacingScale.map((s) => (
        <div
          key={s.label}
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          <span
            style={{
              fontSize: 11,
              color: "var(--muted-foreground)",
              width: 80,
              flexShrink: 0,
              textAlign: "right",
            }}
          >
            {s.label}
          </span>
          <div
            style={{
              width: s.value,
              height: 24,
              borderRadius: 4,
              backgroundColor: "var(--primary)",
            }}
          />
        </div>
      ))}
    </div>
  ),
};
