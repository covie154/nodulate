# Discussion: Phase 3 - Navigation & Progress Tracking

## Areas To Decide

- **Navigation model:** whether the annotator moves through images with flat Previous/Next controls, a random-access queue, or grouped nodule/study navigation.
- **Save-before-transition:** whether image changes wait for annotation auto-save, navigate optimistically, or prompt on pending changes.
- **Progress semantics:** whether completion is global, per-user, or session-only.
- **End-of-dataset state:** whether completion appears in-place, redirects to export, or uses a modal.

## Final Choices

- Use a flat deterministic Previous/Next sequence.
- Force-flush pending annotation saves before moving between images; block navigation if saving fails after retries.
- Treat progress as global team progress: an image is complete when it has one saved box.
- Show an in-workspace completion panel at the final labeled image; do not auto-redirect to export.

## Alternatives Considered

- **Sidebar queue:** useful for random access, but adds UI weight and invites queue/filter behavior outside the v1 scope.
- **Grouped nodule/study navigation:** rejected because the roadmap explicitly calls for a flat image list.
- **Optimistic navigation:** faster-feeling, but too risky for the "never lose work" core value.
- **Per-user/session progress:** richer analytics, but inconsistent with the shared global annotation pool.
- **Auto-export redirect:** tempting at the end of labeling, but export is Phase 4 and should remain an explicit user action.
