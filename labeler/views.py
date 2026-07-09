from __future__ import annotations

import json
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.http import require_http_methods

from .dicom import dicom_png_bytes, ensure_inventory, first_unlabeled_or_first, sync_image_assets
from .drafts import latest_visible_draft_for, latest_visible_drafts
from .export import build_coco_export
from .models import Annotation, ImageAsset, UserProfile


def _user_role(user) -> str:
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return profile.role


def _sequence_context(current: ImageAsset) -> dict:
    total = ImageAsset.objects.count()
    completed = Annotation.objects.count()
    percentage = round((completed / total) * 100) if total else 0
    previous_asset = ImageAsset.objects.filter(sequence_index__lt=current.sequence_index).order_by("-sequence_index").first()
    next_asset = ImageAsset.objects.filter(sequence_index__gt=current.sequence_index).order_by("sequence_index").first()
    is_complete = total > 0 and completed == total and next_asset is None
    annotated_image_ids = set(Annotation.objects.values_list("image_id", flat=True))
    draft_image_ids = set(latest_visible_drafts().values_list("image_id", flat=True))
    progress_items = []
    for position, asset in enumerate(ImageAsset.objects.only("id", "sequence_index").order_by("sequence_index"), start=1):
        is_current = asset.sequence_index == current.sequence_index
        is_completed = asset.id in annotated_image_ids
        is_draft = asset.id in draft_image_ids
        if is_current:
            status = "current"
        elif is_completed:
            status = "completed"
        elif is_draft:
            status = "draft"
        else:
            status = "pending"
        progress_items.append(
            {
                "label": position,
                "url": reverse("workspace_image", args=[asset.sequence_index]),
                "status": status,
                "is_current": is_current,
                "is_completed": is_completed,
                "is_draft": is_draft,
            }
        )
    return {
        "total_images": total,
        "completed_images": completed,
        "progress_percentage": percentage,
        "image_progress_items": progress_items,
        "previous_url": reverse("workspace_image", args=[previous_asset.sequence_index]) if previous_asset else "",
        "next_url": reverse("workspace_image", args=[next_asset.sequence_index]) if next_asset else "",
        "is_first": previous_asset is None,
        "is_last": next_asset is None,
        "is_complete": is_complete,
    }


@login_required
def workspace(request, sequence_index: int | None = None):
    ensure_inventory()
    if not ImageAsset.objects.exists():
        return render(request, "labeler/empty_dataset.html")

    if sequence_index is None:
        image = first_unlabeled_or_first()
        if image is None:
            raise Http404("No dataset images found.")
        return redirect("workspace_image", sequence_index=image.sequence_index)

    image = get_object_or_404(ImageAsset, sequence_index=sequence_index)
    annotation = getattr(image, "annotation", None)
    visible_box = annotation or latest_visible_draft_for(image)
    context = {
        "image": image,
        "annotation_json": json.dumps(visible_box.as_normalized_dict()) if visible_box else "null",
        "image_url": reverse("image_png", args=[image.pk]),
        "annotation_url": reverse("annotation_detail", args=[image.pk]),
        "export_url": reverse("export_coco"),
        **_sequence_context(image),
    }
    return render(request, "labeler/workspace.html", context)


@login_required
def image_png(request, pk: int):
    image = get_object_or_404(ImageAsset, pk=pk)
    payload = dicom_png_bytes(image)
    return HttpResponse(payload, content_type="image/png")


@login_required
@require_http_methods(["GET", "POST", "DELETE"])
def annotation_detail(request, pk: int):
    image = get_object_or_404(ImageAsset, pk=pk)

    if request.method == "GET":
        annotation = getattr(image, "annotation", None)
        visible_box = annotation or latest_visible_draft_for(image)
        return JsonResponse({"annotation": visible_box.as_normalized_dict() if visible_box else None})

    if request.method == "DELETE":
        deleted, _ = Annotation.objects.filter(image=image).delete()
        if deleted:
            return JsonResponse({"annotation": None, "status": "deleted"})
        draft = latest_visible_draft_for(image)
        if draft:
            draft.dismissed_at = timezone.now()
            draft.dismissed_by = request.user
            draft.save(update_fields=["dismissed_at", "dismissed_by"])
            return JsonResponse({"annotation": None, "status": "draft_deleted"})
        return JsonResponse({"annotation": None, "status": "empty"})

    try:
        payload = json.loads(request.body.decode("utf-8"))
        annotation = getattr(image, "annotation", None) or Annotation(image=image)
        annotation.annotator = request.user
        annotation.role = _user_role(request.user)
        annotation.x = float(payload["x"])
        annotation.y = float(payload["y"])
        annotation.width = float(payload["width"])
        annotation.height = float(payload["height"])
        annotation.full_clean()
        annotation.save()
    except (KeyError, TypeError, ValueError, json.JSONDecodeError, ValidationError) as exc:
        return JsonResponse({"error": str(exc)}, status=400)

    return JsonResponse({"annotation": annotation.as_normalized_dict(), "status": "saved"})


@login_required
def export_coco(request):
    sync_image_assets()
    payload = json.dumps(build_coco_export(), indent=2)
    stamp = timezone.now().strftime("%Y%m%d-%H%M%S")
    response = HttpResponse(payload, content_type="application/json")
    response["Content-Disposition"] = f'attachment; filename="nodulate-coco-{stamp}.json"'
    return response
