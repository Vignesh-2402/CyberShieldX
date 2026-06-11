import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getReport } from "../services/api";
import Layout from "../components/Layout";

export default function Report() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getReport(user.uid)
      .then((r) => setReport(r.data))
      .finally(() => setLoading(false));
  }, [user]);

  const handleExport = () => {
    if (!report) return;
    const text = [
      "CYBERSHIELD X — SECURITY REPORT",
      "================================",
      `Generated: ${new Date(report.generated_at).toLocaleString()}`,
      `User: ${user?.email}`,
      "",
      "SUMMARY",
      `Total Scans:  ${report.summary.total}`,
      `High Risk:    ${report.summary.high}`,
      `Medium Risk:  ${report.summary.medium}`,
      `Low Risk:     ${report.summary.low}`,
      "",
      "SCAN DETAILS",
      ...report.scans.map((s) =>
        `[${s.scan_type?.toUpperCase()}] ${s.input?.slice(0, 60)} → ${s.result} (${s.risk_level}) — ${s.created_at}`
      ),
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "cybershieldx_report.txt"; a.click();
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>📊 Security Report</h1>
        <p>Your complete cybersecurity analysis summary</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48 }}><span className="spinner" style={{ width: 28, height: 28 }} /></div>
      ) : !report ? (
        <div className="card"><div className="empty-state"><div className="icon">📊</div><p>No report data available.</p></div></div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="card-grid card-grid-4" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <span className="stat-card__label">Total Scans</span>
              <span className="stat-card__value color-cyan">{report.summary.total}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">High Risk</span>
              <span className="stat-card__value color-red">{report.summary.high}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Medium Risk</span>
              <span className="stat-card__value color-yellow">{report.summary.medium}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Safe Scans</span>
              <span className="stat-card__value color-green">{report.summary.low}</span>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: "0.95rem", color: "var(--text)" }}>Detailed Scan Log</h3>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2 }}>
                  Generated {new Date(report.generated_at).toLocaleString()}
                </p>
              </div>
              <button className="btn btn-outline" onClick={handleExport}>
                ⬇ Export .txt
              </button>
            </div>

            {report.scans.length === 0 ? (
              <div className="empty-state"><div className="icon">🔍</div><p>No scans to report yet.</p></div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Type</th><th>Input</th><th>Verdict</th><th>Risk</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.scans.map((s) => (
                      <tr key={s.id}>
                        <td><span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--cyan)" }}>{s.scan_type?.toUpperCase()}</span></td>
                        <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--muted)", fontSize: "0.82rem" }}>{s.input}</td>
                        <td style={{ fontSize: "0.82rem" }}>{s.result}</td>
                        <td><span className={`badge-risk ${s.risk_level}`}>{s.risk_level}</span></td>
                        <td style={{ color: "var(--muted)", fontSize: "0.78rem", whiteSpace: "nowrap" }}>{new Date(s.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}