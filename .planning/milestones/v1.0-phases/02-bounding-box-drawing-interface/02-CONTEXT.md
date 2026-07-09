# Phase 2: Bounding Box Drawing Interface - Context

**Gathered:** 2026-07-06
**Status:** Ready for planning

<domain>
## Phase Boundary

An annotator draws exactly one bounding box around the nodule on the current image (already being viewed via Phase 1's server-decoded `<img>`), can resize or delete it, and every change auto-saves in the background with a visible confirmation. This phase does NOT include Next/Previous navigation or the progress bar (Phase 3) or export (Phase 4) — the box lifecycle and its persistence are the entire scope.

</domain>

<decisions>
## Implementation Decisions

### Box lifecycle (draw / replace / delete)
- **D-01:** When a box already exists and the user click-and-drags on the canvas, the new drag immediately replaces the old box (delete-then-create in one motion) — no separate "delete first" step required. This resolves the mockup's current behavior (which allows unlimited boxes) into the roadmap's "exactly one box per image, no path to a second" requirement.
- **D-02:** Deleting a box is available both via a "Delete selected" button and the Delete/Backspace key (click the box first to select it) — matches the reference mockup's interaction.
- **D-03:** When an image has no box (fresh image, or just deleted/replaced), the canvas shows a subtle hint caption, e.g. "Click and drag over a lesion to draw a box" — matches the mockup's empty state.

### Resize precision
- **D-04:** The box has a resize handle on all 4 corners (not just the mockup's single bottom-right handle, and not a full 8-handle corners+edges set). Each corner can be dragged independently to adjust that corner's position.
- **D-05:** Resizing clamps to a small minimum size and cannot flip the box inside-out — dragging a corner past that point just stops there rather than collapsing or inverting the box.

### Auto-save reliability
- **D-06:** If a save request fails (network drop, server error), the app retries automatically in the background. A visible failure/warning indicator only appears if retries are exhausted — the common case (transient blip, succeeds on retry) stays invisible to the annotator. This is the concrete mechanism behind the product's "rock-solid auto-save" core value.
- **D-07:** If the annotator finishes drawing/resizing and immediately tries to leave the image before the debounce timer would normally fire, the pending save is flushed immediately rather than waiting for the debounce — the box is guaranteed saved before any transition away from the image proceeds.

### Claude's Discretion
- Exact debounce delay and "Saved" confirmation display duration (the reference mockup uses ~500ms debounce / ~1.8s pulse — reasonable starting point, not locked).
- Exact minimum box size threshold for the resize clamp (D-05).
- Exact retry count/backoff strategy before surfacing the auto-save failure warning (D-06).
- Data model and endpoint design for persisting one box per image per annotator action — no annotation persistence exists yet in the Django app (greenfield for this phase); shape of the request/response is an implementation detail.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design system & mockups
- `website-mockup/DESIGN.md` — AMOLED-black + cyan-accent design system (colors, typography, spacing, component styles). Same visual foundation used in Phase 1; carries forward unchanged for the annotation canvas.
- `website-mockup/app-screens.jsx` — `AnnotationWorkspace` component is the primary interaction reference: click-drag box creation, drag-to-move, corner resize handle, debounced auto-save with "Saved" pulse, Delete/Backspace shortcut, empty-state hint caption. **Important divergences from this phase's decisions:** the mockup allows unlimited boxes and an "AI draft" box coexisting with the manual box (both are v2/deferred concerns, not this phase) and has only one resize handle (this phase uses 4, per D-04). The mockup is React/JSX — reimplement the *interaction pattern*, not the code, in whatever stack Phase 1 established (Django templates + vanilla JS, not React — see 01-CONTEXT.md D-02).
- `website-mockup/app-proposal.jsx` — supplementary style/motif reference (`BBoxCard`) for the cyan-frame-with-corner-handles visual motif.

### Prior phase decisions
- `.planning/phases/01-login-image-viewer/01-CONTEXT.md` — locks the app name ("nodulate"), confirms images are served server-side as a plain `<img>` tag (PNG decoded from DICOM via pydicom, 600×800, no client-side DICOM library), and establishes Django templates + vanilla JS (not a React SPA) as the frontend approach. Phase 2's box overlay must work against that plain `<img>` element.

### Project-level requirements
- `.planning/PROJECT.md` — Core value ("rock-solid auto-save... should never lose work"), constraints.
- `.planning/REQUIREMENTS.md` — BBOX-01 through BBOX-06 map to this phase.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None in Django yet — greenfield for annotation persistence and the box-drawing UI. `website-mockup/app-screens.jsx`'s `AnnotationWorkspace` is a React design reference to reimplement, not code to import directly (project stack is Django templates + vanilla JS per Phase 1).

### Established Patterns
- Normalized 0–1 coordinate system for box position/size (seen in the mockup) — keeps box math independent of the image's actual pixel dimensions, worth carrying into the real implementation regardless of language.
- Debounced auto-save + fading "Saved" confirmation pulse — the interaction shape to replicate; exact timing is Claude's discretion (see above).

### Integration Points
- The box overlay sits on top of Phase 1's server-rendered `<img>` (600×800 PNG decoded from DICOM).
- No annotation data model or save endpoint exists yet — this phase must introduce both (Django model for a box per image, and a view/endpoint the frontend calls on debounced save and on forced flush-before-navigate per D-07).

</code_context>

<specifics>
## Specific Ideas

- "Rock-solid auto-save" should translate concretely into: retries happen invisibly, and only a genuine, persistent failure interrupts the annotator (D-06) — the user was explicit that this is the mechanism behind the product's core value, not just a nice-to-have.
- Leaving an image (e.g. via Next/Previous, once Phase 3 builds those buttons) must force-flush any pending save first (D-07) — this is decided now as part of the auto-save mechanism itself, so Phase 3's navigation can rely on it already being true.

</specifics>

<deferred>
## Deferred Ideas

- AI draft bounding-box toggle (visible in `app-screens.jsx`, tagged "v2" in the mockup) — already deferred project-wide per `01-CONTEXT.md`; not re-discussed here.
- Reviewer role / multi-expert review (same mockup, tagged "v2") — already deferred project-wide; not re-discussed here.
- No new scope-creep ideas surfaced during this discussion — it stayed within the box-lifecycle / resize / auto-save scope.

### Reviewed Todos (not folded)
None — no pending todos matched this phase.

</deferred>

---

*Phase: 2-bounding-box-drawing-interface*
*Context gathered: 2026-07-06*
