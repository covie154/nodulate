# Thyroid Nodule Labeler

A Django web app for a small known team to annotate thyroid nodules on single-frame ultrasound DICOM images. Annotators log in, move through a fixed local dataset in sequence, draw one bounding box per image, rely on auto-save, and export completed annotations as COCO JSON for downstream machine learning work.

## Current Status

The MVP roadmap is implemented:

- Login for manually provisioned users
- DICOM discovery and PNG rendering through `pydicom`
- Sequential image review with progress tracking
- Single bounding-box draw, resize, delete, and auto-save
- COCO JSON export with image metadata, pixel-space bounding boxes, annotator, and timestamp

The app is intentionally narrow: it is a focused labeling workflow, not a PACS viewer, DICOM editor, AI-assisted annotator, or multi-review consensus system.

## Tech Stack

- Python and Django
- SQLite for local development
- `pydicom`, Pillow, and NumPy for DICOM-to-PNG display
- Server-rendered templates plus static JavaScript/CSS for the annotation UI

## Project Layout

```text
labeler/              Django app: models, views, DICOM handling, COCO export
nodulate/             Django project settings and URL configuration
templates/            Login, base layout, and annotation workspace templates
static/labeler/       Annotation JavaScript and CSS
dataset/              Local DICOM dataset root for development
media/dicom-cache/    Generated PNG cache, configurable by environment
.planning/            GSD planning and milestone artifacts
documentation/        Supporting project notes and discussions
```

## Setup

Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

On Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Initialize the database and create a user:

```bash
python manage.py migrate
python manage.py createsuperuser
```

Run the development server:

```bash
python manage.py runserver
```

Then open the app, log in at `/accounts/login/`, and use the workspace at `/`.


## Production Deployment

The production container path uses Gunicorn behind nginx, with certbot managing Let's Encrypt certificates. The Django container runs as UID/GID `10001`, uses three Gunicorn workers, and writes only to mounted volumes for SQLite, collected static files, and the generated DICOM PNG cache.

Create env files from the committed examples:

```bash
cp .env.testing.example .env.testing
cp .env.production.example .env.production
```

Never commit the populated `.env.testing` or `.env.production` files. Put real `DJANGO_SECRET_KEY`, domain, certbot email, and AWS values there. On EC2, prefer an instance role with S3 read access and leave `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` unset.

You can optionally bootstrap the initial Django admin account at container startup by setting both `DJANGO_SUPERUSER_USERNAME` and `DJANGO_SUPERUSER_PASSWORD` in the env file. `DJANGO_SUPERUSER_EMAIL` is optional. Existing users are promoted to staff/superuser if needed, but their password is not reset unless `DJANGO_SUPERUSER_UPDATE_PASSWORD=1` is set.

For a local container smoke test with local DICOM storage:

```bash
docker compose --env-file .env.testing -f compose.yaml -f compose.testing.yaml up --build web
```

For first production certificate issuance on an EC2 host with DNS already pointing at the instance:

```bash
docker compose --env-file .env.production --profile init-cert run --rm --service-ports certbot-init
```

Then start the HTTPS stack:

```bash
docker compose --env-file .env.production up --build -d web nginx certbot
```

The production env is configured for S3-backed image storage with:

```text
NODULATE_STORAGE_BACKEND=s3
NODULATE_S3_BUCKET=your-private-dicom-bucket
NODULATE_S3_PREFIX=optional/prefix
```

S3 objects are discovered recursively under the prefix and must keep the same folder/file convention as local testing. The app reads DICOM objects directly from S3 and stores only generated PNG cache files in the `dicom-cache` Docker volume.
## Configuration

The app reads these environment variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `DJANGO_SECRET_KEY` | Development-only fallback | Set this for any shared or deployed environment. |
| `DJANGO_DEBUG` | `1` | Use `0` outside local development. |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated host allowlist. |
| `DJANGO_SUPERUSER_USERNAME` | unset | Optional startup admin username; requires `DJANGO_SUPERUSER_PASSWORD`. |
| `DJANGO_SUPERUSER_PASSWORD` | unset | Optional startup admin password; keep only in uncommitted env files. |
| `DJANGO_SUPERUSER_EMAIL` | unset | Optional startup admin email. |
| `DJANGO_SUPERUSER_UPDATE_PASSWORD` | `0` | Set to `1` to rotate an existing startup admin password from env. |
| `NODULATE_DATASET_ROOT` | `dataset/` | Root folder scanned for `.dcm` files. |
| `NODULATE_DICOM_CACHE_ROOT` | `media/dicom-cache/` | PNG cache generated from DICOM pixel data. |

Dataset files are discovered recursively under `NODULATE_DATASET_ROOT`. The current convention is:

```text
dataset/
  4/
    4_8.dcm
    4_10.dcm
  5/
    5_5.dcm
```

The parent folder name is treated as the nodule id, and files are presented in numeric folder order and filename order.

## Annotation Workflow

1. Log in with a manually created Django user account.
2. Open the workspace.
3. Draw, resize, or delete the single bounding box for the current image.
4. Wait for the saved state before moving on.
5. Use Previous/Next or the progress indicators to navigate the dataset.
6. Use the COCO export action when annotations are ready.

Annotations are stored as normalized coordinates in the database and converted to pixel-space COCO bounding boxes during export.

## COCO Export

The export endpoint is:

```text
/export/coco/
```

It downloads a timestamped JSON file named like `nodulate-coco-YYYYMMDD-HHMMSS.json`. The export includes:

- `images`: filename, dimensions, and dataset-relative path
- `annotations`: COCO `bbox`, `area`, `image_id`, annotator username, filename, and timestamp
- `categories`: a single `thyroid nodule` lesion category

## Tests

Run the Django test suite with:

```bash
python manage.py test
```

The tests cover dataset ordering, authentication, annotation save/delete/validation, navigation progress, completion messaging, and COCO export shape.

## Privacy Notes

The source dataset is expected to be de-identified, but this is still medical imaging data. Avoid unnecessary logging, sharing, or exposing raw DICOM metadata. The app renders image pixels for annotation and keeps the workflow scoped to a small known team with authenticated access.

## Planning Artifacts

Project planning lives under `.planning/`, and `.claude/CLAUDE.md` is the canonical agent guidance generated from those artifacts. Use the GSD workflow for future substantial changes.
