import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? "?";

  return (
    <div className="profile-bg">
      <div className="grid-overlay" />
      <div className="profile-card">
        <div className="profile-card__header">
          <div className="avatar">
            {user?.photoURL
              ? <img src={user.photoURL} alt="avatar" />
              : <span>{initials}</span>
            }
          </div>
          <div className="profile-card__info">
            <h2>{user?.displayName || "Agent"}</h2>
            <p>{user?.email}</p>
            <span className="badge">
              {user?.providerData?.[0]?.providerId === "google.com" ? "Google Account" : "Email Account"}
            </span>
          </div>
        </div>

        <div className="profile-card__stats">
          <div className="stat">
            <span className="stat__label">Provider</span>
            <span className="stat__value">{user?.providerData?.[0]?.providerId}</span>
          </div>
          <div className="stat">
            <span className="stat__label">Account Created</span>
            <span className="stat__value">
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "—"}
            </span>
          </div>
          <div className="stat">
            <span className="stat__label">Last Sign-In</span>
            <span className="stat__value">
              {user?.metadata?.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                : "—"}
            </span>
          </div>
          <div className="stat">
            <span className="stat__label">UID</span>
            <span className="stat__value uid">{user?.uid?.slice(0, 12)}…</span>
          </div>
        </div>

        <div className="profile-card__actions">
          <button className="btn-dashboard" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}