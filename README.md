# Claerio Design Tokens

Canonical machine-readable design references for the Claerio product UI
(healthcare-finance). This repo is the **single source of truth for token
values and component treatments**. Prose guidelines (usage, rationale,
accessibility records) live in the Claerio UI Guidelines document in
Google Drive; that doc references token *names* only — values live here.

## Files

- `design-tokens.css` — all tokens: shadcn/ui-compatible semantic tokens
  (`:root` light / `.dark`), color ramps (terracotta, olive, teal),
  nav-active + banner + shadow tokens. Dated changelog comments inline.
  **This file is the source of truth. Never hand-edit derived copies.**
- `tokens.json` — the same tokens in design-tokens JSON form for Figma
  (Tokens Studio / variables import). Generated from the CSS by
  `scripts/generate-tokens-json.mjs`: run `npm run tokens:json` after any
  token change, and never edit the file directly.
- `src/components/ui/` and `decisions.md`: agreed component treatments.
  The earlier scratch CSS specs (`specs/*.css`) were retired on November
  12, 2026, once every component existed in code. `decisions.md` lists
  where each one's content lives now.

## Consumers

1. **Claude Design** (retired): the "Claerio Design System" project used
   to mirror this repo. It became read-only on November 12, 2026 and
   retires in December 2026, so there is nothing to sync.
2. **Figma / Figma Make** — import `tokens.json` via Tokens Studio (or
   paste `design-tokens.css` as context in Figma Make).
3. **Product code** — drop `design-tokens.css` into the shadcn/ui app css.
4. **Component library** (`src/`): React components built on shadcn/ui,
   with a Storybook for review. It imports `design-tokens.css` unchanged
   and maps the tokens to Tailwind in `src/styles/tailwind-theme.css`.
   Components live in `src/components/ui/`, each with its stories next
   to it. Foundations pages (color, type, spacing, radius, shadows) live
   in `src/foundations/`.

## View Storybook online

The published Storybook is at
https://juweee.github.io/Claerio_design_system/

It updates automatically a few minutes after each merge into `main`.
The workflow in `.github/workflows/storybook.yml` checks types, builds
Storybook and publishes it to GitHub Pages. To publish without a merge,
open the Actions tab, choose "Publish Storybook" and click "Run
workflow".

The published site is public, like this repository.

## Run Storybook

Storybook shows every component and foundation in light and dark mode.
Use the toolbar to switch modes, and the Accessibility tab to check
contrast.

1. Install Node.js 24 (the version in `.nvmrc`).
2. Install the packages: `npm install`
3. Start Storybook: `npm run storybook`
4. Open http://localhost:6006

To check types, run `npm run typecheck`. To build a static copy of
Storybook, run `npm run build-storybook`.

## Change protocol

1. Decide, usually visually: for example, with a side-by-side preview in
   Storybook.
2. Commit the token or component change **here**, with a dated comment.
3. Update the prose doc in Drive if usage guidance changed.
4. Run `npm run tokens:json` to regenerate `tokens.json`, and commit it
   with the token change.

Rev: 2026-07-11 · matches Claerio UI Guidelines rev. 2026-07-11 (final).
