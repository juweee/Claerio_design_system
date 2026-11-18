# Documentation gaps that need a design decision

Last updated: November 18, 2026.

These came up in experiment 1.4, when agents built a payments review
screen from the Storybook MCP docs alone. The docs-fixes branch fixed
everything that could be documented from existing code. Each item below
needs a design decision before it can be documented. Nothing here was
added to the components or tokens.

When you decide an item, record it in decisions.md, build or document
it, and remove it from this list.

## 1. Choose a heading level for CardTitle

- **Today:** CardTitle always renders an `<h3>`, with no way to change
  the level. This is now documented.
- **Problem:** On a page with an `<h1>` and cards directly under it, the
  headings skip from level 1 to level 3. Axe reports `heading-order`,
  which fails story tests. Runs 2 and 3 hit this.
- **What agents did:** runs 2 and 3 added `aria-level={2}` to CardTitle
  in their own code.
- **Decide:** whether to add a way to set the level (such as an `as` or
  `level` prop), to approve `aria-level` as the pattern, or to require
  an `<h2>` section heading above cards.

## 2. Define an empty state

- **Today:** No component or pattern for "no results" or "nothing here
  yet".
- **What agents did:** a full-width table cell with a short message and
  a "Clear filters" button. Runs 1 and 3 used a link-variant Button, and
  run 2 a secondary Button.
- **Decide:** the layout (icon or not, title, text, action), the button
  variant, and whether it should be a component.

## 3. Choose a date filter

- **Today:** No date picker or date range control.
- **What agents did:** a FilterSelect with preset ranges (Last 7, 30
  and 90 days, All dates).
- **Decide:** whether preset ranges in a FilterSelect are the pattern,
  or whether the system needs a date range control.

## 4. Define row actions in tables

- **Today:** No guidance on buttons inside table rows.
- **What agents did:** a Button in each row, such as Approve. Run 3
  used a secondary Button under a visually hidden "Actions" header.
- **Problem:** Button is 40px tall, so rows with a button are taller
  than rows without one. This shows in the run 1 and run 2 screenshots.
- **Decide:** the button variant for row actions, whether a compact
  button size is needed, whether a row with actions can also be
  clickable, and how to label the column.

## 5. Choose a retry action for banners

- **Today:** Banner actions are underlined links (`BannerAction` is an
  `<a>`), per the hard rule "banner actions = underlined links, never
  buttons".
- **Problem:** "Try again" after an error is an action, not navigation.
  Agents used a link with `href="#"` and a click handler, which screen
  readers announce as a link that goes nowhere.
- **Decide:** whether BannerAction can render a `<button>` styled as a
  link for in-place actions, or another pattern for retry.

## 6. Define a page header and page layout

- **Today:** No page header pattern, and no example of a page title.
  Agents found `font-serif text-heading-1` in the Type foundations story
  and the CLAUDE.md rule that Lora is for Display and H1.
- **Also:** The Color, Type and Spacing foundations aren't in the MCP
  docs. They have no component, so Storybook leaves them out of the
  components manifest. Agents read `design-tokens.css` instead.
- **Decide:** the page header (title, optional description, where
  actions go), page padding and maximum width. Then decide whether to
  document the foundations for the MCP docs, for example as MDX docs
  pages.

## 7. Decide how other projects import the components

- **Today:** The docs now show the paths that work in this repository,
  such as `@/components/ui/button`. The `@/` alias comes from this
  repository's `tsconfig.json`, and the package is private, so another
  project can't import from these paths.
- **Decide:** whether to publish a package, and its name. If you do,
  update the `@import` tags (see decisions.md, November 18, 2026).

## 8. Decide whether StatusChip needs a terracotta variant

- **Today:** StatusChip has positive, neutral, alert and error.
- **Where it came up:** The prototype canvas (Activity and Dashboard
  pages) marks "Overpayment" with a PROPOSED terracotta chip:
  `--terracotta-600` at 10% fill, `--terracotta-700` text. It keeps
  Overpayment apart from the amber "Payment due" chip and matches the
  Overpayment segment color.
- **Problem:** Terracotta is the primary action color, so a terracotta
  chip may look clickable.
- **Decide:** whether to add the variant, or which existing variant
  Overpayment should use.

## 9. Decide whether BannerBar can be dismissed

- **Today:** Banner has a dismiss button. BannerBar, the page-level bar,
  has none.
- **Where it came up:** The July prototype (`src/design-system/banner.css`)
  adds a PROPOSED dismiss button to the bar. It uses the bar's terracotta
  text color, with a hover rule.
- **Decide:** whether BannerBar should have a dismiss option, and its
  treatment.
