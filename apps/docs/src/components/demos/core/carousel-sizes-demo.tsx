import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@godui/components";

export function CarouselSizesDemo() {
  return (
    <div className="w-full max-w-lg px-12">
      <Carousel opts={{ align: "start" }} className="mx-auto w-full max-w-sm">
        <CarouselContent>
          {[1, 2, 3, 4, 5].map((n) => (
            <CarouselItem key={n} className="basis-1/3">
              <div className="p-1">
                <div className="flex aspect-square items-center justify-center rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
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
