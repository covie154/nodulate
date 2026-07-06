from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class ImageAsset(models.Model):
    relative_path = models.CharField(max_length=500, unique=True)
    filename = models.CharField(max_length=255)
    nodule_id = models.CharField(max_length=64)
    sequence_index = models.PositiveIntegerField(unique=True, db_index=True)
    width = models.PositiveIntegerField(default=0)
    height = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("sequence_index",)
        indexes = [
            models.Index(fields=["nodule_id", "filename"]),
        ]

    def __str__(self):
        return self.filename

    @property
    def dicom_path(self):
        return settings.DATASET_ROOT / self.relative_path


class Annotation(models.Model):
    image = models.OneToOneField(
        ImageAsset,
        on_delete=models.CASCADE,
        related_name="annotation",
    )
    annotator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="annotations",
    )
    x = models.FloatField()
    y = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("image__sequence_index",)

    def clean(self):
        fields = {
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
        }
        for name, value in fields.items():
            if value is None or value < 0 or value > 1:
                raise ValidationError({name: "Coordinate values must be between 0 and 1."})
        if self.width <= 0 or self.height <= 0:
            raise ValidationError("Annotation width and height must be positive.")
        if self.x + self.width > 1 or self.y + self.height > 1:
            raise ValidationError("Annotation must stay inside image bounds.")

    def as_normalized_dict(self):
        return {
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
            "annotator": self.annotator.username,
            "updated_at": self.updated_at.isoformat(),
        }

    def __str__(self):
        return f"{self.image.filename} annotation"
