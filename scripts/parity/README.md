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

## Test the compare script

```bash
npm run test:parity
```

Runs `compare.mjs` on the fixtures in `fixtures/`, with no Figma or
Storybook needed. It checks that the clean file has no drift, that the
drift file reports its 3 planted changes, that the output is the same
every time, and that a new unlisted prop is reported.

## Files

| File | What it does |
| --- | --- |
| `extract-code.mjs` | Reads the Storybook components manifest and `design-tokens.css` |
| `extract-figma.js` | Runs in Figma's plugin context. Uses only the async APIs, such as `getMainComponentAsync` |
| `mapping-rules.json` | Known differences between the code and Figma, each with an id and a reason |
| `compare.mjs` | Compares the lists and writes the results |
| `compare.test.mjs` | Fixture tests for `compare.mjs` |
| `fixtures/` | A code list, the clean Figma list, and a Figma list with 3 planted changes (Button `ghost` renamed to `tertiary`, `destructive` Light changed, Banner `onDismiss` deleted) |

## When something changes

- **A new component in Figma:** add it to `components.inFigma` in
  `mapping-rules.json`, with its `state` values and any icon properties.
  Also list its props with no visual effect under
  `noVisualEffect.components`. Until you do, the check reports them.
- **A new prop on a component in Figma:** the check reports it. Map it
  to a Figma property, or list it as having no visual effect.
- **A new known difference:** add a rule with `$rule` and `$why`, and
  list it in `docs/figma-known-differences.md`.
