import { dependencyClosure, identity, intentClosure, label } from "./helpers.js";

const summarize = records => records.map(x => ({ id: identity(x), label: label(x), kind: x.kind, subjectRefs: x.subjectRefs, implementationStatus: x.implementationStatus }));

export function intentCoverage(graph, seed, config = {}) {
  const reached = intentClosure(graph, seed);
  const kinds = [...new Set(reached.map(x => x.kind))].sort();
  const expectedKinds = config.expected_kinds ?? [];
  return { report: "intent-coverage", seed, reached: summarize(reached), kinds, missingKinds: expectedKinds.filter(x => !kinds.includes(x)) };
}

export function dependencyImpact(graph, seed) {
  return { report: "dependency-impact", seed, consumers: summarize(dependencyClosure(graph, seed)) };
}

export function invariantBlastRadius(graph, invariant) {
  const declarations = graph.indexes.invariantDeclarations.get(invariant) ?? [];
  const references = graph.indexes.invariantReferences.get(invariant) ?? [];
  return { report: "invariant-blast-radius", invariant, validDeclaration: declarations.length === 1, declarations: summarize(declarations), references: summarize(references) };
}
