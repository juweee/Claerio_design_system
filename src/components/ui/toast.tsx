import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toast as ToastPrimitive } from "radix-ui"
import { CheckIcon, ExclamationMarkIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

/*
 * Clærio Toast
 *
 * Sources: specs/toast-component-spec.css, decisions.md (Toast) and
 * claude-design-reference/components/Toast. Built on Radix Toast, which
 * pauses the timer while a toast is hovered or focused, closes on Escape
 * or swipe, and announces the toast to screen readers.
 *
 * Viewport
 * - Fixed bottom-right with a 24px inset, 380px wide (never wider than
 *   the screen minus 48px). Stacked toasts sit 8px apart (space-2; not
 *   defined in the spec).
 *
 * Toast
 * - --popover surface, 1px --border, radius-lg, shadow-overlay, 16px
 *   padding, 12px gap.
 * - Icon: 20px circle. Success: --success (PROPOSED, = --teal) with a
 *   Cream check, 3.78:1 (decided 2026-11-12: one color for "good",
 *   matching positive status chips). Earlier: --primary.
 *   Error: --destructive with --destructive-foreground. Phosphor Bold
 *   12px glyphs, matching the checkbox.
 * - Title: 14/600 in --foreground.
 * - Description: body-small (12/400) in --muted-foreground, 2px below
 *   the title (decided 2026-11-12; the spec's 13px is off the type scale).
 * - No open or close animation: none is specified.
 *
 * Action
 * - 28px tall, 12px side padding, radius-md, 1px --input border on
 *   --popover, Inter 14/500 per the button hard rule (decided 2026-11-12;
 *   the spec said 13/600). Hover: --accent. Radix requires altText,
 *   which tells screen reader users how to do the same thing without the
 *   toast.
 */

const ToastProvider = ToastPrimitive.Provider

function ToastViewport({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed right-6 bottom-6 z-100 m-0 flex w-[380px] max-w-[calc(100vw-48px)] list-none flex-col gap-2 p-0 outline-none",
        className
      )}
      {...props}
    />
  )
}

const toastIconVariants = cva(
  "inline-flex size-5 shrink-0 items-center justify-center rounded-full [&_svg]:size-3",
  {
    variants: {
      variant: {
        success: "bg-success text-primary-foreground",
        error: "bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: { variant: "success" },
  }
)

type ToastProps = React.ComponentProps<typeof ToastPrimitive.Root> &
  VariantProps<typeof toastIconVariants>

function Toast({ className, variant = "success", children, ...props }: ToastProps) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-variant={variant}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border border-border bg-popover p-4",
        "font-sans text-popover-foreground shadow-overlay",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    >
      <span data-slot="toast-icon" aria-hidden className={toastIconVariants({ variant })}>
        {variant === "error" ? <ExclamationMarkIcon weight="bold" /> : <CheckIcon weight="bold" />}
      </span>
      {children}
    </ToastPrimitive.Root>
  )
}

/** Wraps the title and description so they share the space beside the icon. */
function ToastBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="toast-body" className={cn("min-w-0 flex-1", className)} {...props} />
}

function ToastTitle({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-body font-[600] text-foreground", className)}
      {...props}
    />
  )
}

function ToastDescription({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("mt-0.5 text-body-small text-muted-foreground", className)}
      {...props}
    />
  )
}

function ToastAction({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "inline-flex h-7 shrink-0 cursor-pointer items-center rounded-md border border-input bg-popover px-3",
        "font-sans text-button text-foreground",
        "hover:bg-accent",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  )
}

export { Toast, ToastAction, ToastBody, ToastDescription, ToastProvider, ToastTitle, ToastViewport }
export type { ToastProps }
