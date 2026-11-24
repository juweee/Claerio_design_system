// Build the code side of the parity check.
//
// Reads the Storybook components manifest (props, allowed values and
// defaults, from react-docgen) and design-tokens.css (every token, light
// and dark), and writes one JSON file.
//
// Usage:
//   node scripts/parity/extract-code.mjs <out.json> [manifest]
//
// [manifest] is a file path or URL. The default is the running
// Storybook: http://localhost:6006/manifests/components.json
// (start it with `npm run storybook`).
//
// The output has no timestamps, and every list is sorted, so the same
// input always gives the same file.

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const [out, source = "http://localhost:6006/manifests/components.json"] = process.argv.slice(2)
if (!out) {
  console.error("Usage: node scripts/parity/extract-code.mjs <out.json> [manifest]")
  process.exit(1)
}

const byKey = (a, b) => (a < b ? -1 : a > b ? 1 : 0)

// ---------------------------------------------------------------- components

const manifest = /^https?:/.test(source)
  ? await (await fetch(source)).json()
  : JSON.parse(readFileSync(source, "utf8"))

const stripQuotes = (s) => s.replace(/^"(.*)"$/, "$1")

/** Turns a react-docgen prop into { type, values?, default? }. */
function prop(p) {
  const t = p.tsType ?? p.type ?? {}
  const result = {}
  const elements = t.name === "union" ? t.elements ?? [] : []
  const literals = elements.filter((e) => e.name === "literal")
  if (t.name === "boolean") result.type = "boolean"
  else if (literals.length && literals.length === elements.length) {
    result.type = "enum"
    result.values = literals.map((e) => stripQuotes(e.value)).sort(byKey)
  } else if (t.name === "string") result.type = "string"
  else if (t.name === "number") result.type = "number"
  else if (/ReactNode/.test(t.raw ?? t.name ?? "")) result.type = "node"
  else result.type = t.raw ?? t.name ?? "unknown"
  if (p.defaultValue && !p.defaultValue.computed) {
    result.default = stripQuotes(String(p.defaultValue.value))
  }
  if (p.required) result.required = true
  return result
}

const components = {}
for (const entry of Object.values(manifest.components)) {
  const parts = [[entry.name, entry.reactDocgen, null]]
  for (const [name, sub] of Object.entries(entry.subcomponents ?? {})) {
    parts.push([name, sub.reactDocgen, entry.name])
  }
  for (const [name, docgen, parent] of parts) {
    const props = {}
    for (const key of Object.keys(docgen?.props ?? {}).sort(byKey)) {
      props[key] = prop(docgen.props[key])
    }
    components[name] = { entry: entry.id, ...(parent ? { partOf: parent } : {}), props }
  }
}

// ---------------------------------------------------------------- tokens

const css = readFileSync(join(root, "design-tokens.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "")

function block(selector) {
  const start = css.search(new RegExp(`(^|\\n)\\s*${selector.replace(".", "\\.")}\\s*\\{`))
  if (start === -1) throw new Error(`No ${selector} block in design-tokens.css`)
  const open = css.indexOf("{", start)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++
    if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i)
  }
  throw new Error(`The ${selector} block is not closed`)
}

const declarations = (body) =>
  new Map([...body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim().replace(/\s+/g, " ")]))

const light = declarations(block(":root"))
const dark = declarations(block(".dark"))
const reference = (v) => v.match(/^var\(--([\w-]+)\)$/)?.[1]

/** Follows var() references to a literal. Dark mode inherits what .dark doesn't redefine. */
function resolve(name, mode, seen = new Set()) {
  if (seen.has(name)) throw new Error(`Reference loop at --${name}`)
  seen.add(name)
  const raw = (mode === "dark" && dark.has(name) ? dark : light).get(name)
  if (raw === undefined) throw new Error(`--${name} is not defined`)
  const ref = reference(raw)
  return ref ? resolve(ref, mode, seen) : raw
}

const tokens = {}
for (const name of [...light.keys()].sort(byKey)) {
  const modes = {}
  for (const mode of ["light", "dark"]) {
    const raw = (mode === "dark" && dark.has(name) ? dark : light).get(name)
    const ref = reference(raw)
    modes[mode] = { raw, ...(ref ? { ref } : {}), resolved: resolve(name, mode) }
  }
  tokens[name] = { darkOverride: dark.has(name), modes }
}
for (const name of dark.keys()) {
  if (!light.has(name)) throw new Error(`--${name} is only in .dark`)
}

const result = {
  source: { manifest: source.startsWith("http") ? "storybook" : source, tokens: "design-tokens.css" },
  components: Object.fromEntries(Object.keys(components).sort(byKey).map((k) => [k, components[k]])),
  tokens,
}
writeFileSync(out, JSON.stringify(result, null, 2) + "\n")
console.log(`${Object.keys(components).length} components, ${Object.keys(tokens).length} tokens -> ${out}`)
