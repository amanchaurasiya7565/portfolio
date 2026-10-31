import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
  { name: "Messages", path: "/admin/dashboard#messages", icon: "✉️" },
  { name: "Profile", path: "/admin/profile", icon: "👤" },
  { name: "Projects", path: "/admin/projects", icon: "💼" },
  { name: "Skills", path: "/admin/skills", icon: "⚡" },
  { name: "Education", path: "/admin/education", icon: "🎓" },
  { name: "Experience", path: "/admin/experience", icon: "💻" },
  { name: "Achievements", path: "/admin/achievements", icon: "🏆" },
  { name: "Certifications", path: "/admin/certifications", icon: "📜" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("admin");
      navigate("/admin/login", { replace: true });
    }
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPassError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("New password and confirm password do not match.");
      return;
    }

    try {
      setPassLoading(true);
      setPassError("");
      setPassSuccess("");

      const res = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setPassSuccess(res.data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassSuccess("");
      }, 2000);
    } catch (err) {
      setPassError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <span className="brand-badge">PRO</span>
            <div className="brand-text">
              <h2>Portfolio CMS</h2>
              <p>Admin Workspace</p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="admin-theme-btn"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            onClick={() => {
              setPassError("");
              setPassSuccess("");
              setShowPasswordModal(true);
            }}
            className="admin-logout-btn"
            style={{ marginBottom: "8px", background: "rgba(99, 102, 241, 0.12)", color: "var(--accent-light, #818cf8)" }}
          >
            <span>🔑 Reset Password</span>
          </button>

          <Link to="/" target="_blank" className="admin-view-site-link">
            <span>🌐 View Live Site</span>
            <span>↗</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-btn"
          >
            <span>🚪 Logout</span>
          </button>
        </div>
      </aside>

      {showPasswordModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            style={{
              background: "var(--bg-secondary, #12151e)",
              border: "1px solid var(--border-card, #27272a)",
              borderRadius: "16px",
              padding: "28px",
              width: "100%",
              maxWidth: "420px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ margin: 0, fontSize: "19px", color: "var(--text-primary)" }}>🔑 Change Password</h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "20px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            {passError && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.3)", fontSize: "13px", marginBottom: "14px" }}>
                {passError}
              </div>
            )}

            {passSuccess && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", border: "1px solid rgba(34, 197, 94, 0.3)", fontSize: "13px", marginBottom: "14px" }}>
                {passSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-subtle, rgba(255,255,255,0.1))",
                    background: "var(--input-bg, rgba(255,255,255,0.05))",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  placeholder="Enter current password"
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-subtle, rgba(255,255,255,0.1))",
                    background: "var(--input-bg, rgba(255,255,255,0.05))",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  placeholder="Enter new password"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-secondary)" }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-subtle, rgba(255,255,255,0.1))",
                    background: "var(--input-bg, rgba(255,255,255,0.05))",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  placeholder="Re-enter new password"
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passLoading}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: "10px",
                    background: "var(--accent, #6366f1)",
                    border: "none",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {passLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
