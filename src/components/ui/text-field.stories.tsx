import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { TextField } from "./field"

const meta = {
  title: "Components/Text field",
  component: TextField,
  args: {
    label: "Member ID",
    placeholder: "e.g. CLA-48213",
    helper: "On the front of your card",
    error: "",
    disabled: false,
  },
  argTypes: {
    error: { control: "text" },
    helper: { control: "text" },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

/* ---- Single stories. These follow the toolbar light/dark switch. ---- */

const narrow: Story["decorators"] = [
  (Story) => (
    <div className="max-w-80">
      <Story />
    </div>
  ),
]

export const Default: Story = { decorators: narrow }

export const Filled: Story = {
  args: { defaultValue: "CLA-48213" },
  decorators: narrow,
}

export const WithError: Story = {
  name: "Error",
  args: { defaultValue: "48213", error: "Start the ID with CLA-" },
  decorators: narrow,
}

export const Disabled: Story = {
  args: { defaultValue: "CLA-48213", disabled: true },
  decorators: narrow,
}

export const NoHelper: Story = {
  name: "Without helper text",
  args: { helper: undefined },
  decorators: narrow,
}

/* ---- Every state, light and dark. ---- */

const states: { name: string; key: string; props: Partial<React.ComponentProps<typeof TextField>> }[] = [
  { name: "Empty", key: "empty", props: {} },
  { name: "Filled", key: "filled", props: { defaultValue: "CLA-48213" } },
  { name: "Focus", key: "focus", props: { defaultValue: "CLA-48213" } },
  { name: "Error", key: "error", props: { defaultValue: "48213", error: "Start the ID with CLA-" } },
  {
    name: "Error and focus",
    key: "error-focus",
    props: { defaultValue: "48213", error: "Start the ID with CLA-" },
  },
  { name: "Disabled", key: "disabled", props: { defaultValue: "CLA-48213", disabled: true } },
]

function StateGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-6 gap-y-8">
      {states.map((state) => (
        <div key={state.key} className={`flex flex-col gap-3 state-${state.key}`}>
          <span className="text-label text-muted-foreground">{state.name}</span>
          <TextField
            label="Member ID"
            placeholder="e.g. CLA-48213"
            helper="On the front of your card"
            {...state.props}
          />
        </div>
      ))}
    </div>
  )
}

export const AllStates: Story = {
  name: "All states",
  parameters: {
    ...modePanelParameters,
    pseudo: {
      focusVisible: [".state-focus input", ".state-error-focus input"],
    },
  },
  render: () => (
    <ModePanels layout="stacked">
      <StateGrid />
    </ModePanels>
  ),
}

/* ---- Same layout as the reference preview.html, for comparison. ---- */

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: {
    ...modePanelParameters,
    pseudo: { focusVisible: [".ref-focus input"] },
  },
  render: () => (
    <ModePanels layout="stacked">
      <div className="grid max-w-[760px] grid-cols-3 gap-4">
        <TextField label="Member ID" placeholder="e.g. CLA-48213" helper="On the front of your card" />
        <div className="ref-focus">
          <TextField label="Member ID" defaultValue="CLA-48213" helper="On the front of your card" />
        </div>
        <TextField label="Member ID" defaultValue="48213" error="Start the ID with CLA-" />
      </div>
    </ModePanels>
  ),
}
