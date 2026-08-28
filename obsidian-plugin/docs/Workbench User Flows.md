---
title: Product Knowledge Graph Workbench User Flows
date: 2026-08-26
summary: "Primary and supporting user flows for choosing documentation work, exploring a Product Knowledge Graph estate, and safely acting from the Obsidian workbench."
summary_generated: 2026-08-26
summary_model: Codex
authority: proposed
authority_scope: product-knowledge-graph-obsidian-workbench-user-flows
status: design
created: 2026-08-26
last_verified: 2026-08-26
review_after: 2026-11-26
Type: user-flow
tags:
  - product-knowledge-graph
  - obsidian
  - plugin
  - user-flow
  - documentation-command-center
  - estate-explorer
---

# Product Knowledge Graph Workbench User Flows

## 1. Purpose

This document defines the small set of user flows that should shape the first Product Knowledge
Graph Workbench release. It focuses on decisions and transitions rather than individual controls.

The flows assume that Markdown and frontmatter remain the documentation source material, the
effective project profile defines estate semantics, and optional planning configuration defines
current priorities.

## 2. Actors and system states

The primary actor is a software designer or documentation steward working inside an Obsidian vault.

The workbench may start in one of four states:

| State | Available experience |
|---|---|
| Profile and planning loaded | Command Center and Estate Explorer |
| Profile loaded without planning | Estate Explorer; no next-best-action claim |
| Profile loaded with findings | Explorer with diagnostics and safely degraded capabilities |
| Profile unavailable or incompatible | Setup and diagnostic guidance only |

The interface must not present a confident recommendation when the planning policy or required
graph evidence is unavailable.

## 3. Primary flow: choose and begin the next documentation action

### 3.1. Intent

The user wants to spend attention on the most valuable current documentation action without first
interpreting the entire estate.

### 3.2. Preconditions

- The active project profile compiles successfully.
- The estate index is sufficiently current to support the recommendation.
- Planning policy identifies at least one active initiative or focus horizon.
- At least one eligible candidate action exists.

### 3.3. Flow

```text
Open Workbench
  ↓
Load profile, graph, planning policy, and working state
  ↓
Show one next-best-action card
  ↓
User scans action, initiative, readiness, and concise rationale
  ↓
Is the recommendation sufficiently clear and credible?
  ├─ Yes → Open existing artifact or begin approved creation flow
  └─ No  → Inspect evidence and surrounding context
             ↓
          Review objective, prerequisites, gaps, and downstream unlocks
             ↓
          Accept recommendation, choose an alternative, or record a planning decision
             ↓
          Open existing artifact or begin approved creation flow
```

### 3.4. Expected outcome

The relevant Markdown artifact is open for work, or a reviewed creation action is ready to produce
the correctly located and initialized artifact. The workbench retains the recommendation context so
the user can return without reconstructing the decision.

### 3.5. Recommendation explanation

Expanding the recommendation must answer:

1. Which configured initiative and objective does this action serve?
2. Why is this focus area eligible before other areas?
3. Which authoritative facts and configured expectations identify the gap?
4. Which prerequisites are satisfied or missing?
5. What does the action unlock or repair?
6. Which parts of the explanation are inferred, assessed, or explicitly supplied by a person?
7. Why did the nearest alternatives rank lower?

### 3.6. Alternate outcomes

#### Choose an alternative

The user opens the short alternative queue, compares explanations, and selects another action. The
workbench treats the selection as a session choice unless the user explicitly records an override.

#### Defer

The user provides a reason and, when appropriate, a review date or condition. The workbench records
the decision in planning state, recomputes eligibility, and identifies the next candidate.

#### Pin

The user makes an action the current focus. The interface identifies the recommendation as pinned
rather than computed and preserves the original ranking explanation for comparison.

#### No eligible candidate

The interface explains whether all configured objectives are complete, remaining candidates are
blocked or deferred, or the planning policy is insufficient. It does not manufacture a generic gap
and call it the next priority.

## 4. Supporting flow: explore from broad structure to source artifact

### 4.1. Intent

The user wants to understand a product area without knowing the exact artifact name or identifier.

### 4.2. Flow

```text
Open Browse
  ↓
Select a collection
  ↓
Expand its profile-defined subdivisions or structural subjects
  ↓
Select a subject
  ↓
Expand an artifact-kind group such as PRD, User Stories, FRD, or Findings
  ↓
Choose a specifically named document, finding, expected gap, or related subject
  ↓
Inspect identity and relationship context
  ↓
Open source Markdown or pivot to Traceability / Maturity
```

For MBS, one valid path is:

```text
Domain Systems
→ Body
→ Exercise Management
→ Muscle Health
→ FRD
→ Record Exercise-Set Details
→ Source Markdown
```

Equivalent paths begin from Concepts, Platform, Cross-Cut, Horizontal, or Process and expose the
specific names of their contained graph records. Browse never requires the user to infer document
names from aggregate counts.

### 4.3. Navigation behavior

- Breadcrumbs preserve structural context.
- Back and forward restore prior view, selection, filters, and scroll position.
- Disclosure state is independent from selection: expanding reveals children while selecting
  updates the inspector.
- Artifact-kind groups and their order derive from the active profile rather than MBS constants.
- Empty kind groups are hidden by default; showing expected or empty groups is an explicit view
  option.
- Large child sets load incrementally or use windowing without changing their logical hierarchy.
- Selecting a relationship follows that relationship without misrepresenting it as containment.
- Opening a source note does not discard the workbench exploration state.
- A user may save the current query and presentation as a reusable view.

## 5. Supporting flow: investigate traceability coverage

### 5.1. Intent

The user wants to understand whether product intent has the expected experience and engineering
realizations, or why the Command Center considers an action valuable.

### 5.2. Flow

```text
Open Traceability
  ↓
Choose scope: initiative, subject, capability, or artifact
  ↓
Choose presentation: pipeline, matrix, or graph
  ↓
Inspect present, expected, optional, inferred, and contradictory relationships
  ↓
Select a node, edge, or missing cell
  ↓
Read rule, evidence, provenance, and downstream impact in the inspector
  ↓
Open source, return to recommendation, or start an approved repair action
```

Changing among pipeline, matrix, and graph retains the selected scope whenever the target view can
represent it.

### 5.3. Missing artifact behavior

An expected-but-missing artifact is represented as a virtual candidate. It must display:

- the profile rule that created the expectation;
- the source artifact or subject in scope;
- whether the expectation is required, conditional, or advisory;
- downstream effects;
- any accepted-gap or deferral state;
- whether creation is supported.

It must not receive a permanent artifact identity until the approved creation workflow assigns one.

## 6. Supporting flow: explore by facet or maturity rung

### 6.1. Facet exploration

```text
Open Facets
  ↓
Select one or more profile-defined values
  ↓
Review live counts and matching subjects or artifacts
  ↓
Add, remove, or negate filters
  ↓
Inspect a result or save the composed view
```

The visible controls and values come from the compiled project profile. The interface distinguishes
a missing required facet from an artifact that legitimately does not belong to a facet category.

### 6.2. Maturity exploration

```text
Open Maturity
  ↓
Select a configured rung
  ↓
Review subjects classified there
  ↓
Select a subject
  ↓
Inspect classification evidence and the next configured rung
  ↓
Pivot to missing coverage, current recommendation, or source artifacts
```

The interface describes the rung as a configured evidence assessment, not an objective quality
grade or proof of initiative completion.

## 7. Supporting flow: inspect an estate-health finding

```text
Open Health or follow a finding badge
  ↓
Filter by contradiction, absence, inference, assessment, or review debt
  ↓
Select a finding
  ↓
Inspect affected artifacts, source locations, rule, and evidence
  ↓
Open source or begin an approved repair workflow
  ↓
Refresh and confirm whether the finding is resolved
```

Planning priority may raise the visibility of a finding, but must not change its factual class or
severity.

## 8. Supporting flow: handle profile or index failure

```text
Open Workbench
  ↓
Profile discovery, compilation, or indexing fails
  ↓
Suppress unsupported recommendations and unsafe writes
  ↓
Show the failing source, compatibility constraint, and actionable diagnostics
  ↓
User opens configuration or retries after an external correction
```

When possible, the workbench may offer read-only access to successfully compiled portions. It must
label the degraded state prominently.

## 9. First-release flow boundary

The first read-only release should support:

- opening the workbench and receiving an explainable recommendation;
- drilling from collections and structural subjects through artifact-kind groups to specifically
  named documents and findings;
- inspecting traceability through pipeline and matrix presentations;
- exploring facets and configured rungs;
- inspecting findings and source evidence;
- opening or revealing existing Markdown notes;
- preserving navigation and filter context.

Document creation, frontmatter editing, deferral, pinning, override persistence, and accepted-gap
writes require a later controlled-write design. Their positions in the flows are retained so the
read-only architecture does not prevent them.

## 10. Flow acceptance criteria

- A user can reach the recommended source artifact from startup without visiting another report.
- Every recommendation can be traced to its objective, evidence, and provenance.
- A user can move from a broad collection to an artifact without knowing its path or ID.
- The user can see concrete record names beneath Concepts, Platform, Domain, Cross-Cut,
  Horizontal, Process, subjects, and artifact-kind groups wherever the active profile provides
  those categories.
- Pipeline, matrix, Browse, Maturity, and inspector selections preserve meaningful context.
- Missing artifacts remain distinguishable from existing draft artifacts.
- Inferred relationships remain distinguishable from authoritative relationships.
- The workbench behaves usefully without planning configuration and does not claim a next-best
  action in that state.
- No read-only flow requires modification of Markdown or planning state.
