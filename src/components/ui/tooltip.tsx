import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/*
 * Clærio Tooltip
 *
 * Source: claude-design-reference/components/Tooltip. Built on Radix
 * Tooltip: it opens on hover or keyboard focus and closes on Escape.
 *
 * - --tooltip-background (Charcoal) with --tooltip-foreground (Greige)
 *   text, body-small (12/400), radius-sm. Same in both modes.
 * - 4 × 8 padding, 4px from the trigger (decided 2026-11-12; the
 *   reference used 6 × 10 and 6px, off the spacing scale).
 * - Keep the text to one short phrase.
 * - TooltipTerm marks the trigger with a dotted --muted-foreground
 *   underline and makes it reachable with the keyboard.
 */

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-sm bg-tooltip-background px-2 py-1 font-sans text-body-small text-tooltip-foreground",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}

/** A term with a dotted underline that shows a tooltip on hover or focus. */
function TooltipTerm({
  tip,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { tip: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          data-slot="tooltip-term"
          tabIndex={0}
          className={cn(
            "cursor-help border-b border-dotted border-muted-foreground",
            "focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
            className
          )}
          {...props}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent>{tip}</TooltipContent>
    </Tooltip>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTerm, TooltipTrigger }
