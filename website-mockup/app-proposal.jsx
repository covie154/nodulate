const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#37E0C8",
  "background": "#000000"
}/*EDITMODE-END*/;

const T = {
  bg: "var(--ocd-tweak-background)",
  accent: "var(--ocd-tweak-accent-color)",
  surface: "#0B0E10",
  raised: "#14181B",
  border: "#23292D",
  text: "#F2F5F6",
  muted: "#8A9499",
  faint: "#5B656A",
  accentDeep: "#0FA394",
  focus: "#5CB8FF",
  success: "#4ADE9A",
  warning: "#F5B84B",
  danger: "#F26D6D",
};

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";

function useFonts() {
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
    document.body.style.margin = "0";
    document.body.style.background = "#000000";
  }, []);
}

const display = "'Space Grotesk', system-ui, sans-serif";
const body = "'Inter Tight', system-ui, sans-serif";
const mono = "'JetBrains Mono', ui-monospace, monospace";

function MonoLabel({ children, color }) {
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: "0.75rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: color || T.faint,
      }}
    >
      {children}
    </span>
  );
}

function Section({ label, title, children }) {
  return (
    <section style={{ marginTop: 72 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <MonoLabel color={T.accent}>{label}</MonoLabel>
        <div style={{ height: 1, flex: 1, background: T.border }} />
      </div>
      <h2
        style={{
          fontFamily: display,
          fontWeight: 500,
          fontSize: "clamp(1.4rem,3vw,2rem)",
          letterSpacing: "-0.02em",
          color: T.text,
          margin: "0 0 28px",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

const swatches = [
  { name: "background", hex: "#000000", role: "AMOLED canvas", swatchBorder: true },
  { name: "surface", hex: "#0B0E10", role: "Cards on black" },
  { name: "surfaceRaised", hex: "#14181B", role: "Chips / inputs" },
  { name: "border", hex: "#23292D", role: "Hairlines" },
  { name: "text", hex: "#F2F5F6", role: "Primary text" },
  { name: "muted", hex: "#8A9499", role: "Secondary copy" },
  { name: "faint", hex: "#5B656A", role: "Labels / meta" },
  { name: "accent", hex: "#37E0C8", role: "Cyan — CTA / measure" },
  { name: "accentDeep", hex: "#0FA394", role: "Accent pressed" },
  { name: "focus", hex: "#5CB8FF", role: "Focus ring" },
  { name: "success", hex: "#4ADE9A", role: "Saved indicator" },
  { name: "warning", hex: "#F5B84B", role: "Review needed" },
  { name: "danger", hex: "#F26D6D", role: "Delete / error" },
];

function Swatch({ s }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 14,
        display: "flex",
        gap: 14,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 8,
          flexShrink: 0,
          background: s.hex,
          border: s.swatchBorder ? `1px solid ${T.border}` : "1px solid transparent",
          boxShadow: s.name === "accent" ? `0 0 22px -4px ${T.accent}` : "none",
        }}
      />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: mono, fontSize: "0.8rem", color: T.text }}>{s.name}</div>
        <div style={{ fontFamily: mono, fontSize: "0.72rem", color: T.faint, marginTop: 2 }}>
          {s.hex}
        </div>
        <div style={{ fontFamily: body, fontSize: "0.82rem", color: T.muted, marginTop: 4 }}>
          {s.role}
        </div>
      </div>
    </div>
  );
}

function TypeRow({ label, family, sample, style }) {
  return (
    <div
      style={{
        borderTop: `1px solid ${T.border}`,
        padding: "26px 0",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr)",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
        <MonoLabel color={T.accent}>{label}</MonoLabel>
        <span style={{ fontFamily: mono, fontSize: "0.75rem", color: T.faint }}>{family}</span>
      </div>
      <div style={{ ...style }}>{sample}</div>
    </div>
  );
}

function BBoxCard() {
  return (
    <div
      style={{
        position: "relative",
        background: T.surface,
        borderRadius: 14,
        padding: "30px 26px 26px",
        border: `1px solid ${T.border}`,
      }}
    >
      {/* bounding box motif */}
      <div
        style={{
          position: "absolute",
          inset: 10,
          border: `1.5px solid ${T.accent}`,
          borderRadius: 8,
          pointerEvents: "none",
          boxShadow: `0 0 24px -8px ${T.accent}`,
        }}
      />
      {["nw", "ne", "sw", "se"].map((c) => {
        const pos = {
          nw: { top: 4, left: 4 },
          ne: { top: 4, right: 4 },
          sw: { bottom: 4, left: 4 },
          se: { bottom: 4, right: 4 },
        }[c];
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              width: 9,
              height: 9,
              background: T.bg,
              border: `1.5px solid ${T.accent}`,
              borderRadius: 2,
              ...pos,
            }}
          />
        );
      })}
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: mono, fontSize: "0.7rem", color: T.accent, marginBottom: 12 }}>
          lesion_01 · x:184 y:96 w:120 h:88
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 500,
            fontSize: "1.15rem",
            color: T.text,
            letterSpacing: "-0.01em",
          }}
        >
          Bounding-box motif
        </div>
        <p style={{ fontFamily: body, fontSize: "0.9rem", color: T.muted, margin: "8px 0 0", lineHeight: 1.55 }}>
          Cards echo the annotation canvas — a cyan frame with corner handles and a
          monospace coordinate caption.
        </p>
      </div>
    </div>
  );
}

function App() {
  useFonts();
  return (
    <div
      style={{
        background: T.bg,
        minHeight: "100vh",
        fontFamily: body,
        color: T.text,
        boxSizing: "border-box",
        padding: "clamp(28px,6vw,72px) clamp(20px,5vw,64px) 96px",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        {/* Header / hero of the spec */}
        <header>
          <MonoLabel color={T.faint}>Design proposal · v alpha</MonoLabel>
          <h1
            style={{
              fontFamily: display,
              fontWeight: 500,
              fontSize: "clamp(2.4rem,6vw,4rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              color: T.text,
              margin: "18px 0 0",
            }}
          >
            Sonolabel
            <span style={{ color: T.accent }}>.</span> visual direction
          </h1>
          <p
            style={{
              fontFamily: body,
              fontSize: "clamp(1.02rem,1.4vw,1.18rem)",
              color: T.muted,
              maxWidth: 620,
              lineHeight: 1.6,
              margin: "18px 0 0",
            }}
          >
            Fonts and color scheme for the ultrasound lesion-labeling landing page.
            The language borrows from medical imaging equipment: a true AMOLED-black
            canvas, one luminous cyan measurement accent, and monospace for data.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
            {["AMOLED #000000", "Cyan instrument accent", "3 open-source fonts"].map((c) => (
              <span
                key={c}
                style={{
                  fontFamily: mono,
                  fontSize: "0.74rem",
                  color: T.accent,
                  background: T.raised,
                  border: `1px solid ${T.border}`,
                  borderRadius: 999,
                  padding: "7px 14px",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </header>

        {/* Colors */}
        <Section label="01 / Palette" title="Cyan on true black">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: 12,
            }}
          >
            {swatches.map((s) => (
              <Swatch key={s.name} s={s} />
            ))}
          </div>
          <p style={{ fontFamily: body, color: T.muted, maxWidth: 640, lineHeight: 1.6, marginTop: 22, fontSize: "0.95rem" }}>
            Ultrasound displays render tissue in grayscale with cyan/teal calipers and
            Doppler overlays — so cyan reads as “instrument,” glows against true black,
            and avoids the medical-green cliché. Text stays cool near-white, never pure
            white.
          </p>
        </Section>

        {/* Typography */}
        <Section label="02 / Type" title="Three fonts, three jobs">
          <TypeRow
            label="Display"
            family="Space Grotesk · 500"
            sample="Label lesions with precision."
            style={{
              fontFamily: display,
              fontWeight: 500,
              fontSize: "clamp(2rem,5vw,3.25rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.04,
              color: T.text,
            }}
          />
          <TypeRow
            label="Body / UI"
            family="Inter Tight · 400"
            sample="Draw a bounding box, and the annotation auto-saves instantly. No manual save, no lost work — every box is exported in OpenCV-compatible format for downstream ML workflows."
            style={{ fontFamily: body, fontSize: "1.05rem", lineHeight: 1.6, color: T.text, maxWidth: 680 }}
          />
          <TypeRow
            label="Data / Mono"
            family="JetBrains Mono · 400"
            sample={<code>{"boxes = [{ \"x\": 184, \"y\": 96, \"w\": 120, \"h\": 88, \"label\": \"lesion\" }]"}</code>}
            style={{ fontFamily: mono, fontSize: "0.95rem", color: T.accent, lineHeight: 1.5, wordBreak: "break-word" }}
          />
        </Section>

        {/* Applied preview */}
        <Section label="03 / Applied" title="How it feels together">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
              alignItems: "stretch",
            }}
          >
            <BBoxCard />
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: 26,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <MonoLabel color={T.accent}>Controls</MonoLabel>
              <button
                type="button"
                style={{
                  fontFamily: body,
                  fontWeight: 500,
                  fontSize: "0.98rem",
                  color: "#00110E",
                  background: T.accent,
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 20px",
                  cursor: "pointer",
                  boxShadow: `0 0 26px -8px ${T.accent}`,
                }}
              >
                Start labeling
              </button>
              <button
                type="button"
                style={{
                  fontFamily: body,
                  fontWeight: 500,
                  fontSize: "0.98rem",
                  color: T.text,
                  background: "transparent",
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "14px 20px",
                  cursor: "pointer",
                }}
              >
                View export format
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: T.success,
                    boxShadow: `0 0 10px ${T.success}`,
                  }}
                />
                <span style={{ fontFamily: mono, fontSize: "0.78rem", color: T.success }}>
                  Saved · 12:04:31
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                {["Auto-save", "OpenCV export", "Multi-box"].map((c) => (
                  <span
                    key={c}
                    style={{
                      fontFamily: mono,
                      fontSize: "0.72rem",
                      color: T.accent,
                      background: T.raised,
                      border: `1px solid ${T.border}`,
                      borderRadius: 999,
                      padding: "6px 12px",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <footer style={{ marginTop: 80, borderTop: `1px solid ${T.border}`, paddingTop: 22 }}>
          <p style={{ fontFamily: mono, fontSize: "0.76rem", color: T.faint, margin: 0 }}>
            Approve or tweak this direction and I’ll build the full landing page on top of it.
          </p>
        </footer>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
