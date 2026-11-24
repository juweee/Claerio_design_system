// Build the Figma side of the parity check.
//
// Runs inside Figma's plugin context: paste the body into Figma Console
// MCP's figma_execute (or run it as a plugin) with the target file
// active. It returns one JSON object. Save it as figma.json next to
// code.json, then run compare.mjs.
//
// Uses only the async node and variable APIs (getNodeByIdAsync,
// getMainComponentAsync, getLocalVariablesAsync and so on), because the
// sync getters throw when the file uses dynamic page loading.
//
// The output has no node positions or timestamps, and every list is
// sorted, so the same file always gives the same result. Node IDs are
// kept only as `id` fields, which compare.mjs ignores.

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

function literal(value, type) {
  if (type === "COLOR") return color(value)
  if (type === "FLOAT") return round(value)
  return value
}

/** Follows aliases to a literal, picking the target's mode by name, or its only mode. */
async function resolveValue(variable, modeName, seen = new Set()) {
  if (seen.has(variable.id)) return { error: "alias loop" }
  seen.add(variable.id)
  const collection = collectionById.get(variable.variableCollectionId)
    ?? (await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId))
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

// ---------------------------------------------------------------- text styles

const textStyles = {}
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

const sectionOf = (node) => {
  for (let p = node.parent; p; p = p.parent) if (p.type === "SECTION") return p.name
  return null
}

const components = {}
for (const page of figma.root.children) {
  for (const node of page.findAllWithCriteria({ types: ["COMPONENT_SET", "COMPONENT"] })) {
    if (node.type === "COMPONENT" && node.parent?.type === "COMPONENT_SET") continue
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
