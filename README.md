# Claerio Design Tokens

Canonical machine-readable design references for the Claerio product UI
(healthcare-finance). This repo is the **single source of truth for token
values and component CSS specs**. Prose guidelines (usage, rationale,
accessibility records) live in the Claerio UI Guidelines document in
Google Drive; that doc references token *names* only — values live here.

## Files

- `design-tokens.css` — all tokens: shadcn/ui-compatible semantic tokens
  (`:root` light / `.dark`), color ramps (terracotta, olive, teal),
  nav-active + banner + shadow tokens. Dated changelog comments inline.
  **This file is the source of truth. Never hand-edit derived copies.**
- `tokens.json` — the same tokens in design-tokens JSON form for Figma
  (Tokens Studio / variables import). Generated from the CSS; regenerate
  after any token change, never edit directly.
- `specs/*.css` — per-component CSS specs (banner, controls, sidebar nav,
  states, table, toast). Scratch/reference CSS documenting agreed
  treatments; the production destination is shadcn components (e.g.
  Alert.tsx with cva variants), after which a spec file can be retired.

## Consumers

1. **Claude Design** — the "Claerio Design System" project mirrors this
   repo; prototype projects bind to that design system. Sync flow:
   commit here → ask Claude to re-sync from the repo.
2. **Figma / Figma Make** — import `tokens.json` via Tokens Studio (or
   paste `design-tokens.css` as context in Figma Make).
3. **Product code** — drop `design-tokens.css` into the shadcn/ui app css.

## Change protocol

1. Decide (usually visually, in the Claude Design workshop project).
2. Commit the token/spec change **here**, with a dated comment.
3. Update the prose doc in Drive if usage guidance changed.
4. Re-sync the Claude Design system project; regenerate `tokens.json`.

Rev: 2026-07-11 · matches Claerio UI Guidelines rev. 2026-07-11 (final).
