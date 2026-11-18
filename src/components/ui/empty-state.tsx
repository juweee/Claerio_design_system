import * as React from "react"

import type { ChildrenProps, CommonProps } from "@/lib/html-props"
import { cn } from "@/lib/utils"

/*
 * Clærio EmptyState
 *
 * Source: decisions.md (2026-11-18, empty state), from the comparison
 * with the prototype canvas's Activity and Reporting pages.
 *
 * - Replaces the content that has nothing to show, such as a table or a
 *   chart, inside the same Card. Filters stay in view above it.
 * - Centered. 48px top and bottom padding, 24px sides, 8px between parts.
 * - Title: heading-3 type in --foreground, as a <p>, so it never breaks
 *   the page's heading order. Description: body in --muted-foreground.
 *   Actions: 8px below the description.
 * - "Clear filters" is a secondary Button: it's an action, but not the
 *   page's main one.
 * - role="status", so screen readers announce it when it replaces
 *   results.
 * - A single field with no value yet (such as "Amount pending") is not an
 *   empty state: show it as regular --muted-foreground text, no italics.
 */

/**
 * Shows that there's nothing to display, such as when filters match no
 * rows or a chart has no data. Put it inside the same Card, in place of
 * the table or chart, and keep the filters above it.
 *
 * Build it from parts: EmptyState > EmptyStateTitle (what happened),
 * EmptyStateDescription (what to do next), and EmptyStateActions with a
 * secondary Button, such as "Clear filters". It has role="status", so
 * screen readers announce it when it replaces results.
 *
 * For one field with no value yet, such as "Amount pending", don't use
 * EmptyState: show the text in --muted-foreground, not italic.
 *
 * @import import { EmptyState } from "@/components/ui/empty-state"
 */
function EmptyState({ className, ...props }: React.ComponentProps<"div"> & ChildrenProps & CommonProps<HTMLDivElement>) {
  return (
    <div
      data-slot="empty-state"
      role="status"
      className={cn("flex flex-col items-center gap-2 px-6 py-12 text-center font-sans", className)}
      {...props}
    />
  )
}

/**
 * Says what happened, such as "No overpayments". Heading-3 type, but a
 * <p> element, so it doesn't change the page's heading order.
 *
 * @import import { EmptyStateTitle } from "@/components/ui/empty-state"
 */
function EmptyStateTitle({ className, ...props }: React.ComponentProps<"p"> & ChildrenProps & CommonProps<HTMLParagraphElement>) {
  return <p data-slot="empty-state-title" className={cn("text-heading-3 text-foreground", className)} {...props} />
}

/**
 * One sentence that says what to do next, such as "Clear the filter to
 * see all of them." Body type in --muted-foreground.
 *
 * @import import { EmptyStateDescription } from "@/components/ui/empty-state"
 */
function EmptyStateDescription({ className, ...props }: React.ComponentProps<"p"> & ChildrenProps & CommonProps<HTMLParagraphElement>) {
  return (
    <p data-slot="empty-state-description" className={cn("text-body text-muted-foreground", className)} {...props} />
  )
}

/**
 * Holds the action, 8px below the description. Use a secondary Button
 * for "Clear filters". Use a primary Button only when it's the page's
 * main action, such as connecting the first account.
 *
 * @import import { EmptyStateActions } from "@/components/ui/empty-state"
 */
function EmptyStateActions({ className, ...props }: React.ComponentProps<"div"> & ChildrenProps & CommonProps<HTMLDivElement>) {
  return (
    <div
      data-slot="empty-state-actions"
      className={cn("mt-2 flex flex-wrap justify-center gap-2", className)}
      {...props}
    />
  )
}

export { EmptyState, EmptyStateActions, EmptyStateDescription, EmptyStateTitle }
