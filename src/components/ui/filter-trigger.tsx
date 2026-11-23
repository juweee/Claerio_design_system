import * as React from "react"

import type { ChildrenProps, CommonProps } from "@/lib/html-props"
import { cn } from "@/lib/utils"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, type SelectRootProps } from "./select"

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
function FilterRow({ className, ...props }: React.ComponentProps<"div"> & ChildrenProps & CommonProps<HTMLDivElement>) {
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
} & SelectRootProps

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
 * `FilterSelect`, with the part `FilterRow` and the type `FilterOption`,
 * imported from `src/components/ui/filter-trigger` (the import line is
 * below). The docs entry is called "Filter trigger". *Source:
 * filter-trigger.tsx, filter-trigger.stories.tsx.*
 *
 * ### Props
 *
 * Every prop, with its type, is in the Props section of this entry,
 * including the Select root props it passes through (`open`,
 * `defaultOpen`, `onOpenChange`, `disabled`, `required`, `name`,
 * `autoComplete`, `form`, `dir`). `label` and `options` are required.
 * `className` styles the trigger button, not a wrapper. *Source:
 * filter-trigger.tsx, select.tsx.*
 *
 * ### Variants and states
 *
 * One variant.
 * - **Default:** 32px tall, 12px side padding, 1px `--input-border`
 *   border, `--radius-md`, `--background` fill. The label in
 *   `--muted-foreground`, the value in `--foreground`, Inter 14/400,
 *   6px apart, then a 20px caret in `--foreground`.
 * - **Hover:** `--accent` fill.
 * - **Focus visible:** 2px `--ring` outline, 2px offset.
 * - **Open:** a menu 4px below the trigger, at least as wide as it:
 *   `--popover` fill, 1px `--border`, `--radius-md`, `--shadow-overlay`,
 *   4px padding. The highlighted option gets `--accent`. The selected
 *   option shows a 16px check in `--terracotta-600`
 *   (`--terracotta-400` in dark mode), 8px before its text.
 * - **Disabled:** 50% opacity, not-allowed cursor.
 * - Never amber, in any state.
 * - **None yet:** picking several values in one filter, searching the
 *   options, a count of active filters and a "Clear all" control.
 *
 * *Source: filter-trigger.tsx, select.tsx, decisions.md (Filter
 * triggers; 2026-11-12 open items closed, field borders; 2026-11-12
 * selection control decisions).*
 *
 * ### Stories
 *
 * Story IDs, with links to the published Storybook:
 * [components-filter-trigger--all-states](https://juweee.github.io/Claerio_design_system/?path=/story/components-filter-trigger--all-states),
 * [components-filter-trigger--open-light](https://juweee.github.io/Claerio_design_system/?path=/story/components-filter-trigger--open-light),
 * [components-filter-trigger--open-dark](https://juweee.github.io/Claerio_design_system/?path=/story/components-filter-trigger--open-dark),
 * [components-filter-trigger--reference-layout](https://juweee.github.io/Claerio_design_system/?path=/story/components-filter-trigger--reference-layout),
 * [components-filter-trigger--date-range-story](https://juweee.github.io/Claerio_design_system/?path=/story/components-filter-trigger--date-range-story).
 * *Source: filter-trigger.stories.tsx.*
 *
 * ### Tokens
 *
 * `--input-border`, `--background`, `--foreground`,
 * `--muted-foreground`, `--accent`, `--ring`, `--radius-md`,
 * `--radius-sm` (options), `--popover`, `--popover-foreground`,
 * `--border`, `--shadow-overlay`, `--terracotta-600`,
 * `--terracotta-400`, `--control-height-sm`, `--disabled-opacity`,
 * `--font-sans`, `--type-body-size`, `--type-body-weight`.
 * `--control-height-sm` and `--disabled-opacity` are PROPOSED (November
 * 23, 2026). *Source: filter-trigger.tsx and select.tsx class names,
 * design-tokens.css.*
 *
 * ### Purpose
 *
 * Narrows the data shown in a table or chart to one value, such as one
 * provider or status. *Source: filter-trigger.tsx comment.*
 *
 * ### When to use, when not to
 *
 * - Use it to filter a table or chart on a card. Group filters in a
 *   FilterRow under the card title. *Source: decisions.md (Filter
 *   triggers), description above.*
 * - Use it for dates too, with preset ranges. There is no date picker.
 *   *Source: decisions.md, 2026-11-18.*
 * - To pick a value in a form, use Select. *Source: Select
 *   description.*
 * - To switch between views of the same content, such as chart types,
 *   use SegmentedControl. To move between pages or sections, use Tabs or
 *   NavTabs. *Source: those components' descriptions, decisions.md
 *   (2026-11-12 navigation decisions).*
 *
 * ### Anatomy
 *
 * 1. FilterRow: the row that holds the filters, 8px apart, 12px above
 *    the content they filter. Put the FilterRow inside CardBody, so the
 *    filters sit 8px under the card title. *Source: decisions.md,
 *    2026-11-23 filters go inside CardBody.*
 * 2. Trigger: the label ("Status:"), the selected value and a caret.
 * 3. Menu: the options, with a check on the selected one.
 *
 * *Source: filter-trigger.tsx, select.tsx.*
 *
 * ### Behavior
 *
 * - The filter applies as soon as the person picks an option:
 *   `onValueChange` runs on the pick, with no Apply button. *Source:
 *   filter-trigger.tsx.*
 * - Without `value` or `defaultValue`, the trigger shows only the label.
 *   Always start on an option, such as "All". *Source: decisions.md,
 *   2026-11-18 component record review.*
 * - When the filters match nothing, replace the table or chart with an
 *   EmptyState that offers "Clear filters", and keep the filters in
 *   view. *Source: decisions.md, 2026-11-18 empty state.*
 * - Filtering doesn't sort. Sorting stays on the table headers.
 *   *Source: table.tsx.*
 *
 * ### Accessibility
 *
 * The component handles:
 * - The trigger's accessible name: the label without its colon, such as
 *   "Status", read before the value. *Source: decisions.md, 2026-11-12.*
 * - Keyboard use (Radix Select): Enter, Space or the arrow keys open
 *   the menu, the arrow keys move through options, typing jumps to a
 *   match, Escape closes, and focus returns to the trigger.
 *   *Source: select.tsx, Radix Select.*
 * - Border contrast: `--input-border` measures 3.92:1 light and 4.32:1
 *   dark against the card. *Source: decisions.md, 2026-11-12.*
 * - A 32px height, above the 24px minimum target size in WCAG 2.2.
 *
 * You must provide:
 * - A label that names what's filtered, such as "Provider:".
 *   *Source: label prop comment.*
 *
 * Known limit: when results change, screen readers aren't told how many
 * rows are left. None yet (GAPS.md item 26).
 *
 * Test checklist:
 * 1. Tab reaches each filter and shows the outline in light and dark
 *    mode.
 * 2. A screen reader says the label, the role and the value, such as
 *    "Status, Pending".
 * 3. Open the menu, move with the arrow keys and pick with Enter. The
 *    content updates and focus returns to the trigger.
 * 4. Escape closes the menu without changing the value.
 * 5. The Storybook `test-run` passes. The open-menu stories skip one
 *    rule, `aria-hidden-focus`, on purpose. *Source: decisions.md,
 *    2026-11-13.*
 *
 * ### Content guidance
 *
 * - Label: what's filtered, as a noun with a colon, such as
 *   "Status:", "Provider:" or "Date:". *Source: label prop comment,
 *   stories, decisions.md 2026-11-18.*
 * - Put "All" first, to clear the filter. For dates, the options are
 *   "Last 7 days", "Last 30 days", "Last 90 days" and "All dates".
 *   *Source: options prop comment, decisions.md 2026-11-18.*
 * - Options in sentence case, with names as written, such as
 *   "Dr. Okafor". *Source: decisions.md, 2026-11-18 component record review.*
 * - Option values are short IDs, such as "pending", never empty.
 *   *Source: FilterOption comment.*
 * - No em dashes. *Source: CLAUDE.md content style guide.*
 *
 * ### Related components and patterns
 *
 * FilterRow, Select, Table, Card, EmptyState, SegmentedControl.
 * *Source: filter-trigger.tsx, stories, decisions.md.*
 *
 * ### Links
 *
 * decisions.md: Components (Filter triggers); 2026-11-12 table and
 * remaining components (accessible name); 2026-11-12 open items closed
 * (field borders); 2026-11-13 accessibility checks fail story tests;
 * 2026-11-18 empty state; 2026-11-18 date filter. GAPS.md: item 26.
 * decisions.md: 2026-11-23 filters go inside CardBody.
 * Figma: none yet.
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
