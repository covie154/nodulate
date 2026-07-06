# Phase 1: Login & Image Viewer - Context

**Gathered:** 2026-07-06
**Status:** Ready for planning

<domain>
## Phase Boundary

A known team member (one of 2-3 manually-provisioned annotators) logs into the app with a username/password and views a real thyroid ultrasound DICOM image at original resolution, decoded server-side via pydicom. This phase delivers auth + the read-only image viewing surface — it does NOT include drawing/editing bounding boxes (Phase 2), Next/Previous navigation or progress bar (Phase 3), or export (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### App identity
- **D-01:** App name is **nodulate** (all lowercase), everywhere in UI, page titles, and branding. Replaces the "Sonolabel" placeholder name used in the design mockups.

### Login experience
- **D-02:** Simple custom login page (not Django's default admin login), following the visual design in `website-mockup/DESIGN.md` and the login layout in `website-mockup/app-screens.jsx`.
- **D-03:** Sessions are long-lived (e.g. ~30 days) — annotators return often and should not need to log in repeatedly.
- **D-04:** No role selector on the login form. All v1 users are equal ("annotator" only) — the Annotator/Reviewer toggle shown in the mockup is dropped entirely (Reviewer is v2, deferred).
- **D-05:** No "Demo login" bypass button — that was a mockup convenience for previewing the design, not a feature. This is an internet-facing app with real accounts; no login bypass.

### DICOM rendering
- **D-06:** Images are decoded server-side: Django view uses pydicom + Pillow/numpy to decode the DICOM `pixel_array` (600x800, YBR_RCT, 8-bit, single-frame, single lesion per image) into a PNG, served as a plain `<img>` tag. No client-side DICOM decoding library (e.g. cornerstone.js) — not needed since no windowing/measurement/ROI tools are in scope.
- **D-07:** Converted PNGs are decoded once on first request and cached (disk or Django cache framework), not re-decoded on every page load — dataset is ~1400-1600 images, re-decoding every request would be wasteful.

### Account provisioning
- **D-08:** The 2-3 annotator accounts are created manually via Django's built-in admin site — no self-signup, no custom account-creation UI.
- **D-09:** All annotators have identical permissions in v1 — no admin/superuser distinction needed for the annotation workflow itself (Django admin access for account management is separate from the annotation app's permission model).

### Image ordering & entry point
- **D-10:** Images are presented in a flat, deterministic sequential order: sorted by nodule folder number, then by filename within the folder (matches `dataset/{nodule_id}/{nodule_id}_{n}.dcm` structure, e.g. 4_8, 4_10, 5_5, 5_6, 6_27...). Not grouped by nodule, not randomized.
- **D-11:** Annotation ownership is a **shared pool, first-come**: any of the 2-3 annotators can open any image; "unlabeled" is a global state (not per-user). Editing an image another annotator already boxed is allowed (no locking in v1).
- **D-12:** Immediately after login, the user lands on the first globally-unlabeled image in the sequence (not always image #1) — minimizes friction for returning annotators.

### Claude's Discretion
- Exact caching mechanism for converted PNGs (Django's cache framework vs. a simple file-based cache under `media/`) — pick whichever is simplest to implement correctly.
- Exact session cookie configuration (Django `SESSION_COOKIE_AGE` etc.) to achieve the ~30-day long-lived behavior.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design system & mockups
- `website-mockup/DESIGN.md` — AMOLED-black (`#000000`) + single cyan (`#37E0C8`) accent design system: full color palette, typography (Space Grotesk / Inter Tight / JetBrains Mono), spacing, component styles (buttons, chips, cards). This is the visual foundation for Phase 1's login page and carries forward to later phases.
- `website-mockup/app-screens.jsx` — Reference React/JSX implementation of the Login screen (`LoginScreen` component) and the Annotation Workspace screen (`AnnotationWorkspace` component). For Phase 1, only `LoginScreen` is directly relevant — reproduce its layout/structure in Django templates + CSS, adapted per the decisions above (drop role selector, drop demo login button, rename "Sonolabel" → "nodulate"). `AnnotationWorkspace` is a forward reference for Phases 2-3 (bounding box canvas, progress bar) — do not build it in Phase 1, but keep the file for later phases' discussions.
- `website-mockup/app-proposal.jsx` — Design system preview/showcase (palette swatches, type samples, applied component preview). Useful for extracting exact style values; not a screen to implement directly.

### Project-level requirements
- `.planning/PROJECT.md` — Core value, constraints (Django backend, pydicom, internet-facing deployment, small known team), Out of Scope list.
- `.planning/REQUIREMENTS.md` — AUTH-01/02/03, IMG-01/02/03 map to this phase.

### Source data
- `dataset/` (gitignored, sample present at time of writing: `dataset/4/`, `dataset/5/`, `dataset/6/`, `dataset/7/`, `dataset/8/`, each with 2 `.dcm` files) — confirmed via pydicom inspection: 600x800, `NumberOfFrames` absent (single-frame), `PhotometricInterpretation=YBR_RCT`, `Modality=US`, `BitsAllocated=8`, `SamplesPerPixel=3`, already de-identified (`PatientName`/`PatientID` are just the folder number, e.g. "4"). Real dataset will scale to ~700-800 nodules / ~1400-1600 files in this same structure.

</canonical_refs>

<code_context>
## Existing Code Insights

Greenfield project — no existing Django code yet. Nothing to reuse from a prior codebase; the design mockups (`website-mockup/*.jsx`) are the only pre-existing "code," and they're React/JSX design references to be reimplemented in Django templates/CSS/vanilla JS, not directly reused (project stack is Django, not React).

### Integration Points
- Django's `django.contrib.auth` (User model, login views, session middleware) is the natural foundation for D-02/D-03/D-08/D-09 — no need for a custom auth system or third-party auth library given the small, manually-provisioned team.
- pydicom + Pillow/numpy for DICOM→PNG decoding (D-06) — new dependency to add to `requirements.txt`.

</code_context>

<specifics>
## Specific Ideas

- The AMOLED-black + single-cyan-accent aesthetic from `website-mockup/DESIGN.md` is a deliberate, specific design direction (evokes ultrasound/sonography equipment displays) — not just a placeholder to be redesigned later. Follow it closely for the login page.
- App name "nodulate" should appear in lowercase everywhere (page titles, header/brand mark, etc.) — this is a deliberate stylistic choice, not a typo.

</specifics>

<deferred>
## Deferred Ideas

- AI draft bounding-box toggle (visible in `app-screens.jsx`'s `AnnotationWorkspace`, already tagged "v2" in the mockup) — matches PROJECT.md's explicit deferral of AI-assisted annotation. Belongs in a future milestone, not this phase or the current roadmap.
- Reviewer role (visible in the same mockup, already tagged "v2") — matches PROJECT.md's deferral of multi-expert review. No role field anywhere in v1.
- The mockup's export preview panel shows YOLO-format output (`0 0.5750 0.6600 0.2200 0.2600`) — this is superseded by the project's COCO JSON decision for v1. When Phase 4 (Export) is discussed, its export preview UI (if any) should reflect COCO JSON, not YOLO. Not a Phase 1 concern, but flagging so it isn't carried forward by mistake.

### Reviewed Todos (not folded)
None — no pending todos existed for this phase.

</deferred>

---

*Phase: 1-login-image-viewer*
*Context gathered: 2026-07-06*
