import { useEffect, useState } from "react";
import api from "../../services/api";
import ImageUploader from "../../components/admin/ImageUploader";
import ResumeUploader from "../../components/admin/resumeUploader";
export default function ProfileManager() {
  const [form, setForm] = useState({
    name: "",
    headline: "",
    bio: "",
    location: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    profileImage: "",
    resumeUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/profile");

      const profile = response.data;

      setForm({
        name: profile.name || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        location: profile.location || "",
        email: profile.email || "",
        phone: profile.phone || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        profileImage: profile.profileImage || "",
        resumeUrl: profile.resumeUrl || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (url) => {
    setForm((current) => ({
      ...current,
      profileImage: url,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.put("/profile", form);

      setSuccess("Profile updated successfully.");

      await loadProfile();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-auth-loading">
        <div className="admin-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="admin-crud-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            Content Management
          </p>

          <h1>Profile</h1>

          <p>
            Manage the information displayed in your
            portfolio hero and about section.
          </p>
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

      <section className="admin-panel profile-admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Personal Information</h2>

            <p>
              Update your public portfolio information.
            </p>
          </div>
        </div>

        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >
          {/* Name */}

          <div className="admin-form-group">
            <label htmlFor="name">
              Full Name <span>*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>

          {/* Headline */}

          <div className="admin-form-group">
            <label htmlFor="headline">
              Professional Headline <span>*</span>
            </label>

            <input
              id="headline"
              name="headline"
              type="text"
              value={form.headline}
              onChange={handleChange}
              placeholder="Software Engineering Intern | B.Tech CSE Student"
              required
            />
          </div>

          {/* Location */}

          <div className="admin-form-group">
            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="Delhi, India"
            />
          </div>

          {/* Email */}

          <div className="admin-form-group">
            <label htmlFor="email">
              Email <span>*</span>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Phone */}

          <div className="admin-form-group">
            <label htmlFor="phone">
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          {/* GitHub */}

          <div className="admin-form-group">
            <label htmlFor="github">
              GitHub URL
            </label>

            <input
              id="github"
              name="github"
              type="url"
              value={form.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>

          {/* LinkedIn */}

          <div className="admin-form-group">
            <label htmlFor="linkedin">
              LinkedIn URL
            </label>

            <input
              id="linkedin"
              name="linkedin"
              type="url"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Resume */}

          <div className="admin-form-group">
            <label htmlFor="resumeUrl">
              Resume URL
            </label>

            <input
              id="resumeUrl"
              name="resumeUrl"
              type="url"
              value={form.resumeUrl}
              onChange={handleChange}
              placeholder="https://..."
            />

            <small className="admin-field-help">
              URL to your public resume PDF.
            </small>
          </div>

          {/* Bio */}

          <div className="admin-form-group full-width">
            <label htmlFor="bio">
              Bio <span>*</span>
            </label>

            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Write a short professional introduction..."
              rows={7}
              required
            />

            <small className="admin-field-help">
              This can appear in your About section
              and portfolio introduction.
            </small>
          </div>

          {/* Profile Image */}
          
          <ImageUploader
            label="Profile Image"
            value={form.profileImage}
            onChange={(url) =>
              setForm((current) => ({
                ...current,
                profileImage: url,
              }))
            }
          />

            

          {/* Buttons */}

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={loadProfile}
              disabled={saving}
            >
              Reset
            </button>
          </div>

          <ResumeUploader
            value={form.resumeUrl}
            onChange={(url) =>
            setForm((current) => ({
            ...current,
            resumeUrl: url,
              }))
            }
          />
        </form>
      </section>
    </div>
  );
}
