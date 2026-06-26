import { AgentStep, AgentTimeline } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { centered } from "../playground/stage";

const meta = {
  title: "AI/AgentTimeline",
  component: AgentTimeline,
  subcomponents: { AgentStep },
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered(448)],
  render: (args) => (
    <div className="w-full rounded-2xl border border-border bg-card p-4">
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
} satisfies Meta<typeof AgentTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
