# Ultrasound Image Labeling App - Production Requirements Document

## 1. Overview

### 1.1 Purpose
A web-based application for manually labeling lesions on ultrasound images using bounding boxes. The labeled data will be exported in OpenCV-compatible format for downstream machine learning workflows.

### 1.2 Target Users
- Medical annotators/researchers who need to label ultrasound images with lesion bounding boxes
- Reviewers/validators (v2+) who verify and approve annotations from primary annotators

---

## 2. Technical Stack

| Component | Technology |
|-----------|------------|
| Backend Framework | Django (Python) |
| Database | SQLite |
| Frontend | HTML/CSS/JavaScript |
| Image Processing | OpenCV (export format) |

---

## 3. Functional Requirements

### 3.1 Authentication
- **FR-1**: User login system with username/password
- **FR-2**: Session management (stay logged in during annotation session)
- **FR-3**: Role-based access: 'annotator', 'reviewer' (v2)

### 3.2 Image Display
- **FR-4**: Display ultrasound images at original resolution (no scaling, cropping, or adjustments)
- **FR-5**: Images loaded sequentially from a configured directory or database

### 3.3 Bounding Box Annotation
- **FR-6**: Click-and-drag interaction to draw bounding boxes over lesions
- **FR-7**: Resize existing bounding boxes by dragging corners/edges
- **FR-8**: Delete bounding boxes (select + delete key or UI button)
- **FR-9**: Multiple bounding boxes per image supported
- **FR-10**: **Auto-save annotations** as user draws/modifies (no manual save required)
- **FR-11**: Visual feedback on auto-save (e.g., brief "Saved" indicator)

### 3.4 Navigation & Persistence
- **FR-12**: "Next" button loads next image (annotations already auto-saved)
- **FR-13**: "Previous" button allows reviewing/editing prior images
- **FR-14**: End-of-image-set handling with completion message
- **FR-15**: **Progress bar** showing completion percentage (e.g., "45% — 23 of 50 images")

### 3.5 AI-Assisted Annotation (v2)
- **FR-16**: Optional AI model integration to generate draft bounding boxes
- **FR-17**: Annotator can accept, modify, or reject AI-generated boxes
- **FR-18**: Configurable toggle: enable/disable AI assistance per session

### 3.6 Multi-Expert Review Workflow (v2)
- **FR-19**: Annotations can be submitted for review by second expert
- **FR-20**: Second reviewer can approve, reject, or modify bounding boxes
- **FR-21**: Third reviewer option for disputed annotations
- **FR-22**: Review history tracking (who reviewed, when, what changes made)
- **FR-23**: Final consensus status per image (pending, approved, disputed)

### 3.7 Data Export
- **FR-24**: Export all annotations in OpenCV-compatible format (YOLO or COCO JSON)
- **FR-25**: Each export includes: image filename, bounding box coordinates (x, y, width, height), timestamp, and reviewer ID

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **NFR-1**: Image load time < 2 seconds for typical ultrasound images (1-5 MB)
- **NFR-2**: Smooth bounding box manipulation (no lag during drag operations)
- **NFR-3**: Auto-save debounce (save after 500ms of inactivity to reduce DB writes)

### 4.2 Usability
- **NFR-4**: Intuitive UI requiring minimal training
- **NFR-5**: Keyboard shortcuts: Arrow keys for navigation, Delete for removal, Ctrl+S manual save

### 4.3 Data Integrity
- **NFR-6**: All annotations persisted automatically (auto-save)
- **NFR-7**: No data loss on browser refresh (auto-save ensures persistence)
- **NFR-8**: Review changes tracked with audit trail

---

## 5. Data Model

### 5.1 Database Schema (SQLite)

**Table: users**
- id (PK, INTEGER)
- username (TEXT, UNIQUE)
- password_hash (TEXT)
- role (TEXT: 'annotator', 'reviewer', 'admin')
- created_at (DATETIME)

**Table: images**
- id (PK, INTEGER)
- filename (TEXT)
- filepath (TEXT)
- uploaded_at (DATETIME)
- status (TEXT: 'pending', 'annotated', 'in_review', 'approved', 'disputed')
- current_reviewer_id (FK → users.id, nullable)

**Table: annotations**
- id (PK, INTEGER)
- image_id (FK → images.id)
- annotator_id (FK → users.id)
- x (INTEGER) - top-left x coordinate
- y (INTEGER) - top-left y coordinate
- width (INTEGER)
- height (INTEGER)
- source (TEXT: 'manual', 'ai_draft')
- created_at (DATETIME)
- updated_at (DATETIME)

**Table: reviews** *(v2)*
- id (PK, INTEGER)
- annotation_id (FK → annotations.id)
- reviewer_id (FK → users.id)
- action (TEXT: 'approved', 'rejected', 'modified')
- modified_x (INTEGER, nullable)
- modified_y (INTEGER, nullable)
- modified_width (INTEGER, nullable)
- modified_height (INTEGER, nullable)
- notes (TEXT, nullable)
- created_at (DATETIME)

**Table: ai_models** *(v2)*
- id (PK, INTEGER)
- model_name (TEXT)
- model_path (TEXT)
- version (TEXT)
- active (BOOLEAN)
- created_at (DATETIME)

---

## 6. User Interface Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Ultrasound Labeler              [User: john] [Logout]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │                    [Ultrasound Image]               │   │
│   │                                                     │   │
│   │                  ┌───────────────┐                  │   │
│   │                  │  [Bounding    │                  │   │
│   │                  │   Box]        │                  │   │
│   │                  └───────────────┘                  │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   Progress: ████████████░░░░░ 45% (23 of 50)                │
│                                                             │
│   [AI Draft: OFF]  [Delete Selected]  [← Prev]  [Next →]    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Export Format Specification

### 7.1 OpenCV/YOLO Format
Each annotation exported as text file alongside image:
```
<class_id> <x_center> <y_center> <width> <height>
```
All values normalized to 0-1 range relative to image dimensions.

### 7.2 Alternative: COCO JSON Format
```json
{
  "images": [{"id": 1, "file_name": "ultrasound_001.png"}],
  "annotations": [{
    "id": 1,
    "image_id": 1,
    "bbox": [x, y, width, height],
    "area": width * height,
    "annotator_id": 5,
    "reviewer_id": 8,
    "status": "approved"
  }]
}
```

---

## 8. Project Structure (Proposed)

```
ultrasound-labeller/
├── manage.py
├── requirements.txt
├── db.sqlite3
├── labeller/
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── templates/
│       └── labeller/
│           ├── login.html
│           ├── annotate.html
│           └── review.html (v2)
├── static/
│   ├── css/
│   └── js/
│       └── bounding-box.js
├── media/
│   └── uploads/          # Uploaded ultrasound images
├── exports/              # Generated annotation files
└── ai_models/            # v2: Stored AI model files
```

---

## 9. Version Roadmap

### v1.0 (MVP)
- User authentication
- Image display (original resolution)
- Manual bounding box creation, resize, delete
- Auto-save annotations
- Progress bar
- Next/Previous navigation
- OpenCV/YOLO export

### v2.0 (Enhanced)
- AI segmentation model integration (draft bounding boxes)
- Multi-expert review workflow (2nd and 3rd reviewers)
- Review history and audit trail
- Consensus tracking per image
- Role-based access control

---

## 10. Future Enhancements (Out of Scope)

- Multi-user collaboration (real-time)
- Image preprocessing (contrast adjustment, normalization)
- Integration with cloud storage (S3, GCS)
- REST API for programmatic access
- Docker containerization

---

## 11. Success Criteria

- [ ] User can log in and see list of images to annotate
- [ ] User can draw, resize, and delete bounding boxes
- [ ] **Annotations auto-save** without manual intervention
- [ ] **Progress bar** shows real-time completion status
- [ ] At end of dataset, user can download all annotations in OpenCV format
- [ ] **(v2)** AI model can generate draft bounding boxes
- [ ] **(v2)** Second/third reviewers can validate or modify annotations
- [ ] No data loss during normal operation

---

**Document Version:** 1.1  
**Created:** June 17, 2026  
**Last Updated:** June 17, 2026  
**Status:** Draft — Ready for implementation review
