import { identity, label } from "./helpers.js";

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
  return { report: "traceability-explorer", expectedChildren: expected, artifacts };
}
