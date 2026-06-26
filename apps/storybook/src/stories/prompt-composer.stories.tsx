import { PromptComposer } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = {
  title: "AI/PromptComposer",
  component: PromptComposer,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof PromptComposer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="mx-auto max-w-xl">
      <PromptComposer {...args} />
    </div>
  ),
  args: { placeholder: "Ask GodUI anything…" },
};

export const WithModelPicker: Story = {
  render: (args) => (
    <div className="mx-auto max-w-xl">
      <PromptComposer
        {...args}
        models={["Opus 4.8", "Sonnet 4.6", "Haiku 4.5"]}
      />
    </div>
  ),
};

export const Streaming: Story = {
  render: () => {
    function Demo() {
      const [streaming, setStreaming] = useState(false);
      return (
        <div className="mx-auto max-w-xl">
          <PromptComposer
            isStreaming={streaming}
            onSend={() => setStreaming(true)}
            onStop={() => setStreaming(false)}
            placeholder="Type, then send to watch it switch to stop…"
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const Compact: Story = {
  render: (args) => (
    <div className="mx-auto max-w-xl">
      <PromptComposer {...args} variant="compact" />
    </div>
  ),
};

export const Minimal: Story = {
  render: (args) => (
    <div className="mx-auto max-w-xl">
      <PromptComposer {...args} variant="minimal" />
    </div>
  ),
};
