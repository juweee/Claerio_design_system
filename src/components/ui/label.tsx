import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/*
 * Clærio Label
 *
 * Label style: Inter 12/600 in --foreground. Sits above its field.
 * Never rely on a placeholder as the label.
 */
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("font-sans text-label text-foreground", className)}
      {...props}
    />
  )
}

export { Label }
