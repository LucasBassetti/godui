import {
  CompactMultiButton,
  MultiButton,
  type MultiButtonItem,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { fn } from "storybook/test";
import { hidden, select, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-1/2"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const EyeIcon = () => (
  <Icon>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.5" />
  </Icon>
);
const PencilIcon = () => (
  <Icon>
    <path d="m4 16 9.5-9.5 4 4L8 20H4v-4Z" />
    <path d="m13 7 2-2 4 4-2 2" />
  </Icon>
);
const DownloadIcon = () => (
  <Icon>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
  </Icon>
);
const ShareIcon = () => (
  <Icon>
    <circle cx="18" cy="5" r="2" />
    <circle cx="6" cy="12" r="2" />
    <circle cx="18" cy="19" r="2" />
    <path d="m8 11 8-5m-8 7 8 5" />
  </Icon>
);
const EllipsisVerticalIcon = () => (
  <Icon>
    <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
  </Icon>
);

const items: MultiButtonItem[] = [
  { id: "view", icon: EyeIcon, label: "View", onClick: fn() },
  { id: "edit", icon: PencilIcon, label: "Edit", onClick: fn() },
  { id: "download", icon: DownloadIcon, label: "Download", onClick: fn() },
  { id: "share", icon: ShareIcon, label: "Share", onClick: fn() },
];

const disabledItems: MultiButtonItem[] = items.map((item) =>
  item.id === "download" ? { ...item, disabled: true } : item,
);

const meta = {
  title: "Buttons/Multi Button",
  component: MultiButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    items: hidden(),
    syncWidthTo: hidden(),
    variant: select(["default", "outline", "secondary", "ghost"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    highlightColor: text("Appearance"),
    gooey: toggle("Behavior"),
  },
  args: {
    items,
    variant: "default",
    size: "md",
  },
} satisfies Meta<typeof MultiButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Original: Story = {};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Medium: Story = {
  args: { size: "md" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Highlighted: Story = {
  args: {
    highlightColor: "var(--primary)",
    variant: "outline",
  },
};

export const Gooey: Story = {
  args: {
    gooey: true,
    highlightColor: "var(--primary)",
  },
};

export const CompactOriginal: Story = {
  name: "Compact — Original",
  render: () => (
    <CompactMultiButton
      items={items}
      selectedId="download"
      restIcon={EllipsisVerticalIcon}
      restAriaLabel="Open actions"
      highlightColor="var(--primary)"
      iconOnly={false}
    />
  ),
};

export const CompactGooey: Story = {
  name: "Compact — Gooey",
  render: () => (
    <CompactMultiButton
      items={items}
      selectedId="download"
      highlightColor="var(--primary)"
      iconOnly={false}
      gooey
    />
  ),
};

export const Disabled: Story = {
  args: {
    items: disabledItems,
    variant: "outline",
  },
};
