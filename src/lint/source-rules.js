import path from "node:path";
import { finding, list, text } from "../model.js";

const issue = (code, message, source, detail = message) => finding(code, "error", "contradiction", message, {
  artifactIds: list(source.pkg_ids).map(text).filter(Boolean), sourceIds: [source.sourceId ?? source.path], detail
});
const wiki = value => String(value ?? "").replace(/^\[\[(.*?)\]\]$/, "$1");

function portableYamlProblems(raw = "") {
  const problems = [];
  let key = null;
  for (const line of raw.split("\n")) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item) {
      if (!key) { problems.push(`list item with no key: ${line.trim()}`); continue; }
      const value = item[1].trim();
      const quoted = /^(?:".*"|'.*')$/.test(value);
      if (!quoted && /:(\s|$)/.test(value)) problems.push(`${key}: list item reads as a mapping, not a string`);
      if (!quoted && /^[`@!&*|>%{}[\],?]/.test(value)) problems.push(`${key}: list item starts with a YAML indicator`);
      if (!quoted && /^-?\d+(?:\.\d+)?$/.test(value)) problems.push(`${key}: list item reads as a number, not a string`);
      continue;
    }
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!match) problems.push(`unsupported YAML: ${line.trim()}`); else key = match[1];
  }
  return problems;
}

const firstId = record => record.ids[0] ?? record.sourceId;
function ancestry(record, graph) {
  const chain = [record], seen = new Set([record.sourceId]);
  let current = record;
  while (current.parentRefs.length) {
    const parent = graph.resolve(current.parentRefs[0]).target;
    if (!parent || seen.has(parent.sourceId)) return null;
    chain.unshift(parent); seen.add(parent.sourceId); current = parent;
  }
  return chain;
}

export function lintSourcePolicies(sources, graph) {
  const out = [];
  const policy = graph.profile.profile.source_policies ?? {};
  const byPath = new Map(graph.records.map(record => [record.path, record]));
  if (policy.portable_yaml_subset) for (const source of sources) {
    for (const problem of [...(source.__parseProblems ?? []), ...portableYamlProblems(source.__frontmatterRaw)]) {
      out.push(issue("SOURCE-YAML-001", problem, source, problem));
    }
  }
  const projection = policy.projection;
  if (projection) {
    const projected = new Map();
    for (const record of graph.records) {
      if (list(projection.retained_paths).some(prefix => record.path === prefix || record.path.startsWith(prefix))) continue;
      const kind = graph.profile.profile.artifact_kinds?.[record.kind] ?? {};
      if (kind.surface && projection.forbid_properties_by_surface?.[kind.surface]) for (const property of projection.forbid_properties_by_surface[kind.surface]) {
        if (record.source[property] != null) out.push(issue("SOURCE-SURFACE-001", `${property} is forbidden on ${kind.surface}`, record.source, property));
      }
      let expected = null;
      if (record.kind === graph.profile.profile.node_kind) {
        const chain = ancestry(record, graph);
        const collection = chain?.[0]?.collection;
        const label = graph.profile.profile.collections?.[collection]?.label;
        if (chain && label) expected = [kind.surface, label, ...chain.map(firstId), projection.node_filename].filter(Boolean).join("/");
      } else {
        let collection = record.collection, subjects = [];
        if (record.subjectRefs.length) {
          const subject = graph.resolve(record.subjectRefs[0]).target;
          const chain = subject && ancestry(subject, graph);
          if (chain) { collection = chain[0].collection; subjects = chain.map(firstId); }
        }
        const label = graph.profile.profile.collections?.[collection]?.label;
        if (kind.surface && label) expected = [kind.surface, label, ...subjects, kind.bucket, path.posix.basename(record.path)].filter(Boolean).join("/");
      }
      if (!expected) continue;
      const expectedDir = path.posix.dirname(expected), actualDir = path.posix.dirname(record.path);
      const node = record.kind === graph.profile.profile.node_kind;
      const matches = node ? record.path === expected : actualDir === expectedDir || actualDir.startsWith(expectedDir + "/");
      if (!matches) out.push(issue("SOURCE-PROJECTION-001", `Path does not match projection: expected ${node ? expected : `under ${expectedDir}/`}`, record.source, expected));
      const collisionKey = node ? expected : path.posix.join(expectedDir, path.posix.basename(record.path));
      if (projected.has(collisionKey)) out.push(issue("SOURCE-PROJECTION-002", `Projection collides with ${projected.get(collisionKey)}`, record.source, collisionKey));
      else projected.set(collisionKey, record.sourceId);
    }
  }
  for (const spec of policy.body_identity_references ?? []) {
    const pattern = new RegExp(spec.pattern, spec.flags ?? "g");
    const unresolved = new Map();
    for (const source of sources) for (const match of String(source.__body ?? "").matchAll(pattern)) {
      const id = match[0]; if (!graph.resolve(id).target) {
        if (!unresolved.has(id)) unresolved.set(id, []); unresolved.get(id).push(source);
      }
    }
    for (const [id, owners] of unresolved) out.push(issue("SOURCE-BODY-REF-001", `${id} cited in ${owners.length} file(s), declared by none`, owners[0], id));
  }
  const structural = policy.structural_indexes;
  if (structural) {
    const labels = new Set(Object.values(graph.profile.profile.collections ?? {}).map(value => value.label));
    const buckets = new Set(Object.values(graph.profile.profile.artifact_kinds ?? {}).flatMap(value => String(value.bucket ?? "").split("/")).filter(Boolean));
    for (const source of sources) {
      if (source.pkg_artifact_kind != null || source[structural.legacy_kind_property ?? "doc_kind"] != null) continue;
      if (path.posix.basename(source.path) !== (structural.filename ?? "index.md")) continue;
      const parts = source.path.split("/"); parts.pop();
      const publication = parts[0], rest = parts.slice(1);
      const isStructural = parts.length <= 1 || (parts.length === 2 && labels.has(parts[1]))
        || rest.some(segment => buckets.has(segment)) || list(structural.always_structural_surfaces).includes(publication);
      if (!isStructural) out.push(issue("SOURCE-STRUCTURE-001", "Subject-shaped folder has no governed node artifact", source, source.path));
    }
  }
  return out;
}
