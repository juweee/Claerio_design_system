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
 * `Button`, imported from `src/components/ui/button` (the import line is
 * below). The same file exports `buttonVariants`, the class function
 * behind the variants. *Source: button.tsx.*
 *
 * ### Props
 *
 * Every prop, with its type and default, is in the Props section of this
 * entry, including the HTML button props it passes through. One default
 * doesn't show there: `type` is "button", not the HTML default "submit".
 * Set `type="submit"` to submit a form. With `asChild`, no `type` is set.
 * *Source: button.tsx.*
 *
 * ### Variants and states
 *
 * | Variant | Rest | Hover |
 * | --- | --- | --- |
 * | primary (default) | `--primary` fill (terracotta-600), `--primary-foreground` (Cream) text | `--terracotta-700` fill, both modes |
 * | secondary | Transparent, 1px `--foreground` border and text | `--accent` fill |
 * | ghost | Transparent, `--primary` text (`--terracotta-400` in dark mode) | `--accent` fill |
 * | destructive | `--destructive` fill, `--destructive-foreground` text | Light: `--destructive-hover`. Dark: `--destructive` at 90% |
 * | link | Transparent, no side padding, `--primary` text (`--terracotta-400` in dark mode) | Underline |
 *
 * Every variant: 40px tall, 16px side padding (link: 0), `--radius-md`,
 * Inter 14/500.
 *
 * - **Focus visible:** 2px `--ring` outline, 2px offset.
 * - **Disabled** (`disabled` or `aria-disabled`): 50% opacity,
 *   not-allowed cursor, no hover change.
 * - **None yet:** sizes, a loading state, a pressed state and an
 *   icon-only variant (see GAPS.md items 21 and 22).
 *
 * *Source: button.tsx, decisions.md (Components: Buttons; 2026-11-12
 * hover entries).*
 *
 * ### Stories
 *
 * Story IDs, with links to the published Storybook:
 * [components-button--primary](https://juweee.github.io/Claerio_design_system/?path=/story/components-button--primary),
 * [components-button--secondary](https://juweee.github.io/Claerio_design_system/?path=/story/components-button--secondary),
 * [components-button--ghost](https://juweee.github.io/Claerio_design_system/?path=/story/components-button--ghost),
 * [components-button--destructive](https://juweee.github.io/Claerio_design_system/?path=/story/components-button--destructive),
 * [components-button--link](https://juweee.github.io/Claerio_design_system/?path=/story/components-button--link),
 * [components-button--all-states](https://juweee.github.io/Claerio_design_system/?path=/story/components-button--all-states),
 * [components-button--with-icon](https://juweee.github.io/Claerio_design_system/?path=/story/components-button--with-icon),
 * [components-button--decision-group](https://juweee.github.io/Claerio_design_system/?path=/story/components-button--decision-group).
 * *Source: button.stories.tsx.*
 *
 * ### Tokens
 *
 * `--primary`, `--primary-foreground`, `--terracotta-700`,
 * `--terracotta-400`, `--foreground`, `--accent`, `--destructive`,
 * `--destructive-foreground`, `--destructive-hover`, `--ring`,
 * `--radius-md`, `--font-sans`, `--type-button-size`,
 * `--type-button-weight`, `--type-button-line-height`.
 * *Source: button.tsx class names, design-tokens.css.*
 *
 * ### Purpose
 *
 * Starts an action on the current page, such as filing a dispute or
 * opening a dialog. *Source: drafted from the description above.*
 *
 * ### When to use, when not to
 *
 * - Use **primary** for the main action, one per view. Use
 *   **secondary** for other actions, such as Cancel. Use **ghost** for
 *   low-emphasis actions, such as Dismiss. Use **destructive** for
 *   actions that delete or cancel something. Use **link** for a
 *   text-only action inside content. *Source: variant prop comment.*
 * - In an empty state, use secondary for "Clear filters", and primary
 *   only when it's the page's main action. *Source: decisions.md,
 *   2026-11-18 empty state.*
 * - In a banner, don't use Button: use BannerAction, which looks like
 *   underlined text. *Source: CLAUDE.md hard rules, decisions.md
 *   2026-11-18.*
 * - In a clickable table row, don't use Button: put the action in the
 *   detail view the row opens. In a table whose rows open nothing, the
 *   treatment is undecided (GAPS.md item 4). *Source: decisions.md,
 *   2026-11-18 actions in clickable table rows.*
 * - To switch views of the same content, use SegmentedControl or Tabs.
 *   To filter data, use FilterSelect. *Source: those components' docs.*
 * - To go to another page, use a link, or Button with `asChild` around
 *   a router link if it must look like a button. *Source: decisions.md, 2026-11-18 component record review.*
 *
 * ### Anatomy
 *
 * 1. Container: the button itself.
 * 2. Optional icon before or after the label: Phosphor, 20px.
 * 3. Label.
 *
 * *Source: button.tsx, With icon story.*
 *
 * ### Behavior
 *
 * - Doesn't submit a form unless `type="submit"`. *Source: button.tsx.*
 * - Disabled blocks clicks. `aria-disabled` only changes the look: the
 *   click handler still runs, so block it yourself. *Source:
 *   button.tsx.*
 * - Loading and double-click protection: none yet (GAPS.md item 22).
 *
 * ### Accessibility
 *
 * The component handles:
 * - A native `<button>`, so Tab, Enter and Space work.
 * - The focus outline (2px `--ring`, 2px offset) in both modes.
 * - Contrast: Cream on the primary hover measures 7.90:1, white on the
 *   light destructive hover 5.61:1, dark text on the dark destructive
 *   hover 5.64:1. *Source: decisions.md, 2026-11-12.*
 * - A 40px height, above the 24px minimum target size in WCAG 2.2
 *   (Web Content Accessibility Guidelines).
 *
 * You must provide:
 * - A visible label, or `aria-label` when there's only an icon.
 * - `aria-hidden` on icons next to a label. The component doesn't add
 *   it. *Source: With icon story, button.tsx.*
 * - With `asChild`, a child that is itself focusable, such as a link
 *   with `href`. *Source: button.tsx (the child replaces the button).*
 *
 * Test checklist:
 * 1. Tab reaches the button and shows the outline in light and dark mode.
 * 2. Enter and Space run the action.
 * 3. A screen reader says the label and "button".
 * 4. A disabled button can't be clicked or reached with Tab.
 * 5. The Storybook `test-run` passes: accessibility violations fail it.
 *    *Source: decisions.md, 2026-11-13.*
 *
 * *Source: drafted from button.tsx, the stories and decisions.md.*
 *
 * ### Content guidance
 *
 * - Put the primary button rightmost, with Cancel to its left.
 *   *Source: description above, Decision group story.*
 * - Start the label with a verb and name the object, in sentence case:
 *   "Review claim", "Delete claim", "File dispute". *Source: decisions.md, 2026-11-18 component record review.*
 * - Keep labels to 1 to 3 words. *Source: decisions.md, 2026-11-18 component record review.*
 * - No em dashes. *Source: CLAUDE.md content style guide.*
 *
 * ### Related components and patterns
 *
 * BannerAction, EmptyStateActions, ModalClose, PageHeaderActions,
 * ToastAction, SegmentedControl, Tabs, FilterSelect, TableRow.
 * *Source: components that render or replace Button.*
 *
 * ### Links
 *
 * decisions.md: Components (Buttons); 2026-11-12 dark-mode primary hover
 * changed to terracotta-700; 2026-11-12 destructive button hover darkens
 * in light mode; 2026-11-12 open items closed (5 variants); 2026-11-18
 * actions in clickable table rows. Figma: none yet.
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
