import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

function Slide({ n, className }: { n: number; className?: string }) {
  return (
    <div className="p-1">
      <div
        className={`flex items-center justify-center rounded-xl border bg-card p-6 text-card-foreground shadow-sm ${className ?? "aspect-square"}`}
      >
        <span className="text-4xl font-semibold">{n}</span>
      </div>
    </div>
  );
}

/** shadcn's demo: five square slides, one per view. */
export const Default: Story = {
  render: (args) => (
    <Carousel {...args} className="w-full max-w-xs">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((n) => (
          <CarouselItem key={n}>
            <Slide n={n} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/** `basis-1/3` on the item shows three at a time, as in shadcn's sizes example. */
export const Sizes: Story = {
  render: (args) => (
    <Carousel {...args} className="w-full max-w-sm">
      <CarouselContent className="-ml-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <CarouselItem key={n} className="pl-1 basis-1/3">
            <Slide n={n} className="aspect-square p-4" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/** `orientation="vertical"`: slides stack and the buttons move above and below. */
export const Vertical: Story = {
  render: (args) => (
    <div className="py-14">
      <Carousel
        {...args}
        orientation="vertical"
        opts={{ align: "start" }}
        className="w-full max-w-xs"
      >
        <CarouselContent className="-mt-1 h-[200px]">
          {[1, 2, 3, 4, 5].map((n) => (
            <CarouselItem key={n} className="pt-1 md:basis-1/2">
              <Slide n={n} className="h-full" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};
