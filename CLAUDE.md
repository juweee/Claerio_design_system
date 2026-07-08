# Claerio Design System — standing instructions

(For the Claude Design "Claerio Design System" project. Copy this file
into that project's root.)

## Sources of truth
- **Token values & component CSS**: the Claerio_design_system GitHub
  repo (https://github.com/juweee/Claerio_design_system). The CSS files
  in this project are a mirror; never hand-edit token values here; fix
  upstream, then re-sync.
- **Prose guidelines**: "Claerio UI Guidelines" in Google Drive
  (rev. 2026-07-11). References token names, not values.
- At the start of a working session that will change or depend on
  tokens, re-fetch `design-tokens.css` from the repo and diff against
  the local mirror; flag drift before designing.

## Hard rules
- Never invent tokens, colors, fonts, or component treatments. If
  something is undefined, propose it and mark it **PROPOSED** until the
  user commits it upstream.
- Fonts: Lora (Display, H1 only) + Inter (everything else). Buttons:
  Inter 14 / 500.
- Brand Charcoal (#2D2D2B) is a brand color for **fixed surfaces only**
  (logo blocks, tooltip). Product text/foreground is the token
  `--foreground` (≈ #0C0C09 light mode) — a different color on purpose.
- Amber (`--nav-active` family, oklch(0.769 0.188 70.08) tints) means
  **navigation selection and warning** only — never buttons or links.
- Primary actions are terracotta (`--primary`); banner actions are
  underlined links in the banner's foreground color, never buttons.
- Radius scale: 4 / 8 / 12 / 9999. No 5.2/7.2/11.2 (shadcn 0.45rem
  export values were declined). Nested radius = outer − inset.
- Disabled = 50% opacity + cursor not-allowed, no color changes.
  Focus-visible = 2px `--ring` outline, 2px offset, all components.
- Zebra striping: none. Row hover/selection uses `--accent`. Cream
  (`--primary-foreground`) is reserved for text on terracotta/charcoal.
