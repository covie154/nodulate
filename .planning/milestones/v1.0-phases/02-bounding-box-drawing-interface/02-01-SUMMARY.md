---
phase: 02-bounding-box-drawing-interface
plan: 01
subsystem: annotation-loop
tags: [django, javascript, csrf, autosave]
requires:
  - phase: 01-login-image-viewer
    provides: authenticated workspace and ImageAsset model
provides:
  - Annotation model with one box per image
  - Authenticated annotation JSON endpoint
  - Vanilla JS draw/resize/delete overlay
  - Debounced retrying auto-save and flush hook
affects: [phase-03, phase-04]
tech-stack:
  added: []
  patterns: [normalized-coordinates, csrf-fetch, debounced-autosave]
key-files:
  created: [static/labeler/annotation.js, labeler/migrations/0001_initial.py]
  modified: [labeler/models.py, labeler/views.py, labeler/urls.py, templates/labeler/workspace.html, labeler/tests.py]
key-decisions:
  - "Persist exactly one Annotation per ImageAsset with normalized coordinates."
  - "Expose window.nodulate.flushPendingSave() for safe later navigation."
patterns-established:
  - "Validate annotation coordinates before saving to prevent invalid row creation."
  - "Use retrying fetch saves with CSRF instead of exempt endpoints."
requirements-completed: [BBOX-01, BBOX-02, BBOX-03, BBOX-04, BBOX-05, BBOX-06]
duration: same session
completed: 2026-07-06
---

# Phase 2: Bounding Box Drawing Interface Summary

**Single-box annotation overlay with normalized persistence and resilient auto-save**

## Performance

- **Duration:** same session
- **Completed:** 2026-07-06
- **Tasks:** 3/3
- **Files modified:** 8+

## Accomplishments

- Added `Annotation` with a one-to-one image relationship and annotator/timestamp tracking.
- Added authenticated GET/POST/DELETE JSON endpoints for annotation state.
- Implemented replacement-on-draw, move, four-corner resize, delete button, Delete/Backspace shortcut, min-size clamp, and normalized coordinates.
- Added debounced auto-save with retry behavior, visible Saved/error states, and forced save hook.

## Task Commits

No git commits were created because the user did not request committing. Work is present in the working tree.

## Files Created/Modified

- `labeler/models.py` - `Annotation` model and coordinate validation.
- `labeler/views.py` - Annotation JSON endpoint.
- `static/labeler/annotation.js` - Browser annotation workflow.
- `templates/labeler/workspace.html` - Overlay and controls.
- `labeler/tests.py` - Persistence and validation tests.

## Decisions Made

Followed Phase 2 context: exactly one box per image, replacement-on-draw, four corners, auto-save retries, visible saved confirmation, forced flush before transitions.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Validate before saving annotations**
- **Found during:** Test execution
- **Issue:** `update_or_create` created an invalid annotation row before validation rejected the request.
- **Fix:** Changed save flow to populate an unsaved/new or existing instance, call `full_clean()`, then save.
- **Files modified:** `labeler/views.py`
- **Verification:** `python manage.py test labeler` passes.

---

**Total deviations:** 1 auto-fixed correctness issue.
**Impact on plan:** Strengthened validation and preserved phase scope.

## Issues Encountered

Invalid annotation test initially failed; fixed as above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 3 can use `window.nodulate.flushPendingSave()` and the annotation count to implement safe navigation and progress.

---
*Phase: 02-bounding-box-drawing-interface*
*Completed: 2026-07-06*
