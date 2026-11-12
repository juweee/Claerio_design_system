import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/*
 * Clærio Sidebar navigation
 *
 * Sources: the sidebar nav spec (retired 2026-11-12), decisions.md (Nav) and
 * claude-design-reference/components/SidebarNav.
 *
 * This is the nav list only (decided 2026-11-12). Collapsing, a mobile
 * drawer and page layout are not designed yet.
 *
 * Container
 * - --sidebar surface, --sidebar-foreground text, 12px padding, 1px
 *   --sidebar-border on the right (reference CSS).
 * - 2px between items (decided 2026-11-12 after a side-by-side preview;
 *   a hairline gap, like the segmented control's 2px inset).
 *
 * Group label
 * - body-small (12/400) in --muted-foreground (decided 2026-11-12; the
 *   reference used 12/500, which is off the type scale). Padding 12 8 4
 *   (reference CSS). Space separates groups, not dividers.
 *
 * Item
 * - 8px padding, radius-sm, Inter 14/400 in --sidebar-foreground.
 * - Hover: --sidebar-accent.
 * - Current page (active prop, sets aria-current="page"): --nav-active at
 *   --nav-active-tint (10% light, 15% dark), --nav-active-foreground text
 *   at 600. No border and no icon: that is what sets it apart from a
 *   warning banner, which uses the same amber.
 * - Focus: universal 2px --ring outline, 2px offset.
 */

const navItemActive = [
  "aria-[current=page]:bg-[color-mix(in_oklch,var(--nav-active)_var(--nav-active-tint),transparent)]",
  "aria-[current=page]:text-nav-active-foreground aria-[current=page]:font-[600]",
]

const navFocus =
  "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"

function SidebarNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="sidebar-nav"
      className={cn(
        "flex flex-col gap-0.5 border-r border-sidebar-border bg-sidebar p-3",
        "font-sans text-sidebar-foreground",
        className
      )}
      {...props}
    />
  )
}

function SidebarNavLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-nav-label"
      className={cn("px-2 pt-3 pb-1 text-body-small text-muted-foreground", className)}
      {...props}
    />
  )
}

type SidebarNavItemProps = React.ComponentProps<"a"> & {
  /** Marks the item as the current page. */
  active?: boolean
  /** Render the child element (for example a router link) with item styles. */
  asChild?: boolean
}

function SidebarNavItem({ className, active, asChild = false, ...props }: SidebarNavItemProps) {
  const Comp = asChild ? Slot.Root : "a"
  return (
    <Comp
      data-slot="sidebar-nav-item"
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center rounded-sm p-2 text-body text-sidebar-foreground no-underline",
        "not-aria-[current=page]:hover:bg-sidebar-accent",
        navItemActive,
        navFocus,
        className
      )}
      {...props}
    />
  )
}

export { SidebarNav, SidebarNavItem, SidebarNavLabel, navFocus, navItemActive }
export type { SidebarNavItemProps }
