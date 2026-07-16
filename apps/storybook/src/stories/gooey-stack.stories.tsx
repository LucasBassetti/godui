import { GooeyStack, type GooeyStackProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range, toggle } from "../playground/argtypes";

function GitHubMark() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-foreground text-background">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
        aria-hidden="true"
      >
        <title>GitHub</title>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    </span>
  );
}

function ConnectorCard() {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <GitHubMark />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">MCP Connector</p>
        <p className="text-sm font-semibold text-foreground">GitHub</p>
      </div>
      <span className="text-sm font-medium text-muted-foreground">Skip</span>
      <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
        Connect
      </span>
    </div>
  );
}

function PromptCard() {
  return (
    <div className="relative h-36 px-5 py-4">
      <textarea
        aria-label="Ask anything"
        placeholder="Tap the plug to connect a source and watch it merge in…"
        className="h-16 w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <div className="absolute right-4 bottom-4 flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-full border border-border text-muted-foreground">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
          >
            <title>Connect a source</title>
            <path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
          </svg>
        </span>
        <span className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
          >
            <title>Send</title>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
}

const meta = {
  title: "Layout/GooeyStack",
  component: GooeyStack,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    collapsed: toggle("State"),
    gap: range(-60, 20, 1, "State"),
    expandedGap: range(0, 40, 1, "Appearance"),
    collapsedGap: range(-60, 0, 1, "Appearance"),
    gooeyness: range(2, 24, 1, "Appearance"),
    radius: range(8, 40, 1, "Appearance"),
  },
  args: {
    collapsed: false,
    expandedGap: 18,
    collapsedGap: -48,
    gooeyness: 10,
    radius: 28,
  },
  render: (args: GooeyStackProps) => (
    <div className="w-[28rem]">
      <GooeyStack {...args}>
        <ConnectorCard />
        <PromptCard />
      </GooeyStack>
    </div>
  ),
} satisfies Meta<typeof GooeyStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
