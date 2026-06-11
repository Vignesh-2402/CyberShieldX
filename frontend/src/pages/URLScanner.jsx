import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { scanURL } from "../services/api";
import Layout from "../components/Layout";

export default function URLScanner() {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!url.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await scanURL(url, user?.uid);
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
        <h1>🔗 URL Scanner</h1>
        <p>Analyze any URL for phishing, malware, and suspicious patterns</p>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="field">
          <label>Enter URL to scan</label>
          <input
            className="input"
            placeholder="https://example.com/suspicious-link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
          />
        </div>
        {error && <p style={{ color: "var(--red)", fontSize: "0.82rem", marginBottom: 12 }}>⚠ {error}</p>}
        <button className="btn btn-cyan" onClick={handleScan} disabled={loading || !url.trim()}>
          {loading ? <><span className="spinner" /> Scanning…</> : "Scan URL"}
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
            <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 8, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Findings</p>
            <ul className="result-box__flags">
              {result.flags.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}