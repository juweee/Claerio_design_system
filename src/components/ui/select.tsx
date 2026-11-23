import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react"

import type { ChildrenProps, CommonProps, RadixAsChildProps, RadixDismissProps, RadixPopperProps } from "@/lib/html-props"
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
/** Radix Select root props that Select and FilterSelect pass through. */
type SelectRootProps = {
  /** Whether the menu is open, when you control it. Use with onOpenChange. */
  open?: boolean
  /** Whether the menu starts open, when you don't control it. */
  defaultOpen?: boolean
  /** Called with the new open state. */
  onOpenChange?: (open: boolean) => void
  /** Dims the trigger and blocks changes. */
  disabled?: boolean
  /** Marks the select as required for form submission. */
  required?: boolean
  /** Form field name. */
  name?: string
  /** Browser autofill hint. */
  autoComplete?: string
  /** Id of the form it belongs to, when it sits outside that form. */
  form?: string
  /** Reading direction, "ltr" or "rtl". */
  dir?: "ltr" | "rtl"
}

/**
 * Lets the person pick one option from a menu. The Selection controls page
 * also covers Checkbox, RadioGroup and Switch.
 *
 * @import import { Select } from "@/components/ui/select"
 */
function Select(
  props: Omit<React.ComponentProps<typeof SelectPrimitive.Root>, "value" | "defaultValue" | "onValueChange"> &
    SelectRootProps &
    ChildrenProps & {
    /** The selected item's value, when you control the select. Use with onValueChange. */
    value?: string
    /** The item selected at first, when you don't control the select. */
    defaultValue?: string
    /** Called with the new item's value when the person picks one. */
    onValueChange?: (value: string) => void
  }
) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

/**
 * @import import { SelectValue } from "@/components/ui/select"
 */
function SelectValue(
  props: React.ComponentProps<typeof SelectPrimitive.Value> & {
    /** Shown while nothing is selected. */
    placeholder?: React.ReactNode
  } & RadixAsChildProps &
    ChildrenProps & CommonProps<HTMLSpanElement>
) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

/**
 * @import import { SelectTrigger } from "@/components/ui/select"
 */
function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  /** Dims the trigger and blocks opening. */
  disabled?: boolean
} & RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLButtonElement>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "inline-flex h-(--control-height-sm) cursor-pointer items-center justify-between gap-2 whitespace-nowrap",
        "rounded-md border border-input-border bg-background px-3",
        "font-sans text-body leading-none text-foreground",
        "data-[placeholder]:text-muted-foreground",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-(--disabled-opacity)",
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

/**
 * @import import { SelectContent } from "@/components/ui/select"
 */
function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 4,
  ...props
}: Omit<React.ComponentProps<typeof SelectPrimitive.Content>, "position" | "sideOffset"> & {
  /** "popper" (the default) opens the menu below the trigger. "item-aligned" lines the selected item up with the trigger. */
  position?: "popper" | "item-aligned"
  /** Pixels between the trigger and the menu. Defaults to 4. */
  sideOffset?: number
  /** Called when the menu closes and returns focus to the trigger. Call event.preventDefault() to manage focus yourself. */
  onCloseAutoFocus?: (event: Event) => void
  /** Keeps the menu mounted while closed, for animation libraries. */
  forceMount?: true
} & RadixPopperProps &
  RadixDismissProps &
  RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLDivElement>) {
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

/**
 * @import import { SelectItem } from "@/components/ui/select"
 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
  /** Required. The value Select reports when this item is picked. Must not be empty. */
  value: string
  /** Dims this item and blocks picking it. */
  disabled?: boolean
  /** Text used for type-ahead, when the children aren't plain text. */
  textValue?: string
} & RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLDivElement>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-2.5 py-2 outline-none select-none",
        "data-[highlighted]:bg-accent",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-(--disabled-opacity)",
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
export type { SelectRootProps }
