import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import { modePanelParameters, withModePanels } from "@/foundations/mode-panels"

import { StatusChip } from "./badge"
import { Button } from "./button"
import { Card, CardTitle } from "./card"
import { EmptyState, EmptyStateActions, EmptyStateDescription, EmptyStateTitle } from "./empty-state"
import { FilterRow, FilterSelect } from "./filter-trigger"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"

const meta = {
  title: "Components/Empty state",
  component: EmptyState,
  subcomponents: { EmptyStateTitle, EmptyStateDescription, EmptyStateActions },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

function FilteredResult() {
  return (
    <Card>
      <FilterRow>
        <FilterSelect
          label="Status:"
          defaultValue="denied"
          options={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
            { value: "denied", label: "Denied" },
          ]}
        />
      </FilterRow>
      <EmptyState>
        <EmptyStateTitle>No denied claims</EmptyStateTitle>
        <EmptyStateDescription>None of your 12 claims are denied. Clear the filter to see all of them.</EmptyStateDescription>
        <EmptyStateActions>
          <Button variant="secondary">Clear filters</Button>
        </EmptyStateActions>
      </EmptyState>
    </Card>
  )
}

export const Filtered: Story = {
  name: "Filters match nothing",
  parameters: modePanelParameters,
  decorators: [withModePanels("stacked")],
  render: FilteredResult,
}

function ChartNoData() {
  return (
    <Card>
      <CardTitle>Spending trend</CardTitle>
      <EmptyState>
        <EmptyStateTitle>No spending to show</EmptyStateTitle>
        <EmptyStateDescription>No expenses match these filters. Clear them to see your spending.</EmptyStateDescription>
        <EmptyStateActions>
          <Button variant="secondary">Clear filters</Button>
        </EmptyStateActions>
      </EmptyState>
    </Card>
  )
}

export const Chart: Story = {
  name: "Chart with no data",
  parameters: modePanelParameters,
  decorators: [
    // CardTitle is an <h3>, so an <h2> comes first, as on a real page.
    (Story) => (
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-2">Reporting</h2>
        <Story />
      </div>
    ),
    withModePanels("stacked"),
  ],
  render: ChartNoData,
}

/* The filter and the empty state working together: the table is replaced
   while nothing matches, and Clear filters brings the rows back. */
function ClaimsWithFilter() {
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "denied", label: "Denied" },
  ]

  const claims = [
    { id: "CLA-48213", provider: "Dr. Okafor", status: "pending", amount: "$240.00" },
    { id: "CLA-47911", provider: "Valley Urgent Care", status: "paid", amount: "$385.50" },
    { id: "CLA-46987", provider: "Westside Imaging", status: "pending", amount: "$1,240.00" },
  ]

  const [status, setStatus] = React.useState("denied")
  const rows = status === "all" ? claims : claims.filter((c) => c.status === status)
  return (
    <Card className="max-w-180">
      <FilterRow>
        <FilterSelect label="Status:" value={status} onValueChange={setStatus} options={statusOptions} />
      </FilterRow>
      {rows.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No denied claims</EmptyStateTitle>
          <EmptyStateDescription>
            None of your {claims.length} claims are denied. Clear the filter to see all of them.
          </EmptyStateDescription>
          <EmptyStateActions>
            <Button variant="secondary" onClick={() => setStatus("all")}>
              Clear filters
            </Button>
          </EmptyStateActions>
        </EmptyState>
      ) : (
        <Table aria-label="Claims">
          <TableHeader>
            <tr>
              <TableHead>Claim</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead numeric>Amount</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {rows.map((c) => (
              <TableRow key={c.id}>
                <TableCell mono>{c.id}</TableCell>
                <TableCell>{c.provider}</TableCell>
                <TableCell>
                  <StatusChip variant={c.status === "paid" ? "positive" : "neutral"}>
                    {c.status === "paid" ? "Paid" : "Pending"}
                  </StatusChip>
                </TableCell>
                <TableCell numeric>{c.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}

export const ClearFilters: Story = {
  name: "Clear filters brings rows back",
  parameters: { layout: "padded", themes: { themeOverride: "Light" } },
  render: ClaimsWithFilter,
  play: async ({ canvas, step }) => {
    await step("The empty state replaces the table and is announced", async () => {
      await expect(canvas.getByRole("status")).toHaveTextContent("No denied claims")
      await expect(canvas.queryByRole("table")).toBeNull()
    })
    await step("Clear filters shows every claim", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Clear filters" }))
      await expect(canvas.getByRole("table", { name: "Claims" })).toBeInTheDocument()
      // 3 claims plus the header row.
      await expect(canvas.getAllByRole("row")).toHaveLength(4)
      await expect(canvas.queryByRole("status")).toBeNull()
    })
  },
}
