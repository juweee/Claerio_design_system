// Compare the code and Figma lists and report every item as match,
// differs, only in code or only in Figma.
//
// Usage:
//   node scripts/parity/compare.mjs <code.json> <figma.json> <out-dir> [rules.json]
//
// Writes <out-dir>/results.json (every item) and <out-dir>/results.md
// (a readable table). Exits with 1 if anything unexpected is found, so
// it can run in CI.
//
// Each item that a mapping rule explains gets `expected: true` and the
// rule's id. Drift is every item that isn't a match and isn't expected.
//
// Same input, same output: no timestamps, no randomness, sorted items.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const [codePath, figmaPath, outDir, rulesPath = join(here, "mapping-rules.json")] = process.argv.slice(2)
if (!outDir) {
  console.error("Usage: node scripts/parity/compare.mjs <code.json> <figma.json> <out-dir> [rules.json]")
  process.exit(2)
}
const code = JSON.parse(readFileSync(codePath, "utf8"))
const figma = JSON.parse(readFileSync(figmaPath, "utf8"))
const rules = JSON.parse(readFileSync(rulesPath, "utf8"))

const items = []
const add = (item) => items.push(item)
const byKey = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
const sameList = (a, b) => JSON.stringify([...a].sort(byKey)) === JSON.stringify([...b].sort(byKey))

// ---------------------------------------------------------------- values

/** oklch(L C H [/ A]) to 8-bit sRGB, clipped per channel. */
function oklchToRgb(text) {
  const m = text.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/)
  if (!m) return null
  const L = Number(m[1]) / (m[2] ? 100 : 1)
  const C = Number(m[3])
  const h = (Number(m[4]) * Math.PI) / 180
  const alpha = m[5] === undefined ? 1 : Number(m[5]) / (m[6] ? 100 : 1)
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const linear = [
    4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s,
  ]
  const encode = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)
  const rgb = linear.map((c) => Math.round(Math.min(1, Math.max(0, encode(c))) * 255))
  return [...rgb, Math.round(alpha * 255)]
}

function hexToRgb(hex) {
  const m = String(hex).match(/^#([0-9A-F]{6})([0-9A-F]{2})?$/i)
  if (!m) return null
  const n = m[1]
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16)).concat(m[2] ? parseInt(m[2], 16) : 255)
}

const toHex = (rgba) => "#" + rgba.map((c) => c.toString(16).padStart(2, "0").toUpperCase()).join("").replace(/FF$/, "")

/**
 * Turns a resolved code value into what Figma should hold.
 * Returns { kind, value, rules[] } where kind is color, number or string.
 */
function expectedFromCode(name, raw) {
  const t = rules.tokens
  const used = []
  if (t.fontFirstFamily.names.includes(name)) {
    used.push(t.fontFirstFamily.$rule)
    let family = raw.split(",")[0].trim().replace(/^['"]|['"]$/g, "")
    if (t.fontOverride.values[family]) {
      used.push(t.fontOverride.$rule)
      family = t.fontOverride.values[family]
    }
    return { kind: "string", value: family, rules: used }
  }
  if (/^oklch\(/.test(raw)) {
    const rgba = oklchToRgb(raw)
    if (rgba) return { kind: "color", value: rgba, rules: [t.colorTolerance.$rule] }
  }
  if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(raw)) return { kind: "color", value: hexToRgb(raw), rules: [] }
  let m = raw.match(/^(-?[\d.]+)px$/)
  if (m) return { kind: "number", value: Number(m[1]), rules: [t.pxAsNumber.$rule] }
  m = raw.match(/^(-?[\d.]+)%$/)
  if (m) return { kind: "number", value: Number(m[1]), rules: [t.percentAsNumber.$rule] }
  m = raw.match(/^-?[\d.]+$/)
  if (m) return { kind: "number", value: Number(raw), rules: [] }
  return { kind: "string", value: raw, rules: [] }
}

function sameValue(expected, actual) {
  if (expected.kind === "color") {
    const rgba = hexToRgb(actual)
    if (!rgba) return false
    return rgba.every((c, i) => Math.abs(c - expected.value[i]) <= rules.tokens.colorTolerance.maxChannelDelta)
  }
  if (expected.kind === "number") return typeof actual === "number" && Math.abs(actual - expected.value) < 1e-6
  return actual === expected.value
}

const show = (expected) => (expected.kind === "color" ? toHex(expected.value) : expected.value)

// ---------------------------------------------------------------- tokens

const skip = new Set(rules.tokens.skip.names)
const tokenNames = [...new Set([...Object.keys(code.tokens), ...Object.keys(figma.variables)])].sort(byKey)

for (const name of tokenNames) {
  const c = code.tokens[name]
  const f = figma.variables[name]
  if (c && !f) {
    if (skip.has(name)) add({ kind: "token", name, status: "only in code", expected: true, rule: rules.tokens.skip.$rule })
    else add({ kind: "token", name, status: "only in code", expected: false })
    continue
  }
  if (!c && f) {
    add({ kind: "token", name, status: "only in Figma", expected: false, detail: `${f.collection} collection` })
    continue
  }
  const problems = []
  const used = new Set()
  for (const mode of ["light", "dark"]) {
    const figmaMode = f.modes[rules.modes[mode]] ?? f.modes[rules.modes.singleMode]
    if (!figmaMode) {
      problems.push(`${mode}: no Figma mode`)
      continue
    }
    const cm = c.modes[mode]
    const expected = expectedFromCode(name, cm.resolved)
    expected.rules.forEach((r) => used.add(r))
    if (!sameValue(expected, figmaMode.resolved)) {
      problems.push(`${mode}: code ${cm.resolved} (${show(expected)}), Figma ${figmaMode.resolved}`)
    }
    if (cm.ref) {
      used.add(rules.tokens.references.$rule)
      if (!figmaMode.alias) problems.push(`${mode}: code references --${cm.ref}, Figma holds a copied value`)
      else if (figmaMode.alias !== cm.ref) problems.push(`${mode}: code references --${cm.ref}, Figma aliases ${figmaMode.alias}`)
    } else if (figmaMode.alias) {
      used.add(rules.tokens.references.$rule)
      // An alias where the code has a literal is fine if the value matches.
    }
  }
  // A mode-independent token in the code (no .dark override) may still live in a two-mode collection.
  const syntax = rules.tokens.codeSyntax.pattern.replace("{name}", name)
  if (f.codeSyntax !== syntax) problems.push(`code syntax is ${f.codeSyntax ?? "not set"}, expected ${syntax}`)
  add({
    kind: "token",
    name,
    status: problems.length ? "differs" : "match",
    expected: false,
    ...(problems.length ? { detail: problems.join("; ") } : {}),
    ...(used.size ? { rules: [...used].sort(byKey) } : {}),
  })
}

// ---------------------------------------------------------------- text styles

const ts = rules.textStyles
for (const styleName of Object.keys(figma.textStyles).sort(byKey)) {
  const style = figma.textStyles[styleName]
  const token = (field) => code.tokens[`${ts.tokenPrefix}${styleName}-${field}`]?.modes.light.resolved
  const problems = []
  const size = token("size")
  const weight = token("weight")
  const lineHeight = token("line-height")
  if (size === undefined) {
    add({ kind: "text style", name: styleName, status: "only in Figma", expected: false, detail: `no ${ts.tokenPrefix}${styleName}-* tokens in the code` })
    continue
  }
  if (parseFloat(size) !== style.size) problems.push(`size: code ${size}, Figma ${style.size}`)
  if (Number(weight) !== ts.weights[style.style]) problems.push(`weight: code ${weight}, Figma ${style.style}`)
  const percent = Math.round(Number(lineHeight) * 100 * 100) / 100
  if (style.lineHeight?.unit !== "PERCENT" || style.lineHeight.value !== percent) {
    problems.push(`line height: code ${lineHeight} (${percent}%), Figma ${JSON.stringify(style.lineHeight)}`)
  }
  const familyToken = ts.family[styleName] ?? ts.family["*"]
  const family = expectedFromCode(familyToken, code.tokens[familyToken].modes.light.resolved).value
  if (style.family !== family) problems.push(`family: expected ${family} (--${familyToken}), Figma ${style.family}`)
  const unboundOk = ts.unboundFamily.styles.includes(styleName)
  if (!unboundOk && style.bound.fontFamily !== familyToken) problems.push(`family bound to ${style.bound.fontFamily ?? "nothing"}, expected ${familyToken}`)
  if (style.bound.fontSize !== `${ts.tokenPrefix}${styleName}-size`) problems.push(`size bound to ${style.bound.fontSize ?? "nothing"}`)
  if (style.bound.fontWeight !== `${ts.tokenPrefix}${styleName}-weight`) problems.push(`weight bound to ${style.bound.fontWeight ?? "nothing"}`)
  add({
    kind: "text style",
    name: styleName,
    status: problems.length ? "differs" : "match",
    expected: false,
    ...(problems.length ? { detail: problems.join("; ") } : {}),
    rules: [ts.$rule, ...(unboundOk ? [ts.unboundFamily.$rule] : [])].sort(byKey),
  })
}

// ---------------------------------------------------------------- components

const cr = rules.components
const inFigma = new Set(cr.inFigma.names)
const layerParts = cr.layers.parts
/** True when the rules list this prop as having no visual effect on this component, by exact name. */
function noVisual(component, prop) {
  const entry = cr.noVisualEffect.components[component]
  if (!entry) return false
  const names = (entry.groups ?? []).flatMap((g) => {
    if (!cr.noVisualEffect.groups[g]) throw new Error(`no-visual-effect: unknown group ${g} on ${component}`)
    return cr.noVisualEffect.groups[g]
  })
  return names.includes(prop) || (entry.names ?? []).includes(prop)
}
const figmaOnlyComponent = (name) => cr.figmaOnly.patterns.some((p) => new RegExp(p).test(name))

/** Compares one code prop with one Figma property. Returns { status, detail?, rules[] }. */
function compareProp(component, propName, cp, fp) {
  const used = []
  const problems = []
  if (cp.type === "enum") {
    if (fp.type !== "VARIANT") problems.push(`code enum, Figma ${fp.type}`)
    else {
      if (!sameList(cp.values, fp.values)) {
        const missing = cp.values.filter((v) => !fp.values.includes(v))
        const extra = fp.values.filter((v) => !cp.values.includes(v))
        problems.push(`values: ${missing.length ? "missing in Figma " + missing.join(", ") : ""}${missing.length && extra.length ? "; " : ""}${extra.length ? "only in Figma " + extra.join(", ") : ""}`)
      }
      // No code default (for example one set only in cva defaultVariants): the default can't be compared.
      if (cp.default !== undefined && cp.default !== fp.default) problems.push(`default: code ${cp.default}, Figma ${fp.default}`)
    }
  } else if (cp.type === "boolean") {
    if (fp.type === "BOOLEAN") {
      if (String(cp.default ?? "false") !== String(fp.default)) problems.push(`default: code ${cp.default ?? "false (unset)"}, Figma ${fp.default}`)
    } else if (fp.type === "VARIANT") {
      used.push(cr.booleanAsVariant.$rule)
      if (!sameList(fp.values, ["false", "true"])) problems.push(`values: Figma ${fp.values.join(", ")}, expected false, true`)
      if (String(cp.default ?? "false") !== String(fp.default)) problems.push(`default: code ${cp.default ?? "false (unset)"}, Figma ${fp.default}`)
    } else problems.push(`code boolean, Figma ${fp.type}`)
  } else if (cp.type === "node" || cp.type === "string") {
    used.push(cr.childrenAsText.$rule)
    if (fp.type !== "TEXT") problems.push(`code ${cp.type}, Figma ${fp.type}`)
  } else if ((cr.handlerAsBoolean.props[component] ?? []).includes(propName)) {
    used.push(cr.handlerAsBoolean.$rule)
    if (fp.type !== "BOOLEAN") problems.push(`expected a Figma boolean, found ${fp.type}`)
  } else {
    problems.push(`code type ${cp.type} has no Figma mapping`)
  }
  return { status: problems.length ? "differs" : "match", detail: problems.join("; "), rules: used }
}

const codeComponents = Object.keys(code.components).sort(byKey)
const claimed = new Map() // Figma component -> Set of property names matched

for (const name of codeComponents) {
  const cc = code.components[name]
  if (!inFigma.has(name)) {
    if (figma.components[name]) {
      add({ kind: "component", name, status: "match", expected: false, detail: "in Figma but not in figma-scope: add it to the rules" })
    } else {
      add({ kind: "component", name, status: "only in code", expected: true, rule: cr.inFigma.$rule })
    }
    continue
  }
  // Parts that live as layers in their parent.
  const part = layerParts[name]
  const target = part ? cr.layers.parent : name
  const fc = figma.components[target]
  if (!fc) {
    add({ kind: "component", name, status: "only in code", expected: false, detail: part ? `parent ${target} is missing in Figma` : undefined })
    continue
  }
  add({ kind: "component", name, status: "match", expected: false, ...(part ? { detail: `layer in ${target}`, rules: [cr.layers.$rule] } : {}) })
  if (!claimed.has(target)) claimed.set(target, new Set())
  const taken = claimed.get(target)

  if (part?.optional) {
    const fp = fc.properties[name]
    taken.add(name)
    if (!fp) add({ kind: "prop", name: `${name}`, component: target, status: "only in code", expected: false, detail: `${target} has no boolean to show or hide ${name}`, rules: [cr.layers.$rule] })
    else if (fp.type !== "BOOLEAN") add({ kind: "prop", name, component: target, status: "differs", expected: false, detail: `expected BOOLEAN, found ${fp.type}`, rules: [cr.layers.$rule] })
    else add({ kind: "prop", name, component: target, status: "match", expected: false, detail: "shows or hides the part", rules: [cr.layers.$rule] })
  }

  for (const propName of Object.keys(cc.props).sort(byKey)) {
    const cp = cc.props[propName]
    const label = `${name}.${propName}`
    if (noVisual(name, propName)) {
      add({ kind: "prop", name: label, status: "only in code", expected: true, rule: cr.noVisualEffect.$rule })
      continue
    }
    if (name === cr.layers.parent && propName === "children") {
      add({ kind: "prop", name: label, status: "only in code", expected: true, rule: cr.layers.$rule, detail: cr.layers.parentChildren })
      continue
    }
    const figmaName = part ? `${name}.${propName}` : propName
    const fp = fc.properties[figmaName]
    taken.add(figmaName)
    if (!fp) {
      add({ kind: "prop", name: label, status: "only in code", expected: false, detail: `no Figma property ${figmaName} on ${target}` })
      continue
    }
    const result = compareProp(name, propName, cp, fp)
    add({
      kind: "prop",
      name: label,
      status: result.status,
      expected: false,
      ...(result.detail ? { detail: result.detail } : {}),
      ...(part ? { rules: [cr.layers.$rule, ...result.rules].sort(byKey) } : result.rules.length ? { rules: [...new Set(result.rules)].sort(byKey) } : {}),
    })
  }
}

// Figma components and properties the code doesn't account for.
for (const name of Object.keys(figma.components).sort(byKey)) {
  const fc = figma.components[name]
  if (figmaOnlyComponent(name)) {
    add({ kind: "component", name, status: "only in Figma", expected: true, rule: cr.figmaOnly.$rule })
    continue
  }
  if (!code.components[name]) {
    add({ kind: "component", name, status: "only in Figma", expected: false })
    continue
  }
  const taken = claimed.get(name) ?? new Set()
  for (const propName of Object.keys(fc.properties).sort(byKey)) {
    if (taken.has(propName)) continue
    const fp = fc.properties[propName]
    const label = `${name}.${propName}`
    if (propName === cr.state.property && cr.state.values[name]) {
      const want = cr.state.values[name]
      const problems = []
      if (fp.type !== "VARIANT") problems.push(`expected VARIANT, found ${fp.type}`)
      else {
        if (!sameList(fp.values, want)) {
          const missing = want.filter((v) => !fp.values.includes(v))
          const extra = fp.values.filter((v) => !want.includes(v))
          problems.push(`values: ${missing.length ? "missing " + missing.join(", ") : ""}${missing.length && extra.length ? "; " : ""}${extra.length ? "unexpected " + extra.join(", ") : ""}`)
        }
        if (fp.default !== cr.state.default) problems.push(`default ${fp.default}, expected ${cr.state.default}`)
      }
      add({ kind: "prop", name: label, status: problems.length ? "differs" : "only in Figma", expected: !problems.length, rule: cr.state.$rule, ...(problems.length ? { detail: problems.join("; ") } : {}) })
      continue
    }
    const icon = cr.icons.properties[name]?.[propName]
    if (icon) {
      const problems = []
      if (fp.type !== icon.type) problems.push(`expected ${icon.type}, found ${fp.type}`)
      if (String(fp.default) !== String(icon.default)) problems.push(`default ${fp.default}, expected ${icon.default}`)
      add({ kind: "prop", name: label, status: problems.length ? "differs" : "only in Figma", expected: !problems.length, rule: cr.icons.$rule, ...(problems.length ? { detail: problems.join("; ") } : {}) })
      continue
    }
    add({ kind: "prop", name: label, status: "only in Figma", expected: false, detail: `${fp.type} property with no code prop` })
  }
}

// Expected Figma-only properties that are missing (for example a deleted state or icon property).
for (const [component, want] of Object.entries(cr.state.values)) {
  if (figma.components[component] && !figma.components[component].properties[cr.state.property]) {
    add({ kind: "prop", name: `${component}.${cr.state.property}`, status: "only in code", expected: false, rule: cr.state.$rule, detail: `the rules expect a state variant with ${want.join(", ")}` })
  }
}
for (const [component, props] of Object.entries(cr.icons.properties)) {
  for (const prop of Object.keys(props)) {
    if (figma.components[component] && !figma.components[component].properties[prop]) {
      add({ kind: "prop", name: `${component}.${prop}`, status: "only in code", expected: false, rule: cr.icons.$rule, detail: "the rules expect this Figma property" })
    }
  }
}

// ---------------------------------------------------------------- output

const kindOrder = ["token", "text style", "component", "prop"]
items.sort((a, b) => kindOrder.indexOf(a.kind) - kindOrder.indexOf(b.kind) || byKey(a.name, b.name))
for (const item of items) if (item.detail === undefined) delete item.detail

const isDrift = (i) => i.status !== "match" && !i.expected
const statuses = ["match", "differs", "only in code", "only in Figma"]
const summary = {}
for (const kind of kindOrder) {
  const group = items.filter((i) => i.kind === kind)
  summary[kind] = Object.fromEntries(statuses.map((s) => [s, group.filter((i) => i.status === s).length]))
  summary[kind].expected = group.filter((i) => i.expected).length
  summary[kind].drift = group.filter(isDrift).length
}
const drift = items.filter(isDrift)

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, "results.json"), JSON.stringify({ figmaFile: figma.file, summary, drift, items }, null, 2) + "\n")

const esc = (s) => String(s ?? "").replace(/\|/g, "\\|")
const lines = [
  `# Parity check results`,
  ``,
  `Figma file: ${figma.file}. Generated by scripts/parity/compare.mjs.`,
  ``,
  `## Summary`,
  ``,
  `| Kind | Match | Differs | Only in code | Only in Figma | Expected by a rule | Drift |`,
  `| --- | --- | --- | --- | --- | --- | --- |`,
  ...kindOrder.map((k) => `| ${k} | ${statuses.map((s) => summary[k][s]).join(" | ")} | ${summary[k].expected} | ${summary[k].drift} |`),
  ``,
  `## Drift (${drift.length})`,
  ``,
  ...(drift.length
    ? [`| Kind | Item | Status | Detail |`, `| --- | --- | --- | --- |`, ...drift.map((i) => `| ${i.kind} | ${esc(i.name)} | ${i.status} | ${esc(i.detail)} |`)]
    : [`None.`]),
  ``,
  `## All items`,
  ``,
  `| Kind | Item | Status | Expected | Rule | Detail |`,
  `| --- | --- | --- | --- | --- | --- |`,
  ...items.map((i) => `| ${i.kind} | ${esc(i.name)} | ${i.status} | ${i.expected ? "yes" : ""} | ${esc(i.rule ?? (i.rules ?? []).join(", "))} | ${esc(i.detail)} |`),
  ``,
]
writeFileSync(join(outDir, "results.md"), lines.join("\n"))

console.log(`${items.length} items. Drift: ${drift.length}.`)
for (const i of drift) console.log(`  ${i.status.padEnd(13)} ${i.kind} ${i.name}${i.detail ? ": " + i.detail : ""}`)
process.exit(drift.length ? 1 : 0)
