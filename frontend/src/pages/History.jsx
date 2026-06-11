import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getHistory, clearHistory } from "../services/api";
import Layout from "../components/Layout";

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    if (!user) return;
    setLoading(true);
    getHistory(user.uid)
      .then((r) => setHistory(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [user]);

  const handleClear = async () => {
    if (!window.confirm("Clear all scan history?")) return;
    await clearHistory(user.uid);
    setHistory([]);
  };

  const filtered = filter === "all" ? history : history.filter((h) => h.risk_level === filter.toUpperCase());

  return (
    <Layout>
      <div className="page-header">
        <h1>📋 Scan History</h1>
        <p>Review all your past scans and their risk assessments</p>
      </div>

      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["all", "high", "medium", "low"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="btn"
                style={{
                  padding: "6px 14px", fontSize: "0.78rem",
                  background: filter === f ? "rgba(0,212,255,0.12)" : "transparent",
                  border: `1px solid ${filter === f ? "rgba(0,212,255,0.4)" : "var(--border)"}`,
                  color: filter === f ? "var(--cyan)" : "var(--muted)",
                  borderRadius: 6,
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {history.length > 0 && (
            <button className="btn btn-danger" style={{ padding: "6px 14px", fontSize: "0.78rem" }} onClick={handleClear}>
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}><span className="spinner" style={{ width: 24, height: 24 }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <p>No scan history yet. Run a URL, email, or password scan to see results here.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Input</th>
                  <th>Result</th>
                  <th>Risk</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--cyan)" }}>
                        {h.scan_type?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--muted)" }}>
                      {h.input}
                    </td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {h.result}
                    </td>
                    <td><span className={`badge-risk ${h.risk_level}`}>{h.risk_level}</span></td>
                    <td style={{ color: "var(--muted)", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                      {new Date(h.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}