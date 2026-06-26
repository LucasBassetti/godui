import { AgentStep, AgentTimeline } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "AI/AgentTimeline",
  component: AgentTimeline,
  subcomponents: { AgentStep },
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof AgentTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  render: (args) => (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-4">
      <AgentTimeline {...args}>
        <AgentStep status="success" title="Read the repository" meta="0.4s">
          Indexed 128 files across 6 packages.
        </AgentStep>
        <AgentStep status="success" title="Search for the bug" meta="1.1s">
          <pre className="whitespace-pre-wrap font-mono">
            {'grep "useEffect" src/**/*.tsx → 42 matches'}
          </pre>
        </AgentStep>
        <AgentStep
          status="running"
          title="Editing auth-middleware.ts"
          defaultOpen
        >
          Replacing the token expiry check `&lt;` with `&lt;=`.
        </AgentStep>
        <AgentStep status="pending" title="Run the test suite" last />
      </AgentTimeline>
    </div>
  ),
};

export const ReasoningOnly: Story = {
  render: () => (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-4">
      <AgentTimeline>
        <AgentStep status="success" title="Thinking" defaultOpen last>
          The user wants the div centered. The cleanest 2026 approach is a CSS
          grid parent with `place-items-center` — one declaration, no flex
          alignment juggling. I'll show that.
        </AgentStep>
      </AgentTimeline>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-4">
      <AgentTimeline>
        <AgentStep status="success" title="Install dependencies" meta="3.2s" />
        <AgentStep
          status="error"
          title="Build failed"
          meta="1.8s"
          defaultOpen
          last
        >
          <pre className="whitespace-pre-wrap font-mono text-destructive">
            error TS2304: Cannot find name 'PromptComposer'.
          </pre>
        </AgentStep>
      </AgentTimeline>
    </div>
  ),
};
