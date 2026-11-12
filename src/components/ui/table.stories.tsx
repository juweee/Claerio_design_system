import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { StatusChip } from "./badge"
import { Card } from "./card"
import { FilterRow, FilterSelect } from "./filter-trigger"
import {
  Table,
  TableBody,
  TableCell,
  TableChevronCell,
  TableChevronHead,
  TableHead,
  TableHeader,
  TableRow,
  type SortDirection,
} from "./table"

const meta = { title: "Components/Table" } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

type Claim = {
  id: string
  date: string
  sortDate: number
  provider: string
  status: { label: string; variant: "positive" | "neutral" | "alert" | "error" }
  amount: number
}

const claims: Claim[] = [
  { id: "CLA-48213", date: "Nov 2, 2026", sortDate: 20261102, provider: "Dr. Okafor", status: { label: "Pending", variant: "neutral" }, amount: 240 },
  { id: "CLA-47120", date: "May 2, 2026", sortDate: 20260502, provider: "City Lab", status: { label: "Paid", variant: "positive" }, amount: 0 },
  { id: "CLA-46987", date: "Apr 18, 2026", sortDate: 20260418, provider: "Westside Imaging", status: { label: "Review", variant: "alert" }, amount: 1240 },
  { id: "CLA-46511", date: "Mar 3, 2026", sortDate: 20260303, provider: "Valley Urgent Care", status: { label: "Denied", variant: "error" }, amount: 385.5 },
]

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" })

type SortKey = "date" | "amount"

function ClaimsTable({
  clickable = true,
  rowClassName,
}: {
  clickable?: boolean
  rowClassName?: (index: number) => string | undefined
}) {
  const [sort, setSort] = React.useState<{ key: SortKey; dir: SortDirection }>({ key: "date", dir: "descending" })
  const [status, setStatus] = React.useState("all")
  const [opened, setOpened] = React.useState<string | null>(null)

  const toggle = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "descending" ? "ascending" : "descending" }))

  const rows = claims
    .filter((c) => status === "all" || c.status.label.toLowerCase() === status)
    .sort((a, b) => {
      const av = sort.key === "date" ? a.sortDate : a.amount
      const bv = sort.key === "date" ? b.sortDate : b.amount
      return sort.dir === "ascending" ? av - bv : bv - av
    })

  return (
    <Card className="max-w-180">
      <FilterRow>
        <FilterSelect
          label="Status:"
          value={status}
          onValueChange={setStatus}
          options={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
            { value: "review", label: "Review" },
            { value: "denied", label: "Denied" },
          ]}
        />
      </FilterRow>
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Claim</TableHead>
            <TableHead onSort={() => toggle("date")} sorted={sort.key === "date" ? sort.dir : undefined}>
              Date
            </TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead numeric onSort={() => toggle("amount")} sorted={sort.key === "amount" ? sort.dir : undefined}>
              Amount
            </TableHead>
            {clickable ? <TableChevronHead /> : null}
          </tr>
        </TableHeader>
        <TableBody>
          {rows.map((c, i) => (
            <TableRow
              key={c.id}
              highlighted={clickable && c.id === "CLA-48213" && !opened}
              onClick={clickable ? () => setOpened(c.id) : undefined}
              className={rowClassName?.(i)}
            >
              <TableCell mono>{c.id}</TableCell>
              <TableCell>{c.date}</TableCell>
              <TableCell>{c.provider}</TableCell>
              <TableCell>
                <StatusChip variant={c.status.variant}>{c.status.label}</StatusChip>
              </TableCell>
              <TableCell numeric>{money(c.amount)}</TableCell>
              {clickable ? <TableChevronCell /> : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {clickable ? (
        <p className="mt-3 text-body-small text-muted-foreground">
          {opened ? `Opened ${opened}.` : "Click a row or press Enter on it. CLA-48213 shows the new-row highlight."}
        </p>
      ) : null}
    </Card>
  )
}

/* ---- Playground. Follows the toolbar light/dark switch. Sort, filter and open rows. ---- */

export const Interactive: Story = {
  render: () => <ClaimsTable />,
}

/* ---- Every state, light and dark. ---- */

export const AllStates: Story = {
  name: "All states",
  parameters: {
    ...modePanelParameters,
    pseudo: { hover: [".state-hover"], focusVisible: [".state-focus"] },
  },
  render: () => (
    <ModePanels layout="stacked">
      <div className="flex flex-col gap-6">
        <span className="text-label text-muted-foreground">
          Clickable rows: first row new (highlighted), second hover, third keyboard focus
        </span>
        <ClaimsTable rowClassName={(i) => (i === 1 ? "state-hover" : i === 2 ? "state-focus" : undefined)} />
        <span className="text-label text-muted-foreground">Not clickable: no chevron column</span>
        <ClaimsTable clickable={false} />
      </div>
    </ModePanels>
  ),
}

/* ---- Same as the reference preview.html, for comparison. ---- */

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels layout="stacked">
      <ClaimsTable />
    </ModePanels>
  ),
}
