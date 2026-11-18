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
 * ## Component record
 *
 * Status: **stable**. *Source: decisions.md, 2026-11-18 component record
 * review.*
 *
 * Each field ends with where its content came from. "PROPOSED" means
 * nothing in the repository decides it yet: treat it as a suggestion, not
 * a rule. "None yet" means nothing exists.
 *
 * ### Name and import path
 *
 * `Modal`, with the parts `ModalTrigger`, `ModalContent`, `ModalTitle`,
 * `ModalDescription`, `ModalFooter` and `ModalClose`, all imported from
 * `src/components/ui/modal` (each part's import line is in its own
 * section). Built on Radix Dialog. *Source: modal.tsx.*
 *
 * ### Props
 *
 * Every prop of every part is in the Props and Subcomponents sections of
 * this entry, including the HTML and Radix props each part passes
 * through. The ones that matter most:
 * - Modal: `open` with `onOpenChange` when you control it, or
 *   `defaultOpen`. `modal` defaults to true: keep it on.
 * - ModalTrigger and ModalClose: `asChild`, to use a Button.
 * - ModalContent: `onOpenAutoFocus`, `onCloseAutoFocus` and
 *   `onInteractOutside`, to change focus or closing behavior.
 *
 * *Source: modal.tsx.*
 *
 * ### Variants and states
 *
 * One variant.
 * - **Closed:** only the trigger shows.
 * - **Open:** the page dims with `--overlay` (the foreground color at 50%
 *   in light mode, black at 60% in dark). The dialog is centered on `--card`, `--radius-lg`,
 *   16px padding, up to `--modal-max-width` (480px) and 32px narrower
 *   than the screen. `--shadow-modal` in light mode, no shadow in dark.
 * - **Focus visible on the dialog itself:** 2px `--ring` outline, 2px
 *   offset.
 * - **Title:** heading-2 type. **Description:** body type, 8px below.
 *   **Footer:** 16px below, buttons on the right, 8px apart.
 * - **None yet:** sizes, a close (×) button, a loading state while the
 *   action runs, an error state inside the modal and scrolling for long
 *   content (GAPS.md item 22).
 *
 * *Source: modal.tsx, design-tokens.css.*
 *
 * ### Stories
 *
 * Story IDs, with links to the published Storybook:
 * [components-modal--open-light](https://juweee.github.io/Claerio_design_system/?path=/story/components-modal--open-light),
 * [components-modal--open-dark](https://juweee.github.io/Claerio_design_system/?path=/story/components-modal--open-dark),
 * [components-modal--live](https://juweee.github.io/Claerio_design_system/?path=/story/components-modal--live).
 * *Source: modal.stories.tsx.*
 *
 * ### Tokens
 *
 * `--overlay`, `--card`, `--card-foreground`, `--radius-lg`,
 * `--modal-max-width`, `--shadow-modal`, `--ring`, `--font-sans`,
 * `--type-heading-2-size`, `--type-heading-2-weight`,
 * `--type-heading-2-line-height`, `--type-body-size`,
 * `--type-body-weight`, `--type-body-line-height`. The buttons inside
 * use Button's tokens. *Source: modal.tsx class names,
 * design-tokens.css.*
 *
 * ### Purpose
 *
 * Asks for a decision before the person can continue, such as "Dispute
 * this charge?". *Source: modal.tsx comment.*
 *
 * ### When to use, when not to
 *
 * - Use it to confirm an action with a consequence the person should
 *   weigh first, such as filing a dispute. *Source: modal.tsx comment,
 *   stories.*
 * - To confirm something already done, use Toast. To show a message on
 *   the page, use Banner. *Source: decisions.md, 2026-11-18 component record review.*
 * - Whether a clickable table row opens a modal, a panel or a page isn't
 *   decided (GAPS.md item 14).
 * - Forms and long content in a modal: none yet (GAPS.md item 22).
 *
 * ### Anatomy
 *
 * 1. Modal: holds the open state.
 * 2. ModalTrigger: the Button that opens it.
 * 3. ModalContent: the dimmed page and the dialog.
 * 4. ModalTitle: the question.
 * 5. ModalDescription: the consequence.
 * 6. ModalFooter: Cancel (secondary, in a ModalClose), then the
 *    confirming action (primary), rightmost.
 *
 * *Source: modal.tsx, stories.*
 *
 * ### Behavior
 *
 * - Opening moves focus to the first control inside, which is Cancel in
 *   the standard footer. Tab stays inside the modal.
 * - Escape, clicking the dimmed page and any ModalClose close it. Focus
 *   then returns to the trigger.
 * - The page behind can't be scrolled or reached while it's open.
 * - In the stories, the confirming action sits in a ModalClose, so the
 *   modal closes the moment it's pressed. How to keep it open while the
 *   action runs, or show an error: none yet (GAPS.md item 22).
 *
 * *Source: modal.tsx comment, Radix Dialog.*
 *
 * ### Accessibility
 *
 * The component handles (Radix Dialog):
 * - The dialog role, marked modal, named by ModalTitle and described by
 *   ModalDescription. ModalTitle is an `<h2>`.
 * - Focus moving in, staying in, and returning to the trigger.
 * - Hiding the rest of the page from screen readers while open.
 *
 * You must provide:
 * - A ModalTitle, always. Radix warns in the console without one.
 * - A ModalDescription, or `aria-describedby={undefined}` on
 *   ModalContent when there's nothing to describe.
 * - A real Button as the trigger, with `asChild`. *Source: ModalTrigger
 *   description.*
 *
 * Test checklist:
 * 1. Open it with the keyboard: focus lands inside, on Cancel.
 * 2. Tab and Shift+Tab never leave the modal.
 * 3. Escape closes it, and focus returns to the trigger.
 * 4. A screen reader says "dialog", the title and the description.
 * 5. The Storybook `test-run` passes for the open stories in both modes.
 *    *Source: decisions.md, 2026-11-13.*
 *
 * *Source: modal.tsx comment, Radix Dialog, stories.*
 *
 * ### Content guidance
 *
 * - Title: a question about the action, such as "Dispute this charge?".
 *   *Source: modal.tsx comment.*
 * - Description: one or two sentences on the consequence, such as "We
 *   will file the dispute with your insurer. Average resolution: 12
 *   days." *Source: modal.tsx comment, stories.*
 * - Buttons: "Cancel", then a verb that repeats the title's action, such
 *   as "File dispute". *Source: decisions.md, 2026-11-18 component record review.*
 * - Whether a destructive confirmation, such as a delete, uses the
 *   destructive Button: not decided (GAPS.md item 22).
 * - No em dashes. *Source: CLAUDE.md content style guide.*
 *
 * ### Related components and patterns
 *
 * Button (trigger and footer), Toast, Banner, Table (GAPS.md item 14).
 * *Source: modal.tsx, stories.*
 *
 * ### Links
 *
 * decisions.md: 2026-11-12 table and remaining components (modal built
 * on Radix Dialog, reviewed). GAPS.md: items 14 and 22. Figma: none yet.
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
