import { Link } from "react-router-dom";

function Sidebar() {
  return (

    <div className="sidebar">

      <h2>🛡 CyberShield X</h2>

      <Link to="/">Dashboard</Link>

      <Link to="/password">
        Password Checker
      </Link>

      <Link to="/url">
        URL Analyzer
      </Link>

      <Link to="/email">
        Email Detector
      </Link>

      <Link to="/chatbot">
        AI Copilot
      </Link>

      <Link to="/analytics">
        Analytics
      </Link>

    </div>
  );
}

export default Sidebar;