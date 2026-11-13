import type { Meta, StoryObj } from "@storybook/react-vite"

import { cn } from "@/lib/utils"

import { ModePanels, modePanelParameters } from "./mode-panels"

const scale: { name: string; className: string; spec: string; sample: string }[] = [
  { name: "Display", className: "font-serif text-display", spec: "Lora 32/700", sample: "Your deductible is 62% met" },
  { name: "Heading 1", className: "font-serif text-heading-1", spec: "Lora 24/700", sample: "Review a claim" },
  { name: "Heading 2", className: "text-heading-2", spec: "Inter 20/600", sample: "Recent claims" },
  { name: "Heading 3", className: "text-heading-3", spec: "Inter 16/600", sample: "Annual physical" },
  { name: "Body", className: "text-body", spec: "Inter 14/400", sample: "3 claims pending. Average processing: 12 days." },
  { name: "Body small", className: "text-body-small text-muted-foreground", spec: "Inter 12/400, muted", sample: "Updated July 14, 2026" },
  { name: "Label", className: "text-label", spec: "Inter 12/600", sample: "Member ID" },
  { name: "Button", className: "text-button", spec: "Inter 14/500", sample: "File dispute" },
  { name: "Monospace", className: "font-mono text-monospace", spec: "System mono 13/400", sample: "CLM-2026-004817" },
]

function TypeScale() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-body text-muted-foreground">
        Lora sets Display and Heading 1 only. Inter sets everything else.
      </p>
      {scale.map((style) => (
        <div key={style.name} className="flex flex-col gap-2 border-b border-border pb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-label">{style.name}</span>
            <span className="font-mono text-body-small text-muted-foreground">{style.spec}</span>
          </div>
          <p className={cn(style.className)}>{style.sample}</p>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: "Foundations/Type",
  // Token reference pages, not components, so they stay out of the components manifest.
  tags: ["!manifest"],
  parameters: modePanelParameters,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const TypeScaleStory: Story = {
  name: "Type scale",
  render: () => (
    <ModePanels>
      <TypeScale />
    </ModePanels>
  ),
}
