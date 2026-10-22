import { useState } from "react";

export default function Certifications({ certifications = [] }) {
  const [activeCert, setActiveCert] = useState(null);

  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <>
      <section id="certifications" className="certifications-section">
        <div className="section-container">
          <p className="section-label">CERTIFICATIONS & CREDENTIALS</p>

          <h2 className="section-title">
            Validated Skills & <span className="cursive-accent">Certificates</span>
          </h2>

          <p className="section-subtitle">
            Industry-recognized credentials, specialized course completions, and certified technical milestones.
          </p>

          <div className="certifications-grid">
            {certifications.map((item) => (
              <div className="certification-card card-3d" key={item._id}>
                {/* Certificate Visual Banner */}
                {item.image ? (
                  <div
                    className="cert-card-media"
                    onClick={() => setActiveCert(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActiveCert(item)}
                    title="Click to preview certificate"
                  >
                    <img
                      src={item.image}
                      alt={`${item.name} Certificate`}
                      loading="lazy"
                    />
                    <div className="cert-media-overlay">
                      <span className="cert-preview-badge">
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        View Certificate
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="cert-card-media cert-fallback-media">
                    <div className="cert-fallback-graphic">
                      <span className="cert-icon-large">📜</span>
                      <span className="cert-watermark">CERTIFIED</span>
                    </div>
                  </div>
                )}

                {/* Certificate Information */}
                <div className="cert-card-content">
                  <div className="cert-meta-row">
                    {item.issuer && (
                      <span className="cert-issuer-badge">
                        🏢 {item.issuer}
                      </span>
                    )}
                    {item.issueDate && (
                      <span className="cert-date-badge">
                        📅 {item.issueDate}
                      </span>
                    )}
                  </div>

                  <h3 className="cert-title">{item.name}</h3>

                  {item.credentialId && (
                    <div className="cert-credential-id">
                      <span className="id-label">Credential ID:</span>
                      <code>{item.credentialId}</code>
                    </div>
                  )}

                  <div className="cert-actions-row">
                    {item.image && (
                      <button
                        type="button"
                        onClick={() => setActiveCert(item)}
                        className="cert-btn preview-btn"
                      >
                        🔍 Preview Image
                      </button>
                    )}

                    {item.credentialUrl && (
                      <a
                        href={item.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="cert-btn verify-link-btn"
                      >
                        Verify Credential ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Lightbox Modal */}
      {activeCert && (
        <div
          className="cert-lightbox-backdrop"
          onClick={() => setActiveCert(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeCert.name} Certificate Preview`}
        >
          <div
            className="cert-lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cert-lightbox-header">
              <div className="lightbox-title-wrap">
                <h4>{activeCert.name}</h4>
                <p>
                  {activeCert.issuer}
                  {activeCert.issueDate ? ` • ${activeCert.issueDate}` : ""}
                </p>
              </div>

              <div className="lightbox-actions">
                {activeCert.credentialUrl && (
                  <a
                    href={activeCert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="lightbox-action-link"
                  >
                    Verify ↗
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  className="lightbox-close-btn"
                  aria-label="Close certificate preview"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="cert-lightbox-body">
              <img
                src={activeCert.image}
                alt={`${activeCert.name} Full Certificate`}
                className="cert-full-image"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}