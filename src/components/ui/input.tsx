import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Clærio Input
 *
 * Sources: claude-design-reference/components/Input, the states spec
 * (retired 2026-11-12), decisions.md (Inputs) and the
 * CLAUDE.md hard rules.
 *
 * - 40px tall, 12px side padding, radius-md, Inter 14/400.
 * - 1px --input-border (= --olive-500) on --card. Earlier --input,
 *   which measured below 3:1 (accepted on review 2026-11-12).
 * - Placeholder: --muted-foreground (decided 2026-11-12; the reference
 *   colors failed contrast).
 * - Focus: 1.5px --ring border plus the universal 2px --ring outline,
 *   2px offset.
 * - Error (aria-invalid="true"): 1.5px --destructive border in both
 *   modes. It stays destructive while focused (decided 2026-11-12).
 * - Disabled: 50% opacity and not-allowed cursor, no color change.
 *
 * Use TextField (field.tsx) for a labelled field with helper and error
 * text. Use Input on its own only when you wire the label yourself.
 */
function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-md border border-input-border bg-card px-3",
        "font-sans text-body leading-none text-foreground",
        "placeholder:text-muted-foreground",
        // Focus: border swap plus the universal outline.
        "focus-visible:border-[1.5px] focus-visible:border-ring",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        // Error: destructive border, kept while focused.
        "aria-invalid:border-[1.5px] aria-invalid:border-destructive",
        "aria-invalid:focus-visible:border-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
