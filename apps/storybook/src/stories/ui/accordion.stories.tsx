import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

// Accordion's props are a single/multiple union, so stories render it directly.
const meta = {
  title: "UI/Accordion",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  {
    value: "item-1",
    title: "Product Information",
    body: "Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it offers unparalleled performance and reliability.",
  },
  {
    value: "item-2",
    title: "Shipping Details",
    body: "We offer worldwide shipping through trusted courier partners. Standard delivery takes 3-5 business days, while express shipping ensures delivery within 1-2 business days.",
  },
  {
    value: "item-3",
    title: "Return Policy",
    body: "We stand behind our products with a comprehensive 30-day return policy. If you're not completely satisfied, simply return the item in its original condition.",
  },
];

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96 text-foreground">
      {ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-96 text-foreground">
      {ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
