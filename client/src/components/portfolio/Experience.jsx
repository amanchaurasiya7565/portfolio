export default function Experience({ experience }) {
  return (
    <section id="experience">
      <div className="section-container">
        <p className="section-label">EXPERIENCE</p>

        <h2>Where I've worked</h2>

        {experience.map((item) => (
          <div className="timeline-item" key={item._id}>
            <h3>{item.role}</h3>

            <strong>{item.company}</strong>

            <p>
              {item.startDate} —{" "}
              {item.current
                ? "Present"
                : item.endDate}
            </p>

            {item.location && (
              <p>{item.location}</p>
            )}

            <p>{item.description}</p>

            {item.technologies?.length > 0 && (
              <div className="technologies">
                {item.technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}