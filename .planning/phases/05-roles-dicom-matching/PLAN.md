# Phase 5 Plan: Roles & DICOM Matching Foundation

## Goal
Store lean human roles and DICOM identifiers needed for draft CSV matching.

## Tasks
- Add UserProfile with `role` choices: user, tiebreaker.
- Preserve Django `is_staff`/`is_superuser` as the administrator separator.
- Add ImageAsset accession number and SOP Instance UID fields, with SOP Instance UID serving as the unique nonblank DICOM identifier.
- Update DICOM inventory to read only those two tags.
- Add tests for role defaults and DICOM metadata storage.

## Verification
- Existing annotation tests still pass.
- New tests prove role defaults and inventory tag capture.
