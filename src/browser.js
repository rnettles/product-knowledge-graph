import YAML from "yaml";
export { compileProfile, lintProfile } from "./profile.js";
export { normalizeRecord, normalizeRecords } from "./normalize.js";
export { buildGraph, closure, detectCycles } from "./graph.js";
export { lintCore, lintProject, lintDiagnostics } from "./lint/rules.js";
export { runReport, REPORTS } from "./reports/index.js";
export { renderObsidian } from "./renderers/obsidian.js";
export { dataviewAdapter, dataviewPages } from "./adapters/dataview.js";

export function parseProfileYaml(source) { return YAML.parse(source); }

import { lintCore, lintProject, lintDiagnostics } from "./lint/rules.js";
export function lintEstate(graph, options = {}) {
  return [...lintCore(graph), ...lintProject(graph), ...(options.diagnostics === false ? [] : lintDiagnostics(graph, options.now ?? new Date()))];
}
