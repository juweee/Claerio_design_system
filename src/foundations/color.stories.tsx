import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, TokenValue, modePanelParameters } from "./mode-panels"

const groups: { title: string; note?: string; tokens: string[] }[] = [
  {
    title: "Surfaces and text",
    note: "Put body copy in foreground on background, card or popover.",
    tokens: ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground"],
  },
  {
    title: "Actions",
    note: "Primary is terracotta. Use it for the one action that matters on a screen, links, checked controls and the focus ring.",
    tokens: ["primary", "primary-foreground", "ring", "secondary", "secondary-foreground"],
  },
  {
    title: "Quiet and hover",
    note: "Use accent for hover fills and new-row highlights. Put secondary text in muted-foreground.",
    tokens: ["accent", "accent-foreground", "muted", "muted-foreground", "border", "input"],
  },
  {
    title: "Status and feedback",
    note: "Amber (warning, nav-active) marks warnings and where you are. Never use it on buttons or links. destructive-hover is light mode only: dark mode uses destructive at 90% opacity.",
    tokens: [
      "destructive",
      "destructive-hover",
      "destructive-foreground",
      "error-foreground",
      "info",
      "info-foreground",
      "warning",
      "warning-foreground",
      "nav-active",
      "nav-active-foreground",
      "teal",
      "teal-dark",
    ],
  },
  {
    title: "Charts",
    note: "Categorical, not a ramp. Use in order: terracotta, teal, teal dark, olive, charcoal.",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    title: "Sidebar, progress and tooltip",
    tokens: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "progress-track",
      "progress-fill",
      "tooltip-background",
      "tooltip-foreground",
    ],
  },
]

const ramps: { name: string; anchor: string }[] = [
  { name: "terracotta", anchor: "600 = primary" },
  { name: "olive", anchor: "600 = muted-foreground (light)" },
  { name: "teal", anchor: "500 = teal" },
]

const steps = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]

function Swatch({ token }: { token: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="size-12 shrink-0 rounded-md border border-border"
        style={{ background: `var(--${token})` }}
      />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-mono text-monospace text-foreground">--{token}</span>
        <TokenValue name={token} />
      </div>
    </div>
  )
}

function SemanticColors() {
  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-heading-2">{group.title}</h2>
            {group.note && <p className="text-body-small text-muted-foreground">{group.note}</p>}
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {group.tokens.map((token) => (
              <Swatch key={token} token={token} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function Ramps() {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-body text-muted-foreground">
        Reach for a ramp step only when no semantic token covers the case.
      </p>
      {ramps.map((ramp) => (
        <section key={ramp.name} className="flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <h2 className="text-heading-3 capitalize">{ramp.name}</h2>
            <span className="text-body-small text-muted-foreground">Anchor: {ramp.anchor}</span>
          </div>
          <div className="grid grid-cols-11 gap-2">
            {steps.map((step) => (
              <div key={step} className="flex flex-col gap-2">
                <div
                  className="h-14 rounded-md border border-border"
                  style={{ background: `var(--${ramp.name}-${step})` }}
                />
                <span className="font-mono text-monospace">{step}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

const meta = {
  title: "Foundations/Color",
  parameters: modePanelParameters,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SemanticTokens: Story = {
  name: "Semantic tokens",
  render: () => (
    <ModePanels>
      <SemanticColors />
    </ModePanels>
  ),
}

export const ColorRamps: Story = {
  name: "Ramps",
  render: () => (
    <ModePanels layout="stacked">
      <Ramps />
    </ModePanels>
  ),
}
