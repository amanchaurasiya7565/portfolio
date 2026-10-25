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
    messages: 0,
  });

  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [
          profileRes,
          projectsRes,
          skillsRes,
          educationRes,
          experienceRes,
          achievementsRes,
          certificationsRes,
          messagesRes,
        ] = await Promise.allSettled([
          api.get("/profile"),
          api.get("/projects"),
          api.get("/skills"),
          api.get("/education"),
          api.get("/experience"),
          api.get("/achievements"),
          api.get("/certifications"),
          api.get("/contact/messages"),
        ]);

        const profileData =
          profileRes.status === "fulfilled" ? profileRes.value.data : null;
        const projectsData =
          projectsRes.status === "fulfilled"
            ? projectsRes.value.data.projects || []
            : [];
        const skillsData =
          skillsRes.status === "fulfilled" ? skillsRes.value.data || [] : [];
        const educationData =
          educationRes.status === "fulfilled" ? educationRes.value.data || [] : [];
        const experienceData =
          experienceRes.status === "fulfilled" ? experienceRes.value.data || [] : [];
        const achievementsData =
          achievementsRes.status === "fulfilled" ? achievementsRes.value.data || [] : [];
        const certificationsData =
          certificationsRes.status === "fulfilled" ? certificationsRes.value.data || [] : [];
        const messagesData =
          messagesRes.status === "fulfilled" ? messagesRes.value.data || [] : [];

        setProfile(profileData);
        setProjects(projectsData);
        setStats({
          projects: projectsData.length,
          skills: skillsData.length,
          education: educationData.length,
          experience: experienceData.length,
          achievements: achievementsData.length,
          certifications: certificationsData.length,
          messages: messagesData.length,
        });
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
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      glow: "rgba(59, 130, 246, 0.2)",
    },
    {
      label: "Skills",
      value: stats.skills,
      icon: "⚡",
      link: "/admin/skills",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      glow: "rgba(139, 92, 246, 0.2)",
    },
    {
      label: "Education",
      value: stats.education,
      icon: "🎓",
      link: "/admin/education",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      glow: "rgba(6, 182, 212, 0.2)",
    },
    {
      label: "Experience",
      value: stats.experience,
      icon: "💻",
      link: "/admin/experience",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      glow: "rgba(16, 185, 129, 0.2)",
    },
    {
      label: "Certifications",
      value: stats.certifications,
      icon: "📜",
      link: "/admin/certifications",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      glow: "rgba(245, 158, 11, 0.2)",
    },
    {
      label: "Contact Inquiries",
      value: stats.messages,
      icon: "✉️",
      link: "/admin/dashboard",
      gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
      glow: "rgba(236, 72, 153, 0.2)",
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header with Quick Navigation */}
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Control Center</p>
          <h1>Overview Dashboard</h1>
          <p>
            Welcome back, {profile?.name || "Admin"}! Here is the latest status of your portfolio.
          </p>
        </div>

        <div className="header-action-group">
          <Link to="/" target="_blank" className="admin-secondary-button">
            <span>Live Portfolio</span>
            <span>↗</span>
          </Link>
          <Link to="/admin/projects" className="admin-primary-button">
            <span>+ Add Project</span>
          </Link>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="admin-hero-summary-card card-3d">
        <div className="summary-left">
          {profile?.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="summary-avatar"
            />
          ) : (
            <div className="summary-avatar-placeholder">👤</div>
          )}
          <div className="summary-details">
            <div className="summary-name-row">
              <h2>{profile?.name || "Portfolio Admin"}</h2>
              <span className="summary-status-badge">Active</span>
            </div>
            <p className="summary-headline">
              {profile?.headline || "Software Engineer & Builder"}
            </p>
            <div className="summary-meta-pills">
              <span>📍 {profile?.location || "Not set"}</span>
              <span>✉️ {profile?.email || "Not set"}</span>
              <span>💬 WhatsApp: {profile?.whatsapp || profile?.phone || "Configured"}</span>
            </div>
          </div>
        </div>

        <div className="summary-right">
          <Link to="/admin/profile" className="admin-primary-button edit-profile-btn">
            Edit Profile Settings →
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <section className="admin-stats-grid">
        {statCards.map((card) => (
          <Link
            to={card.link}
            className="admin-stat-card card-3d"
            key={card.label}
            style={{ "--stat-glow": card.glow }}
          >
            <div
              className="admin-stat-icon-wrap"
              style={{ background: card.gradient }}
            >
              <span className="admin-stat-emoji">{card.icon}</span>
            </div>

            <div className="admin-stat-info">
              <span className="admin-stat-label">{card.label}</span>
              <strong className="admin-stat-count">
                {loading ? "..." : card.value}
              </strong>
            </div>

            <span className="stat-card-arrow">→</span>
          </Link>
        ))}
      </section>

      {/* Two Column Section: Quick Actions & Featured Projects */}
      <section className="admin-dashboard-grid">
        {/* Quick Management Shortcuts */}
        <div className="admin-panel card-3d">
          <div className="admin-panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Direct shortcuts to update your portfolio sections.</p>
            </div>
          </div>

          <div className="quick-actions-grid">
            <Link to="/admin/profile" className="quick-action-tile">
              <span className="tile-icon">👤</span>
              <div className="tile-text">
                <strong>Profile & Bio</strong>
                <small>Avatar, headline, links</small>
              </div>
            </Link>

            <Link to="/admin/projects" className="quick-action-tile">
              <span className="tile-icon">💼</span>
              <div className="tile-text">
                <strong>Projects</strong>
                <small>Add or edit showcase</small>
              </div>
            </Link>

            <Link to="/admin/skills" className="quick-action-tile">
              <span className="tile-icon">⚡</span>
              <div className="tile-text">
                <strong>Skills Studio</strong>
                <small>Proficiencies & tools</small>
              </div>
            </Link>

            <Link to="/admin/education" className="quick-action-tile">
              <span className="tile-icon">🎓</span>
              <div className="tile-text">
                <strong>Education</strong>
                <small>Degrees & milestones</small>
              </div>
            </Link>

            <Link to="/admin/experience" className="quick-action-tile">
              <span className="tile-icon">💻</span>
              <div className="tile-text">
                <strong>Experience</strong>
                <small>Roles & internships</small>
              </div>
            </Link>

            <Link to="/admin/certifications" className="quick-action-tile">
              <span className="tile-icon">📜</span>
              <div className="tile-text">
                <strong>Certifications</strong>
                <small>Licenses & credentials</small>
              </div>
            </Link>
          </div>
        </div>

        {/* Featured Projects Highlight */}
        <div className="admin-panel card-3d">
          <div className="admin-panel-header">
            <div>
              <h3>Featured Projects</h3>
              <p>Top projects prioritized on your public portfolio.</p>
            </div>
            <Link to="/admin/projects" className="panel-header-link">
              View All ({projects.length}) →
            </Link>
          </div>

          {projects.filter((p) => p.featured).length === 0 ? (
            <div className="admin-empty-state">
              <span className="empty-icon">📁</span>
              <p>No featured projects yet.</p>
              <small>Mark projects as "Featured" to highlight them here.</small>
              <Link to="/admin/projects" className="empty-action-btn">
                Manage Projects
              </Link>
            </div>
          ) : (
            <div className="admin-project-list">
              {projects
                .filter((p) => p.featured)
                .slice(0, 4)
                .map((project) => (
                  <div className="admin-project-row" key={project._id}>
                    <div className="project-row-main">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="project-row-thumb"
                        />
                      ) : (
                        <div className="project-row-thumb-placeholder">💻</div>
                      )}
                      <div>
                        <strong>{project.title}</strong>
                        <div className="project-row-tech">
                          {project.technologies?.slice(0, 3).map((t) => (
                            <span key={t} className="tech-badge">
                              {t}
                            </span>
                          ))}
                          {project.technologies?.length > 3 && (
                            <span className="tech-badge">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link to="/admin/projects" className="row-edit-btn">
                      Edit
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}