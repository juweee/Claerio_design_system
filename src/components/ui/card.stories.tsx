import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { Card, CardBody, CardHeader, CardMeta, CardTitle } from "./card"
import { ProgressField } from "./progress"
import { SegmentedControl, SegmentedControlOption } from "./segmented-control"

const meta = { title: "Components/Card" } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

function Examples() {
  return (
    <div className="flex max-w-105 flex-col gap-6">
      <Card>
        <CardTitle>Annual physical</CardTitle>
        <CardBody>
          Covered at $0 under your preventive care benefit. No referral required for in-network providers.
        </CardBody>
        <CardMeta>Dr. Okafor · Visit on May 2, 2026 · Claim #47120</CardMeta>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Spending</CardTitle>
          <SegmentedControl defaultValue="bar" aria-label="Chart type">
            <SegmentedControlOption value="bar">Bar</SegmentedControlOption>
            <SegmentedControlOption value="stacked">Stacked</SegmentedControlOption>
            <SegmentedControlOption value="pie">Pie</SegmentedControlOption>
          </SegmentedControl>
        </CardHeader>
        <CardBody>
          <ProgressField label="Deductible" valueText="62% met" value={62} />
        </CardBody>
      </Card>
    </div>
  )
}

export const AllVariants: Story = {
  name: "Examples",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels>
      <Examples />
    </ModePanels>
  ),
}

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels layout="stacked">
      <Card className="max-w-105">
        <CardTitle>Annual physical</CardTitle>
        <CardBody>
          Covered at $0 under your preventive care benefit. No referral required for in-network providers.
        </CardBody>
        <CardMeta>Dr. Okafor · Visit on May 2, 2026 · Claim #47120</CardMeta>
      </Card>
    </ModePanels>
  ),
}
