<!-- GSD:project-start source:PROJECT.md -->

## Project

**Thyroid Nodule Labeler**

A web-based tool for a small team (2-3 known annotators) to manually draw bounding boxes around thyroid nodules on ultrasound DICOM images, and export the labeled dataset in COCO JSON format for downstream machine learning training. It replaces ad-hoc/manual labeling of a fixed research dataset of ~700-800 nodules (~1400-1600 DICOM images), served over the internet so the team can annotate from wherever they are.

**Core Value:** Fast, accurate bounding box drawing with rock-solid auto-save — annotators should never lose work, and drawing/adjusting a box should feel immediate, not clunky. Everything else (auth, export, progress tracking) supports this one loop.

### Constraints

- **Backend**: Django (Python) — explicitly confirmed by user, not just inherited from the prior draft doc. Pairs naturally with pydicom for DICOM handling.
- **Data format**: Source images are DICOM (.dcm), single-frame — reading requires pydicom, not a plain image library. Display only; no PACS server, no image manipulation tools.
- **Deployment**: Must be reachable over the internet by a small, known team — real authentication is required, not a local-only trust model.
- **Privacy**: Dataset is already de-identified, but the app should still avoid unnecessarily logging or exposing raw DICOM metadata, out of general caution with medical imaging data.
- **Team size**: 2-3 known annotators — user management can be simple/manual (no self-signup, no complex role system needed for v1 since review workflow is deferred).

<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->

## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
