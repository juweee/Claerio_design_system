import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/*
 * Clærio Switch
 *
 * Sources: claude-design-reference/components/SelectionControls, the
 * states spec and decisions.md (Selection controls).
 *
 * - Track 36 × 20, 2px padding, radius-full. Thumb 16px.
 * - Off: --input track, --muted-foreground thumb.
 * - On: terracotta-600 track, Cream (--primary-foreground) thumb.
 *   decisions.md sets these thumb colors; the states spec says
 *   --background for both. decisions.md outranks the spec, and the
 *   reference agrees with it.
 * - Thumb slides 16px with a 0.15s ease (states spec).
 * - Focus: universal 2px --ring outline, 2px offset.
 * - Disabled: 50% opacity, not-allowed cursor.
 * - Always pair with a text label.
 */
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5",
        "bg-input data-[state=checked]:bg-terracotta-600",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-muted-foreground",
          "transition-transform duration-150 ease-in-out",
          "data-[state=checked]:translate-x-4 data-[state=checked]:bg-primary-foreground"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
