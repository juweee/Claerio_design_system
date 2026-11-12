import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { Banner, BannerAction, BannerBar, BannerDescription, BannerTitle } from "./banner"

const meta = {
  title: "Components/Banner",
  component: Banner,
  args: { variant: "info" },
  argTypes: {
    variant: { control: "inline-radio", options: ["info", "warning", "error"] },
  },
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

const noop = () => {}

const narrow: Story["decorators"] = [
  (Story) => (
    <div className="max-w-160">
      <Story />
    </div>
  ),
]

/* ---- One story per variant. These follow the toolbar light/dark switch. ---- */

export const Info: Story = {
  decorators: narrow,
  render: (args) => (
    <Banner {...args} variant="info" onDismiss={noop}>
      <BannerTitle>Claim received</BannerTitle>
      <BannerDescription>
        Processing usually takes 12 days. <BannerAction href="#">Track status</BannerAction>
      </BannerDescription>
    </Banner>
  ),
}

export const Warning: Story = {
  decorators: narrow,
  render: (args) => (
    <Banner {...args} variant="warning">
      <BannerTitle>Possible overcharge</BannerTitle>
      <BannerDescription>
        $187 more than your plan's allowed amount. <BannerAction href="#">Review claim</BannerAction>
      </BannerDescription>
    </Banner>
  ),
}

export const ErrorStory: Story = {
  decorators: narrow,
  name: "Error",
  render: (args) => (
    <Banner {...args} variant="error">
      <BannerTitle>Sync failed</BannerTitle>
      <BannerDescription>We could not reach your insurer. Try again in a few minutes.</BannerDescription>
    </Banner>
  ),
}

export const PageBar: Story = {
  name: "Page-level bar",
  parameters: { layout: "fullscreen" },
  render: () => (
    <BannerBar>
      Your plan renews on January 1, 2027. Review coverage changes.
    </BannerBar>
  ),
}

/* ---- Every variant, light and dark. ---- */

function AllVariants() {
  return (
    <div className="flex max-w-160 flex-col gap-3">
      <span className="text-label text-muted-foreground">With title, action and dismiss</span>
      <Banner variant="info" onDismiss={noop}>
        <BannerTitle>Claim received</BannerTitle>
        <BannerDescription>
          Processing usually takes 12 days. <BannerAction href="#">Track status</BannerAction>
        </BannerDescription>
      </Banner>
      <Banner variant="warning" onDismiss={noop}>
        <BannerTitle>Possible overcharge</BannerTitle>
        <BannerDescription>
          $187 more than your plan's allowed amount. <BannerAction href="#">Review claim</BannerAction>
        </BannerDescription>
      </Banner>
      <Banner variant="error" onDismiss={noop}>
        <BannerTitle>Sync failed</BannerTitle>
        <BannerDescription>
          We could not reach your insurer. <BannerAction href="#">Try again</BannerAction>
        </BannerDescription>
      </Banner>

      <span className="mt-4 text-label text-muted-foreground">Description only, no dismiss</span>
      <Banner variant="info">
        <BannerDescription>Your statement for October is ready.</BannerDescription>
      </Banner>
      <Banner variant="warning">
        <BannerDescription>2 claims need more information.</BannerDescription>
      </Banner>
      <Banner variant="error">
        <BannerDescription>We could not save your changes. Try again.</BannerDescription>
      </Banner>

      <span className="mt-4 text-label text-muted-foreground">Focus on action and dismiss</span>
      <div className="state-focus">
        <Banner variant="info" onDismiss={noop}>
          <BannerTitle>Claim received</BannerTitle>
          <BannerDescription>
            Processing usually takes 12 days. <BannerAction href="#">Track status</BannerAction>
          </BannerDescription>
        </Banner>
      </div>
    </div>
  )
}

export const AllVariantsStory: Story = {
  name: "All variants",
  parameters: {
    ...modePanelParameters,
    pseudo: {
      focusVisible: [".state-focus a", ".state-focus button"],
    },
  },
  render: () => (
    <ModePanels>
      <AllVariants />
    </ModePanels>
  ),
}

/* ---- Same layout as the reference preview.html, for comparison. ---- */

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels layout="stacked">
      <div className="flex max-w-160 flex-col gap-3">
        <BannerBar>Your plan renews on January 1, 2027. Review coverage changes.</BannerBar>
        <Banner variant="info" onDismiss={noop}>
          <BannerTitle>Claim received</BannerTitle>
          <BannerDescription>
            Processing usually takes 12 days. <BannerAction href="#">Track status</BannerAction>
          </BannerDescription>
        </Banner>
        <Banner variant="warning">
          <BannerTitle>Possible overcharge</BannerTitle>
          <BannerDescription>
            $187 more than your plan's allowed amount. <BannerAction href="#">Review claim</BannerAction>
          </BannerDescription>
        </Banner>
        <Banner variant="error">
          <BannerTitle>Sync failed</BannerTitle>
          <BannerDescription>We could not reach your insurer. Try again in a few minutes.</BannerDescription>
        </Banner>
      </div>
    </ModePanels>
  ),
}
