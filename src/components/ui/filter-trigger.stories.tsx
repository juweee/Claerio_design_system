import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { FilterRow, FilterSelect } from "./filter-trigger"

const providers = [
  { value: "all", label: "All" },
  { value: "okafor", label: "Dr. Okafor" },
  { value: "city-lab", label: "City Lab" },
]
const statuses = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
]

const meta = {
  title: "Components/Filter trigger",
  component: FilterSelect,
  subcomponents: { FilterRow },
  args: { label: "Provider:", defaultValue: "all", options: providers },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const AllStates: Story = {
  name: "All states",
  parameters: {
    ...modePanelParameters,
    pseudo: { hover: [".state-hover button"], focusVisible: [".state-focus button"] },
  },
  render: () => (
    <ModePanels>
      <div className="flex flex-col gap-4">
        {(["Default", "Hover", "Focus"] as const).map((state) => (
          <div key={state} className={`flex flex-col gap-2 state-${state.toLowerCase()}`}>
            <span className="text-label text-muted-foreground">{state}</span>
            <FilterRow className="mb-0">
              <FilterSelect label="Provider:" defaultValue="all" options={providers} />
              <FilterSelect label="Status:" defaultValue="pending" options={statuses} />
            </FilterRow>
          </div>
        ))}
      </div>
    </ModePanels>
  ),
}

function OpenMenu() {
  return (
    <div className="min-h-56">
      <FilterRow>
        <FilterSelect label="Status:" defaultValue="pending" options={statuses} defaultOpen />
      </FilterRow>
    </div>
  )
}

export const OpenLight: Story = {
  name: "Menu open, light",
  parameters: { themes: { themeOverride: "Light" } },
  render: () => <OpenMenu />,
}

export const OpenDark: Story = {
  name: "Menu open, dark",
  parameters: { themes: { themeOverride: "Dark" } },
  render: () => <OpenMenu />,
}

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels layout="stacked">
      <FilterRow>
        <FilterSelect label="Provider:" defaultValue="all" options={providers} />
        <FilterSelect label="Status:" defaultValue="pending" options={statuses} />
      </FilterRow>
    </ModePanels>
  ),
}
