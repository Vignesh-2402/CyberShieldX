import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import URLScanner from "./pages/URLScanner";
import EmailScanner from "./pages/EmailScanner";
import PasswordChecker from "./pages/PasswordChecker";
import Generator from "./pages/Generator";
import Chatbot from "./pages/Chatbot";
import History from "./pages/History";
import Report from "./pages/Report";
import Profile from "./pages/Profile";

const Guard = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
          <Route path="/url"       element={<Guard><URLScanner /></Guard>} />
          <Route path="/email"     element={<Guard><EmailScanner /></Guard>} />
          <Route path="/password"  element={<Guard><PasswordChecker /></Guard>} />
          <Route path="/generator" element={<Guard><Generator /></Guard>} />
          <Route path="/chatbot"   element={<Guard><Chatbot /></Guard>} />
          <Route path="/history"   element={<Guard><History /></Guard>} />
          <Route path="/report"    element={<Guard><Report /></Guard>} />
          <Route path="/profile"   element={<Guard><Profile /></Guard>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}