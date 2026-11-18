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
 * - 12px gap, 10 × 16 padding, Inter 14/600 in terracotta-700
 *   (terracotta-400 in dark mode). 14px per the 2026-07-09 correction.
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
        "font-sans text-body font-[600] text-terracotta-700 dark:text-terracotta-400",
        className
      )}
      {...props}
    />
  )
}

export { Banner, BannerAction, BannerBar, BannerDescription, BannerTitle, bannerVariants }
export type { BannerProps }
