# Phase 1 Walking Skeleton

## Architecture

- Django project: `nodulate`
- App: `labeler`
- UI: Django templates plus vanilla JavaScript
- Storage: SQLite for v1/local development; Django ORM models for image inventory and annotations
- Source data: fixed local `dataset/` directory with nested DICOM files
- Image delivery: pydicom/Pillow server-side DICOM-to-PNG conversion with cached PNG files
- Auth: Django username/password sessions with manual user provisioning through Django admin

## End-To-End Slice

1. User visits `/accounts/login/`.
2. Django authenticates a manually-created user.
3. User is redirected to `/`.
4. Server scans/synchronizes the fixed dataset inventory.
5. Server decodes the current DICOM image to a cached PNG.
6. Browser displays the original-resolution image in the nodulate workspace.

## Follow-On Phases

- Phase 2 adds the annotation model/API and interactive bounding box overlay.
- Phase 3 adds sequential navigation, progress, and completion state.
- Phase 4 exports saved annotations as COCO JSON.
