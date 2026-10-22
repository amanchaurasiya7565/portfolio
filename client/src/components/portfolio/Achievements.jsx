import { useState } from "react";

export default function Achievements({ achievements = [] }) {
  const [activeAchievement, setActiveAchievement] = useState(null);

  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <>
      <section id="achievements" className="achievements-section">
        <div className="section-container">
          <p className="section-label">MILESTONES & HONORS</p>

          <h2 className="section-title">
            Recognitions & <span className="cursive-accent">Key Milestones</span>
          </h2>

          <p className="section-subtitle">
            Notable awards, competitive programming milestones, and documented technical achievements.
          </p>

          <div className="achievements-grid">
            {achievements.map((item) => (
              <div className="achievement-card card-3d" key={item._id}>
                {/* Visual Banner / Trophy Image */}
                {item.image ? (
                  <div
                    className="achievement-card-media"
                    onClick={() => setActiveAchievement(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActiveAchievement(item)}
                    title="Click to view image in fullscreen"
                  >
                    <img
                      src={item.image}
                      alt={`${item.title} Trophy / Certificate`}
                      loading="lazy"
                    />
                    <div className="achievement-media-overlay">
                      <span className="achievement-preview-badge">
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
                        View Proof
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="achievement-card-media achievement-fallback-media">
                    <div className="achievement-fallback-graphic">
                      <span className="trophy-icon-large">🏆</span>
                      <span className="trophy-watermark">ACCOMPLISHMENT</span>
                    </div>
                  </div>
                )}

                {/* Achievement Body */}
                <div className="achievement-card-content">
                  <div className="achievement-meta-row">
                    {item.date && (
                      <span className="achievement-date-badge">
                        🏅 {item.date}
                      </span>
                    )}
                  </div>

                  <h3 className="achievement-title">{item.title}</h3>

                  {item.description && (
                    <p className="achievement-description">{item.description}</p>
                  )}

                  <div className="achievement-actions-row">
                    {item.image && (
                      <button
                        type="button"
                        onClick={() => setActiveAchievement(item)}
                        className="achievement-btn preview-btn"
                      >
                        🔍 Preview Image
                      </button>
                    )}

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="achievement-btn proof-link-btn"
                      >
                        View Link / Proof ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievement Lightbox Modal */}
      {activeAchievement && (
        <div
          className="cert-lightbox-backdrop"
          onClick={() => setActiveAchievement(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeAchievement.title} Preview`}
        >
          <div
            className="cert-lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cert-lightbox-header">
              <div className="lightbox-title-wrap">
                <h4>{activeAchievement.title}</h4>
                {activeAchievement.date && <p>Achieved: {activeAchievement.date}</p>}
              </div>

              <div className="lightbox-actions">
                {activeAchievement.link && (
                  <a
                    href={activeAchievement.link}
                    target="_blank"
                    rel="noreferrer"
                    className="lightbox-action-link"
                  >
                    Related Link ↗
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setActiveAchievement(null)}
                  className="lightbox-close-btn"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="cert-lightbox-body">
              <img
                src={activeAchievement.image}
                alt={`${activeAchievement.title} Proof`}
                className="cert-full-image"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}