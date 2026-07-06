(function () {
  const stage = document.getElementById("annotation-stage");
  if (!stage) return;

  const layer = document.getElementById("box-layer");
  const hint = document.getElementById("empty-hint");
  const saveState = document.getElementById("save-state");
  const summary = document.getElementById("annotation-summary");
  const deleteButton = document.getElementById("delete-box");
  const annotationUrl = stage.dataset.annotationUrl;
  const minSize = 0.02;
  const debounceMs = 500;
  const retryLimit = 3;

  let box = parseInitial(stage.dataset.initial);
  let drag = null;
  let dirty = false;
  let saveTimer = null;
  let inFlightSave = null;

  function parseInitial(value) {
    if (!value || value === "null") return null;
    try {
      const parsed = JSON.parse(value);
      if (!parsed) return null;
      return {
        x: Number(parsed.x),
        y: Number(parsed.y),
        width: Number(parsed.width),
        height: Number(parsed.height),
      };
    } catch (_err) {
      return null;
    }
  }

  function csrfToken() {
    const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
  }

  function setSaveState(kind, message) {
    saveState.className = `save-state ${kind || ""}`;
    saveState.textContent = message || "";
  }

  function rect() {
    return stage.getBoundingClientRect();
  }

  function fitStageToAvailableSpace() {
    const image = document.getElementById("dicom-image");
    const wrap = stage.parentElement;
    if (!image || !wrap || !image.naturalWidth || !image.naturalHeight) return;

    const availableWidth = wrap.clientWidth;
    const availableHeight = wrap.clientHeight;
    if (!availableWidth || !availableHeight) return;

    const scale = Math.min(availableWidth / image.naturalWidth, availableHeight / image.naturalHeight);
    const width = Math.floor(image.naturalWidth * scale);
    const height = Math.floor(image.naturalHeight * scale);

    stage.style.width = `${width}px`;
    stage.style.height = `${height}px`;
    render();
  }

  function point(event) {
    const r = rect();
    return {
      x: Math.max(0, Math.min(1, (event.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (event.clientY - r.top) / r.height)),
    };
  }

  function cleanBox(raw) {
    const x = Math.max(0, Math.min(1, raw.x));
    const y = Math.max(0, Math.min(1, raw.y));
    const width = Math.max(minSize, Math.min(1 - x, raw.width));
    const height = Math.max(minSize, Math.min(1 - y, raw.height));
    return { x, y, width, height };
  }

  function px(value, axis) {
    const r = rect();
    return Math.round(value * (axis === "x" ? r.width : r.height));
  }

  function render() {
    layer.innerHTML = "";
    hint.classList.toggle("hidden", !!box);
    if (!box) {
      summary.textContent = "No box on this image yet.";
      return;
    }

    const el = document.createElement("div");
    el.className = "annotation-box";
    el.style.left = `${box.x * 100}%`;
    el.style.top = `${box.y * 100}%`;
    el.style.width = `${box.width * 100}%`;
    el.style.height = `${box.height * 100}%`;
    el.dataset.box = "1";

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.textContent = `lesion · ${px(box.x, "x")},${px(box.y, "y")} ${px(box.width, "x")}×${px(box.height, "y")}`;
    el.appendChild(caption);

    ["nw", "ne", "sw", "se"].forEach((corner) => {
      const handle = document.createElement("span");
      handle.className = `resize-handle ${corner}`;
      handle.dataset.handle = corner;
      el.appendChild(handle);
    });

    layer.appendChild(el);
    summary.innerHTML = `x${px(box.x, "x")} y${px(box.y, "y")}<br>w${px(box.width, "x")} h${px(box.height, "y")}`;
  }

  function markDirty() {
    dirty = true;
    setSaveState("saving", "Saving...");
    if (saveTimer) window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => saveNow(), debounceMs);
  }

  async function requestSave(payload, attempt) {
    const options = payload
      ? {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken(),
          },
          body: JSON.stringify(payload),
        }
      : {
          method: "DELETE",
          headers: { "X-CSRFToken": csrfToken() },
        };

    try {
      const response = await fetch(annotationUrl, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt < retryLimit) {
        await new Promise((resolve) => window.setTimeout(resolve, 300 * attempt));
        return requestSave(payload, attempt + 1);
      }
      throw error;
    }
  }

  async function saveNow() {
    if (saveTimer) {
      window.clearTimeout(saveTimer);
      saveTimer = null;
    }
    if (!dirty && !inFlightSave) return true;
    if (inFlightSave) return inFlightSave;

    const payload = box ? { ...box } : null;
    inFlightSave = requestSave(payload, 1)
      .then(() => {
        dirty = false;
        setSaveState("saved", "Saved");
        window.setTimeout(() => {
          if (!dirty) setSaveState("", "");
        }, 1800);
        return true;
      })
      .catch((error) => {
        setSaveState("error", "Save failed");
        throw error;
      })
      .finally(() => {
        inFlightSave = null;
      });
    return inFlightSave;
  }

  window.nodulate = window.nodulate || {};
  window.nodulate.flushPendingSave = saveNow;

  stage.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    const handle = event.target.dataset.handle;
    const p = point(event);
    if (handle && box) {
      event.preventDefault();
      drag = { mode: "resize", handle, start: p, original: { ...box } };
      return;
    }
    if (event.target.dataset.box && box) {
      event.preventDefault();
      drag = { mode: "move", start: p, original: { ...box } };
      return;
    }
    event.preventDefault();
    box = { x: p.x, y: p.y, width: minSize, height: minSize };
    drag = { mode: "create", start: p, original: { ...box } };
    render();
  });

  window.addEventListener("mousemove", (event) => {
    if (!drag) return;
    const p = point(event);
    if (drag.mode === "create") {
      const x = Math.min(drag.start.x, p.x);
      const y = Math.min(drag.start.y, p.y);
      box = cleanBox({ x, y, width: Math.abs(p.x - drag.start.x), height: Math.abs(p.y - drag.start.y) });
    } else if (drag.mode === "move") {
      box = cleanBox({
        ...drag.original,
        x: drag.original.x + (p.x - drag.start.x),
        y: drag.original.y + (p.y - drag.start.y),
      });
    } else if (drag.mode === "resize") {
      const original = drag.original;
      let left = original.x;
      let top = original.y;
      let right = original.x + original.width;
      let bottom = original.y + original.height;
      if (drag.handle.includes("w")) left = Math.min(p.x, right - minSize);
      if (drag.handle.includes("e")) right = Math.max(p.x, left + minSize);
      if (drag.handle.includes("n")) top = Math.min(p.y, bottom - minSize);
      if (drag.handle.includes("s")) bottom = Math.max(p.y, top + minSize);
      left = Math.max(0, left);
      top = Math.max(0, top);
      right = Math.min(1, right);
      bottom = Math.min(1, bottom);
      box = cleanBox({ x: left, y: top, width: right - left, height: bottom - top });
    }
    render();
  });

  window.addEventListener("mouseup", () => {
    if (!drag) return;
    drag = null;
    markDirty();
  });

  function deleteBox() {
    if (!box) return;
    box = null;
    render();
    markDirty();
  }

  deleteButton.addEventListener("click", deleteBox);
  window.addEventListener("keydown", (event) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (["INPUT", "TEXTAREA"].includes(tag)) return;
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      deleteBox();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveNow();
    }
  });

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", async (event) => {
      if (!link.getAttribute("href") || link.classList.contains("disabled")) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      try {
        await saveNow();
        window.location.assign(link.href);
      } catch (_err) {
        setSaveState("error", "Save failed - stay here");
      }
    });
  });

  const image = document.getElementById("dicom-image");
  if (image) {
    if (image.complete) fitStageToAvailableSpace();
    image.addEventListener("load", fitStageToAvailableSpace);
  }
  window.addEventListener("resize", fitStageToAvailableSpace);

  render();
})();
