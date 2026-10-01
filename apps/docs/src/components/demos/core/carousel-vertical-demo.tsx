import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@godui/components";

export function CarouselVerticalDemo() {
  return (
    <div className="w-full max-w-xs py-14">
      <Carousel
        opts={{ align: "start" }}
        orientation="vertical"
        className="mx-auto w-full max-w-[12rem]"
      >
        <CarouselContent className="-mt-1 h-[200px]">
          {[1, 2, 3, 4, 5].map((n) => (
            <CarouselItem key={n} className="basis-1/2 pt-1">
              <div className="h-full p-1">
                <div className="flex h-full items-center justify-center rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                  <span className="text-3xl font-semibold">{n}</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
