import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { ModePanels, modePanelParameters } from "@/foundations/mode-panels"

import { SidebarNav, SidebarNavItem, SidebarNavLabel } from "./sidebar-nav"
import { NavTabs, NavTabsItem, Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

const meta = {
  title: "Components/Navigation",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/* Light and dark panels repeat each example, so give every copy a unique
   name for screen readers. A real page has one of each. */
function useExampleLabel(label: string) {
  return `${label} (example ${React.useId()})`
}

function ExampleSidebar({ label = "Main" }: { label?: string }) {
  const name = useExampleLabel(label)
  return (
    <SidebarNav aria-label={name} className="w-55">
      <SidebarNavLabel>Platform</SidebarNavLabel>
      <SidebarNavItem href="#" active>
        Dashboard
      </SidebarNavItem>
      <SidebarNavItem href="#" className="state-hover">
        Claims
      </SidebarNavItem>
      <SidebarNavItem href="#" className="state-focus">
        Reports
      </SidebarNavItem>
      <SidebarNavLabel>Settings</SidebarNavLabel>
      <SidebarNavItem href="#">Accounts</SidebarNavItem>
      <SidebarNavItem href="#">Notifications</SidebarNavItem>
    </SidebarNav>
  )
}

function ExampleNavTabs({ label = "Claim views" }: { label?: string }) {
  const name = useExampleLabel(label)
  return (
    <NavTabs aria-label={name}>
      <NavTabsItem href="#" active>
        Overview
      </NavTabsItem>
      <NavTabsItem href="#" className="state-hover">
        Line items
      </NavTabsItem>
      <NavTabsItem href="#" className="state-focus">
        Documents
      </NavTabsItem>
      <NavTabsItem href="#">History</NavTabsItem>
    </NavTabs>
  )
}

function ExampleTabs() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Claim details">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="items">Line items</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="history" disabled>
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-4">
        Claim #47120: annual physical, covered at $0.
      </TabsContent>
      <TabsContent value="items" className="pt-4">
        3 line items. Average processing: 12 days.
      </TabsContent>
      <TabsContent value="documents" className="pt-4">
        2 documents attached.
      </TabsContent>
    </Tabs>
  )
}

/* ---- Playground stories. These follow the toolbar light/dark switch. ---- */

export const Sidebar: Story = {
  render: () => <ExampleSidebar />,
}

export const LinkTabs: Story = {
  name: "Link tabs",
  render: () => <ExampleNavTabs />,
}

export const InPageTabs: Story = {
  name: "In-page tabs",
  render: () => <ExampleTabs />,
}

/* ---- Every state, light and dark. ---- */

export const AllStates: Story = {
  name: "All states",
  parameters: {
    ...modePanelParameters,
    pseudo: {
      hover: [".state-hover"],
      focusVisible: [".state-focus"],
    },
  },
  render: () => (
    <ModePanels>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-label text-muted-foreground">
            Sidebar: Dashboard active, Claims hover, Reports focus
          </span>
          <ExampleSidebar />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-label text-muted-foreground">
            Link tabs: Overview active, Line items hover, Documents focus
          </span>
          <ExampleNavTabs />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-label text-muted-foreground">
            In-page tabs: Overview active, History disabled
          </span>
          <ExampleTabs />
        </div>
      </div>
    </ModePanels>
  ),
}

/* ---- Same as the reference previews, for comparison. ---- */

export const ReferenceLayout: Story = {
  name: "Reference layout",
  parameters: modePanelParameters,
  render: () => (
    <ModePanels layout="stacked">
      <ReferenceExamples />
    </ModePanels>
  ),
}

function ReferenceExamples() {
  const sidebarName = useExampleLabel("Main")
  const tabsName = useExampleLabel("Claim views")
  return (
    <div className="flex flex-col gap-8">
      <SidebarNav aria-label={sidebarName} className="w-55">
        <SidebarNavLabel>Platform</SidebarNavLabel>
        <SidebarNavItem href="#" active>
          Dashboard
        </SidebarNavItem>
        <SidebarNavItem href="#">Claims</SidebarNavItem>
        <SidebarNavItem href="#">Reports</SidebarNavItem>
        <SidebarNavLabel>Settings</SidebarNavLabel>
        <SidebarNavItem href="#">Accounts</SidebarNavItem>
      </SidebarNav>
      <NavTabs aria-label={tabsName}>
        <NavTabsItem href="#" active>
          Overview
        </NavTabsItem>
        <NavTabsItem href="#">Line items</NavTabsItem>
        <NavTabsItem href="#">Documents</NavTabsItem>
        <NavTabsItem href="#">History</NavTabsItem>
      </NavTabs>
    </div>
  )
}
