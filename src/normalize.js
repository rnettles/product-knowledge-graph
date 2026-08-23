import { list, text } from "./model.js";

function value(source, profile, role, fallback) {
  const bound = profile.binding(role);
  return source[bound ?? fallback];
}

export function normalizeRecord(source, profile, sourceId = source.sourceId ?? source.path ?? source.file?.path ?? "<unknown>") {
  const ids = list(source.pkg_ids).map(text).filter(Boolean);
  const known = new Set([
    "pkg_ids", "pkg_artifact_kind", "pkg_authority_status", "pkg_subject", "pkg_collection", "pkg_parent",
    "pkg_facets", "pkg_superseded_by", "pkg_implementation_status", "pkg_implementation_source",
    "pkg_realizes", "pkg_depends_on", "pkg_invariants_declared", "pkg_invariants_referenced",
    profile.binding("title"), profile.binding("owner"), profile.binding("last_reviewed"), profile.binding("review_after")
  ].filter(Boolean));
  return {
    source, sourceId, path: source.path ?? source.file?.path,
    title: text(value(source, profile, "title", "title")),
    ids,
    kind: text(source.pkg_artifact_kind),
    authorityStatus: text(source.pkg_authority_status),
    owner: value(source, profile, "owner", "owner"),
    lastReviewed: text(value(source, profile, "last_reviewed", "pkg_last_reviewed")),
    reviewAfter: text(value(source, profile, "review_after", "pkg_review_after")),
    supersededByRef: text(source.pkg_superseded_by),
    subjectRefs: list(source.pkg_subject).map(text).filter(Boolean),
    collection: text(source.pkg_collection),
    parentRefs: list(source.pkg_parent).map(text).filter(Boolean),
    facets: source.pkg_facets && typeof source.pkg_facets === "object" ? source.pkg_facets : {},
    realizesRefs: list(source.pkg_realizes).map(text).filter(Boolean),
    dependencyRefs: list(source.pkg_depends_on).map(text).filter(Boolean),
    invariantsDeclared: list(source.pkg_invariants_declared).map(text).filter(Boolean),
    invariantsReferenced: list(source.pkg_invariants_referenced).map(text).filter(Boolean),
    implementationStatus: text(source.pkg_implementation_status),
    implementationSources: list(source.pkg_implementation_source).map(text).filter(Boolean),
    extensions: Object.fromEntries(Object.entries(source).filter(([key]) => key.startsWith("pkg_") && !known.has(key)))
  };
}

export function normalizeRecords(sources, profile) {
  return sources.map((source, index) => normalizeRecord(source, profile, source.sourceId ?? source.path ?? source.file?.path ?? `<record:${index}>`));
}
