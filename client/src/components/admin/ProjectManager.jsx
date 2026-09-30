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

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await api.get("/projects");

      setProjects(response.data.projects);
    } catch (error) {
      setError("Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        technologies: form.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        order: Number(form.order),
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post("/projects", payload);
      }

      setForm(emptyProject);
      setEditingId(null);

      await fetchProjects();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);

    setForm({
      title: project.title,
      description: project.description,
      image: project.image || "",
      technologies: project.technologies.join(", "),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured,
      order: project.order,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/projects/${id}`);

      setProjects((previous) =>
        previous.filter((project) => project._id !== id)
      );
    } catch (error) {
      setError("Unable to delete project.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProject);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Projects
        </h1>

        <p className="mt-2 text-gray-500">
          Add and manage the projects displayed on your portfolio.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Project form */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Project" : "Add Project"}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Project Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <ImageUploader
            value={form.image}
            onChange={(url) =>
              setForm((current) => ({
                ...current,
                image: url,
              }))
            }
          />
          <Input
            label="GitHub URL"
            name="githubUrl"
            value={form.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/..."
          />

          <Input
            label="Live Demo URL"
            name="liveUrl"
            value={form.liveUrl}
            onChange={handleChange}
            placeholder="https://..."
          />

          <Input
            label="Technologies"
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="React, JavaScript, CSS"
          />

          <Input
            label="Display Order"
            name="order"
            type="number"
            value={form.order}
            onChange={handleChange}
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Describe what you built..."
          />
        </div>

        <label className="mt-5 flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="h-4 w-4"
          />

          <span className="text-sm">
            Feature this project
          </span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : editingId
              ? "Update Project"
              : "Add Project"}
        </button>
      </form>

      {/* Project list */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">
          Your Projects
        </h2>

        {loading ? (
          <p className="text-gray-500">
            Loading projects...
          </p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500">
            No projects added yet.
          </p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="flex flex-col gap-4 rounded-xl border p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">
                      {project.title}
                    </h3>

                    {project.featured && (
                      <span className="rounded-full bg-gray-900 px-2 py-1 text-xs text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {project.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-gray-100 px-2 py-1 text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(project._id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
        {...props}
      />
    </div>
  );
}