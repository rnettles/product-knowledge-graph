export * from "./estate-health.js";
export * from "./structure-explorer.js";
export * from "./scope-ladder.js";
export * from "./traceability-explorer.js";
export * from "./coverage.js";
export * from "./review-freshness.js";
export * from "./work-queue.js";
export * from "./capability-traceability.js";

import { estateHealth } from "./estate-health.js";
import { structureExplorer } from "./structure-explorer.js";
import { scopeLadder } from "./scope-ladder.js";
import { traceabilityExplorer } from "./traceability-explorer.js";
import { intentCoverage, dependencyImpact, invariantBlastRadius } from "./coverage.js";
import { reviewFreshness } from "./review-freshness.js";
import { workQueue } from "./work-queue.js";
import { capabilityTraceability } from "./capability-traceability.js";

export const REPORTS = {
  "estate-health": (g, o) => estateHealth(g, o.findings ?? []),
  "structure-explorer": g => structureExplorer(g),
  "scope-ladder": (g, o) => scopeLadder(g, o.config),
  "traceability-explorer": (g, o) => traceabilityExplorer(g, o.config),
  "intent-coverage": (g, o) => intentCoverage(g, o.seed, o.config),
  "dependency-impact": (g, o) => dependencyImpact(g, o.seed),
  "invariant-blast-radius": (g, o) => invariantBlastRadius(g, o.invariant),
  "review-freshness": (g, o) => reviewFreshness(g, o.now),
  "work-queue": (g, o) => workQueue(g, o.config),
  "capability-traceability": (g, o) => capabilityTraceability(g, o.config)
};

export function runReport(name, graph, options = {}) {
  const report = REPORTS[name];
  if (!report) throw new Error(`Unknown report ${name}. Available: ${Object.keys(REPORTS).join(", ")}`);
  return report(graph, options);
}
