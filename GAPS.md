# Documentation gaps that need a design decision

Last updated: November 18, 2026.

These came up in experiment 1.4, when agents built a payments review
screen from the Storybook MCP docs alone, and in the comparison with the
prototype canvas. Items 12 to 20 came up in experiment 1.4b, which ran
the same task 3 times. Each item below needs a design decision before it
can be documented or built.

When you decide an item, record it in decisions.md, build or document
it, and remove it from this list. Item numbers stay the same, so links
to them keep working.

Decided on November 18, 2026, and removed: 1 (CardTitle level), 2
(empty state), 3 (date filter), 5 (banner retry action) and 6 (page
layout, and the foundations in the MCP docs). See decisions.md.

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
- **Decide:** whether the system needs a detail view, drawer or side
  panel, and when a Modal is enough.

## 13. Define tables where only some rows open

- **Found in:** experiment 1.4b.
- **Today:** no documented pattern for a table where some rows are
  clickable and others aren't.
- **What agents did:** runs 1 and 2 put an empty cell where the chevron
  would be. Run 3 made every row clickable, including approved claims.
- **Decide:** the pattern for mixed rows, including what fills the
  chevron column on rows that don't open.

## 14. Decide whether a Modal can open without a trigger

- **Found in:** experiment 1.4b.
- **Today:** the Modal docs and stories always open it from a
  ModalTrigger.
- **What agents did:** all 3 runs opened it from a table row, with
  `open` and `onOpenChange` and no ModalTrigger.
- **Decide:** whether this is supported, and where focus returns when
  the Modal closes.

## 15. Set the spacing between CardTitle and FilterRow

- **Found in:** experiment 1.4b.
- **Today:** the docs say FilterRow sits under the card title, 12px
  above what it filters, but not how far below the title. No story
  pairs CardTitle with FilterRow.
- **What agents did:** the 3 runs solved it 3 ways: an 8px class, no
  gap, and wrapping the content in CardBody.
- **Decide:** one answer, and show it in a story.

## 16. Design a loading state

- **Found in:** experiment 1.4b.
- **Today:** no component or pattern for content that is loading.
- **What agents did:** run 3 went straight from the error state to
  loaded data, with nothing in between.
- **Decide:** what shows while data loads, such as a skeleton, a
  spinner or a text message.

## 17. Define the layout when loading fails

- **Found in:** experiment 1.4b.
- **Today:** Banner covers the error message, but nothing says what
  replaces the content when loading fails.
- **What agents did:** run 3 showed the error Banner alone, with no
  card, filters or table.
- **Decide:** whether the card, filters or table stay on screen, and
  where the Banner sits.

## 18. Decide where claim status labels are documented

- **Found in:** experiment 1.4b.
- **Today:** StatusChip has 4 variants, but no list of claim statuses
  or which variant each one uses.
- **What agents did:** each run chose its own labels and variants. Run
  3 used "Pending review" (neutral), "Needs info" (alert), "Approved"
  (positive) and "Denied" (error).
- **Decide:** whether status labels and their variants are documented,
  and where. They're product content rather than design system
  content.

## 19. Decide whether Table supports row selection

- **Found in:** experiment 1.4b.
- **Today:** Table has no row selection, so there are no bulk actions.
- **What agents did:** approved one claim at a time. Run 3 noted that a
  billing manager would likely approve several claims at once.
- **Decide:** whether Table supports selection and bulk actions, and
  how they work with clickable rows.

## 20. Fix the baseline of monospace IDs in tables

- **Found in:** experiment 1.4b (run 3).
- **Today:** claim IDs in a `TableCell mono` sit about 1px higher than
  the text in the other cells of the same row. It shows in the run 3
  screenshots.
- **Decide:** nothing to decide. Fix the alignment in TableCell.
