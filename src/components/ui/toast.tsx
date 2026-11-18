import * as React from "react"
import { cva } from "class-variance-authority"
import { Toast as ToastPrimitive } from "radix-ui"
import { CheckIcon, ExclamationMarkIcon } from "@phosphor-icons/react"

import type { ButtonElementProps, ChildrenProps, CommonProps, RadixAsChildProps } from "@/lib/html-props"
import { cn } from "@/lib/utils"

/*
 * Clærio Toast
 *
 * Sources: the toast spec (retired 2026-11-12), decisions.md (Toast) and
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
 * - Icon: 20px circle. Success: --success (= --teal) with a Cream check,
 *   3.78:1 (accepted on review 2026-11-12: one color for "good",
 *   matching positive status chips). Earlier: --primary.
 *   Error: --destructive with --destructive-foreground. Phosphor Bold
 *   12px glyphs, matching the checkbox.
 * - Title: 14/600 in --foreground.
 * - Description: body-small (12/400) in --muted-foreground, 2px below
 *   the title (decided 2026-11-12; the spec's 13px is off the type scale).
 * - No open or close animation: none is specified.
 *
 * Action
 * - 28px tall, 12px side padding, radius-md, 1px --input-border
 *   (= --olive-500; earlier --input, below 3:1) on
 *   --popover, Inter 14/500 per the button hard rule (decided 2026-11-12;
 *   the spec said 13/600). Hover: --accent. Radix requires altText,
 *   which tells screen reader users how to do the same thing without the
 *   toast.
 */

type ToastProviderProps = Omit<
  React.ComponentProps<typeof ToastPrimitive.Provider>,
  "duration" | "label" | "swipeDirection"
> & {
  /** Milliseconds before each toast closes. Defaults to 5000. A Toast's own duration overrides it. */
  duration?: number
  /** Names the notification region for screen readers. Defaults to "Notification". */
  label?: string
  /** The direction a person swipes to close a toast. Defaults to "right", to match the bottom-right viewport. */
  swipeDirection?: "right" | "left" | "up" | "down"
  /** Pixels a person must swipe before the toast closes. Defaults to 50. */
  swipeThreshold?: number
  /** Where the screen reader announcer renders. Defaults to document.body. */
  announcerContainer?: Element | DocumentFragment
} & ChildrenProps

/**
 * Wrap your app once in a ToastProvider, with one ToastViewport inside it.
 * Then render a Toast anywhere inside the provider and open it with its
 * `open` and `onOpenChange` props.
 *
 * @import import { ToastProvider } from "@/components/ui/toast"
 */
function ToastProvider(props: ToastProviderProps) {
  return <ToastPrimitive.Provider {...props} />
}

/**
 * The fixed bottom-right region where toasts appear. Render one inside
 * ToastProvider, after your content.
 *
 * @import import { ToastViewport } from "@/components/ui/toast"
 */
function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport> & {
  /** Keys that move focus to the toasts. Defaults to ["F8"]. */
  hotkey?: string[]
  /** Names the region for screen readers. "{hotkey}" is replaced with the keys. Defaults to "Notifications ({hotkey})". */
  label?: string
} & RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLOListElement>) {
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

/** The 2 toast variants. Listed here so the docs show each value. */
type ToastVariant = "success" | "error"

const toastIconVariants = cva(
  "inline-flex size-5 shrink-0 items-center justify-center rounded-full [&_svg]:size-3",
  {
    variants: {
      variant: {
        success: "bg-success text-primary-foreground",
        error: "bg-destructive text-destructive-foreground",
      } satisfies Record<ToastVariant, string>,
    },
    defaultVariants: { variant: "success" },
  }
)

/** The event Radix passes to the swipe callbacks. */
type ToastSwipeEvent = Parameters<NonNullable<ToastPrimitive.ToastProps["onSwipeStart"]>>[0]

type ToastProps = Omit<
  React.ComponentProps<typeof ToastPrimitive.Root>,
  "open" | "defaultOpen" | "onOpenChange" | "duration"
> & {
  /** success: a teal check, the default. error: a red exclamation mark. */
  variant?: ToastVariant
  /** Whether the toast is showing, when you control it. Use with onOpenChange. */
  open?: boolean
  /** Whether the toast shows when it first renders, when you don't control it. Defaults to true. */
  defaultOpen?: boolean
  /** Called with false when the toast closes: after its timer, on Escape, on swipe, or when its action is clicked. */
  onOpenChange?: (open: boolean) => void
  /** Milliseconds before this toast closes. Overrides the ToastProvider duration. */
  duration?: number
  /** "foreground" (the default) is announced right away. "background" waits politely. */
  type?: "foreground" | "background"
  /** Called when the person presses Escape. Call event.preventDefault() to keep it open. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /** Called when the close timer pauses, on hover or focus. */
  onPause?: () => void
  /** Called when the close timer resumes. */
  onResume?: () => void
  /** Called when a swipe starts. */
  onSwipeStart?(event: ToastSwipeEvent): void
  /** Called as a swipe moves. */
  onSwipeMove?(event: ToastSwipeEvent): void
  /** Called when a swipe ends without closing the toast. */
  onSwipeCancel?(event: ToastSwipeEvent): void
  /** Called when a swipe ends. */
  onSwipeEnd?(event: ToastSwipeEvent): void
  /** Keeps the toast mounted while closed, for animation libraries. */
  forceMount?: true
} & RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLLIElement>

/**
 * A short confirmation at the bottom right that closes on its own after 5
 * seconds. It pauses on hover or focus and is announced to screen readers.
 *
 * @import import { Toast } from "@/components/ui/toast"
 */
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

/**
 * Wraps the title and description so they share the space beside the icon.
 *
 * @import import { ToastBody } from "@/components/ui/toast"
 */
function ToastBody({ className, ...props }: React.ComponentProps<"div"> & ChildrenProps & CommonProps<HTMLDivElement>) {
  return <div data-slot="toast-body" className={cn("min-w-0 flex-1", className)} {...props} />
}

/**
 * One short line, such as "Dispute filed".
 *
 * @import import { ToastTitle } from "@/components/ui/toast"
 */
function ToastTitle({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title> & RadixAsChildProps & ChildrenProps & CommonProps<HTMLDivElement>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-body font-[600] text-foreground", className)}
      {...props}
    />
  )
}

/**
 * One sentence of detail under the title.
 *
 * @import import { ToastDescription } from "@/components/ui/toast"
 */
function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description> & RadixAsChildProps & ChildrenProps & CommonProps<HTMLDivElement>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("mt-0.5 text-body-small text-muted-foreground", className)}
      {...props}
    />
  )
}

/**
 * An optional button inside the toast, such as Undo. Clicking it closes
 * the toast.
 *
 * @import import { ToastAction } from "@/components/ui/toast"
 */
function ToastAction({
  className,
  ...props
}: Omit<React.ComponentProps<typeof ToastPrimitive.Action>, "altText"> & {
  /**
   * Required. Tells screen reader users another way to do the same thing,
   * because they may not reach the toast in time. For example: "Open the
   * claim to withdraw the dispute".
   */
  altText: string
} & ButtonElementProps &
  RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLButtonElement>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "inline-flex h-7 shrink-0 cursor-pointer items-center rounded-md border border-input-border bg-popover px-3",
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
