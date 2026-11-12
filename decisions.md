# Claerio design decisions — chat-to-repo handoff (2026-07-11)

Context that lives outside the CSS/doc files. One line each; details are
in the UI Guidelines rev. 2026-07-11 and the dated comments in
design-tokens.css.

## Identity & tokens
- System built on a real shadcn/create export (vega / olive / terracotta
  / phosphor / inter+lora, 2026-07-06); export values kept AS-IS except
  documented amendments.
- Original Amber primary **retired** for contrast reasons; terracotta
  `oklch(0.555 0.163 48.998)` adopted (option C of the accessibility
  review). Amber later **revived in a lighter form** (oklch 0.769 0.188
  70.08 tints) strictly for nav-active + warning.
- olive-600 corrected to hue 107.3 so it equals `--muted-foreground`
  exactly; `--chart-4` re-aliased to it.
- `--foreground` ≈ #0C0C09 ≠ brand Charcoal #2D2D2B (decided: keep
  token; Charcoal reserved for logo/tooltip surfaces).
- Secondary buttons read `--foreground` (mode-inverting role), not
  brand Charcoal.
- `--shadow-overlay` promoted to a token; `--sidebar-primary` name
  collision with shadcn avoided during the nav-active work.

## Components (all illustrated in the workshop sticker sheet, sections 01–13)
- Buttons: 6 variants, 40px, radius-md, Inter 14/500 (weight lowered
  from 600, contrast re-verified). Primary hover: terracotta-700 in
  both modes (dark was terracotta-500 until 2026-11-12, see below);
  ghost/link dark text = terracotta-400.
- Banners: info = teal, warning = amber/gold, error = destructive;
  page-level bar = terracotta tint (--primary /10–15%), 0 radius,
  edge-to-edge; actions are underlined links in banner foreground; ×
  dismiss in banner foreground, shown per use case.
- Inputs: error border = `--destructive` both modes; focused = 1.5px
  `--ring` border + the universal 2px `--ring` outline, 2px offset
  (corrected 2026-11-12, was "3px soft ring", see below); validation
  text = Body small in the error foreground; helper text = Body small
  muted.
- Selection controls: checkbox/radio/switch fill terracotta-600 when
  checked; unchecked fill = `--input`, unchecked checkbox/radio border =
  `--muted-foreground` (changed 2026-11-12, see below); radio checked =
  1px ring + 8px dot on `--card`; switch-off thumb =
  `--muted-foreground`, on-thumb = Cream.
- Nav (sidebar + horizontal tabs): active = amber tint + amber text, no
  border, radius-sm; tabs 8×12 padding, top-corner radius only
  (component details 2026-11-12, see below).
- Segmented control: 32px track, radius 8 outer / 6 segments, active
  raised on `--card`.
- Filter triggers: 32px, 14px label muted + value 400 foreground, own
  left-aligned row under card title.
- Table: no zebra; `--accent` hover + transient new-row highlight;
  monospace IDs, right-aligned amounts, trailing › chevron only when
  rows are clickable; sorted column 600/foreground with ▼.
- Toast: bottom-right, `--card` surface, radius-lg, shadow-overlay
  (component details 2026-11-12, see below).

## Deferred / open
- Table multi-select, inline editing, column resize — not yet designed.
- Success/info banner tokens existed as PROPOSED before the terracotta
  file; current banner tokens (--info/--warning/--error triplets) are in
  design-tokens.css — verify naming when building shadcn Alert.
- Figma bridge: import tokens.json via Tokens Studio (untested).

## Workflow agreements
- GitHub repo = canonical CSS; Drive doc = canonical prose; Claude
  Design system project = mirror/deployment target; prototypes bind to
  it. Re-sync is per-session, on request.
- Next: four prototype use cases in a "Claerio Prototypes" project.

## 2026-07-09 — banner-bar font-size correction
- `.banner-bar` font-size 13px → 14px (specs/banner-component-spec.css),
  aligning with Body per the type scale; 13px wasn't an established
  token. No other value affected.

## 2026-11-12: dark-mode primary hover changed to terracotta-700
- Dark-mode primary button hover changes from terracotta-500 to
  terracotta-700, the same value as light mode. Primary hover is now
  terracotta-700 in both modes.
- Why: cream text (--primary-foreground) on terracotta-500 measured
  4.05:1, below the 4.5:1 minimum for text. Found during the component
  library accessibility check.
- Cream on terracotta-700 measures 7.90:1, which passes.
- Trade-off: in dark mode the hovered fill stands out less from the page
  background: 2.39:1, down from 3.88:1 for the resting terracotta-600
  fill. The cream label keeps the button identifiable, so no contrast
  rule fails.
- No token value changed. The CLAUDE.md hard rule was updated the same
  day. Follow-up: the Claude Design Button guideline still says
  terracotta-500.

## 2026-11-12: destructive button hover darkens in light mode (PROPOSED token)
- Light-mode destructive button hover changes from a 90% opacity fill
  to a darker solid color, matching the "hover darkens" rule for primary.
- New PROPOSED token: `--destructive-hover: oklch(0.52 0.245 27.325)`,
  light mode only. It lives in `src/styles/proposed-tokens.css` until it
  is reviewed and moved into design-tokens.css.
- Why: white text on the 90% opacity fill measured 4.49:1 in axe, below
  the 4.5:1 minimum. On the new token it measures 5.61:1. It renders as
  #D20000, clipped to the sRGB gamut like --destructive.
- Dark mode keeps the 90% opacity hover: dark text on it measures 5.64:1.

## 2026-11-12: proposed tokens accepted into design-tokens.css
Reviewed under the CLAUDE.md "Before pushing" rule. All 4 items accepted.
New tokens only: no existing value changed.
- `--destructive-hover: oklch(0.52 0.245 27.325)`, light mode only.
  Accepted as proposed in the destructive hover entry above (5.61:1).
- `--font-mono: ui-monospace, SFMono-Regular, Menlo, monospace`. The
  computer's built-in monospace font for claim, order and member IDs.
  The reference used `--font-mono`, but no token defined it.
- Type scale as `--type-<style>-size`, `-weight` and `-line-height` for
  display, heading-1, heading-2, heading-3, body, body-small, label,
  button and monospace. Sizes and weights come from the Claude Design
  reference README; most line heights come from the reference CSS.
- Four line heights with no earlier source, chosen during the component
  library build: display 1.2, heading-1 1.25, heading-3 1.4,
  monospace 1.4.
- Follow-up: regenerate `tokens.json` so Figma gets the new tokens.

## 2026-11-12: text input decisions (component library, inputs batch)
- Focus: 1.5px `--ring` border plus the universal 2px `--ring` outline
  with 2px offset. This matches the Input guideline, the states spec and
  the CLAUDE.md focus rule. The earlier "3px soft ring" note here had no
  token behind it and is corrected above.
- Placeholder: `--muted-foreground`. The reference colors (#ABAB9C
  light, #6A6560 dark) were not tokens and failed contrast (2.32:1 and
  2.94:1). `--muted-foreground` measures 5.03:1 light, 7.30:1 dark on
  `--card`.
- Invalid and focused: the border stays 1.5px `--destructive`, with the
  `--ring` outline around it, so the error stays visible while typing.
- Label to field gap: `space-2` (8px). The reference used 6px, which is
  off the spacing scale. Field to helper or error text stays 4px, from
  the states spec.
- Known gap, not changed: the 1px `--input` border measures 1.23:1
  against `--card` in light mode and 1.60:1 in dark, below the 3:1
  guideline for component boundaries. Earlier notes listed only dark
  mode. The label, placeholder and focus and error borders still mark
  the field.

## 2026-11-12: selection control decisions (component library)
- Radio, selected: the fill switches from `--input` to `--card`,
  following the reference CSS over the states spec. On `--input` the
  terracotta-600 dot measured 2.60:1 in dark mode (3:1 needed); on
  `--card` it measures 3.37:1 dark, 5.05:1 light.
- Checkbox check and dash: Phosphor Check and Minus in Bold weight at
  12px, matching the reference glyphs. An exception to the Regular
  weight rule, because Regular is too thin at this size.
- Switch thumb: off = `--muted-foreground`, on = Cream
  (`--primary-foreground`), as decided earlier in this file. The states
  spec says `--background` for both; this file outranks the spec.
- Select menu: 8px gap between the selected check and its text. The
  reference used 6px, which is off the spacing scale.
- Unchecked checkbox and radio borders: `--muted-foreground` instead of
  `--input`. Accepted on review, see the next entry.

## 2026-11-12: unchecked checkbox and radio border accepted
Reviewed under the CLAUDE.md "Before pushing" rule and accepted.
- Unchecked checkbox and radio keep the `--input` fill and draw their
  1px border in `--muted-foreground`.
- Why: an `--input` border measured 1.23:1 light and 1.49:1 dark
  against the page, below the 3:1 guideline for controls.
  `--muted-foreground` measures 5.05:1 light and 7.30:1 dark.
- No token added: `--muted-foreground` already exists. The states spec
  is updated to match.

## 2026-11-12: banner implementation notes (component library)
- Icons: a 20px circle in the severity color with the glyph in
  `--background` (white in light mode, the page color in dark), as in
  the reference. Built from filled Phosphor Info (info) and
  WarningCircle (warning, error) over a `--background` disc, because
  Phosphor has no plain "i" glyph. Glyphs measure 6.15:1 or more against
  the circle in both modes.
- Dismiss: a 16px Phosphor X inside an invisible 24px target, the
  minimum target size in WCAG 2.2. Shown only when the message does not
  require action.
- Screen readers: error banners use role="alert" so they are announced
  right away; info, warning and the page bar use role="status".
- Page bar text stays 14px, per the 2026-07-09 correction. The reference
  CSS still says 13px.
- Known gap, not changed: banner borders measure 1.17 to 1.62:1 against
  their tint. The tint and icon mark the banner.

## 2026-11-12: toast decisions (component library)
- Success icon stays `--primary` (terracotta) with a Cream check. The
  open item in the toast spec remains: status chips use `--teal` for
  positive. Revisit when status chips are built.
- Action button text: Inter 14/500, per the CLAUDE.md button rule. The
  toast spec said 13/600. Still 28px tall, the only button below 40px.
- Description: body-small (12/400) in `--muted-foreground`. The toast
  spec and README said 13px, which is off the accepted type scale.
- Error toast: `--destructive` circle with `--destructive-foreground`
  glyph, as noted in the spec.
- Stacked toasts sit 8px apart (`space-2`); not defined before. No open
  or close animation is specified, so none is used.
- Built on Radix Toast: closes after 5 seconds by default, pauses on
  hover or focus, closes on Escape, and is announced to screen readers.

## 2026-11-12: navigation decisions (component library)
- Sidebar: the nav list only (SidebarNav, labels, items). Collapsing,
  a mobile drawer and page layout are not designed yet.
- Sidebar item gap: 2px, chosen after a side-by-side preview of 2px and
  4px. A hairline gap, like the segmented control's 2px inset, so it
  stays off the spacing scale on purpose.
- Sidebar group label: body-small (12/400) in `--muted-foreground`. The
  reference used 12/500, which is off the type scale.
- Tabs come in two versions with the same look: NavTabs (links, each
  with its own URL, aria-current="page") and Tabs (in-page tabs on Radix
  Tabs, arrow keys and panels). Pick by behavior.
- Contrast: active text measures 5.51:1 to 8.16:1 on the amber tint.
  The tint itself barely differs from the sidebar (1.08:1 light); the
  amber text, 600 weight and aria-current carry the active state.

## 2026-11-12: table and remaining components (component library)
Covers table, filter trigger, badge and status chip, avatar, card,
progress, segmented control, tooltip and modal.
- Success color: one color for "good". A PROPOSED `--success` token
  (= `--teal`) is the base for positive status chips and the success
  toast icon, which moves from `--primary` (terracotta) to teal. Cream
  check on teal: 3.78:1. Closes the open item in the toast spec and the
  design system README, pending review of the token.
- Status chip colors: the spec's literal values match existing tokens
  exactly (`--teal-dark`, `--olive-600`, `--olive-700`, `--warning`,
  `--warning-foreground`, `--error-foreground`), so chips use tokens.
- Dark-mode chip tints, PROPOSED: positive 20% -> 10%, error 15% -> 6%.
  At the spec's tints their text measured 4.03:1 and 4.00:1 on
  highlighted table rows (`--accent`); now 4.58:1 and 4.56:1. Light mode
  passes everywhere and is unchanged.
- Type exceptions kept from the specs and reference: table headers and
  segmented options at 12/500; chips 11/600; savings badge 11/700
  uppercase; small-avatar initials 10px.
- Reference-only spacing snapped to the scale: tooltip padding 4 x 8 and
  4px from its trigger (was 6 x 10, 6px); savings badge padding 4 x 8
  (was 3 x 8). Spec values kept: table cells 10px, filter gap 6px,
  segmented options 0 x 10 with a 6px radius.
- Card: no shadow in either mode. The Card README gives light mode a
  faint shadow; the CLAUDE.md hard rule "No shadows on cards" wins.
- Table: real HTML table. Sortable headers are buttons with aria-sort
  and Phosphor carets (12px). Clickable rows are reachable with Tab and
  open with Enter or Space; their focus outline follows the 2px rule.
- Filter trigger: reuses the Select menu. Its accessible name is the
  label ("Status"), because a combobox does not take its name from its
  contents.
- Modal: built on Radix Dialog to the README and preview; no separate
  spec exists. Reviewed and no longer labeled draft (2026-11-12).
- Known gap, not changed: dark-mode `--border` measures 1.35:1 against
  the card, so table row dividers inherit it.

## 2026-11-12: success color and chip tints accepted
Reviewed under the CLAUDE.md "Before pushing" rule. All 3 items accepted.
- `--success: var(--teal)` moved into design-tokens.css, same value in
  both modes. Used by positive status chips and the success toast icon.
  The toast spec's open item is closed and the spec now points at
  `--success`.
- Dark-mode status chip tints: positive 10% (was 20%), error 6% (was
  15%). Text on highlighted table rows now measures 4.58:1 and 4.56:1.
  The table spec's chip notes are updated to match.

