import { identity, label, subjects } from "./helpers.js";

export function structureExplorer(graph) {
  const nodeSet = new Set(subjects(graph).map(x => x.sourceId));
  const childIds = new Set([...graph.indexes.structuralChildren.values()].flat().map(x => x.sourceId));
  const roots = subjects(graph).filter(x => !childIds.has(x.sourceId));
  const node = (record, trail = new Set()) => {
    if (trail.has(record.sourceId)) return { id: identity(record), label: label(record), cycle: true };
    const next = new Set([...trail, record.sourceId]);
    return {
      id: identity(record), label: label(record), collection: record.collection,
      artifacts: (graph.indexes.ownedBySubject.get(record.sourceId) ?? []).map(x => ({ id: identity(x), label: label(x), kind: x.kind })),
      children: (graph.indexes.structuralChildren.get(record.sourceId) ?? []).filter(x => nodeSet.has(x.sourceId)).map(x => node(x, next))
    };
  };
  const owned = new Set([...graph.indexes.ownedBySubject.values()].flat().map(x => x.sourceId));
  return {
    report: "structure-explorer",
    roots: roots.map(root => node(root)),
    unowned: graph.records.filter(x => !nodeSet.has(x.sourceId) && !owned.has(x.sourceId) && !x.collection).map(x => ({ id: identity(x), label: label(x), kind: x.kind }))
  };
}
