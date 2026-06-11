import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { scanEmail } from "../services/api";
import Layout from "../components/Layout";

export default function EmailScanner() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!content.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await scanEmail(content, user?.uid);
      setResult(res.data);
    } catch {
      setError("Scan failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const level = result?.risk_level?.toLowerCase();

  return (
    <Layout>
      <div className="page-header">
        <h1>📧 Email Scanner</h1>
        <p>Paste email content to detect phishing attempts and social engineering</p>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        <div className="field">
          <label>Paste email content</label>
          <textarea
            className="textarea"
            placeholder="Paste the email subject, body, or headers here…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ minHeight: 160 }}
          />
        </div>
        {error && <p style={{ color: "var(--red)", fontSize: "0.82rem", marginBottom: 12 }}>⚠ {error}</p>}
        <button className="btn btn-cyan" onClick={handleScan} disabled={loading || !content.trim()}>
          {loading ? <><span className="spinner" /> Analyzing…</> : "Analyze Email"}
        </button>

        {result && (
          <div className={`result-box ${level}`} style={{ marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div className="result-box__score" style={{
                color: level === "high" ? "var(--red)" : level === "medium" ? "var(--yellow)" : "var(--green)"
              }}>
                {result.risk_score}<span style={{ fontSize: "1rem", fontWeight: 400, marginLeft: 4 }}>/ 100</span>
              </div>
              <span className={`badge-risk ${result.risk_level}`}>{result.risk_level}</span>
            </div>
            <p className="result-box__verdict">{result.verdict}</p>
            <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 8, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Detected Signals</p>
            <ul className="result-box__flags">
              {result.flags.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}