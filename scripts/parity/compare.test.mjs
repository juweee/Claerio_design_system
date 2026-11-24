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

import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const fixture = (name) => join(here, "fixtures", name)

function compare(codePath, figmaPath) {
  const out = mkdtempSync(join(tmpdir(), "parity-"))
  const run = spawnSync(process.execPath, [join(here, "compare.mjs"), codePath, figmaPath, out], { encoding: "utf8" })
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
