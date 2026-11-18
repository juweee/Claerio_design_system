import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Clærio Card
 *
 * Source: claude-design-reference/components/Card and the CLAUDE.md hard
 * rules.
 *
 * - Groups one subject: a claim, a visit, a recommendation.
 * - --card surface, 1px --border, radius-lg, space-4 padding.
 * - No shadow, in either mode. The Card README gives light mode a faint
 *   shadow, but the CLAUDE.md hard rule "No shadows on cards" outranks it.
 * - Title: heading-2 type, always an <h3> element. Body: body, 8px below. Meta: body-small in
 *   --muted-foreground, 12px below.
 * - CardHeader puts a view toggle (such as a segmented control) inline at
 *   the top right of the title row. Put data filters on their own row
 *   under the title.
 */

/**
 * Groups content about one subject, such as a claim, a visit or a
 * recommendation. Cards have no shadow. Put view toggles in the header and
 * data filters on their own row under the title.
 *
 * @import import { Card } from "@/components/ui/card"
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("rounded-lg border border-border bg-card p-4 font-sans text-card-foreground", className)}
      {...props}
    />
  )
}

/**
 * The title row. Holds a CardTitle and, at the top right, an optional view
 * toggle such as a SegmentedControl.
 *
 * @import import { CardHeader } from "@/components/ui/card"
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex items-start justify-between gap-3", className)}
      {...props}
    />
  )
}

/**
 * The card's title, in heading-2 type.
 *
 * Always renders an <h3>, a level-3 heading, whatever the page around it.
 * There is no prop to change the level. Make sure an <h2> comes before it
 * on the page, or screen reader users hear a skipped heading level and
 * axe reports heading-order.
 *
 * @import import { CardTitle } from "@/components/ui/card"
 */
function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("text-heading-2", className)} {...props} />
}

/**
 * The main content, 8px below the title.
 *
 * @import import { CardBody } from "@/components/ui/card"
 */
function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-body" className={cn("mt-2 text-body", className)} {...props} />
}

/**
 * Secondary details, such as the provider, date and claim number, in
 * body-small and --muted-foreground, 12px below the body.
 *
 * @import import { CardMeta } from "@/components/ui/card"
 */
function CardMeta({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p data-slot="card-meta" className={cn("mt-3 text-body-small text-muted-foreground", className)} {...props} />
  )
}

export { Card, CardBody, CardHeader, CardMeta, CardTitle }
