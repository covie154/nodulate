# Phase 6 Plan: Admin Draft CSV Import

## Goal
Allow admins to upload offline model predictions as retained draft uploads.

## Tasks
- Add DraftUpload and DraftAnnotation models.
- Add import service that parses CSV columns `sopInstanceUid`, `sx`, `sy`, `ex`, `ey` as pixel-space corner coordinates (`sx`,`sy` top-left; `ex`,`ey` bottom-right), with optional `accession_no` metadata.
- Match rows by SOP Instance UID only.
- Store import counts and invalid/unmatched row summaries.
- Add Django admin upload form/action.
- Add tests for successful import, retained uploads, latest-only draft lookup, and invalid rows.

## Verification
- Admin import tests pass.
- All uploads remain queryable; latest upload controls visible draft candidates.
