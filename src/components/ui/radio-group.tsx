import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/*
 * Clærio Radio group
 *
 * Sources: claude-design-reference/components/SelectionControls, the
 * states spec and decisions.md (Selection controls).
 *
 * - 18px, round.
 * - Unselected: --input fill. Border: --muted-foreground. PROPOSED
 *   2026-11-12, same reason as Checkbox: --input borders measure 1.23:1
 *   light / 1.49:1 dark against the page.
 * - Selected: 1px terracotta-600 ring and an 8px terracotta-600 dot, not
 *   a full fill. Fill switches to --card (decided 2026-11-12, following
 *   the reference over the states spec): on --input the dot measured
 *   2.60:1 in dark mode; on --card it measures 3.37:1 dark, 5.05:1 light.
 * - Focus: universal 2px --ring outline, 2px offset.
 * - Disabled: 50% opacity, not-allowed cursor.
 * - Always pair each item with a text label.
 */
function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "inline-flex size-4.5 shrink-0 cursor-pointer items-center justify-center",
        "rounded-full border border-muted-foreground bg-input",
        "data-[state=checked]:border-terracotta-600 data-[state=checked]:bg-card",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
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
