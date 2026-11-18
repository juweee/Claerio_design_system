import * as React from "react"
import { Slot, Tabs as TabsPrimitive } from "radix-ui"

import type { AnchorElementProps, ChildrenProps, CommonProps, RadixAsChildProps } from "@/lib/html-props"
import { cn } from "@/lib/utils"

import { navFocus } from "./sidebar-nav"

/*
 * Clærio Tabs
 *
 * Sources: the sidebar nav spec's secondary navigation (retired 2026-11-12),
 * decisions.md (Nav) and claude-design-reference/components/Tabs.
 *
 * Two versions with the same look (decided 2026-11-12):
 * - NavTabs: links. Each tab has its own URL; the current one gets
 *   aria-current="page". Matches the reference markup.
 * - Tabs: in-page tabs on Radix Tabs. Arrow keys move between tabs, and
 *   each tab shows its own panel.
 *
 * Row: sits directly under the page title, 4px between tabs, a 1px
 * --border hairline beneath.
 * Tab: 8 × 12 padding, top corners radius-sm only, Inter 14/400 in
 * --sidebar-foreground. Hover: --sidebar-accent.
 * Active: the same amber tint, --nav-active-foreground text and 600
 * weight as the active sidebar item. No border.
 */

const tabRow = "flex items-center gap-1 border-b border-border font-sans"

const tabItem = [
  "inline-flex cursor-pointer items-center rounded-t-sm px-3 py-2",
  "text-body text-sidebar-foreground no-underline",
  navFocus,
]

/* ---- Link tabs ---- */

/**
 * @import import { NavTabs } from "@/components/ui/tabs"
 */
function NavTabs({ className, ...props }: React.ComponentProps<"nav"> & ChildrenProps & CommonProps<HTMLElement>) {
  return <nav data-slot="nav-tabs" className={cn(tabRow, className)} {...props} />
}

type NavTabsItemProps = React.ComponentProps<"a"> & {
  /** Marks the tab as the current page. */
  active?: boolean
  /** Render the child element (for example a router link) with tab styles. */
  asChild?: boolean
} & AnchorElementProps &
  ChildrenProps & CommonProps<HTMLAnchorElement>

/**
 * @import import { NavTabsItem } from "@/components/ui/tabs"
 */
function NavTabsItem({ className, active, asChild = false, ...props }: NavTabsItemProps) {
  const Comp = asChild ? Slot.Root : "a"
  return (
    <Comp
      data-slot="nav-tabs-item"
      aria-current={active ? "page" : undefined}
      className={cn(
        tabItem,
        "not-aria-[current=page]:hover:bg-sidebar-accent",
        "aria-[current=page]:bg-[color-mix(in_oklch,var(--nav-active)_var(--nav-active-tint),transparent)]",
        "aria-[current=page]:text-nav-active-foreground aria-[current=page]:font-[600]",
        className
      )}
      {...props}
    />
  )
}

/* ---- In-page tabs ---- */

/**
 * @import import { Tabs } from "@/components/ui/tabs"
 */
function Tabs(
  props: React.ComponentProps<typeof TabsPrimitive.Root> & {
    /** The selected tab's value, when you control the tabs. Use with onValueChange. */
    value?: string
    /** The tab selected at first, when you don't control the tabs. */
    defaultValue?: string
    /** Called with the new tab's value. */
    onValueChange?: (value: string) => void
    /** "automatic" (the default) shows a panel when its tab gets focus. "manual" waits for Enter or a click. */
    activationMode?: "automatic" | "manual"
    /** "horizontal" or "vertical": which arrow keys move between tabs. */
    orientation?: "horizontal" | "vertical"
    /** Reading direction, "ltr" or "rtl". */
    dir?: "ltr" | "rtl"
  } & RadixAsChildProps &
    ChildrenProps & CommonProps<HTMLDivElement>
) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />
}

/**
 * @import import { TabsList } from "@/components/ui/tabs"
 */
function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  /** Whether arrow keys wrap from the last tab to the first. Defaults to true. */
  loop?: boolean
} & RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLDivElement>) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cn(tabRow, className)} {...props} />
}

/**
 * @import import { TabsTrigger } from "@/components/ui/tabs"
 */
function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  /** Required. Matches the value of the TabsContent this tab shows. */
  value: string
  /** Dims the tab and blocks selecting it. */
  disabled?: boolean
} & RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLButtonElement>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        tabItem,
        "data-[state=inactive]:hover:bg-sidebar-accent",
        "data-[state=active]:bg-[color-mix(in_oklch,var(--nav-active)_var(--nav-active-tint),transparent)]",
        "data-[state=active]:text-nav-active-foreground data-[state=active]:font-[600]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

/**
 * @import import { TabsContent } from "@/components/ui/tabs"
 */
function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content> & {
  /** Required. Matches the value of the TabsTrigger that shows this panel. */
  value: string
  /** Keeps the panel mounted while hidden, for animation libraries. */
  forceMount?: true
} & RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLDivElement>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("font-sans text-body text-foreground", navFocus, className)}
      {...props}
    />
  )
}

export { NavTabs, NavTabsItem, Tabs, TabsContent, TabsList, TabsTrigger }
export type { NavTabsItemProps }
