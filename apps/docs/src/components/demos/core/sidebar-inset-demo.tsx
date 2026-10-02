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
import {
  BookOpenIcon,
  BotIcon,
  ChevronRightIcon,
  FrameIcon,
  GalleryVerticalEndIcon,
  MapIcon,
  PieChartIcon,
  Settings2Icon,
  SquareTerminalIcon,
} from "lucide-react";

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

export function SidebarInsetDemo() {
  return (
    // The preview keeps the sidebar inside this frame (relative and the frame
    // classes here, absolute h-full on <Sidebar>). In an app, drop them.
    <SidebarProvider className="relative h-[36rem] min-h-0 overflow-hidden rounded-xl border">
      <Sidebar className="absolute h-full" variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Acme Inc">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEndIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
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
                            <SidebarMenuSubButton href="#">
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
                  ) : null}
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
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <span className="text-sm text-muted-foreground">
            Building Your App
          </span>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm">Data Fetching</span>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="flex-1 rounded-xl bg-muted/50" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
