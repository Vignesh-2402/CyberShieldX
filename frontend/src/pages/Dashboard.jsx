import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getStats, syncUser } from "../services/api";
import Layout from "../components/Layout";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    syncUser(user.uid, user.email, user.displayName || "Agent").catch(() => {});
    getStats(user.uid)
      .then((r) => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [user]);

  const score = stats?.security_score ?? 0;
  const scoreColor = score >= 80 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)";

  return (
    <Layout>
      <div className="page-header">
        <h1>Welcome back, {user?.displayName?.split(" ")[0] || "Agent"} 👋</h1>
        <p>Here's your cybersecurity overview</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "48px", color: "var(--muted)" }}>
          <span className="spinner" style={{ width: 28, height: 28 }} />
        </div>
      ) : (
        <>
          {/* Security Score */}
          <div className="card" style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{
              width: 96, height: 96, borderRadius: "50%",
              border: `4px solid ${scoreColor}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 0 24px ${scoreColor}40`,
            }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "1.6rem", color: scoreColor, fontWeight: 700 }}>
                {score}
              </span>
            </div>
            <div>
              <p style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Security Score</p>
              <h2 style={{ fontSize: "1.3rem", color: scoreColor }}>
                {score >= 80 ? "Strong" : score >= 50 ? "Moderate" : "At Risk"}
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>
                {score >= 80
                  ? "Your account shows no major threats detected."
                  : score >= 50
                  ? "Some threats were detected. Review your scan history."
                  : "Multiple high-risk items found. Take action now."}
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="card-grid card-grid-4" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <span className="stat-card__label">Total Scans</span>
              <span className="stat-card__value color-cyan">{stats?.total_scans ?? 0}</span>
              <span className="stat-card__sub">all time</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">High Risk</span>
              <span className="stat-card__value color-red">{stats?.high_risk ?? 0}</span>
              <span className="stat-card__sub">threats detected</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Medium Risk</span>
              <span className="stat-card__value color-yellow">{stats?.medium_risk ?? 0}</span>
              <span className="stat-card__sub">caution items</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Chat Sessions</span>
              <span className="stat-card__value color-purple">{stats?.chat_sessions ?? 0}</span>
              <span className="stat-card__sub">AI interactions</span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card">
            <h3 style={{ fontSize: "0.85rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Scan a URL", href: "/url", icon: "🔗" },
                { label: "Check Email", href: "/email", icon: "📧" },
                { label: "Test Password", href: "/password", icon: "🔑" },
                { label: "Ask AI", href: "/chatbot", icon: "🤖" },
              ].map(({ label, href, icon }) => (
                <a key={href} href={href} style={{ textDecoration: "none" }}>
                  <button className="btn btn-outline">
                    {icon} {label}
                  </button>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}