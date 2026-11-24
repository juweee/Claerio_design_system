# Known differences between the code and Figma

Last updated: November 23, 2026. Source: experiment 1.6, which generated
the Figma file "Clærio design system (from code)" from this repository.

Figma can't express some things the code does. The Figma file holds the
closest match instead. These differences are expected: a future sync or
parity check should not report them as drift.

The parity check in `scripts/parity/` applies these differences as
rules, in `scripts/parity/mapping-rules.json`. Keep both in step.

`design-tokens.css` stays the source of truth. When a value below
changes in the code, update the Figma stand-in to match.

## Differences to expect

| What the code does | What Figma holds | What a parity check should compare |
| --- | --- | --- |
| Unitless line heights, such as `--type-body-line-height: 1.4` | The 9 `type-*-line-height` variables hold the code values, but Figma reads a line-height variable as pixels, so the text styles can't bind them. Each text style sets the line height as a percent instead (1.4 becomes 140%). | Each text style's percent equals the token × 100. Don't flag the unbound line height. |
| Shadows: `--shadow-modal` and `--shadow-overlay` | No variable. Figma has no shadow variable type, and an effect style can't switch value by mode (dark `--shadow-modal` is `none`). | Skip both tokens. Expect 133 of 135 tokens as variables. |
| Font fallback stacks, such as `'Inter', system-ui, -apple-system, sans-serif` | One family name per variable: "Inter", "Lora" and "Menlo". | Compare the first family only. |
| `--font-mono` is `ui-monospace`, the system's own monospace font | "Menlo". Figma has no `ui-monospace` alias, so the monospace text style doesn't bind its font family. | Expect Menlo and an unbound family on the monospace style. |
| `color-mix(in oklch, base 10%, transparent)` for the banner tint and border | A layer filled with the base color, with its opacity bound to `--banner-tint` or `--banner-border`. Matches within 2 of 255 per channel. | Compare the base color and the opacity, not a mixed color. This works only for a mix with `transparent`. A mix of two colors would need a new token. |

## Close matches, not differences

These also differ in form, but the rendered result matches. Don't flag
them either.

- **OKLCH colors.** Figma stores sRGB. Colors outside sRGB are clipped,
  the same way Chrome clips them. A wide-gamut (P3) display shows the
  code's colors more saturated than Figma.
- **Focus outline.** CSS draws a 2px outline 2px outside the element.
  Figma uses a `focus-ring` rectangle 4px larger than the element, with
  a literal corner radius (10px on Button, 6px on banner targets).
- **Hover, focus and icons.** The code uses CSS states and children.
  Figma uses a `state` variant property and icon booleans and swaps.
- **Sizes within 1px.** Figma rounds auto layout sizes and line boxes
  to whole pixels.

## Removed by tokens (November 23, 2026)

Experiment 1.6 also needed 3 Figma-only variables for colors that
switched with a `dark:` class, and found literal values with no token.
The code now has tokens for them, so these are no longer differences:
`--button-text-link`, `--button-destructive-hover`,
`--banner-bar-foreground`, `--disabled-opacity`, `--control-height-md`
and `--control-height-sm`. All 6 were accepted on review on November 23, 2026. The
BannerBar's 10px vertical padding still has no token (GAPS.md item 28).
