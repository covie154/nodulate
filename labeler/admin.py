from django.contrib import admin

from .models import Annotation, ImageAsset


@admin.register(ImageAsset)
class ImageAssetAdmin(admin.ModelAdmin):
    list_display = ("sequence_index", "filename", "nodule_id", "width", "height")
    search_fields = ("filename", "relative_path", "nodule_id")
    ordering = ("sequence_index",)


@admin.register(Annotation)
class AnnotationAdmin(admin.ModelAdmin):
    list_display = ("image", "annotator", "updated_at")
    search_fields = ("image__filename", "annotator__username")
    list_select_related = ("image", "annotator")
