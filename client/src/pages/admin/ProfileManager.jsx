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
    whatsapp: "",
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
        whatsapp: profile.whatsapp || profile.phone || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        profileImage: profile.profileImage || "",
        resumeUrl: profile.resumeUrl || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load profile."
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
        err.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page-state">
        <div className="spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="admin-profile-manager">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Personal Information</p>
          <h1>Profile Settings</h1>
          <p>
            Manage your personal bio, headline, contact channels, avatar, and resume.
          </p>
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

      <section className="admin-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Full Name */}
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
              placeholder="Software Engineer | Full Stack Developer"
              required
            />
          </div>

          {/* Location */}
          <div className="admin-form-group">
            <label htmlFor="location">Location</label>
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
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 72755 23611"
            />
          </div>

          {/* WhatsApp Contact */}
          <div className="admin-form-group">
            <label htmlFor="whatsapp">
              WhatsApp Number / Username
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="text"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="7275523611, @username, or wa.me/username"
            />
            <small className="admin-field-help">
              Supports 10-digit phone, international numbers, @username handle, or direct WhatsApp link.
            </small>
          </div>

          {/* GitHub */}
          <div className="admin-form-group">
            <label htmlFor="github">GitHub Profile URL</label>
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
            <label htmlFor="linkedin">LinkedIn Profile URL</label>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Bio */}
          <div className="admin-form-group full-width">
            <label htmlFor="bio">
              Bio / About Me <span>*</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Write a short professional introduction..."
              rows={5}
              required
            />
            <small className="admin-field-help">
              Displayed in the Hero and About Me sections of your portfolio.
            </small>
          </div>

          {/* Media Section: Profile Image & Resume */}
          <div className="admin-media-grid full-width">
            <div className="media-box">
              <ImageUploader
                label="Profile Picture"
                value={form.profileImage}
                onChange={(url) =>
                  setForm((current) => ({
                    ...current,
                    profileImage: url,
                  }))
                }
              />
            </div>

            <div className="media-box">
              <ResumeUploader
                value={form.resumeUrl}
                onChange={(url) =>
                  setForm((current) => ({
                    ...current,
                    resumeUrl: url,
                  }))
                }
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="admin-form-actions full-width">
            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Profile"}
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
        </form>
      </section>
    </div>
  );
}
