---
type: quick-task
status: complete
created: 2026-07-07
---

# Progress Pips

## Task

Add clickable image pips to the workspace progress bar, with a current-image flag and clear treatment for unlabeled/skipped images.

## Plan

- Add per-image progress item context in `labeler/views.py` without exposing DICOM metadata.
- Render each image as a clickable progress pip in `templates/labeler/workspace.html`.
- Style completed, current, and pending/unlabeled states in `static/labeler/app.css`.
- Add a focused Django test covering completed, current, and pending pips.