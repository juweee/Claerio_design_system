import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * Clærio Avatar
 *
 * Source: claude-design-reference/components/Avatar.
 *
 * - Represents a person by initials.
 * - Sizes: --avatar-sm 24, --avatar-md 32, --avatar-lg 40.
 * - Round, --accent fill, 1px --border, Inter 600 initials in
 *   --accent-foreground. Initials: 10 / 12 / 14px (reference). 10px is
 *   kept below the type scale on purpose (decided 2026-11-12).
 * - Pass the person's full name as `name`: screen readers read it
 *   instead of the initials.
 */
const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-accent font-sans font-[600] text-accent-foreground select-none",
  {
    variants: {
      size: {
        sm: "size-(--avatar-sm) text-[10px]",
        md: "size-(--avatar-md) text-[12px]",
        lg: "size-(--avatar-lg) text-[14px]",
      },
    },
    defaultVariants: { size: "md" },
  }
)

type AvatarProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof avatarVariants> & {
    /** Up to two letters, such as "MK". */
    initials: string
    /** The person's full name, read by screen readers. */
    name: string
  }

/**
 * Shows a person as initials in a circle, in 3 sizes. Pass the full name as
 * `name` so screen readers read it instead of the initials.
 */
function Avatar({ className, size, initials, name, ...props }: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      role="img"
      aria-label={name}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      <span aria-hidden>{initials}</span>
    </span>
  )
}

export { Avatar, avatarVariants }
export type { AvatarProps }
