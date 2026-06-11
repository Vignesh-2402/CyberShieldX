import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { checkPassword } from "../services/api";
import Layout from "../components/Layout";

export default function PasswordChecker() {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const res = await checkPassword(password, user?.uid);
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = (s) => ({ Strong: "var(--green)", Moderate: "var(--yellow)", Weak: "var(--red)" }[s] || "var(--muted)");

  return (
    <Layout>
      <div className="page-header">
        <h1>🔑 Password Checker</h1>
        <p>Test how strong your password is — we never store it</p>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div className="field">
          <label>Enter Password</label>
          <div style={{ position: "relative" }}>
            <input
              className="input"
              type={show ? "text" : "password"}
              placeholder="Type your password here…"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setResult(null); }}
              style={{ paddingRight: 48 }}
            />
            <button
              onClick={() => setShow(!show)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1rem" }}
            >
              {show ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Live strength bar */}
        {password && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ height: 4, background: "rgba(0,0,0,0.4)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.min(100, password.length * 7)}%`,
                background: password.length >= 12 ? "var(--green)" : password.length >= 8 ? "var(--yellow)" : "var(--red)",
                transition: "width 0.3s, background 0.3s",
                borderRadius: 2,
              }} />
            </div>
            <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 4 }}>
              Length: {password.length} characters
            </p>
          </div>
        )}

        <button className="btn btn-cyan" onClick={handleCheck} disabled={loading || !password}>
          {loading ? <><span className="spinner" /> Checking…</> : "Check Strength"}
        </button>

        {result && (
          <div className={`result-box ${result.risk_level.toLowerCase()}`} style={{ marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "1.6rem", fontWeight: 700, color: strengthColor(result.strength) }}>
                {result.strength}
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", color: strengthColor(result.strength) }}>
                {result.score}/100
              </span>
            </div>
            {result.feedback.length > 0 && (
              <>
                <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  {result.strength === "Strong" ? "All good" : "Suggestions"}
                </p>
                <ul className="result-box__flags">
                  {result.feedback.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}