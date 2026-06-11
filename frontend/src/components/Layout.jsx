import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

const NAV = [
  { to: "/dashboard",  icon: "⬡", label: "Dashboard" },
  { to: "/url",        icon: "🔗", label: "URL Scanner" },
  { to: "/email",      icon: "📧", label: "Email Scanner" },
  { to: "/password",   icon: "🔑", label: "Password" },
  { to: "/generator",  icon: "⚙", label: "Generator" },
  { to: "/chatbot",    icon: "🤖", label: "AI Chatbot" },
  { to: "/history",    icon: "📋", label: "History" },
  { to: "/report",     icon: "📊", label: "Report" },
  { to: "/profile",    icon: "👤", label: "Profile" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="page">
      <aside className="sidebar">
        <div className="sidebar__logo">
          <h2>CyberShield<span className="accent">X</span></h2>
          <p>Threat Intelligence</p>
        </div>

        <nav>
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              <span className="icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">
              {user?.photoURL
                ? <img src={user.photoURL} alt="" />
                : initials
              }
            </div>
            <div className="sidebar__user-info">
              <p>{user?.displayName?.split(" ")[0] || "Agent"}</p>
              <span>{user?.email?.slice(0, 18)}…</span>
            </div>
          </div>
          <button className="btn-signout" onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}