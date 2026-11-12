import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { Avatar } from "./avatar"

const meta = { title: "Components/Avatar" } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  parameters: modePanelParameters,
  render: () => (
    <ModePanels>
      <div className="flex items-end gap-6">
        {(["sm", "md", "lg"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Avatar size={size} initials="MK" name="Maya Khan" />
            <span className="text-body-small text-muted-foreground">
              {size === "sm" ? "sm, 24px" : size === "md" ? "md, 32px" : "lg, 40px"}
            </span>
          </div>
        ))}
      </div>
    </ModePanels>
  ),
}

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels layout="stacked">
      <div className="flex items-end gap-3">
        <Avatar size="sm" initials="MK" name="Maya Khan" />
        <Avatar size="md" initials="MK" name="Maya Khan" />
        <Avatar size="lg" initials="MK" name="Maya Khan" />
      </div>
    </ModePanels>
  ),
}
