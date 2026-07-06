// This design has moved to website-mockup/App.jsx
// Preview and edit website-mockup/App.jsx instead.
function App() {
  return (
    <div
      style={{
        background: "#000000",
        color: "#F2F5F6",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "ui-monospace, monospace",
        fontSize: "0.9rem",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <p style={{ maxWidth: 420, lineHeight: 1.6, color: "#8A9499" }}>
        This mockup moved to{" "}
        <span style={{ color: "#37E0C8" }}>website-mockup/App.jsx</span>. Open and
        preview that file.
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
