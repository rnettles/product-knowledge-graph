import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { compileProfile, lintProfile } from "../src/profile.js";
import { readMarkdownEstate } from "../src/adapters/markdown.js";
import { normalizeRecords } from "../src/normalize.js";
import { buildGraph } from "../src/graph.js";
import { lintEstate } from "../src/lint/index.js";
import { compareBaseline } from "../src/lint/baseline.js";
import { findingIdentity } from "../src/model.js";
import { runReport } from "../src/reports/index.js";

const root = path.dirname(new URL(import.meta.url).pathname);
const profile = compileProfile(YAML.parse(fs.readFileSync(path.join(root, "../profiles/example-profile.yaml"), "utf8")));
const graphAt = name => buildGraph(normalizeRecords(readMarkdownEstate(path.join(root, `.fixtures/${name}`)), profile), profile);

test("example profile compiles", () => assert.equal(profile.valid, true));

test("profile linter rejects incoherent project configuration", () => {
  const broken = structuredClone(profile.profile);
  broken.realization_pairs.requirement = ["undefined-kind"];
  broken.reports.traceability.expected_children.requirement = ["also-undefined"];
  const codes = new Set(lintProfile(broken).map(x => x.code));
  assert.ok(codes.has("PROFILE-007")); assert.ok(codes.has("PROFILE-016"));
});

test("valid fixture has no lint errors", () => {
  const findings = lintEstate(graphAt("valid"), { now: new Date("2026-08-23") });
  assert.deepEqual(findings.filter(x => x.severity === "error"), []);
});

test("invalid fixture exercises core and project rules", () => {
  const findings = lintEstate(graphAt("invalid"), { now: new Date("2026-08-23") });
  const codes = new Set(findings.map(x => x.code));
  for (const code of ["CORE-REF-001", "CORE-EDGE-001", "PROJECT-IMPL-002"]) assert.ok(codes.has(code), code);
});

test("two-way baseline rejects new findings and stale waivers", () => {
  const findings = lintEstate(graphAt("invalid"), { now: new Date("2026-08-23") });
  const empty = compareBaseline(findings, []);
  assert.ok(empty.newFindings.length > 0);
  const exact = findings.filter(x => x.severity === "error").map(x => ({ identity: findingIdentity(x) }));
  const clean = compareBaseline(findings, exact);
  assert.equal(clean.newFindings.length, 0); assert.equal(clean.staleWaivers.length, 0);
  const stale = compareBaseline([], exact);
  assert.equal(stale.staleWaivers.length, exact.length);
});

test("generic reports run from profile configuration", () => {
  const graph = graphAt("valid");
  const findings = lintEstate(graph, { now: new Date("2026-08-23") });
  const health = runReport("estate-health", graph, { findings });
  assert.equal(health.summary.artifacts, 4); assert.equal(health.summary.errors, 0);
  const ladder = runReport("scope-ladder", graph, { config: profile.reports.scope_ladder });
  assert.equal(ladder.rows[0].rung, "designed");
  const traceability = runReport("traceability-explorer", graph, { config: profile.reports.traceability });
  assert.equal(traceability.artifacts.length, 4);
  const coverage = runReport("intent-coverage", graph, { seed: "CAP-007" });
  assert.deepEqual(new Set(coverage.kinds), new Set(["requirement", "technical-design"]));
  const assurance = runReport("invariant-blast-radius", graph, { invariant: "INV-export-completeness-001" });
  assert.equal(assurance.validDeclaration, true); assert.equal(assurance.references.length, 1);
});

test("reports do not mutate normalized records", () => {
  const graph = graphAt("valid");
  const before = JSON.stringify(graph.records);
  for (const name of ["structure-explorer", "scope-ladder", "traceability-explorer", "review-freshness", "work-queue"])
    runReport(name, graph, { config: profile.reports[name.replaceAll("-", "_")] });
  assert.equal(JSON.stringify(graph.records), before);
});
