import { useEffect, useState } from "react";
import api from "../../services/api";

const CATEGORIES = [
  "Programming",
  "Frontend",
  "Backend",
  "Database",
  "Cloud & DevOps",
  "Tools & Systems",
  "Core Concepts",
];

const initialForm = {
  category: "Programming",
  name: "",
  level: 80,
  order: 0,
};

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/skills");
      setSkills(data || []);
    } catch (err) {
      setError("Failed to load skills from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "level" || name === "order" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Please provide a skill name.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/skills/${editingId}`, form);
        setSuccess(`Skill "${form.name}" updated successfully!`);
      } else {
        await api.post("/skills", form);
        setSuccess(`Skill "${form.name}" added successfully!`);
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchSkills();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save skill. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setError("");
    setSuccess("");

    setForm({
      category: skill.category,
      name: skill.name,
      level: skill.level ?? 75,
      order: skill.order ?? 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete the skill "${name || "this skill"}"?`)) return;

    try {
      await api.delete(`/skills/${id}`);
      setSuccess("Skill removed successfully.");
      setSkills((prev) => prev.filter((s) => s._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
      }
    } catch (err) {
      setError("Failed to delete skill.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setSuccess("");
  };

  // Group skills by category
  const categoriesPresent = Array.from(new Set(skills.map((s) => s.category)));
  const filterOptions = ["All", ...CATEGORIES];

  const filteredSkills =
    selectedFilter === "All"
      ? skills
      : skills.filter((s) => s.category === selectedFilter);

  const avgProficiency =
    skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + (s.level || 0), 0) / skills.length)
      : 0;

  return (
    <div className="admin-skills-manager">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Technical Competencies</p>
          <h1>Skills Studio</h1>
          <p>
            Configure and organize your proficiencies, languages, frameworks, and tools.
          </p>
        </div>

        <div className="skills-summary-pill-group">
          <div className="summary-pill">
            <span className="pill-val">{skills.length}</span>
            <span className="pill-lbl">Total Skills</span>
          </div>
          <div className="summary-pill">
            <span className="pill-val">{categoriesPresent.length}</span>
            <span className="pill-lbl">Categories</span>
          </div>
          <div className="summary-pill">
            <span className="pill-val">{avgProficiency}%</span>
            <span className="pill-lbl">Avg Level</span>
          </div>
        </div>
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

      {/* Skills Form Card */}
      <section className="admin-card card-3d">
        <div className="admin-card-header">
          <h2>{editingId ? "Update Skill" : "Add New Skill"}</h2>
          <p>
            {editingId
              ? "Change the skill name, category, or proficiency rating."
              : "Enter a skill name, domain category, and proficiency level."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {/* Skill Name */}
          <div className="admin-form-group">
            <label htmlFor="skill-name">
              Skill / Tool Name <span>*</span>
            </label>
            <input
              id="skill-name"
              name="name"
              type="text"
              required
              placeholder="e.g. React, Node.js, Python, Docker"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="admin-form-group">
            <label htmlFor="skill-category">
              Domain Category <span>*</span>
            </label>
            <select
              id="skill-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="admin-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Proficiency Level with Slider & Animated Bar */}
          <div className="admin-form-group full-width">
            <div className="level-label-row">
              <label htmlFor="skill-level">
                Proficiency Level <span>*</span>
              </label>
              <span className="level-badge">{form.level}%</span>
            </div>

            <div className="slider-control-row">
              <input
                id="skill-level"
                name="level"
                type="range"
                min="10"
                max="100"
                step="5"
                value={form.level}
                onChange={handleChange}
                className="admin-range-slider"
              />
              <input
                type="number"
                name="level"
                min="0"
                max="100"
                value={form.level}
                onChange={handleChange}
                className="admin-number-mini"
              />
            </div>

            {/* Live Progress Preview */}
            <div className="level-preview-bar">
              <div
                className="level-preview-fill"
                style={{ width: `${form.level}%` }}
              />
            </div>
          </div>

          {/* Display Order */}
          <div className="admin-form-group">
            <label htmlFor="skill-order">Display Order</label>
            <input
              id="skill-order"
              name="order"
              type="number"
              placeholder="0 (Lower numbers appear first)"
              value={form.order}
              onChange={handleChange}
            />
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
                ? "Update Skill"
                : "+ Add Skill"}
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

      {/* Skills List & Filter Section */}
      <section className="admin-skills-list-section">
        <div className="list-section-header">
          <div>
            <h2>Configured Skills ({filteredSkills.length})</h2>
            <p>Review and manage your skills categorized by domain.</p>
          </div>

          {/* Filter Pills */}
          <div className="category-filter-bar">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedFilter(opt)}
                className={`filter-pill ${
                  selectedFilter === opt ? "active" : ""
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="admin-page-state">
            <div className="spinner" />
            <p>Loading your skills...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="admin-empty-state card-3d">
            <span className="empty-icon">⚡</span>
            <h3>No Skills in this Category</h3>
            <p>Add a new skill using the form above to expand your profile.</p>
          </div>
        ) : (
          <div className="admin-skills-cards-grid">
            {filteredSkills.map((skill) => (
              <div key={skill._id} className="skill-item-card card-3d">
                <div className="skill-card-top">
                  <div>
                    <span className="skill-category-tag">
                      {skill.category}
                    </span>
                    <h3 className="skill-card-name">{skill.name}</h3>
                  </div>

                  <span className="skill-level-pill">{skill.level}%</span>
                </div>

                {/* Progress bar */}
                <div className="skill-card-track">
                  <div
                    className="skill-card-fill"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                <div className="skill-card-footer">
                  <span className="skill-order-text">Order: #{skill.order ?? 0}</span>

                  <div className="skill-action-btns">
                    <button
                      type="button"
                      onClick={() => handleEdit(skill)}
                      className="skill-mini-btn edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(skill._id, skill.name)}
                      className="skill-mini-btn delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}