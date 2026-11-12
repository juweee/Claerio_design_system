import type { Meta, StoryObj } from "@storybook/react-vite"

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

const meta = { title: "Components/Modal" } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

function DisputeModal({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Modal defaultOpen={defaultOpen}>
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

/* The modal opens in a layer above the page, so each mode gets its own
   story with the whole page set to that mode. */

export const OpenLight: Story = {
  name: "Open, light",
  parameters: { themes: { themeOverride: "Light" }, layout: "fullscreen" },
  render: () => (
    <div className="min-h-screen p-6">
      <DisputeModal defaultOpen />
    </div>
  ),
}

export const OpenDark: Story = {
  name: "Open, dark",
  parameters: { themes: { themeOverride: "Dark" }, layout: "fullscreen" },
  render: () => (
    <div className="min-h-screen p-6">
      <DisputeModal defaultOpen />
    </div>
  ),
}

export const Live: Story = {
  name: "Live example",
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-120 font-sans text-body text-muted-foreground">
        Open the modal, then try Tab (focus stays inside), Escape (closes) and the buttons.
      </p>
      <div>
        <DisputeModal />
      </div>
    </div>
  ),
}
