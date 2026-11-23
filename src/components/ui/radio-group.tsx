import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import type { ChildrenProps, CommonProps, RadixAsChildProps } from "@/lib/html-props"
import { cn } from "@/lib/utils"

/*
 * Clærio Radio group
 *
 * Sources: claude-design-reference/components/SelectionControls, the
 * states spec and decisions.md (Selection controls).
 *
 * - 18px, round.
 * - Unselected: --input fill, --muted-foreground border. Accepted on
 *   review 2026-11-12, same reason as Checkbox: an --input border
 *   measured 1.23:1 light / 1.49:1 dark against the page.
 * - Selected: 1px terracotta-600 ring and an 8px terracotta-600 dot, not
 *   a full fill. Fill switches to --card (decided 2026-11-12, following
 *   the reference over the states spec): on --input the dot measured
 *   2.60:1 in dark mode; on --card it measures 3.37:1 dark, 5.05:1 light.
 * - Focus: universal 2px --ring outline, 2px offset.
 * - Disabled: 50% opacity, not-allowed cursor.
 * - Always pair each item with a text label.
 */
/**
 * @import import { RadioGroup } from "@/components/ui/radio-group"
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  /** The selected item's value, when you control the group. Use with onValueChange. */
  value?: string | null
  /** The item selected at first, when you don't control the group. */
  defaultValue?: string
  /** Called with the new item's value when the person picks one. */
  onValueChange?: (value: string) => void
  /** Dims every item and blocks changes. */
  disabled?: boolean
  /** Marks the group as required for form submission. */
  required?: boolean
  /** Form field name. */
  name?: string
  /** Id of the form it belongs to, when it sits outside that form. */
  form?: string
  /** "vertical" or "horizontal": which arrow keys move between items. */
  orientation?: "horizontal" | "vertical"
  /** Whether arrow keys wrap from the last item to the first. Defaults to true. */
  loop?: boolean
  /** Reading direction, "ltr" or "rtl". */
  dir?: "ltr" | "rtl"
} & RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLDivElement>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

/**
 * @import import { RadioGroupItem } from "@/components/ui/radio-group"
 */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  /** Required. The value the group reports when this item is picked. */
  value: string
  /** Dims this item and blocks picking it. */
  disabled?: boolean
  /** Marks the item as required for form submission. */
  required?: boolean
} & RadixAsChildProps &
  CommonProps<HTMLButtonElement>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "inline-flex size-4.5 shrink-0 cursor-pointer items-center justify-center",
        "rounded-full border border-muted-foreground bg-input",
        "data-[state=checked]:border-terracotta-600 data-[state=checked]:bg-card",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-(--disabled-opacity)",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="block size-2 rounded-full bg-terracotta-600"
      />
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
