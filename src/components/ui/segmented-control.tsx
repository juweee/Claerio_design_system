import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/*
 * Clærio Segmented control
 *
 * Sources: specs/controls-component-spec.css (segmented control),
 * decisions.md (Segmented control) and
 * claude-design-reference/components/SegmentedControl.
 *
 * - Changes how the same content is displayed. Place it inline at the
 *   top right of the card title row. Neutral only: never amber.
 * - Track: 32px, 2px padding and gap, 1px --border, radius-md, --muted
 *   fill (--background in dark mode).
 * - Options: 0 × 10 padding, 6px radius (nested-radius rule: 8 − 2),
 *   12/500 in --muted-foreground (kept from the spec, decided
 *   2026-11-12). Hover: --foreground text.
 * - Active option: raised on --card with a hairline --border, 600 in
 *   --foreground. No shadow.
 * - Built on Radix ToggleGroup: arrow keys move between options. One
 *   option is always selected.
 */

type SegmentedControlProps = Omit<
  React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

function SegmentedControl({
  className,
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: SegmentedControlProps) {
  const [inner, setInner] = React.useState(defaultValue ?? "")
  const value = valueProp ?? inner
  return (
    <ToggleGroupPrimitive.Root
      data-slot="segmented-control"
      type="single"
      value={value}
      onValueChange={(next) => {
        if (!next) return // keep one option selected
        if (valueProp === undefined) setInner(next)
        onValueChange?.(next)
      }}
      className={cn(
        "inline-flex h-8 items-stretch gap-0.5 rounded-md border border-border bg-muted p-0.5 dark:bg-background",
        className
      )}
      {...props}
    />
  )
}

function SegmentedControlOption({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="segmented-control-option"
      className={cn(
        "flex cursor-pointer items-center rounded-[6px] border border-transparent px-2.5",
        "font-sans text-body-small leading-none font-[500] text-muted-foreground hover:text-foreground",
        "data-[state=on]:border-border data-[state=on]:bg-card data-[state=on]:font-[600] data-[state=on]:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { SegmentedControl, SegmentedControlOption }
export type { SegmentedControlProps }
