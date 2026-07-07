"use client";

import Matter from "matter-js";
import * as React from "react";

type Vec2 = { x: number; y: number };

type RegisteredBody = {
  element: HTMLElement;
  body: Matter.Body;
  isDraggable: boolean;
};

type GravityContextValue = {
  register: (
    id: string,
    element: HTMLElement,
    config: {
      x: number | string;
      y: number | string;
      angle: number;
      bodyType: "rectangle" | "circle";
      isDraggable: boolean;
      options?: Matter.IChamferableBodyDefinition;
    },
  ) => void;
  unregister: (id: string) => void;
  reduced: boolean;
};

const GravityContext = React.createContext<GravityContextValue | null>(null);

export type GravityProps = React.HTMLAttributes<HTMLDivElement> & {
  /** World gravity vector. `y: 1` falls down; `{ x: 0, y: 0 }` floats. */
  gravity?: Vec2;
  /** Start the simulation immediately (default) or wait for the API. */
  autoStart?: boolean;
  /** Close the top so flung bodies can't escape upward. */
  addTopWall?: boolean;
  /** Bounciness of the walls and bodies, 0–1. */
  restitution?: number;
};

/** Resolve a percentage/px position string against a container dimension. */
function resolve(value: number | string, size: number): number {
  if (typeof value === "number") return value;
  if (value.endsWith("%")) return (parseFloat(value) / 100) * size;
  return parseFloat(value);
}

const Gravity = React.forwardRef<HTMLDivElement, GravityProps>(
  (
    {
      gravity = { x: 0, y: 1 },
      autoStart = true,
      addTopWall = true,
      restitution = 0.4,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const reduced = useReducedMotionSafe();
    const canvasRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => canvasRef.current as HTMLDivElement,
    );

    // Create the engine at render, not in an effect: child `MatterBody` effects
    // run before the parent's effect, so the engine must already exist when they
    // register their bodies.
    const [engine] = React.useState(() => Matter.Engine.create());
    const bodiesRef = React.useRef(new Map<string, RegisteredBody>());
    const wallsRef = React.useRef<Matter.Body[]>([]);

    // Keep gravity in sync without rebuilding the world (which would drop the
    // bodies the children registered).
    React.useEffect(() => {
      engine.gravity.x = gravity.x;
      engine.gravity.y = gravity.y;
    }, [engine, gravity.x, gravity.y]);

    // Walls, mouse dragging, runner, and the DOM sync loop.
    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || reduced) return;

      let width = canvas.getBoundingClientRect().width;
      let height = canvas.getBoundingClientRect().height;

      const buildWalls = () => {
        Matter.World.remove(engine.world, wallsRef.current);
        const t = 200; // thick walls keep fast bodies contained
        const opts: Matter.IChamferableBodyDefinition = {
          isStatic: true,
          restitution,
        };
        const walls = [
          Matter.Bodies.rectangle(
            width / 2,
            height + t / 2,
            width + t * 2,
            t,
            opts,
          ),
          Matter.Bodies.rectangle(-t / 2, height / 2, t, height + t * 2, opts),
          Matter.Bodies.rectangle(
            width + t / 2,
            height / 2,
            t,
            height + t * 2,
            opts,
          ),
        ];
        if (addTopWall) {
          walls.push(
            Matter.Bodies.rectangle(width / 2, -t / 2, width + t * 2, t, opts),
          );
        }
        wallsRef.current = walls;
        Matter.World.add(engine.world, walls);
      };
      buildWalls();

      const mouse = Matter.Mouse.create(canvas);
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      // Only draggable bodies respond to the pointer.
      Matter.Events.on(mouseConstraint, "startdrag", (e) => {
        const dragged = [...bodiesRef.current.values()].find(
          (b) => b.body === (e as unknown as { body: Matter.Body }).body,
        );
        if (dragged && !dragged.isDraggable) {
          mouseConstraint.constraint.bodyB = null;
        }
      });
      Matter.World.add(engine.world, mouseConstraint);

      const runner = Matter.Runner.create();
      if (autoStart) Matter.Runner.run(runner, engine);

      // Sync DOM transforms to body positions every frame.
      let frame = 0;
      const sync = () => {
        for (const { element, body } of bodiesRef.current.values()) {
          const w = element.offsetWidth;
          const h = element.offsetHeight;
          element.style.transform = `translate(${body.position.x - w / 2}px, ${
            body.position.y - h / 2
          }px) rotate(${body.angle}rad)`;
        }
        frame = requestAnimationFrame(sync);
      };
      frame = requestAnimationFrame(sync);

      const ro = new ResizeObserver(() => {
        const r = canvas.getBoundingClientRect();
        width = r.width;
        height = r.height;
        buildWalls();
      });
      ro.observe(canvas);

      return () => {
        cancelAnimationFrame(frame);
        ro.disconnect();
        Matter.Runner.stop(runner);
        Matter.World.remove(engine.world, mouseConstraint);
        Matter.World.remove(engine.world, wallsRef.current);
        wallsRef.current = [];
      };
    }, [engine, autoStart, addTopWall, restitution, reduced]);

    const register = React.useCallback<GravityContextValue["register"]>(
      (id, element, config) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const w = element.offsetWidth;
        const h = element.offsetHeight;
        const x = resolve(config.x, rect.width);
        const y = resolve(config.y, rect.height);
        const options: Matter.IChamferableBodyDefinition = {
          restitution,
          friction: 0.4,
          angle: (config.angle * Math.PI) / 180,
          ...config.options,
        };
        const body =
          config.bodyType === "circle"
            ? Matter.Bodies.circle(x, y, Math.max(w, h) / 2, options)
            : Matter.Bodies.rectangle(x, y, w, h, {
                ...options,
                chamfer: { radius: Math.min(w, h) * 0.1 },
              });
        Matter.World.add(engine.world, body);
        bodiesRef.current.set(id, {
          element,
          body,
          isDraggable: config.isDraggable,
        });
      },
      [engine, restitution],
    );

    const unregister = React.useCallback<GravityContextValue["unregister"]>(
      (id) => {
        const entry = bodiesRef.current.get(id);
        if (entry) Matter.World.remove(engine.world, entry.body);
        bodiesRef.current.delete(id);
      },
      [engine],
    );

    const value = React.useMemo<GravityContextValue>(
      () => ({ register, unregister, reduced }),
      [register, unregister, reduced],
    );

    return (
      <GravityContext.Provider value={value}>
        <div
          ref={canvasRef}
          data-slot="gravity"
          className={`relative overflow-hidden [touch-action:none] ${className ?? ""}`}
          {...props}
        >
          {children}
        </div>
      </GravityContext.Provider>
    );
  },
);
Gravity.displayName = "Gravity";

export type MatterBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Initial x, as `%` of the container, a px number, or px string. */
  x?: number | string;
  /** Initial y, as `%` of the container, a px number, or px string. */
  y?: number | string;
  /** Initial rotation in degrees. */
  angle?: number;
  /** Collision shape. Circles use the element's larger dimension as diameter. */
  bodyType?: "rectangle" | "circle";
  /** Whether the pointer can grab and fling this body. */
  isDraggable?: boolean;
  /** Escape hatch for raw Matter body options (mass, restitution, …). */
  matterBodyOptions?: Matter.IChamferableBodyDefinition;
};

const MatterBody = React.forwardRef<HTMLDivElement, MatterBodyProps>(
  (
    {
      x = "50%",
      y = "0%",
      angle = 0,
      bodyType = "rectangle",
      isDraggable = true,
      matterBodyOptions,
      className,
      style,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const ctx = React.useContext(GravityContext);
    const id = React.useId();
    const localRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => localRef.current as HTMLDivElement,
    );

    React.useEffect(() => {
      const element = localRef.current;
      if (!ctx || !element || ctx.reduced) return;
      ctx.register(id, element, {
        x,
        y,
        angle,
        bodyType,
        isDraggable,
        options: matterBodyOptions,
      });
      return () => ctx.unregister(id);
      // Config is captured on mount; changing it remounts the body.
    }, [ctx, id, x, y, angle, bodyType, isDraggable, matterBodyOptions]);

    // Reduced motion / no context: lay the body out statically at its origin.
    const staticPlacement =
      !ctx || ctx.reduced
        ? {
            left: typeof x === "number" ? `${x}px` : x,
            top: typeof y === "number" ? `${y}px` : y,
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          }
        : undefined;

    return (
      <div
        ref={localRef}
        data-slot="matter-body"
        className={`absolute top-0 left-0 will-change-transform select-none ${
          isDraggable ? "cursor-grab active:cursor-grabbing" : ""
        } ${className ?? ""}`}
        style={{ ...staticPlacement, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
MatterBody.displayName = "MatterBody";

// Local reduced-motion hook so the file stays copy-paste self-contained without
// pulling framer-motion just for a media query.
function useReducedMotionSafe() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export { Gravity, MatterBody };
