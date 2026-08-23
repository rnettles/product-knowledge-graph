import { scopeLadder } from "./scope-ladder.js";

export function workQueue(graph, config = graph.profile.reports.work_queue ?? {}) {
  const ladder = scopeLadder(graph, graph.profile.reports.scope_ladder ?? {});
  const weights = config.weights ?? {};
  const rungOrder = new Map(ladder.rungs.map((rung, index) => [rung.id, index]));
  const rows = ladder.rows.filter(row => config.include_unstarted !== false || row.artifactCount > 0).map(row => ({
    ...row,
    under: row.under,
    score: Number(weights[row.rung] ?? 0) + (row.artifactCount ? 0 : Number(config.unstarted_bonus ?? 0)),
    class: "assessment",
    severity: "metric"
  })).sort((a, b) => config.sort === "rung-location-docs"
    ? (rungOrder.get(a.rung) ?? 0) - (rungOrder.get(b.rung) ?? 0) || a.under.localeCompare(b.under) || b.artifactCount - a.artifactCount || a.subject.localeCompare(b.subject)
    : b.score - a.score || a.subject.localeCompare(b.subject));
  return { report: "work-queue", formula: { weights, unstarted_bonus: config.unstarted_bonus ?? 0 }, rows };
}
