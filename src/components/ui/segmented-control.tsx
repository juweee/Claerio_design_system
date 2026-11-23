import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import type { ChildrenProps, CommonProps, RadixAsChildProps } from "@/lib/html-props"
import { cn } from "@/lib/utils"

/*
 * Clærio Segmented control
 *
 * Sources: the controls spec's segmented control (retired 2026-11-12),
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
  /** The selected option's value, when you control it. Use with onValueChange. */
  value?: string
  /** The option selected at first, when you don't control it. */
  defaultValue?: string
  /** Called with the new option's value. One option always stays selected. */
  onValueChange?: (value: string) => void
  /** Dims every option and blocks changes. */
  disabled?: boolean
  /** Whether arrow keys move between options. Defaults to true. */
  rovingFocus?: boolean
  /** Whether arrow keys wrap from the last option to the first. Defaults to true. */
  loop?: boolean
  /** "horizontal" or "vertical": which arrow keys move between options. */
  orientation?: "horizontal" | "vertical"
  /** Reading direction, "ltr" or "rtl". */
  dir?: "ltr" | "rtl"
} & RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLDivElement>

/**
 * Switches between a few views of the same content, such as chart types. Use
 * it for view toggles, not navigation. It stays neutral and never uses
 * amber.
 *
 * @import import { SegmentedControl } from "@/components/ui/segmented-control"
 */
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
        "inline-flex h-(--control-height-sm) items-stretch gap-0.5 rounded-md border border-border bg-muted p-0.5 dark:bg-background",
        className
      )}
      {...props}
    />
  )
}

/**
 * @import import { SegmentedControlOption } from "@/components/ui/segmented-control"
 */
function SegmentedControlOption({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & {
  /** Required. The value the control reports when this option is picked. */
  value: string
  /** Dims this option and blocks picking it. */
  disabled?: boolean
} & RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLButtonElement>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="segmented-control-option"
      className={cn(
        "flex cursor-pointer items-center rounded-[6px] border border-transparent px-2.5",
        "font-sans text-body-small leading-none font-[500] text-muted-foreground hover:text-foreground",
        "data-[state=on]:border-border data-[state=on]:bg-card data-[state=on]:font-[600] data-[state=on]:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-(--disabled-opacity)",
        className
      )}
      {...props}
    />
  )
}

export { SegmentedControl, SegmentedControlOption }
export type { SegmentedControlProps }
