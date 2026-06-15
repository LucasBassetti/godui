import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Theme/Shadows",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const shadows = [
  { label: "2xs", variable: "var(--shadow-2xs)" },
  { label: "xs", variable: "var(--shadow-xs)" },
  { label: "sm", variable: "var(--shadow-sm)" },
  { label: "default", variable: "var(--shadow)" },
  { label: "md", variable: "var(--shadow-md)" },
  { label: "lg", variable: "var(--shadow-lg)" },
  { label: "xl", variable: "var(--shadow-xl)" },
  { label: "2xl", variable: "var(--shadow-2xl)" },
];

export const AllShadows: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
      {shadows.map((s) => (
        <div
          key={s.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 8,
              backgroundColor: "var(--card)",
              boxShadow: s.variable,
              border: "1px solid var(--border)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  ),
};
