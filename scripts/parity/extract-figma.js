// Build the Figma side of the parity check.
//
// Runs inside Figma's plugin context: paste the body into Figma Console
// MCP's figma_execute (or run it as a plugin) with the target file
// active. It returns one JSON object. Save it as figma.json next to
// code.json, then run compare.mjs.
//
// Edit OPTIONS below before running:
// - components: null for every component, or a list of component (set)
//   names to keep, such as ["Button - Nova", "Alert - Nova"].
// - variables and textStyles: false to leave them out, for example in a
//   kit file whose own variables aren't being compared.
// - bindings: true to record, for each component, every visible fill and
//   stroke color, padding, gap and corner radius, and the variable bound
//   to it, if any. Layers inside nested instances are left out: they
//   belong to the nested component. Also records bindingsByVariant, the
//   same values per variant, so a file can be compared layer by layer
//   with the Clærio file (compare.mjs --reference).
// - propertyLinks: true to record, for each boolean, text and instance
//   swap property, in how many variants a layer uses it.
//
// Uses only the async node and variable APIs (getNodeByIdAsync,
// getMainComponentAsync, getLocalVariablesAsync and so on), because the
// sync getters throw when the file uses dynamic page loading.
//
// The output has no node positions or timestamps, and every list is
// sorted, so the same file always gives the same result. Node IDs are
// kept only as `id` fields, which compare.mjs ignores.

const OPTIONS = { components: null, variables: true, textStyles: true, bindings: false, propertyLinks: false }

const byKey = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
const sortObject = (o) => Object.fromEntries(Object.keys(o).sort(byKey).map((k) => [k, o[k]]))
const hex = (n) => Math.round(n * 255).toString(16).padStart(2, "0").toUpperCase()
const color = (c) => "#" + hex(c.r) + hex(c.g) + hex(c.b) + ("a" in c && c.a < 1 ? hex(c.a) : "")
const round = (n) => Math.round(n * 10000) / 10000

await figma.loadAllPagesAsync()

// ---------------------------------------------------------------- variables

const collections = await figma.variables.getLocalVariableCollectionsAsync()
const variables = await figma.variables.getLocalVariablesAsync()
const collectionById = new Map(collections.map((c) => [c.id, c]))
const variableById = new Map(variables.map((v) => [v.id, v]))

async function variableFor(id) {
  return variableById.get(id) ?? (await figma.variables.getVariableByIdAsync(id))
}

async function collectionFor(id) {
  return collectionById.get(id) ?? (await figma.variables.getVariableCollectionByIdAsync(id))
}

function literal(value, type) {
  if (type === "COLOR") return color(value)
  if (type === "FLOAT") return round(value)
  return value
}

/** Follows aliases to a literal, picking the target's mode by name, or its only mode. */
async function resolveValue(variable, modeName, seen = new Set()) {
  if (seen.has(variable.id)) return { error: "alias loop" }
  seen.add(variable.id)
  const collection = await collectionFor(variable.variableCollectionId)
  const mode = collection.modes.find((m) => m.name === modeName) ?? collection.modes[0]
  const value = variable.valuesByMode[mode.modeId]
  if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
    const target = await variableFor(value.id)
    if (!target) return { error: "missing alias target " + value.id }
    return resolveValue(target, modeName, seen)
  }
  return literal(value, variable.resolvedType)
}

const allModeNames = [...new Set(collections.flatMap((c) => c.modes.map((m) => m.name)))].sort(byKey)

const variableList = {}
if (OPTIONS.variables) {
  for (const variable of variables) {
    const collection = collectionById.get(variable.variableCollectionId)
    const modes = {}
    for (const mode of collection.modes) {
      const value = variable.valuesByMode[mode.modeId]
      const entry = {}
      if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
        const target = await variableFor(value.id)
        entry.alias = target ? target.name : "missing:" + value.id
      } else {
        entry.value = literal(value, variable.resolvedType)
      }
      entry.resolved = await resolveValue(variable, mode.name)
      modes[mode.name] = entry
    }
    variableList[variable.name] = {
      id: variable.id,
      collection: collection.name,
      type: variable.resolvedType,
      codeSyntax: variable.codeSyntax?.WEB ?? null,
      modes: sortObject(modes),
    }
  }
}

// ---------------------------------------------------------------- text styles

const textStyles = {}
if (OPTIONS.textStyles) {
  for (const style of await figma.getLocalTextStylesAsync()) {
    const bound = {}
    for (const [field, alias] of Object.entries(style.boundVariables ?? {})) {
      const target = await variableFor(alias.id)
      bound[field] = target ? target.name : "missing:" + alias.id
    }
    textStyles[style.name] = {
      family: style.fontName.family,
      style: style.fontName.style,
      size: style.fontSize,
      lineHeight: style.lineHeight.unit === "AUTO" ? "auto" : { unit: style.lineHeight.unit, value: round(style.lineHeight.value) },
      letterSpacing: { unit: style.letterSpacing.unit, value: round(style.letterSpacing.value) },
      bound: sortObject(bound),
    }
  }
}

// ---------------------------------------------------------------- components

async function nameOfNode(id) {
  const node = await figma.getNodeByIdAsync(id)
  if (!node) return "missing:" + id
  if (node.type === "COMPONENT" && node.parent?.type === "COMPONENT_SET") return node.parent.name + "/" + node.name
  return node.name
}

async function properties(node) {
  const result = {}
  for (const [key, def] of Object.entries(node.componentPropertyDefinitions)) {
    const name = key.replace(/#[^#]*$/, "")
    const entry = { type: def.type }
    if (def.type === "VARIANT") {
      entry.values = [...def.variantOptions].sort(byKey)
      entry.default = def.defaultValue
    } else if (def.type === "INSTANCE_SWAP") {
      entry.default = await nameOfNode(def.defaultValue)
      if (def.preferredValues?.length) {
        const preferred = []
        for (const p of def.preferredValues) {
          const component = p.type === "COMPONENT_SET"
            ? (await figma.importComponentSetByKeyAsync(p.key).catch(() => null))
            : (await figma.importComponentByKeyAsync(p.key).catch(() => null))
          preferred.push(component ? component.name : "key:" + p.key)
        }
        entry.preferredValues = preferred.sort(byKey)
      }
    } else {
      entry.default = def.defaultValue
    }
    result[name] = entry
  }
  return sortObject(result)
}

/** Names of component instances placed inside a component, found with getMainComponentAsync. */
async function nestedInstances(node) {
  const names = new Set()
  for (const instance of node.findAllWithCriteria({ types: ["INSTANCE"] })) {
    const main = await instance.getMainComponentAsync()
    if (!main) continue
    names.add(main.parent?.type === "COMPONENT_SET" ? main.parent.name : main.name)
  }
  return [...names].sort(byKey)
}

/** Describes a bound variable: its name, collection, and whether it comes from a library. */
const variableLabels = new Map()
async function variableLabel(id) {
  if (variableLabels.has(id)) return variableLabels.get(id)
  const variable = await variableFor(id)
  let label = "missing:" + id
  if (variable) {
    const collection = await collectionFor(variable.variableCollectionId).catch(() => null)
    label = `${variable.name} (${collection ? collection.name : "unknown collection"}${variable.remote ? ", library" : ""})`
  }
  variableLabels.set(id, label)
  return label
}

const SPACING = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "itemSpacing"]
const RADIUS = ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"]

/**
 * Records fills, strokes, spacing and radius for every layer of every variant,
 * grouped by layer path and field: { "path|field": { "bound or literal value": count } }.
 * Also returns the same values per variant: { variant: { "path|field": "value" } }.
 * Skips layers that are hidden and not controlled by a boolean property, invisible or 0%
 * paints, zero spacing and radius that isn't bound, and everything inside nested instances.
 */
async function bindings(variants) {
  const groups = {}
  const byVariant = {}
  let current = null
  const count = (path, field, value) => {
    const key = `${path || "(root)"}|${field}`
    groups[key] ??= {}
    groups[key][value] = (groups[key][value] ?? 0) + 1
    // Two layers with the same path in one variant are joined, in layer order.
    current[key] = current[key] === undefined ? value : current[key] + " + " + value
  }
  // A layer hidden by a boolean property is still part of the component, so it's checked.
  const shown = (n) => n.visible !== false || Boolean(n.componentPropertyReferences?.visible)
  async function visit(node, path) {
    if (!shown(node)) return
    const bound = node.boundVariables ?? {}
    for (const field of ["fills", "strokes"]) {
      const paints = node[field]
      if (!Array.isArray(paints)) continue
      for (const [i, paint] of paints.entries()) {
        if (paint.visible === false || paint.type !== "SOLID" || paint.opacity === 0) continue
        const id = paint.boundVariables?.color?.id
        const opacity = paint.opacity < 1 ? ` @${Math.round(paint.opacity * 100)}%` : ""
        count(path, `${field}[${i}]`, id ? "var " + (await variableLabel(id)) + opacity : "literal " + color(paint.color) + opacity)
      }
    }
    if ("layoutMode" in node && node.layoutMode !== "NONE") {
      for (const field of SPACING) {
        if (field === "itemSpacing" && node.children.filter(shown).length < 2) continue
        const id = bound[field]?.id
        if (id) count(path, field, "var " + (await variableLabel(id)))
        else if (node[field]) count(path, field, "literal " + round(node[field]))
      }
    }
    if ("topLeftRadius" in node) {
      for (const field of RADIUS) {
        const id = bound[field]?.id
        if (id) count(path, field, "var " + (await variableLabel(id)))
        else if (node[field]) count(path, field, "literal " + round(node[field]))
      }
    }
    if (node.type === "INSTANCE" || !("children" in node)) return
    for (const child of node.children) await visit(child, path ? path + "/" + child.name : child.name)
  }
  for (const variant of variants) {
    current = {}
    await visit(variant, "")
    byVariant[variant.name] = sortObject(current)
  }
  return {
    bindings: sortObject(Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, sortObject(v)]))),
    bindingsByVariant: sortObject(byVariant),
  }
}

/**
 * For each boolean, text and instance swap property, the number of variants in which
 * a layer uses it. A layer inside a nested instance belongs to that instance's
 * component, but the nested instance itself counts.
 */
function propertyLinks(node, variants) {
  const used = {}
  for (const [key, def] of Object.entries(node.componentPropertyDefinitions)) {
    if (def.type === "VARIANT") continue
    let n = 0
    for (const variant of variants) {
      const stack = [variant]
      let found = false
      while (stack.length && !found) {
        const x = stack.pop()
        if (Object.values(x.componentPropertyReferences ?? {}).includes(key)) found = true
        else if (x.type !== "INSTANCE" && "children" in x) stack.push(...x.children)
      }
      if (found) n++
    }
    used[key.replace(/#[^#]*$/, "")] = n
  }
  return sortObject(used)
}

const sectionOf = (node) => {
  for (let p = node.parent; p; p = p.parent) if (p.type === "SECTION") return p.name
  return null
}

const components = {}
for (const page of figma.root.children) {
  for (const node of page.findAllWithCriteria({ types: ["COMPONENT_SET", "COMPONENT"] })) {
    if (node.type === "COMPONENT" && node.parent?.type === "COMPONENT_SET") continue
    if (OPTIONS.components && !OPTIONS.components.includes(node.name)) continue
    const variants = node.type === "COMPONENT_SET" ? node.children.filter((c) => c.type === "COMPONENT") : [node]
    const layers = new Set()
    for (const variant of variants) for (const child of variant.children ?? []) layers.add(child.name)
    components[node.name] = {
      id: node.id,
      kind: node.type,
      page: page.name,
      section: sectionOf(node),
      variantCount: variants.length,
      properties: await properties(node),
      topLayers: [...layers].sort(byKey),
      nestedInstances: await nestedInstances(node),
      ...(OPTIONS.bindings ? await bindings(variants) : {}),
      ...(OPTIONS.propertyLinks ? { propertyLinks: propertyLinks(node, variants) } : {}),
    }
  }
}

return {
  file: figma.root.name,
  modes: allModeNames,
  collections: sortObject(Object.fromEntries(collections.map((c) => [c.name, c.modes.map((m) => m.name)]))),
  components: sortObject(components),
  variables: sortObject(variableList),
  textStyles: sortObject(textStyles),
}
