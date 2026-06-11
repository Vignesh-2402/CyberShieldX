import axios from "axios";

const BASE = "http://localhost:5000/api";

const api = axios.create({ baseURL: BASE, withCredentials: true });

// ── Auth ─────────────────────────────────────────────────────────
export const syncUser = (uid, email, name) =>
  api.post("/auth/sync", { uid, email, name });

// ── Scanners ──────────────────────────────────────────────────────
export const scanURL = (url, uid) =>
  api.post("/scan/url", { url, uid });

export const scanEmail = (content, uid) =>
  api.post("/scan/email", { content, uid });

export const checkPassword = (password, uid) =>
  api.post("/scan/password", { password, uid });

export const generatePasswords = (options) =>
  api.post("/generate/password", options);

// ── Chatbot ───────────────────────────────────────────────────────
export const askChatbot = (question, uid) =>
  api.post("/chatbot", { question, uid });

// ── History / Stats / Report ──────────────────────────────────────
export const getHistory = (uid) => api.get(`/history/${uid}`);
export const clearHistory = (uid) => api.delete(`/history/${uid}`);
export const getChatHistory = (uid) => api.get(`/chat-history/${uid}`);
export const getStats = (uid) => api.get(`/stats/${uid}`);
export const getReport = (uid) => api.get(`/report/${uid}`);

export default api;
