from __future__ import annotations

import hashlib
import io
import re
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pydicom
from django.conf import settings
from PIL import Image

from .models import ImageAsset


@dataclass(frozen=True)
class DatasetFile:
    relative_path: str
    filename: str
    nodule_id: str
    sort_key: tuple[int, str]
    accession_no: str = ""
    sop_instance_uid: str = ""


def _numeric_prefix(value: str) -> int:
    match = re.search(r"\d+", value)
    return int(match.group(0)) if match else 0


def _read_matching_tags(path: Path) -> tuple[str, str]:
    try:
        dataset = pydicom.dcmread(
            str(path),
            stop_before_pixels=True,
            specific_tags=["AccessionNumber", "SOPInstanceUID"],
        )
    except Exception:
        return "", ""
    return str(getattr(dataset, "AccessionNumber", "") or ""), str(getattr(dataset, "SOPInstanceUID", "") or "")


def discover_dataset_files() -> list[DatasetFile]:
    root = Path(settings.DATASET_ROOT)
    if not root.exists():
        return []

    files: list[DatasetFile] = []
    for path in root.rglob("*.dcm"):
        relative = path.relative_to(root).as_posix()
        nodule_id = path.parent.name
        accession_no, sop_instance_uid = _read_matching_tags(path)
        files.append(
            DatasetFile(
                relative_path=relative,
                filename=path.name,
                nodule_id=nodule_id,
                sort_key=(_numeric_prefix(nodule_id), path.name.lower()),
                accession_no=accession_no,
                sop_instance_uid=sop_instance_uid,
            )
        )
    return sorted(files, key=lambda item: item.sort_key)


def sync_image_assets() -> list[ImageAsset]:
    assets: list[ImageAsset] = []
    for index, item in enumerate(discover_dataset_files(), start=1):
        asset, _ = ImageAsset.objects.update_or_create(
            relative_path=item.relative_path,
            defaults={
                "filename": item.filename,
                "nodule_id": item.nodule_id,
                "accession_no": item.accession_no,
                "sop_instance_uid": item.sop_instance_uid,
                "sequence_index": index,
            },
        )
        assets.append(asset)
    return list(ImageAsset.objects.order_by("sequence_index"))


def ensure_inventory() -> list[ImageAsset]:
    if not ImageAsset.objects.exists():
        return sync_image_assets()
    return list(ImageAsset.objects.order_by("sequence_index"))


def first_unlabeled_or_first() -> ImageAsset | None:
    ensure_inventory()
    unlabeled = ImageAsset.objects.filter(annotation__isnull=True).order_by("sequence_index").first()
    if unlabeled:
        return unlabeled
    return ImageAsset.objects.order_by("sequence_index").first()


def ensure_image_dimensions(asset: ImageAsset) -> ImageAsset:
    if asset.width and asset.height:
        return asset
    try:
        dataset = pydicom.dcmread(str(asset.dicom_path), stop_before_pixels=True, specific_tags=["Rows", "Columns"])
        asset.width = int(getattr(dataset, "Columns", 0) or 0)
        asset.height = int(getattr(dataset, "Rows", 0) or 0)
        if asset.width and asset.height:
            asset.save(update_fields=["width", "height", "updated_at"])
    except Exception:
        pass
    return asset


def _cache_path(asset: ImageAsset) -> Path:
    digest = hashlib.sha256(asset.relative_path.encode("utf-8")).hexdigest()[:20]
    return Path(settings.DICOM_CACHE_ROOT) / f"{asset.pk}-{digest}.png"


def _normalize_pixels(array: np.ndarray) -> np.ndarray:
    array = array.astype(np.float32)
    min_value = float(array.min())
    max_value = float(array.max())
    if max_value <= min_value:
        return np.zeros(array.shape, dtype=np.uint8)
    scaled = (array - min_value) / (max_value - min_value) * 255.0
    return scaled.clip(0, 255).astype(np.uint8)


def dicom_png_bytes(asset: ImageAsset) -> bytes:
    cache_path = _cache_path(asset)
    if cache_path.exists():
        return cache_path.read_bytes()

    dataset = pydicom.dcmread(str(asset.dicom_path))
    pixels = dataset.pixel_array
    if pixels.ndim == 2:
        image = Image.fromarray(_normalize_pixels(pixels), mode="L")
    else:
        if pixels.dtype != np.uint8:
            pixels = _normalize_pixels(pixels)
        image = Image.fromarray(pixels).convert("RGB")

    asset.width = int(image.width)
    asset.height = int(image.height)
    asset.accession_no = str(getattr(dataset, "AccessionNumber", "") or asset.accession_no or "")
    asset.sop_instance_uid = str(getattr(dataset, "SOPInstanceUID", "") or asset.sop_instance_uid or "")
    asset.save(update_fields=["width", "height", "accession_no", "sop_instance_uid", "updated_at"])

    cache_path.parent.mkdir(parents=True, exist_ok=True)
    output = io.BytesIO()
    image.save(output, format="PNG")
    payload = output.getvalue()
    cache_path.write_bytes(payload)
    return payload
