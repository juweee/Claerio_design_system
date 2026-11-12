import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTerm, TooltipTrigger } from "./tooltip"

const meta = {
  title: "Components/Tooltip",
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={200}>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

/* Tooltip held open so it shows in both panels. */
function OpenExample() {
  return (
    <div className="pt-10">
      <Tooltip open>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="border-b border-dotted border-muted-foreground text-body">
            $1,240 estimated
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">Out-of-network estimate</TooltipContent>
      </Tooltip>
    </div>
  )
}

export const Open: Story = {
  name: "Open, both modes",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels>
      <OpenExample />
    </ModePanels>
  ),
}

export const Live: Story = {
  name: "Live example",
  render: () => (
    <p className="max-w-120 pt-10 font-sans text-body text-foreground">
      Your visit to Westside Imaging is{" "}
      <TooltipTerm tip="Out-of-network estimate">$1,240 estimated</TooltipTerm>. Hover over the amount, or press
      Tab to focus it.
    </p>
  ),
}
