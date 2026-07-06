# Phase 4: Export to COCO JSON - Context

**Gathered:** 2026-07-06
**Status:** Ready for planning

<domain>
## Phase Boundary

An authenticated team member can trigger an export that produces one COCO JSON file containing every saved annotation in the fixed dataset. The export includes image filename, bounding box coordinates, timestamp, and annotator identity. This phase does not add YOLO export, asynchronous job queues, cloud storage, reviewer approval, or dataset upload/import.

</domain>

<decisions>
## Implementation Decisions

### Export trigger
- **D-01:** Add a simple authenticated export action in the workspace/header or Django admin-adjacent app UI. Keep it as an explicit user-triggered download, not an automatic export at the end of Phase 3 completion.
- **D-02:** Use normal Django view + `JsonResponse`/`HttpResponse` download. No background job queue is needed for the v1 dataset size unless testing proves request time is unacceptable.

### COCO shape
- **D-03:** Export a standard COCO-like JSON object with `images`, `annotations`, and `categories`. Use one category: thyroid nodule.
- **D-04:** Store/export bounding boxes in pixel coordinates as COCO `[x, y, width, height]`, derived from Phase 2 normalized box coordinates and each image's original DICOM pixel dimensions.

### Annotation inclusion
- **D-05:** Include every image that has a saved annotation. Images without a box are omitted from `annotations`; they may still appear in `images` so downstream tooling can see dataset coverage.
- **D-06:** Include annotator identity and timestamp in annotation metadata fields in addition to COCO-required fields. Use username for annotator identity.

### File naming and freshness
- **D-07:** The response downloads as a timestamped JSON filename such as `nodulate-coco-YYYYMMDD-HHMMSS.json`.
- **D-08:** Generate the export from current database state at request time so it is always fresh.

### the agent's Discretion
- Exact export button placement, as long as it is authenticated and discoverable without turning the app into an admin dashboard.
- Whether unannotated images are included in the `images` array. If included, ensure `annotations` only includes labeled images.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Prior phase decisions
- `.planning/phases/01-login-image-viewer/01-CONTEXT.md` — locks DICOM decoding, image ordering, source dataset structure, and app identity.
- `.planning/phases/02-bounding-box-drawing-interface/02-CONTEXT.md` — locks one normalized bounding box per image and annotation persistence.
- `.planning/phases/03-navigation-progress-tracking/03-CONTEXT.md` — locks global completion semantics and keeps export as an explicit Phase 4 action.

### Project-level requirements
- `.planning/PROJECT.md` — core value, constraints, COCO-only export decision.
- `.planning/REQUIREMENTS.md` — EXP-01 and EXP-02 map to this phase.
- `.planning/ROADMAP.md` — phase goal and success criteria.

### Design system & mockups
- `website-mockup/DESIGN.md` — visual style for any export control.
- `website-mockup/app-screens.jsx` — export preview panel is useful as a placement reference, but its YOLO format is explicitly superseded by COCO JSON for v1.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Earlier phases should provide the image inventory service and annotation model needed to assemble COCO `images` and `annotations`.

### Established Patterns
- Django views/templates remain the app style.
- Normalized annotation coordinates are stored in the database and converted to pixels at output boundaries.

### Integration Points
- Export view reads image records/inventory and saved `Annotation` rows.
- Export URL should require authentication.
- Tests should assert COCO structure, filename/timestamp/annotator fields, and coordinate conversion.

</code_context>

<specifics>
## Specific Ideas

- Keep the export boring and trustworthy: a single fresh JSON download is more valuable than a preview-heavy workflow for v1.
- Include enough metadata for research traceability without exposing raw DICOM metadata.

</specifics>

<deferred>
## Deferred Ideas

- YOLO export, background export jobs, cloud storage, export history, reviewer-approved-only exports, and partial/filter exports are future work.

</deferred>

---

*Phase: 4-export-to-coco-json*
*Context gathered: 2026-07-06*
