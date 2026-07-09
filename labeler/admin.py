from django import forms
from django.contrib import admin, messages
from django.contrib.admin.sites import NotRegistered
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

from .drafts import import_draft_csv
from .models import Annotation, DraftAnnotation, DraftUpload, ImageAsset, UserProfile


User = get_user_model()


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    extra = 0
    max_num = 1


try:
    admin.site.unregister(User)
except NotRegistered:
    pass


@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    inlines = (UserProfileInline,)


@admin.register(ImageAsset)
class ImageAssetAdmin(admin.ModelAdmin):
    list_display = ("sequence_index", "filename", "nodule_id", "accession_no", "sop_instance_uid", "width", "height")
    search_fields = ("filename", "relative_path", "nodule_id", "accession_no", "sop_instance_uid")
    ordering = ("sequence_index",)


@admin.register(Annotation)
class AnnotationAdmin(admin.ModelAdmin):
    list_display = ("image", "annotator", "role", "updated_at")
    search_fields = ("image__filename", "annotator__username")
    list_filter = ("role",)
    list_select_related = ("image", "annotator")


class DraftUploadForm(forms.ModelForm):
    csv_file = forms.FileField(required=False, help_text="CSV columns: sopInstanceUid, sx, sy, ex, ey (optional: accession_no)")

    class Meta:
        model = DraftUpload
        fields = ("csv_file",)

    def clean(self):
        cleaned = super().clean()
        if not self.instance.pk and not cleaned.get("csv_file"):
            raise forms.ValidationError("Choose a CSV file to import.")
        return cleaned


@admin.register(DraftUpload)
class DraftUploadAdmin(admin.ModelAdmin):
    form = DraftUploadForm
    list_display = ("filename", "uploaded_by", "uploaded_at", "imported_count", "unmatched_count", "error_count")
    readonly_fields = ("filename", "uploaded_by", "uploaded_at", "imported_count", "unmatched_count", "error_count", "notes")
    search_fields = ("filename", "uploaded_by__username", "notes")
    ordering = ("-uploaded_at", "-id")

    def get_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields
        return ("csv_file",)

    def save_model(self, request, obj, form, change):
        if change:
            super().save_model(request, obj, form, change)
            return

        csv_file = form.cleaned_data["csv_file"]
        obj.filename = csv_file.name
        obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)
        summary = import_draft_csv(obj, csv_file)
        messages.info(
            request,
            f"Imported {summary.imported} drafts, {summary.unmatched} unmatched rows, {summary.errors} errors.",
        )


@admin.register(DraftAnnotation)
class DraftAnnotationAdmin(admin.ModelAdmin):
    list_display = ("image", "upload", "accession_no", "sop_instance_uid", "dismissed_at")
    search_fields = ("image__filename", "accession_no", "sop_instance_uid", "upload__filename")
    list_filter = ("upload", "dismissed_at")
    list_select_related = ("image", "upload")
    readonly_fields = ("created_at",)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role")
    list_filter = ("role",)
    search_fields = ("user__username",)
