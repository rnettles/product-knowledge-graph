---
title: Product Knowledge Graph Workbench Design
date: 2026-08-26
summary: "Product and architecture design for a profile-driven Obsidian workbench that combines explainable documentation prioritization with modern exploration of a Product Knowledge Graph estate."
summary_generated: 2026-08-26
summary_model: Codex
authority: proposed
authority_scope: product-knowledge-graph-obsidian-workbench
status: design
created: 2026-08-26
last_verified: 2026-08-26
review_after: 2026-11-26
Type: design
tags:
  - product-knowledge-graph
  - obsidian
  - plugin
  - documentation-command-center
  - estate-explorer
  - design
---

# Product Knowledge Graph Workbench Design

## 1. Purpose

The Product Knowledge Graph Workbench is a proposed Obsidian plugin for navigating and managing a
frontmatter-based software design documentation estate.

It combines two connected experiences:

1. **Documentation Command Center** — answers what documentation action is most valuable now, why
   it is recommended, and what it unlocks.
2. **Estate Explorer** — provides modern, context-preserving navigation through collections,
   subjects, artifacts, traceability, facets, maturity rungs, and estate health.

The workbench is generic and profile-driven. It understands Product Knowledge Graph primitives and
extension contracts; a project profile supplies the project's taxonomy, representations, policies,
and display vocabulary. MBS is the first reference project, not a hard-coded product model.

This document defines the product direction and design boundaries. It does not approve an
implementation framework or authorize write-back behavior.

Supporting interaction designs:

- [Workbench User Flows](Workbench%20User%20Flows.md)
- [Workbench Wireframes](Workbench%20Wireframes.md)
- [Workbench Implementation Execution Plan](Workbench%20Implementation%20Execution%20Plan.md)

## 2. User outcome

The workbench should reduce the cost of answering two questions:

> What is the single most valuable design-documentation action to take now?

> What exists in the estate, how is it organized, and how does it connect?

A user should be able to open the workbench, understand the current recommendation, inspect its
evidence, navigate its surrounding subject and traceability context, and begin work without first
interpreting several independent reports.

## 3. Design principles

1. **Markdown and frontmatter remain durable source material.** The plugin is an interface over the
   estate, not a replacement database.
2. **Graph truth and planning judgment remain separate.** Missing relationships, declared
   dependencies, and artifact coverage are facts or graph findings. Initiative order, relative
   value, deferral, and completion policy are planning decisions.
3. **Recommendations are explainable.** The interface identifies the configured objective, graph
   evidence, computed assessment, and human input behind a recommendation.
4. **The default view reduces attention cost.** One recommended action is dominant before the full
   estate and alternative queue are exposed.
5. **Navigation preserves relationship meaning.** Structural containment, realization,
   dependency, assurance authority, and display-only inference remain visually distinct.
6. **Project semantics come from compiled profiles.** Plugin code does not hard-code MBS artifact
   kinds, collections, facets, rungs, or traceability stages.
7. **Capabilities degrade safely.** Projects without planning or rung configuration still receive
   the exploration features their profiles support.
8. **Writes are deliberate and reviewable.** The plugin never silently turns inferred evidence
   into authoritative frontmatter.

## 4. Product structure

The proposed product name is **Product Knowledge Graph Workbench for Obsidian**. The Documentation
Command Center is its planning-focused home view; the Estate Explorer is its broader navigation and
analysis environment.

Primary destinations are:

1. **Now** — the dominant next-best action and its explanation.
2. **Initiatives** — ordered objectives, nested focus areas, and completion criteria.
3. **Browse** — collections, structural subjects, and artifacts.
4. **Traceability** — pipeline, relationship graph, and coverage matrix.
5. **Facets** — multidimensional filtering and comparison.
6. **Maturity** — interactive configured rung models.
7. **Health** — contradictions, metadata findings, and review debt.
8. **Saved Views** — reusable queries and focused workspaces.

Collections and subjects are related Browse modes rather than mandatory separate top-level
destinations.

## 5. Application shell

The workbench uses a stable three-region shell:

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Product Knowledge Graph Workbench   Search…          Estate Health │
├───────────────┬─────────────────────────────────────┬───────────────┤
│ NAVIGATION    │                                     │ INSPECTOR     │
│               │          PRIMARY VIEW               │               │
│ Now           │                                     │ Identity      │
│ Initiatives   │                                     │ Relationships │
│ Browse        │                                     │ Coverage      │
│ Traceability  │                                     │ Evidence      │
│ Facets        │                                     │ Issues        │
│ Maturity      │                                     │ Actions       │
│ Health        │                                     │               │
└───────────────┴─────────────────────────────────────┴───────────────┘
```

Selecting a subject, artifact, relationship, expected gap, collection, facet value, or rung updates
the shared inspector. Breadcrumbs, back and forward history, saved views, and pinned tabs preserve
exploration context.

## 6. Documentation Command Center

### 6.1. Next-best-action card

The home view leads with one recommended action:

```text
NEXT BEST ACTION

Create: Muscle Health Functional Requirements
Initiative: Exercise Management
Objective: Begin priority sub-module

Why now:
• Muscle Health is the first configured focus within Exercise Management.
• Relevant user-facing intent exists, but functional behavior is incomplete.
• Completing this action enables experience and engineering realization work.

Readiness: Ready        Confidence: High

[Open/Create]  [Show evidence]  [Defer]  [Choose alternative]
```

The card displays the provenance of each reason:

- **Declared fact** — authoritative frontmatter or profile configuration;
- **Configured judgment** — initiative order, focus, or completion policy;
- **Computed assessment** — readiness, gap, downstream impact, or ranking result;
- **Display inference** — non-authoritative relationship hypothesis;
- **Human assessment** — effort, risk, override, or other explicit judgment.

The interface should prefer a concise reason hierarchy to a context-free numeric score.

### 6.2. Initiative roadmap

Initiatives may contain ordered focus areas. They are not limited to a flat priority taxonomy.

The initial MBS planning sequence is:

```text
1. Health Records System                    CLOSE OUT

2. Exercise Management                     BEGIN NEXT
   ├─ Muscle Health                         FIRST FOCUS
   ├─ Facility, Equipment, and Device Mgmt  SECOND FOCUS
   └─ Other Exercise Management subjects    LATER

3. Cross-Cutting Concerns                   FINISH AFTERWARD
```

Muscle Health and Facility, Equipment, and Device Management are sub-modules of Exercise
Management, not peer initiatives. Existing ancestry-based priority rules may place both within the
Exercise Management priority, but do not express their internal order.

Each initiative or focus area should show:

- objective and current state;
- entry and exit criteria;
- graph-backed progress;
- blockers and accepted gaps;
- next recommended action;
- whether ordering and completion evidence were configured or computed.

### 6.3. Candidate actions

A recommendation is an action, not necessarily a missing file. Candidate actions include:

- create a missing artifact;
- expand or revise an inadequate artifact;
- repair a missing authoritative relationship;
- resolve a contradiction;
- review or ratify an existing artifact;
- explicitly defer or accept an optional gap.

### 6.4. Recommendation process

The initial decision model should be staged and explainable:

1. Select the highest ordered initiative that is neither complete nor legitimately blocked.
2. Select the highest ordered eligible focus area within that initiative.
3. Evaluate the initiative objective against its entry or exit criteria.
4. Generate candidate actions for unsatisfied criteria and material estate findings.
5. Exclude candidates blocked by unsatisfied prerequisites or active deferrals.
6. Rank remaining candidates by configured importance and graph-derived impact.
7. Present one global recommendation and a short alternative queue.

Potential ranking evidence includes:

- initiative and focus order;
- whether an action satisfies a blocking completion criterion;
- prerequisite readiness;
- number and importance of downstream artifacts unlocked;
- risk reduced;
- traceability restored;
- contradiction or review severity;
- explicitly assessed effort;
- confidence and evidence quality.

Ranking mechanisms belong to the generic package. Weights, objectives, and definitions of value
belong to project planning configuration.

## 7. Estate Explorer

### 7.1. Browse collections and subjects

The Browse view is an interactive, profile-driven document navigator. It must not stop at a static
collection summary. Every collection, structural subject, artifact-kind group, and concrete graph
record is drillable when it has children or a source document.

The primary navigation progression is:

```text
Collection
  → optional collection subdivision
  → structural subject hierarchy
  → artifact-kind group
  → specifically named artifact or finding
  → source Markdown and relationship context
```

For example, a user can expand `Domain Systems`, navigate through `Body` and `Exercise
Management`, expand `Muscle Health`, then expand `PRD`, `User Stories`, `FRD`, or `Findings` to see
the actual titles and identities of the records in that group. `Concepts`, `Platform`, `Cross-Cut`,
`Horizontal`, and `Process` expose their own profile-defined contents and concrete documents using
the same navigation model.

Artifact-kind nodes are presentation groups, not fabricated graph nodes. Their labels and ordering
come from the compiled profile. A project with different kinds receives different groups without a
plugin code change. Empty groups are hidden by default, with an optional control to show expected
or empty groups where that distinction is useful.

Each expandable row shows a disclosure control, profile label, concrete name, and optional count or
state badge. Selecting a row updates the inspector without forcing expansion; expanding a row loads
or reveals its direct children. Selecting a concrete document offers `Open note` and `Reveal in file
navigation` actions. Findings without a source note remain selectable derived records whose
inspector links to their evidence sources.

The center pane may show a contextual summary alongside the navigator, including:

- subject and artifact counts;
- distribution across configured rungs;
- active initiative membership;
- missing or contradictory metadata;
- review freshness;
- highest-value outstanding action.

These summaries support orientation but never replace the drill-down list of named records.

For MBS, Domain Systems can expose hierarchy such as:

```text
Domain Systems
└─ Body
   ├─ Health Records System
   └─ Exercise Management
      ├─ Muscle Health
      │  ├─ PRD
      │  │  └─ Muscle Health Product Requirements
      │  ├─ User Stories
      │  │  ├─ Track strength-training activity
      │  │  └─ Review muscle-health progress
      │  ├─ FRD
      │  │  └─ Record exercise-set details
      │  └─ Findings
      │     └─ Missing progress-review flow
      └─ Facility, Equipment, and Device Management
```

Concepts receive an inventory-oriented presentation. A concept may show where it is referenced and
which subjects use it without treating every unconnected concept as an urgent delivery gap. The
user can still expand the Concepts collection to see each specifically named concept document and
open it directly.

### 7.2. Traceability Explorer

The interface distinguishes:

- **realization pairs** — which source kinds a given artifact kind may realize;
- **expected children** — which downstream artifacts are normally expected for coverage.

Three complementary traceability views are proposed.

#### Pipeline

A pipeline explains one subject or capability through configured stages:

```text
Capability
    ↓
Product Requirement
    ↓
User Story
    ↓
Functional Requirement
    ├─ User Flow
    ├─ Wireframe
    └─ Technical Design
```

Nodes distinguish present, draft, missing-and-expected, optional, inferred, contradictory, and
intentionally deferred states. Selecting a missing node explains the rule that expected it, the
affected source artifacts, and the work it would unlock.

#### Relationship graph

The graph view displays structural, realization, dependency, assurance, and inferred edges with
different visual treatments. Display-only inference uses an unmistakably non-authoritative style
such as dashed lines and an inference badge.

#### Coverage matrix

The matrix compares coverage across many subjects or capability identities. Cells are interactive
and identify whether evidence is authoritative, inferred, missing, optional, draft, or deferred.

The graph emphasizes topology; the matrix emphasizes comparative coverage. Both consume the same
compiled graph and report models.

### 7.3. Facet Explorer

Facets are browsable project-defined dimensions, not only advanced filters. The interface builds
controls dynamically from the effective profile and supports cross-filtering, result counts, and
removable filter chips.

For MBS, initial facets include domain, application surface, and application layer. Another project
may define market, device family, safety class, deployment boundary, or other dimensions without a
plugin code change.

A missing required facet is a metadata finding. Absence from a particular facet category is not
itself a gap.

### 7.4. Maturity and rungs

The Maturity view renders each configured rung model interactively. Selecting a rung exposes:

- subjects classified at that rung;
- evidence supporting the classification;
- next configured action;
- evidence missing from later rungs;
- the effect of skipped-rung policy;
- planning and initiative context.

A rung is a configured evidence projection, not a universal measure of documentation quality or a
complete definition of initiative completion.

### 7.5. Universal inspector

The inspector gives every view a common interaction language.

For an artifact it can show identity, kind, authority, owner, review state, structural placement,
facets, relationships, expected gaps, findings, planning relevance, and source-file actions.

For a subject it can show structural path, initiative position, rung, completion state, artifact
inventory, traceability coverage, facet distribution, blockers, and the recommended action.

For an expected-but-missing artifact, it represents a virtual candidate without pretending a
Markdown file already exists.

### 7.6. Search and saved views

Universal search covers titles, aliases, permanent IDs, subjects, embedded capability identities,
collections, artifact kinds, facet values, initiatives, and findings.

Visual filters may generate a composable query language, for example:

```text
kind:frd subject:"Muscle Health"
collection:domain-systems rung:sketched
facet.domain:body missing:wireframe
initiative:"Exercise Management" status:draft
has:contradiction
review:stale
```

Saved views preserve query, grouping, sort, view type, and selected columns. Project profiles may
ship presets, while users may create personal or project-owned views.

## 8. State and authority model

The workbench separates five classes of state:

| State | Examples | Owner |
|---|---|---|
| Graph truth | identity, kind, subject, declared relationships | Markdown frontmatter |
| Project semantics | artifact kinds, facets, rungs, expected relationships | Project profile |
| Planning policy | initiative order, focus areas, completion rules | Project planning configuration |
| Working decisions | pin, defer, override, accepted gap | Project or user planning state |
| Derived evidence | ranking, gaps, unlocks, confidence | Generic computation |

Temporary values such as `next: true` or a context-sensitive `priority: high` should not be copied
onto every documentation artifact. Durable artifact facts remain in frontmatter; changing planning
decisions remain in planning files.

## 9. Completion semantics

The workbench requires project-configurable definitions for planning verbs.

### 9.1. Begin

An initiative has begun when its configured foundation exists. Possible evidence includes framing,
boundaries, capability identity, initial user-facing intent, and absence of a blocking contradiction.

### 9.2. Finish

An initiative is finished when its declared required coverage and traceability policies are
satisfied, blocking contradictions are absent, and required artifacts meet authority and review
policy.

### 9.3. Close out

Close-out is stronger than artifact presence. It may require finish criteria, disposition of known
optional gaps, acceptable review debt, resolution or waiver of contradictions, and an explicit
closure assessment.

The existing Scope Ladder may contribute evidence to these policies but does not define them by
itself.

## 10. Profile-driven extensibility

### 10.1. Responsibility boundary

```text
Product Knowledge Graph core
        ↓
effective project profile compiler
        ↓
generic workbench view models
        ↓
Obsidian plugin interface
```

The generic core owns identities, graph semantics, traversal, validation, inference provenance,
rung evaluation mechanisms, queries, and explainable evidence.

Each project profile owns artifact vocabulary, collections, facets, statuses, representations,
realization rules, expected relationships, rungs, source policies, and taxonomy extensions.

Planning configuration owns initiatives, focus order, objectives, completion policies, ranking
preferences, and project-shared working state.

The Obsidian plugin owns interaction, presentation, navigation history, safe editing workflows, and
coordination with the generic computation layer.

### 10.2. Compiled profile contract

The plugin should consume a normalized compiled profile rather than interpret MBS YAML throughout
the UI. A conceptual contract is:

```ts
interface CompiledProjectProfile {
  identity: IdentityPolicy;
  artifactKinds: ArtifactKindDefinition[];
  collections: CollectionDefinition[];
  facets: FacetDefinition[];
  statuses: StatusDefinition[];
  relationships: RelationshipDefinition[];
  traceabilityViews: TraceabilityViewDefinition[];
  rungModels: RungModelDefinition[];
  extensionProperties: PropertyDefinition[];
  capabilities: ProfileCapabilities;
  planning?: PlanningDefinition;
}
```

Compilation provides a stable interface boundary and actionable diagnostics when a profile is not
valid or compatible.

### 10.3. Capability discovery

The workbench enables destinations according to compiled profile capabilities:

- Facets requires one or more facet definitions.
- Maturity requires a rung model.
- Traceability requires realization or expected-relationship configuration.
- Capability Matrix requires a configured capability representation.
- Command Center requires planning policy.
- Planning actions require writable planning state.

Unsupported views are omitted rather than rendered empty. Read-only exploration may remain
available when incompatible features prevent safe writes.

### 10.4. Named traceability views

Projects should be able to define one or more named traceability projections from generic graph
semantics. This supports software delivery, assurance, data lineage, or other project-specific
topologies without custom plugin code.

### 10.5. Extension-property presentation

Profile extension properties may optionally declare display behavior such as label, editor type,
filterability, sortability, searchability, badge treatment, and inspector placement. The plugin
must preserve unknown properties even when it cannot offer a specialized editor.

Common declarative types should include string, number, boolean, date, enumeration, reference,
reference list, URL, and Markdown text.

### 10.6. Declarative and code extension levels

Declarative configuration should cover taxonomies, facets, relationships, rungs, columns, filters,
saved views, completion policies, ranking inputs, templates, and inspector fields.

A future controlled code API may support specialized view providers, inspector panels, ranking
signals, candidate actions, field editors, and commands. It should be introduced only after a real
project requirement cannot be represented declaratively.

## 11. Project and planning discovery

The plugin should resolve an explicit Product Knowledge Graph entrypoint, such as the project's
existing `current.yaml`, rather than guess among files matching `*-profile.yaml`.

The loading sequence is:

1. Resolve the active core schema and project profile.
2. Check core, profile, convention, and plugin compatibility.
3. Compile and validate the effective profile.
4. Scan Markdown using the compiled source policy.
5. Build graph indexes and derived view models.
6. Load optional planning policy and working state.
7. Advertise available UI capabilities.

The plugin settings and diagnostics view should identify the active profile, compatibility range,
adopted document count, planning availability, indexing state, and profile errors or advisories.

## 12. Write interactions

Potential controlled writes include:

- creating an expected artifact from a project template;
- prefilling identity, kind, subject, collection, facets, and relationships;
- adding or repairing an authoritative relationship after confirmation;
- editing known frontmatter through a validated form;
- recording a pin, deferral, override, or accepted gap in planning state;
- opening the source Markdown for unconstrained editing.

Every authoritative write should preview the affected file and proposed change. The plugin must not
silently persist inferred relationships. Write behavior remains a design topic requiring explicit
approval before implementation.

## 13. Generic and project-specific responsibilities

| Concern | Generic package | Project profile | Planning configuration | Plugin |
|---|---:|---:|---:|---:|
| Graph semantics | Owns | Specializes |  | Consumes |
| Artifact vocabulary | Mechanism | Owns |  | Renders |
| Collections and facets | Mechanism | Owns |  | Renders |
| Traceability rules | Engine | Configures |  | Visualizes |
| Rung evaluation | Engine | Configures |  | Visualizes |
| Initiative and focus order | Mechanism |  | Owns | Manages |
| Completion policy | Evaluator | Optional defaults | Owns | Explains |
| Pin, defer, and override | Model |  | Owns state | Edits |
| Markdown normalization | Owns adapters | Configures source policy |  | Coordinates |
| Modern interaction |  | Optional presets | Optional presets | Owns |

## 14. Minimum high-value product

The first valuable version should prove prioritization and navigation together:

1. Profile discovery, compilation, and compatibility diagnostics.
2. Drill from collections and structural subjects through profile-defined artifact groups to
   specifically named documents and findings.
3. Universal inspector for subjects, artifacts, and virtual gaps.
4. Traceability pipeline and coverage matrix.
5. Interactive rung explorer.
6. One explainable next-best-action card.
7. Ordered initiatives with nested focus areas.
8. A short alternative queue.
9. Open or reveal existing Markdown artifacts.
10. Automatic refresh after relevant frontmatter changes.

A free-form graph visualization, document creation, and planning-state writes are valuable but need
not precede validation of the core workflow.

## 15. Design phases

### Phase 1: Decision model

- define begin, finish, close-out, defer, accepted gap, and complete;
- define initiative and nested focus semantics;
- define candidate-action generation and explanation;
- identify required versus optional planning state.

### Phase 2: Information architecture prototype

- prototype the application shell and universal inspector;
- validate Browse, Traceability, Maturity, and Now flows against MBS;
- test whether one global recommendation plus per-initiative candidates is sufficient;
- validate concept-inventory behavior and inferred-edge presentation.

### Phase 3: Technical architecture

- select the Obsidian view and rendering approach;
- define compiled-profile and view-model APIs;
- define indexing, caching, and incremental refresh behavior;
- decide package boundaries between the generic core and plugin;
- define safe degradation and compatibility behavior.

### Phase 4: Read-only implementation

- implement discovery, indexing, navigation, diagnostics, and explainable views;
- compare results with existing generic reports and MBS dashboards;
- validate performance on the MBS estate and at least one contrasting fixture profile.

### Phase 5: Controlled write-back

- add document creation and validated frontmatter editing;
- add planning-state actions;
- introduce previews, rollback strategy, and write-safety tests.

## 16. Open decisions

1. What exact evidence closes out Health Records System?
2. What minimum evidence means Exercise Management and Muscle Health have genuinely begun?
3. Should the home view expose one global recommendation and one secondary recommendation per
   active initiative?
4. Which ranking inputs are explicitly maintained and which are computed?
5. Where should shared planning policy, shared state, and personal view state live?
6. Which planning actions require durable rationale, expiration, or review dates?
7. Which document-creation and editing capabilities belong in the first writable release?
8. What profile schema additions are necessary for named traceability views and UI presentation?
9. Which second project or synthetic profile should prove that MBS behavior is not hard-coded?
10. What accessibility, keyboard-navigation, mobile, and large-estate performance requirements must
    constrain the interface architecture?

## 17. Acceptance criteria for the next design stage

The design is ready for an implementation plan when:

- the opening-to-action user workflow is precise;
- planning terms and state transitions are defined;
- graph evidence and configured judgment remain inspectably separate;
- the MBS nested initiative sequence is represented without special-case UI code;
- Browse, Traceability, Facets, Maturity, and the universal inspector have validated interaction
  models;
- Browse exposes the concrete named records beneath every supported collection and subject rather
  than ending at an aggregate summary;
- the effective-profile contract and capability-discovery rules are agreed;
- a second profile demonstrates taxonomy extensibility;
- the boundary among generic package, project profile, planning configuration, and plugin is clear;
- the read-only first release and later write-back scope are explicitly accepted.
