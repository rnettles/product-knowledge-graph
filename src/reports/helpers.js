import { closure } from "../graph.js";

export const identity = record => record.ids[0] ?? record.sourceId;
export const label = record => record.title || identity(record);

export function subjects(graph) {
  const nodeKind = graph.profile.profile.node_kind ?? "node";
  return graph.records.filter(record => record.kind === nodeKind);
}

export function subjectArtifacts(graph, subject) {
  const out = [], seen = new Set();
  const visit = node => {
    for (const artifact of graph.indexes.ownedBySubject.get(node.sourceId) ?? []) if (!seen.has(artifact.sourceId)) { seen.add(artifact.sourceId); out.push(artifact); }
    for (const child of graph.indexes.structuralChildren.get(node.sourceId) ?? []) visit(child);
  };
  visit(subject); return out;
}

export function intentClosure(graph, seed) { return closure(graph, seed, graph.indexes.inverseRealizes); }
export function dependencyClosure(graph, seed) { return closure(graph, seed, graph.indexes.inverseDependsOn); }

export function evaluateEvidence(evidence = {}, artifacts = []) {
  if (evidence.artifact_count != null) {
    const spec = evidence.artifact_count;
    if (typeof spec === "number" && artifacts.length !== spec) return false;
    if (spec.equals != null && artifacts.length !== spec.equals) return false;
    if (spec.greater_than != null && artifacts.length <= spec.greater_than) return false;
  }
  if (evidence.kind_any?.length && !artifacts.some(item => evidence.kind_any.includes(item.kind))) return false;
  if (evidence.kind_all?.length && !evidence.kind_all.every(kind => artifacts.some(item => item.kind === kind))) return false;
  if (evidence.implementation_status?.length && !artifacts.some(item => evidence.implementation_status.includes(item.implementationStatus))) return false;
  return true;
}
