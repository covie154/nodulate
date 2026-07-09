# Phase 1: Login & Image Viewer - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-06
**Phase:** 1-login-image-viewer
**Areas discussed:** Login experience, DICOM rendering, Account provisioning, Image ordering & entry point, Branding & design system

---

## Login experience

| Option | Description | Selected |
|--------|-------------|----------|
| Simple custom page | Clean branded login form matching the tool's look | ✓ |
| Django admin login | Reuse Django's built-in admin login page as-is | |
| You decide | Claude picks a reasonable simple approach | |

**User's choice:** Simple custom page
**Notes:** Later tied to the `website-mockup/DESIGN.md` design system and `app-screens.jsx` login layout once the user shared the mockups.

| Option | Description | Selected |
|--------|-------------|----------|
| Long-lived | Stay logged in for weeks (e.g. 30 days) | ✓ |
| Standard session | Django's default session behavior | |
| You decide | Claude picks a sensible default | |

**User's choice:** Long-lived (~30 days)

---

## DICOM rendering

| Option | Description | Selected |
|--------|-------------|----------|
| Server-side to PNG | pydicom + Pillow/numpy decode once, serve as plain `<img>` | ✓ |
| Client-side JS decode | Serve raw DICOM bytes, decode in-browser (cornerstone.js) | |
| You decide | Claude picks the simpler approach | |

**User's choice:** Server-side to PNG
**Notes:** User explicitly doesn't need windowing/measurement/ROI tools, so client-side DICOM libraries aren't warranted.

| Option | Description | Selected |
|--------|-------------|----------|
| Convert on first request, cache | Decode once, cache the PNG; later loads are instant | ✓ |
| Convert every request | Simpler code, but re-decodes every page load | |
| You decide | Claude picks a sensible caching approach | |

**User's choice:** Convert on first request, cache

---

## Account provisioning

| Option | Description | Selected |
|--------|-------------|----------|
| Django admin | Use Django's built-in admin site to create/manage users | ✓ |
| Management command | Custom CLI command/script for provisioning | |
| You decide | Claude picks the simplest approach | |

**User's choice:** Django admin

| Option | Description | Selected |
|--------|-------------|----------|
| All equal | Every logged-in user can annotate any image, no per-role permissions | ✓ |
| Need an admin role | One user needs elevated access beyond plain annotators | |

**User's choice:** All equal

---

## Image ordering & entry point

| Option | Description | Selected |
|--------|-------------|----------|
| Sorted by nodule then filename | Deterministic order matching folder structure | ✓ |
| Shuffled/random order | Randomize once at import to avoid ordering bias | |
| You decide | Claude picks a sensible deterministic order | |

**User's choice:** Sorted by nodule then filename

| Option | Description | Selected |
|--------|-------------|----------|
| First unlabeled image | Jump to wherever progress left off / next un-annotated image | ✓ |
| Always first image | Always start at image #1 regardless of progress | |
| You decide | Claude picks the most useful default | |

**User's choice:** First unlabeled image

| Option | Description | Selected |
|--------|-------------|----------|
| Shared pool, first-come | Any annotator can open any unlabeled image; global unlabeled state | ✓ |
| Split by range | Each annotator assigned a fixed slice of the dataset | |
| Let me explain | Different setup in mind | |

**User's choice:** Shared pool, first-come

---

## Branding & design system

User provided existing design work under `website-mockup/`: `DESIGN.md` (design system spec), `app-proposal.jsx` (design system showcase), `app-screens.jsx` (Login + Annotation Workspace screen implementations), all built under the placeholder name "Sonolabel."

**User's choice:** Rename the app to **nodulate** (all lowercase) everywhere the mockups say "Sonolabel." Confirmed the mockups' design system and login screen apply to Phase 1.

| Option | Description | Selected |
|--------|-------------|----------|
| Drop it | No role concept in v1, matches earlier decision | ✓ |
| Keep it, annotator-only | Keep the UI element showing only "Annotator" | |

**User's choice:** Drop the role selector shown on the mockup's login screen entirely.

| Option | Description | Selected |
|--------|-------------|----------|
| No, remove it | Mockup convenience only; internet-facing app shouldn't have a login bypass | ✓ |
| Keep it | Useful for testing/demos | |

**User's choice:** Remove the "Demo login" bypass button from the real login screen.

---

## Claude's Discretion

- Exact caching mechanism for converted DICOM→PNG images (Django cache framework vs. simple file-based cache).
- Exact Django session cookie configuration to achieve ~30-day long-lived sessions.

## Deferred Ideas

- AI draft bounding-box toggle (shown in `app-screens.jsx` workspace mockup, already tagged "v2") — matches PROJECT.md's deferral of AI-assisted annotation.
- Reviewer role (shown in the same mockup, already tagged "v2") — matches PROJECT.md's deferral of multi-expert review.
- Mockup's export preview panel shows YOLO-format output — superseded by the project's COCO JSON decision for v1; flagged for Phase 4 so it isn't carried forward by mistake.
