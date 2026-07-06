---
schemaVersion: 1
scope: workspace
updatedAt: "2026-07-06T14:44:28.624Z"
workspaceName: "thyroid-nodule-labeler"
---

# Project Memory

## Project Overview
- Minimalist landing page for **Sonolabel**, a web-based ultrasound image labeling app.
- The app (per requirements doc) lets medical annotators draw lesion bounding boxes on ultrasound images and export in OpenCV-compatible format for ML workflows.
- Current phase: full landing page **built** on the approved font + color direction.

## Current State
- Full minimalist landing page built at `website-mockup/App.jsx`. Preview clean (428 nodes, 0 errors).
- Previous spec/swatch page preserved verbatim as `website-mockup/app-proposal.jsx`.
- `website-mockup/DESIGN.md` = authoritative baton (fonts, palette, component tokens), schema-valid.
- Old root `App.jsx` and `DESIGN.md` are redirect stubs only (files can't be deleted directly — safe to remove manually).

## Artifacts
- `website-mockup/DESIGN.md` — authoritative design-system baton.
- `website-mockup/App.jsx` — full landing page (hero, workflow, feature grid, export panel, FAQ, CTA, footer).
- `website-mockup/app-proposal.jsx` — preserved original spec/swatch page.
- `documentation/ultrasound-labeller-requirements.md` — source product requirements (268 lines); kept in place.
- Root `App.jsx` / `DESIGN.md` — redirect stubs only; safe to delete.

## Design Direction
- Product framing: precision clinical/ML annotation tool → visual language of medical imaging equipment; calm, focused, instrument-grade.
- AMOLED true-black canvas with a single luminous cyan accent (echoes ultrasound calipers/Doppler overlays), cool near-white text, layered near-black surfaces with hairline borders.
- Typography split by role: engineered display, comfortable body/UI, monospace for data/coordinates/export metrics.
- Landing hero uses a synthetic grayscale ultrasound sector with cyan bounding boxes, corner handles, scanning sweep line, and live monospace coordinate readout on hover.

## User Feedback
- Wants a **minimalist** landing page.
- Explicitly requested an **AMOLED black background**.
- Asked to see fonts + color scheme proposed *first* (done and approved).
- Wanted all design files moved to `website-mockup/` (done).
- Wanted original spec preserved as `app-proposal.jsx` before building the new page (done).

## Decisions
- Product name used: **Sonolabel**.
- True black `#000000` background confirmed.
- Cyan accent chosen deliberately over medical-green cliché.
- Three-font system by function (display / body / mono).
- Font + color direction **approved** (2026-07-06).
- Design files live under `website-mockup/`.
- Landing content pulled straight from requirements doc (auto-save, OpenCV x/y/w/h export, multi-box, browser-based).

## Open Questions
- Is "Sonolabel" an approved product name or a placeholder?
- Any brand assets/logo to incorporate?
- Should the requirements doc also move under `website-mockup/`, or stay in `documentation/`?

## Next Steps
- Get user review on the full landing page; iterate on section content/copy.
- Remove the leftover redirect stubs at root when convenient.
- Confirm product name and any brand assets.

## Promotion Candidates For DESIGN.md
- (Already in DESIGN.md) AMOLED `#000000` canvas + single cyan accent system.
- (Already in DESIGN.md) Role-based three-font typography.
- Note: `borderColor`/`border` are unsupported component property keys — avoid in component blocks.

## Recent History
- 2026-07-06: Read requirements doc; created DESIGN.md proposal + App.jsx spec page; fixed schema warnings; preview clean.
- 2026-07-06: User approved direction. Moved DESIGN.md + App.jsx into `website-mockup/`; left redirect stubs at root.
- 2026-07-06: Preserved spec page as `app-proposal.jsx`; built full landing page in `website-mockup/App.jsx` (hero, workflow, feature grid, tabbed export panel, FAQ, CTA, footer) with focus states, reduced-motion, mobile collapse, and 3 tweak controls. Preview clean (428 nodes, 0 errors).