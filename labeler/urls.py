from django.urls import path

from . import views


urlpatterns = [
    path("", views.workspace, name="workspace"),
    path("images/<int:sequence_index>/", views.workspace, name="workspace_image"),
    path("images/<int:pk>/png/", views.image_png, name="image_png"),
    path("images/<int:pk>/annotation/", views.annotation_detail, name="annotation_detail"),
    path("export/coco/", views.export_coco, name="export_coco"),
]
