import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

/*
 * Clærio Select
 *
 * Sources: claude-design-reference/components/SelectionControls and the
 * states spec (Select menu).
 *
 * Trigger
 * - 32px tall, 12px side padding, 1px --input-border (=
 *   --olive-500; earlier --input, below 3:1), radius-md,
 *   --background fill, Inter 14/400 in --foreground.
 * - Phosphor CaretDown, 20px, matching body text per the iconography
 *   guideline.
 * - Focus: universal 2px --ring outline, 2px offset.
 * - Disabled: 50% opacity, not-allowed cursor.
 *
 * Menu
 * - --popover surface, 1px --border, radius-md, 4px inset,
 *   shadow-overlay. Opens 4px below the trigger, at least as wide.
 * - Items: 8 × 10 padding, radius-sm (8px menu radius minus 4px inset),
 *   Inter 14/400. Hover and keyboard highlight: --accent.
 * - Selected item: a terracotta check before the text (terracotta-400 in
 *   dark mode, per the reference). 8px gap: the reference used 6px,
 *   which is off the spacing scale.
 */
/**
 * Lets the person pick one option from a menu. The Selection controls page
 * also covers Checkbox, RadioGroup and Switch.
 */
function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "inline-flex h-8 cursor-pointer items-center justify-between gap-2 whitespace-nowrap",
        "rounded-md border border-input-border bg-background px-3",
        "font-sans text-body leading-none text-foreground",
        "data-[placeholder]:text-muted-foreground",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <CaretDownIcon aria-hidden className="size-5 text-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden",
          "rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-overlay",
          "font-sans text-body",
          className
        )}
        {...props}
      >
        <SelectPrimitive.Viewport data-slot="select-viewport">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-2.5 py-2 outline-none select-none",
        "data-[highlighted]:bg-accent",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator>
        <CheckIcon aria-hidden className="size-4 text-terracotta-600 dark:text-terracotta-400" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
