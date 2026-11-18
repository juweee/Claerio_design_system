import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"

import type { ButtonElementProps, ChildrenProps, CommonProps } from "@/lib/html-props"
import { cn } from "@/lib/utils"

/*
 * Clærio Button
 *
 * Sources: decisions.md (Buttons), CLAUDE.md hard rules,
 * claude-design-reference/components/Button.
 *
 * - 40px tall, 16px side padding, radius-md, Inter 14/500.
 * - Primary hover: terracotta-700 in both modes. No opacity hover.
 * - Destructive hover: --destructive-hover in light mode, 90%
 *   opacity in dark mode.
 * - Ghost and link text: terracotta-400 in dark mode.
 * - Secondary reads --foreground for border and text, never brand Charcoal.
 * - Disabled: 50% opacity and not-allowed cursor. Hover styles are skipped
 *   while disabled, so the color never changes.
 * - Focus visible: 2px --ring outline, 2px offset.
 * - No amber or teal on buttons.
 */
/** The 5 button variants. Listed here so the docs show each value. */
type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "link"

const buttonVariants = cva(
  [
    "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md border border-transparent px-4 font-sans text-button",
    "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
    // Icons: Phosphor, 20px to match 14px body text.
    "[&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-primary-foreground",
          "not-disabled:not-aria-disabled:hover:bg-terracotta-700",
        ],
        secondary: [
          "border-foreground bg-transparent text-foreground",
          "not-disabled:not-aria-disabled:hover:bg-accent",
        ],
        ghost: [
          "bg-transparent text-primary dark:text-terracotta-400",
          "not-disabled:not-aria-disabled:hover:bg-accent",
        ],
        destructive: [
          "bg-destructive text-destructive-foreground",
          // Light: darker --destructive-hover. Dark: 90% opacity.
          "not-disabled:not-aria-disabled:hover:bg-destructive-hover",
          "dark:not-disabled:not-aria-disabled:hover:bg-destructive/90",
        ],
        link: [
          "bg-transparent px-0 text-primary dark:text-terracotta-400",
          "not-disabled:not-aria-disabled:hover:underline",
        ],
      } satisfies Record<ButtonVariant, string[]>,
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> & {
    /**
     * primary: the main action, one per view. secondary: other actions.
     * ghost: low-emphasis actions, such as Dismiss. destructive: deletes or
     * cancels something. link: a text-only action inside content.
     */
    variant?: ButtonVariant
    /** Render the child element (for example a router link) with button styles. */
    asChild?: boolean
  } & ButtonElementProps &
  ChildrenProps & CommonProps<HTMLButtonElement>

/**
 * Triggers an action. Comes in 5 variants: primary for the main action,
 * secondary, ghost, destructive and link. Put the primary button rightmost,
 * with Cancel to its left.
 *
 * @import import { Button } from "@/components/ui/button"
 */
function Button({
  className,
  variant = "primary",
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
