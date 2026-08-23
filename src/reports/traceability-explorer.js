import { identity, label } from "./helpers.js";

const inferredPlacements = (graph, config) => {
  const inference = config.inferred_parent;
  if (!inference?.identity_pattern) return [];
  const pattern = new RegExp(inference.identity_pattern, inference.identity_flags ?? "g");
  const key = record => {
    const source = [record.path?.split("/").pop()?.replace(/\.md$/, ""), ...record.ids].join(" ").replaceAll("_", "-");
    const matches = [...source.matchAll(pattern)].map(match => match.groups?.key ?? match[1] ?? match[0]);
    return [...new Set(matches)].join("|");
  };
  const ranks = inference.stage_ranks ?? {};
  const rows = [];
  for (const record of graph.records) {
    const expectedKind = inference.expected_parent_by_kind?.[record.kind];
    if (!expectedKind) continue;
    const rank = ranks[record.kind] ?? 0;
    const resolvedTargets = record.realizesRefs.map(ref => graph.resolve(ref).target).filter(Boolean);
    if (resolvedTargets.some(target => (ranks[target.kind] ?? 0) < rank)) continue;
    const identityKey = key(record);
    const candidates = graph.records.filter(candidate => candidate !== record && candidate.kind === expectedKind
      && identityKey && key(candidate) === identityKey);
    if (candidates.length !== 1) continue;
    rows.push({artifactId: identity(record), artifactPath: record.path, inferredParentId: identity(candidates[0]),
      inferredParentPath: candidates[0].path, expectedKind, identityKey,
      class: "inference", authority: "display-only", provenance: "configured-identity-key"});
  }
  return rows.sort((a, b) => a.artifactPath.localeCompare(b.artifactPath));
};

export function traceabilityExplorer(graph, config = graph.profile.reports.traceability ?? {}) {
  const expected = config.expected_children ?? {};
  const artifacts = graph.records.map(record => {
    const realizers = graph.indexes.inverseRealizes.get(record.sourceId) ?? [];
    const dependencies = record.dependencyRefs.map(ref => graph.resolve(ref).target).filter(Boolean);
    const expectedKinds = expected[record.kind] ?? [];
    const missingKinds = expectedKinds.filter(kind => !realizers.some(child => child.kind === kind));
    return {
      id: identity(record), label: label(record), kind: record.kind,
      subjectRefs: record.subjectRefs,
      realizes: record.realizesRefs,
      realizedBy: realizers.map(x => ({ id: identity(x), label: label(x), kind: x.kind })),
      dependencies: dependencies.map(x => ({ id: identity(x), label: label(x), kind: x.kind })),
      missingExpectedKinds: missingKinds.map(kind => ({ kind, class: "absence", authority: "planning-candidate" })),
      invariantsDeclared: record.invariantsDeclared,
      invariantsReferenced: record.invariantsReferenced
    };
  });
  return { report: "traceability-explorer", expectedChildren: expected,
    inferredPlacements: inferredPlacements(graph, config), artifacts };
}
