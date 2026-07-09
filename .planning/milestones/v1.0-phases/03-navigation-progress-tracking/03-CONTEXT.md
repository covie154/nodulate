# Phase 3: Navigation & Progress Tracking - Context

**Gathered:** 2026-07-06
**Status:** Ready for planning

<domain>
## Phase Boundary

An authenticated annotator can move through the fixed DICOM image dataset in one flat deterministic sequence, can go backward to review/edit earlier work, can see current completion as a percentage and count, and gets an unmistakable completion state at the end of the dataset. This phase builds on Phase 2's box lifecycle and auto-save contract; it does not introduce export (Phase 4), reviewer workflows, locking, AI assistance, or grouped study/nodule navigation.

</domain>

<decisions>
## Implementation Decisions

### Navigation model
- **D-01:** Keep navigation intentionally flat and sequential: use the ordering locked in Phase 1 (nodule folder number, then filename) and expose only Previous/Next controls, not a sidebar queue or grouped nodule/study browser.
- **D-02:** The workspace entry point continues to choose the first globally unlabeled image. Direct image URLs remain valid for review/edit, but the primary workflow is sequential.

### Save-before-transition behavior
- **D-03:** Navigation must call the Phase 2 forced-save hook before changing images. If the current box is dirty, Next/Previous waits for the pending save to finish; if saving fails after retries, navigation is blocked and the user sees the failure state instead of silently moving on.
- **D-04:** Next and Previous return the same Django template with different image context rather than creating a client-side router. The front end stays Django templates plus vanilla JavaScript.

### Progress semantics
- **D-05:** Progress is global, not per-user: an image counts complete when it has one saved bounding box, regardless of which annotator created or edited it.
- **D-06:** The progress display shows both percentage and count using the wording pattern `45% - 23 of 50 images`, with count based on annotated images over total dataset images.

### End-of-dataset state
- **D-07:** When the annotator reaches the final image and it is labeled, show a clear completion panel in the workspace with the completed count and a disabled/secondary Next control. Do not auto-redirect to export; Phase 4 owns export.

### the agent's Discretion
- Exact URL shape for image detail routes (`/images/<index>/` vs `/images/<id>/`) as long as sequence order and direct review links remain stable.
- Whether progress is computed on each page request or through a lightweight JSON endpoint. Prefer the simpler server-rendered value unless implementation evidence suggests a smoother endpoint is needed.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Prior phase decisions
- `.planning/phases/01-login-image-viewer/01-CONTEXT.md` — locks Django templates + vanilla JS, app name `nodulate`, pydicom server decoding, flat deterministic dataset order, shared global annotation pool, and first-unlabeled landing behavior.
- `.planning/phases/02-bounding-box-drawing-interface/02-CONTEXT.md` — locks exactly one box per image, normalized coordinates, debounced auto-save, retry behavior, and forced save before leaving an image.

### Project-level requirements
- `.planning/PROJECT.md` — core value and constraints.
- `.planning/REQUIREMENTS.md` — NAV-01 through NAV-05 map to this phase.
- `.planning/ROADMAP.md` — phase goal and success criteria.

### Design system & mockups
- `website-mockup/DESIGN.md` — AMOLED-black + cyan-accent visual system.
- `website-mockup/app-screens.jsx` — annotation workspace reference for progress bar and Prev/Next placement. Carry forward the visual rhythm, but remove v2 AI/reviewer affordances and keep navigation flat.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 1/2 implementation will provide the authenticated workspace view, image ordering service, annotation model, and auto-save JavaScript. Phase 3 should extend those rather than adding a separate navigation surface.

### Established Patterns
- Server-rendered Django template plus vanilla JS remains the frontend approach.
- Image ordering is deterministic and derived from `dataset/{nodule_id}/{filename}.dcm`.
- Annotation completeness is global/shared, not per annotator.

### Integration Points
- Workspace route needs previous/next image identifiers, current index, total count, completed count, and completion boolean in context.
- Frontend navigation controls need to call the Phase 2 `flushPendingSave()` behavior before assigning `window.location`.

</code_context>

<specifics>
## Specific Ideas

- Avoid a heavy browser/list UI for v1. A small dense header/progress strip and action bar are enough for a 2-3 person research labeling workflow.
- Completion should feel final but calm: a visible panel or banner saying all images are labeled, not a modal that blocks reviewing the last image.

</specifics>

<deferred>
## Deferred Ideas

- Image queue filters, grouped nodule/study navigation, assignment queues, locking, and per-user workload dashboards are future capabilities. They are intentionally out of Phase 3.

</deferred>

---

*Phase: 3-navigation-progress-tracking*
*Context gathered: 2026-07-06*
