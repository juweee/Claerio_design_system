# Parity check between code and Figma

Compares the components and tokens in this repository with the Figma
file "Clærio design system (from code)", or with another Figma file such
as a kit being repaired. Every item is reported as match, differs, only
in code, only in Figma, or missing in Figma (a Figma property the rules
expect, such as `state`, that the file lacks). Items that a rule in
`mapping-rules.json` explains are marked expected. Everything else is
drift. Same input, same result.

First used in experiment 1.7, part A (November 24, 2026). Bindings,
property links and the reference comparison came from part B.

## What it compares

| Kind | What's checked |
| --- | --- |
| token | Each token's value in light and dark mode, its `var()` alias and its code syntax |
| text style | Size, weight, line height and family against the `type-*` tokens |
| component | Each code component has a Figma component, by name or alias |
| prop | Each code prop's Figma property: type, allowed values and default |
| property link | Each boolean, text and instance swap property controls a layer in every variant |
| binding | Each fill, stroke, padding, gap and radius is bound to a Clærio variable, or is a known literal |
| layer binding | With `--reference`: each layer's bindings match the Clærio file's, variant by variant |

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

## Check another file, such as a kit being repaired

Experiment 1.7 part B used these options on a shadcn/ui kit file:

- **Limit the extraction:** in `extract-figma.js`, set `OPTIONS` to
  `{ components: ["Button", "Banner"], variables: false, textStyles: false, bindings: true, propertyLinks: true }`.
  `bindings: true` records every fill, stroke, padding, gap and radius,
  and the variable bound to it, for the whole component and per variant.
  `propertyLinks: true` records how many variants use each property.
- **Limit the comparison:** `--components Button,Banner` checks only
  those components and their parts, and skips tokens and text styles.
- **Pair different names:** `--overlay overlay.json` merges extra rules,
  such as `{ "components": { "aliases": { "Button - Nova": "Button" } } }`.
  The name is still reported as differs until it's renamed.

- **Compare with the Clærio file:** `--reference claerio.json` compares
  each layer's bindings with the Clærio file's, where the variant and
  layer names match. Extract the Clærio file with the same options.
  Layers in only one file are listed in the report, not compared.

```bash
node scripts/parity/compare.mjs code.json figma.json results/ --components Button,Banner --overlay overlay.json --reference claerio.json
```

The `bindings` rule in `mapping-rules.json` passes a value bound to a
code token's variable from Clærio's collections, and lists the literals
that are expected, such as the focus ring radius. It doesn't check that
the bound variable is the right one: `--reference` does that.

## Test the compare script

```bash
npm run test:parity
```

Runs `compare.mjs` on the fixtures in `fixtures/`, with no Figma or
Storybook needed. It checks that:

- the clean file has no drift, and the drift file reports its 3 planted
  changes
- the output is the same every time
- a new unlisted prop is reported
- the Clærio file has no drift against itself, bindings included
- the kit before repair reports its 75 drift items, and the kit after
  repair has only BannerBar left
- a Clærio variable on the wrong layer, a property that controls no
  layer, and a deleted expected property are each reported

## Files

| File | What it does |
| --- | --- |
| `extract-code.mjs` | Reads the Storybook components manifest and `design-tokens.css` |
| `extract-figma.js` | Runs in Figma's plugin context. Uses only the async APIs, such as `getMainComponentAsync` |
| `mapping-rules.json` | Known differences between the code and Figma, each with an id and a reason |
| `compare.mjs` | Compares the lists and writes the results |
| `compare.test.mjs` | Fixture tests for `compare.mjs` |
| `fixtures/` | A code list, the clean Figma list, and a Figma list with 3 planted changes (Button `ghost` renamed to `tertiary`, `destructive` Light changed, Banner `onDismiss` deleted). Also the Clærio file's Button, Banner and BannerBar with bindings (`claerio-reference.json`), and a shadcn/ui kit's Button and Alert before and after repair, with their name overlay |

## When something changes

- **A new component in Figma:** add it to `components.inFigma` in
  `mapping-rules.json`, with its `state` values and any icon properties.
  Also list its props with no visual effect under
  `noVisualEffect.components`. Until you do, the check reports them.
- **A new prop on a component in Figma:** the check reports it. Map it
  to a Figma property, or list it as having no visual effect.
- **A new known difference:** add a rule with `$rule` and `$why`, and
  list it in `docs/figma-known-differences.md`.
