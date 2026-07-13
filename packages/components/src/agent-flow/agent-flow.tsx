"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

// GodUI motion language (values mirrored inline — see motion/tokens.ts).
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
// Length-driven flow is linear (constant speed) so the border trace and the
// beams never speed up or settle — see EASE.linear in motion/tokens.ts.
const EASE_LINEAR = [0, 0, 1, 1] as const;
// Crisp pop for the icon chip — SPRING.snappy in motion/tokens.ts.
const SPRING_SNAPPY = { type: "spring", stiffness: 520, damping: 32 } as const;
// Ambient flow speed in px/second (FLOW_SPEED.base). Every length-driven
// element derives its duration as `length / FLOW_SPEED`, so a card border and
// the beam that continues from it move at the exact same pace — one flow.
const FLOW_SPEED = 280;

export type AgentNodeStatus = "idle" | "running" | "done" | "error";

export type AgentFlowNode = {
  id: string;
  /** Primary label shown on the node. */
  label: string;
  /** Secondary label — tool name, model, duration, … */
  sublabel?: string;
  /** Consumer-supplied glyph rendered in the icon chip. */
  icon?: React.ReactNode;
  status?: AgentNodeStatus;
  /** Node **center** in canvas units. */
  x: number;
  y: number;
};

export type AgentFlowEdge = {
  id: string;
  /** Source node id. */
  from: string;
  /** Target node id. */
  to: string;
  /** Animate a data packet along the edge (default `true`). */
  animated?: boolean;
  /**
   * Repeat the packet forever (default `true`). Set `false` to send a single
   * packet — it travels once and fires `onEdgeArrive` when it lands, which lets
   * you sequence the graph (light the next node, start the next edge, …).
   */
  loop?: boolean;
  /** Bow of the curve in pixels (positive bends upward). */
  curvature?: number;
  /**
   * Keep the edge lit after its packet passes (default `false`). The line draws
   * on as the packet travels and then stays lit — the same behaviour as a card's
   * traced border — so a completed path reads as an established connection.
   */
  persist?: boolean;
};

export type AgentFlowProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  nodes: AgentFlowNode[];
  edges: AgentFlowEdge[];
  /** Allow dragging nodes (default `true`). */
  draggable?: boolean;
  /** Allow panning the canvas by dragging the backdrop (default `true`). */
  pannable?: boolean;
  /** Seconds for one packet travel (default `3`). */
  flowDuration?: number;
  /** Center the graph in view on mount (default `true`). */
  fitView?: boolean;
  /**
   * Auto-play the graph as a continuous light: each node traces its border on
   * from the left-edge centre out to both sides, its icon lights, then the beam
   * flows down the outgoing edges to the next node, which traces in turn. Root
   * nodes (no incoming edge) start the sequence. Overrides `node.status` and
   * `edge.animated` while on.
   */
  autoPlay?: boolean;
  /** With `autoPlay`, loop the whole sequence instead of stopping at the leaves. */
  continuous?: boolean;
  /**
   * Speed of the continuous light in **px/second** (default `280`). Every
   * length-driven element — each card's traced border and every beam — runs at
   * this one pace (`duration = length / flowSpeed`), so the light never changes
   * speed at the card→line seam. Bigger cards trace for longer, longer edges
   * flow for longer; the pace stays constant.
   */
  flowSpeed?: number;
  /**
   * Called when a non-looping edge's packet reaches its target node. Use it to
   * sync node status with the flow — e.g. light a node the moment its packet
   * arrives, then start the next edge.
   */
  onEdgeArrive?: (edgeId: string) => void;
  /** Called when a node finishes tracing its border (its icon lights). */
  onNodeActivate?: (nodeId: string) => void;
};

type Point = { x: number; y: number };
type Size = { w: number; h: number };

const FALLBACK_SIZE: Size = { w: 168, h: 64 };

const STATUS_CHIP: Record<AgentNodeStatus, string> = {
  idle: "border-border bg-muted text-muted-foreground",
  running: "border-primary bg-primary/10 text-primary",
  done: "border-primary bg-primary text-primary-foreground",
  error: "border-destructive bg-destructive text-white",
};

const STATUS_CARD: Record<AgentNodeStatus, string> = {
  // The lit border is drawn by the traced SVG outline overlay, so the card's
  // own border stays neutral (otherwise a full primary border would hide the
  // growth). Done keeps a soft ambient glow.
  idle: "border-border",
  running: "border-border",
  done: "border-border shadow-[0_0_16px_-10px_var(--primary)]",
  error: "border-destructive/60",
};

/** Rounded-rect corner radius (matches the card's `rounded-xl` = 12px). */
const CARD_RADIUS = 12;

/**
 * Two symmetric outline paths for a card of size `w`×`h`, both starting at the
 * left-edge centre so the border can trace on in both directions and meet at
 * the right-edge centre — where the outgoing edge begins.
 */
function borderTracePaths(w: number, h: number): [string, string] {
  const r = Math.min(CARD_RADIUS, w / 2, h / 2);
  const top = `M 0,${h / 2} L 0,${r} A ${r},${r} 0 0 1 ${r},0 L ${w - r},0 A ${r},${r} 0 0 1 ${w},${r} L ${w},${h / 2}`;
  const bottom = `M 0,${h / 2} L 0,${h - r} A ${r},${r} 0 0 0 ${r},${h} L ${w - r},${h} A ${r},${r} 0 0 0 ${w},${h - r} L ${w},${h / 2}`;
  return [top, bottom];
}

/**
 * Length of one border-trace outline (left-edge centre → over the top →
 * right-edge centre): two verticals, two quarter-arcs and the top run. Dividing
 * it by `flowSpeed` gives the trace duration, so the border front and the beams
 * that continue from it move at the same px/second — one continuous light.
 */
function borderOutlineLength(w: number, h: number): number {
  const r = Math.min(CARD_RADIUS, w / 2, h / 2);
  return w + h - (4 - Math.PI) * r;
}

// Auto-play sequencer state: nodes currently drawing their border, nodes whose
// border is fully lit, and edges whose packet is in flight.
type SeqState = {
  tracing: Set<string>;
  lit: Set<string>;
  flowing: Set<string>;
};
type SeqAction =
  | { type: "reset"; roots: string[] }
  | { type: "traceDone"; id: string; outEdges: string[] }
  | { type: "arrive"; edgeId: string; target: string };

const EMPTY_SEQ: SeqState = {
  tracing: new Set(),
  lit: new Set(),
  flowing: new Set(),
};

function seqReducer(state: SeqState, action: SeqAction): SeqState {
  switch (action.type) {
    case "reset":
      return {
        tracing: new Set(action.roots),
        lit: new Set(),
        flowing: new Set(),
      };
    case "traceDone": {
      if (state.lit.has(action.id)) return state;
      const tracing = new Set(state.tracing);
      tracing.delete(action.id);
      const lit = new Set(state.lit).add(action.id);
      const flowing = new Set(state.flowing);
      for (const e of action.outEdges) flowing.add(e);
      return { tracing, lit, flowing };
    }
    case "arrive": {
      const flowing = new Set(state.flowing);
      flowing.delete(action.edgeId);
      let tracing = state.tracing;
      if (!state.lit.has(action.target) && !state.tracing.has(action.target)) {
        tracing = new Set(state.tracing).add(action.target);
      }
      return { tracing, lit: state.lit, flowing };
    }
    default:
      return state;
  }
}

const AgentFlow = React.forwardRef<HTMLDivElement, AgentFlowProps>(
  (
    {
      nodes,
      edges,
      draggable = true,
      pannable = true,
      flowDuration = 3,
      fitView = true,
      autoPlay = false,
      continuous = false,
      flowSpeed = FLOW_SPEED,
      onEdgeArrive,
      onNodeActivate,
      className,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const reduce = useReducedMotion();
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const nodeEls = React.useRef(new Map<string, HTMLElement>());

    // Live node centers, seeded from props. Dragging mutates these so edges
    // follow without any DOM measurement of position.
    const [positions, setPositions] = React.useState<Record<string, Point>>(
      () => Object.fromEntries(nodes.map((n) => [n.id, { x: n.x, y: n.y }])),
    );
    const [sizes, setSizes] = React.useState<Record<string, Size>>({});
    const [pan, setPan] = React.useState<Point>({ x: 0, y: 0 });
    const [scale, setScale] = React.useState(1);
    const [fitted, setFitted] = React.useState(false);

    // Keep positions in sync when the node set changes (add/remove/reset).
    React.useEffect(() => {
      setPositions((prev) => {
        const next: Record<string, Point> = {};
        for (const n of nodes) next[n.id] = prev[n.id] ?? { x: n.x, y: n.y };
        return next;
      });
    }, [nodes]);

    const posOf = React.useCallback(
      (id: string): Point => positions[id] ?? { x: 0, y: 0 },
      [positions],
    );
    const sizeOf = React.useCallback(
      (id: string): Size => sizes[id] ?? FALLBACK_SIZE,
      [sizes],
    );

    // Measure node cards so edge anchors sit on their left/right centers.
    const registerNode = React.useCallback(
      (id: string) => (el: HTMLElement | null) => {
        if (el) nodeEls.current.set(id, el);
        else nodeEls.current.delete(id);
      },
      [],
    );

    // Re-subscribe when the node count changes so new cards get observed.
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional re-observe on count change
    React.useEffect(() => {
      const measure = () => {
        setSizes((prev) => {
          let changed = false;
          const next = { ...prev };
          for (const [id, el] of nodeEls.current) {
            const w = el.offsetWidth;
            const h = el.offsetHeight;
            if (!next[id] || next[id].w !== w || next[id].h !== h) {
              next[id] = { w, h };
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      };
      measure();
      const ro = new ResizeObserver(measure);
      for (const el of nodeEls.current.values()) ro.observe(el);
      return () => ro.disconnect();
    }, [nodes.length]);

    // fitView: scale + center the graph's bounding box so the whole graph is
    // visible on mount (never scales up past 1:1).
    React.useEffect(() => {
      if (!fitView || fitted) return;
      const el = containerRef.current;
      if (!el || nodes.length === 0) return;
      if (Object.keys(sizes).length < nodes.length) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      let minX = Number.POSITIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;
      for (const n of nodes) {
        const p = posOf(n.id);
        const s = sizeOf(n.id);
        minX = Math.min(minX, p.x - s.w / 2);
        minY = Math.min(minY, p.y - s.h / 2);
        maxX = Math.max(maxX, p.x + s.w / 2);
        maxY = Math.max(maxY, p.y + s.h / 2);
      }
      const pad = 32;
      const bboxW = Math.max(1, maxX - minX);
      const bboxH = Math.max(1, maxY - minY);
      const s = Math.min(
        1,
        (rect.width - pad) / bboxW,
        (rect.height - pad) / bboxH,
      );
      setScale(s);
      setPan({
        x: rect.width / 2 - (s * (minX + maxX)) / 2,
        y: rect.height / 2 - (s * (minY + maxY)) / 2,
      });
      setFitted(true);
    }, [fitView, fitted, nodes, sizes, posOf, sizeOf]);

    // Manual pointer drag — nodes take priority (stopPropagation), backdrop pans.
    const drag = React.useRef<{
      kind: "node" | "pan";
      id?: string;
      px: number;
      py: number;
      ox: number;
      oy: number;
    } | null>(null);

    const onNodePointerDown = (e: React.PointerEvent, id: string) => {
      if (!draggable) return;
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      const p = posOf(id);
      drag.current = {
        kind: "node",
        id,
        px: e.clientX,
        py: e.clientY,
        ox: p.x,
        oy: p.y,
      };
    };

    const onNodePointerMove = (e: React.PointerEvent) => {
      const d = drag.current;
      if (d?.kind !== "node" || !d.id) return;
      // Screen delta → canvas delta (undo the fit scale).
      const nx = d.ox + (e.clientX - d.px) / scale;
      const ny = d.oy + (e.clientY - d.py) / scale;
      setPositions((prev) => ({ ...prev, [d.id as string]: { x: nx, y: ny } }));
    };

    const onBackdropPointerDown = (e: React.PointerEvent) => {
      if (!pannable) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = {
        kind: "pan",
        px: e.clientX,
        py: e.clientY,
        ox: pan.x,
        oy: pan.y,
      };
    };

    const onBackdropPointerMove = (e: React.PointerEvent) => {
      const d = drag.current;
      if (d?.kind !== "pan") return;
      setPan({ x: d.ox + (e.clientX - d.px), y: d.oy + (e.clientY - d.py) });
    };

    const endDrag = (e: React.PointerEvent) => {
      if (drag.current) e.currentTarget.releasePointerCapture?.(e.pointerId);
      drag.current = null;
    };

    // ── Auto-play choreography ────────────────────────────────────────────
    // Graph shape: which edges leave a node, which node an edge targets, and
    // which nodes are roots (no incoming edge — where the sequence begins).
    const graph = React.useMemo(() => {
      const outgoing = new Map<string, string[]>();
      const target = new Map<string, string>();
      const hasIncoming = new Set<string>();
      for (const n of nodes) outgoing.set(n.id, []);
      for (const e of edges) {
        outgoing.get(e.from)?.push(e.id);
        target.set(e.id, e.to);
        hasIncoming.add(e.to);
      }
      const roots = nodes
        .filter((n) => !hasIncoming.has(n.id))
        .map((n) => n.id);
      return { outgoing, target, roots };
    }, [nodes, edges]);

    const [seq, dispatch] = React.useReducer(seqReducer, EMPTY_SEQ);

    // Start / restart the sequence when autoPlay turns on or the graph changes.
    React.useEffect(() => {
      if (!autoPlay) return;
      dispatch({ type: "reset", roots: graph.roots });
    }, [autoPlay, graph]);

    const handleTraceComplete = React.useCallback(
      (id: string) => {
        onNodeActivate?.(id);
        if (!autoPlay) return;
        dispatch({
          type: "traceDone",
          id,
          outEdges: graph.outgoing.get(id) ?? [],
        });
      },
      [autoPlay, graph, onNodeActivate],
    );

    const handleArrive = React.useCallback(
      (edgeId: string) => {
        onEdgeArrive?.(edgeId);
        if (!autoPlay) return;
        const to = graph.target.get(edgeId);
        if (to) dispatch({ type: "arrive", edgeId, target: to });
      },
      [autoPlay, graph, onEdgeArrive],
    );

    // Loop: once every node is lit and nothing is in flight, replay after a beat.
    React.useEffect(() => {
      if (!autoPlay || !continuous || nodes.length === 0) return;
      const settled =
        seq.lit.size === nodes.length &&
        seq.flowing.size === 0 &&
        seq.tracing.size === 0;
      if (!settled) return;
      const t = setTimeout(
        () => dispatch({ type: "reset", roots: graph.roots }),
        1200,
      );
      return () => clearTimeout(t);
    }, [autoPlay, continuous, nodes.length, seq, graph]);

    const statusOf = (n: AgentFlowNode): AgentNodeStatus => {
      if (!autoPlay) return n.status ?? "idle";
      if (seq.lit.has(n.id)) return "done";
      if (seq.tracing.has(n.id)) return "running";
      return "idle";
    };

    const flowEdges: AgentFlowEdge[] = autoPlay
      ? edges.map((e) => ({
          ...e,
          animated: seq.flowing.has(e.id),
          loop: false,
        }))
      : edges;

    return (
      // biome-ignore lint/a11y/useSemanticElements: a pan/zoom canvas group has no single semantic element
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        data-slot="agent-flow"
        role="group"
        aria-label={ariaLabel ?? "Agent workflow"}
        className={`relative overflow-hidden rounded-2xl border border-border bg-background [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px] ${
          pannable ? "cursor-grab active:cursor-grabbing" : ""
        } ${className ?? ""}`}
        onPointerDown={onBackdropPointerDown}
        onPointerMove={onBackdropPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        {...props}
      >
        <div
          className="absolute left-0 top-0 h-full w-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            // Stay hidden until fitView has framed the graph, so it fades into
            // place instead of snapping from the unscaled corner.
            opacity: !fitView || fitted ? 1 : 0,
            transition: "opacity 300ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <Edges
            edges={flowEdges}
            posOf={posOf}
            sizeOf={sizeOf}
            flowDuration={flowDuration}
            flowSpeed={flowSpeed}
            matchSpeed={autoPlay}
            reduce={reduce}
            onArrive={handleArrive}
          />
          {nodes.map((n, i) => {
            const p = posOf(n.id);
            return (
              <NodeCard
                key={n.id}
                cardRef={registerNode(n.id)}
                node={n}
                status={statusOf(n)}
                size={sizeOf(n.id)}
                index={i}
                x={p.x}
                y={p.y}
                reduce={reduce}
                draggable={draggable}
                flowSpeed={flowSpeed}
                onTraceComplete={handleTraceComplete}
                onPointerDown={(e) => onNodePointerDown(e, n.id)}
                onPointerMove={onNodePointerMove}
                onPointerUp={endDrag}
              />
            );
          })}
        </div>
      </div>
    );
  },
);
AgentFlow.displayName = "AgentFlow";

function NodeCard({
  node,
  status,
  size,
  index,
  x,
  y,
  reduce,
  draggable,
  flowSpeed,
  cardRef,
  onTraceComplete,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  node: AgentFlowNode;
  status: AgentNodeStatus;
  size: Size;
  index: number;
  x: number;
  y: number;
  reduce: boolean | null;
  draggable: boolean;
  flowSpeed: number;
  cardRef: (el: HTMLElement | null) => void;
  onTraceComplete: (id: string) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}) {
  const glowId = `agent-flow-node-${React.useId()}`;
  const active = status === "running" || status === "done";
  const [top, bottom] = borderTracePaths(size.w, size.h);
  // Border trace duration derives from this card's outline length so the front
  // moves at exactly `flowSpeed`, matching the beams that continue from it.
  const traceDuration = borderOutlineLength(size.w, size.h) / flowSpeed;
  // Linear, not ease-out: constant speed is what makes the border→line handoff
  // seamless (an ease-out front would decelerate just as the beam starts).
  const traceT = reduce
    ? { duration: 0 }
    : { duration: traceDuration, ease: EASE_LINEAR };

  // The icon lights when the border trace is halfway drawn (not at the end).
  const [iconLit, setIconLit] = React.useState(status === "done");
  React.useEffect(() => {
    if (status !== "running") {
      setIconLit(status === "done");
      return;
    }
    if (reduce) {
      setIconLit(true);
      return;
    }
    const t = setTimeout(() => setIconLit(true), (traceDuration * 1000) / 2);
    return () => clearTimeout(t);
  }, [status, reduce, traceDuration]);

  // Report the border as complete from a timer (reliable, unlike the SVG path's
  // animation-complete event) so the outgoing edge always fires — including the
  // graph's last hop.
  React.useEffect(() => {
    if (status !== "running") return;
    if (reduce) {
      onTraceComplete(node.id);
      return;
    }
    const t = setTimeout(() => onTraceComplete(node.id), traceDuration * 1000);
    return () => clearTimeout(t);
  }, [status, reduce, traceDuration, node.id, onTraceComplete]);

  return (
    <motion.div
      ref={cardRef}
      data-status={status}
      initial={reduce ? false : { opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={
        reduce
          ? { duration: 0 }
          : { delay: index * 0.05, duration: 0.4, ease: EASE_OUT }
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`absolute z-raised flex w-max max-w-[15rem] -translate-x-1/2 -translate-y-1/2 select-none items-center gap-3 rounded-xl border bg-background/80 p-3 shadow-sm backdrop-blur [transition:border-color_400ms_cubic-bezier(0.22,1,0.36,1),box-shadow_400ms_cubic-bezier(0.22,1,0.36,1),background-color_400ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        STATUS_CARD[status]
      } ${draggable ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
      style={{ left: x, top: y }}
    >
      {/* Border trace — grows from the left-edge centre out to both sides and
          persists as the node's lit border once drawn. */}
      {active && size.w > 1 ? (
        <svg
          fill="none"
          aria-hidden="true"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          className="pointer-events-none absolute inset-0 overflow-visible"
        >
          <defs>
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>
          {[top, bottom].map((d) => (
            <g key={d}>
              <motion.path
                d={d}
                stroke="var(--primary)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeOpacity={0.22}
                filter={`url(#${glowId})`}
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={traceT}
              />
              <motion.path
                d={d}
                stroke="var(--primary)"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeOpacity={0.7}
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={traceT}
              />
            </g>
          ))}
        </svg>
      ) : null}
      <StatusChip
        status={status}
        icon={node.icon}
        lit={iconLit}
        reduce={reduce}
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">
          {node.label}
        </span>
        {node.sublabel ? (
          <span className="block truncate text-xs text-muted-foreground">
            {node.sublabel}
          </span>
        ) : null}
      </span>
    </motion.div>
  );
}

function StatusChip({
  status,
  icon,
  lit,
  reduce,
}: {
  status: AgentNodeStatus;
  icon?: React.ReactNode;
  /** The icon is lit (drives the pop + solid chip); set at half the trace. */
  lit: boolean;
  reduce: boolean | null;
}) {
  const appearance: AgentNodeStatus =
    status === "error" ? "error" : lit ? "done" : "idle";
  return (
    <span
      className={`relative flex size-8 shrink-0 items-center justify-center rounded-lg border [transition:background-color_300ms_cubic-bezier(0.22,1,0.36,1),border-color_300ms_cubic-bezier(0.22,1,0.36,1),color_300ms_cubic-bezier(0.22,1,0.36,1)] ${STATUS_CHIP[appearance]}`}
    >
      {/* Keyed by appearance so the glyph pops in when the icon lights. */}
      <motion.span
        key={appearance}
        initial={
          reduce ? false : { scale: 0.4, opacity: 0, filter: "blur(3px)" }
        }
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={reduce ? { duration: 0 } : SPRING_SNAPPY}
        className="flex size-4 items-center justify-center [&>svg]:size-4"
      >
        {icon ? (
          icon
        ) : appearance === "done" ? (
          <CheckIcon className="size-4" />
        ) : appearance === "error" ? (
          <CloseIcon className="size-4" />
        ) : (
          <span className="size-1.5 rounded-full bg-current" />
        )}
      </motion.span>
      {status === "running" && !lit && !reduce ? (
        <span className="absolute inset-0 animate-ping rounded-lg border border-primary/40 motion-reduce:animate-none" />
      ) : null}
    </span>
  );
}

function Edges({
  edges,
  posOf,
  sizeOf,
  flowDuration,
  flowSpeed,
  matchSpeed,
  reduce,
  onArrive,
}: {
  edges: AgentFlowEdge[];
  posOf: (id: string) => Point;
  sizeOf: (id: string) => Size;
  flowDuration: number;
  flowSpeed: number;
  /** Travel each edge at `flowSpeed` (px/s) instead of a fixed duration. */
  matchSpeed: boolean;
  reduce: boolean | null;
  onArrive?: (edgeId: string) => void;
}) {
  const glowId = `agent-flow-glow-${React.useId()}`;
  return (
    <svg
      fill="none"
      aria-hidden="true"
      role="presentation"
      className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible [transform:translateZ(0)]"
    >
      <defs>
        {/* Soft bloom for the travelling packet — the "glowing trail". */}
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {edges.map((edge) => {
        const from = posOf(edge.from);
        const to = posOf(edge.to);
        const fs = sizeOf(edge.from);
        const ts = sizeOf(edge.to);
        const startX = from.x + fs.w / 2;
        const startY = from.y;
        const endX = to.x - ts.w / 2;
        const endY = to.y;
        const controlX = (startX + endX) / 2;
        const controlY = (startY + endY) / 2 - (edge.curvature ?? 0);
        const d = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;
        // Continuous flow: the packet covers this edge's length at the shared
        // `flowSpeed` (px/s) — the same pace the borders trace — so the light
        // never speeds up or slows at the card→line seam. Curved edges use the
        // control point for a real (not chord) length estimate.
        const chord = Math.hypot(endX - startX, endY - startY);
        const curveLen =
          Math.hypot(controlX - startX, controlY - startY) +
          Math.hypot(endX - controlX, endY - controlY);
        const len = (chord + curveLen) / 2;
        const edgeDuration = matchSpeed
          ? Math.max(0.2, len / flowSpeed)
          : flowDuration;
        return (
          <Edge
            key={edge.id}
            id={edge.id}
            d={d}
            startX={startX}
            startY={startY}
            endX={endX}
            endY={endY}
            animated={edge.animated ?? true}
            loop={edge.loop ?? true}
            persist={edge.persist ?? false}
            flowDuration={edgeDuration}
            reduce={reduce}
            glowId={glowId}
            onArrive={onArrive}
          />
        );
      })}
    </svg>
  );
}

// Memoized so a sibling edge landing (which re-renders the parent) never
// restarts an edge that is still mid-flight — that caused packets to replay.
const Edge = React.memo(function Edge({
  id,
  d,
  startX,
  startY,
  endX,
  endY,
  animated,
  loop,
  persist,
  flowDuration,
  reduce,
  glowId,
  onArrive,
}: {
  id: string;
  d: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  animated: boolean;
  loop: boolean;
  persist: boolean;
  flowDuration: number;
  reduce: boolean | null;
  glowId: string;
  onArrive?: (edgeId: string) => void;
}) {
  const gid = `agent-flow-${React.useId()}-${id}`;
  const playing = animated && !reduce;

  // Report arrival from a timer rather than the gradient's animation-complete
  // event: it always fires (the SVG-gradient complete event can be missed) and
  // lands just before the packet reaches the node, so the next border starts
  // the instant the line finishes — one continuous flow, no gap.
  React.useEffect(() => {
    if (!animated || loop) return;
    if (reduce) {
      onArrive?.(id);
      return;
    }
    const t = setTimeout(() => onArrive?.(id), flowDuration * 1000 * 0.98);
    return () => clearTimeout(t);
  }, [animated, loop, reduce, flowDuration, id, onArrive]);

  // Persisted edges stay lit once their packet has passed. Track completion so
  // the drawn-on line holds after `animated` drops back to false; a fresh flow
  // (continuous replay) clears it so the line re-draws from empty.
  const [lit, setLit] = React.useState(false);
  const wasAnimated = React.useRef(false);
  React.useEffect(() => {
    if (!persist) return;
    if (animated && !wasAnimated.current) setLit(false);
    wasAnimated.current = animated;
    if (!animated) return;
    if (reduce) {
      setLit(true);
      return;
    }
    // Fire just before arrival (0.98·flowDuration) un-animates the edge, so the
    // persisted trail is already latched lit when `playing` drops to false and
    // the `<g>` would otherwise unmount.
    const t = setTimeout(() => setLit(true), flowDuration * 1000 * 0.95);
    return () => clearTimeout(t);
  }, [persist, animated, reduce, flowDuration]);

  // Gradient axis in user space, along THIS edge's start→end chord. Absolute
  // coordinates (not %) with userSpaceOnUse so the sweep travels every edge
  // regardless of its position on the shared canvas AND works on flat
  // horizontal/vertical edges, whose zero-area bounding box makes an
  // objectBoundingBox gradient fail to render entirely.
  const dx = endX - startX;
  const dy = endY - startY;
  const at = (f: number) => ({ x: startX + f * dx, y: startY + f * dy });
  const anim = (a: number, b: number) => ({
    x1: [at(a).x, at(b).x],
    y1: [at(a).y, at(b).y],
    x2: [at(a - 0.1).x, at(b - 0.1).x],
    y2: [at(a - 0.1).y, at(b - 0.1).y],
  });
  const parked = { x1: at(1.2).x, y1: at(1.2).y, x2: at(1.1).x, y2: at(1.1).y };

  const drawT = reduce
    ? { duration: 0 }
    : { duration: flowDuration, ease: "linear" as const };

  return (
    <>
      <path
        d={d}
        stroke="var(--border)"
        strokeWidth={2}
        strokeOpacity={0.5}
        strokeLinecap="round"
      />
      {/* Persisted trail — a primary stroke that draws on (pathLength) in sync
          with the travelling packet and stays lit, mirroring a card's traced
          border. Only for `persist` edges; kept mounted by `lit` after the flow
          so a landed edge reads as an established connection. */}
      {persist && (playing || lit) ? (
        <g>
          <motion.path
            d={d}
            stroke="var(--primary)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeOpacity={0.25}
            filter={`url(#${glowId})`}
            initial={{ pathLength: reduce || lit ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={lit ? { duration: 0 } : drawT}
          />
          <motion.path
            d={d}
            stroke="var(--primary)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeOpacity={0.85}
            initial={{ pathLength: reduce || lit ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={lit ? { duration: 0 } : drawT}
          />
        </g>
      ) : null}
      {/* Packet — a bright head sweeping the edge. On persist edges it rides the
          leading tip of the drawing trail like a comet; on transient edges it is
          the whole animation, dropping back to the resting path when done. A
          blurred copy trails behind the sharp stroke for a soft glow. */}
      {playing ? (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
        >
          <path
            d={d}
            stroke={`url(#${gid})`}
            strokeWidth={4}
            strokeLinecap="round"
            strokeOpacity={0.55}
            filter={`url(#${glowId})`}
          />
          <path
            d={d}
            stroke={`url(#${gid})`}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </motion.g>
      ) : null}
      <defs>
        <motion.linearGradient
          id={gid}
          gradientUnits="userSpaceOnUse"
          initial={parked}
          animate={
            playing
              ? // A loop overshoots the end so the streak exits smoothly; a
                // single packet lands its leading edge exactly at the node so
                // completion coincides with the visual arrival (the next node
                // starts the moment the line finishes).
                loop
                ? anim(0, 1.1)
                : anim(0, 1)
              : // Park the packet just past the end (invisible) when idle/landed,
                // so a finished edge never flashes a full line before it unmounts.
                parked
          }
          transition={
            playing
              ? {
                  duration: flowDuration,
                  repeat: loop ? Number.POSITIVE_INFINITY : 0,
                  // Linear so the packet keeps a constant speed and finishes the
                  // instant its leading edge reaches the node — no easing lag
                  // between the line ending and the next border starting.
                  ease: "linear",
                }
              : { duration: 0 }
          }
        >
          <stop stopColor="var(--primary)" stopOpacity="0" />
          <stop stopColor="var(--primary)" />
          <stop
            offset="32.5%"
            stopColor="color-mix(in oklch, var(--primary) 40%, transparent)"
          />
          <stop
            offset="100%"
            stopColor="color-mix(in oklch, var(--primary) 40%, transparent)"
            stopOpacity="0"
          />
        </motion.linearGradient>
      </defs>
    </>
  );
});

type IconProps = { className?: string };
function CheckIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function CloseIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export { AgentFlow };
