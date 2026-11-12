import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Renders the same content twice: once in light mode and once inside a
 * .dark wrapper. Stories that use this pin the toolbar to light mode so
 * the light panel stays light.
 */
export function ModePanels({
  children,
  layout = "columns",
}: {
  children: React.ReactNode
  layout?: "columns" | "stacked"
}) {
  return (
    <div className={cn("grid min-h-screen", layout === "columns" && "lg:grid-cols-2")}>
      <Panel label="Light mode">{children}</Panel>
      <Panel label="Dark mode" className="dark">
        {children}
      </Panel>
    </div>
  )
}

function Panel({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section aria-label={label} className={cn("bg-background p-8 text-foreground", className)}>
      <p className="mb-6 text-label text-muted-foreground">{label}</p>
      {children}
    </section>
  )
}

/** Story parameters for any story that uses ModePanels. */
export const modePanelParameters = {
  layout: "fullscreen",
  themes: { themeOverride: "Light" },
} as const

/** Shows the resolved value of a CSS variable where it is rendered. */
export function TokenValue({ name }: { name: string }) {
  const ref = React.useRef<HTMLElement>(null)
  const [value, setValue] = React.useState("")

  React.useLayoutEffect(() => {
    if (ref.current) {
      setValue(getComputedStyle(ref.current).getPropertyValue(`--${name}`).trim())
    }
  }, [name])

  return (
    <code ref={ref} className="font-mono text-body-small text-muted-foreground">
      {value}
    </code>
  )
}
