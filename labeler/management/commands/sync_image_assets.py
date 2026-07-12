from django.core.management.base import BaseCommand

from labeler.dicom import sync_image_assets


class Command(BaseCommand):
    help = "Sync the DICOM dataset inventory into ImageAsset records."

    def handle(self, *args, **options):
        assets = sync_image_assets()
        count = len(assets)
        self.stdout.write(self.style.SUCCESS(f"Synced {count} image asset{'s' if count != 1 else ''}."))
