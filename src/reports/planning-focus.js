import { identity, label, subjectArtifacts, subjects } from "./helpers.js";

const directImplementers = (graph, artifact) => {
  const out = new Map();
  for (const id of artifact.ids) for (const candidate of graph.indexes.inverseRealizesByReference.get(id) ?? [])
    out.set(candidate.sourceId, candidate);
  return [...out.values()];
};

const lineage = (graph, subject) => {
  const out = [], seen = new Set(), queue = [subject];
  while (queue.length) {
    const current = queue.shift();
    if (seen.has(current.sourceId)) continue;
    seen.add(current.sourceId); out.push(current);
    for (const reference of current.parentRefs) {
      const parent = graph.resolve(reference).target;
      if (parent) queue.push(parent);
    }
  }
  return out;
};

const priorityOf = (graph, subject, rules = []) => {
  const ancestors = lineage(graph, subject);
  for (const rule of rules) {
    const ids = new Set(ancestors.flatMap(item => item.ids));
    if (rule.ancestor_ids?.some(id => ids.has(id))) return rule.id;
    if (rule.collections?.some(collection => ancestors.some(item => item.collection === collection))) return rule.id;
    if (rule.default === true) return rule.id;
  }
  return null;
};

export function planningFocus(graph, config = graph.profile.reports.planning_focus ?? {}) {
  const chainKinds = new Set(config.chain_kinds ?? []);
  const untracedKinds = new Set(config.untraced_kinds ?? config.chain_kinds ?? []);
  const expected = config.expected_implementers ?? {};
  const weights = { untraced: 3, missing_predecessor: 2, missing_implementer: 1, ...(config.weights ?? {}) };
  const predecessor = config.predecessor_check;
  const rows = subjects(graph).map(subject => {
    const artifacts = subjectArtifacts(graph, subject, { includeDescendants: false });
    const chain = artifacts.filter(item => chainKinds.has(item.kind));
    const untraced = chain.filter(item => untracedKinds.has(item.kind) && !item.realizesRefs.length);
    const missingPredecessor = predecessor ? artifacts.filter(item => item.kind === predecessor.source_kind
      && !directImplementers(graph, item).some(candidate => candidate.kind === predecessor.implementer_kind)) : [];
    const missingImplementers = [];
    for (const artifact of artifacts) {
      const actual = new Set(directImplementers(graph, artifact).map(item => item.kind));
      for (const kind of expected[artifact.kind] ?? []) if (!actual.has(kind))
        missingImplementers.push({ artifactId: identity(artifact), artifact: label(artifact), expectedKind: kind });
    }
    return {
      subjectId: identity(subject), subject: label(subject), subjectPath: subject.path,
      collection: subject.collection, priority: priorityOf(graph, subject, config.priority_rules),
      docs: chain.length,
      untraced: untraced.map(item => identity(item)),
      missingPredecessor: missingPredecessor.map(item => identity(item)),
      missingImplementers,
      score: weights.untraced * untraced.length + weights.missing_predecessor * missingPredecessor.length
        + weights.missing_implementer * missingImplementers.length
    };
  });
  return { report: "planning-focus", formula: { weights }, rows };
}
