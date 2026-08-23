---
title: Generic Product Knowledge Graph Standard
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
summary: "Project-neutral normative standard for documentation-as-code product knowledge graphs, including graph semantics, schema evolution, validation, and project-profile extension boundaries."
summary_generated: 2026-08-23
summary_model: Codex
authority: authoritative
authority_scope: generic-product-knowledge-graph-core
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
  - documentation-as-code
  - schema-standard
  - information-architecture
---

# Generic Product Knowledge Graph Standard

## 1. Purpose

This Standard defines a reusable semantic core for treating human-authored software-product
artifacts as a governed knowledge graph. It defines stable identity, graph meanings, conformance,
schema evolution and the boundary between universal semantics and project-specific configuration.

It does not prescribe a project taxonomy, folder tree, publication platform, business domains or
development methodology. Each adopting project supplies those choices through a versioned
[project profile](Product%20Knowledge%20Graph%20Project%20Profile%20Guide.md).

## 2. Authority and conformance

The effective contract for an estate is:

```text
released core schema + released project profile = effective estate schema
```

The core is authoritative for the meaning of reserved properties and relationships. The project
profile is authoritative for controlled values, local extensions, projection and constraints. A
profile may narrow a core rule but must not redefine it.

Normative terms:

- **must / must not** — required for conformance;
- **should / should not** — expected, with legitimate exceptions;
- **may** — optional.

| Class | Meaning | Gate effect |
|---|---|---|
| **Error** | Identity, schema, projection or graph integrity cannot be trusted. | Fails validation. |
| **Diagnostic** | Suspicious or stale, but legitimate exceptions exist. | Reported without invalidating the artifact. |
| **Metric** | Aggregate coverage or governance signal. | Never determines individual validity. |

An implementation gap between a normative rule and its validator must be recorded explicitly as
**contract-only**. Undocumented tooling behaviour is not part of the contract.

## 3. Governing principles

### 3.1. Author each fact once

An assertion must have one authoritative authored location. Values derivable from other assertions
must be computed rather than independently maintained.

Common derived values include:

- inverse relationships;
- filesystem paths and publication targets;
- roll-ups, percentages and coverage;
- inherited structural placement;
- lifecycle summaries;
- dependency and invariant blast radius.

### 3.2. Give every relationship one meaning

An edge type must mean the same thing regardless of the kinds of its endpoints. Structural
containment, intent realization, operational dependency and assurance authority are separate
graphs. General relatedness is not a substitute for a typed relationship.

### 3.3. Keep structure declarative

Where a project derives paths or navigation from metadata, the tree is a materialized view rather
than an independent authority. Unprojectable input is a finding; tooling must not guess.

### 3.4. Require a consumer for metadata

A property should be introduced only when it carries independent information and a named human or
machine consumer uses it. Metadata is not added merely because another framework contains it.

## 4. Core entities

### 4.1. Artifact

An artifact is a governed unit of knowledge with stable identity, an artifact kind and an authority
lifecycle. Markdown is a common authoring representation but is not required by this model.

### 4.2. Subject node

A subject node is a named concept that structurally owns artifacts about it and may contain child
nodes. A subject may represent a product, service, subsystem, feature area, policy domain,
cross-cutting concern, organizational capability or another locally meaningful subject.

### 4.3. Collection

A collection is a project-defined structural root. It groups root nodes or, where a profile allows,
subjectless artifacts. A collection is not itself assumed to be a subject.

### 4.4. Invariant

An invariant is a stable condition declared by exactly one artifact and relied upon by zero or more
artifacts. Its references form a queryable blast radius.

## 5. Namespace and reserved properties

The prefix `pkg_` is reserved for properties owned by this knowledge-graph contract. New
implementations must use the canonical prefixed names below. The flat prefix is preferred to a
nested `pkg:` object because it remains interoperable with frontmatter property editors, simple
linters, query tools, CSV exports and consumers supporting only scalar or list properties.

The namespace establishes semantic ownership; it must not create a duplicate document-management
scope. Mature host estates often already own `title`, `owner`, creation and review properties. A
project profile must bind a host property when its meaning is equivalent, or keep a separate
prefixed graph property when it is not. The same fact must never be authored in both.

### 5.1. Host-property bindings

The profile records how shared document properties satisfy core roles:

```yaml
host_bindings:
  title: title
  owner: owner
  last_reviewed: last_verified
  review_after: review_after
```

Bindings are semantic claims, not spelling conveniences. `last_verified` may bind to
`last_reviewed` only when verification means a human confirmed the graph assertions remain true.
If the host field has broader or different meaning, the profile must use a distinct
`pkg_last_reviewed` property instead.

A profile must document type, cardinality, ownership and semantic equivalence for every binding.
A validator resolves bindings before applying core obligations.

### 5.2. Identity and authority

| Property | Type | Core obligation | Meaning |
|---|---|---|---|
| host-bound `title` role | string | required | Human-readable display name. |
| `pkg_ids` | string list | required | Stable citation identities; first value is canonical. |
| `pkg_artifact_kind` | profile enum | required | Governed artifact identity and expected shape. |
| `pkg_authority_status` | profile enum | required | How much a reader may rely on the artifact. |
| host-bound `owner` role | string or identity reference | required | Human or team accountable for questions and review. |
| host-bound `last_reviewed` role or `pkg_last_reviewed` | date | required | Last confirmation that graph assertions remain true. |
| host-bound `review_after` role or `pkg_review_after` | date | optional | Date after which graph freshness becomes diagnostic. |
| `pkg_superseded_by` | artifact reference | conditional | Authoritative successor when one exists. |

Editing and review are distinct. A formatting change does not advance the bound review property.
`pkg_authority_status` describes the artifact, not the implementation it discusses.

### 5.3. Structural placement

| Property | Type | Core obligation | Meaning |
|---|---|---|---|
| `pkg_subject` | node reference | profile-controlled | Subject node this artifact is about. |
| `pkg_collection` | profile enum | profile-controlled | Structural root for a root node or subjectless artifact. |
| `pkg_parent` | node reference | child nodes | Structural parent node. |
| `pkg_facets` | key/value map | optional | Profile-defined orthogonal query dimensions. |

A profile must define valid placement combinations. A common model is exactly one of `pkg_subject`
or `pkg_collection` for an artifact, and exactly one of `pkg_parent` or `pkg_collection` for a node. Other models
are permitted when their semantics and projection remain unambiguous.

Facets are not structural parents unless the profile explicitly models them as nodes. Examples may
include product area, audience, compliance regime, data sensitivity or business domain.

### 5.4. Implementation connection

| Property | Type | Core obligation | Meaning |
|---|---|---|---|
| `pkg_implementation_status` | profile enum | optional | Lifecycle of the described implementation. |
| `pkg_implementation_source` | URI, path or list | conditional | Checkable implementation anchor. |

The profile defines implementation states and which states require a source. Artifact authority and
implementation maturity must remain separate lifecycles.

### 5.5. Traceability and assurance

| Property | Type | Meaning |
|---|---|---|
| `pkg_realizes` | artifact-reference list | Intent that this artifact makes more concrete and advances toward satisfaction. |
| `pkg_depends_on` | artifact-reference list | Prerequisites required by this artifact. |
| `pkg_invariants_declared` | invariant-ID list | Invariants established by this artifact. |
| `pkg_invariants_referenced` | invariant-ID list | Invariants on which this artifact relies. |

Only forward edges are authored. Inverses are derived.

## 6. Core graph semantics

### 6.1. Structural containment

```text
Collection -> Root Node -> Child Node -> Artifact
```

- Node parentage must be unambiguous and acyclic.
- Every referenced node must resolve to one declaration.
- A profile defines whether an artifact may belong to multiple subjects; the default should be one
  accountable subject.
- Navigation and path projections must derive from declared structure when projection is enabled.

### 6.2. Intent realization

The `pkg_realizes` property asserts the realizes relationship. `A realizes B` is true only when all
of these tests pass:

1. A is more concrete than B.
2. Completing or accepting A directly advances satisfaction of intent asserted by B.
3. Removing A leaves some of B's intent unrealized or without its required realization.
4. The relation is not merely mentions, illustrates, resembles, depends on or is related to.

The realization graph must contain no self-edge and must be acyclic. Fan-in, fan-out and partial
realization are allowed. The project profile defines permitted kind pairs and any genuine
cardinality constraints.

### 6.3. Operational dependency

The `pkg_depends_on` property asserts operational dependency. `A depends on B` means B is a
prerequisite for A to remain valid, complete, implementable or
operable. It must not represent containment, realization, approval workflow, ownership, general
relatedness or the inverse of another edge.

Self-dependencies and cycles are invalid unless a future core version defines a separate cyclic
coordination relationship. A project profile cannot weaken this by redefining `pkg_depends_on`.

### 6.4. Assurance authority

An invariant must resolve to exactly one declaring artifact. Any number of artifacts may reference
it. A project profile defines invariant-ID syntax and may add categories, severity or evidence only
when consumers require them.

## 7. Project-profile contract

Every adopting project must release a profile that declares:

- project identity and profile version;
- compatible core-version range;
- artifact kinds and boundary tests;
- authority statuses and allowed transitions;
- collections, node rules and placement combinations;
- facet definitions and value vocabularies;
- publication surfaces and projection rules, if any;
- realization source/target pairs;
- implementation lifecycle and source requirements;
- invariant-ID rules;
- extension properties with types, ownership and consumers;
- errors, diagnostics and metrics;
- compatibility mappings and migrations from legacy vocabulary.
- host-property bindings for shared document metadata.

A profile must not:

- change the meaning or direction of a reserved edge;
- reuse a reserved property for unrelated information;
- use the `pkg_` prefix for a property outside this contract or an extension registered by the profile;
- duplicate a host-bound fact in a prefixed property;
- author a value that the same profile says is derived;
- introduce an extension without a stated consumer;
- silently reinterpret legacy data.

## 8. Schema identity and composition

The core and project profile are independently versioned. An estate descriptor identifies both:

```yaml
pkg_schema: product-knowledge-graph
pkg_core_version: 1.0.0
pkg_profile: example-project
pkg_profile_version: 1.0.0
```

Consumers must declare supported core and profile version ranges and fail clearly on an unsupported
effective contract.

Live artifacts inherit the estate descriptor by default. Per-artifact schema versions should be
introduced only when mixed live versions are intentionally supported and tooling interprets them
differently. If introduced, the version must be tool-owned and have a convergence policy.

## 9. Schema evolution and legacy intent

Released schema and profile snapshots are immutable. Both use semantic versioning:

| Change | Version effect |
|---|---|
| Clarification or compatible enforcement correction | patch |
| Backward-compatible optional property, value, pair or diagnostic | minor |
| Removal, rename, semantic change, new requirement or incompatible projection | major |

Every property, kind, status, facet and edge constraint must have lifecycle history. Supported
lifecycle states are:

- `active`
- `deprecated`
- `renamed`
- `split`
- `merged`
- `replaced`
- `retired-without-replacement`

Every incompatible transition must provide:

1. previous and new immutable snapshots;
2. a lifecycle entry preserving old meaning;
3. a migration record;
4. a decision record when meaning changes;
5. estate migration status.

Migration equivalence must be one of:

| Equivalence | Meaning |
|---|---|
| `exact` | Mechanical translation preserves all meaning. |
| `conditional` | Translation is exact only when stated preconditions hold. |
| `contextual` | A human or domain-aware tool must interpret the legacy assertion. |
| `none` | No truthful semantic translation exists. Preserve history; do not invent one. |

Legacy interpretation follows:

```text
legacy assertion
  -> schema/profile version in effect
  -> lifecycle entry
  -> migration record
  -> decision rationale
  -> current contract
```

Version control is evidence, but it is not a substitute for this lineage.

## 10. Validation requirements

A conforming validator must treat these as errors when the applicable feature is enabled:

- unreadable or ambiguous metadata;
- missing required core or profile property;
- value outside a controlled vocabulary;
- duplicate stable identity;
- unresolved artifact, node or invariant reference;
- invalid placement-key combination;
- structural, realization or dependency self-edge or cycle;
- disallowed realization kind pair;
- projection ambiguity or collision;
- artifact path outside its declared projection;
- incompatible core or profile version.

Likely-but-not-certain conditions belong in diagnostics, such as overdue review, facet outliers,
unexpectedly missing traceability stages or implementation claims with weak evidence.

Coverage belongs in metrics, such as intent coverage, orphan artifacts, invariant coverage,
implementation coverage and review freshness. A metric target must not silently become validity.

Where legacy debt prevents immediate enforcement, baselines must identify exact findings rather
than counts. A new finding and a stale waiver must both fail the gate.

## 11. Derived views and planning semantics

Views, reports and dashboards are graph consumers, not additional sources of truth. They may derive
navigation, transitive coverage, maturity assessments, gaps, blast radius and work queues. They
must not author or silently repair graph assertions.

The reference implementation contract for reusable reporting tools is defined by
[Product Knowledge Graph Reporting Tools Specification](Product%20Knowledge%20Graph%20Reporting%20Tools%20Specification.md). A conforming tool consumes the effective
core/profile contract rather than hard-coding one project's vocabulary.

### 11.1. Output classes

A view must distinguish these outputs visibly and machine-readably where practical:

| Output | Meaning | Governance class |
|---|---|---|
| **Contradiction** | Declared claims conflict, a required target is unresolved, or a graph invariant is violated. | Error or diagnostic as defined by the effective contract. |
| **Absence** | An expected artifact kind or edge is not present. | Planning candidate unless the profile explicitly requires it. |
| **Inference** | A likely relationship or placement derived from non-authoritative evidence. | Display-only hypothesis. |
| **Assessment** | Readiness, maturity, priority or recommended next action derived by project policy. | Diagnostic or metric. |

An inferred relationship must never be traversed as if declared without retaining its inferred
provenance. A view may offer a repair action, but a human or authorized workflow must create the
authoritative assertion.

### 11.2. Expected stages

A project profile may define expected realization stages and allowed child kinds for planning
views. Zero-count stages help expose possible work but do not become mandatory merely by appearing.
Parallel realization kinds must be rendered as branches rather than a false sequential chain.

### 11.3. Maturity ladders

A maturity or scope ladder is a profile-defined derived assessment. Its rungs must declare:

- evidence predicates;
- ordering or precedence;
- next-action guidance;
- whether skipped stages are valid;
- consumers;
- diagnostic or metric classification.

The rung must not be authored onto a subject when it can be recalculated from the graph. A ladder
should prioritize useful next action rather than report every missing kind against every subject.

### 11.4. Coverage and traversal

Intent coverage is computed through the transitive closure of inverse `pkg_realizes` edges.
Dependency impact traverses `pkg_depends_on`; assurance blast radius traverses invariant references.
Each traversal must retain its edge semantics and scope boundaries.

Views must detect traversal cycles, de-duplicate visited artifacts, resolve identities through
`pkg_ids`, and label cross-subject or cross-scope results. Planned subjects that have no declaration
cannot be discovered by graph traversal and must enter through explicitly labeled planning input.

### 11.5. Work queues and scoring

Priority weights, readiness heuristics and next-action recommendations are profile or estate policy,
not core validity. A scoring view must publish its formula and distinguish factual graph gaps from
subjective readiness assessments. It should not convert every absence into required work.

## 12. Minimal generic example

```yaml
title: Export account data
owner: product-team
last_verified: 2026-08-23
review_after: 2027-02-23
pkg_ids:
  - REQ-042
pkg_artifact_kind: requirement
pkg_authority_status: approved
pkg_subject: "[[Account Management]]"
pkg_facets:
  compliance: privacy
pkg_realizes:
  - "[[CAP-007 Data Portability]]"
pkg_depends_on:
  - "[[POL-003 Data Retention Policy]]"
pkg_invariants_referenced:
  - INV-export-completeness-001
```

The values `requirement`, `approved`, `privacy`, and the permitted edges are defined by the project
profile, not by this core Standard. This example assumes the profile binds `title`, `owner`,
`last_verified` and `review_after` to their corresponding core roles.

## 13. Adoption

Adopt this Standard through the [Product Knowledge Graph Project Profile Guide](Product%20Knowledge%20Graph%20Project%20Profile%20Guide.md). A project should
model its actual vocabulary before changing files, validate representative pathological cases, and
separate its normative profile from its time-varying estate narrative.
