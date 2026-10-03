"use client";

import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type HeroParallaxItem = {
  title: string;
  thumbnail: string;
  href?: string;
};

export type HeroParallaxProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Cards to scatter across the parallax rows (best with ~15). */
  products: HeroParallaxItem[];
  /** Replaces the default headline block. */
  header?: React.ReactNode;
  /**
   * Scrollport for measuring progress. Defaults to the viewport — pass a
   * ref to an overflow container when embedding the hero in a framed demo.
   */
  scrollContainer?: React.RefObject<HTMLElement | null>;
};

// SPRING.smooth — surfaces / shared-layout feel.
const SPRING = { stiffness: 320, damping: 32, mass: 0.9 } as const;

function ProductCard({
  product,
  translate,
}: {
  product: HeroParallaxItem;
  translate: MotionValue<number>;
}) {
  const Wrapper = product.href ? motion.a : motion.div;
  return (
    <Wrapper
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      transition={SPRING}
      href={product.href}
      className="group/card relative h-64 w-[26rem] shrink-0"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        draggable={false}
        className="absolute inset-0 size-full rounded-xl object-cover shadow-lg [outline:1px_solid_color-mix(in_oklch,var(--border)_60%,transparent)] [outline-offset:-1px]"
      />
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/50 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
      <h3 className="absolute bottom-4 left-4 text-white opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
        {product.title}
      </h3>
    </Wrapper>
  );
}

const HeroParallax = React.forwardRef<HTMLDivElement, HeroParallaxProps>(
  ({ products, header, className, scrollContainer, ...props }, ref) => {
    const reduce = useReducedMotion();
    const containerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );

    const firstRow = products.slice(0, 5);
    const secondRow = products.slice(5, 10);
    const thirdRow = products.slice(10, 15);

    const { scrollYProgress } = useScroll({
      target: containerRef,
      container: scrollContainer,
      offset: ["start start", "end start"],
    });

    const translateX = useSpring(
      useTransform(scrollYProgress, [0, 1], [0, 1000]),
      SPRING,
    );
    const translateXReverse = useSpring(
      useTransform(scrollYProgress, [0, 1], [0, -1000]),
      SPRING,
    );
    const rotateX = useSpring(
      useTransform(scrollYProgress, [0, 0.2], [15, 0]),
      SPRING,
    );
    const opacity = useSpring(
      useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
      SPRING,
    );
    const rotateZ = useSpring(
      useTransform(scrollYProgress, [0, 0.2], [20, 0]),
      SPRING,
    );
    const translateY = useSpring(
      useTransform(scrollYProgress, [0, 0.2], [-700, 200]),
      SPRING,
    );

    const defaultHeader = (
      <div className="relative top-0 left-0 mx-auto w-full max-w-7xl px-4 py-20 md:py-40">
        <h2 className="text-2xl font-bold text-foreground md:text-7xl">
          The ultimate <br /> showcase reel
        </h2>
        <p className="mt-8 max-w-2xl text-base text-muted-foreground md:text-xl">
          Scroll to send the grid drifting on a perspective plane. Drop in your
          own work and let the motion do the talking.
        </p>
      </div>
    );

    // Reduced motion: a calm static grid, no scroll-driven transforms.
    if (reduce) {
      return (
        <div
          ref={containerRef}
          data-slot="hero-parallax"
          className={`py-10 ${className ?? ""}`}
          {...props}
        >
          {header ?? defaultHeader}
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-3">
            {products.slice(0, 9).map((product) => (
              <div key={product.title} className="relative h-64 w-full">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="size-full rounded-xl object-cover shadow-lg"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        data-slot="hero-parallax"
        className={`relative flex h-[300vh] flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] ${className ?? ""}`}
        {...props}
      >
        {header ?? defaultHeader}
        <motion.div
          style={{ rotateX, rotateZ, translateY, opacity }}
          className="[transform-style:preserve-3d]"
        >
          <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
            {firstRow.map((product) => (
              <ProductCard
                key={product.title}
                product={product}
                translate={translateX}
              />
            ))}
          </motion.div>
          <motion.div className="mb-20 flex flex-row space-x-20">
            {secondRow.map((product) => (
              <ProductCard
                key={product.title}
                product={product}
                translate={translateXReverse}
              />
            ))}
          </motion.div>
          <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
            {thirdRow.map((product) => (
              <ProductCard
                key={product.title}
                product={product}
                translate={translateX}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  },
);
HeroParallax.displayName = "HeroParallax";

export { HeroParallax };
