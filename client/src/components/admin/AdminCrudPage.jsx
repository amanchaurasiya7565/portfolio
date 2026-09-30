import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminCrudPage({
  title,
  description,
  endpoint,
  fields,
}) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emptyForm = fields.reduce((result, field) => {
    result[field.name] = field.defaultValue ?? "";
    return result;
  }, {});

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(endpoint);
      setItems(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(emptyForm);
    loadItems();
  }, [endpoint]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = { ...form };

      fields.forEach((field) => {
        if (field.type === "number" && payload[field.name] !== "") {
          payload[field.name] = Number(payload[field.name]);
        }

        if (field.type === "array" && typeof payload[field.name] === "string") {
          payload[field.name] = payload[field.name]
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      });

      if (editingId) {
        await api.put(`${endpoint}/${editingId}`, payload);
        setSuccess("Item updated successfully.");
      } else {
        await api.post(endpoint, payload);
        setSuccess("Item added successfully.");
      }

      resetForm();
      await loadItems();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save item."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    const nextForm = {};

    fields.forEach((field) => {
      const value = item[field.name];

      if (field.type === "array") {
        nextForm[field.name] = Array.isArray(value)
          ? value.join(", ")
          : "";
      } else {
        nextForm[field.name] = value ?? "";
      }
    });

    setForm(nextForm);
    setEditingId(item._id);
    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`${endpoint}/${id}`);

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Item deleted successfully.");
      await loadItems();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete item."
      );
    }
  };

  return (
    <div className="admin-crud-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Content Management</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-alert admin-alert-success">
          {success}
        </div>
      )}

      <div className="admin-crud-layout">
        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>{editingId ? `Edit ${title}` : `Add ${title}`}</h2>
              <p>
                {editingId
                  ? "Update the selected entry."
                  : "Create a new portfolio entry."}
              </p>
            </div>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div
                className={`admin-form-group ${
                  field.fullWidth ? "full-width" : ""
                }`}
                key={field.name}
              >
                <label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span> *</span>}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={form[field.name] ?? ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    rows={field.rows || 5}
                    required={field.required}
                  />
                ) : field.type === "checkbox" ? (
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      id={field.name}
                      name={field.name}
                      checked={Boolean(form[field.name])}
                      onChange={handleChange}
                    />
                    <span>{field.checkboxLabel || field.label}</span>
                  </label>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type || "text"}
                    value={form[field.name] ?? ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                  />
                )}

                {field.help && (
                  <small className="admin-field-help">
                    {field.help}
                  </small>
                )}
              </div>
            ))}

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Add Entry"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Entries</h2>
              <p>{items.length} total entries</p>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading">
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className="admin-empty-state">
              <span>📭</span>
              <p>No entries yet.</p>
            </div>
          ) : (
            <div className="admin-crud-list">
              {items.map((item) => (
                <div className="admin-crud-item" key={item._id}>
                  <div className="admin-crud-item-content">
                    <strong>
                      {item.title ||
                        item.name ||
                        item.degree ||
                        item.role ||
                        "Untitled"}
                    </strong>

                    <small>
                      {item.institution ||
                        item.company ||
                        item.issuer ||
                        item.date ||
                        ""}
                    </small>
                  </div>

                  <div className="admin-crud-item-actions">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}