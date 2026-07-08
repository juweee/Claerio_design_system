# Claerio Design System — standing instructions

(For the Claude Design "Claerio Design System" project. Copy this file
into that project's root.)

## Sources of truth (check BEFORE any extensive work)
1. **Token values & component CSS**: the `Claerio_design_system` GitHub repo (https://github.com/juweee/Claerio_design_system, branch main). The files in this project (`tokens/design-tokens.css`, `guidelines/specs/`, `guidelines/decisions.md`) are a MIRROR; never hand-edit token values here — fix upstream, then re-sync. At the start of any session that changes or depends on tokens/specs, re-fetch `design-tokens.css` from the repo, diff against the local mirror, and flag drift before designing.
2. **Prose guidelines & logomark files**: "Claerio UI Guidelines" and brand/logo files in Google Drive (use the Google Drive tools to search and read them). Consult the Drive doc for usage/rationale/accessibility guidance before extensive design work. Drive doc references token NAMES; values live in the repo.
   - Drive file IDs (stable — fetch live, don't rely on pasted snapshots):
     - Claerio_UI_Guidelines.docx: `1_o7SLOE8Bgno-zdI7xgR44-Vt3DcAeIF`
     - Claerio_Brand_Guidelines.docx: `1zOuA5om6Qxl4MKzt-AMf_DkpFu_DCpcZ`
     - Claerio_Design_Foundation_Process.md: `1tuH88eTRIenJMcjTh78yZxiIwpYTDZxj`
     - Logo SVGs folder (6 files, mirrored to `assets/logo/`): parent `1E85igOb2T43dzU_zTI-VgtAJHXyPdUbc`
     - Brand folder root: `1jHsxu4bTK_dslvMa_U2lBCJaFALhiDNC`

## Logo system (from Brand Guidelines 01)
- Wordmark "Clærio": Lora 500, tracking −0.025em; the æ ligature is ALWAYS Lora Bold 700 in Amber #C4893A (Amber's only sanctioned UI use besides nav/warning).
- æ mark alone = icon mark (app icons, favicons, avatars) below 120px wordmark width. Min sizes: logotype 120px, æ mark 32px.
- Use the provided SVGs in assets/logo/ — never recreate in another font/weight, never recolor/distort, no shadows/effects.
- Greige square on white needs 1px 20%-Charcoal border. Clear space = æ cap-height on all sides.

## Two separate systems (do not merge)
- Product Design System (this project): Inter body, Lora for Display/H1/logotype — shadcn-based.
- Document Brand System (Word/Slides deliverables): Arial body, Lora for logotype/H2 — lives in Drive templates. Not covered here.

## Hard rules
- Never invent tokens, colors, fonts, or component treatments. Undefined = propose and mark PROPOSED until committed upstream.
- Fonts: Lora (Display + H1 only) + Inter (everything else). Buttons: Inter 14/500.
- Brand Charcoal #2D2D2B = fixed surfaces only (logo blocks, tooltip). Product text = --foreground.
- Amber = navigation selection + warning ONLY — never buttons or links.
- Primary actions = terracotta --primary; banner actions = underlined links, never buttons.
- Primary button hover = terracotta-700 (light) / terracotta-500 (dark), per decisions.md — not shadcn's bg-primary/90 opacity hover.
- Radius: 4/8/12/9999 only. Nested radius = outer − inset.
- Disabled = 50% opacity + not-allowed cursor. Focus-visible = 2px --ring outline, 2px offset.
- No zebra striping; row hover/selection = --accent. Cream reserved for text on terracotta/charcoal. No shadows on cards.