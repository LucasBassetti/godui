import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Theme/Colors",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

interface SwatchProps {
  token: string;
  label: string;
}

function Swatch({ token, label }: SwatchProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 8,
          backgroundColor: `var(--${token})`,
          border: "1px solid var(--border)",
        }}
      />
      <span
        style={{ fontSize: 11, fontWeight: 600, color: "var(--foreground)" }}
      >
        {label}
      </span>
      <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>
        --{token}
      </span>
    </div>
  );
}

interface SwatchGroupProps {
  title: string;
  tokens: { token: string; label: string }[];
}

function SwatchGroup({ title, tokens }: SwatchGroupProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 12,
          color: "var(--foreground)",
        }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {tokens.map((t) => (
          <Swatch key={t.token} {...t} />
        ))}
      </div>
    </div>
  );
}

const coreTokens = [
  { token: "background", label: "Background" },
  { token: "foreground", label: "Foreground" },
  { token: "card", label: "Card" },
  { token: "card-foreground", label: "Card FG" },
  { token: "popover", label: "Popover" },
  { token: "popover-foreground", label: "Popover FG" },
];

const semanticTokens = [
  { token: "primary", label: "Primary" },
  { token: "primary-foreground", label: "Primary FG" },
  { token: "secondary", label: "Secondary" },
  { token: "secondary-foreground", label: "Secondary FG" },
  { token: "muted", label: "Muted" },
  { token: "muted-foreground", label: "Muted FG" },
  { token: "accent", label: "Accent" },
  { token: "accent-foreground", label: "Accent FG" },
  { token: "destructive", label: "Destructive" },
];

const borderTokens = [
  { token: "border", label: "Border" },
  { token: "input", label: "Input" },
  { token: "ring", label: "Ring" },
];

const chartTokens = [
  { token: "chart-1", label: "Chart 1" },
  { token: "chart-2", label: "Chart 2" },
  { token: "chart-3", label: "Chart 3" },
  { token: "chart-4", label: "Chart 4" },
  { token: "chart-5", label: "Chart 5" },
];

const sidebarTokens = [
  { token: "sidebar", label: "Sidebar" },
  { token: "sidebar-foreground", label: "Sidebar FG" },
  { token: "sidebar-primary", label: "Sidebar Primary" },
  { token: "sidebar-primary-foreground", label: "Sidebar Primary FG" },
  { token: "sidebar-accent", label: "Sidebar Accent" },
  { token: "sidebar-accent-foreground", label: "Sidebar Accent FG" },
  { token: "sidebar-border", label: "Sidebar Border" },
  { token: "sidebar-ring", label: "Sidebar Ring" },
];

export const AllColors: Story = {
  render: () => (
    <div>
      <SwatchGroup title="Core" tokens={coreTokens} />
      <SwatchGroup title="Semantic" tokens={semanticTokens} />
      <SwatchGroup title="Border & Input" tokens={borderTokens} />
      <SwatchGroup title="Chart" tokens={chartTokens} />
      <SwatchGroup title="Sidebar" tokens={sidebarTokens} />
    </div>
  ),
};
