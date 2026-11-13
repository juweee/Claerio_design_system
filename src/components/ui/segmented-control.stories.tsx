import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { SegmentedControl, SegmentedControlOption } from "./segmented-control"

const meta = {
  title: "Components/Segmented control",
  component: SegmentedControl,
  subcomponents: { SegmentedControlOption },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

function Example({ className }: { className?: string }) {
  return (
    <SegmentedControl defaultValue="bar" aria-label="Chart type" className={className}>
      <SegmentedControlOption value="bar">Bar</SegmentedControlOption>
      <SegmentedControlOption value="stacked">Stacked</SegmentedControlOption>
      <SegmentedControlOption value="pie">Pie</SegmentedControlOption>
    </SegmentedControl>
  )
}

export const AllStates: Story = {
  name: "All states",
  parameters: {
    ...modePanelParameters,
    pseudo: {
      hover: [".state-hover [data-slot=segmented-control-option]:nth-child(2)"],
      focusVisible: [".state-focus [data-slot=segmented-control-option]:nth-child(1)"],
    },
  },
  render: () => (
    <ModePanels>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-label text-muted-foreground">Default: Bar active</span>
          <Example />
        </div>
        <div className="flex flex-col gap-2 state-hover">
          <span className="text-label text-muted-foreground">Hover on Stacked</span>
          <Example />
        </div>
        <div className="flex flex-col gap-2 state-focus">
          <span className="text-label text-muted-foreground">Keyboard focus on Bar</span>
          <Example />
        </div>
      </div>
    </ModePanels>
  ),
}

export const Playground: Story = {
  render: () => <Example />,
}

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels layout="stacked">
      <Example />
    </ModePanels>
  ),
}
