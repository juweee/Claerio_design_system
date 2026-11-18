import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters, withModePanels } from "@/foundations/mode-panels"

import { FilterRow, FilterSelect } from "./filter-trigger"

const meta = {
  title: "Components/Filter trigger",
  component: FilterSelect,
  subcomponents: { FilterRow },
  args: {
    label: "Provider:",
    defaultValue: "all",
    options: [
      { value: "all", label: "All" },
      { value: "okafor", label: "Dr. Okafor" },
      { value: "city-lab", label: "City Lab" },
    ],
  },
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
              <FilterSelect
                label="Provider:"
                defaultValue="all"
                options={[
                  { value: "all", label: "All" },
                  { value: "okafor", label: "Dr. Okafor" },
                  { value: "city-lab", label: "City Lab" },
                ]}
              />
              <FilterSelect
                label="Status:"
                defaultValue="pending"
                options={[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "paid", label: "Paid" },
                ]}
              />
            </FilterRow>
          </div>
        ))}
      </div>
    </ModePanels>
  ),
}

/* The open-menu stories stay off Docs pages (2026-11-18). Inline, an open
   menu takes over the page; in a frame, Radix closes it when the frame
   resizes, so the story would show a closed menu. View them on their own
   story pages. */
const openMenuTags = ["!autodocs"]

/* An open Radix menu hides the rest of the page from screen readers,
   including its own trigger, which axe reports as aria-hidden-focus. Radix
   keeps keyboard focus inside the open menu, so the hidden trigger can't be
   reached. Exempt only that rule, only on the open-menu stories
   (decided 2026-11-13, see decisions.md). */
const openMenuA11y = { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } }

function OpenMenu() {
  return (
    <div className="min-h-56">
      <FilterRow>
        <FilterSelect
          label="Status:"
          defaultValue="pending"
          options={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
          ]}
          defaultOpen
        />
      </FilterRow>
    </div>
  )
}

export const OpenLight: Story = {
  name: "Menu open, light",
  tags: openMenuTags,
  parameters: { themes: { themeOverride: "Light" }, a11y: openMenuA11y },
  render: OpenMenu,
}

export const OpenDark: Story = {
  name: "Menu open, dark",
  tags: openMenuTags,
  parameters: { themes: { themeOverride: "Dark" }, a11y: openMenuA11y },
  render: OpenMenu,
}

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels layout="stacked">
      <FilterRow>
        <FilterSelect
          label="Provider:"
          defaultValue="all"
          options={[
            { value: "all", label: "All" },
            { value: "okafor", label: "Dr. Okafor" },
            { value: "city-lab", label: "City Lab" },
          ]}
        />
        <FilterSelect
          label="Status:"
          defaultValue="pending"
          options={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
          ]}
        />
      </FilterRow>
    </ModePanels>
  ),
}

/* Dates use preset ranges, not a date picker. */
function DateRange() {
  return (
    <FilterRow className="mb-0">
      <FilterSelect
        label="Date:"
        defaultValue="30"
        options={[
          { value: "7", label: "Last 7 days" },
          { value: "30", label: "Last 30 days" },
          { value: "90", label: "Last 90 days" },
          { value: "all", label: "All dates" },
        ]}
      />
      <FilterSelect
        label="Status:"
        defaultValue="all"
        options={[
          { value: "all", label: "All" },
          { value: "pending", label: "Pending" },
          { value: "paid", label: "Paid" },
        ]}
      />
    </FilterRow>
  )
}

export const DateRangeStory: Story = {
  name: "Date range presets",
  parameters: modePanelParameters,
  decorators: [withModePanels()],
  render: DateRange,
}
