# Documentation gaps that need a design decision

Last updated: November 18, 2026 (items 12 to 22 added in experiment 1.3).

These came up in experiment 1.4, when agents built a payments review
screen from the Storybook MCP docs alone, and in the comparison with the
prototype canvas. Each item below needs a design decision before it can
be documented or built.

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

## 12. Design an icon-only button

- **Where it came up:** experiment 1.3, writing the Button record.
- **Today:** Button has no icon-only treatment. The PageHeader stories
  build the Help and Alerts buttons from a ghost Button with
  `aria-label` and class overrides (`px-2 text-foreground`).
- **Decide:** whether icon-only is a variant or a size, its padding and
  icon color, and whether `aria-label` becomes required for it.

## 13. Decide whether Button needs a loading state

- **Where it came up:** experiment 1.3, writing the Button record.
- **Today:** no loading state and no protection against a second
  click. Disabled is the only way to block clicks. `aria-disabled`
  changes the look but still runs the click handler.
- **Decide:** whether to add a loading state (spinner, label, width),
  and when to use `disabled` versus `aria-disabled`.

## 14. Decide what a clickable table row opens

- **Where it came up:** experiment 1.3, writing the Table record.
- **Today:** decisions.md (2026-11-18) says a clickable row opens the
  item's detail view, but no detail view is designed. The 2026-11-18
  comparison used a temporary panel preview.
- **Decide:** a page, a side panel or a modal, and where focus goes
  when it closes.

## 15. Decide how tables mix clickable and plain rows

- **Where it came up:** experiment 1.3, writing the Table record.
- **Today:** the chevron column is all or nothing. Nothing says what a
  row with nothing to open looks like in a table of clickable rows.
- **Decide:** whether such rows keep an empty chevron cell, and how
  they differ on hover.

## 16. Design row selection

- **Where it came up:** decisions.md lists "Table multi-select, inline
  editing, column resize" as not yet designed. Raised again in
  experiment 1.3.
- **Decide:** checkbox column or not, how selection looks with the
  `--accent` hover and highlight, and where bulk actions go.

## 17. Decide how a table is named and how clickable rows are announced

- **Where it came up:** experiment 1.3, writing the Table record.
- **Today:** Table has no caption or naming rule. A clickable row keeps
  the row role, so a screen reader may not say it opens anything. Not
  tested with a screen reader.
- **Guessed in the record (PROPOSED):** name the table with
  `aria-label`, or `aria-labelledby` pointing at the Card title.
- **Decide:** the naming rule, and whether clickable rows need more for
  screen readers after a screen reader test.

## 18. Decide whether tables may shorten dates

- **Where it came up:** experiment 1.3, writing the Table record.
- **Today:** the table stories write "Nov 2, 2026". The content style
  guide in CLAUDE.md writes dates as "July 14, 2026".
- **Decide:** whether tables use the short month to save width.

## 19. Review the PROPOSED fields in the component records

- **Where it came up:** experiment 1.3. These fields had no source, so
  they're marked PROPOSED in the records for Button, Table, StatusChip,
  FilterSelect and Modal.
- **Button:** status "stable"; use a link (or Button with `asChild`)
  to go to another page; labels start with a verb, name the object and
  use sentence case; labels are 1 to 3 words.
- **Table:** use a Card, not a table, for one record's details; a new
  sort column starts descending; header labels are one or two words in
  sentence case; name the table (item 17).
- **StatusChip:** status "stable"; use Banner or Toast instead for
  messages and confirmations; don't use the chip as a button, link or
  filter; labels are one word or a short phrase; sentence case with no
  ending punctuation; claim states map Paid to positive, Pending to
  neutral, Review to alert and Denied to error.
- **FilterSelect:** status "stable"; always start on an option, such as
  "All"; options in sentence case.
- **Modal:** status "stable"; use Toast or Banner instead for
  confirmations and messages; the confirming button repeats the
  title's verb, such as "File dispute".
- **Status levels:** the record template uses stable, new, first pass
  and deprecated, but nothing defines them yet.
- **Decide:** accept, change or reject each one. Accepted items go in
  decisions.md and lose the PROPOSED label.

## 20. Show subcomponent guidance on Storybook Docs pages

- **Where it came up:** experiment 1.3, after turning on autodocs.
- **Today:** a Docs page shows only the main component's description.
  The descriptions of its parts, such as TableRow's "no buttons in a
  clickable row" and ModalTrigger's "use a Button with asChild", appear
  in `docs-show` but not on the page. Badge's description is no longer
  on the "Badge and status chip" page, because StatusChip became that
  entry's main component so its record leads.
- **Decide:** whether part guidance moves into the main component's
  record, or the Docs page gets a custom layout that lists each part's
  description.

## 21. Announce filter results to screen readers

- **Where it came up:** experiment 1.3, writing the FilterSelect record.
- **Today:** when a filter changes the rows, screen readers aren't told.
  EmptyState has `role="status"`, so "no results" is announced, but a
  change from 12 rows to 3 isn't.
- **Decide:** whether to announce a result count, such as "3 claims",
  and where the live region lives.

## 22. Decide how Modal handles real actions and longer content

- **Where it came up:** experiment 1.3, writing the Modal record.
- **Today:** the confirming button sits in a ModalClose, so the modal
  closes as soon as it's pressed. Nothing shows progress or an error if
  the action fails. There's no close (×) button, one size, and no rule
  for long content or forms. The story's "Dispute charge" trigger is a
  destructive Button, but its confirming "File dispute" is primary.
- **Decide:** the loading and error states, whether to add a close
  button, whether a destructive confirmation uses the destructive
  Button, and whether forms belong in a modal.
