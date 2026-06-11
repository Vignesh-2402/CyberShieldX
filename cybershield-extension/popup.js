// popup.js — CyberShield X popup controller

const toggle = document.getElementById("blocking-toggle");
const toggleLabel = document.getElementById("toggle-label");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const logList = document.getElementById("log-list");
const totalBlocked = document.getElementById("total-blocked");
const todayBlocked = document.getElementById("today-blocked");
const totalScanned = document.getElementById("total-scanned");

// Load initial state
chrome.storage.local.get(["blockingEnabled", "threatLog", "sessionCount"], (result) => {
  const enabled = result.blockingEnabled !== false;
  toggle.checked = enabled;
  updateStatus(enabled);

  const log = result.threatLog || [];
  renderLog(log);
  renderStats(log, result.sessionCount || 1);
});

// Toggle blocking
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  chrome.runtime.sendMessage({ type: "TOGGLE_BLOCKING", enabled }, () => {
    updateStatus(enabled);
  });
});

function updateStatus(enabled) {
  toggleLabel.textContent = enabled ? "ON" : "OFF";
  statusDot.className = "status-dot" + (enabled ? "" : " off");
  statusText.innerHTML = enabled
    ? "<strong>Active</strong> — Monitoring all tabs"
    : "<strong style='color:#ff6666'>Paused</strong> — Protection disabled";
}

function renderStats(log, sessions) {
  totalBlocked.textContent = log.length;
  const today = new Date().toDateString();
  const todayCount = log.filter((e) => new Date(e.timestamp).toDateString() === today).length;
  todayBlocked.textContent = todayCount;
  totalScanned.textContent = sessions;
}

function renderLog(log) {
  if (!log.length) {
    logList.innerHTML = '<div class="empty-log">No threats detected yet 🎉</div>';
    return;
  }

  logList.innerHTML = log
    .slice(0, 20)
    .map((entry) => {
      const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const date = new Date(entry.timestamp).toLocaleDateString();
      return `
      <div class="log-item">
        <div class="log-item-host">${entry.hostname || entry.url}</div>
        <div class="log-item-meta">${entry.reason} • ${date} ${time}</div>
      </div>`;
    })
    .join("");
}

// Export log
document.getElementById("export-btn").addEventListener("click", () => {
  chrome.storage.local.get(["threatLog"], (result) => {
    const log = result.threatLog || [];
    const lines = [
      "CyberShield X — Threat Log Export",
      `Generated: ${new Date().toISOString()}`,
      `Total entries: ${log.length}`,
      "=".repeat(60),
      "",
      ...log.map(
        (e, i) =>
          `[${i + 1}] ${e.timestamp}\nURL: ${e.url}\nReason: ${e.reason}\nLog ID: ${e.id}\n`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cybershield-log-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });
});

// Clear log
document.getElementById("clear-btn").addEventListener("click", () => {
  if (confirm("Clear all threat logs?")) {
    chrome.runtime.sendMessage({ type: "CLEAR_LOG" }, () => {
      logList.innerHTML = '<div class="empty-log">Log cleared ✓</div>';
      totalBlocked.textContent = "0";
      todayBlocked.textContent = "0";
    });
  }
});

// Increment session count
chrome.storage.local.get(["sessionCount"], (r) => {
  chrome.storage.local.set({ sessionCount: (r.sessionCount || 0) + 1 });
});
