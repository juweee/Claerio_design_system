# Documentation gaps that need a design decision

Last updated: November 25, 2026.

These came up in experiment 1.4, when agents built a payments review
screen from the Storybook MCP docs alone, and in the comparison with the
prototype canvas. Items 12 to 20 came up in experiment 1.4b, which ran
the same task 3 times. Items 21 to 27 came up in experiment 1.3, while
writing component records. Each item below needs a design decision
before it can be documented or built.

When you decide an item, record it in decisions.md, build or document
it, and remove it from this list. Item numbers stay the same, so links
to them keep working.

Decided on November 18, 2026, and removed: 1 (CardTitle level), 2
(empty state), 3 (date filter), 5 (banner retry action) and 6 (page
layout, and the foundations in the MCP docs). Also decided on
November 18, 2026: the PROPOSED fields in the experiment 1.3 component
records. See decisions.md.

Decided on November 23, 2026, from round 1.4c: 15 (spacing under the
card title), 17 (layout when loading fails), 18 (claim status list) and
24 (short dates in tables) are removed, and 13 is narrowed. The row
highlight now lasts as long as its success toast. See decisions.md.

Item 28 came up in experiment 1.6, when Figma was generated from the
code. Items 29 and 30 came up in experiment 1.1, which compared 4 kinds
of design system guidance over 12 runs.

## 4. Define actions in tables without a detail view

- **Decided November 18, 2026:** a clickable row holds no buttons or
  links. Its actions live in the detail view it opens (see
  decisions.md).
- **Still open:** tables whose rows don't open anything, where an
  action can only sit in the row.
- **What agents did:** a Button in each row, such as Approve. Run 3
  used a secondary Button under a visually hidden "Actions" header.
- **Problem:** Button is 40px tall, so rows with a button are taller
  than rows without one. This shows in the run 1 and run 2 screenshots.
- **Decide:** the button variant for these row actions, whether a
  compact button size is needed, and how to label the column.

## 7. Decide how other projects import the components (deferred)

- **Status:** Deferred on November 18, 2026. Revisit when another
  project needs the components.

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
  chip may look clickable. In dark mode, the proposed text measures
  1.56:1 against its fill, below the 4.5:1 minimum, because the canvas
  has no dark-mode style for it.
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

## 10. Design a count for the Alerts button

- **Today:** No treatment for a count on an icon button. The PageHeader
  stories show Alerts with no count.
- **Where it came up:** The prototype canvas's Page Template shows the
  unread count in a 15px terracotta circle with 10px text, at the top
  right of the bell. 10px is below the type scale; the smallest style
  is 12px.
- **Decide:** whether the count shows a number or only a dot, its size,
  color and type, and how screen readers hear it. The canvas puts the
  count in the button's label, such as "Alerts, 4 unread".

## 11. Fix the logo so it doesn't depend on a font

- **Today:** The only logo file in this repository was a preview copy of
  `Claerio_ae_charcoal_circle.svg`, now deleted. Its æ is live text that
  loads Lora with a web-font `@import`. Inside an `<img>`, the browser
  doesn't load that font, so the æ renders in Georgia. That breaks the
  logo rule: never recreate the logo in another font.
- **Likely fix:** Start from the original SVGs in the Drive brand folder
  and convert the æ (and the wordmark text) to outlines, so each file
  draws the letters as shapes. Then add the files to this repository and
  use them in the app shell's navigation rail.
- **Decide:** who converts the files, and whether the outlined versions
  replace the originals in Drive.

## 12. Decide what the detail view is

- **Found in:** experiment 1.4b.
- **Today:** TableRow says a clickable row's actions live in "the
  detail view the row opens", but the system has no detail view.
- **What agents did:** all 3 runs used a Modal to approve a claim.
- **Also raised in experiment 1.3:** the Table record points here. The
  2026-11-18 row actions comparison used a temporary panel preview.
- **Decide:** whether the system needs a detail view, drawer or side
  panel, and when a Modal is enough. Also decide where focus goes when
  it closes.

## 13. Decide how rows that don't open differ on hover

- **Found in:** experiment 1.4b.
- **Decided November 23, 2026:** a row that doesn't open ends with an
  empty TableCell in the chevron column (see decisions.md).
- **Today:** a row without `onClick` has no pointer, hover color or
  chevron. Nothing says whether that's enough for people to tell it
  apart from rows that open.
- **Decide:** whether rows that don't open need more on hover (raised in
  experiment 1.3).

## 14. Decide whether a Modal can open without a trigger

- **Found in:** experiment 1.4b.
- **Today:** the Modal docs and stories always open it from a
  ModalTrigger.
- **What agents did:** all 3 runs opened it from a table row, with
  `open` and `onOpenChange` and no ModalTrigger.
- **Decide:** whether this is supported, and where focus returns when
  the Modal closes.

## 16. Design a loading state

- **Found in:** experiment 1.4b.
- **Today:** no component or pattern for content that is loading.
- **What agents did:** run 3 went straight from the error state to
  loaded data, with nothing in between.
- **Decide:** what shows while data loads, such as a skeleton, a
  spinner or a text message.

## 19. Decide whether Table supports row selection

- **Found in:** experiment 1.4b.
- **Today:** Table has no row selection, so there are no bulk actions.
- **What agents did:** approved one claim at a time. Run 3 noted that a
  billing manager would likely approve several claims at once.
- **Also listed in:** decisions.md, "Deferred / open" (Table
  multi-select, inline editing, column resize). Raised again in
  experiment 1.3.
- **Decide:** whether Table supports selection and bulk actions, and
  how they work with clickable rows. Also decide how selection looks
  next to the `--accent` hover and new-row highlight.

## 20. Fix the baseline of monospace IDs in tables

- **Found in:** experiment 1.4b (run 3).
- **Today:** claim IDs in a `TableCell mono` sit about 1px higher than
  the text in the other cells of the same row. It shows in the run 3
  screenshots.
- **Decide:** nothing to decide. Fix the alignment in TableCell.

## 21. Design an icon-only button

- **Found in:** experiment 1.3, writing the Button record.
- **Today:** Button has no icon-only treatment. The PageHeader stories
  build the Help and Alerts buttons from a ghost Button with
  `aria-label` and class overrides (`px-2 text-foreground`).
- **Decide:** whether icon-only is a variant or a size, its padding and
  icon color, and whether `aria-label` becomes required for it.

## 22. Decide whether Button needs a loading state

- **Found in:** experiment 1.3, writing the Button record.
- **Today:** no loading state and no protection against a second
  click. Disabled is the only way to block clicks. `aria-disabled`
  changes the look but still runs the click handler. Item 16 covers
  loading content.
- **Decide:** whether to add a loading state (spinner, label, width),
  and when to use `disabled` versus `aria-disabled`.

## 23. Decide how screen readers announce clickable table rows

- **Found in:** experiment 1.3, writing the Table record.
- **Decided November 18, 2026:** name every table with `aria-label`, or
  `aria-labelledby` pointing at the Card title (see decisions.md).
- **Still open:** a clickable row keeps the row role, so a screen
  reader may not say it opens anything. Not tested with a screen
  reader.
- **Decide:** whether clickable rows need more for screen readers,
  after a screen reader test.

## 25. Show subcomponent guidance on Storybook Docs pages

- **Found in:** experiment 1.3, after turning on autodocs.
- **Today:** a Docs page shows only the main component's description.
  The descriptions of its parts, such as TableRow's "no buttons in a
  clickable row" and ModalTrigger's "use a Button with asChild", appear
  in `docs-show` but not on the page. Badge's description is no longer
  on the "Badge and status chip" page, because StatusChip became that
  entry's main component so its record leads.
- **Decide:** whether part guidance moves into the main component's
  record, or the Docs page gets a custom layout that lists each part's
  description.

## 26. Announce filter results to screen readers

- **Found in:** experiment 1.3, writing the FilterSelect record.
- **Today:** when a filter changes the rows, screen readers aren't told.
  EmptyState has `role="status"`, so "no results" is announced, but a
  change from 12 rows to 3 isn't.
- **Decide:** whether to announce a result count, such as "3 claims",
  and where the live region lives.

## 27. Decide how Modal handles real actions and longer content

- **Found in:** experiment 1.3, writing the Modal record.
- **Today:** the confirming button sits in a ModalClose, so the modal
  closes as soon as it's pressed. Nothing shows progress or an error if
  the action fails. There's no close (×) button, one size, and no rule
  for long content or forms. The story's "Dispute charge" trigger is a
  destructive Button, but its confirming "File dispute" is primary.
  Item 14 covers opening a Modal without a trigger.
- **Decide:** the loading and error states, whether to add a close
  button, whether a destructive confirmation uses the destructive
  Button, and whether forms belong in a modal.

## 28. Decide BannerBar's vertical padding

- **Found in:** experiment 1.6 (generating Figma from code).
- **Today:** BannerBar has 10px top and bottom padding (`py-2.5`). 10px
  isn't on the spacing scale (4, 8, 12, 16, 24, 32, 48), so it has no
  token and Figma can't bind it.
- **Options:** keep 10px and add a token, or move to 8px or 12px
  (`--space-2` or `--space-3`). Either change makes the bar 4px shorter
  or taller.
- **Decide:** after a side-by-side preview in Storybook, in light and
  dark mode.

## 29. Style an element that receives focus by script

- **Status:** open.
- **Found in:** experiment 1.1 (none 2, rules 2 and skill 2).
- **Today:** after an action, some screens move focus to a card title
  so screen reader users know where they are. Three runs put
  `outline-none` on that title. That breaks the hard rule that
  focus-visible is a 2px `--ring` outline, 2px offset. skill 1 made the
  same choice, then removed it for that reason. The records don't say
  how to style an element that receives focus by script.
- **Decide:** whether an element that takes focus by script, such as a
  heading with `tabIndex={-1}`, shows the focus-visible outline, and
  record the rule.

## 30. Keep TableRow in the Tab order when `tabIndex` is undefined

- **Status:** open.
- **Found in:** experiment 1.1 (skill 1, skill 3, mcp 1 and mcp 2).
- **Today:** TableRow sets `tabIndex={0}` on a clickable row, then
  spreads the remaining props after it. Passing `tabIndex={undefined}`
  overrides that value, so every row leaves the Tab order. Four runs hit
  this bug.
- **Suggestion:** TableRow should handle this itself, for example by
  ignoring an undefined `tabIndex` on a clickable row (from mcp 2).
- **Decide:** whether to fix it in TableRow, and add a test for it.
