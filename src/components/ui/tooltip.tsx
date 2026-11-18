import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import type { ButtonElementProps, ChildrenProps, CommonProps, RadixAsChildProps, RadixDismissProps, RadixPopperProps } from "@/lib/html-props"
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

/**
 * Wrap your app, or the part that has tooltips, once in a TooltipProvider.
 * It sets the shared open delay.
 *
 * @import import { TooltipProvider } from "@/components/ui/tooltip"
 */
function TooltipProvider(
  props: Omit<React.ComponentProps<typeof TooltipPrimitive.Provider>, "delayDuration"> & {
    /** Milliseconds from hover to open. Defaults to 700. */
    delayDuration?: number
    /** Milliseconds after one tooltip closes during which the next opens without delay. Defaults to 300. */
    skipDelayDuration?: number
    /** Closes the tooltip as soon as the pointer leaves the trigger, even onto the tooltip. */
    disableHoverableContent?: boolean
    /** Required. The part of the app that has tooltips. */
    children: React.ReactNode
  }
) {
  return <TooltipPrimitive.Provider {...props} />
}

/**
 * The root of one tooltip. Wraps a TooltipTrigger (or TooltipTerm) and a
 * TooltipContent.
 *
 * @import import { Tooltip } from "@/components/ui/tooltip"
 */
function Tooltip(
  props: Omit<React.ComponentProps<typeof TooltipPrimitive.Root>, "open" | "defaultOpen" | "onOpenChange"> & {
    /** Whether the tooltip is showing, when you control it. Use with onOpenChange. */
    open?: boolean
    /** Whether the tooltip starts open, when you don't control it. */
    defaultOpen?: boolean
    /** Called with the new open state. */
    onOpenChange?: (open: boolean) => void
    /** Milliseconds from hover to open, for this tooltip only. Overrides TooltipProvider. */
    delayDuration?: number
    /** Closes the tooltip as soon as the pointer leaves the trigger, even onto the tooltip. */
    disableHoverableContent?: boolean
  } & ChildrenProps
) {
  return <TooltipPrimitive.Root {...props} />
}

/**
 * The element the tooltip describes. Set `asChild` to use your own element.
 * For a term in running text, use TooltipTerm instead.
 *
 * @import import { TooltipTrigger } from "@/components/ui/tooltip"
 */
function TooltipTrigger(
  props: Omit<React.ComponentProps<typeof TooltipPrimitive.Trigger>, "asChild"> & {
    /** Use the child element as the trigger instead of a plain button. */
    asChild?: boolean
  } & ButtonElementProps &
    ChildrenProps & CommonProps<HTMLButtonElement>
) {
  return <TooltipPrimitive.Trigger {...props} />
}

/**
 * A short, one-phrase hint that appears on hover or keyboard focus. Use
 * TooltipTerm to mark a term with a dotted underline.
 *
 * @import import { TooltipContent } from "@/components/ui/tooltip"
 */
function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, "sideOffset"> & {
  /** Pixels between the trigger and the tooltip. Defaults to 4. */
  sideOffset?: number
  /** Keeps the tooltip mounted while closed, for animation libraries. */
  forceMount?: true
} & RadixPopperProps &
  RadixDismissProps &
  RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLDivElement>) {
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

/**
 * A term with a dotted underline that shows a tooltip on hover or focus.
 *
 * @import import { TooltipTerm } from "@/components/ui/tooltip"
 */
function TooltipTerm({
  tip,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  /** Required. The tooltip text. */
  tip: React.ReactNode
} & ChildrenProps &
  CommonProps<HTMLSpanElement>) {
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
