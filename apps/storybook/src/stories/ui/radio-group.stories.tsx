import { RadioGroup, RadioGroupItem } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta = {
  title: "UI/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" className="text-foreground">
      {OPTIONS.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem value={option.value} id={option.value} />
          <label htmlFor={option.value} className="text-sm">
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroup>
  ),
};

function ControlledGroup() {
  const [value, setValue] = useState("comfortable");
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      className="text-foreground"
    >
      {OPTIONS.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem value={option.value} id={`c-${option.value}`} />
          <label htmlFor={`c-${option.value}`} className="text-sm">
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroup>
  );
}

/** Controlled `value` + `onValueChange`: the selection updates in one commit. */
export const Controlled: Story = { render: () => <ControlledGroup /> };
