import { evaluateEvidence, identity, label, subjectArtifacts, subjects } from "./helpers.js";

export function scopeLadder(graph, config = graph.profile.reports.scope_ladder ?? {}) {
  const rungs = config.rungs ?? [];
  const rows = subjects(graph).map(subject => {
    const artifacts = subjectArtifacts(graph, subject, { includeDescendants: config.include_descendants !== false });
    let selected = rungs[0] ?? { id: "unconfigured", label: "Unconfigured" };
    for (const rung of rungs) if (evaluateEvidence(rung.evidence, artifacts)) selected = rung;
    return {
      subjectId: identity(subject), subject: label(subject), subjectPath: subject.path,
      under: subject.path ? subject.path.split("/").slice(0, -2).join("/") : "", collection: subject.collection,
      rung: selected.id, stage: selected.label ?? selected.id,
      artifactCount: artifacts.length,
      kinds: [...new Set(artifacts.map(x => x.kind))].sort(),
      traced: artifacts.filter(x => x.realizesRefs.length).length,
      nextAction: selected.next_action ?? null,
      evidence: selected.evidence ?? {}
    };
  });
  const tally = Object.fromEntries(rungs.map(rung => [rung.id, rows.filter(row => row.rung === rung.id).length]));
  return { report: "scope-ladder", configured: Boolean(rungs.length), includeDescendants: config.include_descendants !== false, rungs, tally, rows };
}
