import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from "@godui/components";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SectionHeading } from "./section-heading";

function Tile({
  name,
  slug,
  className,
  children,
}: {
  name: string;
  slug: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border border-fd-border bg-fd-card ${className ?? ""}`}
    >
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="font-medium text-fd-foreground text-sm">{name}</span>
        <Link
          href={`/docs/components/${slug}`}
          aria-label={`${name} docs`}
          className="text-fd-muted-foreground hover:text-fd-foreground"
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
      <div className="flex min-h-48 flex-1 items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}

/**
 * Live GodUI components on the landing page — the real shadcn/ui drop-ins,
 * not screenshots. Each tile links to its docs page.
 */
export function ComponentsShowcase() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Components"
        title="shadcn/ui, animated"
        description="Every component is a drop-in for the shadcn/ui file you already have. Same API, new motion — all of it on the GPU. Try them."
      />
      <div className="mt-14 grid gap-4 md:grid-cols-6">
        <Tile name="Tabs" slug="tabs" className="md:col-span-3">
          <Tabs defaultValue="account" className="w-full max-w-sm">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            <TabsContent
              value="account"
              className="rounded-lg border p-4 text-sm"
            >
              Make changes to your account here.
            </TabsContent>
            <TabsContent
              value="password"
              className="rounded-lg border p-4 text-sm"
            >
              Change your password here.
            </TabsContent>
            <TabsContent value="team" className="rounded-lg border p-4 text-sm">
              Invite people to your workspace.
            </TabsContent>
          </Tabs>
        </Tile>
        <Tile name="Switch & Checkbox" slug="switch" className="md:col-span-3">
          <div className="flex w-full max-w-xs flex-col gap-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="home-email">Email notifications</label>
              <Switch id="home-email" defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="home-digest">Weekly digest</label>
              <Switch id="home-digest" />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="home-terms" />
              <label htmlFor="home-terms">Accept terms and conditions</label>
            </div>
          </div>
        </Tile>
        <Tile name="Accordion" slug="accordion" className="md:col-span-2">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="a">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It follows the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes — heights snap and the items below glide on the GPU.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="c">
              <AccordionTrigger>Is it a drop-in?</AccordionTrigger>
              <AccordionContent>
                Same file and props as shadcn/ui.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Tile>
        <Tile
          name="Toggle Group & Slider"
          slug="toggle-group"
          className="md:col-span-2"
        >
          <div className="flex w-full flex-col items-center gap-8">
            <ToggleGroup
              type="single"
              variant="outline"
              defaultValue="left"
              aria-label="Alignment"
            >
              <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>
            <Slider defaultValue={[60]} max={100} aria-label="Volume" />
          </div>
        </Tile>
        <Tile
          name="Dropdown Menu"
          slug="dropdown-menu"
          className="md:col-span-2"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Options <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Tile>
        <Tile name="Input OTP" slug="input-otp" className="md:col-span-6">
          <InputOTP maxLength={6} aria-label="One-time password">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </Tile>
      </div>
      <div className="mt-10 flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/docs/components">
            Browse all components <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
