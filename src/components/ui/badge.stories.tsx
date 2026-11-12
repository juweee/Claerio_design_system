import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { Badge, StatusChip } from "./badge"

const meta = { title: "Components/Badge and status chip" } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

function AllVariants() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-label text-muted-foreground">Savings badge</span>
        <div className="flex gap-3">
          <Badge>Save $187</Badge>
          <Badge>Save 20%</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label text-muted-foreground">Status chips</span>
        <div className="flex flex-wrap items-center gap-3">
          <StatusChip variant="positive">Deductible 62% met</StatusChip>
          <StatusChip variant="neutral">3 claims pending</StatusChip>
          <StatusChip variant="alert">Action needed</StatusChip>
          <StatusChip variant="error">Denied</StatusChip>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label text-muted-foreground">Badge next to a chip, 6px apart</span>
        <div className="flex items-center gap-1.5">
          <StatusChip variant="positive">Paid</StatusChip>
          <Badge>Save $187</Badge>
        </div>
      </div>
    </div>
  )
}

export const AllVariantsStory: Story = {
  name: "All variants",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels>
      <AllVariants />
    </ModePanels>
  ),
}

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels layout="stacked">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>Save $187</Badge>
        <StatusChip variant="positive">Deductible 62% met</StatusChip>
        <StatusChip variant="neutral">3 claims pending</StatusChip>
        <StatusChip variant="alert">Action needed</StatusChip>
        <StatusChip variant="error">Denied</StatusChip>
      </div>
    </ModePanels>
  ),
}
