# Claerio Design System: standing instructions

(Standing instructions for working in this repository. This file was first
written for the Claude Design "Claerio Design System" project, which became
read-only on November 12, 2026 and retires in December 2026.)

## Sources of truth (check BEFORE any extensive work)
1. **Token values & component treatments**: this repository (https://github.com/juweee/Claerio_design_system, branch main). Token values live in `design-tokens.css`; component treatments live in `src/components/ui/` and `decisions.md`. Never hand-edit `tokens.json`: run `npm run tokens:json` after any token change. The published Storybook (https://juweee.github.io/Claerio_design_system/) shows the current components in light and dark mode.
2. **Prose guidelines & logomark files**: "Claerio UI Guidelines" and brand/logo files in Google Drive (use the Google Drive tools to search and read them). Consult the Drive doc for usage/rationale/accessibility guidance before extensive design work. Drive doc references token NAMES; values live in the repo.
   - Drive file IDs (stable — fetch live, don't rely on pasted snapshots):
     - Claerio_UI_Guidelines.docx: `1_o7SLOE8Bgno-zdI7xgR44-Vt3DcAeIF`
     - Claerio_Brand_Guidelines.docx: `1zOuA5om6Qxl4MKzt-AMf_DkpFu_DCpcZ`
     - Claerio_Design_Foundation_Process.md: `1tuH88eTRIenJMcjTh78yZxiIwpYTDZxj`
     - Logo SVGs folder (6 files): parent `1E85igOb2T43dzU_zTI-VgtAJHXyPdUbc`
     - Brand folder root: `1jHsxu4bTK_dslvMa_U2lBCJaFALhiDNC`

## Use the Storybook MCP tools for UI work
When working on UI, use the Storybook MCP tools to look up components and documentation before writing code.
- Start Storybook first (`npm run storybook`). The `storybook` server in `.mcp.json` connects to http://localhost:6006/mcp and only works while Storybook runs.
- Call `docs-list` to find components, then `docs-show` for props, usage, and stories. Use only props those tools document.
- Before creating or editing components or stories, call `get-storybook-story-instructions`.
- After a visual change, call `stories-preview` and include the preview links in your reply.

## Logo system (from Brand Guidelines 01)
- Wordmark "Clærio": Lora 500, tracking −0.025em; the æ ligature is ALWAYS Lora Bold 700 in Amber #C4893A (Amber's only sanctioned UI use besides nav/warning).
- æ mark alone = icon mark (app icons, favicons, avatars) below 120px wordmark width. Min sizes: logotype 120px, æ mark 32px.
- Use the provided SVGs from the Drive logo folder (listed above). Never recreate them in another font or weight, never recolor or distort them, and add no shadows or effects.
- Greige square on white needs 1px 20%-Charcoal border. Clear space = æ cap-height on all sides.

## Two separate systems (do not merge)
- Product Design System (this repository): Inter body, Lora for Display/H1/logotype, built on shadcn/ui.
- Document Brand System (Word/Slides deliverables): Arial body, Lora for logotype/H2 — lives in Drive templates. Not covered here.

## Content Style Guide
Applies to all written copy: UI text, headings, body copy, labels, and docs.

**Word choice**
- Use plain English. Pick the simplest accurate word: use, not utilize; help, not facilitate; buy, not purchase.
- Be concise. Cut words that don't add meaning: "to" not "in order to"; "because" not "due to the fact that".
- Prefer specific language over vague language. Define jargon on first use. Use one consistent term per concept.
- Spell out acronyms on first reference.

**Sentence and paragraph structure**
- Write in active voice with strong verbs: decide, analyze, review, not "make a decision" or "perform an analysis".
- Keep sentences short, about 15 to 20 words. Keep paragraphs short: one idea, 2 to 5 sentences.
- Organize copy around the reader's task, not internal structure.
- Start procedural steps with a verb.

**Formatting for scanning**
- Write descriptive, task-based headings: "Install the app", not "Installation".
- Use bullets for unordered information, numbered lists for sequences, and tables for comparisons.
- Use numerals for dates, measurements, percentages, versions, and stats. Write dates as "July 14, 2026".
- Never use em dashes. Rewrite with periods, commas, or colons instead. This rule overrides every other stylistic preference in this guide.

**Tone**
- Default tone: calm, knowledgeable, practical, friendly.
- Write conversationally but professionally. No bureaucratic or academic tone, no marketing hype, no unsupported claims.
- Use inclusive, respectful language.
- Be honest. State uncertainty. Never invent facts or confidence.
- Avoid AI clichés: filler phrases, unnecessary transitions, repeating the prompt, over-explaining, generic conclusions, and flattery.

**Error messages**
State what happened, why (if known), and what to do next.

**Before finishing any copy, check that it:**
1. Cuts extra words.
2. Uses active voice.
3. Keeps sentences and paragraphs short.
4. Uses consistent terminology.
5. Contains no em dashes.

## Hard rules
- Never invent tokens, colors, fonts, or component treatments. Undefined = propose and mark PROPOSED until committed upstream.
- Fonts: Lora (Display + H1 only) + Inter (everything else). Buttons: Inter 14/500.
- Brand Charcoal #2D2D2B = fixed surfaces only (logo blocks, tooltip). Product text = --foreground.
- Amber = navigation selection + warning ONLY — never buttons or links.
- Primary actions = terracotta --primary; banner actions = underlined links, never buttons.
- Primary button hover = terracotta-700 in both light and dark mode, per decisions.md (2026-11-12: dark-mode primary hover changed to terracotta-700). Never shadcn's bg-primary/90 opacity hover.
- Destructive button hover darkens: light = --destructive-hover, dark = --destructive at 90% opacity, per decisions.md (2026-11-12: destructive button hover darkens in light mode).
- Radius: 4/8/12/9999 only. Nested radius = outer − inset.
- Disabled = 50% opacity + not-allowed cursor. Focus-visible = 2px --ring outline, 2px offset.
- No zebra striping; row hover/selection = --accent. Cream reserved for text on terracotta/charcoal. No shadows on cards.

## Before pushing
Before pushing any branch, search design-tokens.css and src/ for the word PROPOSED. If you find any, list each one with its value and the reason it was proposed, then ask me to accept or reject each one. Do not push until I've answered.
- If I accept: remove the PROPOSED label, add a dated comment explaining the decision, and add an entry to decisions.md.
- If I reject: remove the item, or keep it out of the files and list it in the pull request description as not adopted.
- If I want to decide later: push only after listing every remaining PROPOSED item in the pull request description under "Pending approval".
