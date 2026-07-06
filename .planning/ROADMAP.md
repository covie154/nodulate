# Roadmap: Thyroid Nodule Labeler

## Overview

Four vertical slices carry the annotator from nothing to a finished, exportable dataset. Phase 1 gets a known team member logged in and looking at a real DICOM ultrasound image at full resolution — the foundation everything else draws on. Phase 2 turns that static view into the actual labeling loop: draw, resize, delete a single bounding box, with auto-save and a visible "Saved" confirmation so no work is ever silently lost. Phase 3 wires that loop into the full ~1400-1600 image dataset — flat sequential Next/Previous navigation, a progress bar, and a completion message at the end. Phase 4 closes the loop by exporting everything as a single COCO JSON file for downstream ML training. Each phase leaves the app in a usable, demoable state; nothing is a throwaway layer.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Login & Image Viewer** - Known team members log in and view a real DICOM image at original resolution (completed 2026-07-06)
- [x] **Phase 2: Bounding Box Drawing Interface** - Draw, resize, and delete a single bounding box per image with rock-solid auto-save (completed 2026-07-06)
- [x] **Phase 3: Navigation & Progress Tracking** - Move through the full sequential dataset with a progress bar and a completion message (completed 2026-07-06)
- [x] **Phase 4: Export to COCO JSON** - Produce a single COCO JSON export of all annotations for downstream ML training (completed 2026-07-06)

## Phase Details

### Phase 1: Login & Image Viewer

**Goal**: A known team member can log in and view a real DICOM ultrasound image, decoded via pydicom, at original resolution — the foundation the whole annotation loop is built on.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, IMG-01, IMG-02, IMG-03
**Success Criteria** (what must be TRUE):

  1. User can log in with a username/password for an account that was provisioned manually (no self-signup flow exists).
  2. User's login session persists after a browser refresh mid-annotation-session (no forced re-login).
  3. User sees a DICOM ultrasound image, decoded via pydicom, rendered in the browser at its original resolution.
  4. Images are served directly from the fixed local dataset (no upload UI), and opening an image feels immediate rather than sluggish.

**Plans**: TBD
**UI hint**: yes

### Phase 2: Bounding Box Drawing Interface

**Goal**: An annotator can accurately mark the nodule on the current image using an interactive bounding-box interface, and trust that every change is auto-saved without needing to think about it.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: BBOX-01, BBOX-02, BBOX-03, BBOX-04, BBOX-05, BBOX-06
**Success Criteria** (what must be TRUE):

  1. User can draw a bounding box around the nodule via click-and-drag.
  2. User can resize an existing box by dragging its corners or edges.
  3. User can delete a box and redraw a fresh one on the same image.
  4. Only one bounding box can exist per image at a time — there is no UI path to create a second box alongside an existing one.
  5. Box changes auto-save shortly after the user stops interacting (debounced, not on every mouse-move), and a brief visual "Saved" confirmation appears once the write completes.

**Plans**: TBD
**UI hint**: yes

### Phase 3: Navigation & Progress Tracking

**Goal**: An annotator can move through the entire dataset in a flat sequential order, always see how much work remains, and know unambiguously when they've reached the end.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05
**Success Criteria** (what must be TRUE):

  1. User can advance to the next image via a Next button, with the current image's box already auto-saved before the transition.
  2. User can go back to any previously seen image via a Previous button to review or edit its box.
  3. Images are presented in one flat, sequential list — never grouped or nested by nodule/study.
  4. A progress bar shows both a percentage and a count of completed vs. total images (e.g. "45% — 23 of 50 images").
  5. Reaching the last image after it's labeled shows a clear, unmistakable completion message.

**Plans**: TBD
**UI hint**: yes

### Phase 4: Export to COCO JSON

**Goal**: The team can produce a single, downstream-ready labeled dataset file from all completed annotations at any point.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: EXP-01, EXP-02
**Success Criteria** (what must be TRUE):

  1. User can trigger an export that produces one COCO JSON file covering every annotated image in the dataset.
  2. Each annotation entry in the exported file includes the image filename, bounding box coordinates, a timestamp, and the identity of the annotator who created it.

**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Login & Image Viewer | 1/1 | Complete    | 2026-07-06 |
| 2. Bounding Box Drawing Interface | 1/1 | Complete    | 2026-07-06 |
| 3. Navigation & Progress Tracking | 1/1 | Complete    | 2026-07-06 |
| 4. Export to COCO JSON | 1/1 | Complete    | 2026-07-06 |
