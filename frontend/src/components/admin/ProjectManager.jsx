import { useEffect, useState } from "react";
import api from "../../services/api";
import ImageUploader from "../../components/admin/ImageUploader";

const emptyProject = {
  title: "",
  description: "",
  image: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  featured: false,
  order: 0,
};

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/projects");
      setProjects(response.data.projects || []);
    } catch (err) {
      setError("Unable to load projects. Ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      const parsedTech = form.technologies
        ? (Array.isArray(form.technologies)
            ? form.technologies
            : form.technologies.split(",")
          )
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

      const payload = {
        ...form,
        technologies: parsedTech,
        order: Number(form.order) || 0,
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
        setSuccess(`Project "${form.title}" updated successfully!`);
      } else {
        await api.post("/projects", payload);
        setSuccess(`Project "${form.title}" created successfully!`);
      }

      setForm(emptyProject);
      setEditingId(null);
      await fetchProjects();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save project. Please check required fields."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setError("");
    setSuccess("");

    setForm({
      title: project.title,
      description: project.description,
      image: project.image || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: Boolean(project.featured),
      order: project.order ?? 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the project "${title || "this project"}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/projects/${id}`);
      setSuccess("Project deleted successfully.");
      setProjects((prev) => prev.filter((p) => p._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyProject);
      }
    } catch (err) {
      setError("Unable to delete project.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProject);
    setError("");
    setSuccess("");
  };

  // Preview array of technologies
  const techPreview = form.technologies
    ? (typeof form.technologies === "string"
        ? form.technologies.split(",")
        : form.technologies
      )
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="admin-project-manager">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Portfolio Showcase</p>
          <h1>Project Manager</h1>
          <p>
            Create, update, and organize your work portfolio, images, links, and technologies.
          </p>
        </div>

        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="admin-secondary-button"
          >
            Cancel Editing
          </button>
        )}
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          <span className="alert-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="admin-alert admin-alert-success">
          <span className="alert-icon">✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* Project Form Card */}
      <section className="admin-card card-3d">
        <div className="admin-card-header">
          <h2>{editingId ? "Edit Project" : "Add New Project"}</h2>
          <p>
            {editingId
              ? "Update project attributes, description, or media."
              : "Fill in the project details below to add it to your portfolio."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {/* Title */}
          <div className="admin-form-group">
            <label htmlFor="project-title">
              Project Title <span>*</span>
            </label>
            <input
              id="project-title"
              name="title"
              type="text"
              required
              placeholder="e.g. AI-Powered Code Assistant"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* Display Order */}
          <div className="admin-form-group">
            <label htmlFor="project-order">Display Order</label>
            <input
              id="project-order"
              name="order"
              type="number"
              placeholder="0 (Lower numbers display first)"
              value={form.order}
              onChange={handleChange}
            />
          </div>

          {/* GitHub URL */}
          <div className="admin-form-group">
            <label htmlFor="project-github">GitHub Repository URL</label>
            <input
              id="project-github"
              name="githubUrl"
              type="url"
              placeholder="https://github.com/username/project"
              value={form.githubUrl}
              onChange={handleChange}
            />
          </div>

          {/* Live Demo URL */}
          <div className="admin-form-group">
            <label htmlFor="project-live">Live Demo / Production URL</label>
            <input
              id="project-live"
              name="liveUrl"
              type="url"
              placeholder="https://myproject.vercel.app"
              value={form.liveUrl}
              onChange={handleChange}
            />
          </div>

          {/* Technologies */}
          <div className="admin-form-group full-width">
            <label htmlFor="project-tech">
              Technologies / Stack <span>*</span>
            </label>
            <input
              id="project-tech"
              name="technologies"
              type="text"
              required
              placeholder="e.g. React, Node.js, MongoDB, TailwindCSS, Express"
              value={form.technologies}
              onChange={handleChange}
            />
            <small className="admin-field-help">
              Separate each technology with a comma.
            </small>

            {/* Live Tag Preview */}
            {techPreview.length > 0 && (
              <div className="tech-preview-row">
                {techPreview.map((t, idx) => (
                  <span key={idx} className="tech-preview-pill">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="admin-form-group full-width">
            <label htmlFor="project-desc">
              Project Description <span>*</span>
            </label>
            <textarea
              id="project-desc"
              name="description"
              required
              rows={4}
              placeholder="Describe the problem solved, architecture, and key technical highlights..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Image Uploader */}
          <div className="admin-form-group full-width">
            <label className="admin-field-label">Project Cover Image</label>
            <ImageUploader
              label="Upload Screenshot or Thumbnail"
              value={form.image}
              onChange={(url) =>
                setForm((prev) => ({ ...prev, image: url }))
              }
            />
          </div>

          {/* Featured Toggle */}
          <div className="admin-form-group full-width">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="admin-checkbox-input"
              />
              <span className="checkbox-custom-text">
                ⭐ Feature this project on the dashboard and highlight it in your portfolio
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="admin-form-actions full-width">
            <button
              type="submit"
              disabled={saving}
              className="admin-primary-button"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Project"
                : "+ Create Project"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="admin-secondary-button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Projects List Section */}
      <section className="admin-projects-list-section">
        <div className="list-section-header">
          <h2>All Projects ({projects.length})</h2>
          <p>Manage, preview, and organize your existing published projects.</p>
        </div>

        {loading ? (
          <div className="admin-page-state">
            <div className="spinner" />
            <p>Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="admin-empty-state card-3d">
            <span className="empty-icon">💼</span>
            <h3>No Projects Yet</h3>
            <p>Add your first project using the form above to start building your portfolio.</p>
          </div>
        ) : (
          <div className="admin-project-cards-grid">
            {projects.map((project) => (
              <div key={project._id} className="admin-item-card card-3d">
                <div className="item-card-media">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="item-card-img"
                    />
                  ) : (
                    <div className="item-card-placeholder">
                      <span>💻</span>
                    </div>
                  )}

                  {project.featured && (
                    <span className="item-featured-pill">⭐ Featured</span>
                  )}
                </div>

                <div className="item-card-body">
                  <div className="item-card-title-row">
                    <h3>{project.title}</h3>
                    <span className="item-order-badge">#{project.order ?? 0}</span>
                  </div>

                  <p className="item-card-desc">{project.description}</p>

                  <div className="item-card-tech-list">
                    {project.technologies?.map((tech, idx) => (
                      <span key={idx} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="item-card-links">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="item-link"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="item-link live"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>

                <div className="item-card-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    className="item-btn edit-btn"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project._id, project.title)}
                    className="item-btn delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}