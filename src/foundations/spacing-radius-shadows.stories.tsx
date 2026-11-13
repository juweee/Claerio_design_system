import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, TokenValue, modePanelParameters } from "./mode-panels"

const spaces = ["space-1", "space-2", "space-3", "space-4", "space-6", "space-8", "space-12"]

const radii: { token: string; use: string }[] = [
  { token: "radius-sm", use: "Chips, badges, tooltips, nav items" },
  { token: "radius-md", use: "Inputs and buttons" },
  { token: "radius-lg", use: "Cards, modals and toasts" },
  { token: "radius-full", use: "Avatars, status chips, switches" },
]

const shadows: { token: string; use: string }[] = [
  { token: "shadow-overlay", use: "Toasts and select menus. Stays visible in dark mode." },
  { token: "shadow-modal", use: "Modals only. None in dark mode, where the overlay does the work." },
]

function Spacing() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-2">Spacing</h2>
        <p className="text-body-small text-muted-foreground">Space in multiples of 4px.</p>
      </div>
      {spaces.map((token) => (
        <div key={token} className="grid grid-cols-[96px_48px_1fr] items-center gap-4">
          <span className="font-mono text-monospace">--{token}</span>
          <TokenValue name={token} />
          <div className="h-4 rounded-sm bg-primary" style={{ width: `var(--${token})` }} />
        </div>
      ))}
    </section>
  )
}

function Radius() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-2">Radius</h2>
        <p className="text-body-small text-muted-foreground">
          Use 4, 8, 12 or 9999 only. A nested element takes the outer radius minus the inset.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {radii.map(({ token, use }) => (
          <div key={token} className="flex flex-col gap-2">
            <div
              className="size-20 border border-foreground bg-muted"
              style={{ borderRadius: `var(--${token})` }}
            />
            <span className="font-mono text-monospace">--{token}</span>
            <TokenValue name={token} />
            <span className="text-body-small text-muted-foreground">{use}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Shadows() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-2">Shadows</h2>
        <p className="text-body-small text-muted-foreground">
          Separate things with a hairline border, not shadows. Cards carry no shadow.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {shadows.map(({ token, use }) => (
          <div key={token} className="flex flex-col gap-3">
            <div
              className="h-24 rounded-lg border border-border bg-popover"
              style={{ boxShadow: `var(--${token})` }}
            />
            <span className="font-mono text-monospace">--{token}</span>
            <TokenValue name={token} />
            <span className="text-body-small text-muted-foreground">{use}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

const meta = {
  title: "Foundations/Spacing, radius and shadows",
  // Token reference pages, not components, so they stay out of the components manifest.
  tags: ["!manifest"],
  parameters: modePanelParameters,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SpacingStory: Story = {
  name: "Spacing",
  render: () => (
    <ModePanels>
      <Spacing />
    </ModePanels>
  ),
}

export const RadiusStory: Story = {
  name: "Radius",
  render: () => (
    <ModePanels>
      <Radius />
    </ModePanels>
  ),
}

export const ShadowsStory: Story = {
  name: "Shadows",
  render: () => (
    <ModePanels>
      <Shadows />
    </ModePanels>
  ),
}
