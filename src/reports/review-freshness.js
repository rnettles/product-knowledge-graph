import { identity, label } from "./helpers.js";

export function reviewFreshness(graph, now = new Date()) {
  const rows = graph.records.map(record => ({
    id: identity(record), label: label(record), reviewAfter: record.reviewAfter,
    state: !record.reviewAfter ? "unscheduled" : new Date(record.reviewAfter) < now ? "overdue" : "current"
  }));
  return { report: "review-freshness", asOf: now.toISOString(), rows, tally: {
    current: rows.filter(x => x.state === "current").length,
    overdue: rows.filter(x => x.state === "overdue").length,
    unscheduled: rows.filter(x => x.state === "unscheduled").length
  }};
}
