import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    name: "Profile",
    path: "/admin/profile",
  },
  {
    name: "Projects",
    path: "/admin/projects",
  },
  {
    name: "Skills",
    path: "/admin/skills",
  },
  {
    name: "Education",
    path: "/admin/education",
  },
  {
    name: "Experience",
    path: "/admin/experience",
  },
  {
    name: "Achievements",
    path: "/admin/achievements",
  },
  {
    name: "Certifications",
    path: "/admin/certifications",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("admin");

      navigate("/admin/login", {
        replace: true,
      });
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-950 text-white p-5">
      <div className="mb-8">
        <h1 className="text-xl font-bold">
          Portfolio CMS
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Admin Panel
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-white text-gray-900"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-8 w-full rounded-lg border border-gray-700 px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-800"
      >
        Logout
      </button>
    </aside>
  );
}

