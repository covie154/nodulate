from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver


class ImageAsset(models.Model):
    relative_path = models.CharField(max_length=500, unique=True)
    filename = models.CharField(max_length=255)
    nodule_id = models.CharField(max_length=64)
    accession_no = models.CharField(max_length=128, blank=True, db_index=True)
    sop_instance_uid = models.CharField(max_length=128, blank=True, db_index=True)
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
        constraints = [
            models.UniqueConstraint(
                fields=["sop_instance_uid"],
                condition=~Q(sop_instance_uid=""),
                name="unique_nonblank_image_sop_instance_uid",
            ),
        ]

    def __str__(self):
        return self.filename

    @property
    def dicom_path(self):
        return settings.DATASET_ROOT / self.relative_path


class UserProfile(models.Model):
    class Role(models.TextChoices):
        USER = "user", "User"
        TIEBREAKER = "tiebreaker", "Tiebreaker"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=16, choices=Role.choices, default=Role.USER)

    def __str__(self):
        return f"{self.user.username} ({self.role})"


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def ensure_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)


class Annotation(models.Model):
    class Role(models.TextChoices):
        USER = "user", "User"
        TIEBREAKER = "tiebreaker", "Tiebreaker"

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
    role = models.CharField(max_length=16, choices=Role.choices, default=Role.USER)
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
            "role": self.role,
            "source": "human",
            "updated_at": self.updated_at.isoformat(),
        }

    def __str__(self):
        return f"{self.image.filename} annotation"


class DraftUpload(models.Model):
    filename = models.CharField(max_length=255)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="draft_uploads",
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    imported_count = models.PositiveIntegerField(default=0)
    unmatched_count = models.PositiveIntegerField(default=0)
    error_count = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ("-uploaded_at", "-id")

    def __str__(self):
        return f"{self.filename} ({self.uploaded_at:%Y-%m-%d %H:%M})"


class DraftAnnotation(models.Model):
    upload = models.ForeignKey(DraftUpload, on_delete=models.CASCADE, related_name="drafts")
    image = models.ForeignKey(ImageAsset, on_delete=models.CASCADE, related_name="draft_annotations")
    accession_no = models.CharField(max_length=128, blank=True)
    sop_instance_uid = models.CharField(max_length=128, blank=True)
    x = models.FloatField()
    y = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    dismissed_at = models.DateTimeField(null=True, blank=True)
    dismissed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="dismissed_drafts",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("image__sequence_index", "id")
        indexes = [
            models.Index(fields=["upload", "image"]),
            models.Index(fields=["sop_instance_uid"]),
        ]
        constraints = [
            models.UniqueConstraint(fields=["upload", "image"], name="unique_draft_per_upload_image"),
        ]

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
            raise ValidationError("Draft width and height must be positive.")
        if self.x + self.width > 1 or self.y + self.height > 1:
            raise ValidationError("Draft must stay inside image bounds.")

    def as_normalized_dict(self):
        return {
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
            "annotator": "drafter",
            "role": "drafter",
            "source": "draft",
            "updated_at": self.upload.uploaded_at.isoformat(),
        }

    def __str__(self):
        return f"{self.image.filename} draft from {self.upload.filename}"

