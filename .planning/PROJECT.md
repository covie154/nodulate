# Thyroid Nodule Labeler

## What This Is

A web-based tool for a small team (2-3 known annotators) to manually draw bounding boxes around thyroid nodules on ultrasound DICOM images, and export the labeled dataset in COCO JSON format for downstream machine learning training. It replaces ad-hoc/manual labeling of a fixed research dataset of ~700-800 nodules (~1400-1600 DICOM images), served over the internet so the team can annotate from wherever they are.

## Core Value

Fast, accurate bounding box drawing with rock-solid auto-save — annotators should never lose work, and drawing/adjusting a box should feel immediate, not clunky. Everything else (auth, export, progress tracking) supports this one loop.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can log in with a username/password (small, known team — no self-signup)
- [ ] User can view a DICOM ultrasound image at original resolution, no windowing/measurement tools
- [ ] User can draw a bounding box around the nodule via click-and-drag
- [ ] User can resize a bounding box by dragging its corners/edges
- [ ] User can delete a bounding box
- [ ] Exactly one bounding box per image (no multi-lesion UI needed)
- [ ] Annotations auto-save as the user draws/modifies, with a brief visual "Saved" confirmation
- [ ] User can navigate Next/Previous through a flat, sequential list of images (not grouped by nodule)
- [ ] Progress bar shows completion (e.g. "45% — 23 of 50 images")
- [ ] End-of-dataset completion message when all images are labeled
- [ ] User can export all annotations as COCO JSON (image filename, bbox coordinates, timestamp, annotator)
- [ ] App runs on a shared server reachable over the internet by all team members

### Out of Scope

- AI-assisted draft bounding boxes — deferred to a future milestone, not this one
- Multi-expert review workflow (2nd/3rd reviewer, consensus, audit trail) — deferred to a future milestone
- PACS integration (Orthanc, DICOM query/retrieve, worklists) — dataset is a fixed local set of files; no need to query a live PACS
- DICOM windowing, measurement, or ROI tools — images are displayed as-is, no manipulation needed
- Grouping images by nodule/study — flat sequential list is sufficient for this dataset
- PHI de-identification tooling — source dataset is already de-identified
- Self-service signup, password reset flows, general user management — team is small and known; accounts can be provisioned manually
- Real-time multi-user collaboration, cloud storage integration (S3/GCS), Docker packaging, REST API — not needed for this milestone

## Context

- Source dataset: ~700-800 thyroid nodules, ~1400-1600 single-frame ultrasound DICOM files, already de-identified, stored locally on disk (not in a PACS).
- A prior requirements draft exists at `documentation/ultrasound-labeller-requirements.md` — written for generic ultrasound images (PNG/JPG assumed) with fuller auth/roles and both YOLO and COCO export. This PROJECT.md supersedes it: images are DICOM (needs pydicom, not just static image serving), export is COCO JSON only for v1, and AI-assist/multi-review are explicitly deferred rather than "v2 planned."
- Deployment is internet-facing (not local-only), which is why login/auth is a real v1 requirement rather than something to skip.

## Constraints

- **Data format**: Source images are DICOM (.dcm), single-frame — reading requires pydicom, not a plain image library. Display only; no PACS server, no image manipulation tools.
- **Deployment**: Must be reachable over the internet by a small, known team — real authentication is required, not a local-only trust model.
- **Privacy**: Dataset is already de-identified, but the app should still avoid unnecessarily logging or exposing raw DICOM metadata, out of general caution with medical imaging data.
- **Team size**: 2-3 known annotators — user management can be simple/manual (no self-signup, no complex role system needed for v1 since review workflow is deferred).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| pydicom + lightweight display, no PACS | No query/retrieve needs; fixed local dataset; simplest path to "just show the pixels" | — Pending |
| Export format: COCO JSON only (not YOLO) for v1 | User's explicit preference; richer metadata than YOLO txt | — Pending |
| Flat sequential image list, not grouped by nodule | Simpler UX; grouping by nodule not needed despite ~2 images/nodule | — Pending |
| Exactly one bounding box per image | Matches how this dataset's nodules are labeled; simplifies UI vs. original doc's multi-box support | — Pending |
| Defer AI-assist and multi-expert review entirely | Keep this milestone focused on a solid, fast manual labeling loop | — Pending |
| Real auth required (not skipped) | App is internet-facing, not local-only | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-06 after initialization*
