"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type SidebarItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: React.ReactNode;
  children?: SidebarItem[];
};

export type SidebarProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange"
> & {
  items: SidebarItem[];
  /** id of the active item. */
  activeId?: string;
  /** Start collapsed to an icon rail. */
  defaultCollapsed?: boolean;
  /** Expand the rail while hovered. */
  expandOnHover?: boolean;
  /** Node pinned to the bottom. */
  footer?: React.ReactNode;
  /** Brand/header node at the top. */
  header?: React.ReactNode;
  /** Called when an item is clicked, with its id and href. */
  onNavigate?: (id: string, href?: string) => void;
};

let railSeed = 0;

const Chevron = ({ open }: { open: boolean }) => (
  <motion.svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="ml-auto h-4 w-4 opacity-50"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    animate={{ rotate: open ? 90 : 0 }}
    transition={{ duration: 0.18 }}
  >
    <path d="m9 18 6-6-6-6" />
  </motion.svg>
);

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      activeId,
      defaultCollapsed = false,
      expandOnHover = true,
      footer,
      header,
      onNavigate,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const ids = React.useMemo(() => {
      const n = railSeed++;
      return { hover: `sidebar-hover-${n}`, bar: `sidebar-bar-${n}` };
    }, []);
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
    const [hovered, setHovered] = React.useState(false);
    const [hoverKey, setHoverKey] = React.useState<string | null>(null);
    const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
      {},
    );

    const expanded = !collapsed || (expandOnHover && hovered);

    const spring = reduceMotion
      ? { duration: 0 }
      : ({ type: "spring", stiffness: 360, damping: 34 } as const);
    const widthSpring = reduceMotion
      ? { duration: 0 }
      : ({ type: "spring", stiffness: 260, damping: 30 } as const);

    const toggleGroup = (id: string) =>
      setOpenGroups((g) => ({ ...g, [id]: !g[id] }));

    const labelMotion = {
      initial: reduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 },
      animate: { opacity: 1, x: 0 },
      exit: reduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 },
      transition: { duration: 0.14 },
    };

    const renderItem = (item: SidebarItem, depth: number) => {
      const isActive = item.id === activeId;
      const hasChildren = !!item.children?.length;
      const groupOpen = openGroups[item.id] ?? false;
      const isHovered = hoverKey === item.id;

      const rowClass = `group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 font-medium text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isActive ? "text-foreground" : "text-muted-foreground"
      }`;

      const inner = (
        <>
          {isHovered && !isActive && (
            <motion.span
              layoutId={ids.hover}
              transition={spring}
              className="absolute inset-0 rounded-lg bg-accent"
            />
          )}
          {isActive && (
            <motion.span
              layoutId={`${ids.bar}-bg`}
              transition={spring}
              className="absolute inset-0 rounded-lg bg-accent"
            />
          )}
          {isActive && (
            <motion.span
              layoutId={ids.bar}
              transition={spring}
              className="absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full bg-primary"
            />
          )}
          <span
            className={`relative flex h-5 w-5 shrink-0 items-center justify-center [transition:color_150ms_ease] ${
              isActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground"
            }`}
          >
            {item.icon ?? (
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            )}
          </span>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.span
                {...labelMotion}
                className="relative flex-1 truncate text-left"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
          {expanded && item.badge && (
            <span className="relative ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-muted px-1.5 font-semibold text-[11px] text-muted-foreground tabular-nums">
              {item.badge}
            </span>
          )}
          {expanded && hasChildren && <Chevron open={groupOpen} />}
        </>
      );

      return (
        <li key={item.id}>
          {hasChildren ? (
            <button
              type="button"
              aria-expanded={groupOpen}
              onClick={() => toggleGroup(item.id)}
              onMouseEnter={() => setHoverKey(item.id)}
              className={rowClass}
              style={{ paddingLeft: depth ? 8 + depth * 14 : undefined }}
            >
              {inner}
            </button>
          ) : (
            <a
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onMouseEnter={() => setHoverKey(item.id)}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(item.id, item.href);
                }
              }}
              className={rowClass}
              style={{ paddingLeft: depth ? 8 + depth * 14 : undefined }}
            >
              {inner}
            </a>
          )}

          {hasChildren && (
            <AnimatePresence initial={false}>
              {groupOpen && expanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={
                    reduceMotion ? { duration: 0 } : { duration: 0.22 }
                  }
                  className="overflow-hidden"
                >
                  {item.children?.map((child) => renderItem(child, depth + 1))}
                </motion.ul>
              )}
            </AnimatePresence>
          )}
        </li>
      );
    };

    return (
      <motion.aside
        ref={ref}
        layout
        onMouseEnter={() => expandOnHover && setHovered(true)}
        onMouseLeave={() => {
          if (expandOnHover) setHovered(false);
          setHoverKey(null);
        }}
        animate={{ width: expanded ? 252 : 68 }}
        transition={widthSpring}
        className={`flex h-full flex-col overflow-hidden border-border border-r bg-background ${className ?? ""}`}
        {...(props as React.ComponentProps<typeof motion.aside>)}
      >
        {header && (
          <div className="flex h-14 shrink-0 items-center gap-2.5 overflow-hidden px-3 font-semibold text-foreground">
            {header}
          </div>
        )}

        <nav
          aria-label="Sidebar"
          className="flex-1 overflow-y-auto overflow-x-hidden p-2"
        >
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => renderItem(item, 0))}
          </ul>
        </nav>

        <div className="shrink-0 border-border border-t p-2">
          {footer && <div className="overflow-hidden">{footer}</div>}
          {!expandOnHover && (
            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((c) => !c)}
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-muted-foreground text-sm [transition:background-color_120ms_ease,color_120ms_ease] hover:bg-accent hover:text-foreground"
            >
              <motion.span
                animate={{ rotate: collapsed ? 180 : 0 }}
                transition={spring}
                className="flex h-5 w-5 shrink-0 items-center justify-center"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </motion.span>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.span {...labelMotion}>Collapse</motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>
      </motion.aside>
    );
  },
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
