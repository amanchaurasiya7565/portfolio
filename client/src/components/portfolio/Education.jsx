export default function Education({ education }) {
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="education-section">
      <div className="section-container">
        <p className="section-label">EDUCATION</p>

        <h2 className="section-title">
          My academic <span className="cursive-accent">foundation & journey</span>
        </h2>

        <div className="timeline-grid">
          {education.map((item) => (
            <div className="timeline-item card-3d" key={item._id}>
              <div className="timeline-header">
                <span className="timeline-period">
                  {item.startYear} — {item.endYear || "Present"}
                </span>
                {item.grade && (
                  <span className="timeline-badge">
                    Grade: {item.grade}
                  </span>
                )}
              </div>

              <h3>{item.degree}</h3>

              <strong className="timeline-institution">{item.institution}</strong>

              {item.location && (
                <p className="timeline-location">📍 {item.location}</p>
              )}

              {item.description && (
                <p className="timeline-description">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}