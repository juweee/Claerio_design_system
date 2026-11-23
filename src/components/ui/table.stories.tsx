import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters, withModePanels } from "@/foundations/mode-panels"

import { expect, fn } from "storybook/test"

import { StatusChip } from "./badge"
import { Banner, BannerAction, BannerDescription, BannerTitle } from "./banner"
import { Card, CardBody, CardTitle } from "./card"
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

const meta = {
  title: "Components/Table",
  component: Table,
  subcomponents: {
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableChevronCell,
    TableChevronHead,
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

/* Sortable, filterable, with clickable rows. */
function ClaimsTable() {
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
            <TableChevronHead />
          </tr>
        </TableHeader>
        <TableBody>
          {rows.map((c) => (
            <TableRow
              key={c.id}
              highlighted={c.id === "CLA-48213" && !opened}
              onClick={() => setOpened(c.id)}
            >
              <TableCell mono>{c.id}</TableCell>
              <TableCell>{c.date}</TableCell>
              <TableCell>{c.provider}</TableCell>
              <TableCell>
                <StatusChip variant={c.status.variant}>{c.status.label}</StatusChip>
              </TableCell>
              <TableCell numeric>{money(c.amount)}</TableCell>
              <TableChevronCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-3 text-body-small text-muted-foreground">
        {opened ? `Opened ${opened}.` : "Click a row or press Enter on it. CLA-48213 shows the new-row highlight."}
      </p>
    </Card>
  )
}

/* ---- Playground. Follows the toolbar light/dark switch. Sort, filter and open rows. ---- */

export const Interactive: Story = {
  render: ClaimsTable,
}

/* ---- Every state, light and dark. ---- */

/**
 * ClaimsTable is the full code shown in the Interactive story: sortable,
 * filterable, with clickable rows.
 */
export const AllStates: Story = {
  name: "All states",
  parameters: {
    ...modePanelParameters,
    // Second row shows hover, third shows keyboard focus.
    pseudo: {
      hover: [".clickable-states tbody tr:nth-child(2)"],
      focusVisible: [".clickable-states tbody tr:nth-child(3)"],
    },
  },
  render: () => {
    const claims = [
      { id: "CLA-48213", date: "Nov 2, 2026", provider: "Dr. Okafor", status: { label: "Pending", variant: "neutral" }, amount: 240 },
      { id: "CLA-47120", date: "May 2, 2026", provider: "City Lab", status: { label: "Paid", variant: "positive" }, amount: 0 },
      { id: "CLA-46987", date: "Apr 18, 2026", provider: "Westside Imaging", status: { label: "Review", variant: "alert" }, amount: 1240 },
      { id: "CLA-46511", date: "Mar 3, 2026", provider: "Valley Urgent Care", status: { label: "Denied", variant: "error" }, amount: 385.5 },
    ] as const
    const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" })

    return (
      <ModePanels layout="stacked">
        <div className="flex flex-col gap-6">
          <span className="text-label text-muted-foreground">
            Clickable rows: first row new (highlighted), second hover, third keyboard focus
          </span>
          <div className="clickable-states">
            <ClaimsTable />
          </div>
          <span className="text-label text-muted-foreground">Not clickable, not sortable: no chevron column</span>
          <Card className="max-w-180">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Claim</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead numeric>Amount</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {claims.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell mono>{c.id}</TableCell>
                    <TableCell>{c.date}</TableCell>
                    <TableCell>{c.provider}</TableCell>
                    <TableCell>
                      <StatusChip variant={c.status.variant}>{c.status.label}</StatusChip>
                    </TableCell>
                    <TableCell numeric>{money(c.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </ModePanels>
    )
  },
}

/* ---- Same as the reference preview.html, for comparison. ---- */

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  decorators: [withModePanels("stacked")],
  render: ClaimsTable,
}

/* ---- Card with a title, filters and a table (decisions.md, 2026-11-23). ---- */

const statusOptions = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "denied", label: "Denied" },
]

const dateOptions = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "all", label: "All dates" },
]

function ClaimFilters() {
  return (
    <FilterRow>
      <FilterSelect label="Status:" defaultValue="all" options={statusOptions} />
      <FilterSelect label="Date:" defaultValue="30" options={dateOptions} />
    </FilterRow>
  )
}

function TitledClaims() {
  const titleId = React.useId()
  return (
    <Card className="max-w-180">
      <CardTitle id={titleId}>Recent claims</CardTitle>
      <CardBody>
        <ClaimFilters />
        <Table aria-labelledby={titleId}>
          <TableHeader>
            <tr>
              <TableHead>Claim</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead numeric>Amount</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell mono>CLA-48213</TableCell>
              <TableCell>Nov 16, 2026</TableCell>
              <TableCell>Dr. Okafor</TableCell>
              <TableCell>
                <StatusChip variant="positive">Approved</StatusChip>
              </TableCell>
              <TableCell numeric>$240.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell mono>CLA-48190</TableCell>
              <TableCell>Nov 12, 2026</TableCell>
              <TableCell>City Lab</TableCell>
              <TableCell>
                <StatusChip variant="neutral">Pending</StatusChip>
              </TableCell>
              <TableCell numeric>$86.50</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  )
}

/**
 * Put the FilterRow and the table inside CardBody, so the filters sit 8px
 * under the card title with no extra class.
 */
export const WithTitleAndFilters: Story = {
  name: "Card with title and filters",
  parameters: modePanelParameters,
  decorators: [withModePanels()],
  render: TitledClaims,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("table", { name: "Recent claims" })).toHaveLength(2)
  },
}

const onRetry = fn()

function LoadFailedClaims() {
  return (
    <Card className="max-w-180">
      <CardTitle>Recent claims</CardTitle>
      <CardBody>
        <ClaimFilters />
        <Banner variant="error">
          <BannerTitle>Claims didn't load</BannerTitle>
          <BannerDescription>
            We couldn't reach the claims service. <BannerAction onClick={onRetry}>Try again</BannerAction>
          </BannerDescription>
        </Banner>
      </CardBody>
    </Card>
  )
}

/**
 * When loading fails, an error Banner takes the table's place in the same
 * Card. The filters stay in view and active. onRetry is a test spy; in an
 * app, pass your own retry handler.
 */
export const LoadFailed: Story = {
  name: "Loading failed",
  parameters: modePanelParameters,
  decorators: [withModePanels()],
  render: LoadFailedClaims,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByRole("table")).toBeNull()
    await userEvent.click(canvas.getAllByRole("button", { name: "Try again" })[0])
    await expect(onRetry).toHaveBeenCalled()
  },
}
