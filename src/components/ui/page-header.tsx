import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Clærio PageHeader
 *
 * Source: decisions.md (2026-11-18, page header and layout), from the
 * comparison with the prototype canvas's Page Template.
 *
 * - The top bar of every page: the page title on the left, page-wide
 *   status and actions (such as "Synced 12 minutes ago", Help, Alerts) on
 *   the right.
 * - A <header> element, 64px tall, sticky at the top, --background fill,
 *   1px --border beneath, 24px side padding, 16px gap.
 * - Title: the page's only <h1>, Lora heading-1 (24/700), on one line.
 * - Goes outside <main>, so it's the page's banner landmark. The footer
 *   goes outside <main> too. See the app shell stories.
 * - The app shell is at most --layout-max-width (1280px) wide, centered.
 *   The page body has 24px padding and 24px between sections.
 */

/**
 * The top bar of a page, with the page title and page-wide actions. One
 * per page.
 *
 * Put it outside <main>, so it's the page's banner landmark: navigation
 * rail, then a column of PageHeader, <main>, and <footer>. Build it from
 * parts: PageHeader > PageHeaderTitle and PageHeaderActions.
 *
 * @import import { PageHeader } from "@/components/ui/page-header"
 */
function PageHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-6 font-sans text-foreground",
        className
      )}
      {...props}
    />
  )
}

/**
 * The page title, such as "Activity" or "Good afternoon, Ava". Always the
 * page's only <h1>, in Lora heading-1, on one line. Section and card
 * titles below it start at <h2>.
 *
 * @import import { PageHeaderTitle } from "@/components/ui/page-header"
 */
function PageHeaderTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-header-title"
      className={cn("min-w-0 truncate font-serif text-heading-1", className)}
      {...props}
    />
  )
}

/**
 * Holds page-wide status and actions on the right, 16px apart, such as
 * the sync time in body-small --muted-foreground and ghost icon Buttons
 * with an aria-label. Page-specific actions belong in the page body.
 *
 * @import import { PageHeaderActions } from "@/components/ui/page-header"
 */
function PageHeaderActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="page-header-actions" className={cn("flex shrink-0 items-center gap-4", className)} {...props} />
}

export { PageHeader, PageHeaderActions, PageHeaderTitle }
