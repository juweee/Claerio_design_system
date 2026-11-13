import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

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
 */
function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="badge" className={cn(badgeClasses, className)} {...props} />
}

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
      },
    },
    defaultVariants: { variant: "neutral" },
  }
)

type StatusChipProps = React.ComponentProps<"span"> & VariantProps<typeof statusChipVariants>

function StatusChip({ className, variant, ...props }: StatusChipProps) {
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
