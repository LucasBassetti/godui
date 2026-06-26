import { Dock, DockItem } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { range } from "../playground/argtypes";

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

const items: { label: string; color: string; icon: ReactNode }[] = [
  {
    label: "Home",
    color: "text-indigo-500",
    icon: (
      <Icon>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 22V12h6v10" />
      </Icon>
    ),
  },
  {
    label: "Search",
    color: "text-emerald-500",
    icon: (
      <Icon>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </Icon>
    ),
  },
  {
    label: "Files",
    color: "text-amber-500",
    icon: (
      <Icon>
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      </Icon>
    ),
  },
  {
    label: "Mail",
    color: "text-sky-500",
    icon: (
      <Icon>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </Icon>
    ),
  },
  {
    label: "Calendar",
    color: "text-rose-500",
    icon: (
      <Icon>
        <path d="M8 2v4M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </Icon>
    ),
  },
  {
    label: "Settings",
    color: "text-zinc-500",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </Icon>
    ),
  },
];

const meta = {
  title: "Navigation/Dock",
  component: Dock,
  subcomponents: { DockItem },
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    baseSize: range(32, 80, 4, "Appearance"),
    magnification: range(48, 128, 4, "Behavior"),
    distance: range(80, 240, 10, "Behavior"),
  },
  args: { baseSize: 48, magnification: 72, distance: 140 },
  render: (args) => (
    <div className="flex h-56 items-end">
      <Dock {...args}>
        {items.map((item) => (
          <DockItem key={item.label} label={item.label}>
            <span
              className={`flex size-full items-center justify-center ${item.color}`}
            >
              {item.icon}
            </span>
          </DockItem>
        ))}
      </Dock>
    </div>
  ),
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
