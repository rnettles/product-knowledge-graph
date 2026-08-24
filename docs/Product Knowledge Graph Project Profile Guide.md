---
title: Product Knowledge Graph Project Profile Guide
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
summary: "Guidance and template for adapting the generic product knowledge graph standard to a project's vocabulary, structure, publication model, and governance needs."
summary_generated: 2026-08-23
summary_model: Codex
authority: authoritative
authority_scope: product-knowledge-graph-project-profile-authoring
status: current
promotion_type: runbook
derived_from:
  - "Dev Vault: journal/2026/202608/20260823/20260823-Generic Product Knowledge Graph Abstraction.md"
created: 2026-08-23
last_verified: 2026-08-23
review_after: 2027-02-23
Type: source-of-truth
tags:
  - source-of-truth
  - knowledge-graph
  - project-profile
  - documentation-as-code
  - runbook
---

# Product Knowledge Graph Project Profile Guide

## 1. Purpose

Use this guide to adapt the [Generic Product Knowledge Graph Standard](Generic%20Product%20Knowledge%20Graph%20Standard.md) to a specific software project
without copying vocabulary or structure from an unrelated estate.

The result is a versioned project profile plus a separate estate narrative:

- the **profile** says what project assertions mean and which structures are valid;
- the **estate narrative** reports current adoption, migrations, measurements and open work.

Never place dated counts or rollout history in the profile.

## 2. Required deliverables

Create:

```text
knowledge-graph/
├── estate.yaml
├── profile/
│   ├── current.yaml
│   ├── versions/
│   │   └── 1.0.0.yaml
│   ├── property-lifecycle.yaml
│   ├── migrations/
│   ├── decisions/
│   └── CHANGELOG.md
├── Project Knowledge Graph Profile.md
├── Knowledge Estate Status and Evolution.md
└── reporting/
    └── report-config.yaml
```

Names and locations may follow repository conventions, but the authority split must remain clear.

### Namespace policy

Reserve `pkg_` for knowledge-graph-owned frontmatter. Do not prefix mature host properties whose
semantics truthfully satisfy a core role; bind them in the profile instead. Do not author both a
host property and a prefixed copy of the same fact.

Use flat prefixed properties rather than a nested `pkg:` object unless every project consumer is
known to preserve and query nested YAML correctly.

Required profile decisions include:

```yaml
namespace:
  prefix: pkg_
  nesting: flat

host_bindings:
  title: title
  owner: owner
  last_reviewed: last_verified
  review_after: review_after
```

Each host binding must state semantic equivalence, type, cardinality and ownership. If a host
property is only similarly named, do not bind it; use the appropriate reserved `pkg_` property.

## 3. Profile design sequence

### Step 1 — Identify consumers

List every consumer before choosing metadata:

| Consumer | Questions it answers | Required assertions |
|---|---|---|
| Validator | Is this artifact structurally and semantically valid? | identity, kinds, references, constraints |
| Publisher | Where and whether is it published? | kinds, surfaces, projection |
| Navigation | Where does it appear? | collections, subjects, ancestry |
| Traceability report | What intent is realized or orphaned? | identities, realization edges |
| Engineering report | What exists in implementation? | implementation state and source |
| Assurance report | What changes if an invariant changes? | invariant declarations and references |

Do not add a property without naming its consumer.

### Step 2 — Inventory local concepts

Collect the terms the project already uses. Separate them into:

- artifact identities;
- structural subjects;
- query facets;
- authority lifecycle;
- implementation lifecycle;
- relationships;
- publication and projection;
- historical or duplicate metadata.

Do not assume a folder name is a valid semantic category. It may be import residue, display order or
a materialized view.

### Step 3 — Define artifact kinds

For every `pkg_artifact_kind`, record:

- canonical value and definition;
- boundary test;
- expected template or shape;
- publication surface;
- projection bucket, if applicable;
- allowed relationships;
- lifecycle constraints;
- examples and near-neighbor distinctions.

Test whether the taxonomy mixes independent dimensions. Prefer one kind when it has clear routing
and validation behaviour. Add a facet only when repeated real cases require independent querying.

### Step 4 — Define structure

Choose the local meanings of:

- `pkg_collection` — structural roots;
- `pkg_subject` — accountable subject membership;
- `pkg_parent` — node nesting;
- subjectless artifacts;
- multiple-subject ownership, if truly required;
- grouping folders that carry no subject meaning.

State exact valid combinations. If paths are derived, define projection as a pure function of
declared metadata.

### Step 5 — Define facets

Facets are orthogonal query dimensions, not structural parents. For each facet record:

- property key beneath `pkg_facets`;
- values and definitions;
- cardinality;
- whether inherited values are truthful;
- error or diagnostic behaviour;
- consumer.

Do not inherit a facet merely to reduce authorship if artifacts beneath one subject can truthfully
differ.

### Step 6 — Define lifecycles

Define artifact authority independently from implementation maturity.

An authority lifecycle should answer what a reader may trust. An implementation lifecycle should
answer what exists in software or operations. If both use similar words, prefer names that make the
distinction explicit.

For every state define:

- meaning;
- entry condition;
- reader expectation;
- allowed transitions;
- required supporting properties;
- successor semantics.

### Step 7 — Define graph constraints

For software-product projects, begin with the
[Software Product Traceability Convention](Software%20Product%20Traceability%20Convention.md). Adopt
its branching capability → story → FRD topology, then record representation differences and omitted
stages in the project profile. Do not copy the diagram into a project and silently change its edge
meaning.

For `pkg_realizes`, create an allowed-pair matrix and test each pair with the core truth test. Do not
add an edge merely to complete a visually pleasing ladder.

For `pkg_depends_on`, confirm that the target is a genuine prerequisite rather than ownership,
approval, sequence or relatedness.

For invariants, define ID syntax, declaration authority and any optional categories only when a
consumer uses them.

### Step 8 — Define validation levels

Classify each rule as:

- error;
- diagnostic;
- metric;
- contract-only pending implementation.

Every normative “must” should map to an implemented rule or a visible contract-only gap.

### Step 9 — Version and migrate

Release immutable core/profile coordinates. Record every legacy property and its original meaning
before removing it. Classify migrations as exact, conditional, contextual or none.

Never treat a similarly named successor as proof of semantic equivalence.

### Step 10 — Red-team representative cases

Test normal and pathological cases before freezing the profile:

- one artifact spans multiple subjects;
- shared service used by unrelated product areas;
- one design realizes several requirements;
- several designs partially realize one requirement;
- abandoned and superseded implementations;
- requirements without implementation artifacts;
- implementation without an intermediate specification;
- regulatory or policy constraints;
- migrations and renamed capabilities;
- circular prerequisites;
- a folder that looks like a subject but is only grouping;
- historical evidence outside the live graph.

Change the model only when it cannot represent a truthful case without fiction.

### Step 11 — Define derived views

Inventory the planning and reporting instruments that consume the graph. For each view define:

- authoritative input scope;
- traversed edge types and directions;
- expected stages or artifact kinds;
- distinction among contradiction, absence, inference and assessment;
- maturity-rung evidence and next actions, if used;
- transitive-closure and cycle behavior;
- cross-subject presentation;
- scoring or prioritization formula;
- whether output is an error, diagnostic or metric;
- where non-graph planning seeds are maintained.

Configure reusable reports through the [Product Knowledge Graph Reporting Tools Specification](Product%20Knowledge%20Graph%20Reporting%20Tools%20Specification.md). Keep
profile policy in configuration and report algorithms in the package; do not fork a report merely
to embed local vocabulary.

An inferred placement or edge must remain a labeled display hypothesis until an authorized workflow
adds the declaration. Empty expected stages are planning candidates, not automatic defects.

## 4. Project profile template

```yaml
profile: example-project
version: 1.0.0
compatible_core: ">=1.0.0 <2.0.0"

namespace:
  prefix: pkg_
  nesting: flat

host_bindings:
  title:
    property: title
    equivalence: exact
  owner:
    property: owner
    equivalence: exact
  last_reviewed:
    property: last_verified
    equivalence: exact
  review_after:
    property: review_after
    equivalence: exact

identity:
  canonical_identifier: pkg_ids[0]

artifact_kinds:
  requirement:
    definition: Testable statement of required behavior or constraint.
    surface: product
    bucket: requirements
  technical-design:
    definition: Design describing how a scoped change will be implemented.
    surface: engineering
    bucket: designs

authority_statuses:
  draft:
    reader_expectation: do-not-rely
  approved:
    reader_expectation: authoritative
  superseded:
    requires: superseded_by

collections:
  product:
    allows_subjectless_artifacts: true
  systems:
    allows_subjectless_artifacts: false

facets:
  audience:
    cardinality: many
    values: [customer, operator, developer]
  compliance:
    cardinality: many
    values: [privacy, security, financial]

publication_surfaces:
  product:
    publish: true
  engineering:
    publish: false

realization_pairs:
  requirement: [capability]
  technical-design: [requirement]

implementation:
  statuses: [planned, in-progress, deployed, retired]
  source_required_for: [in-progress, deployed]

invariants:
  id_pattern: "^INV-[a-z0-9-]+-[0-9]{3}$"

extensions:
  pkg_release_train:
    type: string
    obligation: optional
    consumer: release-report

diagnostics:
  - overdue-review
  - subject-facet-outlier

metrics:
  - intent-coverage
  - implementation-coverage
  - invariant-coverage

derived_views:
  scope_ladder:
    class: metric
    stages:
      - name: specified
        evidence_any: [requirement]
        next_action: evaluate realization artifacts
      - name: designed
        evidence_any: [technical-design]
        next_action: evaluate implementation work
    skipped_stages_allowed: true
  traceability:
    traversals:
      intent_coverage: inverse-transitive-pkg_realizes
      dependency_impact: inverse-transitive-pkg_depends_on
      invariant_blast_radius: inverse-pkg_invariants_referenced
    inferred_edges: display-only
    empty_expected_stage: planning-candidate
```

The example values are illustrative. A project must replace them rather than treating them as a
default ontology. Graph extensions use the reserved prefix and must be registered in the profile;
unrelated host scopes must not use `pkg_`.

## 5. Legacy compatibility mapping

An existing project may temporarily map local keys to canonical core properties:

```yaml
compatibility:
  legacy_properties:
    doc_type:
      maps_to: pkg_artifact_kind
      equivalence: exact
    system:
      maps_to: pkg_subject
      equivalence: conditional
      condition: system always names one accountable subject node
    implements:
      maps_to: pkg_realizes
      equivalence: contextual
      review: verify every edge passes the realization truth test
```

Compatibility mappings are migration instructions, not permission to maintain two authored copies.
Give each mapping a removal version or explicit review trigger.

## 6. Estate descriptor

Create one descriptor inherited by live artifacts:

```yaml
pkg_schema: product-knowledge-graph
pkg_core_version: 1.0.0
pkg_profile: example-project
pkg_profile_version: 1.0.0
```

Every machine consumer should declare supported core and profile ranges. Unsupported coordinates
must fail clearly before artifact interpretation.

## 7. Estate narrative

Keep a separate `Knowledge Estate Status and Evolution` document containing:

- dated artifact and adoption counts;
- validation results;
- graph and review coverage;
- migration progress;
- known exceptions and risks;
- active work queue;
- deferred decisions and reopening triggers;
- completed milestones and evidence;
- commands or reports used to reproduce measurements.

The profile says what “valid” means. The narrative says how much of the estate is valid today.

Planning views may also use explicitly maintained seeds for subjects that do not yet exist in the
graph. Those seeds belong here or in another named planning source, not in inferred graph output.

## 8. Adoption checklist

- [ ] Consumers are named for every property.
- [ ] `pkg_` is reserved for graph-owned properties and registered graph extensions.
- [ ] Compatible mature host properties are bound, not copied.
- [ ] Every host binding has exact semantics, type, cardinality and ownership.
- [ ] Core and profile authority boundaries are explicit.
- [ ] Artifact kinds have definitions and boundary tests.
- [ ] Structural nodes are distinguished from grouping folders.
- [ ] Facets are independent of placement.
- [ ] Artifact and implementation lifecycles are separate.
- [ ] Every realization pair passes the core truth test.
- [ ] Dependencies express prerequisites only.
- [ ] Invariants have one declaration authority.
- [ ] Projection is deterministic or explicitly not enabled.
- [ ] Errors, diagnostics and metrics are separate.
- [ ] Every legacy property retains meaning and migration lineage.
- [ ] Schema and profile versions are released immutably.
- [ ] Consumers reject unsupported effective contracts.
- [ ] Representative pathological cases have been tested.
- [ ] Views distinguish contradictions, absences, inferences and assessments.
- [ ] Maturity ladders are derived and profile-defined rather than authored on subjects.
- [ ] Coverage traversals retain edge semantics and handle cycles.
- [ ] Inferred relationships remain display-only until explicitly declared.
- [ ] View scoring formulas and planning seeds have named owners.
- [ ] Estate status and history live outside the profile.
