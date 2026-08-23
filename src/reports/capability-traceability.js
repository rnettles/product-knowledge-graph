import { intentClosure, label } from "./helpers.js";

export function capabilityTraceability(graph, config = {}) {
  const pattern = new RegExp(config.identity_pattern ?? "^CAP-[0-9]+", "i");
  const expected = config.expected_kinds ?? [];
  const rows = [];
  for (const record of graph.records) for (const id of record.ids.filter(value => pattern.test(value))) {
    const reached = intentClosure(graph, id);
    const kinds = [...new Set(reached.map(value => value.kind).filter(Boolean))].sort();
    rows.push({capability: id, registerId: record.ids[0], register: label(record), tracedArtifacts: reached.length,
      kinds, missingKinds: expected.filter(kind => !kinds.includes(kind))});
  }
  rows.sort((a, b) => a.capability.localeCompare(b.capability, undefined, {numeric: true}));
  return {report: "capability-traceability", expectedKinds: expected, rows};
}
