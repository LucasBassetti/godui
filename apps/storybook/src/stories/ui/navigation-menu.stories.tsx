import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

const meta = {
  title: "UI/Navigation Menu",
  component: NavigationMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const frame = "flex min-h-[32rem] items-start justify-center pt-10";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "#alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "#hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "#progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "#scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "#tabs",
    description:
      "A set of layered sections of content (known as tab panels) that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "#tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

function ListItem({
  title,
  children,
  href,
}: {
  title: string;
  children: ReactNode;
  href: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

function NavigationMenuDemo({
  indicator,
  ...props
}: ComponentProps<typeof NavigationMenu> & { indicator?: boolean }) {
  // Radix offsets the indicator by the trigger's offsetLeft, which is 0 inside
  // shadcn's `relative` items; `static` items let it slide (viewport mode only).
  const item = indicator ? "static" : undefined;
  return (
    <div className={frame}>
      <NavigationMenu {...props}>
        <NavigationMenuList>
          <NavigationMenuItem className={item}>
            <NavigationMenuTrigger>Home</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-4 no-underline outline-hidden select-none focus:shadow-md md:p-6"
                      href="#home"
                    >
                      <div className="mb-2 text-lg font-medium sm:mt-4">
                        shadcn/ui
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Beautifully designed components built with Tailwind CSS.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="#introduction" title="Introduction">
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href="#installation" title="Installation">
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href="#typography" title="Typography">
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className={item}>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className={item}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a href="#docs">Docs</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className={item}>
            <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <a href="#backlog" className="flex-row items-center gap-2">
                      <CircleHelpIcon />
                      Backlog
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a href="#todo" className="flex-row items-center gap-2">
                      <CircleIcon />
                      To Do
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a href="#done" className="flex-row items-center gap-2">
                      <CircleCheckIcon />
                      Done
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {indicator ? <NavigationMenuIndicator /> : null}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <NavigationMenuDemo {...args} />,
};

export const WithoutViewport: Story = {
  render: (args) => <NavigationMenuDemo {...args} viewport={false} />,
};

export const WithIndicator: Story = {
  render: (args) => <NavigationMenuDemo {...args} indicator />,
};
