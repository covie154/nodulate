# Phase 4: Export to COCO JSON - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-06
**Phase:** 4-Export to COCO JSON
**Areas discussed:** Export trigger, COCO shape, annotation inclusion, file naming/freshness

---

## Export Trigger

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit authenticated download | User clicks Export and receives the latest JSON. | ✓ |
| Automatic export at completion | Export starts automatically after all images are labeled. | |
| Background export job | User starts a job and later downloads the result. | |

**User's choice:** Auto-selected recommended option under GSD `--auto`: Explicit authenticated download.
**Notes:** Keeps export separate from Phase 3 completion and avoids unnecessary job infrastructure.

---

## COCO Shape

| Option | Description | Selected |
|--------|-------------|----------|
| COCO images/annotations/categories | Standard COCO-like structure with one thyroid nodule category. | ✓ |
| Custom compact JSON | Simpler internal shape, not COCO-compatible enough. | |
| YOLO text export | Explicitly out of scope for v1. | |

**User's choice:** Auto-selected recommended option under GSD `--auto`: COCO images/annotations/categories.
**Notes:** Matches PROJECT.md and REQUIREMENTS.md.

---

## Annotation Inclusion

| Option | Description | Selected |
|--------|-------------|----------|
| Annotated rows drive annotations | Every saved box becomes one annotation; unboxed images may appear only in images. | ✓ |
| Export only complete dataset when all images labeled | Blocks partial research exports. | |
| Export per-user annotations only | Conflicts with shared global annotation pool. | |

**User's choice:** Auto-selected recommended option under GSD `--auto`: Annotated rows drive annotations.
**Notes:** Allows export "at any point" while keeping annotation records faithful.

---

## File Naming And Freshness

| Option | Description | Selected |
|--------|-------------|----------|
| Fresh timestamped download | Generate from current DB state and download as `nodulate-coco-*.json`. | ✓ |
| Persisted export artifact | Store generated files on disk for reuse/history. | |
| Static export path | Overwrite the same JSON file each time. | |

**User's choice:** Auto-selected recommended option under GSD `--auto`: Fresh timestamped download.
**Notes:** Lowest operational complexity and avoids stale export files.

---

## the agent's Discretion

- Exact export button placement.
- Whether unannotated images appear in the `images` array.

## Deferred Ideas

- YOLO export, background jobs, cloud storage, export history, reviewer-approved exports, filtered exports.
