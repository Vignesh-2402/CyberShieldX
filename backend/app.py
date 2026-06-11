from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import sqlite3
import os
import re
import hashlib
import random
import string
import requests
from datetime import datetime

app = Flask(__name__)
app.secret_key = "cybershieldx_secret_2024"
CORS(app, supports_credentials=True)

# ── Database ──────────────────────────────────────────────────────
DB_PATH = "cybershield.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT UNIQUE,
            email TEXT,
            name TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS scan_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT,
            scan_type TEXT,
            input TEXT,
            result TEXT,
            risk_level TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT,
            question TEXT,
            answer TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    conn.close()

init_db()

# ── Helpers ───────────────────────────────────────────────────────
def save_scan(uid, scan_type, input_val, result, risk_level):
    conn = get_db()
    conn.execute(
        "INSERT INTO scan_history (uid, scan_type, input, result, risk_level) VALUES (?,?,?,?,?)",
        (uid, scan_type, input_val, result, risk_level)
    )
    conn.commit()
    conn.close()

# ── Auth sync (called after Firebase login) ───────────────────────
@app.route("/api/auth/sync", methods=["POST"])
def auth_sync():
    data = request.json
    uid = data.get("uid")
    email = data.get("email")
    name = data.get("name", "Agent")
    if not uid:
        return jsonify({"error": "Missing uid"}), 400
    conn = get_db()
    conn.execute(
        "INSERT OR IGNORE INTO users (uid, email, name) VALUES (?,?,?)",
        (uid, email, name)
    )
    conn.commit()
    conn.close()
    return jsonify({"status": "ok"})

# ── URL Scanner ───────────────────────────────────────────────────
@app.route("/api/scan/url", methods=["POST"])
def scan_url():
    data = request.json
    url = data.get("url", "").strip()
    uid = data.get("uid", "anonymous")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    risk_score = 0
    flags = []

    suspicious_keywords = ["login", "verify", "secure", "account", "update",
                           "confirm", "banking", "paypal", "apple", "microsoft",
                           "free", "prize", "click", "urgent", "winner"]
    for kw in suspicious_keywords:
        if kw in url.lower():
            risk_score += 15
            flags.append(f"Suspicious keyword: '{kw}'")

    if len(url) > 75:
        risk_score += 10
        flags.append("Unusually long URL")

    if url.count(".") > 4:
        risk_score += 20
        flags.append("Excessive subdomains")

    if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url):
        risk_score += 30
        flags.append("IP address used instead of domain")

    if "@" in url:
        risk_score += 25
        flags.append("@ symbol in URL (redirect trick)")

    if url.startswith("http://"):
        risk_score += 15
        flags.append("No HTTPS (unencrypted)")

    risk_score = min(risk_score, 100)

    if risk_score >= 70:
        risk_level = "HIGH"
        verdict = "⚠️ High risk — likely malicious or phishing URL."
    elif risk_score >= 40:
        risk_level = "MEDIUM"
        verdict = "⚡ Medium risk — use caution with this URL."
    else:
        risk_level = "LOW"
        verdict = "✅ Low risk — URL appears safe."

    result = {
        "url": url,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "verdict": verdict,
        "flags": flags if flags else ["No suspicious patterns found"],
    }

    save_scan(uid, "url", url, verdict, risk_level)
    return jsonify(result)

# ── Email Scanner ─────────────────────────────────────────────────
@app.route("/api/scan/email", methods=["POST"])
def scan_email():
    data = request.json
    content = data.get("content", "").strip()
    uid = data.get("uid", "anonymous")

    if not content:
        return jsonify({"error": "Email content is required"}), 400

    risk_score = 0
    flags = []

    urgent_phrases = ["act now", "urgent", "immediately", "verify your account",
                      "click here", "limited time", "suspended", "unusual activity",
                      "confirm your identity", "password expired", "you have won"]
    for phrase in urgent_phrases:
        if phrase in content.lower():
            risk_score += 18
            flags.append(f"Urgency phrase: '{phrase}'")

    if re.search(r'http[s]?://\S+', content):
        risk_score += 10
        flags.append("Contains hyperlinks")

    if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', content):
        risk_score += 5
        flags.append("Contains email addresses")

    risk_score = min(risk_score, 100)

    if risk_score >= 60:
        risk_level = "HIGH"
        verdict = "⚠️ High risk — likely a phishing email."
    elif risk_score >= 30:
        risk_level = "MEDIUM"
        verdict = "⚡ Medium risk — treat with caution."
    else:
        risk_level = "LOW"
        verdict = "✅ Low risk — email appears legitimate."

    result = {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "verdict": verdict,
        "flags": flags if flags else ["No phishing patterns detected"],
    }

    save_scan(uid, "email", content[:100], verdict, risk_level)
    return jsonify(result)

# ── Password Checker ──────────────────────────────────────────────
@app.route("/api/scan/password", methods=["POST"])
def check_password():
    data = request.json
    password = data.get("password", "")
    uid = data.get("uid", "anonymous")

    if not password:
        return jsonify({"error": "Password is required"}), 400

    score = 0
    feedback = []

    if len(password) >= 8:  score += 20
    else: feedback.append("Use at least 8 characters")

    if len(password) >= 12: score += 10

    if re.search(r'[A-Z]', password): score += 20
    else: feedback.append("Add uppercase letters (A-Z)")

    if re.search(r'[a-z]', password): score += 15
    else: feedback.append("Add lowercase letters (a-z)")

    if re.search(r'\d', password): score += 20
    else: feedback.append("Add numbers (0-9)")

    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password): score += 15
    else: feedback.append("Add special characters (!@#$%)")

    common = ["password", "123456", "qwerty", "abc123", "letmein", "admin", "welcome"]
    if password.lower() in common:
        score = 5
        feedback = ["This is one of the most common passwords — change it immediately"]

    if score >= 80:
        strength = "Strong"
        risk_level = "LOW"
    elif score >= 50:
        strength = "Moderate"
        risk_level = "MEDIUM"
    else:
        strength = "Weak"
        risk_level = "HIGH"

    result = {
        "score": score,
        "strength": strength,
        "risk_level": risk_level,
        "feedback": feedback if feedback else ["Your password is strong!"],
    }

    save_scan(uid, "password", "***hidden***", strength, risk_level)
    return jsonify(result)

# ── Password Generator ────────────────────────────────────────────
@app.route("/api/generate/password", methods=["POST"])
def generate_password():
    data = request.json
    length = min(int(data.get("length", 16)), 64)
    use_upper = data.get("uppercase", True)
    use_lower = data.get("lowercase", True)
    use_digits = data.get("digits", True)
    use_symbols = data.get("symbols", True)

    chars = ""
    if use_upper:   chars += string.ascii_uppercase
    if use_lower:   chars += string.ascii_lowercase
    if use_digits:  chars += string.digits
    if use_symbols: chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if not chars:
        chars = string.ascii_letters + string.digits

    passwords = ["".join(random.SystemRandom().choices(chars, k=length)) for _ in range(5)]
    return jsonify({"passwords": passwords})

# ── Chatbot ───────────────────────────────────────────────────────
CYBER_KB = {
    "phishing": "Phishing is a social engineering attack where attackers impersonate trusted entities via email, SMS, or fake websites to steal credentials or install malware. Always verify sender addresses, avoid clicking unknown links, and enable MFA.",
    "malware": "Malware (malicious software) includes viruses, ransomware, spyware, and trojans. Keep your OS and antivirus updated, avoid suspicious downloads, and regularly back up your data.",
    "ransomware": "Ransomware encrypts your files and demands payment. Prevention: regular offline backups, keep software patched, avoid opening unknown email attachments. Never pay the ransom — it doesn't guarantee recovery.",
    "vpn": "A VPN (Virtual Private Network) encrypts your internet traffic and masks your IP address. Use it on public Wi-Fi, but note that a VPN alone doesn't make you anonymous or protect against malware.",
    "two factor": "Two-Factor Authentication (2FA) adds a second verification step beyond your password. Use authenticator apps (Google Authenticator, Authy) rather than SMS-based 2FA when possible.",
    "password": "Strong passwords should be 12+ characters, mix upper/lowercase, numbers, and symbols. Use a password manager (Bitwarden, 1Password) and never reuse passwords across sites.",
    "firewall": "A firewall monitors and controls incoming/outgoing network traffic based on security rules. Enable your OS firewall and consider a hardware firewall for your network.",
    "sql injection": "SQL Injection attacks insert malicious SQL code into input fields to manipulate databases. Prevention: use parameterized queries, prepared statements, and input validation.",
    "xss": "Cross-Site Scripting (XSS) injects malicious scripts into web pages viewed by other users. Prevention: sanitize user input, use Content Security Policy (CSP) headers.",
    "ddos": "A DDoS (Distributed Denial of Service) attack overwhelms a server with traffic. Mitigation: use a CDN with DDoS protection (Cloudflare), rate limiting, and traffic filtering.",
    "zero day": "A zero-day vulnerability is an unknown security flaw actively exploited before a patch exists. Keep software updated, use endpoint detection tools, and follow threat intelligence feeds.",
    "encryption": "Encryption scrambles data so only authorized parties can read it. Use TLS for web traffic, encrypt sensitive files, and use end-to-end encrypted messaging apps like Signal.",
    "social engineering": "Social engineering manipulates people into revealing confidential info. Be skeptical of unsolicited requests, verify identities through known channels, and train employees regularly.",
    "dark web": "The dark web hosts illegal marketplaces and hacker forums but also legitimate privacy tools like Tor. Monitor your email/passwords on HaveIBeenPwned.com for breach exposure.",
    "certificate": "SSL/TLS certificates authenticate websites and encrypt traffic. Always check for HTTPS and a valid certificate before entering sensitive info.",
}

@app.route("/api/chatbot", methods=["POST"])
def chatbot_api():
    data = request.json
    question = data.get("question", "").strip().lower()
    uid = data.get("uid", "anonymous")

    if not question:
        return jsonify({"answer": "Please ask a cybersecurity question."})

    answer = None
    for keyword, response in CYBER_KB.items():
        if keyword in question:
            answer = response
            break

    if not answer:
        # Try Anthropic API if available, else fallback
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))
            msg = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=300,
                system="You are CyberShield X, an expert AI cybersecurity assistant. Answer questions clearly and concisely. Focus only on cybersecurity topics.",
                messages=[{"role": "user", "content": question}]
            )
            answer = msg.content[0].text
        except Exception:
            answer = (
                "I specialize in cybersecurity topics like phishing, malware, passwords, VPNs, "
                "encryption, firewalls, and more. Could you rephrase your question with a specific "
                "cybersecurity term? For example: 'What is phishing?' or 'How do I create a strong password?'"
            )

    conn = get_db()
    conn.execute(
        "INSERT INTO chat_history (uid, question, answer) VALUES (?,?,?)",
        (uid, question, answer)
    )
    conn.commit()
    conn.close()

    return jsonify({"answer": answer})

# ── Scan History ──────────────────────────────────────────────────
@app.route("/api/history/<uid>", methods=["GET"])
def get_history(uid):
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM scan_history WHERE uid=? ORDER BY created_at DESC LIMIT 50",
        (uid,)
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/api/history/<uid>", methods=["DELETE"])
def clear_history(uid):
    conn = get_db()
    conn.execute("DELETE FROM scan_history WHERE uid=?", (uid,))
    conn.commit()
    conn.close()
    return jsonify({"status": "cleared"})

# ── Chat History ──────────────────────────────────────────────────
@app.route("/api/chat-history/<uid>", methods=["GET"])
def get_chat_history(uid):
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM chat_history WHERE uid=? ORDER BY created_at DESC LIMIT 30",
        (uid,)
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

# ── Dashboard Stats ───────────────────────────────────────────────
@app.route("/api/stats/<uid>", methods=["GET"])
def get_stats(uid):
    conn = get_db()
    total = conn.execute("SELECT COUNT(*) as c FROM scan_history WHERE uid=?", (uid,)).fetchone()["c"]
    high   = conn.execute("SELECT COUNT(*) as c FROM scan_history WHERE uid=? AND risk_level='HIGH'", (uid,)).fetchone()["c"]
    medium = conn.execute("SELECT COUNT(*) as c FROM scan_history WHERE uid=? AND risk_level='MEDIUM'", (uid,)).fetchone()["c"]
    low    = conn.execute("SELECT COUNT(*) as c FROM scan_history WHERE uid=? AND risk_level='LOW'", (uid,)).fetchone()["c"]
    chats  = conn.execute("SELECT COUNT(*) as c FROM chat_history WHERE uid=?", (uid,)).fetchone()["c"]
    conn.close()

    score = 100
    if total > 0:
        score = max(0, round(100 - (high * 15) - (medium * 5)))

    return jsonify({
        "total_scans": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
        "chat_sessions": chats,
        "security_score": score,
    })

# ── Report ────────────────────────────────────────────────────────
@app.route("/api/report/<uid>", methods=["GET"])
def get_report(uid):
    conn = get_db()
    scans = conn.execute(
        "SELECT * FROM scan_history WHERE uid=? ORDER BY created_at DESC LIMIT 20",
        (uid,)
    ).fetchall()
    conn.close()

    report = {
        "generated_at": datetime.now().isoformat(),
        "uid": uid,
        "scans": [dict(s) for s in scans],
        "summary": {
            "total": len(scans),
            "high": sum(1 for s in scans if s["risk_level"] == "HIGH"),
            "medium": sum(1 for s in scans if s["risk_level"] == "MEDIUM"),
            "low": sum(1 for s in scans if s["risk_level"] == "LOW"),
        }
    }
    return jsonify(report)

if __name__ == "__main__":
    app.run(debug=True, port=5000)