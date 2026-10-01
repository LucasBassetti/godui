import { Tabs, TabsContent, TabsList, TabsTrigger } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const TABS = [
  { value: "account", label: "Account", body: "Make changes to your account." },
  { value: "password", label: "Password", body: "Change your password." },
  {
    value: "notifications",
    label: "Notifications",
    body: "Choose what you get notified about.",
  },
];

function Demo({
  variant,
  orientation,
}: {
  variant?: "default" | "line";
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <Tabs
      defaultValue="account"
      orientation={orientation}
      className="w-96 text-foreground"
    >
      <TabsList variant={variant}>
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="rounded-lg border p-4 text-sm"
        >
          {tab.body}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export const Default: Story = { render: () => <Demo /> };
export const Line: Story = { render: () => <Demo variant="line" /> };
export const Vertical: Story = {
  render: () => <Demo orientation="vertical" />,
};
