const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#37E0C8",
  "background": "#000000",
  "glowStrength": 0.55
}/*EDITMODE-END*/;

/* ------------------------------------------------------------------ */
/* Tokens — sourced from website-mockup/DESIGN.md (authoritative baton) */
/* ------------------------------------------------------------------ */
const T = {
  bg: "var(--ocd-tweak-background)",
  accent: "var(--ocd-tweak-accent-color)",
  surface: "#0B0E10",
  raised: "#14181B",
  border: "#23292D",
  borderSoft: "#1A2023",
  text: "#F2F5F6",
  muted: "#8A9499",
  faint: "#5B656A",
  accentDeep: "#0FA394",
  focus: "#5CB8FF",
  success: "#4ADE9A",
  warning: "#F5B84B",
  danger: "#F26D6D",
};

const display = "'Space Grotesk', system-ui, sans-serif";
const body = "'Inter Tight', system-ui, sans-serif";
const mono = "'JetBrains Mono', ui-monospace, monospace";

const MAXW = 1120;

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";

/* ------------------------------------------------------------------ */
/* Global styles injected once                                         */
/* ------------------------------------------------------------------ */
function useGlobalStyles() {
  React.useEffect(() => {
    const pre = document.createElement("link");
    pre.rel = "preconnect";
    pre.href = "https://fonts.gstatic.com";
    pre.crossOrigin = "anonymous";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_HREF;
    document.head.appendChild(pre);
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; background: #000000; }
      body { -webkit-font-smoothing: antialiased; }
      ::selection { background: rgba(55,224,200,0.28); color: #F2F5F6; }
      a { color: inherit; }
      button { font: inherit; cursor: pointer; }
      .ocd-focusable:focus-visible {
        outline: 2px solid ${T.focus};
        outline-offset: 3px;
        border-radius: 8px;
      }
      @keyframes ocd-sweep {
        0% { transform: translateY(-4%); opacity: 0; }
        18% { opacity: 1; }
        82% { opacity: 1; }
        100% { transform: translateY(104%); opacity: 0; }
      }
      @keyframes ocd-pulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.18); }
      }
      .ocd-cta {
        transition: box-shadow 160ms ease, transform 160ms ease, background 160ms ease;
      }
      .ocd-cta:hover { transform: translateY(-1px); }
      .ocd-ghost {
        transition: border-color 160ms ease, color 160ms ease, background 160ms ease;
      }
      .ocd-ghost:hover { border-color: ${T.accent}; color: ${T.accent}; }
      .ocd-navlink { transition: color 140ms ease; }
      .ocd-navlink:hover { color: ${T.text}; }
      .ocd-feature {
        transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
      }
      .ocd-feature:hover {
        border-color: ${T.border};
        background: ${T.raised};
        transform: translateY(-2px);
      }
      .ocd-faq-q { transition: color 140ms ease; }
      .ocd-faq-q:hover { color: ${T.accent}; }
      @media (prefers-reduced-motion: reduce) {
        .ocd-sweep-line { animation: none !important; opacity: 0.35 !important; }
        .ocd-dot { animation: none !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);
}

/* ------------------------------------------------------------------ */
/* Small primitives                                                    */
/* ------------------------------------------------------------------ */
function MonoLabel({ children, color, style }) {
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: "0.72rem",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: color || T.faint,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function Chip({ children }) {
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: "0.72rem",
        color: T.accent,
        background: T.raised,
        border: `1px solid ${T.border}`,
        borderRadius: 999,
        padding: "6px 12px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function PrimaryButton({ children, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ocd-cta ocd-focusable ${className || ""}`}
      style={{
        fontFamily: body,
        fontWeight: 500,
        fontSize: "0.98rem",
        color: "#00110E",
        background: T.accent,
        border: "none",
        borderRadius: 10,
        padding: "13px 22px",
        boxShadow: `0 0 calc(28px * var(--ocd-tweak-glow-strength)) -6px ${T.accent}`,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ocd-ghost ocd-focusable"
      style={{
        fontFamily: body,
        fontWeight: 500,
        fontSize: "0.98rem",
        color: T.text,
        background: "transparent",
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: "13px 22px",
      }}
    >
      {children}
    </button>
  );
}

function SectionHeader({ label, title, sub }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <MonoLabel color={T.accent}>{label}</MonoLabel>
        <div style={{ height: 1, flex: 1, background: T.borderSoft }} />
      </div>
      <h2
        style={{
          fontFamily: display,
          fontWeight: 500,
          fontSize: "clamp(1.7rem,3.6vw,2.5rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.08,
          color: T.text,
          margin: 0,
          maxWidth: 780,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            fontFamily: body,
            fontSize: "clamp(1rem,1.4vw,1.12rem)",
            color: T.muted,
            lineHeight: 1.6,
            maxWidth: 640,
            margin: "18px 0 0",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Logo — constructed monogram (bounding-box caliper mark)             */
/* ------------------------------------------------------------------ */
function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <rect x="1.5" y="1.5" width="23" height="23" rx="4" fill="none" stroke={T.border} strokeWidth="1.5" />
        <rect x="6" y="6" width="14" height="14" rx="2.5" fill="none" stroke={T.accent} strokeWidth="1.5" />
        {[
          [6, 6], [20, 6], [6, 20], [20, 20],
        ].map(([cx, cy], i) => (
          <rect key={i} x={cx - 1.6} y={cy - 1.6} width="3.2" height="3.2" fill={T.accent} />
        ))}
        <circle cx="13" cy="13" r="2.4" fill={T.accent} opacity="0.9" />
      </svg>
      <span
        style={{
          fontFamily: display,
          fontWeight: 600,
          fontSize: "1.12rem",
          letterSpacing: "-0.01em",
          color: T.text,
        }}
      >
        Sonolabel
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */
const NAV = [
  { label: "Workflow", href: "#workflow" },
  { label: "Features", href: "#features" },
  { label: "Export", href: "#export" },
  { label: "FAQ", href: "#faq" },
];

function TopNav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.borderSoft}`,
      }}
    >
      <div
        style={{
          maxWidth: MAXW,
          margin: "0 auto",
          padding: "16px clamp(20px,5vw,64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <a href="#top" className="ocd-focusable" style={{ textDecoration: "none" }}>
          <Logo />
        </a>
        <nav
          aria-label="Primary"
          style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2.4vw,30px)" }}
        >
          <div className="ocd-nav-links" style={{ display: "flex", gap: "clamp(14px,2.4vw,28px)" }}>
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="ocd-navlink ocd-focusable"
                style={{
                  fontFamily: body,
                  fontSize: "0.92rem",
                  color: T.muted,
                  textDecoration: "none",
                }}
              >
                {n.label}
              </a>
            ))}
          </div>
          <a
            href="#cta"
            className="ocd-cta ocd-focusable"
            style={{
              fontFamily: body,
              fontWeight: 500,
              fontSize: "0.9rem",
              color: "#00110E",
              background: T.accent,
              borderRadius: 9,
              padding: "9px 16px",
              textDecoration: "none",
              boxShadow: `0 0 calc(22px * var(--ocd-tweak-glow-strength)) -8px ${T.accent}`,
            }}
          >
            Open workspace
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Annotation canvas mock — the hero visual                            */
/* ------------------------------------------------------------------ */
const HERO_BOXES = [
  { id: "lesion_01", x: 22, y: 30, w: 30, h: 26, label: "lesion", conf: "TIRADS-4" },
  { id: "lesion_02", x: 58, y: 54, w: 22, h: 20, label: "cyst", conf: "TIRADS-2" },
];

function CanvasMock({ activeBox, setActiveBox }) {
  return (
    <div
      style={{
        position: "relative",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: `0 30px 80px -40px rgba(0,0,0,0.9)`,
      }}
    >
      {/* toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: `1px solid ${T.borderSoft}`,
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className="ocd-dot"
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: T.success,
              boxShadow: `0 0 10px ${T.success}`,
              animation: "ocd-pulse 2.4s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          <span style={{ fontFamily: mono, fontSize: "0.72rem", color: T.success }}>
            Auto-saved
          </span>
        </div>
        <span style={{ fontFamily: mono, fontSize: "0.7rem", color: T.faint }}>
          case_0472 · 14 / 260
        </span>
      </div>

      {/* the ultrasound "image" area (synthetic grayscale sector) */}
      <div style={{ position: "relative", aspectRatio: "16 / 11", background: "#050708" }}>
        <svg viewBox="0 0 320 220" width="100%" height="100%" style={{ display: "block" }} aria-hidden="true">
          <defs>
            <radialGradient id="sono" cx="50%" cy="6%" r="98%">
              <stop offset="0%" stopColor="#3a4247" />
              <stop offset="34%" stopColor="#20262a" />
              <stop offset="70%" stopColor="#0d1012" />
              <stop offset="100%" stopColor="#050708" />
            </radialGradient>
            <clipPath id="sector">
              <path d="M160 4 L306 210 Q160 236 14 210 Z" />
            </clipPath>
          </defs>
          <path d="M160 4 L306 210 Q160 236 14 210 Z" fill="url(#sono)" />
          <g clipPath="url(#sector)" opacity="0.5">
            {Array.from({ length: 26 }).map((_, i) => (
              <line
                key={i}
                x1={10 + i * 12}
                y1="0"
                x2={40 + i * 11}
                y2="220"
                stroke="#4a545a"
                strokeWidth="0.4"
                opacity={0.25 + (i % 4) * 0.08}
              />
            ))}
            {/* speckle */}
            {Array.from({ length: 90 }).map((_, i) => {
              const x = 20 + ((i * 53) % 280);
              const y = 20 + ((i * 89) % 190);
              return <circle key={i} cx={x} cy={y} r={(i % 3) * 0.5 + 0.4} fill="#5c666c" opacity={0.18 + (i % 5) * 0.06} />;
            })}
            {/* nodule shapes */}
            <ellipse cx="108" cy="86" rx="30" ry="24" fill="#7a848a" opacity="0.35" />
            <ellipse cx="108" cy="86" rx="18" ry="14" fill="#9aa4aa" opacity="0.28" />
            <ellipse cx="212" cy="150" rx="22" ry="17" fill="#39424a" opacity="0.55" />
          </g>
          {/* sector outline */}
          <path d="M160 4 L306 210 Q160 236 14 210 Z" fill="none" stroke="#2b3237" strokeWidth="1" />
        </svg>

        {/* scan sweep line */}
        <div
          className="ocd-sweep-line"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
            opacity: 0.6,
            animation: "ocd-sweep 4.2s ease-in-out infinite",
          }}
        />

        {/* bounding boxes */}
        {HERO_BOXES.map((b) => {
          const on = activeBox === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onMouseEnter={() => setActiveBox(b.id)}
              onFocus={() => setActiveBox(b.id)}
              onClick={() => setActiveBox(b.id)}
              className="ocd-focusable"
              aria-label={`Annotation ${b.id}, ${b.label}`}
              style={{
                position: "absolute",
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.w}%`,
                height: `${b.h}%`,
                background: on ? "rgba(55,224,200,0.10)" : "transparent",
                border: `1.5px solid ${T.accent}`,
                borderRadius: 4,
                boxShadow: on ? `0 0 20px -4px ${T.accent}` : "none",
                padding: 0,
                transition: "background 140ms ease, box-shadow 140ms ease",
              }}
            >
              {["nw", "ne", "sw", "se"].map((c) => {
                const pos = {
                  nw: { top: -3, left: -3 },
                  ne: { top: -3, right: -3 },
                  sw: { bottom: -3, left: -3 },
                  se: { bottom: -3, right: -3 },
                }[c];
                return (
                  <span
                    key={c}
                    style={{
                      position: "absolute",
                      width: 6,
                      height: 6,
                      background: T.bg,
                      border: `1.5px solid ${T.accent}`,
                      ...pos,
                    }}
                  />
                );
              })}
              <span
                style={{
                  position: "absolute",
                  top: -20,
                  left: -1.5,
                  fontFamily: mono,
                  fontSize: "0.6rem",
                  color: "#00110E",
                  background: T.accent,
                  padding: "1px 5px",
                  borderRadius: 3,
                  whiteSpace: "nowrap",
                }}
              >
                {b.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* coordinate readout */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: `1px solid ${T.borderSoft}`,
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontFamily: mono, fontSize: "0.7rem", color: T.faint }}>selected</span>
        {(() => {
          const b = HERO_BOXES.find((x) => x.id === activeBox) || HERO_BOXES[0];
          return (
            <code style={{ fontFamily: mono, fontSize: "0.72rem", color: T.accent, wordBreak: "break-word" }}>
              {`{ "id": "${b.id}", "x": ${Math.round(b.x * 5.12)}, "y": ${Math.round(b.y * 2.2)}, "w": ${Math.round(b.w * 5.12)}, "h": ${Math.round(b.h * 2.2)}, "label": "${b.label}" }`}
            </code>
          );
        })()}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function Hero() {
  const [activeBox, setActiveBox] = React.useState("lesion_01");
  return (
    <section id="top" style={{ position: "relative", overflow: "hidden" }}>
      {/* soft cyan glow — lit imaging panel */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -220,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          maxWidth: "120%",
          height: 620,
          background: `radial-gradient(closest-side, rgba(55,224,200,calc(0.16 * var(--ocd-tweak-glow-strength))), transparent 72%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: MAXW,
          margin: "0 auto",
          padding: "clamp(48px,7vw,88px) clamp(20px,5vw,64px) clamp(40px,5vw,64px)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
          gap: "clamp(32px,5vw,56px)",
          alignItems: "center",
        }}
        className="ocd-hero-grid"
      >
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
            <Chip>For medical ML datasets</Chip>
            <Chip>Browser-based</Chip>
          </div>
          <h1
            style={{
              fontFamily: display,
              fontWeight: 500,
              fontSize: "clamp(2.4rem,6vw,4rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              color: T.text,
              margin: 0,
            }}
          >
            Label lesions on ultrasound
            <br />
            with <span style={{ color: T.accent }}>instrument</span> precision.
          </h1>
          <p
            style={{
              fontFamily: body,
              fontSize: "clamp(1.05rem,1.5vw,1.22rem)",
              color: T.muted,
              lineHeight: 1.6,
              maxWidth: 540,
              margin: "24px 0 0",
            }}
          >
            Sonolabel is a focused workspace for drawing bounding boxes on
            ultrasound images and exporting clean, OpenCV-compatible annotations
            for your training pipeline. No clutter — just the scan, the box, and
            the data.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
            <PrimaryButton>Start labeling</PrimaryButton>
            <GhostButton>See the export format</GhostButton>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 34 }}>
            {[
              ["Auto-save", "every box, instantly"],
              ["OpenCV", "x, y, w, h format"],
              ["Zero install", "runs in the browser"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontFamily: mono, fontSize: "0.82rem", color: T.accent }}>{k}</span>
                <span style={{ fontFamily: body, fontSize: "0.82rem", color: T.faint }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <CanvasMock activeBox={activeBox} setActiveBox={setActiveBox} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Workflow — 4 steps                                                  */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    n: "01",
    title: "Load a case",
    body: "Open an ultrasound study from your dataset queue. Images render on a true-black canvas so tissue and lesions read clearly.",
    code: "study_0472.png · 260 frames",
  },
  {
    n: "02",
    title: "Draw the box",
    body: "Click-drag around each lesion. Handles snap to pixel edges; resize or nudge with arrow keys for caliper-grade placement.",
    code: "drag → x:184 y:96 w:120 h:88",
  },
  {
    n: "03",
    title: "Tag & auto-save",
    body: "Assign a label and category. Every change is persisted the moment you release the mouse — no save button, no lost work.",
    code: "label: lesion · saved ✓",
  },
  {
    n: "04",
    title: "Export dataset",
    body: "Download all annotations in OpenCV-compatible JSON or CSV, ready to feed straight into your detection model.",
    code: "export → annotations.json",
  },
];

function Workflow() {
  return (
    <section
      id="workflow"
      style={{ maxWidth: MAXW, margin: "0 auto", padding: "clamp(56px,7vw,88px) clamp(20px,5vw,64px) 0" }}
    >
      <SectionHeader
        label="01 / Workflow"
        title="From raw scan to training data in four steps"
        sub="Sonolabel keeps the annotation loop tight, so a reviewer can move through hundreds of frames without breaking rhythm."
      />
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 14,
        }}
      >
        {STEPS.map((s, i) => (
          <li
            key={s.n}
            className="ocd-feature"
            style={{
              background: T.surface,
              border: `1px solid ${T.borderSoft}`,
              borderRadius: 14,
              padding: "24px 22px",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "0.72rem",
                  color: T.accent,
                  border: `1px solid ${T.border}`,
                  borderRadius: 6,
                  padding: "3px 7px",
                }}
              >
                {s.n}
              </span>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${T.border}, transparent)` }} />
              )}
            </div>
            <h3
              style={{
                fontFamily: display,
                fontWeight: 500,
                fontSize: "1.15rem",
                color: T.text,
                margin: "0 0 8px",
                letterSpacing: "-0.01em",
              }}
            >
              {s.title}
            </h3>
            <p style={{ fontFamily: body, fontSize: "0.92rem", color: T.muted, lineHeight: 1.55, margin: 0 }}>
              {s.body}
            </p>
            <code
              style={{
                display: "block",
                fontFamily: mono,
                fontSize: "0.72rem",
                color: T.faint,
                marginTop: 16,
                paddingTop: 14,
                borderTop: `1px solid ${T.borderSoft}`,
                wordBreak: "break-word",
              }}
            >
              {s.code}
            </code>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features grid                                                       */
/* ------------------------------------------------------------------ */
function FeatureIcon({ kind }) {
  const c = T.accent;
  const common = { width: 22, height: 22, fill: "none", stroke: c, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (kind) {
    case "box":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <rect x="4" y="5" width="16" height="14" rx="1.5" strokeDasharray="3 2.5" />
          <rect x="3" y="4" width="2.5" height="2.5" fill={c} stroke="none" />
          <rect x="18.5" y="17.5" width="2.5" height="2.5" fill={c} stroke="none" />
        </svg>
      );
    case "save":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
          <circle cx="19" cy="18" r="2.4" />
        </svg>
      );
    case "export":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <path d="M12 3v11" />
          <path d="M8 10l4 4 4-4" />
          <path d="M4 17v3h16v-3" />
        </svg>
      );
    case "keys":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M7 10h.01M11 10h.01M15 10h.01M8 14h8" />
        </svg>
      );
    case "layers":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <path d="M12 3l9 5-9 5-9-5 9-5z" />
          <path d="M3 13l9 5 9-5" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    default:
      return null;
  }
}

const FEATURES = [
  {
    icon: "box",
    title: "Pixel-accurate boxes",
    body: "Draw, resize, and reposition bounding boxes with corner handles and keyboard nudging for sub-pixel confidence.",
  },
  {
    icon: "save",
    title: "Instant auto-save",
    body: "Every annotation persists the moment you make it. Refresh, switch cases, or lose your connection — the work is already saved.",
  },
  {
    icon: "export",
    title: "OpenCV-ready export",
    body: "One click produces bounding-box data as x, y, w, h in JSON or CSV, formatted for OpenCV and common detection frameworks.",
  },
  {
    icon: "layers",
    title: "Multiple boxes per image",
    body: "Annotate several lesions on a single frame, each with its own label and category, without the canvas getting noisy.",
  },
  {
    icon: "keys",
    title: "Keyboard-first review",
    body: "Move between frames, create boxes, and confirm labels without leaving the keyboard — built for long annotation sessions.",
  },
  {
    icon: "shield",
    title: "Consistent labels",
    body: "A controlled label set keeps annotations uniform across reviewers, so the exported dataset stays clean and comparable.",
  },
];

function Features() {
  return (
    <section
      id="features"
      style={{ maxWidth: MAXW, margin: "0 auto", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px) 0" }}
    >
      <SectionHeader
        label="02 / Capabilities"
        title="Everything the annotation loop needs — nothing it doesn't"
        sub="Density belongs in the tool, not the marketing. Each capability maps directly to a requirement from the reviewer workflow."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14,
        }}
      >
        {FEATURES.map((f) => (
          <article
            key={f.title}
            className="ocd-feature"
            style={{
              background: T.surface,
              border: `1px solid ${T.borderSoft}`,
              borderRadius: 14,
              padding: "26px 24px",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: T.raised,
                border: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <FeatureIcon kind={f.icon} />
            </div>
            <h3
              style={{
                fontFamily: display,
                fontWeight: 500,
                fontSize: "1.12rem",
                color: T.text,
                margin: "0 0 8px",
                letterSpacing: "-0.01em",
              }}
            >
              {f.title}
            </h3>
            <p style={{ fontFamily: body, fontSize: "0.93rem", color: T.muted, lineHeight: 1.6, margin: 0 }}>
              {f.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Export section — code panel with format tabs                        */
/* ------------------------------------------------------------------ */
const EXPORT_FORMATS = {
  json: {
    label: "annotations.json",
    lang: "JSON · OpenCV bbox",
    code: `{
  "image": "case_0472_f014.png",
  "width": 960,
  "height": 720,
  "boxes": [
    { "x": 184, "y": 96,  "w": 120, "h": 88, "label": "lesion", "category": "TIRADS-4" },
    { "x": 512, "y": 396, "w": 176, "h": 132, "label": "cyst",  "category": "TIRADS-2" }
  ]
}`,
  },
  csv: {
    label: "annotations.csv",
    lang: "CSV · one row per box",
    code: `image,x,y,w,h,label,category
case_0472_f014.png,184,96,120,88,lesion,TIRADS-4
case_0472_f014.png,512,396,176,132,cyst,TIRADS-2
case_0472_f015.png,203,110,132,94,lesion,TIRADS-3`,
  },
  py: {
    label: "load.py",
    lang: "Python · OpenCV",
    code: `import cv2, json

data = json.load(open("annotations.json"))
img = cv2.imread(data["image"])

for b in data["boxes"]:
    x, y, w, h = b["x"], b["y"], b["w"], b["h"]
    cv2.rectangle(img, (x, y), (x + w, y + h), (200, 224, 55), 2)
    cv2.putText(img, b["label"], (x, y - 6),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 224, 55), 1)`,
  },
};

function ExportSection() {
  const [fmt, setFmt] = React.useState("json");
  const [copied, setCopied] = React.useState(false);
  const active = EXPORT_FORMATS[fmt];

  const copy = () => {
    const done = () => {
      setCopied(true);
      window.clearTimeout(copy._t);
      copy._t = window.setTimeout(() => setCopied(false), 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(active.code).then(done).catch(done);
    } else {
      done();
    }
  };

  return (
    <section
      id="export"
      style={{ maxWidth: MAXW, margin: "0 auto", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px) 0" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
          gap: "clamp(28px,4vw,48px)",
          alignItems: "center",
        }}
        className="ocd-export-grid"
      >
        <div>
          <SectionHeader
            label="03 / Export"
            title="Annotations that drop straight into your pipeline"
            sub="No custom parser. Sonolabel writes bounding boxes in the OpenCV x, y, w, h convention, so your detection code reads them as-is."
          />
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Standard x, y, w, h pixel coordinates",
              "Per-box label and clinical category",
              "Batch export across an entire study",
            ].map((t) => (
              <li key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: T.accent, fontFamily: mono, fontSize: "0.9rem", lineHeight: 1.5 }}>›</span>
                <span style={{ fontFamily: body, fontSize: "0.98rem", color: T.text, lineHeight: 1.5 }}>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* code panel */}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${T.borderSoft}`,
              padding: "8px 10px 8px 14px",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <div role="tablist" aria-label="Export format" style={{ display: "flex", gap: 4 }}>
              {Object.keys(EXPORT_FORMATS).map((k) => {
                const on = k === fmt;
                return (
                  <button
                    key={k}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setFmt(k)}
                    className="ocd-focusable"
                    style={{
                      fontFamily: mono,
                      fontSize: "0.74rem",
                      color: on ? T.accent : T.faint,
                      background: on ? T.raised : "transparent",
                      border: `1px solid ${on ? T.border : "transparent"}`,
                      borderRadius: 7,
                      padding: "6px 11px",
                      transition: "color 140ms ease, background 140ms ease, border-color 140ms ease",
                    }}
                  >
                    {EXPORT_FORMATS[k].label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={copy}
              className="ocd-focusable"
              aria-label="Copy code"
              style={{
                fontFamily: mono,
                fontSize: "0.72rem",
                color: copied ? T.success : T.muted,
                background: "transparent",
                border: `1px solid ${copied ? T.success : T.border}`,
                borderRadius: 7,
                padding: "6px 11px",
                transition: "color 140ms ease, border-color 140ms ease",
              }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderBottom: `1px solid ${T.borderSoft}`,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: 999, background: T.accent, display: "inline-block" }} />
            <span style={{ fontFamily: mono, fontSize: "0.7rem", color: T.faint }}>{active.lang}</span>
          </div>
          <pre
            style={{
              margin: 0,
              padding: "18px",
              overflowX: "auto",
              fontFamily: mono,
              fontSize: "0.76rem",
              lineHeight: 1.6,
              color: T.text,
            }}
          >
            <code>{active.code}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ — accordion                                                     */
/* ------------------------------------------------------------------ */
const FAQ = [
  {
    q: "What image formats can I annotate?",
    a: "Sonolabel loads standard ultrasound exports as PNG or JPEG frames. You work on one frame at a time and step through a study frame by frame.",
  },
  {
    q: "How is my work saved?",
    a: "Every box is auto-saved the instant you draw, move, or relabel it. There is no manual save action, so a dropped connection or accidental refresh never costs you an annotation.",
  },
  {
    q: "What exactly does the export contain?",
    a: "Each image's bounding boxes as x, y, w, h pixel coordinates plus a label and category, in either JSON or CSV. The x, y, w, h convention matches OpenCV so it feeds detection models directly.",
  },
  {
    q: "Can multiple reviewers use the same label set?",
    a: "Yes. Labels come from a controlled set, which keeps annotations consistent across reviewers and makes the exported dataset comparable frame to frame.",
  },
  {
    q: "Does it need installation?",
    a: "No. Sonolabel runs entirely in the browser — open the workspace and start labeling. There is nothing to install on the annotator's machine.",
  },
];

function FaqItem({ item, open, onToggle, id }) {
  return (
    <div style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
      <h3 style={{ margin: 0 }}>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`faq-panel-${id}`}
          id={`faq-btn-${id}`}
          className="ocd-faq-q ocd-focusable"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            background: "transparent",
            border: "none",
            padding: "22px 4px",
            textAlign: "left",
            fontFamily: display,
            fontWeight: 500,
            fontSize: "clamp(1.02rem,1.6vw,1.18rem)",
            color: open ? T.accent : T.text,
            letterSpacing: "-0.01em",
          }}
        >
          <span>{item.q}</span>
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: 22,
              height: 22,
              position: "relative",
              transition: "transform 200ms ease",
              transform: open ? "rotate(45deg)" : "rotate(0deg)",
            }}
          >
            <span style={{ position: "absolute", top: "50%", left: 3, right: 3, height: 1.5, background: open ? T.accent : T.muted, transform: "translateY(-50%)" }} />
            <span style={{ position: "absolute", left: "50%", top: 3, bottom: 3, width: 1.5, background: open ? T.accent : T.muted, transform: "translateX(-50%)" }} />
          </span>
        </button>
      </h3>
      <div
        id={`faq-panel-${id}`}
        role="region"
        aria-labelledby={`faq-btn-${id}`}
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 220ms ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              fontFamily: body,
              fontSize: "1rem",
              color: T.muted,
              lineHeight: 1.65,
              margin: "0 4px 24px",
              maxWidth: 720,
            }}
          >
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

function FaqSection() {
  const [open, setOpen] = React.useState(0);
  return (
    <section
      id="faq"
      style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px) 0" }}
    >
      <SectionHeader label="04 / FAQ" title="Answers before you open the workspace" />
      <div>
        {FAQ.map((f, i) => (
          <FaqItem
            key={i}
            id={i}
            item={f}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing CTA                                                         */
/* ------------------------------------------------------------------ */
function ClosingCTA() {
  return (
    <section
      id="cta"
      style={{ maxWidth: MAXW, margin: "0 auto", padding: "clamp(64px,8vw,110px) clamp(20px,5vw,64px) clamp(56px,6vw,80px)" }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 20,
          padding: "clamp(40px,6vw,72px) clamp(28px,5vw,64px)",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -120,
            left: "50%",
            transform: "translateX(-50%)",
            width: 640,
            maxWidth: "120%",
            height: 400,
            background: `radial-gradient(closest-side, rgba(55,224,200,calc(0.14 * var(--ocd-tweak-glow-strength))), transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <MonoLabel color={T.accent}>Ready when you are</MonoLabel>
          <h2
            style={{
              fontFamily: display,
              fontWeight: 500,
              fontSize: "clamp(1.9rem,4.4vw,3rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: T.text,
              margin: "16px auto 0",
              maxWidth: 640,
            }}
          >
            Turn ultrasound studies into clean training data.
          </h2>
          <p
            style={{
              fontFamily: body,
              fontSize: "1.1rem",
              color: T.muted,
              lineHeight: 1.6,
              maxWidth: 520,
              margin: "18px auto 0",
            }}
          >
            Open a case, draw the box, export the dataset. That's the whole loop.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 30 }}>
            <PrimaryButton>Open workspace</PrimaryButton>
            <GhostButton>Read the requirements</GhostButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${T.borderSoft}` }}>
      <div
        style={{
          maxWidth: MAXW,
          margin: "0 auto",
          padding: "36px clamp(20px,5vw,64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 18,
        }}
      >
        <Logo />
        <nav aria-label="Footer" style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="ocd-navlink ocd-focusable"
              style={{ fontFamily: body, fontSize: "0.88rem", color: T.faint, textDecoration: "none" }}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <span style={{ fontFamily: mono, fontSize: "0.72rem", color: T.faint }}>
          Sonolabel · annotation workspace
        </span>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */
function App() {
  useGlobalStyles();
  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: body, color: T.text }}>
      <style>{`
        @media (max-width: 860px) {
          .ocd-hero-grid { grid-template-columns: 1fr !important; }
          .ocd-export-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 620px) {
          .ocd-nav-links { display: none !important; }
        }
      `}</style>
      <TopNav />
      <main>
        <Hero />
        <Workflow />
        <Features />
        <ExportSection />
        <FaqSection />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
