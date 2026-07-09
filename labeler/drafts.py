from __future__ import annotations

import csv
import io
from dataclasses import dataclass

from django.core.exceptions import ValidationError
from django.db import transaction

from .dicom import ensure_image_dimensions
from .models import DraftAnnotation, DraftUpload, ImageAsset


REQUIRED_COLUMNS = ["sopInstanceUid", "sx", "sy", "ex", "ey"]


@dataclass
class ImportSummary:
    imported: int = 0
    unmatched: int = 0
    errors: int = 0
    notes: list[str] | None = None

    def note(self, message: str):
        if self.notes is None:
            self.notes = []
        if len(self.notes) < 25:
            self.notes.append(message)


def latest_draft_upload() -> DraftUpload | None:
    return DraftUpload.objects.order_by("-uploaded_at", "-id").first()


def latest_visible_drafts():
    upload = latest_draft_upload()
    if not upload:
        return DraftAnnotation.objects.none()
    return DraftAnnotation.objects.filter(upload=upload, dismissed_at__isnull=True, image__annotation__isnull=True)


def latest_visible_draft_for(image: ImageAsset) -> DraftAnnotation | None:
    return latest_visible_drafts().filter(image=image).first()


def _text_from_file(csv_file) -> str:
    payload = csv_file.read()
    if isinstance(payload, str):
        return payload
    return payload.decode("utf-8-sig")


def _normalized_bbox(row: dict, image: ImageAsset) -> tuple[float, float, float, float]:
    image = ensure_image_dimensions(image)
    if not image.width or not image.height:
        raise ValueError("image dimensions are unknown")

    start_x = float(row["sx"])
    start_y = float(row["sy"])
    end_x = float(row["ex"])
    end_y = float(row["ey"])
    width = end_x - start_x
    height = end_y - start_y
    return start_x / image.width, start_y / image.height, width / image.width, height / image.height


@transaction.atomic
def import_draft_csv(upload: DraftUpload, csv_file) -> ImportSummary:
    text = _text_from_file(csv_file)
    reader = csv.DictReader(io.StringIO(text))
    summary = ImportSummary(notes=[])

    missing = [column for column in REQUIRED_COLUMNS if column not in (reader.fieldnames or [])]
    if missing:
        summary.errors += 1
        summary.note(f"Missing required columns: {', '.join(missing)}")
        upload.imported_count = 0
        upload.unmatched_count = 0
        upload.error_count = summary.errors
        upload.notes = "\n".join(summary.notes or [])
        upload.save(update_fields=["imported_count", "unmatched_count", "error_count", "notes"])
        return summary

    for row_number, row in enumerate(reader, start=2):
        accession_no = (row.get("accession_no") or "").strip()
        sop_instance_uid = (row.get("sopInstanceUid") or "").strip()
        image = ImageAsset.objects.filter(sop_instance_uid=sop_instance_uid).first()
        if not image:
            summary.unmatched += 1
            summary.note(f"Row {row_number}: no image for SOP Instance UID")
            continue

        try:
            x, y, width, height = _normalized_bbox(row, image)
            draft = DraftAnnotation.objects.filter(upload=upload, image=image).first() or DraftAnnotation(upload=upload, image=image)
            draft.accession_no = accession_no
            draft.sop_instance_uid = sop_instance_uid
            draft.x = x
            draft.y = y
            draft.width = width
            draft.height = height
            draft.dismissed_at = None
            draft.dismissed_by = None
            draft.full_clean()
            draft.save()
        except (KeyError, TypeError, ValueError, ValidationError) as exc:
            summary.errors += 1
            summary.note(f"Row {row_number}: {exc}")
            continue

        summary.imported += 1

    upload.imported_count = summary.imported
    upload.unmatched_count = summary.unmatched
    upload.error_count = summary.errors
    upload.notes = "\n".join(summary.notes or [])
    upload.save(update_fields=["imported_count", "unmatched_count", "error_count", "notes"])
    return summary

