# Phase 3: Navigation & Progress Tracking - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-06
**Phase:** 3-Navigation & Progress Tracking
**Areas discussed:** Navigation model, save-before-transition behavior, progress semantics, end-of-dataset state

---

## Navigation Model

| Option | Description | Selected |
|--------|-------------|----------|
| Flat Previous/Next | Deterministic sequence with only Previous and Next controls. | ✓ |
| Sidebar image queue | Visible list/grid of all images for random access. | |
| Grouped nodule/study navigation | Navigate within nodule/study groups. | |

**User's choice:** Auto-selected recommended option under GSD `--auto`: Flat Previous/Next.
**Notes:** Matches the roadmap and the Phase 1 decision that the dataset is not grouped in v1.

---

## Save-Before-Transition Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Block navigation until forced save succeeds | Flush dirty annotation before changing image; keep the user on the image if save fails. | ✓ |
| Navigate optimistically | Change image immediately and let save finish in the background. | |
| Prompt user on unsaved changes | Ask before leaving when a save is pending. | |

**User's choice:** Auto-selected recommended option under GSD `--auto`: Block navigation until forced save succeeds.
**Notes:** Carries Phase 2 D-07 forward and protects the core "never lose work" value.

---

## Progress Semantics

| Option | Description | Selected |
|--------|-------------|----------|
| Global completed images | Any saved box counts the image complete for the team. | ✓ |
| Per-user progress | Each annotator has separate completion counts. | |
| Session-only progress | Count only images touched in the current session. | |

**User's choice:** Auto-selected recommended option under GSD `--auto`: Global completed images.
**Notes:** Consistent with the shared pool / first-come annotation model from Phase 1.

---

## End-of-Dataset State

| Option | Description | Selected |
|--------|-------------|----------|
| Completion panel in workspace | Show final completion message while leaving the last image visible. | ✓ |
| Auto-redirect to export | Move directly to export once the final image is labeled. | |
| Modal dialog | Block the workspace with an acknowledgment modal. | |

**User's choice:** Auto-selected recommended option under GSD `--auto`: Completion panel in workspace.
**Notes:** Export remains Phase 4; Phase 3 should not couple completion to export.

---

## the agent's Discretion

- Exact route shape for image detail pages.
- Whether progress values are rendered in the page context or fetched from a small JSON endpoint.

## Deferred Ideas

- Sidebar queues, filters, grouped navigation, assignment/locking, and per-user dashboards.
