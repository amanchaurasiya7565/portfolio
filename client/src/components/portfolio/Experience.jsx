export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="experience-section">
      <div className="section-container">
        <p className="section-label">EXPERIENCE</p>

        <h2 className="section-title">
          Where I've <span className="cursive-accent">worked & contributed</span>
        </h2>

        <div className="timeline-grid">
          {experience.map((item) => (
            <div className="timeline-item card-3d" key={item._id}>
              <div className="timeline-header">
                <span className="timeline-period">
                  {item.startDate} — {item.current ? "Present" : item.endDate}
                </span>
                {item.current && (
                  <span className="timeline-badge current-badge">
                    Active
                  </span>
                )}
              </div>

              <h3>{item.role}</h3>

              <strong className="timeline-institution">{item.company}</strong>

              {item.location && (
                <p className="timeline-location">📍 {item.location}</p>
              )}

              {item.description && (
                <p className="timeline-description">{item.description}</p>
              )}

              {item.technologies?.length > 0 && (
                <div className="technologies">
                  {item.technologies.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}