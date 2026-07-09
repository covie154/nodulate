# Roadmap: Thyroid Nodule Labeler

## Overview

V1.0 delivered the core manual annotation loop: known users log in, view DICOM ultrasound images, draw exactly one bounding box per image, navigate the dataset with progress, and export accepted annotations as COCO JSON. V2.0 keeps the deployment lean while adding first-run model assistance: RF-DETR inference happens offline, admins upload prediction CSV files, and the app displays latest-upload draft boxes only until a human accepts, edits, or deletes them.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Login & Image Viewer** - Known team members log in and view a real DICOM image at original resolution (completed 2026-07-06)
- [x] **Phase 2: Bounding Box Drawing Interface** - Draw, resize, and delete a single bounding box per image with rock-solid auto-save (completed 2026-07-06)
- [x] **Phase 3: Navigation & Progress Tracking** - Move through the full sequential dataset with a progress bar and a completion message (completed 2026-07-06)
- [x] **Phase 4: Export to COCO JSON** - Produce a single COCO JSON export of all annotations for downstream ML training (completed 2026-07-06)
- [ ] **Phase 5: Roles & DICOM Matching Foundation** - Store lean annotation roles plus SOP Instance UID identifiers needed to match offline model CSV rows
- [ ] **Phase 6: Admin Draft CSV Import** - Admins upload model prediction CSV files; all uploads are retained and only latest-upload rows drive visible drafts
- [ ] **Phase 7: Draft Review Annotation Loop** - Users see draft boxes/progress in a distinct color and can accept, edit, or delete drafts into human annotation state

## Phase Details

### Phase 1: Login & Image Viewer

**Goal**: A known team member can log in and view a real DICOM ultrasound image, decoded via pydicom, at original resolution.
**Mode:** mvp
**Depends on**: Nothing
**Requirements**: AUTH-01, AUTH-02, AUTH-03, IMG-01, IMG-02, IMG-03
**Success Criteria**:

1. User can log in with a username/password for a manually provisioned account.
2. User's login session persists after a browser refresh mid-annotation-session.
3. User sees a DICOM ultrasound image rendered in the browser at its original resolution.
4. Images are served directly from the fixed local dataset.

**Plans**: Complete
**UI hint**: yes

### Phase 2: Bounding Box Drawing Interface

**Goal**: An annotator can accurately mark the nodule using an interactive bounding-box interface with auto-save.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: BBOX-01, BBOX-02, BBOX-03, BBOX-04, BBOX-05, BBOX-06
**Success Criteria**:

1. User can draw, resize, and delete a single bounding box.
2. Only one bounding box can exist per image at a time.
3. Box changes auto-save after interaction with visible saved confirmation.

**Plans**: Complete
**UI hint**: yes

### Phase 3: Navigation & Progress Tracking

**Goal**: An annotator can move through the dataset in flat order and see completion progress.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05
**Success Criteria**:

1. User can advance to next and previous images safely.
2. Images are presented in one flat sequential list.
3. Progress bar shows percentage and count.
4. Last labeled image shows a completion message.

**Plans**: Complete
**UI hint**: yes

### Phase 4: Export to COCO JSON

**Goal**: The team can produce a downstream-ready COCO JSON file from accepted annotations.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: EXP-01, EXP-02
**Success Criteria**:

1. User can download one COCO JSON file covering annotated images.
2. Annotation entries include filename, bbox coordinates, timestamp, and annotator identity.

**Plans**: Complete

### Phase 5: Roles & DICOM Matching Foundation

**Goal**: The database can distinguish human roles from imported draft provenance and can match external model predictions to DICOM images.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: ROLE-01, ROLE-02, DICOM-01
**Success Criteria**:

1. User profiles expose a lean annotation role field with `user` and `tiebreaker` for human accounts.
2. Admin status remains Django staff/superuser and is not coupled to annotation role.
3. Image inventory stores SOP Instance UID when available as the unique DICOM matching key, and retains accession number only if present.
4. Existing images and annotations continue working after migration.

**Plans**: TBD
**UI hint**: no

### Phase 6: Admin Draft CSV Import

**Goal**: Admins can upload offline model predictions in CSV format and retain every upload while only the latest upload drives current drafts.
**Mode:** mvp
**Depends on**: Phase 5
**Requirements**: DICOM-02, DRAFT-01, DRAFT-02, DRAFT-03, DRAFT-04, DRAFT-05
**Success Criteria**:

1. Admin can upload a CSV with `sopInstanceUid`, `sx`, `sy`, `ex`, `ey` through Django admin, with optional `accession_no` metadata.
2. Import treats `sx`, `sy`, `ex`, `ey` as pixel-space corner coordinates and normalizes them against image dimensions.
3. Each upload records filename, uploader, upload timestamp, imported count, unmatched count, and error count.
4. All uploads remain stored, while latest-upload draft rows are the only drafts shown in the workspace.
5. Invalid or unmatched rows are counted and do not break the import.

**Plans**: TBD
**UI hint**: yes

### Phase 7: Draft Review Annotation Loop

**Goal**: Human annotators can review model draft boxes inside the existing fast annotation loop, with any human action immediately taking precedence.
**Mode:** mvp
**Depends on**: Phase 6
**Requirements**: ROLE-03, DUI-01, DUI-02, DUI-03, DUI-04, DUI-05
**Success Criteria**:

1. Draft boxes appear in a distinct color only on images without a human `user` or `tiebreaker` annotation.
2. Progress segments distinguish human-complete, draft-available, current, and empty images.
3. Accept saves the draft as the current user's human annotation without moving it.
4. Editing a draft converts the first save into a human annotation for the current user.
5. Deleting a draft clears the visible draft for that image and returns its progress state to empty until a human box exists.

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Login & Image Viewer | 1/1 | Complete | 2026-07-06 |
| 2. Bounding Box Drawing Interface | 1/1 | Complete | 2026-07-06 |
| 3. Navigation & Progress Tracking | 1/1 | Complete | 2026-07-06 |
| 4. Export to COCO JSON | 1/1 | Complete | 2026-07-06 |
| 5. Roles & DICOM Matching Foundation | 0/1 | Pending | - |
| 6. Admin Draft CSV Import | 0/1 | Pending | - |
| 7. Draft Review Annotation Loop | 0/1 | Pending | - |
