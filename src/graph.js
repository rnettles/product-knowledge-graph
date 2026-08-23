import { finding } from "./model.js";

const add = (map, key, value) => {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
};

export function buildGraph(records, profile) {
  const findings = [];
  const byId = new Map(), claims = new Map();
  for (const record of records) for (const id of record.ids) add(claims, id, record);
  for (const [id, owners] of claims) {
    if (owners.length === 1) byId.set(id, owners[0]);
    else findings.push(finding("CORE-ID-002", "error", "contradiction", `Identifier ${id} is claimed by ${owners.length} artifacts`, {
      artifactIds: [id], sourceIds: owners.map(x => x.sourceId), detail: id
    }));
  }
  const resolve = input => {
    const target = byId.get(input);
    return target ? { input, target, method: target.ids[0] === input ? "canonical-id" : "alternate-id" } : { input };
  };
  const indexes = {
    structuralChildren: new Map(), ownedBySubject: new Map(),
    inverseRealizes: new Map(), inverseRealizesByReference: new Map(), inverseDependsOn: new Map(),
    invariantDeclarations: new Map(), invariantReferences: new Map(),
    byKind: new Map(), byAuthorityStatus: new Map(), byImplementationStatus: new Map(), byFacet: new Map()
  };
  for (const record of records) {
    add(indexes.byKind, record.kind, record);
    add(indexes.byAuthorityStatus, record.authorityStatus, record);
    if (record.implementationStatus) add(indexes.byImplementationStatus, record.implementationStatus, record);
    for (const [facet, raw] of Object.entries(record.facets)) for (const v of Array.isArray(raw) ? raw : [raw]) add(indexes.byFacet, `${facet}:${v}`, record);
    for (const ref of record.parentRefs) { const r = resolve(ref); if (r.target) add(indexes.structuralChildren, r.target.sourceId, record); }
    for (const ref of record.subjectRefs) { const r = resolve(ref); if (r.target) add(indexes.ownedBySubject, r.target.sourceId, record); }
    for (const ref of record.realizesRefs) { const r = resolve(ref); if (r.target) { add(indexes.inverseRealizes, r.target.sourceId, record); add(indexes.inverseRealizesByReference, ref, record); } }
    for (const ref of record.dependencyRefs) { const r = resolve(ref); if (r.target) add(indexes.inverseDependsOn, r.target.sourceId, record); }
    for (const id of record.invariantsDeclared) add(indexes.invariantDeclarations, id, record);
    for (const id of record.invariantsReferenced) add(indexes.invariantReferences, id, record);
  }
  return { records, profile, byId, claims, resolve, indexes, findings };
}

export function closure(graph, seed, inverseIndex) {
  const start = typeof seed === "string" ? graph.resolve(seed).target : seed;
  if (!start) return [];
  const seen = new Set([start.sourceId]), queue = [start], out = [];
  while (queue.length) {
    const current = queue.shift();
    for (const next of inverseIndex.get(current.sourceId) ?? []) {
      if (seen.has(next.sourceId)) continue;
      seen.add(next.sourceId); out.push(next); queue.push(next);
    }
  }
  return out;
}

export function detectCycles(records, refsOf, resolve) {
  const cycles = [];
  const done = new Set();
  const visit = (record, stack = []) => {
    const at = stack.findIndex(item => item.sourceId === record.sourceId);
    if (at >= 0) { cycles.push([...stack.slice(at), record]); return; }
    if (done.has(record.sourceId)) return;
    for (const ref of refsOf(record)) { const target = resolve(ref).target; if (target) visit(target, [...stack, record]); }
    done.add(record.sourceId);
  };
  for (const record of records) visit(record);
  const unique = new Map();
  for (const cycle of cycles) unique.set([...new Set(cycle.map(x => x.sourceId))].sort().join("|"), cycle);
  return [...unique.values()];
}
