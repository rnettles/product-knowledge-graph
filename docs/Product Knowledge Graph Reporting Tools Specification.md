---
title: Product Knowledge Graph Reporting Tools Specification
date: 2026-08-23
weekday: Sunday
week: 2026-W34
month: 2026-08
quarter: 2026-Q3
year: 2026
week_page: "[[Week 2026-W34]]"
month_page: "[[Month 2026-08]]"
quarter_page: "[[Quarter 2026-Q3]]"
year_page: "[[Year 2026]]"
summary: "Architecture and behavioral contract for reusable JavaScript tools that inspect, traverse, validate, and report on a project knowledge-graph estate."
summary_generated: 2026-08-23
summary_model: Codex
authority: authoritative
authority_scope: product-knowledge-graph-reporting-tools
status: current
promotion_type: architecture
derived_from:
  - "Dev Vault: journal/2026/202608/20260823/20260823-Generic Product Knowledge Graph Abstraction.md"
created: 2026-08-23
last_verified: 2026-08-23
review_after: 2027-02-23
Type: source-of-truth
tags:
  - source-of-truth
  - knowledge-graph
  - javascript
  - reporting
  - tooling-architecture
---

# Product Knowledge Graph Reporting Tools Specification

## Implementation status

The reference package is implemented in the
[`product-knowledge-graph`](https://github.com/rnettles/product-knowledge-graph) repository.

Current package version: `0.3.1`.

Implemented capabilities include:

- pure normalized graph engine and deterministic `pkg_ids` resolution;
- profile validation and effective-profile compilation;
- core and profile-generated estate lint rules;
- exact-finding two-way baseline and gate behavior;
- Markdown, JSON and Dataview source adapters;
- estate health, structure explorer, scope ladder, traceability explorer, work queue, intent
  coverage, dependency impact, invariant blast radius and review freshness reports;
- JSON, Markdown, CSV and Obsidian renderers;
- command-line interface;
- browser bundle and thin Obsidian dashboard templates;
- synthetic valid and invalid project estates with automated tests.
- declarative portable-YAML, publication-surface, projection, collision, body-reference and
  structural-index validation policies.
- direct or descendant subject-scope ladder policies and exact alternate-identity capability closure.
- profile-configured implementation-claim, unresolved-realization and populated-subject contradiction assessments.

The MBS profile and migration are not part of package `0.1.0`; MBS remains the planned integration
and regression estate.

## 1. Purpose

This specification defines reusable JavaScript tools for surfacing the structure, health,
traceability, maturity and work opportunities of an estate conforming to
[Generic Product Knowledge Graph Standard](Generic%20Product%20Knowledge%20Graph%20Standard.md).

The package generalizes the behavior proven by the MBS `Scope Ladder.md` and
`L4 Traceability.md` tools without embedding their project vocabulary, filesystem roots, priority
order, artifact ladder or Obsidian-specific rendering into the graph engine.

## 2. Package boundary

The package consists of independently testable layers:

```text
source adapter
  -> normalized artifact records
  -> identity resolver and graph index
  -> validation and traversal engine
  -> report model
  -> renderer
```

### 2.1. Source adapters

Adapters read an estate and emit normalized records. Initial adapters should support:

- Obsidian Dataview page objects;
- Markdown files with YAML frontmatter;
- already-normalized JSON.

Adapters own source-specific details such as wikilink objects, file paths, frontmatter parsing and
host-property bindings. They must not assign missing authoritative graph edges.

### 2.2. Graph engine

The graph engine is pure JavaScript with no DOM, Obsidian, Dataview or filesystem dependency. It
accepts normalized records and an effective core/project profile.

It owns:

- canonical identity and alternate-ID indexes;
- deterministic reference resolution;
- node ancestry and reachability;
- inverse-edge indexes;
- cycle-safe traversal;
- structural, realization, dependency and assurance graphs;
- transitive closure;
- contradiction detection;
- inferred display hypotheses with provenance;
- report-model generation.

### 2.3. Renderers

Renderers consume report models without recomputing graph semantics. Initial renderers should
support:

- Obsidian DOM/Dataview containers;
- Markdown;
- JSON;
- CSV for tabular reports;
- terminal text where practical.

Interactive sorting and expansion belong in renderers. Report ordering, grouping and scoring
belong in profile configuration or report-model computation.

## 3. Normalized input contract

```ts
export interface ArtifactRecord {
  sourceId: string;
  path?: string;
  title: string;
  ids: string[];
  kind: string;
  authorityStatus: string;
  owner?: string | string[];
  lastReviewed?: string;
  reviewAfter?: string;
  subjectRefs: string[];
  collection?: string;
  parentRefs: string[];
  facets: Record<string, string | string[]>;
  realizesRefs: string[];
  dependencyRefs: string[];
  invariantsDeclared: string[];
  invariantsReferenced: string[];
  implementationStatus?: string;
  implementationSources: string[];
  extensions: Record<string, unknown>;
}
```

Normalization removes host syntax but not meaning. Every normalized value retains source location
information sufficient to explain a finding.

## 4. Resolution contract

Resolution must be deterministic:

1. exact canonical `pkg_ids[0]` match;
2. exact alternate `pkg_ids` match;
3. profile-authorized host identity match;
4. unresolved or ambiguous finding.

Filename, title or path fallback may be enabled only by the project profile and must be labeled as
compatibility resolution. Two artifacts claiming one identifier are a contradiction, not a
first-match result.

The engine returns resolution provenance:

```ts
export interface Resolution {
  input: string;
  target?: ArtifactRecord;
  method: "canonical-id" | "alternate-id" | "host-binding" | "compatibility";
  ambiguousTargets?: ArtifactRecord[];
}
```

## 5. Graph index contract

The engine builds separate indexes for:

- structural children and descendants;
- artifacts owned by each subject;
- inverse `pkg_realizes` edges;
- inverse `pkg_depends_on` edges;
- invariant declarations and references;
- artifacts by kind, status, facet and implementation state.

Traversals must use visited sets, report cycles, and avoid duplicate results. A renderer must not
nest one graph inside another in a way that changes edge meaning.

## 6. Finding model

Every output record declares its epistemic and governance class:

```ts
export interface Finding {
  code: string;
  class: "contradiction" | "absence" | "inference" | "assessment";
  severity: "error" | "diagnostic" | "metric";
  artifactIds: string[];
  message: string;
  evidence: Evidence[];
  suggestedRepair?: SuggestedRepair;
}
```

- A contradiction is backed by declared claims or a violated contract.
- An absence is a zero-count expected stage or missing edge.
- An inference is a display hypothesis with its evidence and confidence basis.
- An assessment is a derived maturity, readiness or priority judgment.

Suggested repairs are data, not mutations. Report execution must be read-only.

## 7. Scope Ladder report

The Scope Ladder report answers:

> Where does each subject stand, and what is the next useful action?

Its profile configuration defines rungs:

```yaml
reports:
  scope_ladder:
    rungs:
      - id: unstarted
        evidence:
          artifact_count: 0
        next_action: establish subject framing
      - id: specified
        evidence:
          kind_any: [requirement]
        next_action: evaluate realization artifacts
      - id: designed
        evidence:
          kind_any: [technical-design]
        next_action: evaluate implementation work
    skipped_rungs_allowed: true
    grouping: [rung, structural-location]
```

Required outputs:

- subject count by rung;
- subject standing with evidence;
- started-subject work queue;
- separately listed unstarted subjects;
- profile-defined next action;
- transitive intent coverage;
- contradictions separate from gaps.

The report must not generate a universal missing-kind checklist. A ladder must rank useful progress
in its project rather than compare every subject to the most mature subject.

## 8. Traceability Explorer report

The Traceability Explorer presents four independent views:

1. structural containment;
2. intent realization;
3. operational dependency;
4. assurance authority.

Required capabilities:

- reachable and disconnected structural nodes;
- declared documents by subject;
- unclassified or unreachable artifacts;
- transitive intent tree with parallel realization branches;
- expected zero-count stages labeled as planning candidates;
- dependency cycles and reciprocal-edge contradictions;
- cross-subject dependency labels;
- invariant declarations, references and unused declarations;
- graph-health summary;
- missing/conflicting metadata summary;
- profile-defined planning focus and work queue;
- explicitly labeled inferred placement or edge hypotheses.

Normal links are backed by declarations. Inferred links must have distinct styling and must not be
used as authoritative inputs to other reports unless the consumer explicitly requests hypotheses.

## 9. Coverage and blast-radius reports

### Intent coverage

Starting from an intent identity, traverse inverse `pkg_realizes` edges to transitive closure.
Report reached artifacts by kind, subject, authority and implementation state. Expected kinds come
from the profile and zero counts are planning information.

### Dependency impact

Starting from an artifact, traverse inverse `pkg_depends_on` edges. Keep direct and transitive
consumers distinguishable and label cross-subject results.

### Invariant blast radius

Resolve one declaration and list all direct referencing artifacts. A missing or duplicate
declaration is a contradiction. An unreferenced declaration is normally a diagnostic, not an error.

## 10. Profile configuration

Reporting configuration belongs in the project profile or a versioned file referenced by it. It
may define:

- estate source scope;
- artifact kinds and stage groupings;
- maturity rungs;
- expected realization children;
- planning seeds;
- priority groups;
- readiness heuristics;
- score formulas;
- facet groupings;
- default sort and display labels;
- compatibility-resolution rules;
- renderer options.

Configuration must classify every heuristic as diagnostic or metric. It must not redefine graph
edge semantics.

## 11. Public JavaScript API

The generic package should expose functional APIs similar to:

```ts
export function normalize(source: unknown, adapter: SourceAdapter, profile: EffectiveProfile): ArtifactRecord[];
export function buildGraph(records: ArtifactRecord[], profile: EffectiveProfile): GraphIndex;
export function validate(graph: GraphIndex): Finding[];
export function scopeLadder(graph: GraphIndex, config: ScopeLadderConfig): ScopeLadderReport;
export function traceability(graph: GraphIndex, config: TraceabilityConfig): TraceabilityReport;
export function intentCoverage(graph: GraphIndex, seed: string): CoverageReport;
export function dependencyImpact(graph: GraphIndex, seed: string): ImpactReport;
export function invariantBlastRadius(graph: GraphIndex, invariant: string): AssuranceReport;
export function render(report: Report, renderer: Renderer, options?: RenderOptions): unknown;
```

No public report function may mutate source records.

## 12. Testing requirements

The package test suite must include:

- canonical, alternate, ambiguous and unresolved identity resolution;
- structural, realization and dependency cycles;
- disconnected nodes and unclassified artifacts;
- fan-in, fan-out and parallel realization branches;
- declared capabilities with no realizers;
- inferred placement that remains non-authoritative;
- duplicate and missing invariant declarations;
- cross-subject dependencies;
- skipped maturity rungs;
- profiles with different artifact taxonomies;
- identical report models from Markdown and Dataview adapters;
- renderer snapshots that preserve output classes;
- proof that reports do not mutate input.

Use small synthetic estates rather than MBS fixtures for core tests. MBS may serve as an integration
profile and regression estate.

## 13. Implementation sequence

1. **Done:** define JavaScript contracts and JSON-serializable report models.
2. **Done:** extract resolution and graph indexing into pure functions.
3. **Done:** build synthetic-estate tests.
4. **Done:** implement Markdown, JSON and Dataview adapters.
5. **Done:** implement configurable Scope Ladder computation without rendering code.
6. **Done:** implement configurable Traceability Explorer computation without rendering code.
7. **Done:** add Markdown, JSON, CSV and Obsidian renderers.
8. **Done:** add the browser bundle and thin dashboard invocations.
9. **Next:** author and validate the MBS profile against the generic package.
10. **Next:** replace embedded MBS scripts with thin package invocations after equivalent output is proven.
