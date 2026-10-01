import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@godui/components";

export function CarouselDemo() {
  return (
    <div className="w-full max-w-md px-12">
      <Carousel className="mx-auto w-full max-w-xs">
        <CarouselContent>
          {[1, 2, 3, 4, 5].map((n) => (
            <CarouselItem key={n}>
              <div className="p-1">
                <div className="flex aspect-square items-center justify-center rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                  <span className="text-4xl font-semibold">{n}</span>
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
