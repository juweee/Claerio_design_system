import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { ProgressField } from "./progress"

const meta = { title: "Components/Progress" } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Values: Story = {
  parameters: modePanelParameters,
  render: () => (
    <ModePanels>
      <div className="flex max-w-105 flex-col gap-6">
        <ProgressField label="Deductible" valueText="0% met" value={0} />
        <ProgressField label="Deductible" valueText="62% met" value={62} />
        <ProgressField label="Out-of-pocket maximum" valueText="$1,850 of $4,000" value={46} />
        <ProgressField label="Deductible" valueText="Met" value={100} />
      </div>
    </ModePanels>
  ),
}

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels layout="stacked">
      <div className="max-w-105">
        <ProgressField label="Deductible" valueText="62% met" value={62} />
      </div>
    </ModePanels>
  ),
}
