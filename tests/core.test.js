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
import { lintSourcePolicies } from "../src/lint/source-rules.js";
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
  for (const name of ["structure-explorer", "scope-ladder", "traceability-explorer", "review-freshness", "work-queue", "planning-focus"])
    runReport(name, graph, { config: profile.reports[name.replaceAll("-", "_")] });
  assert.equal(JSON.stringify(graph.records), before);
});

test("planning focus derives missing stages and project-configured priority", () => {
  const graph = graphAt("valid");
  const report = runReport("planning-focus", graph, {config: {
    chain_kinds: ["requirement", "technical-design"],
    predecessor_check: {source_kind: "requirement", implementer_kind: "technical-design"},
    expected_implementers: {requirement: ["technical-design", "capability"]},
    priority_rules: [{id: "P1", ancestor_ids: ["SUBJ-account"]}]
  }});
  assert.equal(report.rows[0].priority, "P1");
  assert.equal(report.rows[0].missingImplementers.length, 1);
  assert.equal(report.rows[0].score, 1);
});

test("declarative source policies cover YAML, projection, collision, surface, body references, and structural indexes", () => {
  const raw = structuredClone(profile.profile);
  raw.artifact_kinds.node.surface = "product";
  raw.artifact_kinds["technical-design"].surface = "engineering";
  raw.artifact_kinds["technical-design"].bucket = "tdn";
  raw.collections.product.label = "01 Product";
  raw.source_policies = {
    portable_yaml_subset: true,
    projection: {node_filename: "index.md", forbid_properties_by_surface: {engineering: ["outlineId"]}},
    body_identity_references: [{pattern: "ADR-[A-Z]+-[0-9]{3}", flags: "g"}],
    structural_indexes: {filename: "index.md", legacy_kind_property: "doc_kind", always_structural_surfaces: ["engineering"]}
  };
  const compiled = compileProfile(raw);
  const sources = [
    {sourceId: "product/01 Product/Subject/index.md", path: "product/01 Product/Subject/index.md", pkg_ids: ["Subject"], pkg_artifact_kind: "node", pkg_authority_status: "active", pkg_collection: "product", title: "Subject", owner: "Owner", last_verified: "2026-08-23", __frontmatterRaw: "pkg_ids:\n  - Subject", __body: ""},
    {sourceId: "wrong/a.md", path: "wrong/a.md", pkg_ids: ["TD-1"], pkg_artifact_kind: "technical-design", pkg_authority_status: "active", pkg_subject: ["Subject"], title: "A", owner: "Owner", last_verified: "2026-08-23", outlineId: "forbidden", __frontmatterRaw: "aliases:\n  - ADR-X: unsafe", __body: "ADR-MISSING-001"},
    {sourceId: "engineering/01 Product/Subject/tdn/group/a.md", path: "engineering/01 Product/Subject/tdn/group/a.md", pkg_ids: ["TD-2"], pkg_artifact_kind: "technical-design", pkg_authority_status: "active", pkg_subject: ["Subject"], title: "B", owner: "Owner", last_verified: "2026-08-23", __frontmatterRaw: "pkg_ids:\n  - TD-2", __body: ""},
    {sourceId: "product/01 Product/Ghost/index.md", path: "product/01 Product/Ghost/index.md", title: "Ghost", __frontmatterRaw: "title: Ghost", __body: ""}
  ];
  const graph = buildGraph(normalizeRecords(sources.slice(0, 3), compiled), compiled);
  const codes = new Set(lintSourcePolicies(sources, graph).map(x => x.code));
  for (const code of ["SOURCE-YAML-001", "SOURCE-PROJECTION-001", "SOURCE-PROJECTION-002", "SOURCE-SURFACE-001", "SOURCE-BODY-REF-001", "SOURCE-STRUCTURE-001"])
    assert.ok(codes.has(code), code);
});

test("capability closure preserves alternate-identity edge granularity", () => {
  const sources = [
    {sourceId: "register", title: "Register", pkg_ids: ["REGISTER", "CAP-1", "CAP-2"], pkg_artifact_kind: "capability", pkg_authority_status: "active", owner: "Owner", last_verified: "2026-08-23"},
    {sourceId: "one", title: "One", pkg_ids: ["REQ-1"], pkg_artifact_kind: "requirement", pkg_authority_status: "active", pkg_realizes: ["CAP-1"], owner: "Owner", last_verified: "2026-08-23"},
    {sourceId: "two", title: "Two", pkg_ids: ["REQ-2"], pkg_artifact_kind: "requirement", pkg_authority_status: "active", pkg_realizes: ["CAP-2"], owner: "Owner", last_verified: "2026-08-23"}
  ];
  const graph = buildGraph(normalizeRecords(sources, profile), profile);
  const report = runReport("capability-traceability", graph, {config: {identity_pattern: "^CAP-"}});
  assert.deepEqual(report.rows.map(row => [row.capability, row.tracedArtifacts]), [["CAP-1", 1], ["CAP-2", 1]]);
});
