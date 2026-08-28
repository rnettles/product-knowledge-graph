---
title: Product Knowledge Graph Workbench Implementation Execution Plan
date: 2026-08-26
weekday: Wednesday
week: 2026-W35
month: 2026-08
quarter: 2026-Q3
year: 2026
week_page: "[[Week 2026-W35]]"
month_page: "[[Month 2026-08]]"
quarter_page: "[[Quarter 2026-Q3]]"
year_page: "[[Year 2026]]"
summary: "Phased execution plan for delivering the read-only Product Knowledge Graph Workbench for Obsidian and preparing a later controlled-write release."
summary_generated: 2026-08-26
summary_model: Codex
authority: authoritative
authority_scope: product-knowledge-graph-workbench-implementation
status: proposed
created: 2026-08-26
last_verified: 2026-08-26
review_after: 2026-11-26
Type: source-of-truth
tags:
  - source-of-truth
  - product-knowledge-graph
  - obsidian
  - implementation-plan
  - execution
---

# Product Knowledge Graph Workbench Implementation Execution Plan

## 1. Objective

Deliver a useful, read-only Obsidian workbench that lets a user:

1. load and diagnose a compatible Product Knowledge Graph project profile;
2. browse collections, structural subjects, artifacts, facets, and maturity rungs;
3. inspect declared, inferred, and expected traceability without confusing them;
4. receive an explainable next-best documentation action when planning policy is available;
5. open or reveal the supporting Markdown without changing graph or planning state.

The implementation must remain profile-driven. MBS is the primary acceptance estate, not a source
of hard-coded taxonomy or interface behavior.

This plan implements the approved [Workbench Design](Product%20Knowledge%20Graph%20Workbench%20Design.md),
[User Flows](Workbench%20User%20Flows.md), and [Wireframes](Workbench%20Wireframes.md).

## 2. Release boundary

### 2.1. Version 0.1: read-only validation release

Version 0.1 includes:

- explicit project entrypoint and profile discovery;
- profile compilation, compatibility checks, and diagnostics;
- Markdown indexing and automatic refresh;
- shared workbench shell, selection context, and universal inspector;
- Browse, Traceability Pipeline, Coverage Matrix, Facets, Maturity, Health, and Now views;
- explainable recommendations and a short alternative queue when planning policy exists;
- opening and revealing existing Markdown files;
- keyboard-accessible navigation and usable narrow-pane behavior;
- MBS acceptance testing and a contrasting non-MBS fixture.

Version 0.1 excludes document creation, frontmatter editing, relationship repair, pinning,
deferral, overrides, accepted-gap persistence, a free-form graph canvas, and third-party code
extensions.

### 2.2. Later controlled-write release

Write-back begins only after read-only workflows have been validated. It requires explicit file
previews, validation before persistence, recoverability, conflict handling, and separate approval
of the planning-state format.

## 3. Technical baseline

Use a standalone TypeScript package in `obsidian-plugin/`, following the official Obsidian plugin
shape:

```text
obsidian-plugin/
├─ docs/
├─ src/
│  ├─ main.ts
│  ├─ application/
│  ├─ infrastructure/
│  ├─ views/
│  ├─ components/
│  └─ styles/
├─ tests/
│  ├─ unit/
│  ├─ contract/
│  └─ integration/
├─ manifest.json
├─ versions.json
├─ package.json
├─ tsconfig.json
├─ esbuild.config.mjs
└─ styles.css
```

Implementation defaults:

- TypeScript, the Obsidian API, and esbuild;
- Obsidian `ItemView` leaves for the workbench and dense views;
- framework-independent application and view-model layers;
- native DOM rendering initially, with small reusable components;
- the existing generic PKG package bundled as a library dependency;
- no runtime dependency on Dataview;
- CSS based on Obsidian variables, with no fixed light-theme palette;
- desktop-first behavior without marking the plugin desktop-only unless an actual API constraint
  requires it.

The current official Obsidian sample plugin uses TypeScript, esbuild, `manifest.json`, and
`versions.json`; the scaffold should follow that contract without copying unrelated sample code.

## 4. Architecture boundary

```text
Obsidian vault and metadata events
              ↓
      Vault source adapter
              ↓
  Index and refresh coordinator
              ↓
 Existing PKG compiler and graph engine
              ↓
 Generic workbench query/view-model API
              ↓
 Selection store and Obsidian views
```

### 4.1. Generic package owns

- effective-profile compilation and compatibility diagnostics;
- normalized records, graph indexes, lint findings, and report computation;
- capability discovery from profile semantics;
- generic query and workbench view models;
- provenance for declared, inferred, expected, and computed evidence;
- deterministic behavior testable outside Obsidian.

### 4.2. Plugin owns

- vault discovery and Obsidian file-event coordination;
- lifecycle, settings, commands, leaves, and navigation;
- selection, filters, breadcrumbs, history, and temporary view state;
- rendering and accessibility;
- opening and revealing source notes;
- presenting diagnostics and degraded modes.

No graph rule, MBS artifact kind, collection label, facet value, or initiative name belongs in the
plugin source.

## 5. Work breakdown

### Milestone 0: decisions and executable skeleton

Deliverables:

- record ADR-001 for package and dependency boundaries;
- record ADR-002 for index ownership, caching, and refresh events;
- scaffold the TypeScript plugin package and development build;
- add manifest, version mapping, lint, type-check, test, and production-build scripts;
- load and unload a placeholder workbench view without leaked event handlers;
- document local installation into a test vault.

Exit gate:

- a clean checkout can install, type-check, test, build, and load the plugin;
- enable, disable, and reload cycles produce no console errors;
- the bundled plugin does not rely on Node-only APIs at runtime.

### Milestone 1: compiled-profile and workbench contracts

Extend the generic package before building feature views.

Deliverables:

- define a typed, serialized compiled-profile contract exposing artifact kinds, collections,
  facets, statuses, relationships, traceability views, rung models, extension properties, and
  inferred capabilities;
- retain efficient internal sets and maps while offering stable UI-safe projections;
- add plugin/core/profile compatibility diagnostics;
- define generic view models for navigation nodes, artifact summaries, virtual gaps, findings,
  evidence, matrix cells, rung classifications, and candidate actions;
- define lazy, typed child expansion for collections, subdivisions, structural subjects,
  artifact-kind presentation groups, and concrete named records;
- add named traceability-view and UI-presentation schema support required by version 0.1;
- preserve unknown extension properties for inspection;
- prove the contract with MBS and a contrasting synthetic profile.

Exit gate:

- contract tests contain no MBS-specific assertions in generic implementation code;
- the same APIs produce usable capabilities and navigation models for both profiles;
- invalid or unsupported profiles return actionable diagnostics rather than partial success;
- existing CLI, reports, dashboards, and package tests remain green.

### Milestone 2: vault indexing and diagnostics

Deliverables:

- settings for an explicit PKG entrypoint with a discover-and-confirm helper;
- vault-backed source adapter using Obsidian metadata where safe and direct file parsing where
  deterministic source text is required;
- initial scan, normalized record cache, graph build, and derived-model cache;
- debounced handling of create, modify, rename, and delete events;
- cancellation or generation checks so stale rebuilds cannot replace newer state;
- diagnostics surface showing profile identity, compatibility, adopted-document count, planning
  availability, indexing time, errors, and advisories;
- explicit states for loading, ready, empty, invalid profile, incompatible profile, and indexing
  failure.

Start with a correct debounced full rebuild. Introduce incremental graph recomputation only if the
performance gate demonstrates it is necessary.

Exit gate:

- fixture vault mutations update the workbench without a plugin reload;
- rename and deletion do not leave stale records or selections;
- malformed Markdown and profile errors are isolated and explainable;
- indexing does not modify vault files;
- the MBS estate meets the agreed startup and refresh budgets.

### Milestone 3: shared shell, Browse, and inspector

Deliverables:

- workbench command, ribbon action, and registered view;
- navigation rail with capability-based destination visibility;
- shared selection and filter context with breadcrumbs and back/forward behavior;
- collection browser and structural subject hierarchy;
- interactive tree drill-down from collections through subjects and profile-defined artifact-kind
  groups to specifically named documents and findings;
- filterable list mode for the concrete records beneath the current tree scope;
- artifact list and contextual summaries driven by compiled labels and fields;
- universal inspector for subjects, artifacts, relationships, findings, and virtual gaps;
- open-source and reveal-in-navigation actions;
- narrow-pane inspector drawer and baseline keyboard focus behavior.

Exit gate:

- a user can move from a collection to a subject to a source artifact without knowing a path or
  permanent ID;
- Concepts, Platform, Domain, Cross-Cut, Horizontal, Process, subjects, and artifact-kind groups
  reveal their concrete named children instead of ending at aggregate reports;
- collection and subject summaries never block or replace access to the underlying record list;
- unsupported destinations are absent;
- selection persists across relevant contextual pivots and clears safely after deletion;
- all inspector facts identify their source or computation provenance.

### Milestone 4: evidence exploration

Deliverables:

- traceability pipeline generated from a named traceability view;
- selectable virtual gaps without fabricated documents;
- coverage matrix with distinct present, draft, missing, not-ready, and not-expected states;
- facet explorer generated from profile definitions;
- rung explorer with evidence explanation and next-rung gaps;
- estate-health findings view using existing lint diagnostics;
- consistent visual and textual treatment for declared, inferred, expected, blocked, deferred, and
  contradictory states.

Exit gate:

- Pipeline, Matrix, Browse, Facets, Maturity, and Health preserve shared scope and selection;
- every visual state has a non-color indicator and accessible label;
- keyboard users can traverse the matrix and hear row, column, state, and count;
- rendered counts and classifications match the generic reports for identical inputs.

### Milestone 5: explainable Command Center

Deliverables:

- planning-policy loader with a clearly versioned read-only contract;
- configured initiative ordering and nested focus areas;
- candidate-action generation from graph gaps, completion policy, and planning policy;
- deterministic ranking with a structured explanation object;
- one primary next-best-action card and a short alternative queue;
- objective, evidence, provenance, confidence, and unlock details in the inspector;
- Estate Explorer behavior when planning configuration is absent.

The plan does not require perfect prioritization before usability testing. It requires transparent,
deterministic prioritization whose inputs can be challenged and refined.

Exit gate:

- every recommendation traces to configured judgment and graph evidence separately;
- equal inputs produce stable ordering;
- MBS nested priorities are expressed entirely through configuration;
- without planning policy the workbench makes no priority claim and remains useful;
- startup-to-recommended-source satisfies the primary user flow.

### Milestone 6: hardening and release candidate

Deliverables:

- accessibility pass for keyboard order, focus restoration, labels, contrast, zoom, and reduced
  motion;
- light, dark, high-contrast, normal-pane, narrow-pane, and full-workspace checks;
- performance instrumentation and large synthetic-estate tests;
- recovery tests for corrupt profiles, rapid edits, plugin reloads, and deleted selected files;
- security and privacy review confirming local-only behavior and no unintended writes or network
  calls;
- installation, settings, troubleshooting, and profile-author guidance;
- release artifacts and version compatibility map.

Exit gate:

- all automated checks pass from a clean checkout;
- scripted MBS and contrasting-profile acceptance scenarios pass;
- no known critical accessibility, data-integrity, lifecycle, or compatibility defects remain;
- the release bundle contains only required runtime assets;
- a manual read-only audit confirms that no command changes vault content.

## 6. Cross-cutting verification strategy

### 6.1. Generic package tests

- profile schema and compilation tests;
- query and view-model unit tests;
- provenance and state-distinction tests;
- deterministic recommendation and tie-break tests;
- regression tests for existing CLI reports and browser exports.

### 6.2. Plugin tests

- lifecycle and event-subscription tests;
- vault adapter and refresh-coordinator tests with an in-memory or fixture-backed vault boundary;
- application-state reducer/store tests;
- component tests for empty, loading, error, and selected states;
- keyboard and accessible-name tests where the DOM harness supports them.

### 6.3. Contract tests

Persist small, reviewable expected models for:

- the MBS reference scenario;
- a deliberately different profile with different collections, facets, vocabulary, and
  traceability stages;
- invalid and forward-incompatible profiles;
- an estate with inferred relationships, expected gaps, contradictions, and stale reviews.

Avoid large snapshots of rendered HTML. Assert semantic models, key accessible text, and important
state transitions.

### 6.4. Manual acceptance scripts

Run the approved user flows in a controlled test vault at the end of Milestones 3, 4, 5, and 6.
Record observed friction and resolve design changes in the source design documents before changing
the implementation contract.

## 7. Performance and quality budgets

Establish measured baselines during Milestone 2 and ratify exact thresholds in ADR-002. Initial
targets are:

- no long synchronous work on the Obsidian UI thread;
- visible loading or progress feedback for work exceeding 200 milliseconds;
- a debounced file change becomes visible within 1 second on the MBS estate;
- cached view changes feel immediate and avoid rebuilding the graph;
- large lists and matrices use windowing or pagination when measurement justifies it;
- all graph traversal remains cycle-safe and deterministic.

Correctness takes precedence over premature incremental complexity. A full rebuild that meets the
budget is preferable to an unproven incremental index.

## 8. Delivery sequence and dependency map

```text
M0 Skeleton
   ↓
M1 Contracts ───────────────┐
   ↓                        │
M2 Index and diagnostics    │
   ↓                        │
M3 Shell, Browse, Inspector │
   ↓                        │
M4 Evidence views           │
   ↓                        │
M5 Command Center ◀─────────┘
   ↓
M6 Hardening and RC
```

Milestones are acceptance increments, not parallel feature silos. A milestone closes only when its
exit gate passes. UI styling, accessibility, documentation, and tests are part of each increment,
not a final cleanup phase.

## 9. Issue slicing

Implementation issues should normally fit one reviewable vertical or contract slice. Create the
initial backlog in this order:

1. plugin package and lifecycle skeleton;
2. ADR-001 package boundary;
3. ADR-002 index and refresh model;
4. serialized compiled-profile contract;
5. capability discovery and compatibility diagnostics;
6. generic navigation and inspector view models;
7. contrasting profile fixture;
8. vault adapter and full-rebuild coordinator;
9. diagnostics view and failure states;
10. shared shell and selection store;
11. Browse drill-down vertical slice from collection through a named record to source-note opening;
12. universal inspector variants;
13. traceability pipeline vertical slice;
14. coverage matrix vertical slice;
15. facets, maturity, and health slices;
16. planning-policy contract and candidate actions;
17. recommendation explanation and alternatives;
18. performance, accessibility, and release hardening.

Each issue must name its user-visible outcome, profile/core contract change, acceptance tests, and
documentation impact. Avoid issues such as “build UI” that cannot be independently accepted.

## 10. Decision and ADR schedule

Create an ADR only when the implementation is ready to commit to a consequential choice.

Required before Milestone 1 closes:

- ADR-001: package, bundling, and plugin-to-core dependency boundary;
- ADR-002: index ownership, cache invalidation, and refresh strategy.

Required before Milestone 5 closes:

- ADR-003: planning policy and planning-state locations and versioning;
- ADR-004 only if a UI framework is introduced after the native prototype.

Required before any write-back implementation:

- ADR-005: authoritative write transaction, preview, validation, conflict, and recovery model.

## 11. Risks and mitigations

| Risk | Mitigation and trigger |
|---|---|
| MBS behavior leaks into plugin code | Contrasting-profile contract suite runs from Milestone 1 onward. |
| Current profile compiler is too report-oriented | Stabilize serialized UI contracts before feature UI work. |
| Recommendation policy becomes opaque | Require structured explanations and deterministic ranking tests. |
| Vault events cause stale or repeated rebuilds | Centralize refresh coordination, debounce, and reject stale generations. |
| Dense matrices perform poorly | Measure first; add windowing only when the agreed budget is exceeded. |
| Inference is mistaken for graph truth | Carry provenance in view models and use redundant visual semantics. |
| Obsidian lifecycle leaks listeners or leaves | Register all resources through one disposable lifecycle boundary and test reloads. |
| Write features creep into version 0.1 | Enforce a read-only API boundary and audit commands before release. |
| Profile evolution breaks older projects | Version contracts, diagnose unsupported features, and preserve safe read-only degradation. |

## 12. Definition of done for version 0.1

Version 0.1 is done when:

- the primary and supporting read-only user flows pass in MBS;
- the same plugin works against the contrasting profile without source changes;
- all recommendations and graph states are explainable and provenance-preserving;
- automatic refresh is correct under create, modify, rename, and delete events;
- accessibility and performance gates pass;
- existing generic package behavior has no regressions;
- installation and troubleshooting documentation is complete;
- the built plugin has been exercised in a clean test vault;
- the release contains no authoritative or planning-state write path.

## 13. First execution step

Begin with Milestone 0 and the smallest end-to-end proof:

1. scaffold and load the plugin;
2. consume the current generic package in the browser bundle;
3. compile one fixture profile;
4. render profile identity and diagnostics in an Obsidian view;
5. reload after a profile edit;
6. lock the resulting package and index boundaries into ADR-001 and ADR-002.

This spike proves the highest-risk integration seam before the full compiled-profile contract or
workbench interface is expanded.
