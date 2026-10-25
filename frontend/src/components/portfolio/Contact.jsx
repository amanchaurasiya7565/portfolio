import { useState } from "react";
import api from "../../services/api";
import { getWhatsappUrl } from "../../utils/whatsapp";

export default function Contact({ profile }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const rawWhatsapp = profile?.whatsapp || profile?.phone;
  const whatsappUrl = getWhatsappUrl(rawWhatsapp) || "https://wa.me/917275523611";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      const response = await api.post("/contact", formData);
      setFeedback({
        type: "success",
        message:
          response.data?.message ||
          "Thank you! Your message has been sent successfully.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to send your message. Please try again or reach out directly via email or WhatsApp.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <p className="section-label">GET IN TOUCH</p>
        <h2 className="section-title">
          Let's build something <span className="cursive-accent">extraordinary</span> together.
        </h2>
        <p className="contact-subtitle">
          Have a question, an opportunity, or a project in mind? Send me a message or connect directly.
        </p>

        <div className="contact-layout-grid">
          {/* Left Column: Direct Info & WhatsApp Card */}
          <div className="contact-info-card card-3d">
            <div className="contact-info-header">
              <h3>Direct Channels</h3>
              <p>Feel free to reach out via WhatsApp or email for quick communication.</p>
            </div>

            <div className="contact-methods">
              {/* WhatsApp Item */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel-item whatsapp-channel"
                aria-label="Chat on WhatsApp"
              >
                <div className="channel-icon-wrapper whatsapp-bg">
                  <svg
                    className="channel-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div className="channel-text">
                  <span className="channel-label">WhatsApp</span>
                  <strong className="channel-value">Chat on WhatsApp</strong>
                  <span className="channel-hint">Quick direct response</span>
                </div>
                <span className="channel-arrow">→</span>
              </a>

              {/* Direct Email Item */}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="contact-channel-item email-channel"
                  aria-label="Send direct email"
                >
                  <div className="channel-icon-wrapper email-bg">
                    <svg
                      className="channel-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="channel-text">
                    <span className="channel-label">Email</span>
                    <strong className="channel-value">{profile.email}</strong>
                    <span className="channel-hint">Write anytime</span>
                  </div>
                  <span className="channel-arrow">→</span>
                </a>
              )}

              {/* Location item */}
              {profile?.location && (
                <div className="contact-channel-item static-channel">
                  <div className="channel-icon-wrapper location-bg">
                    <svg
                      className="channel-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="channel-text">
                    <span className="channel-label">Location</span>
                    <strong className="channel-value">{profile.location}</strong>
                    <span className="channel-hint">Available for remote & on-site</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="contact-form-card card-3d">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-heading">
                <h3>Send a Message</h3>
                <p>Fill out the form below and I'll receive it directly in my inbox.</p>
              </div>

              {feedback && (
                <div
                  className={`form-alert ${
                    feedback.type === "success" ? "alert-success" : "alert-error"
                  }`}
                  role="alert"
                >
                  <span className="alert-icon">
                    {feedback.type === "success" ? "✓" : "⚠"}
                  </span>
                  <span>{feedback.message}</span>
                </div>
              )}

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="contact-name">
                    Your Name <span className="req">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={submitting}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">
                    Your Email <span className="req">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="e.g. Project Inquiry / Collaboration"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={submitting}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">
                  Message <span className="req">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell me about your project, idea, or opportunity..."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={submitting}
                  className="form-input form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="contact-submit-btn"
              >
                {submitting ? (
                  <>
                    <span className="btn-spinner" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <span className="btn-arrow">↗</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}