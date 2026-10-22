import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
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

  return (
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
  );
}
