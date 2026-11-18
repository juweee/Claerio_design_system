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
 * - 32px, 12px side padding, 1px --input-border (from Select), radius-md, --background
 *   fill, Inter 14/400. 6px between label, value and caret (spec).
 * - Muted label ("Status:") and --foreground value ("All").
 * - Hover: --accent. Neutral only: never amber.
 * - FilterRow: its own left-aligned row under the card title, 8px between
 *   filters, 12px above the content it filters.
 * - Dates: filter by date with preset ranges in a FilterSelect, labeled
 *   "Date:", with "Last 7 days", "Last 30 days", "Last 90 days" and
 *   "All dates". There is no date picker (decided 2026-11-18).
 */

/**
 * Holds one or more FilterSelects on their own left-aligned row, under the
 * card title and 12px above the content they filter.
 *
 * @import import { FilterRow } from "@/components/ui/filter-trigger"
 */
function FilterRow({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="filter-row" className={cn("mb-3 flex items-center gap-2", className)} {...props} />
}

/** One choice in a FilterSelect menu. */
type FilterOption = {
  /** The value passed to onValueChange, such as "pending". Must be unique and not empty. */
  value: string
  /** The text shown in the menu and on the trigger, such as "Pending". */
  label: string
}

type FilterSelectProps = Omit<
  React.ComponentProps<typeof Select>,
  "children" | "value" | "defaultValue" | "onValueChange"
> & {
  /** The muted label, such as "Status:". It also names the trigger for screen readers, without the colon. */
  label: string
  /** The menu choices, in order, as `{ value, label }` objects. Include an "All" option to clear the filter. */
  options: FilterOption[]
  /** The selected option's value, when you control the filter. Use with onValueChange. */
  value?: string
  /** The option selected at first, when you don't control the filter. */
  defaultValue?: string
  /** Called with the new option's value when the person picks one. */
  onValueChange?: (value: string) => void
  /** Classes for the trigger button. */
  className?: string
}

/**
 * A compact dropdown that filters data, such as by provider or status. Group
 * filters in a FilterRow under the card title. Filters stay neutral and
 * never use amber.
 *
 * Control it with `value` and `onValueChange`, or set `defaultValue` and let
 * it manage itself. Other Radix Select root props, such as `defaultOpen`,
 * `disabled` and `name`, pass through.
 *
 * To filter by date, use a FilterSelect with preset ranges: label
 * "Date:", options "Last 7 days", "Last 30 days", "Last 90 days" and
 * "All dates". The system has no date picker or date range control.
 *
 * @import import { FilterSelect, type FilterOption } from "@/components/ui/filter-trigger"
 */
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
