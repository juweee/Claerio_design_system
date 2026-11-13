import * as React from "react"
import { CaretDownIcon, CaretRightIcon, CaretUpDownIcon, CaretUpIcon } from "@phosphor-icons/react"

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
 * - highlighted: the --accent "just created" highlight. Remove it after
 *   a few seconds or on first interaction (pairs with a success toast).
 * - Status cells reuse StatusChip exactly.
 * - Known gap: dark-mode --border reaches 1.35:1 against the card.
 */

/**
 * Shows rows of data, such as claims, in a real HTML table. No zebra
 * striping: rows highlight on hover. Sortable headers and clickable rows
 * work with the keyboard.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <table
      data-slot="table"
      className={cn("w-full border-collapse font-sans text-body text-foreground", className)}
      {...props}
    />
  )
}

function TableHeader(props: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&>tr:last-child>td]:border-b-0", className)}
      {...props}
    />
  )
}

type TableRowProps = React.ComponentProps<"tr"> & {
  /** Briefly marks a just-created or just-updated row. */
  highlighted?: boolean
}

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
  /** The current sort direction, when this is the sorted column. */
  sorted?: SortDirection
}

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
}

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

/** The trailing › for clickable rows. Leave it out when rows are not clickable. */
function TableChevronCell({ className, ...props }: React.ComponentProps<"td">) {
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

/** Header cell above the chevron column. */
function TableChevronHead({ className, ...props }: React.ComponentProps<"th">) {
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
