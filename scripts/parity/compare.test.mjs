// Fixture tests for compare.mjs. Run with: npm run test:parity
//
// fixtures/code.json        code list (extract-code.mjs, November 24, 2026)
// fixtures/figma-clean.json the Figma file after teal and chart-2 were aliased
// fixtures/figma-drift.json a duplicate of the Figma file with 3 planted changes:
//   1. Button variant value ghost renamed to tertiary
//   2. destructive Light changed from #E7000B to #C10007
//   3. Banner property onDismiss deleted
// The duplicate was made before the alias fix, so it also still has teal
// and chart-2 as copied values.
//
// Bindings fixtures, from experiment 1.7 part B (November 24, 2026):
// fixtures/claerio-reference.json Button, Banner and BannerBar from the Clærio
//                                 file, with bindings, per-variant bindings and
//                                 property links
// fixtures/kit-before.json        Button and Alert from a shadcn/ui kit file
//                                 before repair (bindings only)
// fixtures/kit-after.json         the same kit after repair
// fixtures/kit-overlay.json       pairs the kit's names with Clærio's

import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const fixture = (name) => join(here, "fixtures", name)

function compare(codePath, figmaPath, flags = []) {
  const out = mkdtempSync(join(tmpdir(), "parity-"))
  const run = spawnSync(process.execPath, [join(here, "compare.mjs"), codePath, figmaPath, out, ...flags], { encoding: "utf8" })
  if (run.status !== 0 && run.status !== 1) throw new Error(run.stderr)
  return { status: run.status, out, results: JSON.parse(readFileSync(join(out, "results.json"), "utf8")) }
}

const driftByName = (results) => Object.fromEntries(results.drift.map((i) => [i.name, i]))

test("the clean Figma file has no drift", () => {
  const { status, results } = compare(fixture("code.json"), fixture("figma-clean.json"))
  assert.equal(status, 0)
  assert.deepEqual(results.drift, [])
})

test("the drift file reports the 3 planted changes", () => {
  const { status, results } = compare(fixture("code.json"), fixture("figma-drift.json"))
  assert.equal(status, 1)
  const drift = driftByName(results)

  assert.equal(drift["Button.variant"]?.status, "differs")
  assert.equal(drift["Button.variant"].detail, "values: missing in Figma ghost; only in Figma tertiary")

  assert.equal(drift["destructive"]?.status, "differs")
  assert.match(drift["destructive"].detail, /^light: code oklch\(0\.577 0\.245 27\.325\) \(#E7000B\), Figma #C10007$/)

  assert.equal(drift["Banner.onDismiss"]?.status, "only in code")
  assert.equal(drift["Banner.onDismiss"].detail, "no Figma property onDismiss on Banner")

  // Nothing else, apart from the 2 copied values the duplicate still had.
  assert.deepEqual(Object.keys(drift).sort(), ["Banner.onDismiss", "Button.variant", "chart-2", "destructive", "teal"])
})

test("the same input gives the same output", () => {
  const a = compare(fixture("code.json"), fixture("figma-drift.json"))
  const b = compare(fixture("code.json"), fixture("figma-drift.json"))
  for (const file of ["results.json", "results.md"]) {
    assert.equal(readFileSync(join(a.out, file), "utf8"), readFileSync(join(b.out, file), "utf8"))
  }
})

test("a new code prop that isn't listed as non-visual is reported", () => {
  const code = JSON.parse(readFileSync(fixture("code.json"), "utf8"))
  code.components.Button.props.size = { type: "enum", values: ["md", "sm"], default: "md" }
  code.components.Button.props["aria-pressed"] = { type: "boolean" }
  const path = join(mkdtempSync(join(tmpdir(), "parity-")), "code.json")
  writeFileSync(path, JSON.stringify(code))
  const { status, results } = compare(path, fixture("figma-clean.json"))
  assert.equal(status, 1)
  const drift = driftByName(results)
  assert.equal(drift["Button.size"]?.status, "only in code")
  // Non-visual props are listed per component by exact name, so a new aria- prop is reported too.
  assert.equal(drift["Button.aria-pressed"]?.status, "only in code")
  assert.equal(results.drift.length, 2)
})

// ---------------------------------------------------------------- bindings

const kitFlags = ["--components", "Button,Banner", "--overlay", fixture("kit-overlay.json"), "--reference", fixture("claerio-reference.json")]
const count = (results, kind, status) => results.items.filter((i) => i.kind === kind && i.status === status).length

/** Writes a changed copy of a fixture to a temporary file and returns its path. */
function changed(name, change) {
  const data = JSON.parse(readFileSync(fixture(name), "utf8"))
  change(data)
  const path = join(mkdtempSync(join(tmpdir(), "parity-")), name)
  writeFileSync(path, JSON.stringify(data))
  return path
}

test("the Clærio file has no drift against itself, bindings included", () => {
  const { status, results } = compare(fixture("code.json"), fixture("claerio-reference.json"),
    ["--components", "Button,Banner", "--reference", fixture("claerio-reference.json")])
  assert.equal(status, 0)
  assert.deepEqual(results.drift, [])
  assert.equal(count(results, "binding", "match"), 47)
  assert.equal(results.items.filter((i) => i.kind === "binding" && i.expected).length, 15)
  assert.equal(count(results, "property link", "match"), 12)
  assert.equal(count(results, "layer binding", "match"), 62)
  assert.equal(count(results, "layer binding", "differs"), 0)
})

test("the kit before repair reports its drift", () => {
  const { status, results } = compare(fixture("code.json"), fixture("kit-before.json"), kitFlags)
  assert.equal(status, 1)
  assert.equal(results.drift.length, 75)
  const drift = driftByName(results)
  assert.equal(drift["Button"].detail, 'named "Button - Nova" in Figma')
  assert.equal(drift["Banner"].detail, 'named "Alert - Nova" in Figma')
  assert.equal(results.drift.filter((i) => i.kind === "binding").length, 41)
  assert.match(drift["Button (root) paddingLeft"].detail, /not bound to a Clærio variable: var out-of-scale\/2,5 \(spacing\) \(90\)/)
  // Expected Figma properties that the kit lacks.
  for (const name of ["Button.iconStart", "Button.iconEnd", "Button.iconStartGlyph", "Button.iconEndGlyph", "Button.state", "Banner.state"]) {
    assert.equal(drift[name]?.status, "missing in Figma", name)
  }
  // No per-variant bindings in this file, so the reference comparison says so.
  assert.equal(count(results, "layer binding", "match") + count(results, "layer binding", "differs"), 0)
  assert.equal(results.referenceNotes.length, 2)
})

test("the kit after repair has only BannerBar left, and matches the Clærio file layer by layer", () => {
  const { status, results } = compare(fixture("code.json"), fixture("kit-after.json"), kitFlags)
  assert.equal(status, 1)
  assert.deepEqual(results.drift.map((i) => [i.kind, i.name, i.status]), [["component", "BannerBar", "only in code"]])
  assert.equal(count(results, "layer binding", "differs"), 0)
  assert.equal(count(results, "layer binding", "match"), 53)
  assert.equal(count(results, "property link", "match"), 11)
  assert.deepEqual(results.referenceNotes, ["Button: layers and fields not in both files, not compared: underline (hover)|fills[0]"])
})

test("a Clærio variable bound to the wrong layer passes the binding check but not the reference check", () => {
  const path = changed("kit-after.json", (kit) => {
    const button = kit.components.Button
    button.bindingsByVariant["variant=secondary, state=hover, disabled=false"]["(root)|fills[0]"] = "var primary (semantic, library)"
    const fills = button.bindings["(root)|fills[0]"]
    fills["var accent (semantic, library)"] -= 1
    fills["var primary (semantic, library)"] += 1
  })
  const { results } = compare(fixture("code.json"), path, kitFlags)
  const drift = driftByName(results)
  assert.equal(drift["Button (root) fills[0]"]?.kind, "layer binding")
  assert.equal(drift["Button (root) fills[0]"].detail, "variant=secondary, state=hover, disabled=false: reference accent, here primary")
  assert.equal(results.drift.filter((i) => i.kind === "binding").length, 0)
})

test("a property that controls no layer in some variants is reported", () => {
  const path = changed("kit-after.json", (kit) => { kit.components.Banner.propertyLinks["BannerTitle.children"] = 4 })
  const { results } = compare(fixture("code.json"), path, kitFlags)
  const item = driftByName(results)["Banner.BannerTitle.children"]
  assert.equal(item?.kind, "property link")
  assert.equal(item.detail, "controls no layer in 2 of 6 variants")
})

test("an expected Figma property that's deleted is missing in Figma", () => {
  const path = changed("kit-after.json", (kit) => {
    delete kit.components.Button.properties.iconEnd
    delete kit.components.Button.propertyLinks.iconEnd
  })
  const { results } = compare(fixture("code.json"), path, kitFlags)
  const item = driftByName(results)["Button.iconEnd"]
  assert.equal(item?.status, "missing in Figma")
  assert.equal(item.detail, "the rules expect this Figma property")
})
