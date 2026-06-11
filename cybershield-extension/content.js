// content.js — CyberShield X content script
// Runs at document_start on every page for early detection signals

(function () {
  // Send current URL to background for evaluation
  // Background handles the actual blocking via webNavigation
  // This is here for future: DOM-based phishing signals (hidden iframes, etc.)

  const url = window.location.href;

  // Quick client-side check: suspicious title after load
  window.addEventListener("DOMContentLoaded", () => {
    const title = document.title.toLowerCase();
    const suspiciousTitle = [
      "your computer is infected",
      "virus detected",
      "call microsoft",
      "call apple",
      "your account has been suspended",
      "security alert",
    ];

    if (suspiciousTitle.some((t) => title.includes(t))) {
      chrome.runtime.sendMessage({
        type: "SCAN_URL",
        url,
        reason: "Suspicious page title detected",
      });
    }
  });
})();
