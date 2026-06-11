// ============================================================
// CyberShield X — Background Service Worker
// Detects risky URLs, closes the tab, plays alert, logs it
// ============================================================

// --- Threat Database ---
const THREAT_PATTERNS = [
  // Phishing keywords
  /paypa1\./i, /paypai\./i, /secure-login\./i, /account-verify\./i,
  /signin-secure\./i, /update-billing\./i, /verify-account\./i,
  /confirm-identity\./i, /suspended-account\./i,

  // Malware / scam keywords
  /free-download-crack/i, /keygen\./i, /warez\./i, /nulled\./i,
  /torrent.*crack/i, /activator.*windows/i,

  // Fake tech support
  /virus-alert\./i, /your-pc-infected/i, /call-support-now/i,
  /microsoft-alert\./i, /apple-security-alert/i,

  // Suspicious TLD combos with sensitive words
  /bank.*\.tk$/i, /bank.*\.ml$/i, /bank.*\.ga$/i, /bank.*\.cf$/i,
  /login.*\.tk$/i, /secure.*\.tk$/i, /account.*\.tk$/i,

  // Homograph / typosquatting common targets
  /g00gle\./i, /faceb00k\./i, /amaz0n\./i, /micosoft\./i,
  /linkedln\./i, /twiiter\./i, /instagrem\./i,
];

// Known safe domains (whitelist — never block these)
const WHITELIST = [
  "google.com", "microsoft.com", "apple.com", "amazon.com",
  "facebook.com", "instagram.com", "twitter.com", "x.com",
  "github.com", "stackoverflow.com", "wikipedia.org",
  "youtube.com", "linkedin.com", "paypal.com",
  "localhost", "127.0.0.1",
];

// VirusTotal API (optional — set your key via extension options)
// If empty, only pattern matching is used
let VIRUSTOTAL_API_KEY = "2e5611831b748f8df0e4411609dbf96477d19d74223e9206b34dec9c21cc6e0e";

// --- Load saved settings on startup ---
chrome.storage.local.get(["vtApiKey", "blockingEnabled"], (result) => {
  if (result.vtApiKey) VIRUSTOTAL_API_KEY = result.vtApiKey;
  if (result.blockingEnabled === undefined) {
    chrome.storage.local.set({ blockingEnabled: true });
  }
});

// --- Helper: extract hostname ---
function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// --- Helper: check whitelist ---
function isWhitelisted(url) {
  const host = getHostname(url);
  return WHITELIST.some((safe) => host === safe || host.endsWith("." + safe));
}

// --- Helper: check threat patterns ---
function matchesThreatPattern(url) {
  return THREAT_PATTERNS.some((pattern) => pattern.test(url));
}

// --- Helper: VirusTotal check ---
async function checkVirusTotal(url) {
  if (!VIRUSTOTAL_API_KEY) return null;
  try {
    const urlId = btoa(url).replace(/=/g, "");
    const res = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
      headers: { "x-apikey": VIRUSTOTAL_API_KEY },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const stats = data?.data?.attributes?.last_analysis_stats;
    if (!stats) return null;
    return stats.malicious > 0 || stats.suspicious > 2
      ? { malicious: stats.malicious, suspicious: stats.suspicious }
      : null;
  } catch {
    return null;
  }
}

// --- Log incident to storage ---
async function logThreat(url, reason, tabId) {
  const entry = {
    id: Date.now(),
    url,
    hostname: getHostname(url),
    reason,
    timestamp: new Date().toISOString(),
    tabId,
  };

  const result = await chrome.storage.local.get(["threatLog"]);
  const log = result.threatLog || [];
  log.unshift(entry); // newest first

  // Keep only last 500 entries
  if (log.length > 500) log.splice(500);

  await chrome.storage.local.set({ threatLog: log });
  console.log("[CyberShield X] Threat logged:", entry);
  return entry;
}

// --- Play alert sound via offscreen document ---
async function playAlertSound() {
  try {
    // Create offscreen document to play audio (MV3 requirement)
    const existing = await chrome.offscreen?.hasDocument?.();
    if (!existing) {
      await chrome.offscreen?.createDocument?.({
        url: "offscreen.html",
        reasons: ["AUDIO_PLAYBACK"],
        justification: "Play threat alert sound",
      });
    }
    chrome.runtime.sendMessage({ type: "PLAY_ALERT" });
  } catch (e) {
    // Offscreen API might not be available in all Edge versions
    console.warn("[CyberShield X] Could not play sound:", e.message);
  }
}

// --- Show notification ---
function showNotification(hostname, reason) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: "⚠️ CyberShield X — Threat Blocked",
    message: `Blocked: ${hostname}\nReason: ${reason}`,
    priority: 2,
  });
}

// --- Main: handle navigation ---
async function handleNavigation(url, tabId) {
  if (!url || url.startsWith("chrome") || url.startsWith("edge") || url.startsWith("about")) return;

  // Check if blocking is enabled
  const { blockingEnabled } = await chrome.storage.local.get("blockingEnabled");
  if (blockingEnabled === false) return;

  // Whitelist check
  if (isWhitelisted(url)) return;

  let threatReason = null;

  // 1. Pattern matching (instant)
  if (matchesThreatPattern(url)) {
    threatReason = "Matched known threat pattern";
  }

  // 2. VirusTotal check (async, only if pattern didn't catch it)
  if (!threatReason) {
    const vtResult = await checkVirusTotal(url);
    if (vtResult) {
      threatReason = `VirusTotal: ${vtResult.malicious} malicious, ${vtResult.suspicious} suspicious detections`;
    }
  }

  if (!threatReason) return;

  // --- BLOCK THE SITE ---
  const hostname = getHostname(url);
  const entry = await logThreat(url, threatReason, tabId);

  // Play alert
  await playAlertSound();

  // Show notification
  showNotification(hostname, threatReason);

  // Redirect tab to blocked page
  const blockedUrl = chrome.runtime.getURL(
    `blocked.html?url=${encodeURIComponent(url)}&reason=${encodeURIComponent(threatReason)}&id=${entry.id}`
  );

  try {
    await chrome.tabs.update(tabId, { url: blockedUrl });
  } catch (e) {
    // Tab may have already closed
    console.warn("[CyberShield X] Could not redirect tab:", e.message);
  }
}

// --- Listen: tab navigation committed ---
chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return; // main frame only
  handleNavigation(details.url, details.tabId);
});

// --- Listen: messages from popup / content script ---
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_LOG") {
    chrome.storage.local.get(["threatLog"], (result) => {
      sendResponse({ log: result.threatLog || [] });
    });
    return true; // async
  }

  if (msg.type === "CLEAR_LOG") {
    chrome.storage.local.set({ threatLog: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (msg.type === "TOGGLE_BLOCKING") {
    chrome.storage.local.set({ blockingEnabled: msg.enabled }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (msg.type === "SCAN_URL") {
    handleNavigation(msg.url, msg.tabId || 0);
    sendResponse({ queued: true });
    return true;
  }

  if (msg.type === "SET_VT_KEY") {
    VIRUSTOTAL_API_KEY = msg.key;
    chrome.storage.local.set({ vtApiKey: msg.key });
    sendResponse({ success: true });
    return true;
  }
});

console.log("[CyberShield X] Background service worker started.");
