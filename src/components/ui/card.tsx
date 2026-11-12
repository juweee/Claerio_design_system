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
 * - Title: heading-2. Body: body, 8px below. Meta: body-small in
 *   --muted-foreground, 12px below.
 * - CardHeader puts a view toggle (such as a segmented control) inline at
 *   the top right of the title row. Put data filters on their own row
 *   under the title.
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

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex items-start justify-between gap-3", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("text-heading-2", className)} {...props} />
}

function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-body" className={cn("mt-2 text-body", className)} {...props} />
}

function CardMeta({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p data-slot="card-meta" className={cn("mt-3 text-body-small text-muted-foreground", className)} {...props} />
  )
}

export { Card, CardBody, CardHeader, CardMeta, CardTitle }
