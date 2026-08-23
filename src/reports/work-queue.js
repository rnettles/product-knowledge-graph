import { scopeLadder } from "./scope-ladder.js";

export function workQueue(graph, config = graph.profile.reports.work_queue ?? {}) {
  const ladder = scopeLadder(graph, graph.profile.reports.scope_ladder ?? {});
  const weights = config.weights ?? {};
  const rows = ladder.rows.map(row => ({
    ...row,
    score: Number(weights[row.rung] ?? 0) + (row.artifactCount ? 0 : Number(config.unstarted_bonus ?? 0)),
    class: "assessment",
    severity: "metric"
  })).sort((a, b) => b.score - a.score || a.subject.localeCompare(b.subject));
  return { report: "work-queue", formula: { weights, unstarted_bonus: config.unstarted_bonus ?? 0 }, rows };
}
