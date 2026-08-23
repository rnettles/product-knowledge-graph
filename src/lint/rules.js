import { detectCycles } from "../graph.js";
import { finding } from "../model.js";

const ids = record => record.ids.length ? record.ids : [record.sourceId];
const item = (code, message, record, detail = message, severity = "error", klass = "contradiction") =>
  finding(code, severity, klass, message, { artifactIds: ids(record), sourceIds: [record.sourceId], detail });

export function lintCore(graph) {
  const out = [...graph.findings];
  const { records, resolve } = graph;
  for (const record of records) {
    if (!record.ids.length) out.push(item("CORE-ID-001", "Artifact has no pkg_ids", record, "pkg_ids"));
    if (!record.ids[0]) out.push(item("CORE-ID-003", "Artifact has no canonical identifier", record, "pkg_ids[0]"));
    if (!record.title) out.push(item("CORE-META-001", "Artifact has no bound title", record, "title"));
    if (!record.kind) out.push(item("CORE-META-002", "Artifact has no pkg_artifact_kind", record, "pkg_artifact_kind"));
    if (!record.authorityStatus) out.push(item("CORE-META-003", "Artifact has no pkg_authority_status", record, "pkg_authority_status"));
    if (!record.owner) out.push(item("CORE-META-004", "Artifact has no bound owner", record, "owner"));
    if (!record.lastReviewed) out.push(item("CORE-META-005", "Artifact has no bound review date", record, "last_reviewed"));
    for (const [field, refs] of [["pkg_subject", record.subjectRefs], ["pkg_parent", record.parentRefs], ["pkg_realizes", record.realizesRefs], ["pkg_depends_on", record.dependencyRefs]]) {
      for (const ref of refs) {
        const r = resolve(ref);
        if (!r.target) out.push(item("CORE-REF-001", `${field} target is unresolved: ${ref}`, record, `${field}:${ref}`));
        if (r.target?.sourceId === record.sourceId) out.push(item("CORE-EDGE-001", `${field} contains a self-edge`, record, field));
      }
    }
  }
  for (const [name, refsOf, code] of [
    ["structural", r => r.parentRefs, "CORE-CYCLE-001"],
    ["realization", r => r.realizesRefs, "CORE-CYCLE-002"],
    ["dependency", r => r.dependencyRefs, "CORE-CYCLE-003"]
  ]) for (const cycle of detectCycles(records, refsOf, resolve)) out.push(finding(code, "error", "contradiction", `${name} cycle: ${cycle.map(x => x.ids[0] ?? x.sourceId).join(" -> ")}`, {
    artifactIds: cycle.flatMap(ids), sourceIds: cycle.map(x => x.sourceId), detail: [...new Set(cycle.map(x => x.sourceId))].sort().join("|")
  }));
  for (const [id, declarers] of graph.indexes.invariantDeclarations) if (declarers.length > 1) out.push(finding("CORE-INV-001", "error", "contradiction", `Invariant ${id} has ${declarers.length} declarations`, {
    artifactIds: [id], sourceIds: declarers.map(x => x.sourceId), detail: id
  }));
  for (const [id, references] of graph.indexes.invariantReferences) if ((graph.indexes.invariantDeclarations.get(id) ?? []).length !== 1) out.push(finding("CORE-INV-002", "error", "contradiction", `Referenced invariant ${id} does not resolve to exactly one declaration`, {
    artifactIds: [id], sourceIds: references.map(x => x.sourceId), detail: id
  }));
  return out;
}

export function lintProject(graph) {
  const out = [];
  const p = graph.profile;
  for (const record of graph.records) {
    if (record.kind && !p.kinds.has(record.kind)) out.push(item("PROJECT-KIND-001", `Unknown artifact kind: ${record.kind}`, record, record.kind));
    if (record.authorityStatus && !p.authorityStatuses.has(record.authorityStatus)) out.push(item("PROJECT-STATUS-001", `Unknown authority status: ${record.authorityStatus}`, record, record.authorityStatus));
    if (record.collection && !p.collections.has(record.collection)) out.push(item("PROJECT-PLACE-001", `Unknown collection: ${record.collection}`, record, record.collection));
    if (record.subjectRefs.length && record.collection) out.push(item("PROJECT-PLACE-002", "Artifact carries both pkg_subject and pkg_collection", record, "subject+collection"));
    if (record.parentRefs.length && record.collection) out.push(item("PROJECT-PLACE-003", "Node carries both pkg_parent and pkg_collection", record, "parent+collection"));
    for (const ref of record.realizesRefs) {
      const target = graph.resolve(ref).target;
      if (!target) continue;
      const allowed = p.realizationPairs.get(record.kind);
      if (!allowed?.has(target.kind)) out.push(item("PROJECT-REALIZE-001", `${record.kind} may not realize ${target.kind}`, record, `${record.kind}->${target.kind}`));
    }
    if (record.implementationStatus && !p.implementationStatuses.has(record.implementationStatus)) out.push(item("PROJECT-IMPL-001", `Unknown implementation status: ${record.implementationStatus}`, record, record.implementationStatus));
    if (p.sourceRequiredFor.has(record.implementationStatus) && !record.implementationSources.length) out.push(item("PROJECT-IMPL-002", `${record.implementationStatus} requires pkg_implementation_source`, record, record.implementationStatus));
    const kindSpec = p.profile.artifact_kinds?.[record.kind] ?? {};
    for (const required of kindSpec.required_properties ?? []) if (record.source[required] == null || record.source[required] === "") out.push(item("PROJECT-REQ-001", `${record.kind} requires ${required}`, record, `${record.kind}:${required}`));
    for (const forbidden of kindSpec.forbidden_properties ?? []) if (record.source[forbidden] != null) out.push(item("PROJECT-FORBID-001", `${record.kind} forbids ${forbidden}`, record, `${record.kind}:${forbidden}`));
    for (const [facetName, raw] of Object.entries(record.facets)) {
      const spec = p.facets[facetName];
      if (!spec) { out.push(item("PROJECT-FACET-001", `Unknown facet: ${facetName}`, record, facetName)); continue; }
      const values = Array.isArray(raw) ? raw : [raw];
      if (spec.cardinality === "one" && values.length !== 1) out.push(item("PROJECT-FACET-002", `Facet ${facetName} requires one value`, record, facetName));
      for (const value of values) if (spec.values && !spec.values.includes(value)) out.push(item("PROJECT-FACET-003", `Unknown ${facetName} value: ${value}`, record, `${facetName}:${value}`));
    }
    for (const invariant of [...record.invariantsDeclared, ...record.invariantsReferenced]) if (p.invariantPattern && !p.invariantPattern.test(invariant)) out.push(item("PROJECT-INV-001", `Invalid invariant ID: ${invariant}`, record, invariant));
    const transition = p.profile.authority_statuses?.[record.authorityStatus];
    for (const required of transition?.requires ?? []) if (record.source[required] == null || record.source[required] === "") out.push(item("PROJECT-STATUS-002", `${record.authorityStatus} requires ${required}`, record, `${record.authorityStatus}:${required}`));
    if (p.projection?.path_template && record.path) {
      const expected = p.projection.path_template
        .replaceAll("{collection}", record.collection)
        .replaceAll("{subject}", record.subjectRefs[0] ?? "")
        .replaceAll("{kind}", record.kind)
        .replaceAll("{id}", record.ids[0] ?? "");
      const matches = p.projection.mode === "prefix" ? record.path.startsWith(expected) : record.path === expected;
      if (!matches) out.push(item("PROJECT-PROJECTION-001", `Path does not match projection: expected ${p.projection.mode === "prefix" ? "under " : ""}${expected}`, record, expected));
    }
  }
  return out;
}

export function lintDiagnostics(graph, now = new Date()) {
  const out = [];
  for (const record of graph.records) {
    if (record.reviewAfter && new Date(record.reviewAfter) < now) out.push(item("DIAG-REVIEW-001", `Review overdue since ${record.reviewAfter}`, record, record.reviewAfter, "diagnostic", "assessment"));
    for (const invariant of record.invariantsDeclared) if (!(graph.indexes.invariantReferences.get(invariant) ?? []).length) out.push(item("DIAG-INV-001", `Invariant ${invariant} has no references`, record, invariant, "diagnostic", "absence"));
  }
  return out;
}
