import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"
import {
  BellIcon,
  ChartBarIcon,
  GearIcon,
  PulseIcon,
  QuestionIcon,
  ShieldCheckIcon,
  SparkleIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react"

import { modePanelParameters, withModePanels } from "@/foundations/mode-panels"

import { Avatar } from "./avatar"
import { Banner, BannerAction, BannerDescription, BannerTitle } from "./banner"
import { Button } from "./button"
import { Card, CardBody, CardTitle } from "./card"
import { PageHeader, PageHeaderActions, PageHeaderTitle } from "./page-header"
import { SidebarNav, SidebarNavItem } from "./sidebar-nav"

const meta = {
  title: "Components/Page header",
  component: PageHeader,
  subcomponents: { PageHeaderTitle, PageHeaderActions },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

function Header() {
  return (
    <PageHeader>
      <PageHeaderTitle>Activity</PageHeaderTitle>
      <PageHeaderActions>
        <span className="text-body-small whitespace-nowrap text-muted-foreground">Synced 12 minutes ago</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" aria-label="Help" className="px-2 text-foreground dark:text-foreground">
            <QuestionIcon aria-hidden />
          </Button>
          <Button variant="ghost" aria-label="Alerts" className="px-2 text-foreground dark:text-foreground">
            <BellIcon aria-hidden />
          </Button>
        </div>
      </PageHeaderActions>
    </PageHeader>
  )
}

export const Default: Story = {
  name: "Header",
  parameters: modePanelParameters,
  decorators: [withModePanels("stacked")],
  render: Header,
}

/* ---------- App shell ---------- */

/* The whole page frame: rail, then a column of PageHeader, <main> and
   <footer>. The header and footer sit outside <main>, so they're the
   banner and contentinfo landmarks. The shell is at most
   --layout-max-width wide. The logo row is left out: use the provided
   logo files from the brand folder. */
function AppShell() {
  const sections = [
    { id: "home", label: "Dashboard", Icon: SquaresFourIcon },
    { id: "activity", label: "Activity", Icon: PulseIcon },
    { id: "coverage", label: "Coverage", Icon: ShieldCheckIcon },
    { id: "reporting", label: "Reporting", Icon: ChartBarIcon },
    { id: "advisor", label: "My ædvisor", Icon: SparkleIcon },
  ]

  return (
    <div className="mx-auto flex min-h-screen max-w-(--layout-max-width) bg-background text-foreground">
      <aside className="flex w-55 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <SidebarNav aria-label="Primary" className="px-3 pt-4">
          {sections.map(({ id, label, Icon }) => (
            <SidebarNavItem key={id} href={`#${id}`} active={id === "home"} className="gap-2">
              <Icon aria-hidden className="size-4" />
              {label}
            </SidebarNavItem>
          ))}
          <div aria-hidden className="mx-2 my-2 h-px bg-sidebar-border" />
          <SidebarNavItem href="#settings" className="gap-2">
            <GearIcon aria-hidden className="size-4" />
            Settings
          </SidebarNavItem>
        </SidebarNav>
        <div className="mt-auto flex items-center gap-2 border-t border-sidebar-border px-5 py-4">
          <Avatar name="Ava Chen" initials="AC" size="sm" />
          <span className="text-body font-[500] text-sidebar-foreground">Ava Chen</span>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader>
          <PageHeaderTitle>Good afternoon, Ava</PageHeaderTitle>
          <PageHeaderActions>
            <span className="text-body-small whitespace-nowrap text-muted-foreground">Synced 12 minutes ago</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" aria-label="Help" className="px-2 text-foreground dark:text-foreground">
                <QuestionIcon aria-hidden />
              </Button>
              <Button variant="ghost" aria-label="Alerts" className="px-2 text-foreground dark:text-foreground">
                <BellIcon aria-hidden />
              </Button>
            </div>
          </PageHeaderActions>
        </PageHeader>
        <main className="flex flex-1 flex-col gap-6 p-6">
          <Banner variant="warning">
            <BannerTitle>2 expenses have been flagged for review.</BannerTitle>
            <BannerDescription>
              <BannerAction href="#activity">Review now</BannerAction>
            </BannerDescription>
          </Banner>
          <section aria-labelledby="spending-heading" className="flex flex-col gap-4">
            <h2 id="spending-heading" className="text-heading-2">
              Spending
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardTitle>Total health spending 2026</CardTitle>
                <CardBody>$4,182.40 so far this year.</CardBody>
              </Card>
              <Card>
                <CardTitle>Deductible</CardTitle>
                <CardBody>$1,240 of $2,000 met.</CardBody>
              </Card>
            </div>
          </section>
        </main>
        <footer className="flex items-center justify-between border-t border-border px-6 py-4">
          <span className="text-body-small text-muted-foreground">© 2026 Clærio. All rights reserved.</span>
          <div className="flex items-center gap-4 text-body-small">
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>
            <a href="/terms" className="underline">
              Terms of Service
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

const checkLandmarks: Story["play"] = async ({ canvas, step }) => {
  await step("Header and footer are top-level landmarks, outside main", async () => {
    const main = canvas.getByRole("main")
    await expect(main.contains(canvas.getByRole("banner"))).toBe(false)
    await expect(main.contains(canvas.getByRole("contentinfo"))).toBe(false)
  })
  await step("The page title is the only h1", async () => {
    await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Good afternoon, Ava")
  })
}

/* One shell per story: two copies on one page would repeat every
   landmark. */
export const AppShellLight: Story = {
  name: "App shell, light",
  parameters: { layout: "fullscreen", themes: { themeOverride: "Light" } },
  render: AppShell,
  play: checkLandmarks,
}

export const AppShellDark: Story = {
  name: "App shell, dark",
  parameters: { layout: "fullscreen", themes: { themeOverride: "Dark" } },
  render: AppShell,
  play: checkLandmarks,
}
