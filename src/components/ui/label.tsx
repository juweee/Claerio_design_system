import * as React from "react"
import { cva } from "class-variance-authority"
import { Label as LabelPrimitive } from "radix-ui"

import type { ChildrenProps, CommonProps, RadixAsChildProps } from "@/lib/html-props"
import { cn } from "@/lib/utils"

/*
 * Clærio Label
 *
 * - field (default): label style, Inter 12/600 in --foreground. Sits
 *   above a text field. Never rely on a placeholder as the label.
 * - control: body style, Inter 14/400 in --foreground. Sits beside a
 *   checkbox, radio or switch, 8px away, as in the selection controls
 *   reference.
 */
/** The 2 label variants. Listed here so the docs show each value. */
type LabelVariant = "field" | "control"

const labelVariants = cva("font-sans text-foreground", {
  variants: {
    variant: {
      field: "text-label",
      control: "inline-flex cursor-pointer items-center gap-2 text-body",
    } satisfies Record<LabelVariant, string>,
  },
  defaultVariants: { variant: "field" },
})

/**
 * @import import { Label } from "@/components/ui/label"
 */
function Label({
  className,
  variant = "field",
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  /**
   * field: above a text field or select, the default. control: beside a
   * checkbox, radio or switch, and wraps it.
   */
  variant?: LabelVariant
  /** Id of the control this label names. Not needed when the label wraps the control. */
  htmlFor?: string
} & RadixAsChildProps &
  ChildrenProps & CommonProps<HTMLLabelElement>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(labelVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Label, labelVariants }
