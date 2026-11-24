# Parity check between code and Figma

Compares the components and tokens in this repository with the Figma
file "Clærio design system (from code)". Every item is reported as
match, differs, only in code or only in Figma. Items that a rule in
`mapping-rules.json` explains are marked expected. Everything else is
drift. Same input, same result.

First used in experiment 1.7, part A (November 24, 2026).

## Run the check

1. Start Storybook: `npm run storybook`.
2. Build the code list:

   ```bash
   node scripts/parity/extract-code.mjs code.json
   ```

3. Build the Figma list. Open the file in Figma Desktop with the Figma
   Console MCP Desktop Bridge plugin running. Run the contents of
   `extract-figma.js` with `figma_execute`, and save the result as
   `figma.json`.
4. Compare:

   ```bash
   node scripts/parity/compare.mjs code.json figma.json results/
   ```

   This writes `results/results.json` and `results/results.md`. It exits
   with 1 if it finds drift.

## Files

| File | What it does |
| --- | --- |
| `extract-code.mjs` | Reads the Storybook components manifest and `design-tokens.css` |
| `extract-figma.js` | Runs in Figma's plugin context. Uses only the async APIs, such as `getMainComponentAsync` |
| `mapping-rules.json` | Known differences between the code and Figma, each with an id and a reason |
| `compare.mjs` | Compares the lists and writes the results |

## When something changes

- **A new component in Figma:** add it to `components.inFigma` in
  `mapping-rules.json`, with its `state` values and any icon properties.
- **A new known difference:** add a rule with `$rule` and `$why`, and
  list it in `docs/figma-known-differences.md`.
