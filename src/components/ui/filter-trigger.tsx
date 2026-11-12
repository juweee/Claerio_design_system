import * as React from "react"

import { cn } from "@/lib/utils"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

/*
 * Clærio Filter trigger
 *
 * Sources: the controls spec's filter trigger (retired 2026-11-12),
 * decisions.md (Filter triggers) and
 * claude-design-reference/components/FilterTrigger.
 *
 * - Narrows what data is shown. Opens the same menu as Select.
 * - 32px, 12px side padding, 1px --input border, radius-md, --background
 *   fill, Inter 14/400. 6px between label, value and caret (spec).
 * - Muted label ("Status:") and --foreground value ("All").
 * - Hover: --accent. Neutral only: never amber.
 * - FilterRow: its own left-aligned row under the card title, 8px between
 *   filters, 12px above the content it filters.
 */

function FilterRow({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="filter-row" className={cn("mb-3 flex items-center gap-2", className)} {...props} />
}

type FilterOption = { value: string; label: string }

type FilterSelectProps = Omit<React.ComponentProps<typeof Select>, "children"> & {
  /** The muted label, such as "Status:". */
  label: string
  options: FilterOption[]
  className?: string
}

function FilterSelect({ label, options, className, ...props }: FilterSelectProps) {
  return (
    <Select {...props}>
      {/* A select trigger is a combobox, which takes its name from a label,
          not its contents: "Status" here, and the value is read after it. */}
      <SelectTrigger
        data-slot="filter-trigger"
        aria-label={label.replace(/:\s*$/, "")}
        className={cn("gap-1.5 hover:bg-accent", className)}
      >
        <span className="text-muted-foreground">{label}</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { FilterRow, FilterSelect }
export type { FilterOption, FilterSelectProps }
