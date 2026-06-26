import { PromptComposer } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  action,
  hidden,
  range,
  select,
  text,
  toggle,
} from "../playground/argtypes";
import { padded } from "../playground/stage";

const meta = {
  title: "AI/PromptComposer",
  component: PromptComposer,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [padded(576)],
  argTypes: {
    variant: select(["comfortable", "compact", "minimal"], "Appearance"),
    placeholder: text("Content"),
    maxRows: range(1, 16, 1, "Behavior"),
    isStreaming: toggle("State"),
    disabled: toggle("State"),
    models: hidden(),
    attachments: hidden(),
    value: hidden(),
    onSend: action("send"),
    onStop: action("stop"),
    onValueChange: action("valueChange"),
    onModelChange: action("modelChange"),
  },
  args: {
    variant: "comfortable",
    placeholder: "Ask GodUI anything…",
    maxRows: 8,
    isStreaming: false,
    disabled: false,
    models: ["Opus 4.8", "Sonnet 4.6", "Haiku 4.5"],
    model: "Opus 4.8",
    onSend: fn(),
    onStop: fn(),
    onValueChange: fn(),
    onModelChange: fn(),
  },
} satisfies Meta<typeof PromptComposer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
