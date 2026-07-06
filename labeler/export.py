from __future__ import annotations

from .models import Annotation, ImageAsset


CATEGORY_ID = 1


def _pixel_bbox(annotation: Annotation) -> list[float]:
    image = annotation.image
    width = image.width or 1
    height = image.height or 1
    return [
        round(annotation.x * width, 2),
        round(annotation.y * height, 2),
        round(annotation.width * width, 2),
        round(annotation.height * height, 2),
    ]


def build_coco_export() -> dict:
    images = []
    image_id_by_pk: dict[int, int] = {}
    for image_id, image in enumerate(ImageAsset.objects.order_by("sequence_index"), start=1):
        image_id_by_pk[image.pk] = image_id
        images.append(
            {
                "id": image_id,
                "file_name": image.filename,
                "width": image.width,
                "height": image.height,
                "relative_path": image.relative_path,
            }
        )

    annotations = []
    rows = Annotation.objects.select_related("image", "annotator").order_by("image__sequence_index")
    for annotation_id, annotation in enumerate(rows, start=1):
        bbox = _pixel_bbox(annotation)
        annotations.append(
            {
                "id": annotation_id,
                "image_id": image_id_by_pk[annotation.image_id],
                "category_id": CATEGORY_ID,
                "bbox": bbox,
                "area": round(bbox[2] * bbox[3], 2),
                "iscrowd": 0,
                "file_name": annotation.image.filename,
                "annotator": annotation.annotator.username,
                "timestamp": annotation.updated_at.isoformat(),
            }
        )

    return {
        "info": {
            "description": "nodulate thyroid nodule annotations",
            "version": "1.0",
        },
        "images": images,
        "annotations": annotations,
        "categories": [
            {
                "id": CATEGORY_ID,
                "name": "thyroid nodule",
                "supercategory": "lesion",
            }
        ],
    }
