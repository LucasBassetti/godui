import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowUpIcon,
  CheckIcon,
  CopyIcon,
  CreditCardIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";

const meta = {
  title: "UI/Input Group",
  component: InputGroup,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-96 max-w-[90vw] text-foreground">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One field: focus it and the ring fades and grows in on a ::before layer. */
export const Default: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
    </InputGroup>
  ),
};

export const Icon: Story = {
  render: (args) => (
    <div className="grid w-full gap-6">
      <InputGroup {...args}>
        <InputGroupInput type="email" placeholder="Enter your email" />
        <InputGroupAddon>
          <MailIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon>
          <CreditCardIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <CheckIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const Button: Story = {
  render: (args) => (
    <div className="grid w-full gap-6">
      <InputGroup {...args}>
        <InputGroupInput placeholder="https://x.com/shadcn" readOnly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Copy" title="Copy" size="icon-xs">
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Type to search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="secondary">Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const Text: Story = {
  render: (args) => (
    <div className="grid w-full gap-6">
      <InputGroup {...args}>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Enter your username" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@company.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const Textarea: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupTextarea placeholder="Ask, Search or Chat..." />
      <InputGroupAddon align="block-end">
        <InputGroupButton
          variant="outline"
          className="rounded-full"
          size="icon-xs"
          aria-label="Attach"
        >
          <PlusIcon />
        </InputGroupButton>
        <InputGroupText className="ml-auto">52% used</InputGroupText>
        <InputGroupButton
          variant="default"
          className="rounded-full"
          size="icon-xs"
          disabled
        >
          <ArrowUpIcon />
          <span className="sr-only">Send</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

/** `aria-invalid` on the control: destructive border; the ring turns destructive on focus. */
export const Invalid: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="example.com" aria-invalid />
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};
