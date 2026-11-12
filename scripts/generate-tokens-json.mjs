// Generate tokens.json from design-tokens.css.
//
// design-tokens.css is the source of truth. This script reads its two
// blocks, :root (light) and .dark (dark), and writes tokens.json in the
// design tokens format Tokens Studio imports into Figma.
//
// Run it after any change to design-tokens.css:
//   npm run tokens:json
//
// Rules
// - Tokens keep the order they have in design-tokens.css.
// - A value of var(--name) becomes a reference, {light.name} or
//   {dark.name}. In dark mode it points to the dark token when .dark
//   defines one, and to the light token otherwise, because dark mode
//   inherits every value it does not redefine.
// - $type is "color" for colors, "dimension" for px values, and copied
//   from the target for references. Other values (fonts, weights, line
//   heights, percentages, shadows) have no $type, as before.

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const css = readFileSync(join(root, "design-tokens.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "")

/** Returns the declarations inside the first block that starts with `selector {`. */
function block(selector) {
  const start = css.search(new RegExp(`(^|\\n)\\s*${selector.replace(".", "\\.")}\\s*\\{`))
  if (start === -1) throw new Error(`No ${selector} block found in design-tokens.css`)
  const open = css.indexOf("{", start)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++
    if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i)
  }
  throw new Error(`The ${selector} block is not closed`)
}

/** Parses `--name: value;` declarations, in order. */
function declarations(body) {
  const tokens = []
  for (const match of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    tokens.push([match[1], match[2].trim().replace(/\s+/g, " ")])
  }
  return tokens
}

const modes = {
  light: declarations(block(":root")),
  dark: declarations(block(".dark")),
}
const defined = {
  light: new Map(modes.light),
  dark: new Map(modes.dark),
}

const isColor = (value) => /^(oklch|oklab|rgb|rgba|hsl|hsla)\(|^#[0-9a-f]{3,8}$/i.test(value)
const isDimension = (value) => /^-?\d*\.?\d+px$/.test(value)
const reference = (value) => value.match(/^var\(--([\w-]+)\)$/)?.[1]

/** The mode whose token a reference from `mode` points to. */
function targetMode(mode, name) {
  if (mode === "dark" && defined.dark.has(name)) return "dark"
  if (defined.light.has(name)) return "light"
  throw new Error(`var(--${name}) in ${mode} mode points to a token that is not defined`)
}

/** The $type of a token, following references. */
function typeOf(mode, name, seen = new Set()) {
  const key = `${mode}.${name}`
  if (seen.has(key)) throw new Error(`Reference loop at ${key}`)
  seen.add(key)
  const value = defined[mode].get(name)
  const ref = reference(value)
  if (ref) return typeOf(targetMode(mode, ref), ref, seen)
  if (isColor(value)) return "color"
  if (isDimension(value)) return "dimension"
  return undefined
}

const output = {
  $description:
    "Claerio design tokens, generated from design-tokens.css (canonical) by scripts/generate-tokens-json.mjs. Do not edit by hand: run npm run tokens:json after any token change. Modes: light (:root) and dark (.dark).",
}

for (const [mode, tokens] of Object.entries(modes)) {
  output[mode] = {}
  for (const [name, value] of tokens) {
    const ref = reference(value)
    const token = { $value: ref ? `{${targetMode(mode, ref)}.${ref}}` : value }
    const type = typeOf(mode, name)
    if (type) token.$type = type
    output[mode][name] = token
  }
}

writeFileSync(join(root, "tokens.json"), JSON.stringify(output, null, 2) + "\n")
console.log(
  `tokens.json written: ${modes.light.length} light and ${modes.dark.length} dark tokens.`
)
