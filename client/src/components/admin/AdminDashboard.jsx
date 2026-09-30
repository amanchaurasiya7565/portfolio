import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    education: 0,
    experience: 0,
    achievements: 0,
    certifications: 0,
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          projectsRes,
          skillsRes,
          educationRes,
          experienceRes,
          achievementsRes,
          certificationsRes,
        ] = await Promise.all([
          api.get("/projects"),
          api.get("/skills"),
          api.get("/education"),
          api.get("/experience"),
          api.get("/achievements"),
          api.get("/certifications"),
        ]);

        setStats({
          projects: (projectsRes.data.projects || []).length,
          skills: skillsRes.data.length,
          education: educationRes.data.length,
          experience: experienceRes.data.length,
          achievements: achievementsRes.data.length,
          certifications: certificationsRes.data.length,
        });

        setProjects(projectsRes.data.projects || []);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statCards = [
    {
      label: "Projects",
      value: stats.projects,
      icon: "💼",
      link: "/admin/projects",
    },
    {
      label: "Skills",
      value: stats.skills,
      icon: "⚡",
      link: "/admin/skills",
    },
    {
      label: "Education",
      value: stats.education,
      icon: "🎓",
      link: "/admin/education",
    },
    {
      label: "Experience",
      value: stats.experience,
      icon: "💻",
      link: "/admin/experience",
    },
    {
      label: "Achievements",
      value: stats.achievements,
      icon: "🏆",
      link: "/admin/achievements",
    },
    {
      label: "Certifications",
      value: stats.certifications,
      icon: "📜",
      link: "/admin/certifications",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Admin Panel</p>
          <h1>Dashboard</h1>
          <p>
            Manage your portfolio content from one place.
          </p>
        </div>

        <Link to="/admin/projects" className="admin-primary-button">
          + Add Project
        </Link>
      </div>

      <section className="admin-stats-grid">
        {statCards.map((card) => (
          <Link
            to={card.link}
            className="admin-stat-card"
            key={card.label}
          >
            <div className="admin-stat-icon">{card.icon}</div>

            <div>
              <span>{card.label}</span>
              <strong>{loading ? "—" : card.value}</strong>
            </div>
          </Link>
        ))}
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Jump directly to common portfolio tasks.</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/admin/profile">Edit Profile</Link>
            <Link to="/admin/projects">Manage Projects</Link>
            <Link to="/admin/skills">Manage Skills</Link>
            <Link to="/admin/education">Manage Education</Link>
            <Link to="/admin/experience">Manage Experience</Link>
            <Link to="/admin/certifications">
              Manage Certifications
            </Link>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Featured Projects</h2>
              <p>Projects currently highlighted on your portfolio.</p>
            </div>
          </div>

          {projects.filter((project) => project.featured).length === 0 ? (
            <div className="admin-empty-state">
              <span>📁</span>
              <p>No featured projects yet.</p>
              <Link to="/admin/projects">Add one</Link>
            </div>
          ) : (
            <div className="admin-project-list">
              {projects
                .filter((project) => project.featured)
                .slice(0, 5)
                .map((project) => (
                  <div className="admin-project-row" key={project._id}>
                    <div>
                      <strong>{project.title}</strong>

                      <small>
                        {project.technologies?.join(" • ")}
                      </small>
                    </div>

                    <Link to="/admin/projects">Edit</Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}