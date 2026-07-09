# Thyroid Nodule Labeler

## What This Is

A web-based tool for a small team of known annotators to draw, review, and export thyroid nodule bounding boxes on ultrasound DICOM images. The app supports a fast manual annotation loop and, in V2.0, imports offline model predictions as draft boxes that humans can accept, edit, or delete before export.

## Core Value

Fast, accurate bounding box drawing with rock-solid auto-save. Annotators should never lose work, and draft model boxes should reduce effort without getting in the way of immediate human correction.

## Current Milestone: v2.0 Draft Model Annotations

**Goal:** Let admins import offline RF-DETR first-run boxes as draft annotations, then let human annotators accept, edit, or delete those drafts while preserving one approved human box per image.

**Target features:**
- Store SOP Instance UID as the unique DICOM identifier for CSV draft matching; retain accession number only when present.
- Keep app roles lean: human annotators are `user` or future `tiebreaker`; imported model boxes use `drafter` provenance; admin status remains Django staff/superuser.
- Admins can upload model prediction CSV files with pixel-space corner bbox columns and retain every upload for future similarity metrics.
- The annotation workspace displays latest-upload draft boxes only where no human `user` or `tiebreaker` annotation exists.
- Human edits, accepts, and deletes immediately override or clear drafts in the progress state.

## Requirements

### Validated

- [x] User can log in with a username/password (small, known team; no self-signup) - v1.0
- [x] User can view a DICOM ultrasound image at original resolution, no windowing/measurement tools - v1.0
- [x] User can draw, resize, delete, and auto-save exactly one bounding box per image - v1.0
- [x] User can navigate Next/Previous through a flat sequential list with progress - v1.0
- [x] User can export all accepted annotations as COCO JSON - v1.0

### Active

- [ ] Admin can manage human annotation roles separately from Django administrator status.
- [ ] Admin can import offline model predictions from CSV without running inference on the EC2 instance.
- [ ] App stores every draft upload with upload date and filename for future similarity metrics.
- [ ] The latest draft upload supplies visible draft boxes only where no human annotation exists.
- [ ] User can accept, edit, or delete draft model boxes from the same annotation loop.
- [ ] Progress visualization distinguishes human-complete, draft-available, current, and empty images.

### Out of Scope

- Full online model inference - RF-DETR inference runs offline; the EC2 app imports CSV predictions only.
- Full multi-expert consensus workflow (2nd/3rd reviewer assignment, disputes, audit UI) - keep V2.0 lean; only store the future `tiebreaker` role now.
- PACS integration (Orthanc, DICOM query/retrieve, worklists) - dataset is a fixed local set of files; no need to query a live PACS.
- DICOM windowing, measurement, or ROI tools - images are displayed as-is, no manipulation needed.
- Grouping images by nodule/study - flat sequential list is sufficient for this dataset.
- PHI de-identification tooling - source dataset is already de-identified.
- Self-service signup and password reset flows - team is small and known; accounts can be provisioned manually.
- Real-time multi-user collaboration, cloud storage integration, Docker packaging, REST API - not needed for this milestone.

## Context

- Source dataset: about 700-800 thyroid nodules and 1400-1600 single-frame ultrasound DICOM files, already de-identified, stored locally on disk rather than in a PACS.
- V1.0 delivered login, DICOM display, single-box annotation, navigation/progress, and COCO export.
- V2.0 uses offline model inference to keep EC2 deployment small. Admins upload RF-DETR first-run predictions as CSV rows with `sopInstanceUid`, `sx`, `sy`, `ex`, `ey`; `sx`,`sy` are the start/top-left pixel and `ex`,`ey` are the end/bottom-right pixel.
- SOP Instance UID is the unique CSV matching key. Accession number may be stored when available, but the provided DICOMs have blank accession tags.

## Constraints

- **Backend**: Django (Python) - explicitly confirmed by user; pairs naturally with pydicom for DICOM handling.
- **Data format**: Source images are DICOM (.dcm), single-frame. Reading requires pydicom, not a plain image library.
- **Deployment**: Must be reachable over the internet by a small, known team; real authentication is required.
- **Privacy**: Dataset is already de-identified, but the app should still avoid unnecessary logging or exposure of raw DICOM metadata.
- **Team size**: Small known annotator group; user management can stay simple and admin-driven.
- **EC2 footprint**: Do not add RF-DETR inference runtime to the web server for V2.0.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Backend: Django | Explicitly confirmed by user; pairs naturally with pydicom | Confirmed |
| pydicom + lightweight display, no PACS | No query/retrieve needs; fixed local dataset; simplest path to show pixels | Good |
| Export format: COCO JSON only for accepted annotations | User's explicit preference; richer metadata than YOLO txt | Good |
| Flat sequential image list, not grouped by nodule | Simpler UX; grouping by nodule not needed despite about 2 images/nodule | Good |
| Exactly one visible box per image | Matches the dataset labeling loop and keeps draft override rules simple | Good |
| V2.0 imports draft predictions, not model weights | Minimal EC2 deployment should not run RF-DETR inference; offline CSV import is enough for first-run drafts | Pending |
| Draft boxes use `drafter` provenance, not human accounts | User confirmed drafter is not a human role; human accounts remain `user` or future `tiebreaker` | Pending |
| Use SOP Instance UID as draft matching key | SOP Instance UID uniquely identifies each DICOM image; accession is optional and blank in the provided files | Pending |
| CSV bbox columns use corner coordinates | `sx`,`sy` are top-left pixels and `ex`,`ey` are bottom-right pixels | Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? Move to Out of Scope with reason
2. Requirements validated? Move to Validated with phase reference
3. New requirements emerged? Add to Active
4. Decisions to log? Add to Key Decisions
5. "What This Is" still accurate? Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-09 after starting v2.0 draft model annotation milestone*
