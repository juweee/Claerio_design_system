import * as React from "react"

import type { ChildrenProps, CommonProps } from "@/lib/html-props"
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
 * - Title: heading-2 type. An <h3> by default; the level prop sets <h2>,
 *   <h3> or <h4> to fit the page's heading order (decided 2026-11-18).
 *   The look never changes with the level. Body: body, 8px below. Meta:
 *   body-small in --muted-foreground, 12px below.
 * - CardHeader puts a view toggle (such as a segmented control) inline at
 *   the top right of the title row. Put data filters in a FilterRow at
 *   the top of CardBody, 8px under the title (decided 2026-11-23).
 */

/**
 * Groups content about one subject, such as a claim, a visit or a
 * recommendation. Cards have no shadow. Put view toggles in the header.
 * Put data filters in a FilterRow at the top of CardBody, followed by the
 * table or chart they filter.
 *
 * @import import { Card } from "@/components/ui/card"
 */
function Card({ className, ...props }: React.ComponentProps<"div"> & ChildrenProps & CommonProps<HTMLDivElement>) {
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
function CardHeader({ className, ...props }: React.ComponentProps<"div"> & ChildrenProps & CommonProps<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex items-start justify-between gap-3", className)}
      {...props}
    />
  )
}

/** The heading levels CardTitle can render. */
type CardTitleLevel = 2 | 3 | 4

type CardTitleProps = React.ComponentProps<"h3"> & {
  /**
   * The heading level: 2, 3 or 4. Defaults to 3. Pick the level that
   * follows the heading above the card, so no level is skipped: 2 when
   * cards sit right under the page's <h1>, 3 under an <h2> section title.
   * The look stays the same at every level.
   */
  level?: CardTitleLevel
} & ChildrenProps & CommonProps<HTMLHeadingElement>

const headingTags = { 2: "h2", 3: "h3", 4: "h4" } as const satisfies Record<CardTitleLevel, string>

/**
 * The card's title, in heading-2 type.
 *
 * Renders an <h3> by default. Set level to 2 when the card sits right
 * under the page's <h1>, or to 4 under an <h3>, so screen reader users
 * never hear a skipped heading level and axe doesn't report
 * heading-order. Don't use aria-level for this. The look is the same at
 * every level.
 *
 * @import import { CardTitle } from "@/components/ui/card"
 */
function CardTitle({ className, level = 3, ...props }: CardTitleProps) {
  const Heading = headingTags[level]
  return <Heading data-slot="card-title" className={cn("text-heading-2", className)} {...props} />
}

/**
 * The main content, 8px below the title.
 *
 * @import import { CardBody } from "@/components/ui/card"
 */
function CardBody({ className, ...props }: React.ComponentProps<"div"> & ChildrenProps & CommonProps<HTMLDivElement>) {
  return <div data-slot="card-body" className={cn("mt-2 text-body", className)} {...props} />
}

/**
 * Secondary details, such as the provider, date and claim number, in
 * body-small and --muted-foreground, 12px below the body.
 *
 * @import import { CardMeta } from "@/components/ui/card"
 */
function CardMeta({ className, ...props }: React.ComponentProps<"p"> & ChildrenProps & CommonProps<HTMLParagraphElement>) {
  return (
    <p data-slot="card-meta" className={cn("mt-3 text-body-small text-muted-foreground", className)} {...props} />
  )
}

export { Card, CardBody, CardHeader, CardMeta, CardTitle }
