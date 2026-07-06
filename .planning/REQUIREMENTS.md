# Requirements: Thyroid Nodule Labeler

**Defined:** 2026-07-06
**Core Value:** Fast, accurate bounding box drawing with rock-solid auto-save

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can log in with a username/password
- [ ] **AUTH-02**: User session persists across browser refresh during an annotation session
- [ ] **AUTH-03**: Accounts are provisioned manually for the 2-3 known team members (no self-signup)

### Image Display

- [ ] **IMG-01**: User can view a DICOM ultrasound image at original resolution, decoded via pydicom
- [ ] **IMG-02**: Images load from a fixed local dataset (~1400-1600 files), no upload UI needed
- [ ] **IMG-03**: Image load time stays fast enough that browsing feels immediate (no windowing/measurement tools to slow things down)

### Bounding Box Annotation

- [ ] **BBOX-01**: User can draw a bounding box around the nodule via click-and-drag
- [ ] **BBOX-02**: User can resize an existing bounding box by dragging its corners/edges
- [ ] **BBOX-03**: User can delete a bounding box
- [ ] **BBOX-04**: Exactly one bounding box per image (no multi-box UI)
- [ ] **BBOX-05**: Annotations auto-save as the user draws/modifies, debounced to avoid excessive writes
- [ ] **BBOX-06**: Visual "Saved" confirmation appears after auto-save completes

### Navigation & Progress

- [ ] **NAV-01**: User can move to the next image via a Next button (already auto-saved)
- [ ] **NAV-02**: User can move to the previous image via a Previous button to review/edit
- [ ] **NAV-03**: Images are presented as a flat, sequential list (not grouped by nodule)
- [ ] **NAV-04**: Progress bar shows completion percentage and count (e.g. "45% — 23 of 50 images")
- [ ] **NAV-05**: A completion message appears when the end of the image set is reached

### Data Export

- [ ] **EXP-01**: User can export all annotations as a single COCO JSON file
- [ ] **EXP-02**: Export includes image filename, bounding box coordinates, timestamp, and annotator identity

## v2 Requirements

Deferred to a future milestone. Tracked but not in current roadmap.

### AI-Assisted Annotation

- **AI-01**: Optional AI model integration to generate draft bounding boxes
- **AI-02**: Annotator can accept, modify, or reject AI-generated boxes
- **AI-03**: Configurable toggle to enable/disable AI assistance per session

### Multi-Expert Review

- **REV-01**: Annotations can be submitted for review by a second expert
- **REV-02**: Reviewer can approve, reject, or modify bounding boxes
- **REV-03**: Third reviewer option for disputed annotations
- **REV-04**: Review history tracking (who reviewed, when, what changed)
- **REV-05**: Consensus status per image (pending, approved, disputed)

## Out of Scope

| Feature | Reason |
|---------|--------|
| PACS integration (Orthanc, query/retrieve, worklists) | Fixed local dataset of files; no live PACS to query |
| DICOM windowing, measurement, or ROI tools | Images displayed as-is; not needed for bounding-box labeling |
| Grouping images by nodule/study | Flat sequential list is sufficient for this dataset |
| PHI de-identification tooling | Source dataset is already de-identified |
| Self-service signup, password reset | Team is small and known; manual provisioning is fine |
| YOLO txt export | User's explicit preference is COCO JSON only for v1 |
| Real-time multi-user collaboration | Not needed for sequential single-annotator-per-image workflow |
| Cloud storage integration (S3/GCS), Docker packaging, REST API | Not needed for this milestone |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| IMG-01 | Phase 1 | Pending |
| IMG-02 | Phase 1 | Pending |
| IMG-03 | Phase 1 | Pending |
| BBOX-01 | Phase 2 | Pending |
| BBOX-02 | Phase 2 | Pending |
| BBOX-03 | Phase 2 | Pending |
| BBOX-04 | Phase 2 | Pending |
| BBOX-05 | Phase 2 | Pending |
| BBOX-06 | Phase 2 | Pending |
| NAV-01 | Phase 3 | Pending |
| NAV-02 | Phase 3 | Pending |
| NAV-03 | Phase 3 | Pending |
| NAV-04 | Phase 3 | Pending |
| NAV-05 | Phase 3 | Pending |
| EXP-01 | Phase 4 | Pending |
| EXP-02 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19 (Phase 1: 6, Phase 2: 6, Phase 3: 5, Phase 4: 2)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-06*
*Last updated: 2026-07-06 after roadmap creation*
