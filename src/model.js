export const CLASSES = new Set(["contradiction", "absence", "inference", "assessment"]);
export const SEVERITIES = new Set(["error", "diagnostic", "metric"]);

export function finding(code, severity, klass, message, details = {}) {
  if (!SEVERITIES.has(severity)) throw new Error(`Unknown finding severity: ${severity}`);
  if (!CLASSES.has(klass)) throw new Error(`Unknown finding class: ${klass}`);
  return {
    code, severity, class: klass, message,
    artifactIds: details.artifactIds ?? [],
    sourceIds: details.sourceIds ?? [],
    evidence: details.evidence ?? [],
    suggestedRepair: details.suggestedRepair,
    detail: details.detail ?? ""
  };
}

export function list(value) {
  if (value == null || value === "") return [];
  return Array.isArray(value) ? value.filter(v => v != null && v !== "") : [value];
}

export function text(value) {
  if (value == null) return "";
  if (typeof value === "object") return String(value.display ?? value.path ?? value.value ?? "").trim();
  return String(value).replace(/^\[\[/, "").replace(/\]\]$/, "").split("|")[0].trim();
}

export function findingIdentity(value) {
  return [value.code, [...value.sourceIds].sort().join(","), value.detail || value.message].join("\u0000");
}
