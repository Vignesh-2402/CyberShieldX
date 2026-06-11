import { useState } from "react";
import { generatePasswords } from "../services/api";
import Layout from "../components/Layout";

export default function Generator() {
  const [options, setOptions] = useState({
    length: 16, uppercase: true, lowercase: true, digits: true, symbols: true,
  });
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const toggle = (key) => setOptions((o) => ({ ...o, [key]: !o[key] }));

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generatePasswords(options);
      setPasswords(res.data.passwords);
    } finally {
      setLoading(false);
    }
  };

  const copy = (pw) => {
    navigator.clipboard.writeText(pw);
    setCopied(pw);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>⚙ Password Generator</h1>
        <p>Generate cryptographically secure passwords</p>
      </div>

      <div className="card-grid card-grid-2" style={{ maxWidth: 900 }}>
        <div className="card">
          <h3 style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>Options</h3>

          <div className="field">
            <label>Length: {options.length}</label>
            <input
              type="range" min={8} max={64}
              value={options.length}
              onChange={(e) => setOptions((o) => ({ ...o, length: +e.target.value }))}
              style={{ width: "100%", accentColor: "var(--cyan)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--dim)" }}>
              <span>8</span><span>64</span>
            </div>
          </div>

          {[
            { key: "uppercase", label: "Uppercase (A-Z)" },
            { key: "lowercase", label: "Lowercase (a-z)" },
            { key: "digits",    label: "Numbers (0-9)" },
            { key: "symbols",   label: "Symbols (!@#$%)" },
          ].map(({ key, label }) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => toggle(key)}
                style={{ accentColor: "var(--cyan)", width: 16, height: 16 }}
              />
              <span style={{ fontSize: "0.88rem", color: "var(--text)" }}>{label}</span>
            </label>
          ))}

          <button className="btn btn-cyan" style={{ width: "100%", marginTop: 8 }} onClick={handleGenerate} disabled={loading}>
            {loading ? <><span className="spinner" /> Generating…</> : "Generate Passwords"}
          </button>
        </div>

        <div className="card">
          <h3 style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>Generated Passwords</h3>
          {passwords.length === 0
            ? <div className="empty-state"><div className="icon">🔐</div><p>Click generate to get started</p></div>
            : passwords.map((pw, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "rgba(0,0,0,0.35)", borderRadius: 7, padding: "10px 14px",
                  marginBottom: 10, border: "1px solid var(--border)",
                }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", color: "var(--cyan)", wordBreak: "break-all" }}>
                    {pw}
                  </span>
                  <button
                    onClick={() => copy(pw)}
                    style={{ marginLeft: 12, background: "none", border: "none", color: copied === pw ? "var(--green)" : "var(--muted)", cursor: "pointer", fontSize: "1rem", flexShrink: 0 }}
                    title="Copy"
                  >
                    {copied === pw ? "✓" : "📋"}
                  </button>
                </div>
              ))
          }
        </div>
      </div>
    </Layout>
  );
}