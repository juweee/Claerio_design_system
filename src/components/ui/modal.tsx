import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

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

const Modal = DialogPrimitive.Root
const ModalTrigger = DialogPrimitive.Trigger
const ModalClose = DialogPrimitive.Close

function ModalContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
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

function ModalTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="modal-title" className={cn("text-heading-2", className)} {...props} />
}

function ModalDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="modal-description"
      className={cn("mt-2 text-body", className)}
      {...props}
    />
  )
}

function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="modal-footer" className={cn("mt-4 flex justify-end gap-2", className)} {...props} />
}

export { Modal, ModalClose, ModalContent, ModalDescription, ModalFooter, ModalTitle, ModalTrigger }
