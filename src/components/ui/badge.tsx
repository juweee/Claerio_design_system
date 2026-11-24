import * as React from "react"
import { cva } from "class-variance-authority"

import type { ChildrenProps, CommonProps } from "@/lib/html-props"
import { cn } from "@/lib/utils"

/*
 * Clærio savings badge and status chip
 *
 * Sources: claude-design-reference/components/Badge and the status chip
 * notes in the table spec (retired 2026-11-12).
 *
 * Savings badge (Badge)
 * - A financial benefit, such as "Save $187".
 * - Terracotta (--primary) with Cream text, Inter 11/700 uppercase,
 *   radius-sm, 4 × 8 padding (decided 2026-11-12; the reference used
 *   3 × 8, off the spacing scale). Same in both modes.
 *
 * Status chip (StatusChip)
 * - The state of a claim, accumulator or plan. Always put the state in
 *   words: color alone never carries meaning.
 * - Inter 11/600, radius-full, 2 × 10 padding (README and table spec).
 *   11px is kept below the type scale on purpose (decided 2026-11-12).
 * - Tints are light / dark. Every color is a token; the spec's literal
 *   values match these tokens exactly.
 *   positive: --success base (= --teal) at 12% / 10%, --teal-dark text
 *   neutral:  --olive-600 at 10% / 16%, --olive-700 text (dark: --muted-foreground)
 *   alert:    --warning at 10% / 15%, --warning-foreground text
 *   error:    --destructive at 10% / 6%, --error-foreground text
 * - A badge may sit next to a chip with a 6px gap.
 * - Dark mode tints, accepted on review 2026-11-12: positive 20% -> 10%
 *   and error 15% -> 6%. At the spec's earlier tints, their text measured
 *   4.03:1 and 4.00:1 on highlighted table rows (--accent hover and
 *   new-row); these tints measure 4.58:1 and 4.56:1. Light mode is
 *   unchanged.
 */

const badgeClasses =
  "inline-flex items-center rounded-sm bg-primary px-2 py-1 font-sans text-[11px] leading-[1.3] font-[700] uppercase text-primary-foreground"

/**
 * A terracotta savings badge for a financial benefit, such as "Save $187".
 * For the state of a claim or plan, use StatusChip, which always names the
 * state in words.
 *
 * @import import { Badge } from "@/components/ui/badge"
 */
function Badge({ className, ...props }: React.ComponentProps<"span"> & ChildrenProps & CommonProps<HTMLSpanElement>) {
  return <span data-slot="badge" className={cn(badgeClasses, className)} {...props} />
}

/** The 4 status chip variants. Listed here so the docs show each value. */
type StatusChipVariant = "positive" | "neutral" | "alert" | "error"

const statusChipVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-[11px] leading-[1.4] font-[600] whitespace-nowrap",
  {
    variants: {
      variant: {
        positive: [
          "bg-[color-mix(in_oklch,var(--success)_12%,transparent)] text-teal-dark",
          "dark:bg-[color-mix(in_oklch,var(--success)_10%,transparent)]",
        ],
        neutral: [
          "bg-[color-mix(in_oklch,var(--olive-600)_10%,transparent)] text-olive-700",
          "dark:bg-[color-mix(in_oklch,var(--olive-600)_16%,transparent)] dark:text-muted-foreground",
        ],
        alert: [
          "bg-[color-mix(in_oklch,var(--warning)_10%,transparent)] text-warning-foreground",
          "dark:bg-[color-mix(in_oklch,var(--warning)_15%,transparent)]",
        ],
        error: [
          "bg-[color-mix(in_oklch,var(--destructive)_10%,transparent)] text-error-foreground",
          "dark:bg-[color-mix(in_oklch,var(--destructive)_6%,transparent)]",
        ],
      } satisfies Record<StatusChipVariant, string[]>,
    },
    defaultVariants: { variant: "neutral" },
  }
)

type StatusChipProps = React.ComponentProps<"span"> & {
  /**
   * positive: good news, such as Approved or Paid. neutral: the default,
   * such as Pending. alert: needs the person's attention, such as Review.
   * error: failed or denied. For claims, use the claim status list in the
   * record.
   * Always name the state in the chip's text, too.
   */
  variant?: StatusChipVariant
} & ChildrenProps & CommonProps<HTMLSpanElement>

/**
 * Names the state of a claim, accumulator or plan, such as "Paid" or
 * "Denied", in a small colored pill. The text carries the meaning: color
 * only supports it.
 *
 * ## Component record
 *
 * Status: **stable**. *Source: decisions.md, 2026-11-18 component record
 * review.*
 *
 * Each field ends with where its content came from. "PROPOSED" means
 * nothing in the repository decides it yet: treat it as a suggestion, not
 * a rule. "None yet" means nothing exists.
 *
 * ### Name and import path
 *
 * `StatusChip`, imported from `src/components/ui/badge` (the import line
 * is below). The same file exports `Badge` and `statusChipVariants`, the
 * class function behind the variants. StatusChip leads the "Badge and
 * status chip" docs entry, with Badge under Subcomponents. *Source:
 * badge.tsx, badge.stories.tsx.*
 *
 * ### Props
 *
 * Every prop, with its type, is in this part's Props section, including
 * the HTML span props it passes through. One default doesn't show there:
 * `variant` is "neutral" when you leave it out. *Source: badge.tsx.*
 *
 * ### Variants and states
 *
 * | Variant | Use for | Fill, light / dark | Text |
 * | --- | --- | --- | --- |
 * | positive | Good news, such as Approved or Paid | `--success` at 12% / 10% | `--teal-dark` |
 * | neutral (default) | Waiting or informational, such as Pending | `--olive-600` at 10% / 16% | `--olive-700`; dark: `--muted-foreground` |
 * | alert | Needs the person's attention | `--warning` at 10% / 15% | `--warning-foreground` |
 * | error | Failed or denied | `--destructive` at 10% / 6% | `--error-foreground` |
 *
 * Every variant: Inter 11/600, `--radius-full`, 2px top and bottom and
 * 10px side padding, on one line. 11px is below the type scale on
 * purpose. No hover, focus or disabled state: the chip isn't interactive.
 * A terracotta variant isn't decided (GAPS.md item 8).
 *
 * *Source: badge.tsx, decisions.md (2026-11-12 table and remaining
 * components; 2026-11-12 success color and chip tints accepted).*
 *
 * ### Stories
 *
 * StatusChip shares the Badge stories:
 * [components-badge-and-status-chip--all-variants-story](https://juweee.github.io/Claerio_design_system/?path=/story/components-badge-and-status-chip--all-variants-story),
 * [components-badge-and-status-chip--reference-layout](https://juweee.github.io/Claerio_design_system/?path=/story/components-badge-and-status-chip--reference-layout).
 * The Table stories show chips in table rows. *Source: badge.stories.tsx,
 * table.stories.tsx.*
 *
 * ### Tokens
 *
 * `--success`, `--teal-dark`, `--olive-600`, `--olive-700`,
 * `--muted-foreground`, `--warning`, `--warning-foreground`,
 * `--destructive`, `--error-foreground`, `--radius-full`, `--font-sans`.
 * *Source: badge.tsx class names, design-tokens.css.*
 *
 * ### Purpose
 *
 * Names the state of a claim, accumulator or plan so people can scan it.
 * *Source: badge.tsx comment.*
 *
 * ### When to use, when not to
 *
 * - Use it for the state of one item, in a table cell or next to the
 *   item's name. *Source: badge.tsx comment, stories.*
 * - For a financial benefit, such as "Save $187", use Badge. *Source:
 *   Badge description.*
 * - For a message that needs explaining or an action, use Banner. To
 *   confirm something the person just did, use Toast.
 *   *Source: decisions.md, 2026-11-18 component record review.*
 * - Don't use it as a button, link or filter. The chip has no
 *   interactive state. *Source: decisions.md, 2026-11-18 component record review.*
 *
 * ### Anatomy
 *
 * One part: a pill with a text label. No icon. *Source: badge.tsx.*
 *
 * ### Behavior
 *
 * Static: it shows what you pass and doesn't change by itself. When a
 * state changes on screen, screen readers aren't told: none yet.
 * *Source: badge.tsx.*
 *
 * ### Accessibility
 *
 * The component handles:
 * - Text contrast in both modes, including on highlighted table rows:
 *   4.58:1 (positive) and 4.56:1 (error) in dark mode, the lowest pair.
 *   *Source: decisions.md, 2026-11-12.*
 *
 * You must provide:
 * - The state in words. Screen readers read only the text, never the
 *   color. *Source: badge.tsx comment.*
 *
 * Test checklist:
 * 1. Read the chip with colors turned off: the text alone gives the
 *    state.
 * 2. A screen reader reads the chip's text in place, such as within its
 *    table row.
 * 3. The Storybook `test-run` passes, including color contrast.
 *    *Source: decisions.md, 2026-11-13.*
 *
 * ### Content guidance
 *
 * - Name the state, not the color: "Denied", not "Red". *Source:
 *   badge.tsx comment.*
 * - Keep it short: one word, or a short phrase such as "3 claims
 *   pending" or "Deductible 62% met". The chip never wraps.
 *   *Source: decisions.md, 2026-11-18 component record review.*
 * - Sentence case, no ending punctuation. *Source: decisions.md, 2026-11-18 component record review.*
 * - Claim statuses: use only these labels, with these variants.
 *
 *   | Status | Variant |
 *   | --- | --- |
 *   | Approved | positive |
 *   | Paid | positive |
 *   | Pending | neutral |
 *   | Review | alert |
 *   | Denied | error |
 *
 *   Other labels, such as "Needs info", aren't claim statuses. Add a new
 *   one to decisions.md and this list before using it. *Source:
 *   decisions.md, 2026-11-18 component record review; 2026-11-23
 *   "Approved" is a claim status.*
 * - No em dashes. *Source: CLAUDE.md content style guide.*
 *
 * ### Related components and patterns
 *
 * Badge (may sit next to a chip, 6px apart), Table (status column),
 * Banner, Toast. *Source: badge.tsx comment, stories.*
 *
 * ### Links
 *
 * decisions.md: 2026-11-12 table and remaining components (status chip
 * colors, type exceptions); 2026-11-12 success color and chip tints
 * accepted; 2026-11-23 "Approved" is a claim status. GAPS.md: item 8.
 * Figma: none yet.
 *
 * @import import { StatusChip } from "@/components/ui/badge"
 */
function StatusChip({ className, variant = "neutral", ...props }: StatusChipProps) {
  return (
    <span
      data-slot="status-chip"
      data-variant={variant}
      className={cn(statusChipVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, StatusChip, statusChipVariants }
export type { StatusChipProps }
