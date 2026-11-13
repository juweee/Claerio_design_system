import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRightIcon, FileTextIcon, TrashIcon } from "@phosphor-icons/react"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { Button } from "./button"

const variants = ["primary", "secondary", "ghost", "destructive", "link"] as const

const labels: Record<(typeof variants)[number], string> = {
  primary: "Review claim",
  secondary: "View details",
  ghost: "Dismiss",
  destructive: "Delete claim",
  link: "See all claims",
}

const states = ["Default", "Hover", "Focus", "Disabled"] as const

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Review claim",
    variant: "primary",
    disabled: false,
  },
  argTypes: {
    variant: { control: "inline-radio", options: variants },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/* ---- One story per variant. These follow the toolbar light/dark switch. ---- */

export const Primary: Story = {}

export const Secondary: Story = {
  args: { variant: "secondary", children: "View details" },
}

export const Ghost: Story = {
  args: { variant: "ghost", children: "Dismiss" },
}

export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete claim" },
}

export const Link: Story = {
  args: { variant: "link", children: "See all claims" },
}

/* ---- Every variant in every state, light and dark side by side. ---- */

function StateMatrix() {
  return (
    <div className="grid grid-cols-[96px_repeat(4,max-content)] items-center gap-x-6 gap-y-4">
      <span />
      {states.map((state) => (
        <span key={state} className="text-label text-muted-foreground">
          {state}
        </span>
      ))}
      {variants.map((variant) => (
        <div key={variant} className="contents">
          <span className="text-label capitalize">{variant}</span>
          {states.map((state) => (
            <div key={state} className={`state-${state.toLowerCase()}`}>
              <Button variant={variant} disabled={state === "Disabled"}>
                {labels[variant]}
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export const AllStates: Story = {
  name: "All variants and states",
  parameters: {
    ...modePanelParameters,
    // Forces hover and focus styles on the matching columns.
    pseudo: {
      hover: [".state-hover button"],
      focusVisible: [".state-focus button"],
    },
  },
  render: () => (
    <ModePanels layout="stacked">
      <StateMatrix />
    </ModePanels>
  ),
}

/* ---- Buttons with icons. ---- */

export const WithIcon: Story = {
  name: "With icon",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels>
      <div className="flex flex-wrap items-center gap-3">
        <Button>
          <FileTextIcon aria-hidden />
          Review claim
        </Button>
        <Button variant="secondary">
          View details
          <ArrowRightIcon aria-hidden />
        </Button>
        <Button variant="destructive">
          <TrashIcon aria-hidden />
          Delete claim
        </Button>
      </div>
    </ModePanels>
  ),
}

/* ---- Placement: primary rightmost, Cancel to its left. ---- */

export const DecisionGroup: Story = {
  name: "Decision group",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels>
      <div className="flex justify-end gap-2">
        <Button variant="secondary">Cancel</Button>
        <Button>File dispute</Button>
      </div>
    </ModePanels>
  ),
}
