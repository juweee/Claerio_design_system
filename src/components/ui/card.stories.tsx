import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { ModePanels, modePanelParameters, withModePanels } from "@/foundations/mode-panels"

import { Card, CardBody, CardHeader, CardMeta, CardTitle } from "./card"
import { ProgressField } from "./progress"
import { SegmentedControl, SegmentedControlOption } from "./segmented-control"

const meta = {
  title: "Components/Card",
  component: Card,
  subcomponents: { CardHeader, CardTitle, CardBody, CardMeta },
} satisfies Meta
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
  decorators: [withModePanels()],
  render: Examples,
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

/* Cards right under the page title: level 2 keeps the heading order
   h1, h2 with no skipped level. */
function HeadingLevels() {
  return (
    <div className="flex max-w-180 flex-col gap-6">
      <h1 className="font-serif text-heading-1">Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardTitle level={2}>Deductible</CardTitle>
          <CardBody>$1,240 of $2,000 met.</CardBody>
        </Card>
        <Card>
          <CardTitle level={2}>Out-of-pocket max</CardTitle>
          <CardBody>$2,180 of $6,000 met.</CardBody>
        </Card>
      </div>
    </div>
  )
}

export const Levels: Story = {
  name: "Heading level under the page title",
  parameters: { layout: "padded", themes: { themeOverride: "Light" } },
  render: HeadingLevels,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("heading", { level: 2 })).toHaveLength(2)
    await expect(canvas.queryAllByRole("heading", { level: 3 })).toHaveLength(0)
  },
}
