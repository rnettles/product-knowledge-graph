# Software Product Traceability Convention

This convention is the reusable middle layer between the generic Product Knowledge Graph core and
an individual software project's profile. It applies when a project expresses product intent as
capabilities, user stories and functional requirements, then records experience and engineering
realizations.

## Reference topology

```text
Capability
└─ User story
   └─ Functional requirement (FRD)
      ├─ User flow
      ├─ Wireframe or UX projection
      └─ Technical design note (TDN)
          └─ depends on → ADR, API contract, data model
```

Authored realization edges point from the more concrete artifact toward the intent it realizes:

```text
user-story → capability
frd → user-story
user-flow → frd
wireframe / ux-projection → frd or user-flow
tdn → frd
tdn →(pkg_depends_on) adr / api-contract / data-model
```

The topology branches after the FRD. A user flow, visual design and TDN are parallel evidence, not
mandatory links in a false linear chain. An API-only requirement may have no wireframe; a visual
change may need no TDN; an ADR governs or constrains implementation rather than realizing product
intent.

## Conformance and variation

A project adopting this convention must record:

- which reference kinds it uses or renames;
- whether capabilities are standalone artifacts or identities within a register;
- its allowed `pkg_realizes` pairs;
- its expected-child rules, which are planning candidates rather than validity requirements;
- which engineering artifacts are realizations versus dependencies;
- any omitted stages and why they are not useful for that project.

The convention does not make every stage mandatory. It provides shared vocabulary, graph direction,
report configuration and a documented place for project deviations.

The executable reference is
[`profiles/software-product-profile.yaml`](../profiles/software-product-profile.yaml).
