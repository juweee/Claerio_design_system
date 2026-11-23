import * as React from "react"
import { cva } from "class-variance-authority"
import { InfoIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react"

import type { AttributeProps, ChildrenProps, ClassNameProps, CommonProps, IdProps } from "@/lib/html-props"
import { cn } from "@/lib/utils"

/*
 * Clærio Banner (inline) and BannerBar (page level)
 *
 * Sources: the banner spec (retired 2026-11-12), decisions.md (Banners) and
 * claude-design-reference/components/Banner.
 *
 * Inline banner
 * - info = teal, warning = amber, error = destructive.
 * - Background: the base color at --banner-tint (10% light, 15% dark).
 *   Border: 1px at --banner-border (30% light, 35% dark).
 * - 12px gap, 12 × 16 padding, radius-md, Inter 14/400 in --foreground.
 * - Severity color (--info-foreground, --warning-foreground or
 *   --error-foreground) carries the icon, title, action link and dismiss.
 * - Icon: a 20px circle in the severity color with the glyph in
 *   --background (white in light mode, the page color in dark), as in
 *   the reference. Built from filled Phosphor Info (info) or
 *   WarningCircle (warning, error) over a --background disc, because
 *   Phosphor has no plain "i" glyph.
 * - Title: 14/600. Action: underlined text at 14/500, never a Button. A
 *   link (<a>) when it goes somewhere; a <button> that looks the same
 *   when it acts in place, such as "Try again" (decided 2026-11-18).
 * - Dismiss: shown only when onDismiss is passed. Use it only when the
 *   message does not require action. A 16px Phosphor X in a 24px target.
 *
 * Page-level bar
 * - --primary at --banner-tint, 1px bottom border at --banner-border,
 *   edge to edge, no radius.
 * - 12px gap, 10 × 16 padding, Inter 14/600 in --banner-bar-foreground
 *   (terracotta-700 in light mode, terracotta-400 in dark mode). 14px per
 *   the 2026-07-09 correction.
 */

/** The 3 banner variants. Listed here so the docs show each value. */
type BannerVariant = "info" | "warning" | "error"

const bannerVariants = cva(
  [
    "flex items-start gap-3 rounded-md border px-4 py-3",
    "font-sans text-body text-foreground",
    "bg-[color-mix(in_oklch,var(--banner-base)_var(--banner-tint),transparent)]",
    "border-[color-mix(in_oklch,var(--banner-base)_var(--banner-border),transparent)]",
  ],
  {
    variants: {
      variant: {
        info: "[--banner-base:var(--info)] [--banner-fg:var(--info-foreground)]",
        warning: "[--banner-base:var(--warning)] [--banner-fg:var(--warning-foreground)]",
        error: "[--banner-base:var(--destructive)] [--banner-fg:var(--error-foreground)]",
      } satisfies Record<BannerVariant, string>,
    },
    defaultVariants: { variant: "info" },
  }
)

const icons = {
  info: InfoIcon,
  warning: WarningCircleIcon,
  error: WarningCircleIcon,
} as const

type BannerProps = React.ComponentProps<"div"> & {
    /**
     * info: neutral news, the default. warning: something may need
     * attention. error: something failed; announced right away.
     */
    variant?: BannerVariant
    /** Shows the dismiss ×. Leave out when the message requires action. */
    onDismiss?: () => void
    /** Accessible name for the dismiss button. */
    dismissLabel?: string
  } & ChildrenProps & CommonProps<HTMLDivElement>

/**
 * Shows an info, warning or error message across a section, or a page-level
 * bar. The action (BannerAction) is underlined text, never a Button: a link
 * when it goes somewhere, or a <button> that looks the same when it acts
 * in place, such as "Try again". Error banners are announced to screen
 * readers right away.
 *
 * When a table's data fails to load, put an error Banner in the table's
 * place, inside the same Card and under its filters, with a "Try again"
 * action (decisions.md, 2026-11-23).
 *
 * ## Component record
 *
 * Covers Banner (inline) and BannerBar (page level).
 *
 * Status: **first pass**. Built and tested, but whether BannerBar can
 * be dismissed is undecided (GAPS.md item 9). *Source: decisions.md, 2026-11-23 Banner record review.*
 *
 * Each field ends with where its content came from. "PROPOSED" means
 * nothing in the repository decides it yet: treat it as a suggestion, not
 * a rule. "None yet" means nothing exists.
 *
 * ### Name and import path
 *
 * `Banner`, `BannerTitle`, `BannerDescription`, `BannerAction` and
 * `BannerBar`, imported from `src/components/ui/banner`. The same file
 * exports `bannerVariants`, the class function behind the variants.
 * *Source: banner.tsx.*
 *
 * ### Props
 *
 * Every prop, with its type and default, is in the Props section of this
 * entry and its subcomponents, including the HTML props they pass
 * through.
 *
 * - `Banner`: `variant` ("info", "warning" or "error", default "info"),
 *   `onDismiss` (shows the dismiss button), `dismissLabel` (default
 *   "Dismiss"), and any `<div>` prop.
 * - `BannerTitle` and `BannerDescription`: any `<p>` prop.
 * - `BannerAction`: with `href`, any `<a>` prop. Without `href`, any
 *   `<button>` prop, and `type` is "button".
 * - `BannerBar`: any `<div>` prop. No variant and no dismiss.
 *
 * *Source: banner.tsx.*
 *
 * ### Variants and states
 *
 * | Variant | Base (tint and border) | Severity color (icon, title, action, dismiss) | Icon | Role |
 * | --- | --- | --- | --- | --- |
 * | info (default) | `--info` (teal) | `--info-foreground` | Filled Info | `status` |
 * | warning | `--warning` (amber) | `--warning-foreground` | Filled WarningCircle | `status` |
 * | error | `--destructive` | `--error-foreground` | Filled WarningCircle | `alert` |
 *
 * Every variant: the base color at `--banner-tint` (10% light, 15% dark)
 * as the fill, a 1px border at `--banner-border` (30% light, 35% dark),
 * `--radius-md`, 12px gap, 12px by 16px padding, Inter 14/400 in
 * `--foreground`. Title 14/600, action 14/500 and underlined.
 *
 * BannerBar: `--primary` at `--banner-tint` as the fill, a 1px bottom
 * border at `--banner-border`, edge to edge with no radius, 12px gap,
 * 10px by 16px padding, Inter 14/600 in `--banner-bar-foreground`
 * (`--terracotta-700` light, `--terracotta-400` dark).
 *
 * - **Focus visible:** BannerAction and the dismiss button get a 2px
 *   `--ring` outline, 2px offset, with `--radius-sm` corners.
 * - **Hover:** none yet. The action and dismiss don't change on hover.
 * - **None yet:** a success variant, a dismiss on BannerBar (GAPS.md
 *   item 9).
 *
 * *Source: banner.tsx, decisions.md (Components: Banners; 2026-07-09
 * banner-bar font-size correction; 2026-11-12 banner implementation
 * notes).*
 *
 * ### Stories
 *
 * Story IDs, with links to the published Storybook:
 * [components-banner--info](https://juweee.github.io/Claerio_design_system/?path=/story/components-banner--info),
 * [components-banner--warning](https://juweee.github.io/Claerio_design_system/?path=/story/components-banner--warning),
 * [components-banner--error-story](https://juweee.github.io/Claerio_design_system/?path=/story/components-banner--error-story),
 * [components-banner--retry](https://juweee.github.io/Claerio_design_system/?path=/story/components-banner--retry),
 * [components-banner--page-bar](https://juweee.github.io/Claerio_design_system/?path=/story/components-banner--page-bar),
 * [components-banner--all-variants-story](https://juweee.github.io/Claerio_design_system/?path=/story/components-banner--all-variants-story),
 * [components-banner--reference-layout](https://juweee.github.io/Claerio_design_system/?path=/story/components-banner--reference-layout).
 * *Source: banner.stories.tsx.*
 *
 * ### Tokens
 *
 * `--info`, `--info-foreground`, `--warning`, `--warning-foreground`,
 * `--destructive`, `--error-foreground`, `--banner-tint`,
 * `--banner-border`, `--primary`, `--banner-bar-foreground`,
 * `--foreground`, `--background` (icon disc), `--ring`, `--radius-md`,
 * `--radius-sm`, `--font-sans`, `--type-body-size`,
 * `--type-body-line-height`. `--banner-bar-foreground` was added on
 * November 23, 2026. *Source: banner.tsx class names,
 * design-tokens.css.*
 *
 * ### Purpose
 *
 * Banner tells people about something on the page that needs explaining
 * or an action. BannerBar shows a message about the whole app or account
 * across the top of the page. *Source: Banner drafted from the
 * description above and decisions.md (2026-11-18 StatusChip record);
 * BannerBar from decisions.md, 2026-11-23 Banner record review.*
 *
 * ### When to use, when not to
 *
 * - Use Banner for a message that needs explaining or an action. For a
 *   short status on one item, use StatusChip. To confirm something just
 *   done, use Toast. *Source: decisions.md, 2026-11-18 component record
 *   review (StatusChip, Modal).*
 * - When a table's data fails to load, put an error Banner in the
 *   table's place, inside the Card and under its filters, with a "Try
 *   again" action. *Source: decisions.md, 2026-11-23 layout when loading
 *   fails.*
 * - Show the dismiss button only when the message doesn't require
 *   action. *Source: decisions.md, 2026-11-12 banner implementation
 *   notes.*
 * - Use the action as underlined text, never a Button. *Source: CLAUDE.md
 *   hard rules, decisions.md 2026-11-18.*
 * - Use BannerBar for a message about the whole account, such as a
 *   plan renewal, and Banner for a message about one section. Show at
 *   most one BannerBar at a time. *Source: decisions.md, 2026-11-23 Banner record review.*
 *
 * ### Anatomy
 *
 * Banner:
 * 1. Container: tinted fill and border in the base color.
 * 2. Icon: a 20px disc in the severity color.
 * 3. Content: BannerTitle (optional), then BannerDescription, with
 *    BannerAction (optional) inline at the end of the description.
 * 4. Dismiss button (optional): a 16px X in a 24px target.
 *
 * BannerBar: a container holding one line of text.
 *
 * *Source: banner.tsx, stories.*
 *
 * ### Behavior
 *
 * - Error banners use `role="alert"`, so screen readers announce them
 *   right away. Info, warning and BannerBar use `role="status"`.
 *   *Source: decisions.md, 2026-11-12 banner implementation notes.*
 * - Dismiss calls `onDismiss`. The banner doesn't hide itself: remove it
 *   in your handler. *Source: banner.tsx.*
 * - BannerAction with `href` goes to that page. Without `href`, it runs
 *   its `onClick` in place, such as "Try again". *Source: decisions.md,
 *   2026-11-18 banner retry.*
 * - After dismiss, move focus to the next sensible element, because the
 *   dismiss button disappears with the banner. *Source: decisions.md, 2026-11-23 Banner record review.*
 *
 * ### Accessibility
 *
 * The component handles:
 * - The live region role for each variant (see Behavior).
 * - An accessible name on the dismiss button (`dismissLabel`, default
 *   "Dismiss"), and a hidden icon (`aria-hidden`).
 * - A 24px dismiss target, the minimum in WCAG 2.2 (Web Content
 *   Accessibility Guidelines).
 * - Contrast: icon glyphs measure 6.15:1 or more against their disc.
 *   Info text measures 6.08:1 and error text 5.67:1 on the dark tint;
 *   error text 5.97:1 on the light tint. BannerBar text measures about
 *   7.12:1 light and 6.24:1 dark (measured November 23, 2026).
 * - Known gap: borders measure 1.17 to 1.62:1 against their tint. The
 *   tint and icon mark the banner.
 *
 * *Source: decisions.md (2026-11-12 banner implementation notes),
 * design-tokens.css banner comments.*
 *
 * You must provide:
 * - A `dismissLabel` that names the message when a page has more than
 *   one dismissible banner, such as "Dismiss claim received".
 *   *Source: decisions.md, 2026-11-23 Banner record review.*
 * - An `onClick` on a BannerAction without `href`. Never a link with
 *   `href="#"`. *Source: BannerAction description.*
 * - Text that makes sense without color: the variant color alone
 *   doesn't say how serious the message is. *Source: decisions.md, 2026-11-23 Banner record review.*
 *
 * Test checklist:
 * 1. Tab reaches the action and dismiss, and shows the outline in light
 *    and dark mode.
 * 2. A screen reader announces an error banner when it appears.
 * 3. Enter runs a BannerAction button (covered by the Retry action
 *    story).
 * 4. The Storybook `test-run` passes: accessibility violations fail it.
 *    *Source: decisions.md, 2026-11-13.*
 *
 * ### Content guidance
 *
 * - Error banners say what happened, why if known, and what to do next.
 *   *Source: CLAUDE.md content style guide (error messages).*
 * - Titles are 2 to 4 words in sentence case with no ending
 *   punctuation, such as "Sync failed". Descriptions are one or two
 *   short sentences. Action labels start with a verb, such as "Review
 *   claim" or "Try again". *Source: decisions.md, 2026-11-23 Banner record review.*
 * - Write dates as "January 1, 2027". No em dashes. *Source: CLAUDE.md
 *   content style guide.*
 *
 * ### Related components and patterns
 *
 * StatusChip, Toast, Modal, EmptyState, Card and Table (loading failed).
 * *Source: decisions.md and the records that point to Banner.*
 *
 * ### Links
 *
 * decisions.md: Components (Banners); 2026-07-09 banner-bar font-size
 * correction; 2026-11-12 banner implementation notes; 2026-11-18 CardTitle
 * level, date filter, banner retry; 2026-11-23 layout when loading fails.
 * GAPS.md items 9 and 28. Figma: "Clærio design system (from code)",
 * page "Components", component set `Banner` and component `BannerBar`
 * (experiment 1.6).
 *
 * @import import { Banner } from "@/components/ui/banner"
 */
function Banner({
  className,
  variant = "info",
  onDismiss,
  dismissLabel = "Dismiss",
  children,
  ...props
}: BannerProps) {
  const Icon = icons[variant ?? "info"]

  return (
    <div
      data-slot="banner"
      data-variant={variant}
      role={variant === "error" ? "alert" : "status"}
      className={cn(bannerVariants({ variant }), className)}
      {...props}
    >
      {/* 20px slot. The disc sits behind the icon's cut-out glyph; the
          24px icon's circle measures about 20px. */}
      <span data-slot="banner-icon" aria-hidden className="relative size-5 shrink-0">
        <span className="absolute inset-0.5 rounded-full bg-background" />
        <Icon
          weight="fill"
          className="absolute -inset-0.5 size-6 text-(color:--banner-fg)"
        />
      </span>
      <div data-slot="banner-content" className="min-w-0 flex-1">
        {children}
      </div>
      {onDismiss ? (
        <button
          type="button"
          data-slot="banner-dismiss"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className={cn(
            "-my-0.5 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-(color:--banner-fg)",
            "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
          )}
        >
          <XIcon aria-hidden className="size-4" />
        </button>
      ) : null}
    </div>
  )
}

/**
 * @import import { BannerTitle } from "@/components/ui/banner"
 */
function BannerTitle({ className, ...props }: React.ComponentProps<"p"> & ChildrenProps & CommonProps<HTMLParagraphElement>) {
  return (
    <p
      data-slot="banner-title"
      className={cn("font-[600] text-(color:--banner-fg)", className)}
      {...props}
    />
  )
}

/**
 * @import import { BannerDescription } from "@/components/ui/banner"
 */
function BannerDescription({ className, ...props }: React.ComponentProps<"p"> & ChildrenProps & CommonProps<HTMLParagraphElement>) {
  return <p data-slot="banner-description" className={cn("text-foreground", className)} {...props} />
}

/*
 * react-docgen can't read union types, so the docs come from
 * BannerActionDocProps. It only declares props whose types are the same on
 * both the link and the button form, so it changes no types.
 */
type BannerActionDocProps = {
  /**
   * Where the action goes. With href, BannerAction renders an <a> and takes
   * any <a> attribute, such as target and rel. Without href, it renders a
   * <button type="button"> and takes any <button> attribute, such as
   * onClick and disabled.
   */
  href?: string
} & ChildrenProps &
  ClassNameProps &
  IdProps &
  AttributeProps

type BannerActionProps = BannerActionDocProps &
  (
    | (React.ComponentProps<"a"> & { href: string })
    | (React.ComponentProps<"button"> & { href?: undefined })
  )

const bannerActionClasses = [
  "font-[500] text-(color:--banner-fg) underline",
  "focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
]

/**
 * The banner's action, as underlined text in the banner color. Never a
 * Button.
 *
 * With href, it's a link, for actions that go somewhere, such as "Review
 * now". Without href, it's a <button> that looks the same, for actions
 * that happen in place, such as "Try again" after an error. Give the
 * button an onClick. Never use a link with href="#" for an in-place
 * action: screen readers announce it as a link that goes nowhere.
 *
 * @import import { BannerAction } from "@/components/ui/banner"
 */
function BannerAction({ className, ...props }: BannerActionProps) {
  if (props.href !== undefined) {
    return (
      <a
        data-slot="banner-action"
        className={cn(bannerActionClasses, className)}
        {...(props as React.ComponentProps<"a">)}
      />
    )
  }
  return (
    <button
      type="button"
      data-slot="banner-action"
      className={cn(bannerActionClasses, "cursor-pointer", className)}
      {...(props as React.ComponentProps<"button">)}
    />
  )
}

/**
 * A page-level message bar: a terracotta tint across the top of the page,
 * edge to edge, with one line of text. It has no variants and no dismiss.
 * See the Banner record for when to use it.
 *
 * @import import { BannerBar } from "@/components/ui/banner"
 */
function BannerBar({ className, ...props }: React.ComponentProps<"div"> & ChildrenProps & CommonProps<HTMLDivElement>) {
  return (
    <div
      data-slot="banner-bar"
      role="status"
      className={cn(
        "flex items-center gap-3 px-4 py-2.5",
        "bg-[color-mix(in_oklch,var(--primary)_var(--banner-tint),transparent)]",
        "border-b border-[color-mix(in_oklch,var(--primary)_var(--banner-border),transparent)]",
        "font-sans text-body font-[600] text-banner-bar-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Banner, BannerAction, BannerBar, BannerDescription, BannerTitle, bannerVariants }
export type { BannerProps }
