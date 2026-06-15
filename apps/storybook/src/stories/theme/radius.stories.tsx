import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Theme/Radius",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const radii = [
  { label: "sm", variable: "var(--radius-sm)", description: "radius - 4px" },
  { label: "md", variable: "var(--radius-md)", description: "radius - 2px" },
  { label: "lg", variable: "var(--radius-lg)", description: "radius (base)" },
  { label: "xl", variable: "var(--radius-xl)", description: "radius + 4px" },
];

export const AllRadii: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
      {radii.map((r) => (
        <div
          key={r.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: r.variable,
              backgroundColor: "var(--primary)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            {r.label}
          </span>
          <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>
            {r.description}
          </span>
        </div>
      ))}
    </div>
  ),
};
