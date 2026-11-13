import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/*
 * Clærio Progress
 *
 * Source: claude-design-reference/components/Progress.
 *
 * - Shows how far along an accumulator is, such as a deductible.
 * - --progress-height (8px), round ends. Track --progress-track, fill
 *   --progress-fill (Teal).
 * - Always show the value in words beside it. ProgressField adds a label
 *   (label style, 12/600) and the value in words (body-small, muted),
 *   8px above the bar, and gives both to screen readers.
 */

function Progress({
  className,
  value = 0,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { value?: number }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn("h-(--progress-height) overflow-hidden rounded-full bg-progress-track", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-fill"
        className="h-full rounded-full bg-progress-fill"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </ProgressPrimitive.Root>
  )
}

type ProgressFieldProps = {
  label: string
  /** The value in words, such as "62% met". */
  valueText: string
  value: number
  className?: string
}

/**
 * Shows progress toward a limit, such as a deductible or out-of-pocket
 * maximum, with a label and the value in words.
 */
function ProgressField({ label, valueText, value, className }: ProgressFieldProps) {
  const id = React.useId()
  return (
    <div data-slot="progress-field" className={cn("font-sans", className)}>
      <div className="mb-2 flex justify-between gap-3">
        <span id={id} className="text-label text-foreground">
          {label}
        </span>
        <span className="text-body-small text-muted-foreground">{valueText}</span>
      </div>
      <Progress value={value} aria-labelledby={id} getValueLabel={() => valueText} />
    </div>
  )
}

export { Progress, ProgressField }
export type { ProgressFieldProps }
