# Requirements: Thyroid Nodule Labeler

**Defined:** 2026-07-06
**Core Value:** Fast, accurate bounding box drawing with rock-solid auto-save
**Current Milestone:** v2.0 Draft Model Annotations

## v1 Requirements

### Authentication

- [x] **AUTH-01**: User can log in with a username/password
- [x] **AUTH-02**: User session persists across browser refresh during an annotation session
- [x] **AUTH-03**: Accounts are provisioned manually for the known team members (no self-signup)

### Image Display

- [x] **IMG-01**: User can view a DICOM ultrasound image at original resolution, decoded via pydicom
- [x] **IMG-02**: Images load from a fixed local dataset, no upload UI needed
- [x] **IMG-03**: Image load time stays fast enough that browsing feels immediate

### Bounding Box Annotation

- [x] **BBOX-01**: User can draw a bounding box around the nodule via click-and-drag
- [x] **BBOX-02**: User can resize an existing bounding box by dragging its corners/edges
- [x] **BBOX-03**: User can delete a bounding box
- [x] **BBOX-04**: Exactly one bounding box per image (no multi-box UI)
- [x] **BBOX-05**: Annotations auto-save as the user draws/modifies, debounced to avoid excessive writes
- [x] **BBOX-06**: Visual "Saved" confirmation appears after auto-save completes

### Navigation & Progress

- [x] **NAV-01**: User can move to the next image via a Next button (already auto-saved)
- [x] **NAV-02**: User can move to the previous image via a Previous button to review/edit
- [x] **NAV-03**: Images are presented as a flat, sequential list (not grouped by nodule)
- [x] **NAV-04**: Progress bar shows completion percentage and count
- [x] **NAV-05**: A completion message appears when the end of the image set is reached

### Data Export

- [x] **EXP-01**: User can export all annotations as a single COCO JSON file
- [x] **EXP-02**: Export includes image filename, bounding box coordinates, timestamp, and annotator identity

## v2.0 Requirements

### Roles & Provenance

- [ ] **ROLE-01**: Admin can assign each human account an annotation role of `user` or `tiebreaker` without changing Django administrator status.
- [ ] **ROLE-02**: Imported model predictions are represented with `drafter` provenance but do not require a human drafter login account.
- [ ] **ROLE-03**: Human-created or accepted annotations are saved as the active user's annotation and immediately override any visible draft box for that image.

### DICOM Matching

- [ ] **DICOM-01**: Image inventory stores SOP Instance UID from each DICOM file when available, and retains accession number only if present.
- [ ] **DICOM-02**: Draft CSV import matches rows to images using SOP Instance UID as the unique identifier.

### Draft Import

- [ ] **DRAFT-01**: Admin can upload a CSV file through Django admin with columns `sopInstanceUid`, `sx`, `sy`, `ex`, `ey`; `accession_no` is optional metadata when present.
- [ ] **DRAFT-02**: CSV coordinates are interpreted as pixel-space corners: `sx`,`sy` top-left and `ex`,`ey` bottom-right.
- [ ] **DRAFT-03**: Every draft upload stores filename, upload timestamp, uploader, and import counts for future IOU/similarity metrics.
- [ ] **DRAFT-04**: The app retains all draft uploads but only uses the latest upload when displaying draft boxes.
- [ ] **DRAFT-05**: Invalid or unmatched CSV rows do not create visible drafts and leave an auditable import summary.

### Draft Review UI

- [ ] **DUI-01**: If an image has no human `user` or `tiebreaker` annotation and the latest upload has a matching draft, the workspace displays the draft box in a distinct color.
- [ ] **DUI-02**: Progress segments distinguish human-complete images from draft-available images and empty images.
- [ ] **DUI-03**: User can accept a draft box without moving it, saving it immediately as their human annotation.
- [ ] **DUI-04**: User can edit a draft box; the first save converts it to their human annotation.
- [ ] **DUI-05**: User can delete a draft box for the current image; that image returns to empty/grey progress state until a human box is created.

## Future Requirements

### Multi-Expert Review

- **REV-01**: Reviewer can approve, reject, or modify another human annotation.
- **REV-02**: Third reviewer option for disputed annotations.
- **REV-03**: Review history tracking and consensus status per image.

### Model Metrics

- **MET-01**: App can compare draft uploads against accepted human boxes using IOU/similarity metrics.
- **MET-02**: Admin can export or inspect model-version performance summaries.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Online RF-DETR inference | V2.0 keeps EC2 lean by importing offline predictions only |
| PACS integration | Fixed local dataset of files; no live PACS to query |
| DICOM windowing, measurement, or ROI tools | Images displayed as-is; not needed for bounding-box labeling |
| Self-service signup and password reset | Team is small and known; manual provisioning is fine |
| Full consensus workflow | Store `tiebreaker` role now, defer review/dispute UI |
| YOLO txt export | User's explicit preference is COCO JSON |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete |
| AUTH-03 | Phase 1 | Complete |
| IMG-01 | Phase 1 | Complete |
| IMG-02 | Phase 1 | Complete |
| IMG-03 | Phase 1 | Complete |
| BBOX-01 | Phase 2 | Complete |
| BBOX-02 | Phase 2 | Complete |
| BBOX-03 | Phase 2 | Complete |
| BBOX-04 | Phase 2 | Complete |
| BBOX-05 | Phase 2 | Complete |
| BBOX-06 | Phase 2 | Complete |
| NAV-01 | Phase 3 | Complete |
| NAV-02 | Phase 3 | Complete |
| NAV-03 | Phase 3 | Complete |
| NAV-04 | Phase 3 | Complete |
| NAV-05 | Phase 3 | Complete |
| EXP-01 | Phase 4 | Complete |
| EXP-02 | Phase 4 | Complete |
| ROLE-01 | Phase 5 | Pending |
| ROLE-02 | Phase 5 | Pending |
| ROLE-03 | Phase 7 | Pending |
| DICOM-01 | Phase 5 | Pending |
| DICOM-02 | Phase 6 | Pending |
| DRAFT-01 | Phase 6 | Pending |
| DRAFT-02 | Phase 6 | Pending |
| DRAFT-03 | Phase 6 | Pending |
| DRAFT-04 | Phase 6 | Pending |
| DRAFT-05 | Phase 6 | Pending |
| DUI-01 | Phase 7 | Pending |
| DUI-02 | Phase 7 | Pending |
| DUI-03 | Phase 7 | Pending |
| DUI-04 | Phase 7 | Pending |
| DUI-05 | Phase 7 | Pending |

**Coverage:**

- v1 requirements: 19 total, all complete
- v2.0 requirements: 15 total
- Mapped to phases: 15 (Phase 5: 3, Phase 6: 6, Phase 7: 6)
- Unmapped: 0

---
*Requirements defined: 2026-07-06*
*Last updated: 2026-07-09 after v2.0 milestone definition*
