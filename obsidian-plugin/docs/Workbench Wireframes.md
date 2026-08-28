---
title: Product Knowledge Graph Workbench Wireframes
date: 2026-08-26
summary: "Annotated low-fidelity wireframes for the Documentation Command Center, estate browsing, traceability, and maturity experiences in the Obsidian workbench."
summary_generated: 2026-08-26
summary_model: Codex
authority: proposed
authority_scope: product-knowledge-graph-obsidian-workbench-wireframes
status: design
created: 2026-08-26
last_verified: 2026-08-26
review_after: 2026-11-26
Type: wireframe
tags:
  - product-knowledge-graph
  - obsidian
  - plugin
  - wireframe
  - documentation-command-center
  - estate-explorer
---

# Product Knowledge Graph Workbench Wireframes

## 1. Purpose

These low-fidelity wireframes test information hierarchy, navigation, and interaction boundaries.
They are intentionally visual-framework neutral and do not prescribe colors, typography, component
libraries, or an Obsidian rendering API.

The wireframes cover the minimum connected experience: choose work, browse the estate, inspect
traceability, and understand maturity. Health, search results, settings, and write-back dialogs can
reuse the same application shell after the core interaction model is validated.

## 2. Shared application shell

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PKG Workbench     [ Search title, ID, subject, query…             ]  ● Ready │
├──────────────┬───────────────────────────────────────────────┬───────────────┤
│ NAVIGATION   │ BREADCRUMB / VIEW CONTROLS                    │ INSPECTOR     │
│              ├───────────────────────────────────────────────┤               │
│ Now          │                                               │ Changes with  │
│ Initiatives  │                                               │ the selected  │
│ Browse       │                 PRIMARY VIEW                  │ item, edge,   │
│ Traceability │                                               │ cell, gap, or │
│ Facets       │                                               │ finding.      │
│ Maturity     │                                               │               │
│ Health       │                                               │               │
│              │                                               │               │
│ Saved Views  │                                               │               │
│ Settings     │                                               │               │
└──────────────┴───────────────────────────────────────────────┴───────────────┘
```

Annotations:

1. Primary navigation remains stable across views.
2. Search is global and supports plain text before exposing structured query syntax.
3. The status indicator reveals active profile, index freshness, and diagnostics.
4. The inspector is selection-driven and collapsible when workspace width is constrained.
5. Breadcrumbs represent the active navigation path, not every graph relationship.
6. View controls hold scope, presentation, grouping, sort, and saved-view actions.

## 3. Now: Documentation Command Center

```text
┌──────────────┬───────────────────────────────────────────────┬───────────────┐
│ Now        ● │ Documentation Command Center                  │ RECOMMENDATION│
│ Initiatives  │                                               │ EVIDENCE      │
│ Browse       │ ┌───────────────────────────────────────────┐ │               │
│ Traceability │ │ NEXT BEST ACTION                          │ │ Objective     │
│ Facets       │ │                                           │ │ Begin priority│
│ Maturity     │ │ Create Muscle Health Functional Reqts.    │ │ sub-module    │
│ Health       │ │ Exercise Management › Muscle Health       │ │               │
│              │ │                                           │ │ Configured    │
│ Saved Views  │ │ Ready · High confidence                   │ │ • Focus #1    │
│              │ │                                           │ │               │
│              │ │ Why now                                   │ │ Graph facts   │
│              │ │ • First configured focus area             │ │ • Stories     │
│              │ │ • User intent exists; behavior is missing │ │   present     │
│              │ │ • Unlocks flow, wireframe, and TDN work   │ │ • FRD absent  │
│              │ │                                           │ │               │
│              │ │ [Open/Create] [Evidence] [Alternatives]   │ │ Assessment    │
│              │ └───────────────────────────────────────────┘ │ • Ready       │
│              │                                               │ • Unlocks 3    │
│              │ INITIATIVE ROADMAP                            │               │
│              │ ✓ Health Records              Close out 4/5  │ [Traceability]│
│              │ ● Exercise Management         Begin next     │ [Open source] │
│              │   1 Muscle Health             Current focus  │               │
│              │   2 Facility / Equipment      Queued         │               │
│              │ ○ Cross-Cutting Concerns      Finish later   │               │
│              │                                               │               │
│              │ ALTERNATIVES                                  │               │
│              │ 2. Review Muscle Health user stories         │               │
│              │ 3. Resolve Health Records closure gap        │               │
└──────────────┴───────────────────────────────────────────────┴───────────────┘
```

Annotations:

1. One action dominates; the alternative queue remains visible but subordinate.
2. Initiative order and nested focus order are visible without flattening the hierarchy.
3. The inspector separates configured judgment, graph facts, and computed assessment.
4. “Open/Create” must become “Open” in a read-only release when no artifact exists and creation is
   unavailable; the interface then offers template or path guidance without writing.
5. Selecting an initiative changes the inspector and may open the Initiatives view without losing
   the current recommendation.

## 4. Browse: interactive collection-to-document drill-down

```text
┌──────────────┬───────────────────────────────────────────────┬───────────────┐
│ Now          │ Browse / Domain / Body / Exercise / Muscle    │ DOCUMENT      │
│ Initiatives  │ [Tree●] [List]  [Filter…] [Show empty kinds] │               │
│ Browse     ● │                                               │ Muscle Health │
│ Traceability │ COLLECTIONS       SUBJECTS AND DOCUMENTS      │ Product Req.  │
│ Facets       │ ┌──────────────┐  ▼ Body                      │               │
│ Maturity     │ │ Concepts  42 │  ├─ Health Records System    │ Initiative    │
│ Health       │ │ Platform  18 │  ▼ Exercise Management      │ Exercise Mgmt │
│              │ │ Domain    96 │    ▼ Muscle Health           │ Focus #1      │
│ Saved Views  │ │ Cross-Cut 31 │      ▼ PRD (1)                │               │
│              │ │ Horizontal 8 │        Muscle Health PRD   ● │ Identity      │
│              │ │ Process   24 │      ▶ User Stories (4)      │ PRD-MH-001    │
│              │ └──────────────┘      ▶ FRD (2)               │               │
│              │                       ▶ Findings (2)          │ Relationships │
│              │                     ▶ Facility & Equipment    │ 4 stories     │
│              │                                               │               │
│              │                     Selected: named document │ [Open note]   │
│              │                     [Coverage] [Relationships]│ [Reveal file] │
└──────────────┴───────────────────────────────────────────────┴───────────────┘
```

Annotations:

1. The collection rail is only the first drill-down level. The adjacent tree continues through
   subdivisions, subjects, profile-defined artifact-kind groups, and specifically named records.
2. Disclosure and selection are separate actions. A disclosure control reveals children; selecting
   any row updates the universal inspector.
3. Artifact-kind groups such as PRD, User Stories, FRD, and Findings are derived from the profile.
   They organize real records but do not become graph nodes.
4. Collection counts and summaries aid scanning but never substitute for the named document list.
5. Concepts, Platform, Domain, Cross-Cut, Horizontal, and Process use the same drill-down mechanism
   while retaining collection-appropriate summaries.
6. A concrete document can be opened or revealed directly. A derived finding instead links to its
   evidence sources.
7. List mode flattens the current tree scope into filterable named records without losing the
   collection and subject breadcrumb.

## 5. Traceability: pipeline view

```text
┌──────────────┬───────────────────────────────────────────────┬───────────────┐
│ Now          │ Traceability / Muscle Health                  │ EXPECTED GAP  │
│ Initiatives  │ [Pipeline●] [Matrix] [Graph]  Scope: Subject │               │
│ Browse       │                                               │ Functional    │
│ Traceability●│ Capability / PRD                              │ Requirement   │
│ Facets       │          │                                    │               │
│ Maturity     │          ▼                                    │ Expected by   │
│ Health       │ ┌─────────────────┐                            │ profile rule  │
│              │ │ User Story 001  │ Active                    │ user-story →  │
│ Saved Views  │ └────────┬────────┘                            │ frd           │
│              │          │                                    │               │
│              │          ▼                                    │ Source        │
│              │ ┌ ─ ─ ─ ─ ─ ─ ─ ┐                            │ US-MH-001     │
│              │   Expected FRD    │ Missing                 ● │               │
│              │ └ ─ ─ ─ ┬ ─ ─ ─ ┘                            │ Impact        │
│              │      ┌───┴────────────┐                       │ Blocks flow,  │
│              │      ▼                ▼                       │ wireframe, TDN│
│              │ [User Flow]      [Wireframe]                  │               │
│              │  unavailable      unavailable                 │ Provenance    │
│              │                                               │ Configured    │
│              │ Legend: ━ declared  ┄ inferred  □ expected   │ expectation   │
│              │                                               │               │
│              │                                               │ [Open source] │
└──────────────┴───────────────────────────────────────────────┴───────────────┘
```

Annotations:

1. A missing expected artifact is a selectable virtual node, not a fabricated document.
2. Declared, inferred, and expected relationships use redundant visual signals: line style, label,
   icon, and accessible text—not color alone.
3. The inspector states the exact rule and evidence behind the expectation.
4. Downstream nodes unavailable because of a prerequisite are visually different from independently
   missing nodes.
5. Switching to Matrix or Graph preserves Muscle Health as the scope.

## 6. Traceability: coverage matrix

```text
┌──────────────┬───────────────────────────────────────────────┬───────────────┐
│ Now          │ Traceability / Exercise Management            │ CELL DETAILS  │
│ Initiatives  │ [Pipeline] [Matrix●] [Graph]  [Group: Subject]│               │
│ Browse       │                                               │ Muscle Health │
│ Traceability●│ Subject / Capability │ PRD │ Story│ FRD│ Flow│ WF │ TDN│       │ FRD           │
│ Facets       │──────────────────────┼─────┼──────┼────┼─────┼────┼────┤       │               │
│ Maturity     │ Muscle Health        │  ✓  │  4   │ ●0 │  —  │ —  │ —  │       │ Missing: 2    │
│ Health       │ Facility & Equipment │  ✓  │  2   │  1 │  1  │ ●0 │ —  │       │ Expected from │
│              │ Exercise History     │  ✓  │  6   │  4 │  3  │ 2  │ 1  │       │ two stories   │
│ Saved Views  │                                               │               │
│              │ ✓ present   ◐ draft   ● missing   — not ready │ One deferred  │
│              │                                               │ None inferred │
│              │ Filters: [Body ×] [Exercise Management ×]    │               │
│              │                                               │ [Show gaps]   │
│              │                                               │ [Pipeline]    │
└──────────────┴───────────────────────────────────────────────┴───────────────┘
```

Annotations:

1. Matrix cells summarize counts or state but expose detailed evidence on selection.
2. “Not ready,” “not expected,” and “missing” must be different states.
3. The matrix derives columns from a named traceability view, not hard-coded MBS kinds.
4. Keyboard navigation should traverse the grid and announce row, column, state, and count.

## 7. Maturity: rung explorer

```text
┌──────────────┬───────────────────────────────────────────────┬───────────────┐
│ Now          │ Maturity / Scope Ladder                       │ CLASSIFICATION│
│ Initiatives  │ Model: Default Scope Ladder   [Filter…]       │               │
│ Browse       │                                               │ Muscle Health │
│ Traceability │ Unstarted  Sketched  Storied  Designed  Eng.  │               │
│ Facets       │     2        61         8        4        1   │ Current rung  │
│ Maturity   ● │              ▲                                │ Sketched      │
│ Health       │              │                                │               │
│              │ ┌───────────────────────────────────────────┐ │ Evidence      │
│ Saved Views  │ │ SKETCHED                                  │ │ • Artifacts >0│
│              │ │                                           │ │ • PRD exists  │
│              │ │ ● Muscle Health         Priority focus    │ │               │
│              │ │   Sleep Management      Later             │ │ Next rung     │
│              │ │   Nutrition Management  Later             │ │ Storied       │
│              │ └───────────────────────────────────────────┘ │               │
│              │                                               │ Missing       │
│              │ Next configured action: write stories / FRD  │ story or FRD  │
│              │                                               │               │
│              │                                               │ Not completion│
│              │                                               │ proof         │
│              │                                               │ [Coverage]    │
└──────────────┴───────────────────────────────────────────────┴───────────────┘
```

Annotations:

1. Counts summarize the configured assessment model and update with active filters.
2. Selection explains the evidence expression that produced the classification.
3. Initiative focus is shown as context but does not alter the factual rung result.
4. The inspector explicitly warns that the rung is not equivalent to initiative completion.

## 8. Responsive and Obsidian workspace behavior

For a narrow pane:

- navigation collapses to a toolbar or menu;
- the inspector becomes a drawer or separate leaf;
- matrices scroll within their content region while retaining headers;
- the primary recommendation remains readable without horizontal scrolling;
- the plugin may offer “open in full workspace” for dense graph and matrix views.

The workbench should cooperate with Obsidian rather than trap navigation:

- open source notes in the current or adjacent leaf according to user preference;
- expose commands in the command palette;
- support standard keyboard focus and escape behavior;
- preserve view state when the leaf is temporarily hidden;
- use Obsidian theme variables where possible;
- remain intelligible in light, dark, and high-contrast themes.

## 9. Visual semantics to validate

The visual system must communicate these distinctions without relying only on color:

| Distinction | Candidate treatment |
|---|---|
| Authoritative relationship | Solid line and declared label |
| Display-only inference | Dashed line and inferred badge |
| Expected missing artifact | Outlined virtual card and expected label |
| Existing draft artifact | Solid card with draft status |
| Blocked downstream stage | Muted card with prerequisite icon |
| Accepted or deferred gap | Gap card with disposition and review state |
| Configured judgment | Configuration badge or provenance heading |
| Computed assessment | Assessment badge with expandable evidence |
| Contradiction | Finding icon, severity text, and evidence access |

These treatments are hypotheses for usability testing, not final visual design.

## 10. Prototype questions

1. Is the distinction between recommendation summary and inspector evidence clear?
2. Can a user understand the nested Exercise Management focus order at a glance?
3. Does Browse provide enough orientation without duplicating Obsidian's file explorer?
4. Can users distinguish realization pairs from expected-child gaps through the interface language?
5. Which traceability presentation should open by default for one subject and for many subjects?
6. Can users distinguish missing, not expected, not ready, deferred, and inferred states?
7. Does the inspector remain useful across artifacts, subjects, relationships, matrix cells, and
   virtual gaps without becoming overloaded?
8. What minimum pane width supports the three-region shell?
9. Which views need full-workspace treatment rather than a normal Obsidian leaf?
10. Is a single global recommendation sufficient when another initiative has a small but urgent
    close-out action?

## 11. Wireframe acceptance criteria

- The primary recommendation is visually dominant and its provenance is one interaction away.
- Initiative hierarchy and focus order are visible without flattening subjects into peer priorities.
- Browse, Traceability, and Maturity share one selection and inspector model.
- Browse drills through profile-defined groups to concrete named documents and findings; aggregate
  summaries never form a terminal navigation state when child records exist.
- Every graph or matrix state has an accessible non-color indicator.
- The interface differentiates structural navigation from relationship traversal.
- The design remains useful in read-only mode.
- Dense views have a credible narrow-pane or full-workspace behavior.
- No visible label or column requires hard-coded MBS taxonomy in plugin code.
