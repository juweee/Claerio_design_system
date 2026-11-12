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
  checked; unchecked fill = `--input`; radio checked = 1px ring + 8px
  dot; switch-off thumb = `--muted-foreground`, on-thumb = Cream.
- Nav (sidebar + horizontal tabs): active = amber tint + amber text, no
  border, radius-sm; tabs 8×12 padding, top-corner radius only.
- Segmented control: 32px track, radius 8 outer / 6 segments, active
  raised on `--card`.
- Filter triggers: 32px, 14px label muted + value 400 foreground, own
  left-aligned row under card title.
- Table: no zebra; `--accent` hover + transient new-row highlight;
  monospace IDs, right-aligned amounts, trailing › chevron only when
  rows are clickable; sorted column 600/foreground with ▼.
- Toast: bottom-right, `--card` surface, radius-lg, shadow-overlay.

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
- Pending review: unchecked checkbox and radio borders drawn in
  `--muted-foreground` instead of `--input`. `--input` measures 1.23:1
  light and 1.49:1 dark against the page (3:1 guideline);
  `--muted-foreground` measures 5.05:1 light and 7.30:1 dark. Marked
  PROPOSED in the component code until accepted.

