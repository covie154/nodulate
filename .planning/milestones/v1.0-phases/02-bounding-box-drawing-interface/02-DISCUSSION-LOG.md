# Phase 2: Bounding Box Drawing Interface - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-06
**Phase:** 2-bounding-box-drawing-interface
**Areas discussed:** Box lifecycle (draw/replace/delete), Resize precision, Auto-save reliability signaling

---

## Box lifecycle (draw/replace/delete)

### Q1: When a box already exists and the user drags on the canvas to start a new box, what should happen?

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-replace | New drag immediately discards the old box and starts drawing the new one | ✓ |
| Blocked until deleted | Dragging does nothing while a box exists; must delete first | |
| You decide | Leave to Claude's discretion | |

**User's choice:** Auto-replace
**Notes:** Resolves the mockup's unlimited-box behavior into the roadmap's "exactly one box, no path to a second" requirement.

### Q2: Should deleting a box have a keyboard shortcut in addition to a button?

| Option | Description | Selected |
|--------|-------------|----------|
| Button + Delete/Backspace key | Matches the mockup exactly | ✓ |
| Button only | Simpler, no accidental-keypress risk | |
| You decide | Leave to Claude's discretion | |

**User's choice:** Button + Delete/Backspace key

### Q3: Should the canvas show a hint when an image has no box yet?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, show the hint | Matches the mockup's "Click and drag over a lesion..." caption | ✓ |
| No hint, blank canvas | Cleaner, less cluttered | |

**User's choice:** Yes, show the hint

---

## Resize precision

### Q1: How many resize handles should the box have?

| Option | Description | Selected |
|--------|-------------|----------|
| Single corner handle | Matches the mockup exactly | |
| All 4 corner handles | Standard bounding-box editor pattern | ✓ |
| 4 corners + 4 edge midpoints | Full 8-handle editor, most precise | |

**User's choice:** All 4 corner handles

### Q2: How should extreme resize drags (tiny or flipped box) be handled?

| Option | Description | Selected |
|--------|-------------|----------|
| Clamp to a small minimum size | Can't shrink past minimum or flip inside-out | ✓ |
| Allow any size, even near-zero | No minimum enforced | |
| You decide | Leave threshold to Claude's discretion | |

**User's choice:** Clamp to a small minimum size

---

## Auto-save reliability signaling

### Q1: What should happen if a save request actually fails?

| Option | Description | Selected |
|--------|-------------|----------|
| Retry silently, warn only if it keeps failing | Auto-retry in background; visible warning only if retries exhausted | ✓ |
| Visible pending/failed state always | Show Saving/Failed state any time a save hasn't confirmed | |
| Block navigation until saved | Same as above plus disable Next/Previous/logout while unresolved | |

**User's choice:** Retry silently, warn only if it keeps failing
**Notes:** User confirmed this is the concrete mechanism behind the product's "rock-solid auto-save" core value.

### Q2: If the user tries to leave the image before the debounce timer fires, what should happen?

| Option | Description | Selected |
|--------|-------------|----------|
| Force an immediate save before leaving | Flushes the pending save right away instead of waiting for debounce | ✓ |
| Let the debounce finish in the background | Navigation proceeds immediately; save completes shortly after | |

**User's choice:** Force an immediate save before leaving
**Notes:** Ties to the roadmap's Phase 3 "already auto-saved before transition" success criterion — decided now as part of the auto-save mechanism itself.

---

## Claude's Discretion

- Exact debounce delay and "Saved" confirmation display duration.
- Exact minimum box size threshold for the resize clamp.
- Exact retry count/backoff strategy before surfacing the auto-save failure warning.
- Data model and endpoint design for persisting one box per image per annotator action.

## Deferred Ideas

- AI draft bounding-box toggle (v2) — already deferred project-wide, not re-discussed.
- Reviewer role / multi-expert review (v2) — already deferred project-wide, not re-discussed.
- No new scope-creep ideas surfaced during this discussion.
