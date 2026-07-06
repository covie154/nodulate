# Agent Instructions

This project uses `.claude/CLAUDE.md` as the canonical agent guidance. Read and follow it before making changes; do not duplicate or override its project summary, constraints, conventions, or GSD workflow rules here.

## Project Context

- Project: Thyroid Nodule Labeler.
- Primary goal: a Django-based web tool for a small known team to label thyroid nodule bounding boxes on DICOM ultrasound images and export COCO JSON.
- Source of truth for current project details: `.claude/CLAUDE.md`, which is generated from the planning artifacts under `.planning/`.
- Current roadmap source: `.planning/ROADMAP.md`.

## GSD Workflow

Use the GSD framework for implementation of large changes. The current milestone is organized into four vertical phases:

1. Login & Image Viewer
2. Bounding Box Drawing Interface
3. Navigation & Progress Tracking
4. Export to COCO JSON

For planned phase work, start from the relevant GSD command and keep `.planning/` artifacts in sync. In particular:

- Use `/gsd-execute-phase` for implementation work tied to one of the four planned phases.
- Use `/gsd-quick` for small fixes, documentation updates, and ad-hoc tasks.
- Use `/gsd-debug` for investigations and bug fixes.

Do not make direct repository edits outside a GSD workflow unless the user explicitly asks to bypass it.

## Working Notes

- Preserve the medical-imaging privacy posture: avoid unnecessary exposure or logging of raw DICOM metadata.
- Keep changes focused on the core annotation loop unless a phase explicitly calls for supporting auth, navigation, progress, or export work.
- Follow existing patterns as they emerge; project architecture and conventions are still being established.
