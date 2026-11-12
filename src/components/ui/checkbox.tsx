import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon, MinusIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

/*
 * Clærio Checkbox
 *
 * Sources: claude-design-reference/components/SelectionControls, the
 * states spec and decisions.md (Selection controls).
 *
 * - 18px, radius-sm.
 * - Unchecked: --input fill. Border: --muted-foreground. PROPOSED
 *   2026-11-12: decisions.md sets the border to --input, which measures
 *   1.23:1 light / 1.49:1 dark against the page (3:1 guideline).
 *   --muted-foreground measures 5.05:1 light / 7.30:1 dark.
 * - Checked or indeterminate: terracotta-600 fill and border, Cream
 *   (--primary-foreground) check or dash. Phosphor Bold at 12px, matching
 *   the reference glyphs (decided 2026-11-12).
 * - Focus: universal 2px --ring outline, 2px offset.
 * - Disabled: 50% opacity, not-allowed cursor.
 * - Always pair with a text label.
 */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group inline-flex size-4.5 shrink-0 cursor-pointer items-center justify-center",
        "rounded-sm border border-muted-foreground bg-input text-primary-foreground",
        "data-[state=checked]:border-terracotta-600 data-[state=checked]:bg-terracotta-600",
        "data-[state=indeterminate]:border-terracotta-600 data-[state=indeterminate]:bg-terracotta-600",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex items-center justify-center">
        <CheckIcon weight="bold" aria-hidden className="size-3 group-data-[state=indeterminate]:hidden" />
        <MinusIcon weight="bold" aria-hidden className="hidden size-3 group-data-[state=indeterminate]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
