# Discussion: Phase 4 - Export to COCO JSON

## Areas To Decide

- **Export trigger:** explicit download, automatic export at completion, or background export job.
- **COCO shape:** standard COCO object, custom compact JSON, or alternative formats.
- **Annotation inclusion:** annotated images only, full dataset with missing annotations omitted, or per-user export.
- **File naming and freshness:** generate fresh timestamped output, persist export artifacts, or overwrite a static file.

## Final Choices

- Provide an explicit authenticated export download.
- Emit a standard COCO-like JSON object with `images`, `annotations`, and one `categories` entry for thyroid nodule.
- Convert normalized database boxes to pixel `[x, y, width, height]` values at export time.
- Include annotator username and annotation timestamp as metadata on each annotation.
- Generate the JSON fresh from current database state and use a timestamped `nodulate-coco-*.json` filename.

## Alternatives Considered

- **Automatic export after completion:** rejected because Phase 3 completion and Phase 4 export should stay decoupled.
- **Background job:** unnecessary for the v1 dataset size until evidence shows request-time export is too slow.
- **Custom JSON:** easier, but the explicit requirement is COCO JSON for downstream ML training.
- **YOLO text:** explicitly out of scope for v1.
- **Per-user export:** conflicts with the global shared annotation pool.
- **Persisted export artifacts:** useful for audit history later, but stale-file risk and extra storage bookkeeping are not needed for v1.
