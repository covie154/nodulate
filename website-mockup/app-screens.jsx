const { useState, useRef, useEffect, useCallback } = React;

/* ------------------------------------------------------------------ *
 * Sonolabel — App Screen Drafts
 * Two in-product screens built on the DESIGN.md baton:
 *   1. Login (FR-1 / FR-2 / FR-3)
 *   2. Annotation Workspace (FR-4 .. FR-15)
 * A synthetic grayscale ultrasound image is generated at runtime — no
 * bitmap assets. AMOLED #000000 canvas, single cyan measurement accent.
 * ------------------------------------------------------------------ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#37E0C8",
  "backgroundColor": "#000000",
  "focusColor": "#5CB8FF"
}/*EDITMODE-END*/;

const T = {
  bg: "var(--ocd-tweak-background-color)",
  surface: "#0B0E10",
  raised: "#14181B",
  border: "#23292D",
  text: "#F2F5F6",
  muted: "#8A9499",
  faint: "#5B656A",
  accent: "var(--ocd-tweak-accent-color)",
  accentDeep: "#0FA394",
  focus: "var(--ocd-tweak-focus-color)",
  success: "#4ADE9A",
  warning: "#F5B84B",
  danger: "#F26D6D",
  display: "'Space Grotesk', system-ui, sans-serif",
  body: "'Inter Tight', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

/* ============================ Fonts + base ========================= */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: ${T.bg};
        color: ${T.text};
        font-family: ${T.body};
        -webkit-font-smoothing: antialiased;
      }
      ::selection { background: rgba(55,224,200,0.28); color: #F2F5F6; }
      button { font-family: inherit; cursor: pointer; }
      input { font-family: inherit; }
      :focus-visible {
        outline: 2px solid ${T.focus};
        outline-offset: 2px;
        border-radius: 4px;
      }
      @keyframes sweep {
        0% { transform: translateY(-100%); opacity: 0; }
        12% { opacity: 0.9; }
        88% { opacity: 0.9; }
        100% { transform: translateY(100%); opacity: 0; }
      }
      @keyframes savedPulse {
        0% { opacity: 0; transform: translateY(4px); }
        14% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; }
        100% { opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        * { animation-duration: 0.001ms !important; }
      }
    `}</style>
  );
}

/* ==================== Synthetic ultrasound image =================== */
/* Grayscale phased-array sector with speckle + a hypoechoic nodule,   */
/* rendered to a <canvas> so no external bitmap is needed.             */
function UltrasoundCanvas({ width, height }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const W = (cv.width = width);
    const H = (cv.height = height);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    const apexX = W / 2;
    const apexY = -H * 0.12;
    const spread = 0.58; // radians half-angle
    const rInner = H * 0.14;
    const rOuter = H * 1.08;

    // clip to the sector fan
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.arc(apexX, apexY, rOuter, -Math.PI / 2 - spread, -Math.PI / 2 + spread);
    ctx.closePath();
    ctx.clip();

    // radial tissue gradient
    const g = ctx.createRadialGradient(apexX, apexY, rInner, apexX, apexY, rOuter);
    g.addColorStop(0, "#2b2f31");
    g.addColorStop(0.35, "#3a4042");
    g.addColorStop(0.7, "#232729");
    g.addColorStop(1, "#0c0e0f");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // horizontal fascial bands
    for (let i = 0; i < 5; i++) {
      const y = H * (0.28 + i * 0.13);
      const grad = ctx.createLinearGradient(0, y - 6, 0, y + 6);
      grad.addColorStop(0, "rgba(180,190,190,0)");
      grad.addColorStop(0.5, `rgba(190,200,200,${0.14 - i * 0.02})`);
      grad.addColorStop(1, "rgba(180,190,190,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, y - 6, W, 12);
    }

    // hypoechoic nodule (dark lesion with brighter rim) — the label target
    const nx = W * 0.54, ny = H * 0.52, nr = H * 0.16;
    const ng = ctx.createRadialGradient(nx, ny, nr * 0.2, nx, ny, nr);
    ng.addColorStop(0, "rgba(8,10,11,0.92)");
    ng.addColorStop(0.7, "rgba(20,24,25,0.7)");
    ng.addColorStop(0.92, "rgba(150,160,160,0.22)");
    ng.addColorStop(1, "rgba(150,160,160,0)");
    ctx.fillStyle = ng;
    ctx.beginPath();
    ctx.ellipse(nx, ny, nr * 1.05, nr * 0.86, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // speckle noise
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] < 6 && d[i + 1] < 6 && d[i + 2] < 6) continue; // outside fan
      const n = (Math.random() - 0.5) * 46;
      d[i] = Math.max(0, Math.min(255, d[i] + n));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
    }
    ctx.putImageData(img, 0, 0);
    ctx.restore();
  }, [width, height]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Grayscale ultrasound sector scan showing a hypoechoic nodule near the center"
      style={{ display: "block", width: "100%", height: "100%", borderRadius: 2 }}
    />
  );
}

/* ============================= Login ============================== */
function LoginScreen({ onSignIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("annotator");
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState(false);

  const canSubmit = username.trim().length > 0 && password.length >= 6;

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (canSubmit) onSignIn({ username: username.trim(), role });
  };

  const field = (label, node) => (
    <label style={{ display: "block", marginBottom: 18 }}>
      <span
        style={{
          display: "block",
          fontFamily: T.mono,
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: T.faint,
          marginBottom: 8,
        }}
      >
        {label}
      </span>
      {node}
    </label>
  );

  const inputStyle = {
    width: "100%",
    background: T.raised,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    color: T.text,
    fontSize: 15,
    padding: "13px 14px",
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr",
        placeItems: "center",
        padding: "clamp(20px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* soft cyan panel glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          width: 720,
          height: 720,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(55,224,200,0.12) 0%, rgba(55,224,200,0) 62%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: "clamp(28px, 4vw, 40px)",
        }}
      >
        {/* brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 28 }}>
          <BrandMark size={30} />
          <span style={{ fontFamily: T.display, fontWeight: 600, fontSize: 19, letterSpacing: "-0.01em" }}>
            Sonolabel
          </span>
        </div>

        <h1
          style={{
            fontFamily: T.display,
            fontWeight: 500,
            fontSize: 28,
            lineHeight: 1.15,
            margin: "0 0 6px",
            letterSpacing: "-0.02em",
          }}
        >
          Sign in to annotate
        </h1>
        <p style={{ color: T.muted, fontSize: 14.5, lineHeight: 1.55, margin: "0 0 26px" }}>
          Your session stays active while you label — annotations auto-save as you work.
        </p>

        <form onSubmit={submit} noValidate>
          {field(
            "Username",
            <input
              type="text"
              autoComplete="username"
              placeholder="e.g. r.okafor"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          )}

          {field(
            "Password",
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: touched && password.length < 6 ? T.danger : T.border,
              }}
            />
          )}
          {touched && password.length < 6 && (
            <div style={{ color: T.danger, fontSize: 12.5, marginTop: -10, marginBottom: 14 }}>
              Password must be at least 6 characters.
            </div>
          )}

          {/* role — FR-3 */}
          {field(
            "Role",
            <div role="radiogroup" aria-label="Role" style={{ display: "flex", gap: 8 }}>
              {[
                { id: "annotator", label: "Annotator" },
                { id: "reviewer", label: "Reviewer" },
              ].map((r) => {
                const active = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setRole(r.id)}
                    style={{
                      flex: 1,
                      background: active ? "rgba(55,224,200,0.12)" : T.raised,
                      border: `1px solid ${active ? T.accent : T.border}`,
                      borderRadius: 10,
                      color: active ? T.accent : T.muted,
                      fontSize: 14,
                      fontWeight: 500,
                      padding: "11px 10px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {r.label}
                    {r.id === "reviewer" && (
                      <span style={{ fontFamily: T.mono, fontSize: 10, marginLeft: 6, opacity: 0.7 }}>v2</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              color: T.muted,
              fontSize: 13.5,
              margin: "4px 0 24px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: "#37E0C8", width: 15, height: 15 }}
            />
            Keep me signed in for this session
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: "100%",
              background: canSubmit ? T.accent : T.raised,
              color: canSubmit ? "#00110E" : T.faint,
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              padding: "14px",
              transition: "all 0.15s ease",
              boxShadow: canSubmit ? "0 0 0 1px rgba(55,224,200,0.4), 0 8px 24px -12px rgba(55,224,200,0.7)" : "none",
            }}
          >
            Enter workspace
          </button>
        </form>

        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.faint }}>
            session · SQLite · Django
          </span>
          <button
            type="button"
            onClick={() => onSignIn({ username: "r.okafor", role: "annotator" })}
            style={{
              background: "transparent",
              border: "none",
              color: T.muted,
              fontSize: 12.5,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Demo login
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==================== Annotation Workspace ======================== */
const SEED_BOXES = [
  { id: 1, x: 0.46, y: 0.4, w: 0.22, h: 0.26, label: "lesion", source: "manual" },
];

function AnnotationWorkspace({ user, onSignOut }) {
  const stageRef = useRef(null);
  const [stageSize, setStageSize] = useState({ w: 640, h: 480 });
  const [boxes, setBoxes] = useState(SEED_BOXES);
  const [selected, setSelected] = useState(1);
  const [saved, setSaved] = useState(false);
  const [aiOn, setAiOn] = useState(false);
  const [imageIndex, setImageIndex] = useState(23);
  const total = 50;
  const [nextId, setNextId] = useState(2);

  // drag state
  const drag = useRef(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    const measure = () => {
      if (stageRef.current) {
        const r = stageRef.current.getBoundingClientRect();
        setStageSize({ w: r.width, h: r.height });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // FR-10 / FR-11 / NFR-3: debounced auto-save with "Saved" indicator
  const triggerSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }, 500);
  }, []);

  const norm = (clientX, clientY) => {
    const r = stageRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (clientY - r.top) / r.height)),
    };
  };

  const onStageDown = (e) => {
    if (e.target.dataset.handle || e.target.dataset.box) return;
    const p = norm(e.clientX, e.clientY);
    drag.current = { mode: "create", startX: p.x, startY: p.y, id: nextId };
    setBoxes((b) => [...b, { id: nextId, x: p.x, y: p.y, w: 0, h: 0, label: "lesion", source: "manual" }]);
    setSelected(nextId);
    setNextId((n) => n + 1);
  };

  const onMove = (e) => {
    if (!drag.current) return;
    const p = norm(e.clientX, e.clientY);
    setBoxes((prev) =>
      prev.map((bx) => {
        if (bx.id !== drag.current.id) return bx;
        if (drag.current.mode === "create") {
          const x = Math.min(drag.current.startX, p.x);
          const y = Math.min(drag.current.startY, p.y);
          return { ...bx, x, y, w: Math.abs(p.x - drag.current.startX), h: Math.abs(p.y - drag.current.startY) };
        }
        if (drag.current.mode === "move") {
          return {
            ...bx,
            x: Math.max(0, Math.min(1 - bx.w, p.x - drag.current.offX)),
            y: Math.max(0, Math.min(1 - bx.h, p.y - drag.current.offY)),
          };
        }
        if (drag.current.mode === "resize") {
          const x2 = Math.max(bx.x + 0.02, p.x);
          const y2 = Math.max(bx.y + 0.02, p.y);
          return { ...bx, w: Math.min(1 - bx.x, x2 - bx.x), h: Math.min(1 - bx.y, y2 - bx.y) };
        }
        return bx;
      })
    );
  };

  const onUp = () => {
    if (drag.current) {
      // discard zero-size boxes
      setBoxes((prev) => prev.filter((bx) => !(bx.id === drag.current.id && (bx.w < 0.02 || bx.h < 0.02))));
      triggerSave();
      drag.current = null;
    }
  };

  const startMove = (e, bx) => {
    e.stopPropagation();
    const p = norm(e.clientX, e.clientY);
    setSelected(bx.id);
    drag.current = { mode: "move", id: bx.id, offX: p.x - bx.x, offY: p.y - bx.y };
  };
  const startResize = (e, bx) => {
    e.stopPropagation();
    setSelected(bx.id);
    drag.current = { mode: "resize", id: bx.id };
  };

  const deleteSelected = useCallback(() => {
    if (selected == null) return;
    setBoxes((prev) => prev.filter((b) => b.id !== selected));
    setSelected(null);
    triggerSave();
  }, [selected, triggerSave]);

  // keyboard shortcuts (NFR-5): Delete removes, arrows navigate images
  useEffect(() => {
    const onKey = (e) => {
      const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
      if (typing) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
      } else if (e.key === "ArrowRight") {
        setImageIndex((i) => Math.min(total, i + 1));
      } else if (e.key === "ArrowLeft") {
        setImageIndex((i) => Math.max(1, i - 1));
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        triggerSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteSelected, triggerSave]);

  const applyAiDraft = () => {
    setAiOn(true);
    setBoxes((prev) => {
      if (prev.some((b) => b.source === "ai_draft")) return prev;
      const draft = { id: nextId, x: 0.24, y: 0.55, w: 0.16, h: 0.18, label: "ai draft", source: "ai_draft" };
      return [...prev, draft];
    });
    setNextId((n) => n + 1);
    triggerSave();
  };

  const pct = Math.round((imageIndex / total) * 100);
  const px = (v, axis) => Math.round(v * (axis === "x" ? stageSize.w : stageSize.h));

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* top bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px clamp(16px, 3vw, 28px)",
          borderBottom: `1px solid ${T.border}`,
          background: T.surface,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <BrandMark size={24} />
          <span style={{ fontFamily: T.display, fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>
            Sonolabel
          </span>
          <span
            style={{
              fontFamily: T.mono,
              fontSize: 11,
              color: T.faint,
              borderLeft: `1px solid ${T.border}`,
              paddingLeft: 10,
              marginLeft: 4,
              whiteSpace: "nowrap",
            }}
          >
            thyroid_batch_04
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ color: T.muted, fontSize: 13, whiteSpace: "nowrap" }}>
            {user.username} · <span style={{ color: T.faint }}>{user.role}</span>
          </span>
          <button
            onClick={onSignOut}
            style={{
              background: "transparent",
              border: `1px solid ${T.border}`,
              color: T.text,
              borderRadius: 8,
              fontSize: 13,
              padding: "7px 13px",
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* body */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 300px",
          gap: 0,
        }}
        className="ws-body"
      >
        {/* canvas column */}
        <div style={{ padding: "clamp(16px, 3vw, 32px)", display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontFamily: T.mono, fontSize: 12, color: T.muted }}>
              ultrasound_{String(imageIndex).padStart(3, "0")}.png
              <span style={{ color: T.faint }}> · 800×600 · original resolution</span>
            </div>
            {/* auto-save indicator FR-11 */}
            <div style={{ minWidth: 92, height: 22, display: "flex", justifyContent: "flex-end" }}>
              {saved && (
                <span
                  key={Date.now()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: T.success,
                    fontFamily: T.mono,
                    fontSize: 12,
                    animation: "savedPulse 1.8s ease forwards",
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.success }} /> Saved
                </span>
              )}
            </div>
          </div>

          {/* stage */}
          <div
            ref={stageRef}
            onMouseDown={onStageDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4 / 3",
              maxHeight: "62vh",
              background: "#000",
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              overflow: "hidden",
              cursor: "crosshair",
              userSelect: "none",
            }}
          >
            <UltrasoundCanvas width={stageSize.w} height={stageSize.w * 0.75} />

            {/* scan sweep */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: "18%",
                  background: "linear-gradient(180deg, rgba(55,224,200,0) 0%, rgba(55,224,200,0.10) 50%, rgba(55,224,200,0) 100%)",
                  animation: "sweep 5.5s linear infinite",
                }}
              />
            </div>

            {/* boxes */}
            {boxes.map((bx) => {
              const active = bx.id === selected;
              const isAi = bx.source === "ai_draft";
              const stroke = isAi ? T.warning : T.accent;
              return (
                <div
                  key={bx.id}
                  data-box="1"
                  onMouseDown={(e) => startMove(e, bx)}
                  style={{
                    position: "absolute",
                    left: `${bx.x * 100}%`,
                    top: `${bx.y * 100}%`,
                    width: `${bx.w * 100}%`,
                    height: `${bx.h * 100}%`,
                    border: `${active ? 1.6 : 1.2}px ${isAi ? "dashed" : "solid"} ${stroke}`,
                    borderRadius: 3,
                    boxShadow: active ? `0 0 0 1px rgba(55,224,200,0.25), 0 0 22px -6px ${stroke}` : "none",
                    cursor: "move",
                    background: active ? "rgba(55,224,200,0.05)" : "transparent",
                  }}
                >
                  {/* caption */}
                  <div
                    style={{
                      position: "absolute",
                      top: -20,
                      left: -1,
                      fontFamily: T.mono,
                      fontSize: 10.5,
                      color: "#00110E",
                      background: stroke,
                      padding: "1px 6px",
                      borderRadius: 3,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {bx.label} · {px(bx.x, "x")},{px(bx.y, "y")} {px(bx.w, "x")}×{px(bx.h, "y")}
                  </div>
                  {/* corner resize handle */}
                  {active && (
                    <span
                      data-handle="1"
                      onMouseDown={(e) => startResize(e, bx)}
                      style={{
                        position: "absolute",
                        right: -5,
                        bottom: -5,
                        width: 10,
                        height: 10,
                        background: stroke,
                        border: "1px solid #000",
                        borderRadius: 2,
                        cursor: "nwse-resize",
                      }}
                    />
                  )}
                </div>
              );
            })}

            {boxes.length === 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: 18,
                  pointerEvents: "none",
                }}
              >
                <span style={{ fontFamily: T.mono, fontSize: 12, color: T.muted, background: "rgba(0,0,0,0.55)", padding: "5px 10px", borderRadius: 6 }}>
                  Click and drag over a lesion to draw a box
                </span>
              </div>
            )}
          </div>

          {/* progress FR-15 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: T.mono, fontSize: 12, color: T.muted, marginBottom: 7 }}>
              <span>Progress</span>
              <span>
                <span style={{ color: T.accent }}>{pct}%</span> — {imageIndex} of {total} images
              </span>
            </div>
            <div style={{ height: 6, background: T.raised, borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${T.accentDeep}, ${T.accent})`,
                  borderRadius: 999,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* action bar */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <button
              onClick={applyAiDraft}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: aiOn ? "rgba(245,184,75,0.12)" : T.raised,
                border: `1px solid ${aiOn ? T.warning : T.border}`,
                color: aiOn ? T.warning : T.muted,
                borderRadius: 9,
                fontSize: 13.5,
                padding: "9px 13px",
              }}
            >
              <span
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: aiOn ? T.warning : T.faint,
                }}
              />
              AI draft: {aiOn ? "ON" : "OFF"}
              <span style={{ fontFamily: T.mono, fontSize: 10, opacity: 0.7 }}>v2</span>
            </button>

            <button
              onClick={deleteSelected}
              disabled={selected == null}
              style={{
                background: T.raised,
                border: `1px solid ${T.border}`,
                color: selected == null ? T.faint : T.danger,
                borderRadius: 9,
                fontSize: 13.5,
                padding: "9px 13px",
              }}
            >
              Delete selected
            </button>

            <div style={{ flex: 1 }} />

            <button
              onClick={() => setImageIndex((i) => Math.max(1, i - 1))}
              disabled={imageIndex <= 1}
              style={{
                background: T.raised,
                border: `1px solid ${T.border}`,
                color: imageIndex <= 1 ? T.faint : T.text,
                borderRadius: 9,
                fontSize: 13.5,
                padding: "9px 15px",
              }}
            >
              ← Prev
            </button>
            <button
              onClick={() => { setImageIndex((i) => Math.min(total, i + 1)); triggerSave(); }}
              style={{
                background: T.accent,
                border: "none",
                color: "#00110E",
                borderRadius: 9,
                fontSize: 13.5,
                fontWeight: 600,
                padding: "9px 18px",
              }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* side panel */}
        <aside
          className="ws-side"
          style={{
            borderLeft: `1px solid ${T.border}`,
            background: T.surface,
            padding: "clamp(16px, 2vw, 22px)",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <section>
            <h2 style={panelH}>Annotations</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {boxes.length === 0 && (
                <p style={{ color: T.faint, fontSize: 13, margin: 0 }}>No boxes on this image yet.</p>
              )}
              {boxes.map((bx, i) => {
                const active = bx.id === selected;
                const isAi = bx.source === "ai_draft";
                return (
                  <button
                    key={bx.id}
                    onClick={() => setSelected(bx.id)}
                    style={{
                      textAlign: "left",
                      background: active ? "rgba(55,224,200,0.08)" : T.raised,
                      border: `1px solid ${active ? T.accent : T.border}`,
                      borderRadius: 9,
                      padding: "10px 11px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: active ? T.accent : T.text }}>
                        Box {i + 1}
                      </span>
                      <span
                        style={{
                          fontFamily: T.mono, fontSize: 10,
                          color: isAi ? T.warning : T.faint,
                          border: `1px solid ${isAi ? "rgba(245,184,75,0.4)" : T.border}`,
                          borderRadius: 999, padding: "1px 7px",
                        }}
                      >
                        {bx.source}
                      </span>
                    </span>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.muted }}>
                      x{px(bx.x, "x")} y{px(bx.y, "y")} w{px(bx.w, "x")} h{px(bx.h, "y")}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 style={panelH}>Export preview</h2>
            <div
              style={{
                background: "#07090A",
                border: `1px solid ${T.border}`,
                borderRadius: 9,
                padding: "11px 12px",
                fontFamily: T.mono,
                fontSize: 11,
                color: T.muted,
                lineHeight: 1.7,
                overflowX: "auto",
              }}
            >
              <div style={{ color: T.faint }}># YOLO · normalized</div>
              {boxes.length === 0 ? (
                <div style={{ color: T.faint }}>—</div>
              ) : (
                boxes.map((bx, i) => (
                  <div key={bx.id}>
                    <span style={{ color: T.accent }}>0</span>{" "}
                    {(bx.x + bx.w / 2).toFixed(4)} {(bx.y + bx.h / 2).toFixed(4)}{" "}
                    {bx.w.toFixed(4)} {bx.h.toFixed(4)}
                  </div>
                ))
              )}
            </div>
          </section>

          <section style={{ marginTop: "auto" }}>
            <h2 style={panelH}>Shortcuts</h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                ["← →", "Prev / next image"],
                ["Del", "Delete selected box"],
                ["Ctrl S", "Force save"],
                ["Drag", "Draw / move / resize"],
              ].map(([k, v]) => (
                <li key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: T.muted }}>
                  <span>{v}</span>
                  <kbd
                    style={{
                      fontFamily: T.mono, fontSize: 11, color: T.text,
                      background: T.raised, border: `1px solid ${T.border}`,
                      borderRadius: 5, padding: "1px 7px",
                    }}
                  >
                    {k}
                  </kbd>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

const panelH = {
  fontFamily: T.mono,
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: T.faint,
  margin: "0 0 12px",
  fontWeight: 400,
};

/* ============================= Brand mark ========================= */
function BrandMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="8" stroke="#23292D" />
      {/* sonar arcs */}
      <path d="M9 22a10 10 0 0 1 14 0" stroke="#37E0C8" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      <path d="M12 22a6.5 6.5 0 0 1 8 0" stroke="#37E0C8" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
      {/* measurement box */}
      <rect x="13.5" y="9.5" width="9" height="7" rx="1" stroke="#37E0C8" strokeWidth="1.4" />
      <circle cx="16" cy="22" r="1.5" fill="#37E0C8" />
    </svg>
  );
}

/* ============================= Screen switch ====================== */
function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);

  const goWorkspace = (u) => {
    setUser(u);
    setScreen("workspace");
  };
  const signOut = () => {
    setUser(null);
    setScreen("login");
  };

  return (
    <React.Fragment>
      <GlobalStyle />
      <style>{`
        @media (max-width: 860px) {
          .ws-body { grid-template-columns: 1fr !important; }
          .ws-side { border-left: none !important; border-top: 1px solid ${T.border} !important; }
        }
      `}</style>

      {/* screen toggle — draft convenience, not part of the product */}
      <div
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 50,
          display: "flex",
          gap: 4,
          background: "rgba(11,14,16,0.85)",
          border: `1px solid ${T.border}`,
          borderRadius: 999,
          padding: 4,
          backdropFilter: "blur(8px)",
        }}
      >
        {[
          { id: "login", label: "Login" },
          { id: "workspace", label: "Workspace" },
        ].map((s) => {
          const active = screen === s.id;
          return (
            <button
              key={s.id}
              onClick={() => (s.id === "workspace" ? goWorkspace(user || { username: "r.okafor", role: "annotator" }) : setScreen("login"))}
              style={{
                background: active ? T.accent : "transparent",
                color: active ? "#00110E" : T.muted,
                border: "none",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 13px",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {screen === "login" ? (
        <LoginScreen onSignIn={goWorkspace} />
      ) : (
        <AnnotationWorkspace user={user || { username: "r.okafor", role: "annotator" }} onSignOut={signOut} />
      )}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
