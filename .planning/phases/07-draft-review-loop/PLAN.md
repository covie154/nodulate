# Phase 7 Plan: Draft Review Annotation Loop

## Goal
Show latest draft boxes in the existing annotation loop until a human accepts, edits, or deletes them.

## Tasks
- Extend annotation JSON with source/provenance metadata.
- Display draft boxes in a distinct color and expose accept/delete controls only for drafts.
- Human edit or accept saves an Annotation for the current user and hides draft provenance.
- Draft delete suppresses that latest draft for the current image and returns progress to empty.
- Update progress statuses and styles for human-complete vs draft-available.
- Add tests for draft display, accept, edit override, delete suppression, and progress counts.

## Verification
- Existing UI save behavior remains intact.
- New draft workflow tests pass.
