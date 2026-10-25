import { useState, useEffect } from "react";

export default function Projects({ projects = [] }) {
  const [selectedProject, setSelectedProject] = useState(null);

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openProjectModal = (project) => {
    setSelectedProject(project);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="projects-section">
      <div className="section-container">
        <p className="section-label">PROJECTS</p>

        <h2 className="section-title">
          Things I've <span className="cursive-accent">built & engineered</span>
        </h2>

        <div className="projects-grid">
          {projects.map((project) => {
            const descriptionText = project.description || "";
            const isLongDescription = descriptionText.length > 115;
            const previewDescription = isLongDescription
              ? descriptionText.slice(0, 115).trim()
              : descriptionText;

            const visibleTechs = project.technologies?.slice(0, 3) || [];
            const remainingTechsCount = (project.technologies?.length || 0) - visibleTechs.length;

            return (
              <article
                className="project-card card-3d"
                key={project._id}
                onClick={() => openProjectModal(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openProjectModal(project);
                  }
                }}
                title="Click to view full project details"
              >
                {project.image && (
                  <div className="project-card-media">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                    />
                    <div className="project-media-gradient" />
                  </div>
                )}

                <div className="project-content">
                  <div className="project-card-header-bar">
                    {project.featured ? (
                      <span className="featured">★ Featured Project</span>
                    ) : (
                      <span className="project-category-tag">Engineering</span>
                    )}

                    <button
                      type="button"
                      className="project-view-details-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProjectModal(project);
                      }}
                      title="View all details"
                    >
                      <span>Full Details</span>
                      <span>↗</span>
                    </button>
                  </div>

                  <h3>{project.title}</h3>

                  {/* Partial details shown on card with ..more button */}
                  <div className="project-card-desc-container">
                    <p className="project-description-preview preserve-whitespace">
                      {previewDescription}
                      {isLongDescription && (
                        <>
                          <span className="ellipsis-dots">... </span>
                          <button
                            type="button"
                            className="project-inline-more-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              openProjectModal(project);
                            }}
                            aria-label={`Read more details about ${project.title}`}
                          >
                            ..more
                          </button>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Technologies preview */}
                  {project.technologies?.length > 0 && (
                    <div className="technologies">
                      {visibleTechs.map((tech) => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                      {remainingTechsCount > 0 && (
                        <button
                          type="button"
                          className="tech-tag tech-more-tag"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProjectModal(project);
                          }}
                          title={`Click to view all ${project.technologies.length} technologies`}
                        >
                          +{remainingTechsCount} more
                        </button>
                      )}
                    </div>
                  )}

                  <div className="project-links" onClick={(e) => e.stopPropagation()}>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link-btn"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          />
                        </svg>
                        <span>Code</span>
                        <span className="link-arrow">↗</span>
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link-btn primary"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
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
                        <span>Live Demo</span>
                        <span className="link-arrow">↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Full Details Modal Popup (shown on clicking ..more or card) */}
      {selectedProject && (
        <div
          className="project-popup-overlay"
          onClick={closeProjectModal}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProject.title} Full Details`}
        >
          <div
            className="project-popup-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              className="project-popup-close-btn"
              onClick={closeProjectModal}
              aria-label="Close project details"
              title="Close (Esc)"
            >
              ✕
            </button>

            {/* Media Header Banner */}
            <div className="project-popup-media">
              {selectedProject.image ? (
                <img
                  src={selectedProject.image}
                  alt={`${selectedProject.title} preview`}
                />
              ) : (
                <div className="project-popup-media-fallback">
                  <span className="fallback-icon">💻</span>
                  <span className="fallback-text">Engineering Project</span>
                </div>
              )}
            </div>

            {/* Detailed Content Body */}
            <div className="project-popup-content">
              <div className="project-popup-badge-row">
                {selectedProject.featured ? (
                  <span className="project-popup-featured-badge">
                    ★ Featured Project
                  </span>
                ) : (
                  <span className="project-popup-featured-badge">
                    Engineering Project
                  </span>
                )}
                <span className="project-popup-status-hint">
                  Complete Project Overview
                </span>
              </div>

              <h3 className="project-popup-title">{selectedProject.title}</h3>

              {/* Full Unabridged Description */}
              <div>
                <span className="project-popup-section-title">
                  Full Description & Architecture Highlights
                </span>
                <div className="project-popup-desc-box">
                  <p className="project-popup-desc-text preserve-whitespace">
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              {/* All Technologies */}
              {selectedProject.technologies?.length > 0 && (
                <div className="project-popup-tech-wrap">
                  <span className="project-popup-section-title">
                    All Technologies & Tools ({selectedProject.technologies.length})
                  </span>
                  <div className="project-popup-tech-tags">
                    {selectedProject.technologies.map((tech) => (
                      <span key={tech} className="project-popup-tech-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="project-popup-actions">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="project-popup-btn primary"
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
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    <span>Open Live Demo</span>
                    <span>↗</span>
                  </a>
                )}

                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="project-popup-btn secondary"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                    <span>View Source Code</span>
                    <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}