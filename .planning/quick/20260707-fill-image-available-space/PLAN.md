---
type: quick-task
status: complete
created: 2026-07-07
---

# Fill Image Available Space

## Task

Make the ultrasound image take up all available space within the browser that is not occupied by existing UI elements, without changing the surrounding workspace template.

## Plan

- Keep `templates/labeler/workspace.html` unchanged.
- Make the existing image stage wrapper flex into remaining workspace space.
- Fit the annotation stage to the loaded image aspect ratio inside that available rectangle so bounding-box coordinates remain aligned.
- Run a lightweight Django project check.