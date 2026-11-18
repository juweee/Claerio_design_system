import * as React from "react"
import { CaretDownIcon, CaretRightIcon, CaretUpDownIcon, CaretUpIcon } from "@phosphor-icons/react"

import type {
  AttributeProps,
  ChildrenProps,
  ClassNameProps,
  CommonProps,
  IdProps,
  KeyFocusProps,
  RefProps,
  TableCellElementProps,
} from "@/lib/html-props"
import { cn } from "@/lib/utils"

/*
 * Clærio Table
 *
 * Sources: the table spec (retired 2026-11-12), decisions.md (Table) and
 * claude-design-reference/components/Table.
 *
 * - Sits on a Card. Hairline --border between rows, no outer border, no
 *   zebra striping. Inter 14/400 in --foreground.
 * - Header: 12/500 in --muted-foreground (kept from the spec, decided
 *   2026-11-12), 8px vertical padding, hairline beneath.
 * - Sortable header: a button with a Phosphor caret at 12px. Sorted
 *   column: 600 in --foreground with a full-opacity CaretDown or CaretUp,
 *   and aria-sort. Other sortable columns show CaretUpDown at 45%.
 * - Cells: 10px vertical padding, 12px gap to the next column.
 * - IDs: monospace (13/400). Amounts: right-aligned, tabular figures.
 * - Clickable rows (onClick): pointer, --accent hover and a trailing
 *   chevron, all three together. Rows are reachable with Tab and open
 *   with Enter or Space. Non-clickable tables have no chevron column.
 * - Clickable rows hold no buttons or links: the row opens the detail
 *   view, and the item's actions live there (decided 2026-11-18). Say
 *   what's needed in plain text in the row instead.
 * - highlighted: the --accent "just created" highlight. Remove it after
 *   a few seconds or on first interaction (pairs with a success toast).
 * - Status cells reuse StatusChip exactly.
 * - Known gap: dark-mode --border reaches 1.35:1 against the card.
 */

/**
 * Shows rows of data, such as claims, in a real HTML table. No zebra
 * striping: rows highlight on hover. Sortable headers and clickable rows
 * work with the keyboard.
 *
 * Build it from parts: Table > TableHeader > a <tr> of TableHead cells,
 * then TableBody > TableRow > TableCell. Put the table on a Card. For
 * clickable rows, give each TableRow an onClick and end it with a
 * TableChevronCell, and end the header row with a TableChevronHead.
 *
 * ## Component record
 *
 * Status: **first pass**. Some table patterns aren't designed yet: see
 * GAPS.md items 4 and 14 to 16. *Source: experiment 1.3 brief.*
 *
 * Each field ends with where its content came from. "PROPOSED" means
 * nothing in the repository decides it yet: treat it as a suggestion, not
 * a rule. "None yet" means nothing exists.
 *
 * ### Name and import path
 *
 * `Table`, with the parts `TableHeader`, `TableBody`, `TableRow`,
 * `TableHead`, `TableCell`, `TableChevronCell` and `TableChevronHead`,
 * all imported from `src/components/ui/table` (each part's import line is
 * in its own section). The file also exports the types `SortDirection`,
 * `TableRowProps`, `TableHeadProps` and `TableCellProps`.
 * *Source: table.tsx.*
 *
 * ### Props
 *
 * Every prop of every part, with types and defaults, is in the Props and
 * Subcomponents sections of this entry, including the HTML props each
 * part passes through. The props that change the look or behavior:
 * - TableRow: `onClick` (makes the row clickable), `highlighted`.
 * - TableHead: `numeric`, `onSort`, `sorted` ("ascending" or
 *   "descending").
 * - TableCell: `numeric`, `mono`.
 *
 * *Source: table.tsx.*
 *
 * ### Variants and states
 *
 * - **Base:** Inter 14/400 in `--foreground`. A 1px `--border` line
 *   under each row except the last. No outer border, no zebra striping.
 *   Cells: 10px top and bottom, 12px to the next column.
 * - **Header cell:** 12/500 in `--muted-foreground`, 8px top and bottom,
 *   `--border` line beneath.
 * - **Sortable header, not sorted:** a button with a 12px CaretUpDown
 *   at 45% opacity.
 * - **Sorted header:** 600 weight in `--foreground`, CaretUp or
 *   CaretDown at full opacity, and `aria-sort` on the cell.
 * - **Numeric cell or header:** right-aligned, with tabular figures in
 *   cells.
 * - **Mono cell:** `--font-mono` at 13/400, for IDs.
 * - **Rows not clickable:** no pointer, no hover color, no chevron
 *   column.
 * - **Clickable row, rest:** a trailing › chevron in
 *   `--muted-foreground`.
 * - **Clickable row, hover:** pointer, `--accent` fill, chevron in
 *   `--foreground`.
 * - **Clickable row, focus visible:** 2px `--ring` outline, 2px offset.
 * - **Highlighted row:** `--accent` fill, for a just-created or
 *   just-updated row.
 * - **No rows:** replace the table with an EmptyState in the same Card,
 *   with the filters still in view. *Source: decisions.md, 2026-11-18
 *   empty state.*
 * - **None yet:** loading, row selection (GAPS.md item 16), pagination,
 *   long text, narrow screens and sticky headers.
 *
 * *Source: table.tsx, decisions.md (Components: Table; 2026-11-12 table
 * and remaining components).*
 *
 * ### Stories
 *
 * Story IDs, with links to the published Storybook:
 * [components-table--interactive](https://juweee.github.io/Claerio_design_system/?path=/story/components-table--interactive),
 * [components-table--all-states](https://juweee.github.io/Claerio_design_system/?path=/story/components-table--all-states),
 * [components-table--reference-layout](https://juweee.github.io/Claerio_design_system/?path=/story/components-table--reference-layout).
 * *Source: table.stories.tsx.*
 *
 * ### Tokens
 *
 * `--foreground`, `--muted-foreground`, `--border`, `--accent`,
 * `--ring`, `--radius-sm` (sort button), `--font-sans`, `--font-mono`,
 * `--type-body-size`, `--type-body-weight`, `--type-body-line-height`,
 * `--type-body-small-size` and `--type-body-small-line-height` (headers,
 * at weight 500), `--type-monospace-size`, `--type-monospace-weight`,
 * `--type-monospace-line-height`. *Source: table.tsx class names,
 * design-tokens.css.*
 *
 * ### Purpose
 *
 * Shows rows of records, such as claims, so people can scan, sort and
 * open them. *Source: drafted from the description above.*
 *
 * ### When to use, when not to
 *
 * - Use it for a list of records that share the same fields, such as
 *   claims with an ID, date, provider, status and amount. *Source:
 *   stories.*
 * - For one record's details, use a Card. PROPOSED: no source compares
 *   the two.
 * - When filters match nothing, use EmptyState instead of an empty
 *   table. *Source: decisions.md, 2026-11-18 empty state.*
 * - Rows with actions: in a clickable row, put actions in the detail
 *   view it opens. Where rows open nothing, see GAPS.md item 4.
 *   *Source: decisions.md, 2026-11-18 actions in clickable table rows.*
 * - What a clickable row opens (a page, a panel or a modal) isn't
 *   decided: see GAPS.md item 14.
 *
 * ### Anatomy
 *
 * 1. Card: the surface the table sits on. Filters go above the table,
 *    in a FilterRow.
 * 2. TableHeader: one `<tr>` of TableHead cells, plus a TableChevronHead
 *    when rows are clickable.
 * 3. TableBody: TableRow elements.
 * 4. TableRow: TableCell elements, plus a TableChevronCell when the row
 *    is clickable.
 *
 * *Source: description above, table.tsx, stories.*
 *
 * ### Behavior
 *
 * - **Sorting:** the table doesn't sort data. Sort it yourself, pass
 *   `onSort` to each sortable TableHead and `sorted` to the sorted one.
 *   *Source: table.tsx.* In the stories, a new sort column starts
 *   descending and a second click flips it. PROPOSED as the rule: only
 *   the stories do this.
 * - **Clickable rows:** a click anywhere in the row, or Enter or Space
 *   on the focused row, calls `onClick`. *Source: table.tsx.*
 * - **Highlight:** remove `highlighted` after a few seconds or on the
 *   first interaction. Pair it with a success toast. The exact time:
 *   none yet. *Source: table.tsx.*
 * - **Filtering:** FilterSelect controls in a FilterRow above the table,
 *   inside the same Card. *Source: decisions.md (Filter triggers),
 *   stories.*
 * - **Mixed tables**, where only some rows open something: not decided,
 *   see GAPS.md item 15.
 *
 * ### Accessibility
 *
 * The component handles:
 * - A real HTML `<table>`, with `<th scope="col">` headers.
 * - Sort buttons, with `aria-sort` on the sorted column.
 * - Clickable rows reachable with Tab and opened with Enter or Space,
 *   with the 2px focus outline.
 * - The chevron is hidden from screen readers. Its header cell has
 *   visually hidden text, "Open".
 * - Status chip text on highlighted rows measures 4.58:1 and 4.56:1 in
 *   dark mode. *Source: decisions.md, 2026-11-12.*
 *
 * *Source: table.tsx, decisions.md (2026-11-12 table entry).*
 *
 * You must provide:
 * - Visible header text in every column except the chevron column.
 *   *Source: table.tsx.*
 * - The row's text, so it says what's needed without opening it, such
 *   as "You owe $50.00". *Source: decisions.md, 2026-11-18.*
 * - A name for the table, with `aria-label` or `aria-labelledby`
 *   pointing at the Card title. PROPOSED: no source requires it (GAPS.md
 *   item 17).
 *
 * Known limits: a clickable row keeps the row role, so screen readers
 * may not say that it opens anything. Not yet tested with a screen
 * reader (GAPS.md item 17). Dark-mode row lines measure 1.35:1 against
 * the card; they're decorative. *Source: decisions.md, 2026-11-12 open
 * items closed.*
 *
 * Test checklist:
 * 1. A screen reader reads each cell with its column header.
 * 2. Tab reaches each sort button and each clickable row, with the
 *    outline visible in light and dark mode.
 * 3. Enter and Space sort a column and open a row.
 * 4. After sorting, the sorted column's header has `aria-sort`.
 * 5. The Storybook `test-run` passes. *Source: decisions.md,
 *    2026-11-13.*
 *
 * ### Content guidance
 *
 * - Header labels: one or two words in sentence case, such as "Claim",
 *   "Provider", "Amount". PROPOSED: drawn from the stories, never decided.
 * - IDs in a mono cell. Amounts in a numeric cell, as currency with 2
 *   decimals, such as "$1,240.00". *Source: table.tsx, stories.*
 * - Status: a StatusChip with a one-word label. *Source: table.tsx,
 *   stories.*
 * - Dates: the stories write "Nov 2, 2026". The content style guide
 *   writes dates as "July 14, 2026". Whether tables may shorten the
 *   month isn't decided (GAPS.md item 18).
 * - No em dashes. *Source: CLAUDE.md content style guide.*
 *
 * ### Related components and patterns
 *
 * Card, FilterRow and FilterSelect, StatusChip, EmptyState, Toast (with
 * the row highlight), Button (not inside clickable rows).
 * *Source: table.tsx, stories, decisions.md.*
 *
 * ### Links
 *
 * decisions.md: Components (Table); Deferred / open (multi-select,
 * inline editing, column resize); 2026-11-12 table and remaining
 * components; 2026-11-12 open items closed (decorative borders);
 * 2026-11-18 actions in clickable table rows; 2026-11-18 empty state.
 * GAPS.md: items 4, 14, 15, 16, 17 and 18. Figma: none yet.
 *
 * @import import { Table } from "@/components/ui/table"
 */
function Table({ className, ...props }: React.ComponentProps<"table"> & ChildrenProps & CommonProps<HTMLTableElement>) {
  return (
    <table
      data-slot="table"
      className={cn("w-full border-collapse font-sans text-body text-foreground", className)}
      {...props}
    />
  )
}

/**
 * Holds the header row. Put one plain <tr> inside it, filled with TableHead
 * cells.
 *
 * @import import { TableHeader } from "@/components/ui/table"
 */
function TableHeader(props: React.ComponentProps<"thead"> & ChildrenProps & CommonProps<HTMLTableSectionElement>) {
  return <thead data-slot="table-header" {...props} />
}

/**
 * Holds the data rows (TableRow). The last row has no bottom border.
 *
 * @import import { TableBody } from "@/components/ui/table"
 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody"> & ChildrenProps & CommonProps<HTMLTableSectionElement>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&>tr:last-child>td]:border-b-0", className)}
      {...props}
    />
  )
}

type TableRowProps = React.ComponentProps<"tr"> & {
  /**
   * Makes the row clickable, such as to open a claim. Also adds the
   * pointer, hover color, Tab focus and Enter or Space to open. A
   * clickable row holds no buttons or links: put the item's actions in
   * the view the row opens.
   */
  onClick?: React.MouseEventHandler<HTMLTableRowElement>
  /**
   * Briefly marks a just-created or just-updated row with --accent. Remove
   * it after a few seconds or on the first interaction. Pairs with a
   * success toast.
   */
  highlighted?: boolean
} & ChildrenProps &
  ClassNameProps &
  IdProps &
  AttributeProps &
  RefProps<HTMLTableRowElement> &
  KeyFocusProps<HTMLTableRowElement>

/**
 * One data row. Give it an onClick to make the whole row clickable: it
 * then gets a pointer, the --accent hover, Tab focus, and opens with Enter
 * or Space. Clickable rows need a TableChevronCell as their last cell.
 *
 * Don't put buttons or links in a clickable row. The row opens on any
 * click inside it and on Enter, so a control there would fire both or
 * be skipped. Put actions such as "Pay now" in the detail view the row
 * opens, and say what's needed in the row as plain text, such as "You
 * owe $50.00".
 *
 * @import import { TableRow } from "@/components/ui/table"
 */
function TableRow({ className, onClick, onKeyDown, highlighted, ...props }: TableRowProps) {
  const clickable = Boolean(onClick)
  return (
    <tr
      data-slot="table-row"
      data-clickable={clickable || undefined}
      data-highlighted={highlighted || undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (clickable && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault()
          event.currentTarget.click()
        }
      }}
      className={cn(
        "group",
        "data-clickable:cursor-pointer data-clickable:hover:[&>td]:bg-accent",
        "data-highlighted:[&>td]:bg-accent",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  )
}

type SortDirection = "ascending" | "descending"

type TableHeadProps = React.ComponentProps<"th"> & {
  /** Right-aligns the header, for amount columns. */
  numeric?: boolean
  /** Shows a sort button. Set when the column can be sorted. */
  onSort?: () => void
  /** "ascending" or "descending" on the sorted column. Leave it out on every other column. */
  sorted?: SortDirection
} & TableCellElementProps &
  ChildrenProps & CommonProps<HTMLTableCellElement>

/**
 * A column header cell (<th scope="col">). Pass onSort to make it a sort
 * button, and sorted on the column that is currently sorted, which also
 * sets aria-sort. Use numeric on amount columns.
 *
 * @import import { TableHead } from "@/components/ui/table"
 */
function TableHead({ className, numeric, onSort, sorted, children, ...props }: TableHeadProps) {
  const Caret = sorted === "ascending" ? CaretUpIcon : sorted === "descending" ? CaretDownIcon : CaretUpDownIcon
  return (
    <th
      data-slot="table-head"
      scope="col"
      aria-sort={sorted}
      className={cn(
        "border-b border-border py-2 pr-3 text-left align-middle whitespace-nowrap last:pr-0",
        "text-body-small font-[500] text-muted-foreground",
        sorted && "font-[600] text-foreground",
        numeric && "text-right",
        className
      )}
      {...props}
    >
      {onSort ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 rounded-sm font-[inherit] text-inherit",
            "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
          )}
        >
          {children}
          <Caret aria-hidden weight="bold" className={cn("size-3", !sorted && "opacity-45")} />
        </button>
      ) : (
        children
      )}
    </th>
  )
}

type TableCellProps = React.ComponentProps<"td"> & {
  /** Right-aligns with tabular figures, for amounts. */
  numeric?: boolean
  /** Monospace, for claim, order and member IDs. */
  mono?: boolean
} & TableCellElementProps &
  ChildrenProps & CommonProps<HTMLTableCellElement>

/**
 * A data cell. Use mono for IDs and numeric for amounts. For a status,
 * put a StatusChip inside.
 *
 * @import import { TableCell } from "@/components/ui/table"
 */
function TableCell({ className, numeric, mono, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "border-b border-border py-2.5 pr-3 align-middle last:pr-0",
        numeric && "text-right tabular-nums",
        mono && "font-mono text-monospace",
        className
      )}
      {...props}
    />
  )
}

/**
 * The trailing › for clickable rows. Leave it out when rows are not clickable.
 *
 * @import import { TableChevronCell } from "@/components/ui/table"
 */
function TableChevronCell({ className, ...props }: React.ComponentProps<"td"> & ChildrenProps & CommonProps<HTMLTableCellElement>) {
  return (
    <td
      data-slot="table-chevron"
      aria-hidden
      className={cn(
        "w-6 border-b border-border py-2.5 text-center align-middle text-muted-foreground group-hover:text-foreground",
        className
      )}
      {...props}
    >
      <CaretRightIcon className="inline size-4" />
    </td>
  )
}

/**
 * Header cell above the chevron column.
 *
 * @import import { TableChevronHead } from "@/components/ui/table"
 */
function TableChevronHead({ className, ...props }: React.ComponentProps<"th"> & ChildrenProps & CommonProps<HTMLTableCellElement>) {
  return (
    <th
      data-slot="table-chevron-head"
      className={cn("w-6 border-b border-border py-2", className)}
      {...props}
    >
      <span className="sr-only">Open</span>
    </th>
  )
}

export {
  Table,
  TableBody,
  TableCell,
  TableChevronCell,
  TableChevronHead,
  TableHead,
  TableHeader,
  TableRow,
}
export type { SortDirection, TableCellProps, TableHeadProps, TableRowProps }
