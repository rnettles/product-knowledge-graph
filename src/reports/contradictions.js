import { identity, label, subjects } from "./helpers.js";

export function contradictions(graph, config = {}) {
  const rows = [];
  const claim = config.implementation_claim ?? {};
  for (const record of graph.records) {
    if ((claim.statuses ?? []).includes(record.implementationStatus) && Number(record.source.__fileSize ?? 0) < Number(claim.minimum_bytes ?? 0)) {
      rows.push({type: "implementation-claim-stub", id: identity(record), label: label(record), path: record.path,
        detail: `${record.implementationStatus} · ${record.source.__fileSize ?? 0}b`});
    }
    for (const reference of record.realizesRefs) if (!graph.resolve(reference).target) {
      rows.push({type: "unresolved-realization", id: identity(record), label: label(record), path: record.path, detail: reference});
    }
  }
  const subjectRule = config.populated_subject_stub ?? {};
  for (const subject of subjects(graph)) {
    const count = (graph.indexes.ownedBySubject.get(subject.sourceId) ?? []).length;
    if (count >= Number(subjectRule.minimum_artifacts ?? Infinity) && Number(subject.source.__fileSize ?? 0) < Number(subjectRule.minimum_bytes ?? 0)) {
      rows.push({type: "populated-subject-stub", id: identity(subject), label: label(subject), path: subject.path,
        detail: `${count} docs · index ${subject.source.__fileSize ?? 0}b`});
    }
  }
  rows.sort((a, b) => a.path.localeCompare(b.path) || a.type.localeCompare(b.type));
  return {report: "contradictions", rows};
}
