export function estateHealth(graph, findings = []) {
  const errors = findings.filter(x => x.severity === "error");
  const diagnostics = findings.filter(x => x.severity === "diagnostic");
  return {
    report: "estate-health",
    summary: {
      artifacts: graph.records.length,
      identities: graph.byId.size,
      subjects: graph.records.filter(x => x.kind === (graph.profile.profile.node_kind ?? "node")).length,
      errors: errors.length,
      diagnostics: diagnostics.length,
      contradictions: findings.filter(x => x.class === "contradiction").length,
      absences: findings.filter(x => x.class === "absence").length,
      inferences: findings.filter(x => x.class === "inference").length,
      assessments: findings.filter(x => x.class === "assessment").length
    },
    findings
  };
}
