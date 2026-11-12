import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { Button } from "./button"
import {
  Toast,
  ToastAction,
  ToastBody,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"

const meta = {
  title: "Components/Toast",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/* Shows one toast in place, instead of pinned to the corner of the screen. */
function InPlace({ label, children }: { label: string; children: React.ReactNode }) {
  // Each example gets its own notification region. A real app has one,
  // so give each a distinct name for screen readers and checkers.
  const id = React.useId()
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label text-muted-foreground">{label}</span>
      <ToastProvider duration={Infinity}>
        {children}
        <ToastViewport label={`Example: ${label} ${id}`} className="static w-[380px] max-w-full" />
      </ToastProvider>
    </div>
  )
}

function AllVariants() {
  return (
    <div className="flex flex-col gap-6">
      <InPlace label="Success with action">
        <Toast open>
          <ToastBody>
            <ToastTitle>Dispute filed</ToastTitle>
            <ToastDescription>Claim #47120 sent to your insurer.</ToastDescription>
          </ToastBody>
          <ToastAction altText="Open the claim to withdraw the dispute">Undo</ToastAction>
        </Toast>
      </InPlace>
      <InPlace label="Success, no action">
        <Toast open>
          <ToastBody>
            <ToastTitle>Payment scheduled</ToastTitle>
            <ToastDescription>$212.40 will be paid on December 1, 2026.</ToastDescription>
          </ToastBody>
        </Toast>
      </InPlace>
      <InPlace label="Error with action">
        <Toast open variant="error">
          <ToastBody>
            <ToastTitle>Upload failed</ToastTitle>
            <ToastDescription>The file is larger than 10 MB. Choose a smaller file.</ToastDescription>
          </ToastBody>
          <ToastAction altText="Upload the file again from the documents page">Try again</ToastAction>
        </Toast>
      </InPlace>
      <InPlace label="Action hover">
        <Toast open className="state-hover">
          <ToastBody>
            <ToastTitle>Dispute filed</ToastTitle>
            <ToastDescription>Claim #47120 sent to your insurer.</ToastDescription>
          </ToastBody>
          <ToastAction altText="Open the claim to withdraw the dispute">Undo</ToastAction>
        </Toast>
      </InPlace>
      <InPlace label="Action focus">
        <Toast open className="state-focus">
          <ToastBody>
            <ToastTitle>Dispute filed</ToastTitle>
            <ToastDescription>Claim #47120 sent to your insurer.</ToastDescription>
          </ToastBody>
          <ToastAction altText="Open the claim to withdraw the dispute">Undo</ToastAction>
        </Toast>
      </InPlace>
    </div>
  )
}

/* ---- Every variant and state, light and dark. ---- */

export const AllVariantsStory: Story = {
  name: "All variants",
  parameters: {
    ...modePanelParameters,
    pseudo: {
      hover: [".state-hover [data-slot=toast-action]"],
      focusVisible: [".state-focus [data-slot=toast-action]"],
    },
  },
  render: () => (
    <ModePanels>
      <AllVariants />
    </ModePanels>
  ),
}

/* ---- A real toast in the bottom-right corner. Follows the toolbar. ---- */

function LiveDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <ToastProvider>
      <Button
        onClick={() => {
          setOpen(false)
          window.setTimeout(() => setOpen(true), 50)
        }}
      >
        File dispute
      </Button>
      <Toast open={open} onOpenChange={setOpen}>
        <ToastBody>
          <ToastTitle>Dispute filed</ToastTitle>
          <ToastDescription>Claim #47120 sent to your insurer.</ToastDescription>
        </ToastBody>
        <ToastAction altText="Open the claim to withdraw the dispute">Undo</ToastAction>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  )
}

export const Live: Story = {
  name: "Live example",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="min-h-screen p-6">
      <p className="mb-4 max-w-120 text-body text-muted-foreground">
        Click the button to show a toast in the bottom-right corner. It closes after 5 seconds, or on
        Escape. Hover or focus pauses the timer.
      </p>
      <LiveDemo />
    </div>
  ),
}

/* ---- Same as the reference preview.html, for comparison. ---- */

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels layout="stacked">
      <InPlace label="Reference preview">
        <Toast open>
          <ToastBody>
            <ToastTitle>Dispute filed</ToastTitle>
            <ToastDescription>Claim #47120 sent to your insurer.</ToastDescription>
          </ToastBody>
          <ToastAction altText="Open the claim to withdraw the dispute">Undo</ToastAction>
        </Toast>
      </InPlace>
    </ModePanels>
  ),
}
