import { finding, list } from "./model.js";

const versionParts = value => String(value ?? "0.0.0").split(".").map(part => Number.parseInt(part, 10) || 0);
const compareVersions = (a, b) => { const left = versionParts(a), right = versionParts(b); for (let i = 0; i < 3; i++) if (left[i] !== right[i]) return left[i] - right[i]; return 0; };
const supports = (range, version) => String(range).split(/\s+/).filter(Boolean).every(term => {
  const match = term.match(/^(>=|<=|>|<|=|\^|~)?(\d+\.\d+\.\d+)$/); if (!match) return false;
  const [, op = "=", target] = match; const cmp = compareVersions(version, target);
  if (op === ">=") return cmp >= 0; if (op === "<=") return cmp <= 0; if (op === ">") return cmp > 0; if (op === "<") return cmp < 0;
  if (op === "^") return versionParts(version)[0] === versionParts(target)[0] && cmp >= 0;
  if (op === "~") return versionParts(version).slice(0, 2).join(".") === versionParts(target).slice(0, 2).join(".") && cmp >= 0;
  return cmp === 0;
});

export function lintProfile(profile) {
  const out = [];
  const issue = (code, message, detail = message) => out.push(finding(code, "error", "contradiction", message, { sourceIds: ["<profile>"], detail }));
  if (!profile || typeof profile !== "object") return [finding("PROFILE-000", "error", "contradiction", "Profile is not an object", { sourceIds: ["<profile>"] })];
  if (!profile.profile) issue("PROFILE-001", "Profile has no name");
  if (!profile.version) issue("PROFILE-002", "Profile has no version");
  if (!profile.compatible_core) issue("PROFILE-003", "Profile has no compatible_core range");
  if (profile.compatible_core && !supports(profile.compatible_core, profile.core_version ?? "1.0.0")) issue("PROFILE-014", `Profile does not support declared core ${profile.core_version ?? "1.0.0"}`);
  if (profile.namespace?.prefix !== "pkg_") issue("PROFILE-004", "Profile must reserve the pkg_ namespace");
  const kinds = new Set(Object.keys(profile.artifact_kinds ?? {}));
  if (!kinds.size) issue("PROFILE-005", "Profile defines no artifact kinds");
  for (const [source, targets] of Object.entries(profile.realization_pairs ?? {})) {
    if (!kinds.has(source)) issue("PROFILE-006", `Realization source kind is undefined: ${source}`);
    for (const target of list(targets)) if (!kinds.has(target)) issue("PROFILE-007", `Realization target kind is undefined: ${target}`);
  }
  for (const [name, binding] of Object.entries(profile.host_bindings ?? {})) {
    const spec = typeof binding === "string" ? { property: binding, equivalence: "exact" } : binding;
    if (!spec?.property) issue("PROFILE-008", `Host binding ${name} has no property`);
    if (spec?.equivalence !== "exact") issue("PROFILE-009", `Host binding ${name} must be exact, got ${spec?.equivalence ?? "missing"}`);
  }
  for (const [name, extension] of Object.entries(profile.extensions ?? {})) {
    if (!name.startsWith("pkg_")) issue("PROFILE-010", `Graph extension is outside pkg_ namespace: ${name}`);
    if (!extension?.type || !extension?.consumer) issue("PROFILE-011", `Extension ${name} requires type and consumer`);
  }
  for (const [name, facet] of Object.entries(profile.facets ?? {})) {
    if (!facet?.cardinality) issue("PROFILE-012", `Facet ${name} has no cardinality`);
  }
  for (const [reportName, report] of Object.entries(profile.reports ?? {})) {
    for (const rung of report?.rungs ?? []) {
      for (const kind of list(rung.evidence?.kind_any)) if (!kinds.has(kind)) issue("PROFILE-013", `Report ${reportName} rung ${rung.id} references undefined kind ${kind}`);
    }
    for (const [kind, children] of Object.entries(report?.expected_children ?? {})) {
      if (!kinds.has(kind)) issue("PROFILE-015", `Report ${reportName} expects children for undefined kind ${kind}`);
      for (const child of list(children)) if (!kinds.has(child)) issue("PROFILE-016", `Report ${reportName} expects undefined child kind ${child}`);
    }
  }
  return out;
}

export function compileProfile(profile) {
  const findings = lintProfile(profile);
  if (findings.some(item => item.severity === "error")) return { profile, findings, valid: false };
  const binding = role => {
    const value = profile.host_bindings?.[role];
    return typeof value === "string" ? value : value?.property;
  };
  return {
    valid: true, findings: [], profile,
    coreVersion: profile.core_version ?? "1.0.0",
    name: profile.profile,
    version: profile.version,
    binding,
    kinds: new Set(Object.keys(profile.artifact_kinds ?? {})),
    authorityStatuses: new Set(Object.keys(profile.authority_statuses ?? {})),
    collections: new Set(Object.keys(profile.collections ?? {})),
    realizationPairs: new Map(Object.entries(profile.realization_pairs ?? {}).map(([k, v]) => [k, new Set(list(v))])),
    implementationStatuses: new Set(profile.implementation?.statuses ?? []),
    sourceRequiredFor: new Set(profile.implementation?.source_required_for ?? []),
    facets: profile.facets ?? {},
    reports: profile.reports ?? {},
    projection: profile.projection,
    invariantPattern: profile.invariants?.id_pattern ? new RegExp(profile.invariants.id_pattern) : null
  };
}
