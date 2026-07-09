---
status: complete
date: 2026-07-09
---

# Summary

Added inline accept and delete icon buttons to draft annotation captions. The buttons reuse the existing accept/delete behavior and are guarded so clicking them does not start a draw or move interaction on the image stage.

## Verification

- `python manage.py test labeler` passed: 21 tests.
- `node --check static\labeler\annotation.js` could not run because `node` is not installed on this machine.