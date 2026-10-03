import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import { ChevronsUpDown } from "lucide-react";

const meta = {
  title: "UI/Collapsible",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const repo = "rounded-md border px-4 py-2 font-mono text-sm";

function Starred() {
  return (
    <div className="flex w-[350px] flex-col gap-2 text-foreground">
      <Collapsible className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="text-sm font-semibold">
            @peduarte starred 3 repositories
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDown />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className={repo}>@radix-ui/primitives</div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className={repo}>@radix-ui/colors</div>
          <div className={repo}>@stitches/react</div>
        </CollapsibleContent>
      </Collapsible>
      <p className="px-4 pt-2 text-sm text-muted-foreground">
        Content after the collapsible slides into place.
      </p>
      <div className={repo}>Another block below</div>
    </div>
  );
}

export const Default: Story = {
  render: () => <Starred />,
};

/** In a stage that centers it vertically, like a docs preview or a dialog. */
export const Centered: Story = {
  render: () => (
    <div className="flex h-[32rem] w-[28rem] items-center justify-center">
      <Starred />
    </div>
  ),
};

/** A Collapsible inside another one's panel. */
export const Nested: Story = {
  render: () => (
    <div className="flex w-[350px] flex-col gap-2 text-foreground">
      <Collapsible className="flex flex-col gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline">Outer</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className={repo}>Outer: first</div>
          <Collapsible className="flex flex-col gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline">Inner</Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-2">
              <div className={repo}>Inner: first</div>
              <div className={repo}>Inner: second</div>
            </CollapsibleContent>
          </Collapsible>
          <div className={repo}>Outer: last</div>
        </CollapsibleContent>
      </Collapsible>
      <p className="px-4 text-sm text-muted-foreground">After both</p>
    </div>
  ),
};

/**
 * The outer Collapsible alone in a stage that centers it: the stage moves the
 * outer root (its parent FLIPs it back) while the inner one rides along.
 */
export const NestedInStage: Story = {
  render: () => (
    <div className="flex h-[32rem] w-[28rem] items-center justify-center text-foreground">
      <Collapsible defaultOpen className="flex w-[350px] flex-col gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline">Outer</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className={repo}>Outer: first</div>
          <Collapsible className="flex flex-col gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline">Inner</Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-2">
              <div className={repo}>Inner: first</div>
              <div className={repo}>Inner: second</div>
            </CollapsibleContent>
          </Collapsible>
          <div className={repo}>Outer: last</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

/** Loose text in the panel can't hold still while the edge sweeps: it fades. */
export const PlainText: Story = {
  render: () => (
    <div className="flex w-[350px] flex-col gap-2 text-foreground">
      <Collapsible className="flex flex-col gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline">Can I use this in my project?</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 text-sm">
          Yes. Free to use for personal and commercial projects. No attribution
          required.
        </CollapsibleContent>
      </Collapsible>
      <p className="px-4 text-sm text-muted-foreground">After the answer</p>
    </div>
  ),
};

/** Several collapsibles in one parent (FAQ / sidebar pattern). */
export const Siblings: Story = {
  render: () => (
    <div className="flex w-[350px] flex-col gap-2 text-foreground">
      {["A", "B", "C"].map((name) => (
        <Collapsible key={name} className="flex flex-col gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="outline">Section {name}</Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-2">
            <div className={repo}>{name}: first</div>
            <div className={repo}>{name}: second</div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      <p className="px-4 text-sm text-muted-foreground">After all sections</p>
    </div>
  ),
};
