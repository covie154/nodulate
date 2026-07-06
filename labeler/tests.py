import json
import tempfile
from pathlib import Path
from unittest.mock import patch

from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse

from .dicom import discover_dataset_files, first_unlabeled_or_first, sync_image_assets
from .export import build_coco_export
from .models import Annotation, ImageAsset


User = get_user_model()


class DatasetInventoryTests(TestCase):
    def test_discovers_dataset_in_numeric_folder_filename_order(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for relative in ["10/10_1.dcm", "2/2_2.dcm", "2/2_1.dcm"]:
                path = root / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(b"fake")

            with override_settings(DATASET_ROOT=root):
                files = discover_dataset_files()

        self.assertEqual([item.relative_path for item in files], ["2/2_1.dcm", "2/2_2.dcm", "10/10_1.dcm"])

    def test_first_unlabeled_uses_global_annotation_state(self):
        user = User.objects.create_user(username="reader", password="secret12345")
        first = ImageAsset.objects.create(relative_path="4/4_8.dcm", filename="4_8.dcm", nodule_id="4", sequence_index=1)
        second = ImageAsset.objects.create(relative_path="4/4_10.dcm", filename="4_10.dcm", nodule_id="4", sequence_index=2)
        Annotation.objects.create(image=first, annotator=user, x=0.1, y=0.1, width=0.2, height=0.2)

        self.assertEqual(first_unlabeled_or_first(), second)


class WorkspaceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="annotator", password="secret12345")
        self.image = ImageAsset.objects.create(
            relative_path="4/4_8.dcm",
            filename="4_8.dcm",
            nodule_id="4",
            sequence_index=1,
            width=800,
            height=600,
        )

    def test_workspace_requires_authentication(self):
        response = self.client.get(reverse("workspace_image", args=[self.image.sequence_index]))

        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("login"), response["Location"])

    def test_authenticated_workspace_renders_image(self):
        self.client.force_login(self.user)

        response = self.client.get(reverse("workspace_image", args=[self.image.sequence_index]))

        self.assertContains(response, "nodulate")
        self.assertContains(response, self.image.filename)
        self.assertContains(response, reverse("image_png", args=[self.image.pk]))

    def test_annotation_save_replaces_existing_box(self):
        self.client.force_login(self.user)
        url = reverse("annotation_detail", args=[self.image.pk])

        first = self.client.post(url, data=json.dumps({"x": 0.1, "y": 0.2, "width": 0.3, "height": 0.4}), content_type="application/json")
        second = self.client.post(url, data=json.dumps({"x": 0.2, "y": 0.3, "width": 0.2, "height": 0.2}), content_type="application/json")

        self.assertEqual(first.status_code, 200)
        self.assertEqual(second.status_code, 200)
        self.assertEqual(Annotation.objects.count(), 1)
        annotation = Annotation.objects.get()
        self.assertEqual(annotation.annotator, self.user)
        self.assertAlmostEqual(annotation.x, 0.2)

    def test_annotation_delete_removes_box(self):
        self.client.force_login(self.user)
        Annotation.objects.create(image=self.image, annotator=self.user, x=0.1, y=0.1, width=0.2, height=0.2)

        response = self.client.delete(reverse("annotation_detail", args=[self.image.pk]))

        self.assertEqual(response.status_code, 200)
        self.assertFalse(Annotation.objects.exists())

    def test_invalid_annotation_is_rejected(self):
        self.client.force_login(self.user)

        response = self.client.post(
            reverse("annotation_detail", args=[self.image.pk]),
            data=json.dumps({"x": 0.9, "y": 0.9, "width": 0.3, "height": 0.3}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(Annotation.objects.exists())


class NavigationProgressTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="annotator", password="secret12345")
        self.first = ImageAsset.objects.create(relative_path="4/4_8.dcm", filename="4_8.dcm", nodule_id="4", sequence_index=1, width=800, height=600)
        self.second = ImageAsset.objects.create(relative_path="4/4_10.dcm", filename="4_10.dcm", nodule_id="4", sequence_index=2, width=800, height=600)

    def test_progress_counts_global_completed_images(self):
        Annotation.objects.create(image=self.first, annotator=self.user, x=0.1, y=0.1, width=0.2, height=0.2)
        self.client.force_login(self.user)

        response = self.client.get(reverse("workspace_image", args=[self.first.sequence_index]))

        self.assertContains(response, "50%")
        self.assertContains(response, "1 of 2 images")
        self.assertContains(response, reverse("workspace_image", args=[self.second.sequence_index]))

    def test_progress_pips_show_current_completed_and_pending_images(self):
        third = ImageAsset.objects.create(relative_path="4/4_12.dcm", filename="4_12.dcm", nodule_id="4", sequence_index=3, width=800, height=600)
        Annotation.objects.create(image=self.first, annotator=self.user, x=0.1, y=0.1, width=0.2, height=0.2)
        self.client.force_login(self.user)

        response = self.client.get(reverse("workspace_image", args=[self.second.sequence_index]))

        self.assertContains(response, 'class="progress-pip completed"', html=False)
        self.assertContains(response, 'class="progress-pip current"', html=False)
        self.assertContains(response, 'class="progress-pip pending"', html=False)
        self.assertContains(response, 'aria-current="step"', html=False)
        self.assertContains(response, 'Image 2: current')
        self.assertContains(response, reverse("workspace_image", args=[third.sequence_index]))

    def test_completion_message_on_final_labeled_image(self):
        Annotation.objects.create(image=self.first, annotator=self.user, x=0.1, y=0.1, width=0.2, height=0.2)
        Annotation.objects.create(image=self.second, annotator=self.user, x=0.2, y=0.2, width=0.2, height=0.2)
        self.client.force_login(self.user)

        response = self.client.get(reverse("workspace_image", args=[self.second.sequence_index]))

        self.assertContains(response, "Dataset complete")
        self.assertContains(response, "2 of 2 images")


class ExportTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="annotator", password="secret12345")
        self.image = ImageAsset.objects.create(
            relative_path="4/4_8.dcm",
            filename="4_8.dcm",
            nodule_id="4",
            sequence_index=1,
            width=800,
            height=600,
        )
        Annotation.objects.create(image=self.image, annotator=self.user, x=0.1, y=0.2, width=0.3, height=0.4)

    def test_coco_export_shape_and_metadata(self):
        payload = build_coco_export()

        self.assertEqual(payload["categories"], [{"id": 1, "name": "thyroid nodule", "supercategory": "lesion"}])
        self.assertEqual(payload["images"][0]["file_name"], "4_8.dcm")
        annotation = payload["annotations"][0]
        self.assertEqual(annotation["bbox"], [80.0, 120.0, 240.0, 240.0])
        self.assertEqual(annotation["annotator"], "annotator")
        self.assertEqual(annotation["file_name"], "4_8.dcm")
        self.assertIn("timestamp", annotation)

    def test_export_download_requires_authentication(self):
        response = self.client.get(reverse("export_coco"))

        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("login"), response["Location"])

    def test_export_download_is_timestamped_json_attachment(self):
        self.client.force_login(self.user)
        with patch("labeler.views.sync_image_assets"):
            response = self.client.get(reverse("export_coco"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/json")
        self.assertIn("attachment", response["Content-Disposition"])
        self.assertIn("nodulate-coco-", response["Content-Disposition"])
        self.assertEqual(json.loads(response.content)["annotations"][0]["annotator"], "annotator")
