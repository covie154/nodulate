import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create or update the optional deployment superuser from environment variables."

    def handle(self, *args, **options):
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "").strip()
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "").strip()
        update_password = os.environ.get("DJANGO_SUPERUSER_UPDATE_PASSWORD", "").strip().lower() in {
            "1",
            "true",
            "yes",
            "on",
        }

        if not username and not password and not email:
            self.stdout.write("No deployment superuser env configured; skipping.")
            return

        if not username or not password:
            raise CommandError("DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD must both be set.")

        User = get_user_model()
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            },
        )

        changed_fields = []
        if created or update_password:
            user.set_password(password)
            changed_fields.append("password")
        if email and user.email != email:
            user.email = email
            changed_fields.append("email")
        if not user.is_staff:
            user.is_staff = True
            changed_fields.append("is_staff")
        if not user.is_superuser:
            user.is_superuser = True
            changed_fields.append("is_superuser")
        if not user.is_active:
            user.is_active = True
            changed_fields.append("is_active")

        if created:
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Deployment superuser '{username}' created."))
            return

        if changed_fields:
            user.save(update_fields=changed_fields)
            self.stdout.write(self.style.SUCCESS(f"Deployment superuser '{username}' updated."))
        else:
            self.stdout.write(f"Deployment superuser '{username}' already exists; no changes needed.")