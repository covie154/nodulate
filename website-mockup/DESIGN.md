---
version: alpha
name: Sonolabel Landing Design System
description: Minimalist AMOLED-black landing page for an ultrasound lesion-labeling annotation tool
colors:
  background: "#000000"
  surface: "#0B0E10"
  surfaceRaised: "#14181B"
  border: "#23292D"
  text: "#F2F5F6"
  muted: "#8A9499"
  faint: "#5B656A"
  accent: "#37E0C8"
  accentDeep: "#0FA394"
  focus: "#5CB8FF"
  success: "#4ADE9A"
  warning: "#F5B84B"
  danger: "#F26D6D"
typography:
  display:
    fontFamily: "Space Grotesk"
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.02
  heading:
    fontFamily: "Space Grotesk"
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.15
  body:
    fontFamily: "Inter Tight"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  pill: 999px
spacing:
  xs: 6px
  sm: 12px
  md: 20px
  lg: 40px
  xl: 80px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#00110E"
    rounded: "{rounded.md}"
    padding: 14px
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 14px
  chip:
    backgroundColor: "{colors.surfaceRaised}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: 6px
---

## Overview

**Sonolabel** is a web app for manually labeling lesions on ultrasound images with
bounding boxes, exporting OpenCV-compatible data for ML pipelines. The audience is
medical annotators, researchers, and reviewers — a precision-first, low-noise crowd.

The landing page adopts the visual language of **medical imaging equipment**: a true
AMOLED-black canvas (like an ultrasound display in a darkened exam room), a single
luminous cyan "measurement" accent, and monospace type for coordinates, formats, and
data. The mood is calm, exact, and clinical — never flashy.

Design principles:
- **Black is the canvas, not a theme.** Pure `#000000` background so any imagery,
  bounding boxes, or accent glow reads like it's lit from within.
- **One accent, used sparingly.** Cyan marks interaction and measurement only.
- **Data speaks in monospace.** Coordinates, export formats, and metrics use mono.
- **Generous negative space.** Density belongs in the app, not the marketing page.

## Colors

| Token | Value | Role |
|---|---|---|
| background | `#000000` | AMOLED page canvas — true black |
| surface | `#0B0E10` | Cards and raised sections against black |
| surfaceRaised | `#14181B` | Nested chips, inputs, hovered rows |
| border | `#23292D` | Hairline dividers and card edges |
| text | `#F2F5F6` | Primary text (cool near-white, never pure) |
| muted | `#8A9499` | Secondary copy, captions |
| faint | `#5B656A` | Labels, metadata, disabled |
| accent | `#37E0C8` | Cyan — CTAs, bounding-box motif, links, focus glow |
| accentDeep | `#0FA394` | Accent pressed/gradient anchor |
| focus | `#5CB8FF` | Keyboard focus ring (distinct from accent) |
| success | `#4ADE9A` | "Saved" auto-save indicator |
| warning | `#F5B84B` | Review-needed states |
| danger | `#F26D6D` | Delete / error |

**Rationale — why cyan on black:** Ultrasound and sonography displays render tissue in
grayscale with cyan/teal measurement calipers and Doppler overlays. Cyan reads as
"instrument," feels clinical and modern, and glows convincingly against true black
without the medical-cliché of pure green or the consumer feel of blue-purple.

## Typography

Three families, each with a job. All are open-source and Google-Fonts hosted.

| Style | Family | Use |
|---|---|---|
| Display / Headings | **Space Grotesk** (500) | Geometric-humanist; feels technical and precise without being cold. Tight leading for big statements. |
| Body / UI | **Inter Tight** (400/500) | Compact, highly legible reading face for paragraphs, nav, and captions. |
| Data / Mono | **JetBrains Mono** (400) | Coordinates, export formats (`x, y, w, h`), metrics, code, and the bounding-box caption motif. |

**Why not Inter alone:** Space Grotesk gives the headlines an engineered, instrument
character that plain Inter lacks; pairing it with Inter Tight for body keeps reading
comfortable, and JetBrains Mono makes the annotation data feel authentic.

Type scale (clamped for responsiveness):
- Display: `clamp(2.75rem, 6vw, 4.5rem)` / weight 500 / line-height 1.02 / letter-spacing -0.02em
- H2: `clamp(1.5rem, 3vw, 2rem)` / weight 500
- Body-lg: `clamp(1.05rem, 1.4vw, 1.2rem)` / 1.6
- Body: `1rem` / 1.6
- Mono-label: `0.8125rem` / uppercase / letter-spacing 0.08em

## Layout

- Max content width `1120px`, centered, with `clamp(20px, 5vw, 80px)` horizontal padding.
- Single-column hero; feature and workflow sections may use 2–3 column grids that
  collapse to one column under 720px.
- Generous vertical rhythm: `xl` (80px) between major sections.

## Elevation & Depth

No heavy shadows on black — depth comes from **lightness deltas** (`background` →
`surface` → `surfaceRaised`) plus hairline `border`. The only glow is a soft cyan
radial behind the hero to suggest a lit imaging panel.

## Shapes

Rounded scale `sm 6 / md 10 / lg 16 / pill`. Buttons and cards use `md`–`lg`.
Bounding-box motif uses 1–1.5px cyan strokes with `sm` corners to echo the app UI.

## Components

- **button-primary** — cyan fill, near-black text, subtle glow on hover.
- **button-ghost** — transparent, hairline border, text turns cyan on hover.
- **chip** — pill, raised surface, cyan mono label (used for FR tags, formats).
- **bbox-card** — surface card wrapped in a dashed/solid cyan bounding-box frame with
  a mono coordinate caption, echoing the annotation experience.

## Do's and Don'ts

- **Do** keep the background true `#000000`; let content float on it.
- **Do** reserve cyan for interaction and measurement motifs.
- **Do** set coordinates, formats, and metrics in JetBrains Mono.
- **Don't** use pure white `#FFFFFF` text — use cool near-white `#F2F5F6`.
- **Don't** add gradient blobs, decorative emoji, or a second bright accent.
- **Don't** center body paragraphs; left-align for readability.
