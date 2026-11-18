import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import type { ButtonElementProps, ChildrenProps, CommonProps, RadixAsChildProps, RadixDismissProps } from "@/lib/html-props"
import { cn } from "@/lib/utils"

/*
 * Clærio Modal
 *
 * Source: claude-design-reference/components/Modal. No separate component
 * spec exists; built to the README and preview, and reviewed
 * 2026-11-12. Built on Radix Dialog: it
 * moves focus into the modal, keeps it there, closes on Escape, and
 * returns focus to the trigger when it closes.
 *
 * - Ask for a decision before the person can continue.
 * - The page dims with --overlay.
 * - The dialog sits on --card, radius-lg, space-4 padding, up to
 *   --modal-max-width (480px), with --shadow-modal (none in dark mode).
 * - Title: a question, in heading-2. Description: one or two sentences
 *   of consequence, body, 8px below.
 * - Footer, 16px below: Cancel (secondary) then the confirming action
 *   (primary), rightmost, 8px apart.
 */

type ModalProps = Omit<React.ComponentProps<typeof DialogPrimitive.Root>, "open" | "defaultOpen" | "onOpenChange"> & {
  /** Whether the modal is open, when you control it. Use with onOpenChange. */
  open?: boolean
  /** Whether the modal starts open, when you don't control it. */
  defaultOpen?: boolean
  /** Called with the new open state when the modal opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Blocks the rest of the page while open. Defaults to true. Keep it on. */
  modal?: boolean
} & ChildrenProps

/**
 * The root of a modal. Wraps a ModalTrigger and a ModalContent and holds
 * the open state.
 *
 * @import import { Modal } from "@/components/ui/modal"
 */
function Modal(props: ModalProps) {
  return <DialogPrimitive.Root {...props} />
}

/**
 * Opens the modal. Pass a Button as its child and set `asChild`, so the
 * Button keeps its own styles.
 *
 * @import import { ModalTrigger } from "@/components/ui/modal"
 */
function ModalTrigger(
  props: Omit<React.ComponentProps<typeof DialogPrimitive.Trigger>, "asChild"> & {
    /** Use the child element, such as a Button, as the trigger instead of a plain button. */
    asChild?: boolean
  } & ButtonElementProps &
    ChildrenProps & CommonProps<HTMLButtonElement>
) {
  return <DialogPrimitive.Trigger {...props} />
}

/**
 * Closes the modal. Wrap the Cancel button in it, with `asChild`.
 *
 * @import import { ModalClose } from "@/components/ui/modal"
 */
function ModalClose(
  props: Omit<React.ComponentProps<typeof DialogPrimitive.Close>, "asChild"> & {
    /** Use the child element, such as a Button, as the close control instead of a plain button. */
    asChild?: boolean
  } & ButtonElementProps &
    ChildrenProps & CommonProps<HTMLButtonElement>
) {
  return <DialogPrimitive.Close {...props} />
}

/**
 * Asks for a decision before the person can continue. The title is a
 * question, the description explains the consequence, and the footer shows
 * Cancel, then the confirming action. Focus stays inside until it closes.
 *
 * @import import { ModalContent } from "@/components/ui/modal"
 */
function ModalContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  /** Called when the modal opens and moves focus inside. Call event.preventDefault() to manage focus yourself. */
  onOpenAutoFocus?: (event: Event) => void
  /** Called when the modal closes and returns focus to the trigger. Call event.preventDefault() to manage focus yourself. */
  onCloseAutoFocus?: (event: Event) => void
  /** Called on any pointer down or focus outside. Call event.preventDefault() to keep it open. */
  onInteractOutside?: (
    event: CustomEvent<{ originalEvent: PointerEvent }> | CustomEvent<{ originalEvent: FocusEvent }>
  ) => void
  /** Called when focus moves outside. Call event.preventDefault() to keep it open. */
  onFocusOutside?: (event: CustomEvent<{ originalEvent: FocusEvent }>) => void
  /** Keeps the content mounted while closed, for animation libraries. */
  forceMount?: true
} & RadixDismissProps &
  RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLDivElement>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay data-slot="modal-overlay" className="fixed inset-0 z-50 bg-overlay" />
      <DialogPrimitive.Content
        data-slot="modal-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[calc(100%-32px)] max-w-(--modal-max-width) -translate-x-1/2 -translate-y-1/2",
          "rounded-lg bg-card p-4 font-sans text-card-foreground shadow-modal",
          "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

/**
 * @import import { ModalTitle } from "@/components/ui/modal"
 */
function ModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & RadixAsChildProps & ChildrenProps & CommonProps<HTMLHeadingElement>) {
  return <DialogPrimitive.Title data-slot="modal-title" className={cn("text-heading-2", className)} {...props} />
}

/**
 * @import import { ModalDescription } from "@/components/ui/modal"
 */
function ModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description> & RadixAsChildProps & ChildrenProps & CommonProps<HTMLParagraphElement>) {
  return (
    <DialogPrimitive.Description
      data-slot="modal-description"
      className={cn("mt-2 text-body", className)}
      {...props}
    />
  )
}

/**
 * @import import { ModalFooter } from "@/components/ui/modal"
 */
function ModalFooter({ className, ...props }: React.ComponentProps<"div"> & ChildrenProps & CommonProps<HTMLDivElement>) {
  return <div data-slot="modal-footer" className={cn("mt-4 flex justify-end gap-2", className)} {...props} />
}

export { Modal, ModalClose, ModalContent, ModalDescription, ModalFooter, ModalTitle, ModalTrigger }
