import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { askChatbot } from "../services/api";
import Layout from "../components/Layout";

const QUICK = [
  "What is phishing?",
  "How does ransomware work?",
  "What is a VPN used for?",
  "How do I create a strong password?",
  "What is two-factor authentication?",
  "Explain SQL injection",
];

export default function Chatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello, Agent. I'm CyberShield AI — your cybersecurity intelligence assistant. Ask me anything about threats, vulnerabilities, best practices, or how to stay secure." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (question) => {
    const q = question || input.trim();
    if (!q) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await askChatbot(q, user?.uid);
      setMessages((m) => [...m, { role: "bot", text: res.data.answer }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "Backend offline. Start the Flask server with: python app.py" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>🤖 AI Chatbot</h1>
        <p>Ask anything about cybersecurity threats, tools, and best practices</p>
      </div>

      <div style={{ maxWidth: 760, display: "flex", flexDirection: "column", height: "calc(100vh - 180px)" }}>
        {/* Quick prompts */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {QUICK.map((q) => (
            <button key={q} className="btn btn-outline" style={{ fontSize: "0.75rem", padding: "6px 12px" }} onClick={() => send(q)}>
              {q}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="card" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, padding: "20px" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "80%",
                padding: "12px 16px",
                borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                background: m.role === "user"
                  ? "linear-gradient(135deg, #0099cc, var(--purple))"
                  : "rgba(0,0,0,0.45)",
                border: m.role === "bot" ? "1px solid var(--border)" : "none",
                fontSize: "0.88rem",
                lineHeight: 1.6,
                color: "var(--text)",
              }}>
                {m.role === "bot" && (
                  <span style={{ fontSize: "0.65rem", color: "var(--cyan)", display: "block", marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>
                    CyberShield AI
                  </span>
                )}
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex" }}>
              <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.45)", border: "1px solid var(--border)", borderRadius: "12px 12px 12px 2px" }}>
                <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {[0,1,2].map((i) => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "var(--cyan)", opacity: 0.6,
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <input
            className="input"
            placeholder="Ask a cybersecurity question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && send()}
            disabled={loading}
          />
          <button className="btn btn-cyan" onClick={() => send()} disabled={loading || !input.trim()} style={{ flexShrink: 0 }}>
            Send
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { transform: scale(1); opacity:0.4; }
          50% { transform: scale(1.3); opacity:1; }
        }
      `}</style>
    </Layout>
  );
}