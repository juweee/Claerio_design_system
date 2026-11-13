import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { Checkbox } from "./checkbox"
import { Label } from "./label"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Switch } from "./switch"

const meta = {
  title: "Components/Selection controls",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const years = ["2026", "2025", "2024"]

/* ---- Playground stories. These follow the toolbar light/dark switch. ---- */

export const CheckboxStory: Story = {
  name: "Checkbox",
  render: () => (
    <div className="flex flex-col gap-3">
      <Label variant="control">
        <Checkbox defaultChecked />
        Email statements
      </Label>
      <Label variant="control">
        <Checkbox defaultChecked="indeterminate" />
        All accounts
      </Label>
      <Label variant="control">
        <Checkbox />
        Text alerts
      </Label>
    </div>
  ),
}

export const RadioStory: Story = {
  name: "Radio group",
  render: () => (
    <RadioGroup defaultValue="in" aria-label="Network">
      <Label variant="control">
        <RadioGroupItem value="in" />
        In network
      </Label>
      <Label variant="control">
        <RadioGroupItem value="out" />
        Out of network
      </Label>
    </RadioGroup>
  ),
}

export const SwitchStory: Story = {
  name: "Switch",
  render: () => (
    <div className="flex flex-col gap-3">
      <Label variant="control">
        <Switch defaultChecked />
        Auto-pay on
      </Label>
      <Label variant="control">
        <Switch />
        Paper mail
      </Label>
    </div>
  ),
}

export const SelectStory: Story = {
  name: "Select",
  render: () => (
    <Select defaultValue="2026">
      <SelectTrigger aria-label="Plan year" className="w-50">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem key={y} value={y}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

/* ---- Every state, light and dark. ---- */

const columns = ["Default", "Focus", "Disabled"] as const

function StateRow({
  label,
  render,
}: {
  label: string
  render: (props: { disabled: boolean }) => React.ReactNode
}) {
  return (
    <>
      <span className="text-label">{label}</span>
      {columns.map((col) => (
        <div key={col} className={`state-${col.toLowerCase()} flex items-center`}>
          {render({ disabled: col === "Disabled" })}
        </div>
      ))}
    </>
  )
}

function StateMatrix() {
  return (
    <div className="grid grid-cols-[160px_repeat(3,minmax(160px,max-content))] items-center gap-x-8 gap-y-5">
      <span />
      {columns.map((col) => (
        <span key={col} className="text-label text-muted-foreground">
          {col}
        </span>
      ))}
      <StateRow
        label="Checkbox, unchecked"
        render={(p) => (
          <Label variant="control">
            <Checkbox {...p} />
            Text alerts
          </Label>
        )}
      />
      <StateRow
        label="Checkbox, checked"
        render={(p) => (
          <Label variant="control">
            <Checkbox defaultChecked {...p} />
            Email statements
          </Label>
        )}
      />
      <StateRow
        label="Checkbox, indeterminate"
        render={(p) => (
          <Label variant="control">
            <Checkbox defaultChecked="indeterminate" {...p} />
            All accounts
          </Label>
        )}
      />
      <StateRow
        label="Radio, unselected"
        render={(p) => (
          <RadioGroup aria-label="Network" {...p}>
            <Label variant="control">
              <RadioGroupItem value="out" />
              Out of network
            </Label>
          </RadioGroup>
        )}
      />
      <StateRow
        label="Radio, selected"
        render={(p) => (
          <RadioGroup aria-label="Network" defaultValue="in" {...p}>
            <Label variant="control">
              <RadioGroupItem value="in" />
              In network
            </Label>
          </RadioGroup>
        )}
      />
      <StateRow
        label="Switch, off"
        render={(p) => (
          <Label variant="control">
            <Switch {...p} />
            Paper mail
          </Label>
        )}
      />
      <StateRow
        label="Switch, on"
        render={(p) => (
          <Label variant="control">
            <Switch defaultChecked {...p} />
            Auto-pay on
          </Label>
        )}
      />
      <StateRow
        label="Select, placeholder"
        render={(p) => (
          <Select {...p}>
            <SelectTrigger aria-label="Plan year" className="w-50">
              <SelectValue placeholder="Choose a year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <StateRow
        label="Select, value"
        render={(p) => (
          <Select defaultValue="2026" {...p}>
            <SelectTrigger aria-label="Plan year" className="w-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  )
}

export const AllStates: Story = {
  name: "All states",
  parameters: {
    ...modePanelParameters,
    pseudo: {
      focusVisible: [".state-focus button"],
    },
  },
  render: () => (
    <ModePanels layout="stacked">
      <StateMatrix />
    </ModePanels>
  ),
}

/* ---- Open select menu. The menu opens in a layer above the page, so
   each mode gets its own story with the whole page set to that mode. ---- */

/* An open Radix menu hides the rest of the page from screen readers,
   including its own trigger, which axe reports as aria-hidden-focus. Radix
   keeps keyboard focus inside the open menu, so the hidden trigger can't be
   reached. Exempt only that rule, only on the open-menu stories
   (decided 2026-11-13, see decisions.md). */
const openMenuA11y = { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } }

function OpenMenu() {
  return (
    <div className="min-h-60">
      <Select defaultValue="2026" defaultOpen>
        <SelectTrigger aria-label="Plan year" className="w-50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const OpenMenuLight: Story = {
  name: "Select menu open, light",
  parameters: { themes: { themeOverride: "Light" }, a11y: openMenuA11y },
  render: () => <OpenMenu />,
}

export const OpenMenuDark: Story = {
  name: "Select menu open, dark",
  parameters: { themes: { themeOverride: "Dark" }, a11y: openMenuA11y },
  render: () => <OpenMenu />,
}

/* ---- Same layout as the reference preview.html, for comparison. ---- */

function ReferenceRow() {
  return (
    <div className="flex flex-wrap items-start gap-12">
      <div className="flex flex-col gap-2.5">
        <Label variant="control">
          <Checkbox defaultChecked />
          Email statements
        </Label>
        <Label variant="control">
          <Checkbox defaultChecked="indeterminate" />
          All accounts
        </Label>
        <Label variant="control">
          <Checkbox />
          Text alerts
        </Label>
      </div>
      <RadioGroup defaultValue="in" aria-label="Network" className="gap-2.5">
        <Label variant="control">
          <RadioGroupItem value="in" />
          In network
        </Label>
        <Label variant="control">
          <RadioGroupItem value="out" />
          Out of network
        </Label>
      </RadioGroup>
      <div className="flex flex-col gap-2.5">
        <Label variant="control">
          <Switch defaultChecked />
          Auto-pay on
        </Label>
        <Label variant="control">
          <Switch />
          Paper mail
        </Label>
      </div>
      <Select defaultValue="2026">
        <SelectTrigger aria-label="Plan year" className="w-50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels layout="stacked">
      <ReferenceRow />
    </ModePanels>
  ),
}
