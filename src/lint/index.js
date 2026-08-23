export * from "./rules.js";
export * from "./baseline.js";

import { lintCore, lintProject, lintDiagnostics } from "./rules.js";

export function lintEstate(graph, options = {}) {
  return [
    ...lintCore(graph),
    ...lintProject(graph),
    ...(options.diagnostics === false ? [] : lintDiagnostics(graph, options.now ?? new Date()))
  ];
}
