import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "./button"
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
} from "./modal"

const meta = {
  title: "Components/Modal",
  component: Modal,
  subcomponents: { ModalTrigger, ModalContent, ModalTitle, ModalDescription, ModalFooter, ModalClose },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

function DisputeModal(args: React.ComponentProps<typeof Modal>) {
  return (
    <Modal {...args}>
      <ModalTrigger asChild>
        <Button variant="destructive">Dispute charge</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalTitle>Dispute this charge?</ModalTitle>
        <ModalDescription>
          We will file the dispute with your insurer. Average resolution: 12 days.
        </ModalDescription>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="secondary">Cancel</Button>
          </ModalClose>
          <ModalClose asChild>
            <Button>File dispute</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

/* Fills the page so the open modal sits over a full-height background. */
const fullPage: Decorator = (Story) => (
  <div className="min-h-screen p-6">
    <Story />
  </div>
)

/* On Docs pages, the open modal renders in its own frame. Inline, it
   would cover the whole Docs page and trap focus there (2026-11-18). */
const openModalDocs = { story: { inline: false, height: "400px" } }

/* The modal opens in a layer above the page, so each mode gets its own
   story with the whole page set to that mode. */

export const OpenLight: Story = {
  name: "Open, light",
  parameters: { themes: { themeOverride: "Light" }, layout: "fullscreen", docs: openModalDocs },
  args: { defaultOpen: true },
  decorators: [fullPage],
  render: DisputeModal,
}

export const OpenDark: Story = {
  name: "Open, dark",
  parameters: { themes: { themeOverride: "Dark" }, layout: "fullscreen", docs: openModalDocs },
  args: { defaultOpen: true },
  decorators: [fullPage],
  render: DisputeModal,
}

export const Live: Story = {
  name: "Live example",
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4">
        <p className="max-w-120 font-sans text-body text-muted-foreground">
          Open the modal, then try Tab (focus stays inside), Escape (closes) and the buttons.
        </p>
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
  render: DisputeModal,
}
