import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BookOpenIcon,
  BotIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  FrameIcon,
  GalleryVerticalEndIcon,
  MapIcon,
  MoreHorizontalIcon,
  PieChartIcon,
  Settings2Icon,
  SquareTerminalIcon,
} from "lucide-react";
import type { ComponentProps } from "react";

const meta = {
  title: "UI/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const platform = [
  {
    title: "Playground",
    icon: SquareTerminalIcon,
    isActive: true,
    items: ["History", "Starred", "Settings"],
  },
  { title: "Models", icon: BotIcon, items: ["Genesis", "Explorer", "Quantum"] },
  {
    title: "Documentation",
    icon: BookOpenIcon,
    items: ["Introduction", "Get Started", "Tutorials"],
  },
  { title: "Settings", icon: Settings2Icon, items: ["General", "Team"] },
];

const projects = [
  { name: "Design Engineering", icon: FrameIcon, badge: "12" },
  { name: "Sales & Marketing", icon: PieChartIcon, badge: "3" },
  { name: "Travel", icon: MapIcon },
];

function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Acme Inc">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEndIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {platform.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={item.isActive}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                      <ChevronRightIcon className="ml-auto transition-[transform] duration-(--godui-duration-base) ease-spring-smooth group-data-[state=open]/collapsible:[transform:rotate(90deg)]" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((sub) => (
                        <SidebarMenuSubItem key={sub}>
                          <SidebarMenuSubButton href={`#${sub}`}>
                            <span>{sub}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {projects.map((project) => (
              <SidebarMenuItem key={project.name}>
                <SidebarMenuButton tooltip={project.name}>
                  <project.icon />
                  <span>{project.name}</span>
                </SidebarMenuButton>
                {project.badge ? (
                  <SidebarMenuBadge>{project.badge}</SidebarMenuBadge>
                ) : (
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontalIcon />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="shadcn">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-xs font-medium">
                CN
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">shadcn</span>
                <span className="truncate text-xs">m@example.com</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function Page() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <span className="text-sm text-muted-foreground">Building Your App</span>
        <span className="text-sm">/</span>
        <span className="text-sm">Data Fetching</span>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50" />
      </div>
    </SidebarInset>
  );
}

export const Offcanvas: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar />
      <Page />
    </SidebarProvider>
  ),
};

export const Icon: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar collapsible="icon" />
      <Page />
    </SidebarProvider>
  ),
};

export const Floating: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar variant="floating" collapsible="icon" />
      <Page />
    </SidebarProvider>
  ),
};

export const Inset: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar variant="inset" collapsible="icon" />
      <Page />
    </SidebarProvider>
  ),
};

export const Right: Story = {
  render: () => (
    <SidebarProvider>
      <Page />
      <AppSidebar side="right" collapsible="icon" />
    </SidebarProvider>
  ),
};

/**
 * shadcn's sidebar-10 / sidebar-15 pass `className="border-r-0"`. It lands on
 * the container, as in shadcn, where the variant's `group-data-[side=left]:border-r`
 * out-specifies it — so the line stays, exactly as it does in shadcn. The
 * surface paints the container's border, whatever it computes to.
 */
export const BorderOverride: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar collapsible="icon" className="border-r-0" />
      <Page />
    </SidebarProvider>
  ),
};

/** An override that wins (`!`): no line, at rest or while the edge slides. */
export const NoBorder: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar collapsible="icon" className="border-r-0!" />
      <Page />
    </SidebarProvider>
  ),
};

/**
 * A call-site `border` (all four sides) on the container: shadcn paints each
 * on the box edge. The surface covers the container's border box, so the top,
 * bottom and left lines land there too, at rest and while the edge slides.
 */
export const BorderAll: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar collapsible="icon" className="border" />
      <Page />
    </SidebarProvider>
  ),
};

export const BorderAllRight: Story = {
  render: () => (
    <SidebarProvider>
      <Page />
      <AppSidebar side="right" collapsible="icon" className="border" />
    </SidebarProvider>
  ),
};

export const BorderAllOffcanvas: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar className="border-2" />
      <Page />
    </SidebarProvider>
  ),
};

export const BorderAllInset: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar variant="inset" collapsible="icon" className="border" />
      <Page />
    </SidebarProvider>
  ),
};
