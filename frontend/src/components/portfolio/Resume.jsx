import { useState, useEffect } from "react";

export default function Resume({ resumeUrl, profile }) {
  const [showModal, setShowModal] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Reliable PDF URLs: prioritize local /resume.pdf if remote backend is not available
  const staticPdfUrl = "/resume.pdf";
  const candidateName = profile?.name || "Aman Chaurasiya";

  const reliableResumeUrl =
    (profile?.resumeUrl && profile.resumeUrl.startsWith("http") && !profile.resumeUrl.includes("localhost"))
      ? profile.resumeUrl
      : (resumeUrl && resumeUrl.startsWith("http") && !resumeUrl.includes("localhost") ? resumeUrl : staticPdfUrl);

  const apiBase = import.meta.env.VITE_API_URL || "";
  const serverViewEndpoint = apiBase && !apiBase.includes("localhost") ? `${apiBase}/resume/view` : reliableResumeUrl;
  const serverDownloadEndpoint = apiBase && !apiBase.includes("localhost") ? `${apiBase}/resume/download` : reliableResumeUrl;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let createdUrl = null;

    if (showModal) {
      setLoadingPdf(true);

      const candidateSources = [
        reliableResumeUrl,
        staticPdfUrl,
        serverViewEndpoint,
      ].filter(Boolean);

      const fetchAndSetBlob = async () => {
        for (const source of candidateSources) {
          try {
            const response = await fetch(source);
            if (response.ok) {
              const blob = await response.blob();
              if (blob.size > 200) {
                const pdfBlob = new Blob([blob], { type: "application/pdf" });
                createdUrl = URL.createObjectURL(pdfBlob);
                setBlobUrl(createdUrl);
                setLoadingPdf(false);
                return;
              }
            }
          } catch (err) {
            console.warn("Could not load PDF via blob from:", source, err.message);
          }
        }

        // Direct fallback to reliable public PDF
        setBlobUrl(reliableResumeUrl);
        setLoadingPdf(false);
      };

      fetchAndSetBlob();
    } else {
      setBlobUrl((prev) => {
        if (prev && prev.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return null;
      });
    }

    return () => {
      if (createdUrl && createdUrl.startsWith("blob:")) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [showModal, reliableResumeUrl, staticPdfUrl, serverViewEndpoint]);

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
                  title="Open in-depth resume preview"
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
                  href={reliableResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button resume-btn tab-btn"
                  id="tab-resume-btn"
                  title="Open PDF directly in a new browser tab"
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
                  href={reliableResumeUrl}
                  download="Aman_Chaurasiya_Resume.pdf"
                  className="secondary-button resume-btn download-btn"
                  id="download-resume-btn"
                  title="Download offline copy"
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
                  href={reliableResumeUrl}
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
                  <span>Fullscreen</span>
                </a>

                <a
                  href={reliableResumeUrl}
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
              {loadingPdf ? (
                <div className="resume-loading-state">
                  <div className="spinner" />
                  <p>Loading document preview...</p>
                </div>
              ) : isMobile ? (
                /* Mobile optimized PDF preview experience */
                <div className="mobile-resume-preview-card">
                  <div className="mobile-resume-icon-badge">
                    <span className="pdf-doc-emoji">📄</span>
                  </div>
                  <h4>{candidateName}</h4>
                  <p className="mobile-resume-doc-name">Aman_Chaurasiya_Resume.pdf</p>
                  <span className="mobile-resume-tag">Official PDF Curriculum Vitae</span>

                  <div className="mobile-resume-button-stack">
                    <a
                      href={reliableResumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-button mobile-open-pdf-btn"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>Open Fullscreen in Browser</span>
                    </a>

                    <a
                      href={reliableResumeUrl}
                      download="Aman_Chaurasiya_Resume.pdf"
                      className="secondary-button mobile-download-pdf-btn"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
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
                      <span>Download PDF Copy</span>
                    </a>
                  </div>

                  {/* Fallback iframe viewer */}
                  <iframe
                    src={blobUrl || reliableResumeUrl}
                    title={`${candidateName} Resume Mobile Viewer`}
                    className="mobile-resume-iframe"
                  />
                </div>
              ) : blobUrl ? (
                <object
                  data={blobUrl}
                  type="application/pdf"
                  className="resume-pdf-frame"
                >
                  <iframe
                    src={blobUrl}
                    title={`${candidateName} Resume`}
                    className="resume-pdf-frame"
                  >
                    <div className="pdf-fallback-container">
                      <p>Unable to display PDF preview directly inside this browser view.</p>
                      <div className="pdf-fallback-actions">
                        <a
                          href={reliableResumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="primary-button"
                        >
                          Open Document Directly
                        </a>
                        <a
                          href={reliableResumeUrl}
                          className="secondary-button"
                          download="Aman_Chaurasiya_Resume.pdf"
                        >
                          Download PDF File
                        </a>
                      </div>
                    </div>
                  </iframe>
                </object>
              ) : (
                <div className="pdf-fallback-container">
                  <p>Document ready for inspection.</p>
                  <div className="pdf-fallback-actions">
                    <a
                      href={reliableResumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-button"
                    >
                      Open Fullscreen
                    </a>
                    <a
                      href={reliableResumeUrl}
                      className="secondary-button"
                      download="Aman_Chaurasiya_Resume.pdf"
                    >
                      Download Resume
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}