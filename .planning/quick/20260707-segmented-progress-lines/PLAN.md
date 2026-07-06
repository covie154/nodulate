---
type: quick-task
status: complete
created: 2026-07-07
---

# Segmented Progress Lines

## Task

Revise the workspace progress display so pips become line ticks overlaid on the status bar, with annotated images filling their interval and missing images leaving holes.

## Plan

- Keep the existing progress count row and per-image backend context.
- Replace the continuous percentage fill with per-image `progress-segment` spans.
- Overlay clickable line ticks on the segmented bar.
- Keep the current-image flag and have it rise from the bar.
- Re-run the Django labeler tests.