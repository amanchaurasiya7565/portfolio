import { useState } from "react";

export default function Resume({ resumeUrl, profile }) {
  const [showModal, setShowModal] = useState(false);

  // If no resumeUrl is provided in props, check if profile has one
  const activeUrl = resumeUrl || profile?.resumeUrl;

  if (!activeUrl) {
    return null;
  }

  const candidateName = profile?.name || "Aman Chaurasiya";
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const viewEndpoint = `${apiBase}/resume/view`;
  const downloadEndpoint = `${apiBase}/resume/download`;

  return (
    <>
      <section id="resume" className="resume-section">
        <div className="section-container">
          <p className="section-label">CURRICULUM VITAE</p>

          <div className="resume-card card-3d">
            <div className="resume-content">
              <div className="resume-badge">
                <span className="badge-dot" /> Verified PDF Resume
              </div>

              <h2>
                Explore My <span className="cursive-accent">Experience & Qualifications</span>
              </h2>

              <p className="resume-description">
                Preview my complete professional background, technical competencies, projects, and education directly on screen, or save an offline copy.
              </p>

              <div className="resume-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="primary-button resume-btn view-btn"
                  id="preview-resume-btn"
                >
                  <svg
                    className="btn-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>Preview Resume</span>
                </button>

                <a
                  href={viewEndpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button resume-btn tab-btn"
                  id="tab-resume-btn"
                  title="Open PDF in a new browser tab"
                >
                  <svg
                    className="btn-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span>Open Fullscreen</span>
                </a>

                <a
                  href={downloadEndpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Aman_Chaurasiya_Resume.pdf"
                  className="secondary-button resume-btn download-btn"
                  id="download-resume-btn"
                >
                  <svg
                    className="btn-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download Resume</span>
                </a>
              </div>
            </div>

            <div className="resume-visual-preview" onClick={() => setShowModal(true)}>
              <div className="preview-paper">
                <div className="preview-line header-line" />
                <div className="preview-line sub-line" />
                <div className="preview-block" />
                <div className="preview-block short" />
                <div className="preview-line" />
                <div className="preview-line short" />
                <div className="preview-overlay">
                  <span className="preview-click-hint">Click to Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive In-Page Resume Modal Viewer */}
      {showModal && (
        <div className="resume-modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className="resume-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${candidateName}'s Resume`}
          >
            <div className="resume-modal-header">
              <div className="modal-title-group">
                <h3>{candidateName} — Resume</h3>
                <span className="modal-tag">Official Document</span>
              </div>

              <div className="resume-modal-actions">
                <a
                  href={viewEndpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-action-btn"
                  title="Open in new browser tab"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span>Open Fullscreen</span>
                </a>

                <a
                  href={downloadEndpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Aman_Chaurasiya_Resume.pdf"
                  className="modal-action-btn modal-download-btn"
                  title="Download copy"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="modal-close-btn"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="resume-modal-body">
              <object
                data={viewEndpoint}
                type="application/pdf"
                className="resume-pdf-frame"
              >
                <iframe
                  src={viewEndpoint}
                  title={`${candidateName} Resume`}
                  className="resume-pdf-frame"
                >
                  <div className="pdf-fallback-container">
                    <p>Unable to display PDF preview directly on this browser.</p>
                    <a
                      href={viewEndpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-button"
                    >
                      Open PDF in New Window
                    </a>
                  </div>
                </iframe>
              </object>
            </div>
          </div>
        </div>
      )}
    </>
  );
}