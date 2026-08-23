import fs from "node:fs";
import { findingIdentity } from "../model.js";

export function readBaseline(path) {
  if (!path || !fs.existsSync(path)) return [];
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

export function compareBaseline(findings, baseline) {
  const current = new Map(findings.filter(x => x.severity === "error").map(x => [findingIdentity(x), x]));
  const known = new Map(baseline.map(x => [x.identity ?? findingIdentity(x), x]));
  return {
    newFindings: [...current].filter(([key]) => !known.has(key)).map(([, value]) => value),
    waived: [...current].filter(([key]) => known.has(key)).map(([, value]) => value),
    staleWaivers: [...known].filter(([key]) => !current.has(key)).map(([, value]) => value)
  };
}

export function writeBaseline(path, findings) {
  const values = findings.filter(x => x.severity === "error").map(x => ({
    identity: findingIdentity(x), code: x.code, sourceIds: x.sourceIds, detail: x.detail, message: x.message
  })).sort((a, b) => a.identity.localeCompare(b.identity));
  fs.writeFileSync(path, JSON.stringify(values, null, 2) + "\n");
  return values;
}
