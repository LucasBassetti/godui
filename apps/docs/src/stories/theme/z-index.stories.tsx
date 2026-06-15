import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Theme/Z-Index",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const layers = [
  {
    label: "base",
    variable: "--z-base",
    value: 0,
    description: "Default stacking context",
  },
  {
    label: "raised",
    variable: "--z-raised",
    value: 10,
    description: "Inline overlays (button effects, badges)",
  },
  {
    label: "overlay",
    variable: "--z-overlay",
    value: 20,
    description: "Background overlays (grid lines, scrims)",
  },
  {
    label: "sticky",
    variable: "--z-sticky",
    value: 30,
    description: "Sticky headers, floating content",
  },
  {
    label: "popover",
    variable: "--z-popover",
    value: 40,
    description: "Dropdowns, tooltips, popovers",
  },
  {
    label: "modal",
    variable: "--z-modal",
    value: 50,
    description: "Modals, dialogs, drawers",
  },
  {
    label: "toast",
    variable: "--z-toast",
    value: 60,
    description: "Toasts, notifications (always on top)",
  },
];

export const Scale: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {layers.map((layer) => (
        <div
          key={layer.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "var(--muted-foreground)",
              width: 30,
              textAlign: "right",
              flexShrink: 0,
            }}
          >
            {layer.value}
          </span>
          <div
            style={{
              width: Math.max(40, layer.value * 4 + 40),
              height: 40,
              borderRadius: 6,
              backgroundColor: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--primary-foreground)",
              }}
            >
              {layer.label}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              z-{layer.label}
            </span>
            <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>
              {layer.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Stacked: Story = {
  render: () => (
    <div
      style={{
        position: "relative",
        height: 300,
        width: "100%",
        backgroundColor: "var(--background)",
        borderRadius: 8,
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {layers.map((layer, i) => (
        <div
          key={layer.label}
          style={{
            position: "absolute",
            left: i * 40,
            top: i * 30,
            width: 200,
            height: 80,
            borderRadius: 8,
            backgroundColor: "var(--primary)",
            opacity: 0.7 + i * 0.05,
            zIndex: `var(${layer.variable})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--primary-foreground)",
            }}
          >
            {layer.label}
          </span>
          <span
            style={{
              fontSize: 10,
              color: "var(--primary-foreground)",
              opacity: 0.7,
            }}
          >
            {layer.value}
          </span>
        </div>
      ))}
    </div>
  ),
};
